<script lang="ts">
  import {
    diagnosticScenarios,
    diagnosticTriggers,
    type DiagnosticRunStatus,
    type DiagnosticScenario,
    type DiagnosticTrigger,
    type ServiceConnectionProfile,
  } from "$lib/types/service-connections";

  interface DiagnosticsActionResult {
    status?: DiagnosticRunStatus | "error";
    message?: string;
    results?: Array<{
      scenario: DiagnosticScenario;
      status: DiagnosticRunStatus;
      durationMs: number | null;
      startedAt: string;
      completedAt: string;
      notes?: string | null;
    }>;
  }

  interface DiagnosticsRecord {
    id: string;
    teamId: string;
    serviceConnectionId: string;
    connectionName: string;
    scenario: DiagnosticScenario;
    status: DiagnosticRunStatus;
    trigger: DiagnosticTrigger;
    executedBy: string | null;
    startedAt: Date;
    completedAt: Date;
    durationMs: number | null;
    evidenceUrl: string | null;
    notes: string | null;
  }

  export let teamId: string;
  export let connections: ServiceConnectionProfile[] = [];
  export let diagnostics: DiagnosticsRecord[] = [];
  export let form: { diagnostics?: DiagnosticsActionResult } | DiagnosticsActionResult | null =
    null;

  const scenarioLabels: Record<DiagnosticScenario, string> = {
    latency_spike: "Latency spike",
    timeout: "Timeout",
    malformed_payload: "Malformed payload",
    permission_denied: "Permission denied",
    upstream_outage: "Upstream outage",
    other: "Other scenario",
  };

  const statusColors: Record<DiagnosticRunStatus, string> = {
    pass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    fail: "bg-red-100 text-red-800 border-red-200",
    blocked: "bg-amber-100 text-amber-800 border-amber-200",
  };

  let selectedConnectionId: string = "";
  let selectedTrigger: DiagnosticTrigger = "manual";
  let selectedScenarios = new Set<DiagnosticScenario>(diagnosticScenarios);

  let diagnosticsAction: DiagnosticsActionResult | null = null;

  $: diagnosticsAction = (() => {
    if (!form || typeof form !== "object") {
      return null;
    }

    if ("diagnostics" in form) {
      return (form as { diagnostics?: DiagnosticsActionResult }).diagnostics ?? null;
    }

    return null;
  })();

  $: if (!selectedConnectionId && connections.length > 0) {
    selectedConnectionId = connections[0].id;
  }

  $: sortedDiagnostics = [...diagnostics].sort(
    (a, b) => b.startedAt.getTime() - a.startedAt.getTime()
  );

  const formatTimestamp = (date: Date) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  const toggleScenario = (scenario: DiagnosticScenario, checked: boolean) => {
    const next = new Set(selectedScenarios);
    if (checked) {
      next.add(scenario);
    } else {
      next.delete(scenario);
    }
    selectedScenarios = next.size > 0 ? next : new Set([scenario]);
  };

  const isScenarioSelected = (scenario: DiagnosticScenario) => selectedScenarios.has(scenario);

  const scenarioDescription = (scenario: DiagnosticScenario): string => {
    switch (scenario) {
      case "latency_spike":
        return "Simulates elevated response times to verify graceful degradation.";
      case "timeout":
        return "Forces request timeouts to confirm retries and alerting.";
      case "malformed_payload":
        return "Injects invalid payloads to validate schema handling.";
      case "permission_denied":
        return "Checks RLS and service role permissions for diagnostics.";
      case "upstream_outage":
        return "Simulates outage responses from upstream services.";
      default:
        return "Covers additional smoke scenarios for diagnostics harness.";
    }
  };
</script>

<div
  class="space-y-5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 shadow"
