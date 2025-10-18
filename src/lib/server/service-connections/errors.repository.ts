import { randomUUID } from "node:crypto";

import { getAdminClient } from "$lib/server/supabase/admin-client";
import type { Database } from "$lib/supabase";
import type {
  ErrorEventSeverity,
  ServiceConnectionEnvironment,
  ServiceConnectionServiceType,
} from "$lib/types/service-connections";

const inMemoryErrorEvents = new Map<string, ErrorEventRecord[]>();

const shouldUseMemory = () =>
  process.env.COSPLANS_USE_FAKE_SUPABASE === "1" || process.env.NODE_ENV === "test";

export interface ErrorEventPersistenceInput {
  teamId: string;
  serviceConnectionId: string;
  correlationId: string;
  errorCode: string;
  userMessage: string;
  severity?: ErrorEventSeverity;
  operatorContext?: Record<string, unknown>;
  occurredAt?: Date;
  acknowledgedAt?: Date | null;
  acknowledgedBy?: string | null;
}

export interface ErrorEventRecord {
  id: string;
  teamId: string;
  serviceConnectionId: string;
  correlationId: string;
  errorCode: string;
  userMessage: string;
  severity: ErrorEventSeverity;
  operatorContext: Record<string, unknown>;
  occurredAt: Date;
  acknowledgedAt: Date | null;
  acknowledgedBy: string | null;
  connection?: {
    serviceType: ServiceConnectionServiceType;
    environment: ServiceConnectionEnvironment;
    name: string;
  };
}

export async function recordErrorEvent(
  input: ErrorEventPersistenceInput
): Promise<ErrorEventRecord> {
  const record: ErrorEventRecord = {
    id: randomUUID(),
    teamId: input.teamId,
    serviceConnectionId: input.serviceConnectionId,
    correlationId: input.correlationId,
    errorCode: input.errorCode,
    userMessage: input.userMessage,
    severity: input.severity ?? "error",
    operatorContext: input.operatorContext ?? {},
    occurredAt: input.occurredAt ?? new Date(),
    acknowledgedAt: input.acknowledgedAt ?? null,
    acknowledgedBy: input.acknowledgedBy ?? null,
  };

  if (shouldUseMemory()) {
    appendInMemory(record);
    return { ...record };
  }

  const client = getAdminClient();

  const payload: Database["public"]["Tables"]["error_events"]["Insert"] = {
    id: record.id,
    service_connection_id: record.serviceConnectionId,
    correlation_id: record.correlationId,
    severity: record.severity,
    error_code: record.errorCode,
    user_message: record.userMessage,
    operator_context: record.operatorContext,
    occurred_at: record.occurredAt.toISOString(),
    acknowledged_at: record.acknowledgedAt ? record.acknowledgedAt.toISOString() : null,
    acknowledged_by: record.acknowledgedBy ?? null,
  };

  const { error } = await client.from("error_events").insert(payload as never);

  if (error) {
    const details = error.message ? `: ${error.message}` : "";
    throw new Error(`Failed to persist error event${details}`);
  }

  appendInMemory(record);
  return { ...record };
}

export interface ListErrorEventsOptions {
  limit?: number;
}

