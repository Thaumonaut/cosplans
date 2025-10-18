import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const originalNodeEnv = process.env.NODE_ENV;

type SupabaseInsert = (
  payload: Record<string, unknown>
) => Promise<{ error: null | { message?: string } }>;

type SupabaseUpload = (
  path: string,
  data: Uint8Array,
  options: { cacheControl?: string; contentType?: string; upsert?: boolean }
) => Promise<{ error: null | { message?: string } }>;

const getAdminClientMock = vi.fn();

(
  vi.mock as unknown as (
    path: string,
    factory: () => Record<string, unknown>,
    options?: { virtual?: boolean }
  ) => void
)(
  "$env/static/private",
  () => ({
    SUPABASE_URL: "http://localhost:54321",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    SUPABASE_ANON_KEY: "anon-key",
    DIAGNOSTICS_BUCKET: "diagnostics",
    COSPLANS_ENVIRONMENT: "development",
  }),
  { virtual: true }
);

(
  vi.mock as unknown as (
    path: string,
    factory: () => Record<string, unknown>,
    options?: { virtual?: boolean }
  ) => void
)(
  "$env/dynamic/private",
  () => ({
    env: {
      COSPLANS_ENVIRONMENT: "development",
      SUPABASE_URL: "http://localhost:54321",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      SUPABASE_ANON_KEY: "anon-key",
      DIAGNOSTICS_BUCKET: "diagnostics",
    },
  }),
  { virtual: true }
);

(
  vi.mock as unknown as (
    path: string,
    factory: () => Record<string, unknown>,
    options?: { virtual?: boolean }
  ) => void
)(
  "$lib/server/supabase/admin-client",
  () => ({
    getAdminClient: getAdminClientMock,
    resolveCredentials: ({
      environment = "development",
      supabaseUrl,
      serviceRoleKey,
    }: {
      environment?: string;
      supabaseUrl?: string;
      serviceRoleKey?: string;
    } = {}) => ({
      environment,
      url: supabaseUrl ?? "http://localhost:54321",
      serviceRoleKey: serviceRoleKey ?? "service-role-key",
    }),
  }),
  { virtual: true }
);

let saveDiagnosticScenarioResult!: typeof import("$lib/server/service-connections/diagnostics.repository").saveDiagnosticScenarioResult;
let clearServiceConnectionsConfigCache!: typeof import("$lib/server/config/service-connections").clearServiceConnectionsConfigCache;

beforeAll(async () => {
  const repository = await import("$lib/server/service-connections/diagnostics.repository");
  saveDiagnosticScenarioResult = repository.saveDiagnosticScenarioResult;
  ({ clearServiceConnectionsConfigCache } = await import("$lib/server/config/service-connections"));
});

beforeEach(() => {
  process.env.NODE_ENV = "development";
  vi.clearAllMocks();
  getAdminClientMock.mockReset();
  clearServiceConnectionsConfigCache();
});

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
});

afterAll(() => {
  process.env.NODE_ENV = originalNodeEnv;
});

describe("diagnostics.repository", () => {
  const baseInput = {
    teamId: "team-123",
    serviceConnectionId: "conn-456",
    scenario: "latency_spike" as const,
    status: "pass" as const,
    trigger: "manual" as const,
    executedBy: "user-789",
    startedAt: new Date("2025-10-18T12:00:00.000Z"),
    completedAt: new Date("2025-10-18T12:00:05.000Z"),
    durationMs: 5000,
    notes: "Latency stabilized",
  };

  it("persists diagnostic results without evidence upload", async () => {
    const insertMock: SupabaseInsert = vi.fn(async (payload) => {
      expect(payload).toMatchObject({
        service_connection_id: baseInput.serviceConnectionId,
        scenario: baseInput.scenario,
        status: baseInput.status,
        trigger_source: baseInput.trigger,
        executed_by: baseInput.executedBy,
        started_at: baseInput.startedAt.toISOString(),
        completed_at: baseInput.completedAt.toISOString(),
        duration_ms: baseInput.durationMs,
        evidence_url: null,
        notes: baseInput.notes,
      });
      return { error: null };
    });

    const supabaseClient = {
      from: vi.fn((table: string) => {
        expect(table).toBe("diagnostic_test_runs");
        return {
          insert: insertMock,
        };
      }),
      storage: {
        from: vi.fn(),
      },
    };

    getAdminClientMock.mockReturnValue(supabaseClient);

    await expect(
      saveDiagnosticScenarioResult({
        ...baseInput,
        evidenceUrl: null,
      })
    ).resolves.toBeUndefined();

    expect(supabaseClient.from).toHaveBeenCalledWith("diagnostic_test_runs");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(supabaseClient.storage.from).not.toHaveBeenCalled();
  });

  it("uploads evidence and stores resulting path", async () => {
    const uploadMock: SupabaseUpload = vi.fn(async (path, data, options) => {
      expect(path).toBe(`${baseInput.teamId}/${baseInput.serviceConnectionId}/diagnostics.log`);
      expect(new TextDecoder().decode(data)).toBe("log output");
      expect(options).toMatchObject({
        upsert: true,
        contentType: "text/plain",
      });
      return { error: null };
    });

    const insertMock: SupabaseInsert = vi.fn(async (payload) => {
      expect(payload.evidence_url).toBe(
        `${baseInput.teamId}/${baseInput.serviceConnectionId}/diagnostics.log`
      );
      return { error: null };
    });

    const supabaseClient = {
      from: vi.fn(() => ({
        insert: insertMock,
      })),
      storage: {
        from: vi.fn(() => ({
          upload: uploadMock,
        })),
      },
    };

    getAdminClientMock.mockReturnValue(supabaseClient);

    await expect(
      saveDiagnosticScenarioResult({
        ...baseInput,
        evidence: {
          data: "log output",
          filename: "diagnostics.log",
          contentType: "text/plain",
        },
      })
    ).resolves.toBeUndefined();

    expect(uploadMock).toHaveBeenCalledTimes(1);
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  it("throws when evidence upload fails", async () => {
    const uploadMock: SupabaseUpload = vi.fn(async () => ({
      error: { message: "Upload failed" },
    }));

    const supabaseClient = {
      from: vi.fn(() => ({
        insert: vi.fn(),
      })),
      storage: {
        from: vi.fn(() => ({ upload: uploadMock })),
      },
    };

    getAdminClientMock.mockReturnValue(supabaseClient);

    await expect(
      saveDiagnosticScenarioResult({
        ...baseInput,
        evidence: {
          data: "binary",
        },
      })
    ).rejects.toThrow(/upload diagnostic evidence/i);

    expect(uploadMock).toHaveBeenCalledTimes(1);
    expect(supabaseClient.from).not.toHaveBeenCalled();
  });
});
