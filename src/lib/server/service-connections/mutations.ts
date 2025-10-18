import { fail, type ActionFailure } from "@sveltejs/kit";

import { logCosplansError, toCosplansError } from "$lib/utils/errors";

import {
  validateServiceConnectionInput,
  type ServiceConnectionFormInput,
  type ValidationSuccess,
} from "$lib/server/service-connections/validation";
import {
  listServiceConnections,
  persistVerificationResult,
  saveServiceConnection,
  toServiceConnectionProfile,
  type SaveServiceConnectionInput,
} from "$lib/server/service-connections/repository";
import { runConnectionVerification } from "$lib/server/service-connections/verify";
import type {
  ServiceConnectionEnvironment,
  ServiceConnectionServiceType,
  ServiceConnectionStatus,
} from "$lib/types/service-connections";

export interface PrepareContext {
  teamId: string;
  existingId?: string;
}

type ValidationFailure = ActionFailure<{
  kind: "validation";
  errors: Record<string, string>;
  values: ServiceConnectionFormInput;
}>;

type PreparedDraft = {
  validation: ValidationSuccess;
  existing: Awaited<ReturnType<typeof findExistingConnection>>;
};

export async function prepareConnectionDraft(
  input: ServiceConnectionFormInput,
  context: PrepareContext
): Promise<PreparedDraft | ValidationFailure> {
  const existing = context.existingId
    ? await findExistingConnection(context.teamId, context.existingId)
    : null;

  const validation = validateServiceConnectionInput(input, {
    existing: existing
      ? {
          id: existing.id,
          environment: existing.environment,
          status: existing.status,
          lastVerifiedAt: existing.lastVerifiedAt,
          credentialsFingerprint: existing.credentialsFingerprint,
        }
      : undefined,
  });

  if (!validation.success) {
    return fail(422, {
      kind: "validation" as const,
      errors: validation.errors,
      values: input,
    });
  }

  return { validation: validation as ValidationSuccess, existing };
}

export async function executeVerification(
  input: ServiceConnectionFormInput,
  context: PrepareContext
) {
  const prepared = await prepareConnectionDraft(input, context);
  if ("status" in prepared) {
    return prepared;
  }

  const { validation, existing } = prepared;
  const { normalized } = validation.data;

  const result = await runConnectionVerification(normalized);

  if (!result.ok) {
    const error = toCosplansError({
      code: result.failureCode ?? "SERVICE_VERIFICATION_FAILED",
      severity: result.severity ?? "warning",
      userMessage: result.message,
      operatorContext: {
        reason: result.failureCode,
        latencyMs: result.latencyMs,
      },
    });

    logCosplansError(error, {
      context: {
        teamId: context.teamId,
        connectionId: existing?.id ?? null,
      },
    });

    if (existing) {
      await persistVerificationResult({
        id: existing.id,
        teamId: context.teamId,
        status: "error",
        lastVerifiedAt: new Date(),
        message: result.message,
      });
    }

    return fail(422, {
      kind: "verification" as const,
      status: "error" as const,
      message: result.message,
      code: error.code,
      severity: error.severity,
      correlationId: error.correlationId,
      values: normalized,
    });
  }

  const record = existing
    ? (await persistVerificationResult({
        id: existing.id,
        teamId: context.teamId,
        status: "pending_verification",
        lastVerifiedAt: result.checkedAt,
        message: result.message,
      })) ?? existing
    : await saveServiceConnection({
        teamId: context.teamId,
        id: normalized.id,
        name: normalized.name,
        environment: normalized.environment as ServiceConnectionEnvironment,
        serviceType: normalized.serviceType as ServiceConnectionServiceType,
        supabaseUrl: normalized.supabaseUrl,
        supabaseProjectRef: normalized.supabaseProjectRef,
        status: "pending_verification",
        credentialsFingerprint: validation.data.credentialsFingerprint,
        lastVerifiedAt: result.checkedAt,
        lastVerificationMessage: result.message,
      });

  return {
    kind: "verification" as const,
    result,
    requiresVerification: false,
    activationPermitted: true,
    connection: toServiceConnectionProfile(record),
    blockingReasons: [],
    values: {
      ...normalized,
      id: record.id,
    },
  };
}

export async function saveConnection(
  input: ServiceConnectionFormInput,
  context: PrepareContext
) {
  const prepared = await prepareConnectionDraft(input, context);
  if ("status" in prepared) {
    return prepared;
  }

  const { validation, existing } = prepared;
  const { normalized } = validation.data;

  if (!existing) {
    return fail(400, {
      kind: "activation" as const,
      status: "error" as const,
      message: "Connection must be verified before activation.",
      values: normalized,
    });
  }

  const status: ServiceConnectionStatus = validation.data.activationPermitted
    ? "active"
    : "pending_verification";

  if (!validation.data.activationPermitted) {
    return fail(422, {
      kind: "activation" as const,
      status: "error" as const,
      message:
        validation.data.blockingReasons.at(0) ??
        "Connection must pass verification before activation is allowed.",
      values: normalized,
    });
  }

  const payload: SaveServiceConnectionInput = {
    id: existing.id,
    teamId: context.teamId,
    name: normalized.name,
    environment: normalized.environment as ServiceConnectionEnvironment,
    serviceType: normalized.serviceType as ServiceConnectionServiceType,
    supabaseUrl: normalized.supabaseUrl,
    supabaseProjectRef: normalized.supabaseProjectRef,
    status,
    credentialsFingerprint: validation.data.credentialsFingerprint,
    lastVerifiedAt: existing.lastVerifiedAt,
    lastVerificationMessage: existing.lastVerificationMessage,
  };

  const saved = await saveServiceConnection(payload);

  return {
    kind: "save" as const,
    connection: toServiceConnectionProfile(saved),
    activationPermitted: true,
    blockingReasons: [],
    values: {
      ...normalized,
      id: saved.id,
    },
  };
}

async function findExistingConnection(teamId: string, id: string) {
  const connections = await listServiceConnections(teamId);
  return connections.find((connection) => connection.id === id) ?? null;
}