export async function listErrorEvents(
  teamId: string,
  options: ListErrorEventsOptions = {}
): Promise<ErrorEventRecord[]> {
  if (shouldUseMemory()) {
    const events = inMemoryErrorEvents.get(teamId) ?? [];
    const { limit } = options;
    return (limit ? events.slice(0, limit) : events).map((event) => ({
      ...event,
      occurredAt: new Date(event.occurredAt),
      acknowledgedAt: event.acknowledgedAt ? new Date(event.acknowledgedAt) : null,
    }));
  }

  const client = getAdminClient();
  const { data, error } = await client
    .from("error_events")
    .select(
      "*, service_connection_profiles!inner(team_id, service_type, environment, connection_metadata)"
    )
    .eq("service_connection_profiles.team_id", teamId)
    .order("occurred_at", { ascending: false })
    .limit(options.limit ?? 50);

  if (error) {
    const details = error.message ? `: ${error.message}` : "";
    throw new Error(`Failed to load error events${details}`);
  }

  const rows =
    (data as Array<
      Database["public"]["Tables"]["error_events"]["Row"] & {
        service_connection_profiles: {
          team_id: string;
          service_type: ServiceConnectionServiceType;
          environment: ServiceConnectionEnvironment;
          connection_metadata: Record<string, unknown> | null;
        };
      }
    >) ?? [];

  return rows.map((row) => {
    const metadata = (row.service_connection_profiles.connection_metadata ?? {}) as Record<
      string,
      unknown
    >;
    const name =
      typeof metadata.displayName === "string"
        ? metadata.displayName
        : `${row.service_connection_profiles.service_type} (${row.service_connection_profiles.environment})`;

    return {
      id: row.id,
      teamId,
      serviceConnectionId: row.service_connection_id,
      correlationId: row.correlation_id,
      errorCode: row.error_code,
      userMessage: row.user_message,
      severity: row.severity,
      operatorContext: row.operator_context ?? {},
      occurredAt: new Date(row.occurred_at),
      acknowledgedAt: row.acknowledged_at ? new Date(row.acknowledged_at) : null,
      acknowledgedBy: row.acknowledged_by,
      connection: {
        serviceType: row.service_connection_profiles.service_type,
        environment: row.service_connection_profiles.environment,
        name,
      },
    } satisfies ErrorEventRecord;
  });
}

function appendInMemory(record: ErrorEventRecord): void {
  const existing = inMemoryErrorEvents.get(record.teamId) ?? [];
  inMemoryErrorEvents.set(record.teamId, [
    { ...record, occurredAt: new Date(record.occurredAt), acknowledgedAt: record.acknowledgedAt },
    ...existing,
  ]);
}

export function clearErrorEventCache(teamId?: string): void {
  if (teamId) {
    inMemoryErrorEvents.delete(teamId);
    return;
  }
  inMemoryErrorEvents.clear();
}

export async function acknowledgeErrorEvent(
  teamId: string,
  eventId: string,
  operatorId: string
): Promise<ErrorEventRecord | null> {
  const acknowledgedAt = new Date();

  if (shouldUseMemory()) {
    const events = inMemoryErrorEvents.get(teamId);
    if (!events) {
      return null;
    }

    const index = events.findIndex((event) => event.id === eventId);
    if (index < 0) {
      return null;
    }

    const updated: ErrorEventRecord = {
      ...events[index],
      acknowledgedAt,
      acknowledgedBy: operatorId,
    };

    events.splice(index, 1, updated);
    inMemoryErrorEvents.set(teamId, events);
    return { ...updated };
  }

  const client = getAdminClient();
  const updatePayload: Database["public"]["Tables"]["error_events"]["Update"] = {
    acknowledged_at: acknowledgedAt.toISOString(),
    acknowledged_by: operatorId,
  };

  const { data, error } = await client
    .from("error_events")
    .update(updatePayload as never)
    .eq("id", eventId)
    .select(
      "*, service_connection_profiles!inner(team_id, service_type, environment, connection_metadata)"
    )
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("Failed to acknowledge error event", error);
    }
    return null;
  }

  const row = data as Database["public"]["Tables"]["error_events"]["Row"] & {
    service_connection_profiles: {
      team_id: string;
      service_type: ServiceConnectionServiceType;
      environment: ServiceConnectionEnvironment;
      connection_metadata: Record<string, unknown> | null;
    };
  };

  if (row.service_connection_profiles.team_id !== teamId) {
    return null;
  }

  const metadata = (row.service_connection_profiles.connection_metadata ?? {}) as Record<
    string,
    unknown
  >;

  const name =
    typeof metadata.displayName === "string"
      ? metadata.displayName
      : `${row.service_connection_profiles.service_type} (${row.service_connection_profiles.environment})`;

  const record: ErrorEventRecord = {
    id: row.id,
    teamId,
    serviceConnectionId: row.service_connection_id,
    correlationId: row.correlation_id,
    errorCode: row.error_code,
    userMessage: row.user_message,
    severity: row.severity,
    operatorContext: row.operator_context ?? {},
    occurredAt: new Date(row.occurred_at),
    acknowledgedAt,
    acknowledgedBy: operatorId,
    connection: {
      serviceType: row.service_connection_profiles.service_type,
      environment: row.service_connection_profiles.environment,
      name,
    },
  } satisfies ErrorEventRecord;

  return record;
}
