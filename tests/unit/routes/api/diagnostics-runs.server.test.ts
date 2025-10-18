import type { RequestEvent } from "@sveltejs/kit";
import { afterEach, describe, expect, it, vi } from "vitest";

const runDiagnosticsMock = vi.fn();
const getServiceConnectionByIdMock = vi.fn();

vi.mock("$lib/server/service-connections/diagnostics-runner", () => ({
  runDiagnostics: runDiagnosticsMock,
}));

vi.mock("$lib/server/service-connections/repository", () => ({
  getServiceConnectionById: getServiceConnectionByIdMock,
}));

const importRoute = () => import("../../../../src/routes/api/diagnostics/runs/+server.js");

describe("POST /api/diagnostics/runs", () => {
  afterEach(() => {
    runDiagnosticsMock.mockReset();
    getServiceConnectionByIdMock.mockReset();
    vi.restoreAllMocks();
  });

  it("returns 202 with diagnostics summary when run succeeds", async () => {
    const { POST } = await importRoute();

    const requestBody = {
      serviceConnectionId: "97f5c90b-7d68-4f03-828f-98d71ad8cbe3",
      scenarios: ["latency_spike"],
      trigger: "manual" as const,
      executedBy: "761c8dbd-4f76-4ace-ac13-552201ce1daa",
    };

    getServiceConnectionByIdMock.mockResolvedValue({
      id: requestBody.serviceConnectionId,
      teamId: "team-demo-456",
      name: "Demo",
      environment: "development",
      serviceType: "supabase",
      supabaseUrl: "https://service.cosplans.test",
      supabaseProjectRef: null,
      status: "active",
      credentialsFingerprint: "abc123",
      lastVerifiedAt: null,
      lastVerificationMessage: undefined,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    });

    runDiagnosticsMock.mockResolvedValue({
      status: "pass",
      startedAt: new Date("2024-02-01T00:00:00Z"),
      completedAt: new Date("2024-02-01T00:00:05Z"),
      results: [
        {
          scenario: "latency_spike",
          status: "pass",
          durationMs: 5000,
          startedAt: new Date("2024-02-01T00:00:00Z"),
          completedAt: new Date("2024-02-01T00:00:05Z"),
          notes: "All good",
        },
      ],
    });

    const request = new Request("http://localhost/api/diagnostics/runs", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const response = await POST({ request } as unknown as RequestEvent);

    expect(response.status).toBe(202);

    const body = await response.json();
    expect(body.serviceConnectionId).toBe(requestBody.serviceConnectionId);
    expect(body.status).toBe("pass");
    expect(body.scenarios).toEqual(["latency_spike"]);
    expect(body.results).toHaveLength(1);
    expect(body.results[0]).toEqual(
      expect.objectContaining({
        scenario: "latency_spike",
        status: "pass",
        durationMs: 5000,
        notes: "All good",
      })
    );

    expect(runDiagnosticsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        teamId: "team-demo-456",
        serviceConnectionId: requestBody.serviceConnectionId,
        scenarios: requestBody.scenarios,
        trigger: requestBody.trigger,
        executedBy: requestBody.executedBy,
      })
    );
  });

  it("returns 404 when service connection is missing", async () => {
    const { POST } = await importRoute();

    getServiceConnectionByIdMock.mockResolvedValue(null);

    const request = new Request("http://localhost/api/diagnostics/runs", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        serviceConnectionId: "11111111-2222-3333-4444-555555555555",
        scenarios: ["timeout"],
        trigger: "manual",
      }),
    });

    const response = await POST({ request } as unknown as RequestEvent);

    expect(response.status).toBe(404);

    const payload = await response.json();
    expect(payload.error).toBe("CONNECTION_NOT_FOUND");
  });

  it("returns 422 when payload fails validation", async () => {
    const { POST } = await importRoute();

    const request = new Request("http://localhost/api/diagnostics/runs", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        serviceConnectionId: "not-a-uuid",
        scenarios: [],
        trigger: "manual",
      }),
    });

    const response = await POST({ request } as unknown as RequestEvent);

    expect(response.status).toBe(422);
    const payload = await response.json();
    expect(payload.error).toBe("INVALID_REQUEST");
    expect(payload.issues.fieldErrors?.serviceConnectionId).toBeDefined();
  });

  it("returns 400 when body is not valid JSON", async () => {
    const { POST } = await importRoute();

    const request = new Request("http://localhost/api/diagnostics/runs", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: '{"malformed": true',
    });

    const response = await POST({ request } as unknown as RequestEvent);
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.error).toBe("INVALID_JSON_BODY");
  });

  it("returns 500 when diagnostics runner throws", async () => {
    const { POST } = await importRoute();

    vi.spyOn(console, "error").mockImplementation(() => undefined);

    getServiceConnectionByIdMock.mockResolvedValue({
      id: "11111111-2222-3333-4444-555555555555",
      teamId: "team-demo-456",
      name: "Demo",
      environment: "development",
      serviceType: "supabase",
      supabaseUrl: "https://service.cosplans.test",
      supabaseProjectRef: null,
      status: "active",
      credentialsFingerprint: "abc123",
      lastVerifiedAt: null,
      lastVerificationMessage: undefined,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    });

    runDiagnosticsMock.mockRejectedValue(new Error("boom"));

    const request = new Request("http://localhost/api/diagnostics/runs", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        serviceConnectionId: "11111111-2222-3333-4444-555555555555",
        scenarios: ["timeout"],
        trigger: "manual",
      }),
    });

    const response = await POST({ request } as unknown as RequestEvent);

    expect(response.status).toBe(500);
    const payload = await response.json();
    expect(payload.error).toBe("UNHANDLED_EXCEPTION");
    expect(payload.correlationId).toBeDefined();
  });
});