>
  <header class="space-y-1">
    <h2 class="text-lg font-semibold" style="color: var(--theme-foreground);">
      Automated Diagnostics
    </h2>
    <p class="text-sm" style="color: var(--theme-muted);">
      Trigger edge-case diagnostics before release and review scenario outcomes with evidence links.
    </p>
  </header>

  {#if diagnosticsAction?.status}
    <div
      role={diagnosticsAction.status === "pass" ? "status" : "alert"}
      class="rounded-md border px-4 py-3 text-sm"
      class:bg-emerald-50={diagnosticsAction.status === "pass"}
      class:bg-red-50={diagnosticsAction.status === "fail" || diagnosticsAction.status === "error"}
      class:bg-amber-50={diagnosticsAction.status === "blocked"}
      class:border-emerald-200={diagnosticsAction.status === "pass"}
      class:border-red-200={diagnosticsAction.status === "fail" ||
        diagnosticsAction.status === "error"}
      class:border-amber-200={diagnosticsAction.status === "blocked"}
    >
      <p class="font-semibold capitalize">
        {diagnosticsAction.status === "error"
          ? "Diagnostics failed"
          : `Diagnostics ${diagnosticsAction.status}`}
      </p>
      {#if diagnosticsAction.message}
        <p>{diagnosticsAction.message}</p>
      {/if}
      {#if diagnosticsAction.results && diagnosticsAction.results.length > 0}
        <ul class="mt-2 space-y-1 text-xs">
          {#each diagnosticsAction.results as result}
            <li>
              <span class="font-medium">{scenarioLabels[result.scenario]}:</span>
              <span class="capitalize">{result.status}</span>
              {#if result.notes}
                — {result.notes}
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}

  <form method="POST" class="space-y-4" autocomplete="off">
    <input type="hidden" name="executedBy" value="{teamId}::automation" />
    <div class="space-y-1">
      <label
        for="diagnostics-connection"
        class="text-sm font-medium"
        style="color: var(--theme-muted);"
      >
        Service connection
      </label>
      <select
        id="diagnostics-connection"
        name="connectionId"
        class="w-full rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-2 text-sm"
        bind:value={selectedConnectionId}
        disabled={connections.length === 0}
      >
        {#each connections as connection}
          <option value={connection.id}>
            {connection.connectionMetadata?.displayName ??
              connection.supabaseProjectRef ??
              connection.environment}
          </option>
        {/each}
      </select>
    </div>

    <div class="space-y-1">
      <label
        for="diagnostics-trigger"
        class="text-sm font-medium"
        style="color: var(--theme-muted);"
      >
        Trigger source
      </label>
      <select
        id="diagnostics-trigger"
        name="trigger"
        class="w-full rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-2 text-sm"
        bind:value={selectedTrigger}
      >
        {#each diagnosticTriggers as trigger}
          <option value={trigger} class="capitalize">{trigger}</option>
        {/each}
      </select>
    </div>

    <fieldset class="space-y-2">
      <legend class="text-sm font-medium" style="color: var(--theme-muted);">
        Scenarios to execute
      </legend>
      <div class="grid gap-2 md:grid-cols-2">
        {#each diagnosticScenarios as scenario}
          <label class="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="scenario"
              value={scenario}
              checked={isScenarioSelected(scenario)}
              onchange={(event) =>
                toggleScenario(scenario, (event.currentTarget as HTMLInputElement).checked)}
            />
            <span class="leading-snug">
              <span class="font-medium">{scenarioLabels[scenario]}</span>
              <br />
              <span class="text-xs" style="color: var(--theme-muted);">
                {scenarioDescription(scenario)}
              </span>
            </span>
          </label>
        {/each}
      </div>
    </fieldset>

    <div class="flex items-center justify-between pt-2">
      <p class="text-xs" style="color: var(--theme-muted);">
        Runs are logged with correlation IDs for {teamId}.
      </p>
      <button
        type="submit"
        class="rounded-md bg-[var(--theme-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        formaction="?/diagnostics"
        disabled={!selectedConnectionId}
      >
        Run diagnostics
      </button>
    </div>
  </form>

  <section class="space-y-3">
    <h3 class="text-sm font-semibold uppercase tracking-wide" style="color: var(--theme-muted);">
      Recent runs
    </h3>
    {#if sortedDiagnostics.length === 0}
      <p class="text-sm" style="color: var(--theme-muted-foreground);">
        Diagnostics results will appear here once a run completes.
      </p>
    {:else}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-[var(--theme-border)] text-sm">
          <thead class="text-left" style="color: var(--theme-muted);">
            <tr>
              <th class="px-3 py-2 font-medium">Connection</th>
              <th class="px-3 py-2 font-medium">Scenario</th>
              <th class="px-3 py-2 font-medium">Status</th>
              <th class="px-3 py-2 font-medium">Duration</th>
              <th class="px-3 py-2 font-medium">Started</th>
              <th class="px-3 py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody
            class="divide-y divide-[var(--theme-border)]"
            style="color: var(--theme-foreground);"
          >
            {#each sortedDiagnostics as record}
              <tr>
                <td class="px-3 py-2 align-top font-medium">
                  {record.connectionName}
                </td>
                <td class="px-3 py-2 align-top">
                  {scenarioLabels[record.scenario]}
                </td>
                <td class="px-3 py-2 align-top">
                  <span
                    class={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusColors[record.status]}`}
                  >
                    {record.status}
                  </span>
                </td>
                <td class="px-3 py-2 align-top">
                  {record.durationMs ? `${record.durationMs}ms` : "–"}
                </td>
                <td class="px-3 py-2 align-top whitespace-nowrap">
                  {formatTimestamp(record.startedAt)}
                </td>
                <td
                  class="px-3 py-2 align-top text-xs"
                  style="color: var(--theme-muted-foreground);"
                >
                  {#if record.notes}
                    {record.notes}
                  {:else}
                    <span class="italic">No additional notes</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
</div>
