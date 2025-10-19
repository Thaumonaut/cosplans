import { beforeEach, describe, expect, it } from "vitest";

import {
  clearHeartbeatCache,
  getHealthSnapshots,
  recordHeartbeatOutcome,
  type HealthSnapshotRecord,
} from "$lib/server/service-connections/health.repository";

describe("service connection heartbeat repository", () => {
  beforeEach(() => {
    clearHeartbeatCache();
  });

  it("records healthy heartbeats and maintains 100 percent uptime", async () => {
    const occurredAt = new Date("2025-10-18T09:00:00.000Z");

    const { snapshot, consecutiveFailures } = await recordHeartbeatOutcome({
      teamId: "team-alpha",
      serviceConnectionId: "conn-1",
      status: "pass",
      latencyMs: 185,
      occurredAt,
    });

    expect(consecutiveFailures).toBe(0);
    expect(snapshot.serviceConnectionId).toBe("conn-1");
    expect(snapshot.currentStatus).toBe("active");
    expect(snapshot.uptimePercent24h).toBe(100);
    expect(snapshot.recentFailures).toBe(0);
    expect(snapshot.lastHeartbeatAt?.toISOString()).toBe(occurredAt.toISOString());
  });

  it("escalates status from degraded to error after consecutive failures", async () => {
    const firstFailureAt = new Date("2025-10-18T10:00:00.000Z");
    const secondFailureAt = new Date("2025-10-18T10:05:00.000Z");

    const first = await recordHeartbeatOutcome({
      teamId: "team-alpha",
      serviceConnectionId: "conn-2",
      status: "fail",
      latencyMs: null,
      errorCode: "TIMEOUT",
      occurredAt: firstFailureAt,
    });

    expect(first.consecutiveFailures).toBe(1);
    expect(first.snapshot.currentStatus).toBe("degraded");
    expect(first.snapshot.recentFailures).toBe(1);
    expect(first.snapshot.lastErrorEventId).toBeNull();

    const second = await recordHeartbeatOutcome({
      teamId: "team-alpha",
      serviceConnectionId: "conn-2",
      status: "fail",
      latencyMs: null,
      errorCode: "TIMEOUT",
      errorEventId: "ee-1",
      occurredAt: secondFailureAt,
    });

    expect(second.consecutiveFailures).toBe(2);
    expect(second.snapshot.currentStatus).toBe("error");
    expect(second.snapshot.recentFailures).toBe(2);
    expect(second.snapshot.lastErrorEventId).toBe("ee-1");
    expect(second.snapshot.lastHeartbeatAt?.toISOString()).toBe(secondFailureAt.toISOString());
  });

  it("discards events older than 24 hours when computing uptime", async () => {
    const staleTimestamp = new Date("2025-10-16T10:00:00.000Z");
    const recentTimestamp = new Date("2025-10-18T11:00:00.000Z");

    await recordHeartbeatOutcome({
      teamId: "team-beta",
      serviceConnectionId: "conn-3",
      status: "fail",
      latencyMs: null,
      occurredAt: staleTimestamp,
    });

    const { snapshot } = await recordHeartbeatOutcome({
      teamId: "team-beta",
      serviceConnectionId: "conn-3",
      status: "pass",
      latencyMs: 95,
      occurredAt: recentTimestamp,
    });

    expect(snapshot.currentStatus).toBe("active");
    expect(snapshot.uptimePercent24h).toBe(100);
    expect(snapshot.recentFailures).toBe(0);
    expect(snapshot.lastHeartbeatAt?.toISOString()).toBe(recentTimestamp.toISOString());
  });

  it("retrieves snapshots aggregated by team", async () => {
    await recordHeartbeatOutcome({
      teamId: "team-gamma",
      serviceConnectionId: "conn-1",
      status: "pass",
      latencyMs: 120,
    });
    await recordHeartbeatOutcome({
      teamId: "team-gamma",
      serviceConnectionId: "conn-2",
      status: "fail",
      latencyMs: null,
    });

    const snapshots = await getHealthSnapshots("team-gamma");

    expect(snapshots).toHaveLength(2);
    const byId = new Map<string, HealthSnapshotRecord>(
      snapshots.map((snapshot: HealthSnapshotRecord) => [snapshot.serviceConnectionId, snapshot])
    );

    expect(byId.get("conn-1")?.currentStatus).toBe("active");
    expect(byId.get("conn-2")?.currentStatus).toBe("degraded");
  });
});
