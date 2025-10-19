import { saveDiagnosticScenarioResult } from "$lib/server/service-connections/diagnostics.repository";
import type {
  DiagnosticRunStatus,
  DiagnosticScenario,
  DiagnosticTrigger,
} from "$lib/types/service-connections";

export interface RunDiagnosticsRequest {
  teamId: string;
  serviceConnectionId: string;
  supabaseUrl: string;
  scenarios: DiagnosticScenario[];
  trigger: DiagnosticTrigger;
  executedBy?: string | null;
}

export interface RunDiagnosticsOptions {
  timeoutMs?: number;
  fetch?: typeof fetch;
  now?: () => Date;
}

export interface ScenarioResult {
  scenario: DiagnosticScenario;
  status: DiagnosticRunStatus;
  durationMs: number | null;
  startedAt: Date;
  completedAt: Date;
  notes?: string;
}

export interface DiagnosticsRunResult {
  status: DiagnosticRunStatus;
  results: ScenarioResult[];
  startedAt: Date;
  completedAt: Date;
}

export async function runDiagnostics(
  request: RunDiagnosticsRequest,
  options: RunDiagnosticsOptions = {}
): Promise<DiagnosticsRunResult> {
  const fetchImpl = options.fetch ?? fetch;
  const now = options.now ?? (() => new Date());
  const timeoutMs = Math.max(1, options.timeoutMs ?? DEFAULT_SCENARIO_TIMEOUT_MS);
  const useSimulation = isTestMode();

  const results: ScenarioResult[] = [];
  const runStartedAt = now();
  let lastCompletedAt = runStartedAt;
  let overallStatus: DiagnosticRunStatus = "pass";

  for (const scenario of request.scenarios) {
    const scenarioStartedAt = now();
    let status: DiagnosticRunStatus = "pass";
    let notes: string | undefined;
    let completedAt = scenarioStartedAt;
    let durationMs = 0;

    if (useSimulation) {
      const simulation = simulateScenarioOutcome(scenario, timeoutMs, now);
      status = simulation.status;
      notes = simulation.notes;
      completedAt = simulation.completedAt;
      durationMs = simulation.durationMs;
    } else {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const endpoint = buildScenarioEndpoint(request.supabaseUrl, scenario);
        const response = await fetchImpl(endpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            serviceConnectionId: request.serviceConnectionId,
            trigger: request.trigger,
            executedBy: request.executedBy ?? null,
          }),
          signal: controller.signal,
        });

        completedAt = now();

        if (!response.ok) {
          status = "fail";
          notes = await formatFailureNotes(response);
        } else {
          notes = await formatSuccessNotes(response);
          status = "pass";
        }
      } catch (error) {
        completedAt = now();
        if (isAbortError(error)) {
          status = "blocked";
          notes = `Scenario ${scenario} timed out after ${timeoutMs}ms`;
        } else {
          status = "fail";
          notes = `Scenario ${scenario} failed: ${error instanceof Error ? error.message : String(error)}`;
        }
      }

      clearTimeout(timer);
      durationMs = Math.max(0, completedAt.getTime() - scenarioStartedAt.getTime());
    }

    await saveDiagnosticScenarioResult({
      teamId: request.teamId,
      serviceConnectionId: request.serviceConnectionId,
      scenario,
      status,
      trigger: request.trigger,
      executedBy: request.executedBy ?? null,
      startedAt: scenarioStartedAt,
      completedAt,
      durationMs,
      evidenceUrl: null,
      notes,
    });

    results.push({
      scenario,
      status,
      durationMs,
      startedAt: scenarioStartedAt,
      completedAt,
      notes,
    });

    lastCompletedAt = completedAt;

    if (status === "fail") {
      overallStatus = "fail";
    } else if (status === "blocked" && overallStatus !== "fail") {
      overallStatus = "blocked";
    }
  }

  return {
    status: results.length === 0 ? "blocked" : overallStatus,
    results,
    startedAt: runStartedAt,
    completedAt: lastCompletedAt,
  };
}

const DEFAULT_SCENARIO_TIMEOUT_MS = 30_000;

function isTestMode(): boolean {
  return process.env.COSPLANS_TEST_MODE === "1";
}

const SIMULATED_OUTCOMES: Record<
  DiagnosticScenario,
  { status: DiagnosticRunStatus; notes?: string }
> = {
  latency_spike: {
    status: "pass",
    notes: "Latency within acceptable range (simulated).",
  },
  timeout: {
    status: "fail",
    notes: "Request timed out after 30s (simulated).",
  },
  malformed_payload: {
    status: "fail",
    notes: "Service responded with malformed payload (simulated).",
  },
  permission_denied: {
    status: "fail",
    notes: "Permission denied for service diagnostics (simulated).",
  },
  upstream_outage: {
    status: "blocked",
    notes: "Upstream outage reported by monitoring (simulated).",
  },
  other: {
    status: "pass",
    notes: "No issues detected (simulated).",
  },
};

const SIMULATED_DURATIONS: Partial<Record<DiagnosticScenario, number>> = {
  latency_spike: 1200,
  timeout: 2800,
  malformed_payload: 1800,
  permission_denied: 1500,
  upstream_outage: 3200,
  other: 900,
};

function simulateScenarioOutcome(
  scenario: DiagnosticScenario,
  timeoutMs: number,
  now: () => Date
): { status: DiagnosticRunStatus; notes?: string; durationMs: number; completedAt: Date } {
  const outcome = SIMULATED_OUTCOMES[scenario] ?? { status: "pass" as DiagnosticRunStatus };
  const started = now();
  const baseDuration = SIMULATED_DURATIONS[scenario] ?? 1500;
  const simulatedDuration = Math.min(timeoutMs - 1, baseDuration);
  const completed = new Date(started.getTime() + simulatedDuration);
  return {
    status: outcome.status,
    notes: outcome.notes,
    durationMs: simulatedDuration,
    completedAt: completed,
  };
}

function buildScenarioEndpoint(baseUrl: string, scenario: DiagnosticScenario): string {
  const url = new URL(baseUrl);
  url.pathname = `/diagnostics/${scenario}`;
  return url.toString();
}

async function formatFailureNotes(response: Response): Promise<string> {
  const statusText = `${response.status} ${response.statusText ?? ""}`.trim();
  try {
    const payload = await response.json();
    if (payload && typeof payload === "object") {
      const message =
        "message" in payload && typeof payload.message === "string" ? payload.message : undefined;
      const code = "code" in payload && typeof payload.code === "string" ? payload.code : undefined;
      return [statusText, code, message].filter(Boolean).join(" · ");
    }
    return statusText;
  } catch {
    try {
      const text = await response.text();
      return text ? `${statusText} · ${text}` : statusText;
    } catch {
      return statusText;
    }
  }
}

async function formatSuccessNotes(response: Response): Promise<string | undefined> {
  try {
    const payload = await response.json();
    if (payload && typeof payload === "object") {
      if ("message" in payload && typeof payload.message === "string") {
        return payload.message;
      }
      if ("status" in payload && typeof payload.status === "string") {
        return payload.status;
      }
    }
  } catch {
    // ignore
  }
  return undefined;
}

function isAbortError(error: unknown): boolean {
  if (!error) return false;
  if (error instanceof DOMException) {
    return error.name === "AbortError";
  }
  if (error instanceof Error) {
    return error.name === "AbortError";
  }
  return false;
}
