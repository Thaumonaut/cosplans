import { randomUUID } from "node:crypto";

import { getAdminClient } from "$lib/server/supabase/admin-client";
import type { Database } from "$lib/supabase";
import { type HealthSnapshot, type ServiceHealthStatus } from "$lib/types/service-connections";

const HEARTBEAT_RETENTION_MS = 24 * 60 * 60 * 1000;

interface HeartbeatHistoryRecord {
  id: string;
  occurredAt: Date;
  status: "pass" | "fail";
  latencyMs: number | null;
  errorEventId: string | null;
  errorCode: string | null;
}

export interface HeartbeatOutcomeInput {
  teamId: string;
  serviceConnectionId: string;
  status: "pass" | "fail";
  latencyMs: number | null;
  errorCode?: string;
  errorEventId?: string | null;
  occurredAt?: Date;
}

export interface RecordHeartbeatOutcomeResult {
  snapshot: HealthSnapshotRecord;
  consecutiveFailures: number;
  hadStatusChange: boolean;
  heartbeatId: string;
  previousStatus: ServiceHealthStatus | null;
}

export interface HealthSnapshotRecord extends HealthSnapshot {
  teamId: string;
}

const inMemoryHistory = new Map<string, HeartbeatHistoryRecord[]>();
const inMemorySnapshots = new Map<string, Map<string, HealthSnapshotRecord>>();

const shouldUseMemory = () =>
  process.env.COSPLANS_USE_FAKE_SUPABASE === "1" || process.env.NODE_ENV === "test";

export async function recordHeartbeatOutcome(
  input: HeartbeatOutcomeInput
): Promise<RecordHeartbeatOutcomeResult> {
  const occurredAt = input.occurredAt ?? new Date();
  const heartbeatId = randomUUID();
  const key = historyKey(input.teamId, input.serviceConnectionId);

  const history = inMemoryHistory.get(key) ?? [];
  history.unshift({
    id: heartbeatId,
    occurredAt,
    status: input.status,
    latencyMs: typeof input.latencyMs === "number" ? Math.max(0, input.latencyMs) : null,
    errorEventId: input.errorEventId ?? null,
    errorCode: input.errorCode ?? null,
  });

  pruneExpired(history, occurredAt);
  inMemoryHistory.set(key, history);

  const previousSnapshot = getExistingSnapshot(input.teamId, input.serviceConnectionId);
  const snapshot = buildSnapshot(input.teamId, input.serviceConnectionId, history);
  const consecutiveFailures = calculateConsecutiveFailures(history);
  const hadStatusChange = previousSnapshot?.currentStatus !== snapshot.currentStatus;

  persistSnapshotInMemory(snapshot);

  if (!shouldUseMemory()) {
    await persistHeartbeatToSupabase({
      heartbeatId,
      serviceConnectionId: input.serviceConnectionId,
      status: input.status,
      latencyMs: input.latencyMs ?? null,
      occurredAt,
      consecutiveFailures,
      errorCode: input.errorCode ?? null,
      errorEventId: input.errorEventId ?? null,
    });
  }

  const enrichedSnapshot: HealthSnapshotRecord = {
    ...snapshot,
    consecutiveFailures,
  };

  return {
    snapshot: enrichedSnapshot,
    consecutiveFailures,
    hadStatusChange,
    heartbeatId,
    previousStatus: previousSnapshot?.currentStatus ?? null,
  };
}

export async function getHealthSnapshots(teamId: string): Promise<HealthSnapshotRecord[]> {
  const teamSnapshots = inMemorySnapshots.get(teamId);
  if (!teamSnapshots) {
    if (!shouldUseMemory()) {
      return loadSnapshotsFromSupabase(teamId);
    }
    return [];
  }
  return Array.from(teamSnapshots.values()).map((snapshot) => ({ ...snapshot }));
}

export function clearHeartbeatCache(): void {
  inMemoryHistory.clear();
  inMemorySnapshots.clear();
}

export async function linkHeartbeatToErrorEvent(options: {
  teamId: string;
  serviceConnectionId: string;
  heartbeatId: string;
  errorEventId: string;
}): Promise<void> {
  const key = historyKey(options.teamId, options.serviceConnectionId);
  const history = inMemoryHistory.get(key);
  if (history) {
    const entry = history.find((record) => record.id === options.heartbeatId);
    if (entry) {
      entry.errorEventId = options.errorEventId;
    }
    const snapshot = buildSnapshot(options.teamId, options.serviceConnectionId, history);
    persistSnapshotInMemory(snapshot);
  }

  if (!shouldUseMemory()) {
    try {
      const client = getAdminClient();
      const updatePayload: Database["public"]["Tables"]["service_connection_heartbeats"]["Update"] =
        {
          error_event_id: options.errorEventId,
        };

      await client
        .from("service_connection_heartbeats")
        .update(updatePayload as never)
        .eq("id", options.heartbeatId);

      await client.rpc("refresh_service_health_snapshots", {} as never);
    } catch (error) {
      console.error("Failed to link heartbeat to error event", error);
    }
  }
}

function historyKey(teamId: string, serviceConnectionId: string): string {
  return `${teamId}:${serviceConnectionId}`;
}

function pruneExpired(history: HeartbeatHistoryRecord[], reference: Date): void {
  const cutoff = reference.getTime() - HEARTBEAT_RETENTION_MS;
  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (history[index].occurredAt.getTime() < cutoff) {
      history.splice(index, 1);
    }
  }
}

