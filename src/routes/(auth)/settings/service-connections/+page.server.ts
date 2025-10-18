import { fail, type Actions } from "@sveltejs/kit";

import type { ServiceConnectionFormInput } from "$lib/server/service-connections/validation";
import { executeVerification, saveConnection } from "$lib/server/service-connections/mutations";
import {
  getServiceConnectionById,
  listServiceConnections,
  toServiceConnectionProfile,
} from "$lib/server/service-connections/repository";
import { runDiagnostics } from "$lib/server/service-connections/diagnostics-runner";
import { listDiagnosticScenarioResults } from "$lib/server/service-connections/diagnostics.repository";
import { dispatchNotification } from "$lib/server/notifications/dispatch";
import {
  getHealthSnapshots,
  recordHeartbeatOutcome,
} from "$lib/server/service-connections/health.repository";
import { evaluateHeartbeatAlerts } from "$lib/server/service-connections/alerts";
import {
  diagnosticScenarios,
  diagnosticTriggers,
  type DiagnosticScenario,
  type DiagnosticTrigger,
} from "$lib/types/service-connections";
import type { PageServerLoad } from "./$types";

type FormField =
  | "id"
  | "name"
  | "environment"
  | "serviceType"
  | "supabaseUrl"
  | "supabaseProjectRef"
  | "supabaseServiceRoleKey"
  | "supabaseAnonKey";

function readFormData(formData: FormData): ServiceConnectionFormInput {
  const getValue = (field: FormField) => {
    const value = formData.get(field);
    return typeof value === "string" ? value : "";
  };

  const payload: ServiceConnectionFormInput = {
    name: getValue("name"),
    environment: getValue("environment"),
    serviceType: getValue("serviceType"),
    supabaseUrl: getValue("supabaseUrl"),
    supabaseProjectRef: getValue("supabaseProjectRef"),
    supabaseServiceRoleKey: getValue("supabaseServiceRoleKey"),
    supabaseAnonKey: getValue("supabaseAnonKey"),
    activationRequested: false,
  };

  const id = formData.get("id");
  if (typeof id === "string" && id.length > 0) {
    payload.id = id;
  }

  const intent = formData.get("intent");
  payload.activationRequested = intent === "activate";

  return payload;
}

export const load: PageServerLoad = async ({ url }) => {
  const teamId = "team-demo-456";
  const connections = await listServiceConnections(teamId);
  const diagnostics = await listDiagnosticScenarioResults(teamId);
  let health = await getHealthSnapshots(teamId);

  const seedRequested = url.searchParams.has("seedHealth");
  const inTestMode = process.env.NODE_ENV === "test" || seedRequested;

  if (inTestMode) {
    const seededConnections = new Set(health.map((record) => record.serviceConnectionId));
    let seededAny = false;

    for (const connection of connections) {
      if (!seedRequested && seededConnections.has(connection.id)) {
        continue;
      }

      await recordHeartbeatOutcome({
        teamId,
        serviceConnectionId: connection.id,
        status: "pass",
        latencyMs: 180,
        occurredAt: new Date(Date.now() - 10 * 60 * 1000),
      });

      const degraded = await recordHeartbeatOutcome({
        teamId,
        serviceConnectionId: connection.id,
        status: "fail",
        latencyMs: null,
        errorCode: "AUTH_INVALID_SERVICE_KEY",
        occurredAt: new Date(Date.now() - 5 * 60 * 1000),
      });

      await evaluateHeartbeatAlerts({
        teamId,
        serviceConnectionId: connection.id,
        connectionName: connection.name,
        outcome: degraded,
        errorCode: "AUTH_INVALID_SERVICE_KEY",
      });

      const incident = await recordHeartbeatOutcome({
        teamId,
        serviceConnectionId: connection.id,
        status: "fail",
        latencyMs: null,
        errorCode: "AUTH_INVALID_SERVICE_KEY",
        occurredAt: new Date(),
      });

      await evaluateHeartbeatAlerts({
        teamId,
        serviceConnectionId: connection.id,
        connectionName: connection.name,
        outcome: incident,
        errorCode: "AUTH_INVALID_SERVICE_KEY",
      });

      seededAny = true;
    }

    if (seededAny) {
      health = await getHealthSnapshots(teamId);
    }
  }

  const connectionLookup = new Map(
    connections.map((connection) => [
      connection.id,
      connection.name || connection.supabaseProjectRef || connection.id,
    ])
  );

  return {
    teamId,
    connections: connections.map(toServiceConnectionProfile),
    diagnostics: diagnostics.map((record) => ({
      ...record,
      connectionName: connectionLookup.get(record.serviceConnectionId) ?? "Unknown connection",
    })),
    health: health.map((record) => ({
      ...record,
      lastHeartbeatAt: record.lastHeartbeatAt?.toISOString() ?? null,
    })),
  };
};

