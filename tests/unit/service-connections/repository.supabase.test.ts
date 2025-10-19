import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const originalNodeEnv = process.env.NODE_ENV;
process.env.NODE_ENV = "development";
delete process.env.COSPLANS_USE_FAKE_SUPABASE;

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
    SUPABASE_SERVICE_ROLE_KEY: "test-service-role",
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
      SUPABASE_SERVICE_ROLE_KEY: "test-service-role",
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
  }),
  { virtual: true }
);

let listServiceConnections!: (typeof import("$lib/server/service-connections/repository"))["listServiceConnections"];
let getServiceConnectionById!: (typeof import("$lib/server/service-connections/repository"))["getServiceConnectionById"];
let saveServiceConnection!: (typeof import("$lib/server/service-connections/repository"))["saveServiceConnection"];
let persistVerificationResult!: (typeof import("$lib/server/service-connections/repository"))["persistVerificationResult"];
let recordVerificationRun!: (typeof import("$lib/server/service-connections/repository"))["recordVerificationRun"];
let getVerificationHistory!: (typeof import("$lib/server/service-connections/repository"))["getVerificationHistory"];

afterAll(() => {
  process.env.NODE_ENV = originalNodeEnv;
});

beforeAll(async () => {
  const repository = await import("$lib/server/service-connections/repository");
  listServiceConnections = repository.listServiceConnections;
  getServiceConnectionById = repository.getServiceConnectionById;
  saveServiceConnection = repository.saveServiceConnection;
  persistVerificationResult = repository.persistVerificationResult;
  recordVerificationRun = repository.recordVerificationRun;
  getVerificationHistory = repository.getVerificationHistory;
});

beforeEach(() => {
  vi.clearAllMocks();
  getAdminClientMock.mockReset();
});

afterEach(() => {
  delete process.env.COSPLANS_USE_FAKE_SUPABASE;
});

