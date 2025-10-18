import { z } from "zod";

/**
 * Enumerations
 */
export const serviceConnectionServiceTypes = [
  "supabase",
  "google_calendar",
  "google_maps",
  "email",
  "external_api",
] as const;
export const serviceConnectionEnvironments = ["development", "staging", "production"] as const;
export const serviceConnectionStatuses = [
  "inactive",
  "pending_verification",
  "active",
  "error",
] as const;
export const diagnosticScenarios = [
  "latency_spike",
  "timeout",
  "malformed_payload",
  "permission_denied",
  "upstream_outage",
  "other",
] as const;
export const diagnosticRunStatuses = ["pass", "fail", "blocked"] as const;
export const diagnosticTriggers = ["manual", "scheduled"] as const;
export const errorEventSeverities = ["info", "warning", "error", "critical"] as const;
export const serviceHealthStatuses = ["active", "degraded", "error"] as const;

/**
 * Zod schemas and TypeScript types
 */
export const serviceConnectionProfileSchema = z.object({
  id: z.string().uuid(),
  teamId: z.string().uuid(),
  serviceType: z.enum(serviceConnectionServiceTypes),
  environment: z.enum(serviceConnectionEnvironments),
  supabaseProjectRef: z.string().nullable(),
  status: z.enum(serviceConnectionStatuses),
  lastVerifiedAt: z.coerce.date().nullable(),
  connectionMetadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const diagnosticRunSchema = z.object({
  id: z.string().uuid(),
  serviceConnectionId: z.string().uuid(),
  scenario: z.enum(diagnosticScenarios),
  status: z.enum(diagnosticRunStatuses),
  trigger: z.enum(diagnosticTriggers).default("manual"),
  executedBy: z.string().uuid().nullable(),
  startedAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  durationMs: z.number().int().nonnegative().nullable(),
  evidenceUrl: z.string().url().nullable(),
  notes: z.string().nullable(),
});

export const errorEventSchema = z.object({
  id: z.string().uuid(),
  serviceConnectionId: z.string().uuid(),
  correlationId: z.string().uuid(),
  severity: z.enum(errorEventSeverities),
  errorCode: z.string(),
  userMessage: z.string().max(280),
  operatorContext: z.record(z.string(), z.unknown()).default({}),
  occurredAt: z.coerce.date(),
  acknowledgedAt: z.coerce.date().nullable(),
  acknowledgedBy: z.string().uuid().nullable(),
});

export const healthSnapshotSchema = z.object({
  serviceConnectionId: z.string().uuid(),
  currentStatus: z.enum(serviceHealthStatuses),
  uptimePercent24h: z.number().min(0).max(100),
  recentFailures: z.number().int().nonnegative(),
  lastHeartbeatAt: z.coerce.date().nullable(),
  lastErrorEventId: z.string().uuid().nullable(),
  lastLatencyMs: z.number().int().nonnegative().nullable().default(null),
  consecutiveFailures: z.number().int().nonnegative().default(0),
  lastErrorCode: z.string().nullable().default(null),
});

export type ServiceConnectionServiceType = (typeof serviceConnectionServiceTypes)[number];
export type ServiceConnectionEnvironment = (typeof serviceConnectionEnvironments)[number];
export type ServiceConnectionStatus = (typeof serviceConnectionStatuses)[number];
export type DiagnosticScenario = (typeof diagnosticScenarios)[number];
export type DiagnosticRunStatus = (typeof diagnosticRunStatuses)[number];
export type DiagnosticTrigger = (typeof diagnosticTriggers)[number];
export type ErrorEventSeverity = (typeof errorEventSeverities)[number];
export type ServiceHealthStatus = (typeof serviceHealthStatuses)[number];

export type ServiceConnectionProfile = z.infer<typeof serviceConnectionProfileSchema>;
export type DiagnosticRun = z.infer<typeof diagnosticRunSchema>;
export type ErrorEvent = z.infer<typeof errorEventSchema>;
export type HealthSnapshot = z.infer<typeof healthSnapshotSchema>;

/**
 * Helpers
 */
export const isActionableError = (severity: ErrorEventSeverity): boolean =>
  severity === "error" || severity === "critical";

export const defaultConnectionMetadata = (): Record<string, unknown> => ({
  origin: "cosplans",
  version: "1.0.0",
});
