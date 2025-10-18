import { randomUUID } from "node:crypto";

import { getAdminClient } from "$lib/server/supabase/admin-client";
import type { Database } from "$lib/supabase";
import type {
  DiagnosticRunStatus,
  DiagnosticScenario,
  DiagnosticTrigger,
  ServiceConnectionEnvironment,
  ServiceConnectionProfile,
  ServiceConnectionServiceType,
  ServiceConnectionStatus,
} from "$lib/types/service-connections";

interface ServiceConnectionRecord {
  id: string;
  teamId: string;
  name: string;
  environment: ServiceConnectionEnvironment;
  serviceType: ServiceConnectionServiceType;
  supabaseUrl: string;
  supabaseProjectRef: string | null;
  status: ServiceConnectionStatus;
  credentialsFingerprint: string;
  lastVerifiedAt: Date | null;
  lastVerificationMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VerificationRecord {
  connectionId: string;
  scenario?: DiagnosticScenario;
  trigger?: DiagnosticTrigger;
  executedBy?: string | null;
  status: DiagnosticRunStatus;
  durationMs?: number | null;
  evidenceUrl?: string | null;
  notes?: string | null;
  executedAt: Date;
  completedAt?: Date | null;
}

const inMemoryConnections = new Map<string, ServiceConnectionRecord[]>();
const inMemoryVerifications = new Map<string, VerificationRecord[]>();

const shouldUseMemory = () =>
  process.env.COSPLANS_USE_FAKE_SUPABASE === "1" || process.env.NODE_ENV === "test";

type ServiceConnectionRow = Database["public"]["Tables"]["service_connection_profiles"]["Row"];
type DiagnosticRunRow = Database["public"]["Tables"]["diagnostic_test_runs"]["Row"];

type PostgrestResponse<T> = { data: T; error: { message?: string } | null };

interface ConnectionMetadata extends Record<string, unknown> {
  displayName?: string;
  supabaseUrl?: string;
  credentialsFingerprint?: string;
  lastVerificationMessage?: string;
}

const METADATA_DEFAULTS: Required<
  Pick<ConnectionMetadata, "displayName" | "supabaseUrl" | "credentialsFingerprint">
> = {
  displayName: "",
  supabaseUrl: "",
  credentialsFingerprint: "",
};

function sanitizeMetadata(
  metadata: Record<string, unknown> | null | undefined
): ConnectionMetadata {
  if (!metadata || typeof metadata !== "object") {
    return { ...METADATA_DEFAULTS };
  }

  const copy: ConnectionMetadata = { ...metadata } as ConnectionMetadata;

  if (copy.displayName && typeof copy.displayName !== "string") {
    delete copy.displayName;
  }
  if (copy.supabaseUrl && typeof copy.supabaseUrl !== "string") {
    delete copy.supabaseUrl;
  }
  if (copy.credentialsFingerprint && typeof copy.credentialsFingerprint !== "string") {
    delete copy.credentialsFingerprint;
  }
  if (copy.lastVerificationMessage && typeof copy.lastVerificationMessage !== "string") {
    delete copy.lastVerificationMessage;
  }

  return { ...METADATA_DEFAULTS, ...copy };
}

function metadataFromInput(
  input: SaveServiceConnectionInput,
  existing?: ConnectionMetadata
): ConnectionMetadata {
  const metadata = sanitizeMetadata(existing);

  metadata.displayName = input.name;
  metadata.supabaseUrl = input.supabaseUrl;
  metadata.credentialsFingerprint = input.credentialsFingerprint;

  if (typeof input.lastVerificationMessage !== "undefined") {
    metadata.lastVerificationMessage = input.lastVerificationMessage ?? undefined;
  }

  return metadata;
}

function rowToServiceConnection(record: ServiceConnectionRow): ServiceConnectionRecord {
  const metadata = sanitizeMetadata(record.connection_metadata);
  const displayName =
    metadata.displayName && metadata.displayName !== ""
      ? metadata.displayName
      : `${record.service_type} (${record.environment})`;
  return {
    id: record.id,
    teamId: record.team_id,
    name: displayName,
    environment: record.environment,
    serviceType: record.service_type,
    supabaseUrl: metadata.supabaseUrl ?? "",
    supabaseProjectRef: record.supabase_project_ref ?? null,
    status: record.status,
    credentialsFingerprint: metadata.credentialsFingerprint ?? "",
    lastVerifiedAt: record.last_verified_at ? new Date(record.last_verified_at) : null,
    lastVerificationMessage: metadata.lastVerificationMessage,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
  } satisfies ServiceConnectionRecord;
}

function ensureSuccess<T>(response: PostgrestResponse<T | null>, defaultValue?: T): T {
  if (response.error) {
    throw new Error(response.error.message ?? "Supabase query failed");
  }
  if (response.data === null || typeof response.data === "undefined") {
    if (typeof defaultValue !== "undefined") {
      return defaultValue;
    }
    throw new Error("Supabase query returned no data");
  }
  return response.data;
}

export interface SaveServiceConnectionInput {
  id?: string;
  teamId: string;
  name: string;
  environment: ServiceConnectionEnvironment;
  serviceType: ServiceConnectionServiceType;
  supabaseUrl: string;
  supabaseProjectRef?: string | null;
  status: ServiceConnectionStatus;
  credentialsFingerprint: string;
  lastVerifiedAt?: Date | null;
  lastVerificationMessage?: string;
}

export interface VerificationPersistenceInput {
  id: string;
  teamId: string;
  status: Extract<ServiceConnectionStatus, "pending_verification" | "active" | "error">;
  lastVerifiedAt: Date | null;
  message?: string;
}

export async function listServiceConnections(teamId: string): Promise<ServiceConnectionRecord[]> {
  if (!shouldUseMemory()) {
    const client = getAdminClient();
    const { data, error } = await client
      .from("service_connection_profiles")
      .select("*")
      .eq("team_id", teamId)
      .order("created_at", { ascending: true });

    const rows = ensureSuccess<ServiceConnectionRow[]>({ data, error }, []);
    return rows.map((row) => rowToServiceConnection(row));
  }

  const rows = inMemoryConnections.get(teamId) ?? [];
  return rows.map((row) => ({ ...row }));
}

export async function getServiceConnectionById(
  teamId: string,
  id: string
): Promise<ServiceConnectionRecord | null> {
  if (!shouldUseMemory()) {
    const client = getAdminClient();
    const { data, error } = await client
      .from("service_connection_profiles")
      .select("*")
      .eq("team_id", teamId)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message ?? "Failed to load service connection");
    }

