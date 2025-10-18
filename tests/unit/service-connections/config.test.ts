import { describe, expect, it } from "vitest";

import {
  fingerprintCredentials,
  validateServiceConnectionInput,
} from "$lib/server/service-connections/validation";
import type {
  ServiceConnectionEnvironment,
  ServiceConnectionServiceType,
} from "$lib/types/service-connections";

const baseConfig = {
  environment: "development" as ServiceConnectionEnvironment,
  supabaseUrl: "https://example.supabase.co",
  supabaseServiceRoleKey: "service-role-key",
  supabaseAnonKey: "anon-key",
  diagnosticsBucket: "diagnostics-artifacts",
  heartbeatIntervalMinutes: 5,
  verificationTimeoutMs: 30_000,
  maxVerificationAgeMinutes: 30,
};

const validInput = {
  id: "5c0f0f7e-7a4a-4d0f-8e3f-c4f8eeefc001",
  name: "  Production Supabase  ",
  environment: "production" as ServiceConnectionEnvironment,
  serviceType: "supabase" as ServiceConnectionServiceType,
  supabaseUrl: "https://production.supabase.co",
  supabaseProjectRef: "cosplans-prod",
  supabaseServiceRoleKey: "prod-service-role",
  supabaseAnonKey: "prod-anon-key",
  activationRequested: true,
};

describe("validateServiceConnectionInput", () => {
  it("accepts valid supabase credentials and allows activation when recently verified", () => {
    const now = new Date("2025-10-17T12:00:00Z");
    const fingerprint = fingerprintCredentials({
      serviceType: validInput.serviceType,
      supabaseUrl: validInput.supabaseUrl,
      supabaseServiceRoleKey: validInput.supabaseServiceRoleKey,
      supabaseAnonKey: validInput.supabaseAnonKey,
    });

    const result = validateServiceConnectionInput(validInput, {
      config: baseConfig,
      now,
      existing: {
        id: validInput.id,
        environment: validInput.environment,
        status: "active",
        lastVerifiedAt: new Date(now.getTime() - 5 * 60 * 1000),
        credentialsFingerprint: fingerprint,
      },
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.requiresVerification).toBe(false);
    expect(result.data.activationPermitted).toBe(true);
    expect(result.data.normalized.name).toBe("Production Supabase");
    expect(result.data.normalized.supabaseProjectRef).toBe("cosplans-prod");
  });

  it("rejects unsupported environments", () => {
    const result = validateServiceConnectionInput(
      {
        ...validInput,
        environment: "qa" as ServiceConnectionEnvironment,
      },
      { config: baseConfig }
    );

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.environment).toMatch(/expected/i);
  });

  it("requires retesting when credentials change", () => {
    const now = new Date("2025-10-17T12:30:00Z");
    const fingerprint = fingerprintCredentials({
      serviceType: validInput.serviceType,
      supabaseUrl: validInput.supabaseUrl,
      supabaseServiceRoleKey: validInput.supabaseServiceRoleKey,
      supabaseAnonKey: validInput.supabaseAnonKey,
    });

    const result = validateServiceConnectionInput(
      {
        ...validInput,
        supabaseServiceRoleKey: "rotated-key",
      },
      {
        config: baseConfig,
        now,
        existing: {
          id: validInput.id,
          environment: validInput.environment,
          status: "active",
          lastVerifiedAt: new Date(now.getTime() - 10 * 60 * 1000),
          credentialsFingerprint: fingerprint,
        },
      }
    );

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.requiresVerification).toBe(true);
    expect(result.data.activationPermitted).toBe(false);
    expect(result.data.blockingReasons).toContain("supabase credentials changed");
  });

  it("fails when required credentials are missing", () => {
    const result = validateServiceConnectionInput(
      {
        ...validInput,
        supabaseServiceRoleKey: "",
      },
      { config: baseConfig }
    );

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.supabaseServiceRoleKey).toMatch(/required/i);
  });
});