describe("service connection repository (Supabase integration)", () => {
  const baseRow = {
    id: "b3a47622-ff33-4ad4-b0df-42e8e8876b0e",
    team_id: "fe6c2b92-bdad-45dd-9935-089bea879c42",
    service_type: "supabase" as const,
    environment: "production" as const,
    supabase_project_ref: "cosplans-prod",
    status: "pending_verification" as const,
    last_verified_at: "2025-10-18T00:00:00.000Z",
    connection_metadata: {
      displayName: "Production Supabase",
      supabaseUrl: "https://production.supabase.co",
      credentialsFingerprint: "fingerprint-123",
      lastVerificationMessage: "Initial verification pending",
    },
    created_at: "2025-10-17T23:58:00.000Z",
    updated_at: "2025-10-18T00:00:00.000Z",
  };

  it("saves service connections via Supabase upsert", async () => {
    const upsertMock = vi.fn((payload) => {
      expect(payload).toMatchObject({
        team_id: baseRow.team_id,
        service_type: baseRow.service_type,
        environment: baseRow.environment,
        status: baseRow.status,
        connection_metadata: expect.objectContaining({
          displayName: baseRow.connection_metadata.displayName,
          supabaseUrl: baseRow.connection_metadata.supabaseUrl,
          credentialsFingerprint: baseRow.connection_metadata.credentialsFingerprint,
          lastVerificationMessage: baseRow.connection_metadata.lastVerificationMessage,
        }),
      });

      return {
        select: vi.fn(() => ({
          single: vi.fn(async () => ({ data: baseRow, error: null })),
        })),
      };
    });

    const supabaseClient = {
      from: vi.fn((table: string) => {
        if (table !== "service_connection_profiles") {
          throw new Error(`Unexpected table: ${table}`);
        }
        return {
          upsert: upsertMock,
        };
      }),
    };

    getAdminClientMock.mockReturnValue(supabaseClient);

    const result = await saveServiceConnection({
      teamId: baseRow.team_id,
      name: baseRow.connection_metadata.displayName as string,
      environment: baseRow.environment,
      serviceType: baseRow.service_type,
      supabaseUrl: baseRow.connection_metadata.supabaseUrl as string,
      supabaseProjectRef: baseRow.supabase_project_ref as string,
      status: baseRow.status,
      credentialsFingerprint: baseRow.connection_metadata.credentialsFingerprint as string,
      lastVerifiedAt: new Date(baseRow.last_verified_at),
      lastVerificationMessage: baseRow.connection_metadata.lastVerificationMessage as string,
    });

    expect(result.id).toBe(baseRow.id);
    expect(result.teamId).toBe(baseRow.team_id);
    expect(result.name).toBe(baseRow.connection_metadata.displayName);
    expect(result.supabaseUrl).toBe(baseRow.connection_metadata.supabaseUrl);
    expect(result.credentialsFingerprint).toBe(baseRow.connection_metadata.credentialsFingerprint);
    expect(result.lastVerificationMessage).toBe(
      baseRow.connection_metadata.lastVerificationMessage
    );
  });

  it("lists service connections from Supabase", async () => {
    const orderMock = vi.fn(async () => ({ data: [baseRow], error: null }));
    const eqMock = vi.fn(() => ({
      order: orderMock,
    }));
    const selectMock = vi.fn(() => ({
      eq: eqMock,
    }));

    const supabaseClient = {
      from: vi.fn((table: string) => {
        if (table !== "service_connection_profiles") {
          throw new Error(`Unexpected table: ${table}`);
        }
        return {
          select: selectMock,
        };
      }),
    };

    getAdminClientMock.mockReturnValue(supabaseClient);

    const results = await listServiceConnections(baseRow.team_id);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(baseRow.id);
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(eqMock).toHaveBeenCalledWith("team_id", baseRow.team_id);
    expect(orderMock).toHaveBeenCalledWith("created_at", { ascending: true });
  });

  it("fetches service connection by id", async () => {
    const maybeSingle = vi.fn(async () => ({ data: baseRow, error: null }));
    const eqIdMock = vi.fn(() => ({ maybeSingle }));
    const eqTeamMock = vi.fn(() => ({ eq: eqIdMock }));
    const selectMock = vi.fn(() => ({ eq: eqTeamMock }));

    const supabaseClient = {
      from: vi.fn((table: string) => {
        if (table !== "service_connection_profiles") {
          throw new Error(`Unexpected table: ${table}`);
        }
        return {
          select: selectMock,
        };
      }),
    };

    getAdminClientMock.mockReturnValue(supabaseClient);

    const result = await getServiceConnectionById(baseRow.team_id, baseRow.id);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(baseRow.id);
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(eqTeamMock).toHaveBeenCalledWith("team_id", baseRow.team_id);
    expect(eqIdMock).toHaveBeenCalledWith("id", baseRow.id);
    expect(maybeSingle).toHaveBeenCalledTimes(1);
  });

  it("updates verification results with Supabase metadata preservation", async () => {
    const existingRow = {
      ...baseRow,
      connection_metadata: {
        ...baseRow.connection_metadata,
        lastVerificationMessage: "Previous message",
      },
    };
    const updatedRow = {
      ...existingRow,
      status: "active" as const,
      last_verified_at: "2025-10-18T00:05:00.000Z",
      connection_metadata: {
        ...existingRow.connection_metadata,
        lastVerificationMessage: "Verification succeeded",
      },
    };

    const selectBuilder = {
      eq: vi.fn(() => selectBuilder),
      maybeSingle: vi.fn(async () => ({ data: existingRow, error: null })),
    } as const;

    const singleMock = vi.fn(async () => ({ data: updatedRow, error: null }));

    const supabaseClient = {
      from: vi.fn((table: string) => {
        if (table !== "service_connection_profiles") {
          throw new Error(`Unexpected table: ${table}`);
        }
        return {
          select: vi.fn(() => selectBuilder),
          update: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                select: vi.fn(() => ({
                  single: singleMock,
                })),
              })),
            })),
          })),
        };
      }),
    };

    getAdminClientMock.mockReturnValue(supabaseClient);

    const updated = await persistVerificationResult({
      id: updatedRow.id,
      teamId: updatedRow.team_id,
      status: updatedRow.status,
      lastVerifiedAt: new Date(updatedRow.last_verified_at),
      message: updatedRow.connection_metadata.lastVerificationMessage as string,
    });

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe("active");
    expect(updated?.lastVerificationMessage).toBe("Verification succeeded");
    expect(singleMock).toHaveBeenCalled();
  });

  it("records and reads verification history via diagnostic test runs", async () => {
    const historyRow = {
      id: "44ab155f-4c78-4ff0-9d55-a7337ecf3f56",
      service_connection_id: baseRow.id,
      scenario: "latency_spike" as const,
      status: "pass" as const,
      trigger_source: "manual" as const,
      executed_by: "fe0d4f2d-8ab1-4f7b-a415-729afc1b19b0",
      started_at: "2025-10-18T00:10:00.000Z",
      completed_at: "2025-10-18T00:10:30.000Z",
      duration_ms: 30_000,
      evidence_url: "https://storage.cosplans.dev/evidence/diags/a.log",
      notes: "All checks passed",
      created_at: "2025-10-18T00:10:30.000Z",
    };

    const insertMock = vi.fn(async () => ({ error: null }));

    const selectDiagnostics = {
      eq: vi.fn(() => ({
        order: vi.fn(() =>
          Promise.resolve({
            data: [
              {
                ...historyRow,
                service_connection_profiles: { team_id: baseRow.team_id },
              },
            ],
            error: null,
          })
        ),
      })),
    };

    const supabaseClient = {
      from: vi.fn((table: string) => {
        if (table === "diagnostic_test_runs") {
          return {
            insert: insertMock,
            select: vi.fn(() => selectDiagnostics),
          };
        }
        if (table === "service_connection_profiles") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({ data: baseRow, error: null })),
              })),
            })),
          };
        }
        throw new Error(`Unexpected table: ${table}`);
      }),
    };

    getAdminClientMock.mockReturnValue(supabaseClient);

    await recordVerificationRun(baseRow.team_id, {
      connectionId: baseRow.id,
      status: "pass",
      scenario: "latency_spike",
      durationMs: 30000,
      executedAt: new Date(historyRow.started_at),
      notes: "All checks passed",
    });

    const history = await getVerificationHistory(baseRow.team_id);
    expect(history).toHaveLength(1);
    expect(history[0].status).toBe("pass");
    expect(history[0].executedAt.toISOString()).toBe(historyRow.started_at);
    expect(insertMock).toHaveBeenCalled();
  });
});
