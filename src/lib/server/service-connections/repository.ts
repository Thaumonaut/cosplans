import { randomUUID } from "node:crypto";

import type {
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
  supabaseProjectRef: string;
  status: ServiceConnectionStatus;
  credentialsFingerprint: string;
  lastVerifiedAt: Date | null;
  lastVerificationMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VerificationRecord {
  scenario?: string;
  status: "pass" | "fail" | "blocked";
  durationMs?: number | null;
  notes?: string | null;
  executedAt: Date;
}

const inMemoryConnections = new Map<string, ServiceConnectionRecord[]>();
const inMemoryVerifications = new Map<string, VerificationRecord[]>();

const shouldUseMemory = () =>
  process.env.COSPLANS_USE_FAKE_SUPABASE === "1" || process.env.NODE_ENV === "test";

export interface SaveServiceConnectionInput {
  id?: string;
  teamId: string;
  name: string;
  environment: ServiceConnectionEnvironment;
  serviceType: ServiceConnectionServiceType;
  supabaseUrl: string;
  supabaseProjectRef: string;
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

export async function listServiceConnections(
  teamId: string
): Promise<ServiceConnectionRecord[]> {
  if (!shouldUseMemory()) {
    // TODO: Implement Supabase-backed repository
  }

  const rows = inMemoryConnections.get(teamId) ?? [];
  return rows.map((row) => ({ ...row }));
}

export async function saveServiceConnection(
  input: SaveServiceConnectionInput
): Promise<ServiceConnectionRecord> {
  if (!shouldUseMemory()) {
    // TODO: Implement Supabase-backed repository
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
      supabaseProjectRef: input.supabaseProjectRef,
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
    supabaseProjectRef: input.supabaseProjectRef,
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
    // TODO: Implement Supabase-backed repository
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
  const entries = inMemoryVerifications.get(teamId) ?? [];
  entries.push(record);
  inMemoryVerifications.set(teamId, entries);
}

export async function getVerificationHistory(teamId: string): Promise<VerificationRecord[]> {
  return (inMemoryVerifications.get(teamId) ?? []).map((entry) => ({ ...entry }));
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