function calculateConsecutiveFailures(history: HeartbeatHistoryRecord[]): number {
  let count = 0;
  for (const record of history) {
    if (record.status === "fail") {
      count += 1;
      continue;
    }
    break;
  }
  return count;
}

function determineStatus(history: HeartbeatHistoryRecord[]): ServiceHealthStatus {
  if (history.length === 0) {
    return "active";
  }

  const latest = history[0];
  if (latest.status === "pass") {
    return "active";
  }

  const consecutiveFailures = calculateConsecutiveFailures(history);
  return consecutiveFailures >= 2 ? "error" : "degraded";
}

function buildSnapshot(
  teamId: string,
  serviceConnectionId: string,
  history: HeartbeatHistoryRecord[]
): HealthSnapshotRecord {
  const totalEvents = history.length;
  const successfulEvents = history.filter((record) => record.status === "pass").length;
  const failedEvents = totalEvents - successfulEvents;

  const recentFailures = failedEvents;
  const uptime = totalEvents === 0 ? 100 : clampPercentage((successfulEvents / totalEvents) * 100);

  const status = determineStatus(history);
  const lastHeartbeatAt = history[0]?.occurredAt ?? null;
  const lastLatencyMs = history[0]?.latencyMs ?? null;
  const lastErrorEventId = findLatestErrorEventId(history);
  const lastErrorCode = findLatestErrorCode(history);

  return {
    teamId,
    serviceConnectionId,
    currentStatus: status,
    uptimePercent24h: uptime,
    recentFailures,
    lastHeartbeatAt,
    lastErrorEventId,
    lastLatencyMs,
    consecutiveFailures: calculateConsecutiveFailures(history),
    lastErrorCode,
  } satisfies HealthSnapshotRecord;
}

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(value * 100) / 100));
}

function findLatestErrorEventId(history: HeartbeatHistoryRecord[]): string | null {
  for (const record of history) {
    if (record.status === "fail" && record.errorEventId) {
      return record.errorEventId;
    }
  }
  return null;
}

function findLatestErrorCode(history: HeartbeatHistoryRecord[]): string | null {
  for (const record of history) {
    if (record.status === "fail" && record.errorCode) {
      return record.errorCode;
    }
  }
  return null;
}

function getExistingSnapshot(
  teamId: string,
  serviceConnectionId: string
): HealthSnapshotRecord | undefined {
  return inMemorySnapshots.get(teamId)?.get(serviceConnectionId);
}

function persistSnapshotInMemory(snapshot: HealthSnapshotRecord): void {
  const teamSnapshots =
    inMemorySnapshots.get(snapshot.teamId) ?? new Map<string, HealthSnapshotRecord>();
  teamSnapshots.set(snapshot.serviceConnectionId, { ...snapshot });
  inMemorySnapshots.set(snapshot.teamId, teamSnapshots);
}

async function persistHeartbeatToSupabase(payload: {
  heartbeatId: string;
  serviceConnectionId: string;
  status: "pass" | "fail";
  latencyMs: number | null;
  occurredAt: Date;
  consecutiveFailures: number;
  errorCode: string | null;
  errorEventId: string | null;
}): Promise<void> {
  try {
    const client = getAdminClient();

    const insertPayload: Database["public"]["Tables"]["service_connection_heartbeats"]["Insert"] = {
      id: payload.heartbeatId,
      service_connection_id: payload.serviceConnectionId,
      status: payload.status,
      latency_ms: payload.latencyMs,
      error_code: payload.errorCode,
      error_event_id: payload.errorEventId,
      occurred_at: payload.occurredAt.toISOString(),
      consecutive_failures: payload.consecutiveFailures,
    };

    const { error } = await client
      .from("service_connection_heartbeats")
      .insert(insertPayload as never);

    if (error) {
      console.error("Failed to insert heartbeat", error);
    }

    await client.rpc("refresh_service_health_snapshots", {} as never);
  } catch (error) {
    console.error("Failed to persist heartbeat to Supabase", error);
  }
}

async function loadSnapshotsFromSupabase(teamId: string): Promise<HealthSnapshotRecord[]> {
  try {
    const client = getAdminClient();
    const { data, error } = await client
      .from("service_health_snapshots")
      .select("*, service_connection_profiles!inner(team_id)")
      .eq("service_connection_profiles.team_id", teamId);

    if (error || !data) {
      return [];
    }

    return (
      data as Array<
        Database["public"]["Views"]["service_health_snapshots"]["Row"] & {
          service_connection_profiles: { team_id: string };
        }
      >
    ).map(
      (row) =>
        ({
          teamId,
          serviceConnectionId: row.service_connection_id,
          currentStatus: row.current_status as ServiceHealthStatus,
          uptimePercent24h: row.uptime_percent_24h,
          recentFailures: row.recent_failures,
          lastHeartbeatAt: row.last_heartbeat_at ? new Date(row.last_heartbeat_at) : null,
          lastErrorEventId: row.last_error_event_id,
          lastLatencyMs: row.last_latency_ms,
          consecutiveFailures: row.consecutive_failures ?? 0,
          lastErrorCode: row.last_error_code ?? null,
        }) satisfies HealthSnapshotRecord
    );
  } catch (error) {
    console.error("Failed to load health snapshots from Supabase", error);
    return [];
  }
}
