import { env as dynamicEnv } from "$env/dynamic/private";
import { COSPLANS_ENVIRONMENT, DIAGNOSTICS_BUCKET, SUPABASE_ANON_KEY } from "$env/static/private";
import { z } from "zod";

import { resolveCredentials, type ResolvedCredentials } from "$lib/server/supabase/admin-client";

const ENV_ENUM = z.enum(["development", "staging", "production", "test"]);

const ServiceConnectionsConfigSchema = z.object({
  environment: ENV_ENUM,
  supabaseUrl: z.string().url({ message: "Supabase URL must be a valid URL" }),
  supabaseServiceRoleKey: z.string().min(1, "Supabase service role key is required"),
  supabaseAnonKey: z.string().min(1, "Supabase anon key is required"),
  diagnosticsBucket: z.string().min(1, "Diagnostics bucket name is required"),
  heartbeatIntervalMinutes: z.coerce.number().int().positive().default(5),
  verificationTimeoutMs: z.coerce.number().int().positive().default(30_000),
  maxVerificationAgeMinutes: z.coerce.number().int().positive().default(30),
});

export type ServiceConnectionsConfig = z.infer<typeof ServiceConnectionsConfigSchema>;

export interface ServiceConnectionsConfigOverrides {
  environment?: string;
  supabaseUrl?: string;
  supabaseServiceRoleKey?: string;
  supabaseAnonKey?: string;
  diagnosticsBucket?: string;
  heartbeatIntervalMinutes?: number | string;
  verificationTimeoutMs?: number | string;
  maxVerificationAgeMinutes?: number | string;
  disableCache?: boolean;
}

let cachedConfig: ServiceConnectionsConfig | null = null;

export function loadServiceConnectionsConfig(
  overrides: ServiceConnectionsConfigOverrides = {}
): ServiceConnectionsConfig {
  if (cachedConfig && Object.keys(overrides).length === 0) {
    return cachedConfig;
  }

  const environment = ENV_ENUM.parse(
    overrides.environment ??
      dynamicEnv.COSPLANS_ENVIRONMENT ??
      COSPLANS_ENVIRONMENT ??
      "development"
  );
  const envSuffix = environment.toUpperCase();

  const credentials = resolveCredentials({
    environment,
    supabaseUrl: overrides.supabaseUrl,
    serviceRoleKey: overrides.supabaseServiceRoleKey,
  });

  const configInput = {
    environment,
    supabaseUrl: overrides.supabaseUrl ?? credentials.url,
    supabaseServiceRoleKey: overrides.supabaseServiceRoleKey ?? credentials.serviceRoleKey,
    supabaseAnonKey:
      overrides.supabaseAnonKey ??
      dynamicEnv[`SUPABASE_ANON_KEY_${envSuffix}`] ??
      SUPABASE_ANON_KEY ??
      dynamicEnv.SUPABASE_ANON_KEY,
    diagnosticsBucket:
      overrides.diagnosticsBucket ??
      dynamicEnv[`DIAGNOSTICS_BUCKET_${envSuffix}`] ??
      DIAGNOSTICS_BUCKET ??
      dynamicEnv.DIAGNOSTICS_BUCKET,
    heartbeatIntervalMinutes:
      overrides.heartbeatIntervalMinutes ??
      dynamicEnv[`HEARTBEAT_INTERVAL_MINUTES_${envSuffix}`] ??
      dynamicEnv.HEARTBEAT_INTERVAL_MINUTES,
    verificationTimeoutMs:
      overrides.verificationTimeoutMs ??
      dynamicEnv[`SERVICE_VERIFICATION_TIMEOUT_MS_${envSuffix}`] ??
      dynamicEnv.SERVICE_VERIFICATION_TIMEOUT_MS,
    maxVerificationAgeMinutes:
      overrides.maxVerificationAgeMinutes ??
      dynamicEnv[`MAX_VERIFICATION_AGE_MINUTES_${envSuffix}`] ??
      dynamicEnv.MAX_VERIFICATION_AGE_MINUTES,
  } satisfies ServiceConnectionsConfigOverrides;

  const parsed = ServiceConnectionsConfigSchema.parse(configInput);

  if (!overrides.disableCache) {
    cachedConfig = parsed;
  }

  return parsed;
}

export function clearServiceConnectionsConfigCache(): void {
  cachedConfig = null;
}

export function describeCredentials(
  overrides: ServiceConnectionsConfigOverrides = {}
): ResolvedCredentials {
  return resolveCredentials({
    environment: overrides.environment,
    supabaseUrl: overrides.supabaseUrl,
    serviceRoleKey: overrides.supabaseServiceRoleKey,
  });
}
