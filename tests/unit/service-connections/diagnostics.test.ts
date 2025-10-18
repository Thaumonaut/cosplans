import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse, delay } from "msw";

import type { DiagnosticScenario } from "$lib/types/service-connections";

const saveScenarioResult = vi.fn();

vi.mock("$lib/server/service-connections/diagnostics.repository", () => ({
  saveDiagnosticScenarioResult: saveScenarioResult,
}));

describe("diagnostics runner", () => {
  const server = setupServer();

  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  const baseRequest = {
    teamId: "fe6c2b92-bdad-45dd-9935-089bea879c42",
    serviceConnectionId: "4a6a452a-96a5-4f9f-9b36-86c3cfece1a2",
    supabaseUrl: "https://service.cosplans.test",
    trigger: "manual" as const,
    executedBy: "96f53de0-5482-4374-83ab-20a0e6b4f52a",
  };

  it("records a passing scenario result", async () => {
    const scenario: DiagnosticScenario = "latency_spike";

    server.use(
      http.post(`${baseRequest.supabaseUrl}/diagnostics/${scenario}`, () =>
        HttpResponse.json({ status: "ok" })
      )
    );

    const { runDiagnostics } = await import("$lib/server/service-connections/diagnostics-runner");

    const result = await runDiagnostics({
      ...baseRequest,
      scenarios: [scenario],
    });

    expect(result.status).toBe("pass");
    expect(result.results).toHaveLength(1);
    expect(result.results[0].status).toBe("pass");
    expect(result.results[0].scenario).toBe(scenario);

    expect(saveScenarioResult).toHaveBeenCalledTimes(1);
    expect(saveScenarioResult).toHaveBeenCalledWith(
      expect.objectContaining({
        serviceConnectionId: baseRequest.serviceConnectionId,
        teamId: baseRequest.teamId,
        scenario,
        status: "pass",
        trigger: baseRequest.trigger,
      })
    );
  });

  it("records a failed scenario with error details", async () => {
    const scenario: DiagnosticScenario = "timeout";

    server.use(
      http.post(`${baseRequest.supabaseUrl}/diagnostics/${scenario}`, () =>
        HttpResponse.json(
          { status: "error", code: "TIMEOUT", message: "Service timed out" },
          { status: 504 }
        )
      )
    );

    const { runDiagnostics } = await import("$lib/server/service-connections/diagnostics-runner");

    const result = await runDiagnostics({
      ...baseRequest,
      scenarios: [scenario],
    });

    expect(result.status).toBe("fail");
    expect(result.results[0].status).toBe("fail");
    expect(result.results[0].notes).toMatch(/504/);

    expect(saveScenarioResult).toHaveBeenCalledWith(
      expect.objectContaining({
        scenario,
        status: "fail",
        notes: expect.stringContaining("504"),
      })
    );
  });

  it("marks scenario as blocked when execution exceeds timeout", async () => {
    const scenario: DiagnosticScenario = "malformed_payload";

    server.use(
      http.post(`${baseRequest.supabaseUrl}/diagnostics/${scenario}`, async () => {
        await delay(50);
        return HttpResponse.json({ status: "ok" });
      })
    );

    const { runDiagnostics } = await import("$lib/server/service-connections/diagnostics-runner");

    const result = await runDiagnostics(
      {
        ...baseRequest,
        scenarios: [scenario],
      },
      { timeoutMs: 10 }
    );

    expect(result.status).toBe("blocked");
    expect(result.results[0].status).toBe("blocked");
    expect(result.results[0].notes).toMatch(/timed out/i);

    expect(saveScenarioResult).toHaveBeenCalledWith(
      expect.objectContaining({
        scenario,
        status: "blocked",
        notes: expect.stringMatching(/timed out/i),
      })
    );
  });
});
