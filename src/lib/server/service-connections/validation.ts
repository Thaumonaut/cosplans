import { createHash } from "node:crypto";

import { z } from "zod";

import {
  loadServiceConnectionsConfig,
  type ServiceConnectionsConfig,
} from "$lib/server/config/service-connections";
import {
  serviceConnectionEnvironments,
  serviceConnectionServiceTypes,
  type ServiceConnectionEnvironment,
  type ServiceConnectionServiceType,
} from "$lib/types/service-connections";

const stringEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values as unknown as [string, ...string[]]);

const formSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string({ required_error: "Connection name is required" })
    .min(1, "Connection name is required")
    .max(120, "Connection name must be under 120 characters")
    .transform((value) => value.trim()),
  environment: stringEnum(serviceConnectionEnvironments),
  serviceType: stringEnum(serviceConnectionServiceTypes),
  supabaseUrl: z
    .string({ required_error: "Supabase URL is required" })
    .url("Supabase URL must be a valid URL"),
  supabaseProjectRef: z
    .string({ required_error: "Project reference is required" })
    .min(1, "Project reference is required")
    .max(160, "Project reference must be under 160 characters")
    .transform((value) => value.trim()),
  supabaseServiceRoleKey: z
    .string({ required_error: "Supabase service role key is required" })
    .min(1, "Supabase service role key is required"),
  supabaseAnonKey: z
    .string({ required_error: "Supabase anon key is required" })
    .min(1, "Supabase anon key is required"),
  activationRequested: z.coerce.boolean().default(false),
});

export type ServiceConnectionFormInput = z.input<typeof formSchema>;

export interface ValidationContext {
  config?: ServiceConnectionsConfig;
  now?: Date;
  existing?: ExistingConnectionState | null;
}

export interface ExistingConnectionState {
  id: string;
  environment: ServiceConnectionEnvironment;
  status: "inactive" | "pending_verification" | "active" | "error";
  lastVerifiedAt: Date | null;
  credentialsFingerprint: string | null;
}

export interface ValidationSuccess {
  success: true;
  data: {
    normalized: ServiceConnectionForm;
    requiresVerification: boolean;
    activationPermitted: boolean;
    blockingReasons: string[];
    credentialsFingerprint: string;
  };
}

export interface ValidationFailure {
  success: false;
  errors: Record<string, string>;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export type ServiceConnectionForm = z.infer<typeof formSchema>;

export function validateServiceConnectionInput(
  input: ServiceConnectionFormInput,
  context: ValidationContext = {}
): ValidationResult {
  const parsed = formSchema.safeParse(input);

  if (!parsed.success) {
    const errors = Object.fromEntries(
      parsed.error.errors.map((err) => [err.path.join("."), err.message])
    );
    return { success: false, errors };
  }

  const config = context.config ?? loadServiceConnectionsConfig();
  const now = context.now ?? new Date();
  const normalized = parsed.data;

  const credentialsFingerprint = fingerprintCredentials({
    serviceType: normalized.serviceType as ServiceConnectionServiceType,
    supabaseUrl: normalized.supabaseUrl,
    supabaseServiceRoleKey: normalized.supabaseServiceRoleKey,
    supabaseAnonKey: normalized.supabaseAnonKey,
  });

  const blockingReasons: string[] = [];

  let requiresVerification = true;

  if (context.existing) {
    const existing = context.existing;

    if (existing.environment !== normalized.environment) {
      blockingReasons.push("environment changed");
    } else if (existing.credentialsFingerprint !== credentialsFingerprint) {
      blockingReasons.push("supabase credentials changed");
    }

    const maxAgeMs = config.maxVerificationAgeMinutes * 60 * 1000;
    const lastVerified = existing.lastVerifiedAt?.getTime() ?? 0;

    if (!lastVerified || now.getTime() - lastVerified > maxAgeMs) {
      blockingReasons.push("verification expired");
    }

    requiresVerification = blockingReasons.length > 0;
  }

  const activationPermitted = !requiresVerification && normalized.activationRequested;

  return {
    success: true,
    data: {
      normalized,
      requiresVerification,
      activationPermitted,
      blockingReasons,
      credentialsFingerprint,
    },
  };
}

export function fingerprintCredentials(input: {
  serviceType: ServiceConnectionServiceType;
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  supabaseAnonKey?: string | null;
}): string {
  const hash = createHash("sha256");
  hash.update(input.serviceType);
  hash.update("|");
  hash.update(input.supabaseUrl.trim());
  hash.update("|");
  hash.update(input.supabaseServiceRoleKey.trim());
  hash.update("|");
  hash.update((input.supabaseAnonKey ?? "").trim());
  return hash.digest("hex");
}

export function describeBlockingReasons(reasons: string[]): string {
  if (reasons.length === 0) {
    return "";
  }

  if (reasons.length === 1) {
    return reasons[0];
  }

  return `${reasons.slice(0, -1).join(", ")} and ${reasons.at(-1)}`;
}
