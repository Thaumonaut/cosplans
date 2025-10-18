import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearHeartbeatCache,
  getHealthSnapshots,
} from "$lib/server/service-connections/health.repository";
import {
  resolveHeartbeatEndpoint,
  runServiceConnectionHeartbeats,
} from "$lib/server/service-connections/heartbeat-runner";

describe("service connection heartbeat runner", () => {
  beforeEach(() => {
    clearHeartbeatCache();
    vi.restoreAllMocks();
  });

  it("probes active connections and records outcomes", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, status: 200 })
      .mockResolvedValueOnce({ ok: false, status: 503 });

    const timestamp = new Date("2025-10-18T12:00:00.000Z");

    const results = await runServiceConnectionHeartbeats({
      fetch: fetchMock,
      connections: [
        {
          id: "conn-ok",
          team_id: "team-heartbeat",
          status: "active",
          connection_metadata: { supabaseUrl: "https://example.com" },
        },
        {
          id: "conn-fail",
          team_id: "team-heartbeat",
          status: "active",
          connection_metadata: { supabaseUrl: "https://unavailable.example.com" },
        },
        {
          id: "conn-paused",
          team_id: "team-heartbeat",
          status: "inactive",
          connection_metadata: { supabaseUrl: "https://paused.example.com" },
        },
      ],
      timestamp,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(results).toHaveLength(2);

    const [first, second] = results;
    expect(first.serviceConnectionId).toBe("conn-ok");
    expect(first.status).toBe("pass");
    expect(first.errorCode).toBeNull();
    expect(second.serviceConnectionId).toBe("conn-fail");
    expect(second.status).toBe("fail");
    expect(second.errorCode).toBe("HTTP_503");

    const snapshots = await getHealthSnapshots("team-heartbeat");
    expect(snapshots).toHaveLength(2);
    expect(
      snapshots.find((snapshot) => snapshot.serviceConnectionId === "conn-ok")?.currentStatus
    ).toBe("active");
    expect(
      snapshots.find((snapshot) => snapshot.serviceConnectionId === "conn-fail")?.currentStatus
    ).toBe("degraded");
    expect(
      snapshots
        .find((snapshot) => snapshot.serviceConnectionId === "conn-fail")
        ?.lastHeartbeatAt?.toISOString()
    ).toBe(timestamp.toISOString());
  });

  it("derives heartbeat endpoint from metadata", () => {
    expect(resolveHeartbeatEndpoint({ supabaseUrl: "https://demo.supabase.co" })).toBe(
      "https://demo.supabase.co/rest/v1/"
    );
    expect(resolveHeartbeatEndpoint({ url: "https://api.example.com" })).toBe(
      "https://api.example.com/rest/v1/"
    );
    expect(resolveHeartbeatEndpoint({ invalid: true })).toBeNull();
  });
});
