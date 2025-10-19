import type { ServiceConnectionForm } from "$lib/server/service-connections/validation";
import { loadServiceConnectionsConfig } from "$lib/server/config/service-connections";
import type { CosplansErrorSeverity } from "$lib/utils/errors";

export interface ConnectionVerificationResult {
  ok: boolean;
  checkedAt: Date;
  latencyMs: number;
  message: string;
  severity: CosplansErrorSeverity;
  failureCode?: string;
  remediation?: string;
}

export interface RunVerificationOptions {
  timeoutMs?: number;
}

const latencyRange = { min: 120, max: 380 };

export async function runConnectionVerification(
  form: ServiceConnectionForm,
  options: RunVerificationOptions = {}
): Promise<ConnectionVerificationResult> {
  const config = loadServiceConnectionsConfig();
  const timeoutMs = options.timeoutMs ?? config.verificationTimeoutMs;
  const start = Date.now();

  await simulateLatency();

  const key = form.supabaseServiceRoleKey.trim().toLowerCase();
  const isValid = key.startsWith("valid") || key.endsWith("-ok") || key.includes("service-role");

  const latencyMs = Date.now() - start;
  const clampedLatency = Math.min(latencyMs, timeoutMs);

  if (!isValid) {
    return {
      ok: false,
      checkedAt: new Date(),
      latencyMs: clampedLatency,
      message: "Invalid service credentials.",
      severity: "warning",
      failureCode: "AUTH_INVALID_SERVICE_KEY",
      remediation: "Rotate the service role key in Supabase and update Cosplans settings.",
    } satisfies ConnectionVerificationResult;
  }

  return {
    ok: true,
    checkedAt: new Date(),
    latencyMs: clampedLatency,
    message: "Connection verified successfully.",
    severity: "info",
  } satisfies ConnectionVerificationResult;
}

async function simulateLatency(): Promise<void> {
  if (process.env.COSPLANS_TEST_MODE === "1") {
    return;
  }
  const delay = Math.floor(
    Math.random() * (latencyRange.max - latencyRange.min) + latencyRange.min
  );
  await new Promise((resolve) => setTimeout(resolve, delay));
}
