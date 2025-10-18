import { fail, type Actions } from "@sveltejs/kit";

import type { ServiceConnectionFormInput } from "$lib/server/service-connections/validation";
import {
  executeVerification,
  saveConnection,
} from "$lib/server/service-connections/mutations";
import { listServiceConnections, toServiceConnectionProfile } from "$lib/server/service-connections/repository";
import type { PageServerLoad } from "./$types";

const FORM_FIELDS = [
  "id",
  "name",
  "environment",
  "serviceType",
  "supabaseUrl",
  "supabaseProjectRef",
  "supabaseServiceRoleKey",
  "supabaseAnonKey",
] as const;

type FormField = (typeof FORM_FIELDS)[number];

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

export const load: PageServerLoad = async () => {
  const teamId = "team-demo-456";
  const connections = await listServiceConnections(teamId);

  return {
    teamId,
    connections: connections.map(toServiceConnectionProfile),
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
};
