<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  const severityClasses: Record<string, string> = {
    info: "bg-blue-100 text-blue-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
    critical: "bg-red-200 text-red-900",
  };

  const formatTimestamp = (value: Date) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(value);
</script>

<div class="space-y-6">
  <header class="space-y-2">
    <h1 class="text-2xl font-semibold" style="color: var(--theme-foreground);">
      Operator Diagnostics
    </h1>
    <p class="text-sm" style="color: var(--theme-muted);">
      Review the latest backend error events captured during service operations. Contact support
      with the correlation ID to escalate incidents.
    </p>
  </header>

  {#if data.events.length === 0}
    <p
      class="rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-6 text-sm"
      style="color: var(--theme-muted-foreground);"
    >
      No error events recorded for this team yet. All systems operational.
    </p>
  {:else}
    <div
      class="overflow-x-auto rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow"
    >
      <table class="min-w-full divide-y divide-[var(--theme-border)] text-sm">
        <thead style="color: var(--theme-muted);">
          <tr>
            <th class="px-4 py-3 text-left font-medium uppercase tracking-wide">When</th>
            <th class="px-4 py-3 text-left font-medium uppercase tracking-wide">Severity</th>
            <th class="px-4 py-3 text-left font-medium uppercase tracking-wide">Connection</th>
            <th class="px-4 py-3 text-left font-medium uppercase tracking-wide">Code</th>
            <th class="px-4 py-3 text-left font-medium uppercase tracking-wide">Message</th>
            <th class="px-4 py-3 text-left font-medium uppercase tracking-wide">Correlation ID</th>
            <th class="px-4 py-3 text-left font-medium uppercase tracking-wide">Operator notes</th>
          </tr>
        </thead>
        <tbody
          class="divide-y divide-[var(--theme-border)]"
          style="color: var(--theme-foreground);"
        >
          {#each data.events as event}
            <tr>
              <td class="px-4 py-3 align-top whitespace-nowrap"
                >{formatTimestamp(event.occurredAt)}</td
              >
              <td class="px-4 py-3 align-top">
                <span
                  class={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${severityClasses[event.severity] ?? severityClasses.error}`}
                >
                  {event.severity}
                </span>
              </td>
              <td class="px-4 py-3 align-top">
                {#if event.connection}
                  <div class="space-y-1">
                    <p class="font-medium">{event.connection.name}</p>
                    <p class="text-xs" style="color: var(--theme-muted-foreground);">
                      {event.connection.serviceType} · {event.connection.environment}
                    </p>
                  </div>
                {:else}
                  <span class="text-xs italic" style="color: var(--theme-muted-foreground);"
                    >Unscoped</span
                  >
                {/if}
              </td>
              <td class="px-4 py-3 align-top font-mono text-xs">{event.errorCode}</td>
              <td class="px-4 py-3 align-top">{event.userMessage}</td>
              <td class="px-4 py-3 align-top font-mono text-xs">{event.correlationId}</td>
              <td class="px-4 py-3 align-top text-xs" style="color: var(--theme-muted-foreground);">
                <pre
                  class="max-w-[24rem] overflow-x-auto whitespace-pre-wrap rounded bg-black/5 p-2">
{JSON.stringify(event.operatorContext, null, 2)}
                </pre>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
