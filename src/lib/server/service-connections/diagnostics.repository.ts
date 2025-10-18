import { randomUUID } from "node:crypto";

import type { SupabaseClient as SupabaseJsClient } from "@supabase/supabase-js";

import { loadServiceConnectionsConfig } from "$lib/server/config/service-connections";
import { getAdminClient } from "$lib/server/supabase/admin-client";
import type { Database } from "$lib/supabase";
import type {
  DiagnosticRunStatus,
  DiagnosticScenario,
  DiagnosticTrigger,
} from "$lib/types/service-connections";

const inMemoryDiagnostics = new Map<string, DiagnosticScenarioRecord[]>();

const shouldUseMemory = () =>
  process.env.COSPLANS_USE_FAKE_SUPABASE === "1" || process.env.NODE_ENV === "test";

export interface DiagnosticEvidencePayload {
  data: string | Uint8Array;
  contentType?: string;
  filename?: string;
}

export interface DiagnosticScenarioPersistenceInput {
  teamId: string;
  serviceConnectionId: string;
  scenario: DiagnosticScenario;
  status: DiagnosticRunStatus;
  trigger: DiagnosticTrigger;
  executedBy?: string | null;
  startedAt: Date;
  completedAt: Date;
  durationMs: number | null;
  notes?: string | null;
  evidenceUrl?: string | null;
  evidence?: DiagnosticEvidencePayload;
}

export async function saveDiagnosticScenarioResult(
  input: DiagnosticScenarioPersistenceInput
): Promise<void> {
  if (shouldUseMemory()) {
    appendInMemory(input.teamId, normalizeRecordForMemory(input));
    return;
  }

  const client = getAdminClient();
  const config = loadServiceConnectionsConfig();

  const evidencePath = await maybeUploadEvidence(client, config.diagnosticsBucket, input);

  const payload: Database["public"]["Tables"]["diagnostic_test_runs"]["Insert"] = {
    service_connection_id: input.serviceConnectionId,
    scenario: input.scenario,
    status: input.status,
    trigger_source: input.trigger,
    executed_by: input.executedBy ?? null,
    started_at: input.startedAt.toISOString(),
    completed_at: input.completedAt.toISOString(),
    duration_ms: input.durationMs ?? null,
    evidence_url: evidencePath ?? input.evidenceUrl ?? null,
    notes: input.notes ?? null,
  };

  const { error } = await client.from("diagnostic_test_runs").insert(payload as never);

  if (error) {
    const details = error.message ? `: ${error.message}` : "";
    throw new Error(`Failed to persist diagnostic scenario result${details}`);
  }

  appendInMemory(
    input.teamId,
    normalizeRecordForMemory(input, evidencePath ?? input.evidenceUrl ?? null)
  );
}

export interface DiagnosticScenarioRecord {
  id: string;
  teamId: string;
  serviceConnectionId: string;
  scenario: DiagnosticScenario;
  status: DiagnosticRunStatus;
  trigger: DiagnosticTrigger;
  executedBy: string | null;
  startedAt: Date;
  completedAt: Date;
  durationMs: number | null;
  evidenceUrl: string | null;
  notes: string | null;
}

export async function listDiagnosticScenarioResults(
  teamId: string
): Promise<DiagnosticScenarioRecord[]> {
  if (shouldUseMemory()) {
    return (inMemoryDiagnostics.get(teamId) ?? []).map((record) => ({
      ...record,
      startedAt: new Date(record.startedAt),
      completedAt: new Date(record.completedAt),
    }));
  }

  const client = getAdminClient();
  const { data, error } = await client
    .from("diagnostic_test_runs")
    .select("*, service_connection_profiles!inner(team_id)")
    .eq("service_connection_profiles.team_id", teamId)
    .order("started_at", { ascending: false });

  if (error) {
    const details = error.message ? `: ${error.message}` : "";
    throw new Error(`Failed to load diagnostic scenario results${details}`);
  }

  const rows =
    (data as Array<
      Database["public"]["Tables"]["diagnostic_test_runs"]["Row"] & {
        service_connection_profiles: { team_id: string };
      }
    >) ?? [];

  return rows.map((row) => ({
    id: row.id ?? randomUUID(),
    teamId,
    serviceConnectionId: row.service_connection_id,
    scenario: row.scenario,
    status: row.status,
    trigger: row.trigger_source,
    executedBy: row.executed_by ?? null,
    startedAt: new Date(row.started_at),
    completedAt: new Date(row.completed_at ?? row.started_at),
    durationMs: row.duration_ms ?? null,
    evidenceUrl: row.evidence_url ?? null,
    notes: row.notes ?? null,
  }));
}

async function maybeUploadEvidence(
  client: DiagnosticsSupabaseClient,
  bucket: string,
  input: DiagnosticScenarioPersistenceInput
): Promise<string | null> {
  if (!input.evidence) {
    return input.evidenceUrl ?? null;
  }

  const path = buildEvidencePath(input);
  const data = ensureBinary(input.evidence.data);
  const contentType = input.evidence.contentType ?? inferContentType(path) ?? "text/plain";

  const { error } = await client.storage.from(bucket).upload(path, data, {
    cacheControl: "3600",
    contentType,
    upsert: true,
  });

  if (error) {
    const details = error.message ? `: ${error.message}` : "";
    throw new Error(`Failed to upload diagnostic evidence${details}`);
  }

  return path;
}

function buildEvidencePath(input: DiagnosticScenarioPersistenceInput): string {
  const baseName =
    input.evidence?.filename ?? `${Date.now()}-${randomUUID()}-${input.scenario}.log`;
  const normalizedBase = baseName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${input.teamId}/${input.serviceConnectionId}/${normalizedBase}`;
}

function ensureBinary(data: string | Uint8Array): Uint8Array {
  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  }
  return data;
}

function inferContentType(path: string): string | null {
  if (path.endsWith(".json")) return "application/json";
  if (path.endsWith(".log")) return "text/plain";
  if (path.endsWith(".txt")) return "text/plain";
  return null;
}

type DiagnosticsSupabaseClient = SupabaseJsClient<Database>;

function appendInMemory(teamId: string, record: DiagnosticScenarioRecord): void {
  const existing = inMemoryDiagnostics.get(teamId) ?? [];
  inMemoryDiagnostics.set(teamId, [record, ...existing]);
}

function normalizeRecordForMemory(
  input: DiagnosticScenarioPersistenceInput,
  evidenceUrl?: string | null
): DiagnosticScenarioRecord {
  return {
    id: randomUUID(),
    teamId: input.teamId,
    serviceConnectionId: input.serviceConnectionId,
    scenario: input.scenario,
    status: input.status,
    trigger: input.trigger,
    executedBy: input.executedBy ?? null,
    startedAt: new Date(input.startedAt),
    completedAt: new Date(input.completedAt),
    durationMs: input.durationMs ?? null,
    evidenceUrl: evidenceUrl ?? input.evidenceUrl ?? null,
    notes: input.notes ?? null,
  };
}
