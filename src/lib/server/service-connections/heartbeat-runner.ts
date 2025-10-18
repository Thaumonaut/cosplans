import { getAdminClient } from "$lib/server/supabase/admin-client";
import { recordHeartbeatOutcome } from "$lib/server/service-connections/health.repository";
import type { Database } from "$lib/supabase";
import type { ServiceHealthStatus } from "$lib/types/service-connections";

export interface HeartbeatResult {
  serviceConnectionId: string;
  teamId: string;
  status: "pass" | "fail";
  latencyMs: number | null;
  errorCode: string | null;
  consecutiveFailures: number;
  snapshotStatus: ServiceHealthStatus;
  hadStatusChange: boolean;
}

export interface HeartbeatRunnerOptions {
  fetch?: typeof fetch;
  connections?: Array<
    Pick<
      Database["public"]["Tables"]["service_connection_profiles"]["Row"],
      "id" | "team_id" | "status" | "connection_metadata"
    >
  >;
  timestamp?: Date;
}

type ServiceConnectionRow = Pick<
  Database["public"]["Tables"]["service_connection_profiles"]["Row"],
  "id" | "team_id" | "status" | "connection_metadata"
>;

export async function runServiceConnectionHeartbeats(
  options: HeartbeatRunnerOptions = {}
): Promise<HeartbeatResult[]> {
  const connections =
    options.connections ?? (await loadActiveConnections({ fetch: options.fetch }));

  const runnerFetch = options.fetch ?? fetch;
  const results: HeartbeatResult[] = [];

  for (const connection of connections) {
    if (connection.status !== "active") {
      continue;
    }

    const endpoint = resolveHeartbeatEndpoint(connection.connection_metadata);
    const startedAt = Date.now();

    let status: "pass" | "fail" = "pass";
    let errorCode: string | null = null;
    let latencyMs: number | null = null;

    if (!endpoint) {
      status = "fail";
      errorCode = "MISSING_ENDPOINT";
    } else {
      try {
        const response = await runnerFetch(endpoint, { method: "HEAD" });
        latencyMs = Math.max(0, Math.round(Date.now() - startedAt));
        if (!response.ok) {
          status = "fail";
          errorCode = `HTTP_${response.status}`;
        }
      } catch (error) {
        latencyMs = Math.max(0, Math.round(Date.now() - startedAt));
        status = "fail";
        errorCode = error instanceof Error ? error.name : "NETWORK_ERROR";
      }
    }

    try {
      const outcome = await recordHeartbeatOutcome({
        teamId: connection.team_id,
        serviceConnectionId: connection.id,
        status,
        latencyMs,
        errorCode: errorCode ?? undefined,
        occurredAt: options.timestamp ?? new Date(),
      });

      results.push({
        serviceConnectionId: connection.id,
        teamId: connection.team_id,
        status,
        latencyMs,
        errorCode,
        consecutiveFailures: outcome.consecutiveFailures,
        snapshotStatus: outcome.snapshot.currentStatus,
        hadStatusChange: outcome.hadStatusChange,
      });
    } catch (error) {
      console.error("Failed to record heartbeat outcome", error);
    }
  }

  return results;
}

export function resolveHeartbeatEndpoint(
  metadata: ServiceConnectionRow["connection_metadata"]
): string | null {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const candidate = extractCandidateUrl(metadata);

  if (!candidate) {
    return null;
  }

  try {
    const url = new URL(candidate);
    url.pathname = "/rest/v1/";
    return url.toString();
  } catch {
    return null;
  }
}

function extractCandidateUrl(metadata: Record<string, unknown>): string | null {
  const byKey = typeof metadata.supabaseUrl === "string" ? metadata.supabaseUrl : null;
  if (byKey) {
    return byKey;
  }

  if (typeof metadata.url === "string") {
    return metadata.url;
  }

  return null;
}

async function loadActiveConnections(options: {
  fetch?: typeof fetch;
}): Promise<ServiceConnectionRow[]> {
  try {
    const client = getAdminClient({ fetch: options.fetch });
    const { data, error } = await client
      .from("service_connection_profiles")
      .select("id, team_id, status, connection_metadata")
      .eq("status", "active");

    if (error) {
      throw new Error(error.message ?? "Failed to load active service connections");
    }

    return (data ?? []) as ServiceConnectionRow[];
  } catch (error) {
    console.error("Failed to load active service connections", error);
    throw error;
  }
}
