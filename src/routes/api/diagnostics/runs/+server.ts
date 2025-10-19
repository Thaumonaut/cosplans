import { randomUUID } from "node:crypto";

import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { z } from "zod";

import { runDiagnostics } from "$lib/server/service-connections/diagnostics-runner";
import { getServiceConnectionById } from "$lib/server/service-connections/repository";
import {
  diagnosticScenarios,
  diagnosticTriggers,
  type DiagnosticRunStatus,
  type DiagnosticScenario,
} from "$lib/types/service-connections";
import { recordErrorEvent } from "$lib/server/service-connections/errors.repository";
import { logCosplansError, toCosplansError } from "$lib/utils/errors";

interface DiagnosticsScenarioPayload {
  scenario: DiagnosticScenario;
  status: DiagnosticRunStatus;
  durationMs: number | null;
  startedAt: string;
  completedAt: string;
  notes: string | null;
}

interface DiagnosticsRunPayload {
  id: string;
  serviceConnectionId: string;
  scenarios: DiagnosticScenario[];
  status: DiagnosticRunStatus;
  startedAt: string;
  completedAt: string;
  durationMs: number | null;
  evidenceUrl: string | null;
  results: DiagnosticsScenarioPayload[];
}

const requestSchema = z.object({
  serviceConnectionId: z.string().uuid(),
  scenarios: z
    .array(z.enum(diagnosticScenarios))
    .min(1, "At least one diagnostic scenario is required"),
  trigger: z.enum(diagnosticTriggers),
  executedBy: z.string().uuid().optional(),
});

const TEAM_ID = "team-demo-456";

export async function POST(event: RequestEvent) {
  let parsedBody: unknown;

  try {
    parsedBody = await event.request.json();
  } catch {
    return respondWithError({
      status: 400,
      payload: {
        code: "INVALID_JSON_BODY",
        severity: "warning",
        userMessage: "Request body must be valid JSON",
        operatorContext: {
          reason: "invalid_json",
          request: "POST /api/diagnostics/runs",
        },
      },
    });
  }

  const validation = requestSchema.safeParse(parsedBody);
  if (!validation.success) {
    return respondWithError({
      status: 422,
      payload: {
        code: "INVALID_REQUEST",
        severity: "warning",
        userMessage: "Request payload is invalid",
        operatorContext: {
          reason: "validation_failed",
          issues: validation.error.flatten(),
          request: "POST /api/diagnostics/runs",
        },
      },
      details: {
        issues: validation.error.flatten(),
      },
    });
  }

  const payload = validation.data;

  const connection = await getServiceConnectionById(TEAM_ID, payload.serviceConnectionId);

  if (!connection) {
    return respondWithError({
      status: 404,
      payload: {
        code: "CONNECTION_NOT_FOUND",
        severity: "warning",
        userMessage: "Service connection could not be found",
        operatorContext: {
          reason: "missing_service_connection",
          request: "POST /api/diagnostics/runs",
          teamId: TEAM_ID,
          serviceConnectionId: payload.serviceConnectionId,
        },
      },
    });
  }

  if (!connection.supabaseUrl) {
    return respondWithError({
      status: 422,
      payload: {
        code: "CONNECTION_URL_MISSING",
        severity: "warning",
        userMessage: "Service connection has no diagnostics endpoint configured",
        operatorContext: {
          reason: "missing_diagnostics_endpoint",
          serviceConnectionId: payload.serviceConnectionId,
          teamId: TEAM_ID,
        },
      },
    });
  }

  try {
    const run = await runDiagnostics({
      teamId: TEAM_ID,
      serviceConnectionId: payload.serviceConnectionId,
      supabaseUrl: connection.supabaseUrl,
      scenarios: payload.scenarios,
      trigger: payload.trigger,
      executedBy: payload.executedBy,
    });

    const responsePayload: DiagnosticsRunPayload = {
      id: randomUUID(),
      serviceConnectionId: payload.serviceConnectionId,
      scenarios: run.results.map((result) => result.scenario),
      status: run.status,
      startedAt: run.startedAt.toISOString(),
      completedAt: run.completedAt.toISOString(),
      durationMs: Math.max(0, run.completedAt.getTime() - run.startedAt.getTime()),
      evidenceUrl: null,
      results: run.results.map((result) => ({
        scenario: result.scenario,
        status: result.status,
        durationMs: result.durationMs,
        startedAt: result.startedAt.toISOString(),
        completedAt: result.completedAt.toISOString(),
        notes: result.notes ?? null,
      })),
    };

    return json(responsePayload, { status: 202 });
  } catch (cause) {
    const normalizedError =
      cause instanceof Error ||
      typeof cause === "string" ||
      cause === null ||
      typeof cause === "undefined"
        ? cause
        : new Error("Diagnostics run failed");

    const cosplansError = logCosplansError(normalizedError, {
      context: {
        request: "POST /api/diagnostics/runs",
        serviceConnectionId: payload.serviceConnectionId,
        teamId: TEAM_ID,
      },
    });

    await recordErrorEvent({
      teamId: TEAM_ID,
      serviceConnectionId: payload.serviceConnectionId,
      correlationId: cosplansError.correlationId ?? randomUUID(),
      errorCode: cosplansError.code,
      userMessage: cosplansError.userMessage,
      severity: cosplansError.severity,
      operatorContext: cosplansError.operatorContext ?? {
        request: "POST /api/diagnostics/runs",
      },
    });

    return respondWithError({
      status: 500,
      payload: cosplansError,
    });
  }
}

interface ErrorResponsePayload {
  status: number;
  payload: Parameters<typeof toCosplansError>[0];
  teamId?: string;
  serviceConnectionId?: string;
  details?: Record<string, unknown>;
}

async function respondWithError(params: ErrorResponsePayload) {
  const cosplansError = toCosplansError(params.payload);
  const responseBody = {
    error: cosplansError.code,
    message: cosplansError.userMessage,
    correlationId: cosplansError.correlationId,
    severity: cosplansError.severity,
    supportRecommendation:
      (cosplansError.operatorContext?.supportRecommendation as string | undefined) ?? undefined,
    ...(params.details ?? {}),
  };

  if (params.status >= 500 && params.teamId && params.serviceConnectionId) {
    await recordErrorEvent({
      teamId: params.teamId,
      serviceConnectionId: params.serviceConnectionId,
      correlationId: cosplansError.correlationId ?? randomUUID(),
      errorCode: cosplansError.code,
      userMessage: cosplansError.userMessage,
      severity: cosplansError.severity,
      operatorContext: cosplansError.operatorContext,
    });
  }

  return json(responseBody, { status: params.status });
}