    if (!data) {
      return null;
    }

    return rowToServiceConnection(data as ServiceConnectionRow);
  }

  const rows = inMemoryConnections.get(teamId) ?? [];
  const found = rows.find((row) => row.id === id);
  return found ? { ...found } : null;
}

export async function saveServiceConnection(
  input: SaveServiceConnectionInput
): Promise<ServiceConnectionRecord> {
  if (!shouldUseMemory()) {
    const client = getAdminClient();

    let existingMetadata: ConnectionMetadata | undefined;
    if (input.id) {
      const { data: existingRow, error: existingError } = await client
        .from("service_connection_profiles")
        .select("connection_metadata")
        .eq("id", input.id)
        .eq("team_id", input.teamId)
        .maybeSingle();

      if (existingError) {
        throw new Error(existingError.message ?? "Failed to load existing service connection");
      }

      if (existingRow) {
        existingMetadata = sanitizeMetadata(
          (existingRow as Pick<ServiceConnectionRow, "connection_metadata">).connection_metadata
        );
      }
    }

    const connection_metadata = metadataFromInput(input, existingMetadata);

    const payload: Database["public"]["Tables"]["service_connection_profiles"]["Insert"] = {
      id: input.id,
      team_id: input.teamId,
      service_type: input.serviceType,
      environment: input.environment,
      supabase_project_ref: input.supabaseProjectRef ?? null,
      status: input.status,
      last_verified_at: input.lastVerifiedAt ? input.lastVerifiedAt.toISOString() : null,
      connection_metadata,
    };

    const { data, error } = await client
      .from("service_connection_profiles")
      .upsert(payload as never, { onConflict: "team_id,service_type,environment" })
      .select("*")
      .single();

    const row = ensureSuccess<ServiceConnectionRow>({ data, error });
    return rowToServiceConnection(row);
  }

  const now = new Date();
  const connections = inMemoryConnections.get(input.teamId) ?? [];
  const existingIndex = connections.findIndex((row) => row.id === input.id);

  if (existingIndex >= 0) {
    const existing = connections[existingIndex];
    const updated: ServiceConnectionRecord = {
      ...existing,
      name: input.name,
      environment: input.environment,
      serviceType: input.serviceType,
      supabaseUrl: input.supabaseUrl,
      supabaseProjectRef: input.supabaseProjectRef ?? null,
      credentialsFingerprint: input.credentialsFingerprint,
      status: input.status,
      lastVerifiedAt: input.lastVerifiedAt ?? existing.lastVerifiedAt,
      lastVerificationMessage: input.lastVerificationMessage ?? existing.lastVerificationMessage,
      updatedAt: now,
    };
    connections.splice(existingIndex, 1, updated);
    inMemoryConnections.set(input.teamId, connections);
    return { ...updated };
  }

  const created: ServiceConnectionRecord = {
    id: input.id ?? randomUUID(),
    teamId: input.teamId,
    name: input.name,
    environment: input.environment,
    serviceType: input.serviceType,
    supabaseUrl: input.supabaseUrl,
    supabaseProjectRef: input.supabaseProjectRef ?? null,
    status: input.status,
    credentialsFingerprint: input.credentialsFingerprint,
    lastVerifiedAt: input.lastVerifiedAt ?? null,
    lastVerificationMessage: input.lastVerificationMessage,
    createdAt: now,
    updatedAt: now,
  };

  inMemoryConnections.set(input.teamId, [...connections, created]);
  return { ...created };
}

