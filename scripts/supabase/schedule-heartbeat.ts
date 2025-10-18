#!/usr/bin/env bun

import { runServiceConnectionHeartbeats } from "../../src/lib/server/service-connections/heartbeat-runner";

const DEFAULT_INTERVAL_SECONDS = 5 * 60;

function resolveInterval(): number {
  const fromEnv = Number.parseInt(process.env.SERVICE_HEARTBEAT_INTERVAL_SECONDS ?? "", 10);
  if (Number.isFinite(fromEnv) && fromEnv > 0) {
    return fromEnv;
  }
  return DEFAULT_INTERVAL_SECONDS;
}

async function runSweep(): Promise<void> {
  const timestamp = new Date();
  const results = await runServiceConnectionHeartbeats({ timestamp });

  console.log(
    `Heartbeat sweep completed at ${timestamp.toISOString()} for ${results.length} connections.`
  );

  for (const result of results) {
    const latency = typeof result.latencyMs === "number" ? `${result.latencyMs}ms` : "n/a";
    const failureSuffix =
      result.status === "fail" && result.errorCode ? ` (error: ${result.errorCode})` : "";

    console.log(
      ` - ${result.serviceConnectionId} [team ${result.teamId}]: ${result.status.toUpperCase()} @ ${latency}${failureSuffix}`
    );
  }
}

async function main(): Promise<void> {
  const watch = process.argv.includes("--watch") || process.env.SERVICE_HEARTBEAT_WATCH === "1";
  const intervalSeconds = resolveInterval();

  const executeSweep = async () => {
    try {
      await runSweep();
    } catch (error) {
      console.error("Heartbeat sweep failed", error);
      if (!watch) {
        process.exitCode = 1;
      }
    }
  };

  await executeSweep();

  if (watch) {
    console.log(`Scheduling heartbeat sweep every ${intervalSeconds} seconds.`);
    setInterval(executeSweep, intervalSeconds * 1000);
  }
}

await main();
