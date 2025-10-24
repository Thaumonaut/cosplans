<script lang="ts">
  import { onMount } from "svelte";

  import type { ServiceConnectionProfile } from "$lib/types/service-connections";

  export interface HealthSnapshotViewModel {
    serviceConnectionId: string;
    currentStatus: "active" | "degraded" | "error";
    uptimePercent24h: number;
    recentFailures: number;
    lastHeartbeatAt: string | null;
    lastErrorEventId: string | null;
    lastLatencyMs: number | null;
    consecutiveFailures: number;
    lastErrorCode: string | null;
  }

  export let teamId: string;
  export let connections: ServiceConnectionProfile[] = [];
  export let snapshots: HealthSnapshotViewModel[] = [];

  const connectionLookup = new Map(connections.map((connection) => [connection.id, connection]));
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const statusStyles: Record<HealthSnapshotViewModel["currentStatus"], string> = {
    active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    degraded: "bg-amber-100 text-amber-700 border border-amber-200",
    error: "bg-rose-100 text-rose-700 border border-rose-200",
  };

  const defaultOperatorId = "operator-demo-123";

  let acknowledgementState: Record<string, "idle" | "saving" | "done" | "error"> = {};
  let acknowledgementErrors: Record<string, string> = {};

  onMount(() => {
    const nextState = { ...acknowledgementState };
    for (const snapshot of snapshots) {
      if (!nextState[snapshot.serviceConnectionId]) {
        nextState[snapshot.serviceConnectionId] = "idle";
      }
    }
    acknowledgementState = nextState;

    if (typeof window !== "undefined") {
      // Surface a flag in test environments so Playwright can wait for hydration.
      (window as typeof window & { __cosplansHealthHydrated?: boolean }).__cosplansHealthHydrated =
        true;
    }
  });

  async function acknowledgeIncident(connectionId: string, incidentId: string) {
    acknowledgementState = { ...acknowledgementState, [connectionId]: "saving" };
    acknowledgementErrors = { ...acknowledgementErrors, [connectionId]: "" };

    try {
      const response = await fetch("/api/service-connections/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId,
          incidentId,
          operatorId: defaultOperatorId,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message =
          typeof data?.error === "string" ? data.error : "Unable to acknowledge incident.";
        acknowledgementState = { ...acknowledgementState, [connectionId]: "error" };
        acknowledgementErrors = { ...acknowledgementErrors, [connectionId]: message };
        return;
      }

      acknowledgementState = { ...acknowledgementState, [connectionId]: "done" };
    } catch (error) {
      acknowledgementState = { ...acknowledgementState, [connectionId]: "error" };
      acknowledgementErrors = {
        ...acknowledgementErrors,
        [connectionId]:
          error instanceof Error ? error.message : "Unexpected error acknowledging incident.",
      };
    }
  }

  function describeConnection(connectionId: string): string {
    const connection = connectionLookup.get(connectionId);
    if (!connection) {
      return "Unknown connection";
    }

    const displayName =
      typeof connection.connectionMetadata?.displayName === "string"
        ? (connection.connectionMetadata.displayName as string)
        : (connection.supabaseProjectRef ?? connection.id);

    return `${displayName} · ${connection.environment.toUpperCase()}`;
  }

  function formatDate(iso: string | null): string {
    if (!iso) {
      return "—";
    }

    const parsed = new Date(iso);
    return Number.isNaN(parsed.getTime()) ? "—" : formatter.format(parsed);
  }
</script>

<section class="space-y-4">
  <div class="flex items-center justify-between">
    <h2 class="text-lg font-semibold">Service health</h2>
    <p class="text-sm text-muted-foreground">Updated automatically every 5 minutes.</p>
  </div>

  {#if snapshots.length === 0}
    <p
      class="rounded-md border border-dashed border-muted-foreground/40 bg-muted/30 p-4 text-sm text-muted-foreground"
    >
      No heartbeat data available yet. Heartbeat checks will appear here after the first run.
    </p>
  {:else}
    <div class="overflow-hidden rounded-lg border border-muted bg-card shadow-sm">
      <table class="min-w-full divide-y divide-muted-foreground/10">
        <thead class="bg-muted/40 text-left text-sm uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" class="px-4 py-3 font-medium">Service connection</th>
            <th scope="col" class="px-4 py-3 font-medium">Status</th>
            <th scope="col" class="px-4 py-3 font-medium">Uptime (24h)</th>
            <th scope="col" class="px-4 py-3 font-medium">Last heartbeat</th>
            <th scope="col" class="px-4 py-3 font-medium">Failures</th>
            <th scope="col" class="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-muted-foreground/10">
          {#each snapshots as snapshot (snapshot.serviceConnectionId)}
            <tr class="text-sm">
              <td class="px-4 py-3">
                <div class="font-medium">{describeConnection(snapshot.serviceConnectionId)}</div>
                {#if snapshot.lastErrorCode}
                  <p class="text-xs text-muted-foreground">Last error: {snapshot.lastErrorCode}</p>
                {/if}
              </td>
              <td class="px-4 py-3">
                <span
                  class={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[snapshot.currentStatus]}`}
                >
                  {snapshot.currentStatus === "active"
                    ? "Healthy"
                    : snapshot.currentStatus === "degraded"
                      ? "Degraded"
                      : "Incident"}
                </span>
              </td>
              <td class="px-4 py-3">{snapshot.uptimePercent24h.toFixed(1)}%</td>
              <td class="px-4 py-3">{formatDate(snapshot.lastHeartbeatAt)}</td>
              <td class="px-4 py-3">
                <div>{snapshot.recentFailures}</div>
                {#if snapshot.consecutiveFailures > 0}
                  <div class="text-xs text-muted-foreground">
                    Streak: {snapshot.consecutiveFailures}
                  </div>
                {/if}
              </td>
              <td class="px-4 py-3 text-right">
                {#if snapshot.lastErrorEventId}
                  <button
                    type="button"
                    class="inline-flex items-center rounded-md border border-transparent bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted"
                    disabled={acknowledgementState[snapshot.serviceConnectionId] === "saving" ||
                      acknowledgementState[snapshot.serviceConnectionId] === "done"}
                    onclick={() =>
                      acknowledgeIncident(snapshot.serviceConnectionId, snapshot.lastErrorEventId!)}
                  >
                    {#if acknowledgementState[snapshot.serviceConnectionId] === "done"}
                      Acknowledged
                    {:else if acknowledgementState[snapshot.serviceConnectionId] === "saving"}
                      Acknowledging…
                    {:else}
                      Acknowledge
                    {/if}
                  </button>
                  {#if acknowledgementState[snapshot.serviceConnectionId] === "error"}
                    <p class="mt-2 text-xs text-rose-600">
                      {acknowledgementErrors[snapshot.serviceConnectionId]}
                    </p>
                  {/if}
                {:else}
                  <span class="text-xs text-muted-foreground">No incidents</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>