export async function persistVerificationResult(
  input: VerificationPersistenceInput
): Promise<ServiceConnectionRecord | null> {
  if (!shouldUseMemory()) {
    const client = getAdminClient();

    const { data: existingRow, error: fetchError } = await client
      .from("service_connection_profiles")
      .select("*")
      .eq("id", input.id)
      .eq("team_id", input.teamId)
      .maybeSingle();

    if (fetchError) {
      throw new Error(fetchError.message ?? "Failed to load service connection for update");
    }

    if (!existingRow) {
      return null;
    }

    const metadata = sanitizeMetadata((existingRow as ServiceConnectionRow).connection_metadata);

    if (typeof input.message !== "undefined") {
      metadata.lastVerificationMessage = input.message ?? undefined;
    }

    const updatePayload: Partial<ServiceConnectionRow> = {
      status: input.status,
      last_verified_at: input.lastVerifiedAt ? input.lastVerifiedAt.toISOString() : null,
      connection_metadata: metadata,
    };

    const { data, error } = await client
      .from("service_connection_profiles")
      .update(updatePayload as never)
      .eq("id", input.id)
      .eq("team_id", input.teamId)
      .select("*")
      .single();

    const row = ensureSuccess<ServiceConnectionRow>({ data, error });
    return rowToServiceConnection(row);
  }

  const rows = inMemoryConnections.get(input.teamId) ?? [];
  const index = rows.findIndex((row) => row.id === input.id);
  if (index < 0) {
    return null;
  }

  const updated: ServiceConnectionRecord = {
    ...rows[index],
    status: input.status,
    lastVerifiedAt: input.lastVerifiedAt,
    lastVerificationMessage: input.message ?? rows[index].lastVerificationMessage,
    updatedAt: new Date(),
  };

  rows.splice(index, 1, updated);
  inMemoryConnections.set(input.teamId, rows);

  return { ...updated };
}