export const actions: Actions = {
  verify: async ({ request }) => {
    const formData = await request.formData();
    const payload = readFormData(formData);
    const teamId = "team-demo-456";

    const result = await executeVerification(payload, {
      teamId,
      existingId: payload.id,
    });

    if ("status" in result) {
      return result;
    }

    return {
      form: {
        kind: "verification" as const,
        status: result.result.ok ? "success" : "error",
        message: result.result.message,
        latencyMs: result.result.latencyMs,
        activationPermitted: result.activationPermitted,
        requiresVerification: result.requiresVerification,
        blockingReasons: result.blockingReasons,
        values: result.values,
      },
    };
  },
  save: async ({ request }) => {
    const formData = await request.formData();
    const payload = readFormData(formData);
    payload.activationRequested = true;

    const teamId = "team-demo-456";

    const result = await saveConnection(payload, {
      teamId,
      existingId: payload.id,
    });

    if ("status" in result) {
      return result;
    }

    if (!result.activationPermitted) {
      return fail(422, {
        kind: "activation" as const,
        message:
          result.blockingReasons.at(0) ??
          "Connection must pass verification before activation is allowed.",
        values: result.values,
      });
    }

    return {
      form: {
        kind: "save" as const,
        status: "success" as const,
        message: "Connection activated successfully.",
        connection: result.connection,
        values: result.values,
      },
    };
  },
  diagnostics: async ({ request }) => {
    const formData = await request.formData();
    const connectionId = formData.get("connectionId");
    const trigger = asDiagnosticTrigger(formData.get("trigger"));

    if (typeof connectionId !== "string" || connectionId.length === 0) {
      return fail(422, {
        diagnostics: {
          status: "error" as const,
          message: "A service connection must be selected before running diagnostics.",
        },
      });
    }

    const teamId = "team-demo-456";
    const connection = await getServiceConnectionById(teamId, connectionId);

    if (!connection) {
      return fail(404, {
        diagnostics: {
          status: "error" as const,
          message: "Selected service connection could not be found.",
        },
      });
    }

    if (!connection.supabaseUrl) {
      return fail(422, {
        diagnostics: {
          status: "error" as const,
          message: "Service connection is missing a diagnostics endpoint URL.",
        },
      });
    }

    const scenarioInputs = formData
      .getAll("scenario")
      .filter((value): value is string => typeof value === "string");
    const selectedScenarios = normalizeScenarios(scenarioInputs);

    const run = await runDiagnostics({
      teamId,
      serviceConnectionId: connectionId,
      supabaseUrl: connection.supabaseUrl,
      scenarios: selectedScenarios,
      trigger,
      executedBy: formData.get("executedBy")?.toString() ?? null,
    });

    const failingScenarios = run.results.filter((result) => result.status !== "pass");

    if (failingScenarios.length > 0) {
      await dispatchNotification({
        type: "diagnostics.failure",
        severity: run.status === "fail" ? "critical" : "warning",
        channel: "in_app",
        audience: {
          teamId,
          roles: ["operations", "qa"],
        },
        context: {
          connectionId,
          connectionName: connection.name,
          scenarios: failingScenarios.map((scenario) => ({
            name: scenario.scenario,
            status: scenario.status,
            notes: scenario.notes,
          })),
        },
      });
    }

    return {
      diagnostics: {
        status: run.status,
        results: run.results.map((result) => ({
          scenario: result.scenario,
          status: result.status,
          durationMs: result.durationMs,
          startedAt: result.startedAt.toISOString(),
          completedAt: result.completedAt.toISOString(),
          notes: result.notes,
        })),
      },
    };
  },
};

function normalizeScenarios(values: string[]): DiagnosticScenario[] {
  if (values.length === 0) {
    return [...diagnosticScenarios];
  }

  const allowed = new Set(diagnosticScenarios);
  const normalized = values.filter((value): value is DiagnosticScenario =>
    allowed.has(value as DiagnosticScenario)
  ) as DiagnosticScenario[];

  return normalized.length > 0 ? normalized : [...diagnosticScenarios];
}

function asDiagnosticTrigger(value: unknown): DiagnosticTrigger {
  if (typeof value === "string" && diagnosticTriggers.includes(value as DiagnosticTrigger)) {
    return value as DiagnosticTrigger;
  }
  return "manual";
}