export async function recordVerificationRun(
  teamId: string,
  record: VerificationRecord
): Promise<void> {
  if (!record.connectionId) {
    throw new Error("Verification records require a connectionId");
  }

  if (!shouldUseMemory()) {
    const client = getAdminClient();

    const { data: connectionRow, error: connectionError } = await client
      .from("service_connection_profiles")
      .select("id, team_id")
      .eq("id", record.connectionId)
      .maybeSingle();

    if (connectionError) {
      throw new Error(connectionError.message ?? "Failed to validate service connection");
    }

    const normalizedConnection = connectionRow as Pick<
      ServiceConnectionRow,
      "id" | "team_id"
    > | null;

    if (!normalizedConnection || normalizedConnection.team_id !== teamId) {
      throw new Error("Service connection does not belong to the provided team");
    }

    const payload: Database["public"]["Tables"]["diagnostic_test_runs"]["Insert"] = {
      service_connection_id: record.connectionId,
      scenario: record.scenario ?? "other",
      status: record.status,
      trigger_source: record.trigger ?? "manual",
      executed_by: record.executedBy ?? null,
      started_at: record.executedAt.toISOString(),
      completed_at: record.completedAt ? record.completedAt.toISOString() : null,
      duration_ms: record.durationMs ?? null,
      evidence_url: record.evidenceUrl ?? null,
      notes: record.notes ?? null,
    };

    const { error } = await client.from("diagnostic_test_runs").insert(payload as never);
    if (error) {
      throw new Error(error.message ?? "Failed to record diagnostic run");
    }
    return;
  }

  const entries = inMemoryVerifications.get(teamId) ?? [];
  entries.push({
    ...record,
    executedAt: new Date(record.executedAt),
    completedAt: record.completedAt ? new Date(record.completedAt) : (record.completedAt ?? null),
  });
  inMemoryVerifications.set(teamId, entries);
}

export async function getVerificationHistory(teamId: string): Promise<VerificationRecord[]> {
  if (!shouldUseMemory()) {
    const client = getAdminClient();
    const { data, error } = await client
      .from("diagnostic_test_runs")
      .select("*, service_connection_profiles!inner(team_id)")
      .eq("service_connection_profiles.team_id", teamId)
      .order("started_at", { ascending: false });

    const rows = ensureSuccess<
      Array<DiagnosticRunRow & { service_connection_profiles: { team_id: string } }>
    >({ data, error }, []);

    return rows.map((row) => ({
      connectionId: row.service_connection_id,
      scenario: row.scenario,
      trigger: row.trigger_source,
      executedBy: row.executed_by ?? null,
      status: row.status,
      durationMs: row.duration_ms ?? null,
      evidenceUrl: row.evidence_url ?? null,
      notes: row.notes ?? null,
      executedAt: new Date(row.started_at),
      completedAt: row.completed_at ? new Date(row.completed_at) : null,
    }));
  }

  return (inMemoryVerifications.get(teamId) ?? []).map((entry) => ({
    ...entry,
    executedAt: new Date(entry.executedAt),
    completedAt: entry.completedAt ? new Date(entry.completedAt) : (entry.completedAt ?? null),
  }));
}

export function toServiceConnectionProfile(
  record: ServiceConnectionRecord
): ServiceConnectionProfile {
  return {
    id: record.id,
    teamId: record.teamId,
    serviceType: record.serviceType,
    environment: record.environment,
    supabaseProjectRef: record.supabaseProjectRef,
    status: record.status,
    lastVerifiedAt: record.lastVerifiedAt,
    connectionMetadata: {
      displayName: record.name,
      url: record.supabaseUrl,
      lastVerificationMessage: record.lastVerificationMessage,
    },
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  } as ServiceConnectionProfile;
}
