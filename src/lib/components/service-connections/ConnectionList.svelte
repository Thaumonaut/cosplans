<script lang="ts">
  import type { ServiceConnectionProfile } from "$lib/types/service-connections";

  export let connections: ServiceConnectionProfile[] = [];

  const formatDate = (value: Date | string | null | undefined) => {
    if (!value) return "Never";
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "Never";
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };
</script>

<div class="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-sm">
  <div class="border-b border-[var(--theme-border)] px-4 py-3">
    <h2 class="text-base font-semibold" style="color: var(--theme-foreground);">
      Configured Connections
    </h2>
  </div>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-[var(--theme-border)]" aria-label="Configured service connections">
      <thead class="bg-[var(--theme-subtle-bg)]">
        <tr>
          <th scope="col" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted)]">
            Name
          </th>
          <th scope="col" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted)]">
            Environment
          </th>
          <th scope="col" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted)]">
            Status
          </th>
          <th scope="col" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted)]">
            Last Verified
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[var(--theme-border)] bg-[var(--theme-surface)]">
        {#if connections.length === 0}
          <tr>
            <td colspan="4" class="px-4 py-6 text-sm text-[var(--theme-muted)]">
              No service connections configured yet.
            </td>
          </tr>
        {:else}
          {#each connections as connection}
            <tr>
              <td class="px-4 py-4 text-sm font-medium" style="color: var(--theme-foreground);">
                {connection.connectionMetadata?.displayName ?? connection.supabaseProjectRef}
              </td>
              <td class="px-4 py-4 text-sm capitalize" style="color: var(--theme-muted);">
                {connection.environment}
              </td>
              <td class="px-4 py-4">
                <span
                  class={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    connection.status === "active"
                      ? "bg-emerald-100 text-emerald-800"
                      : connection.status === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {connection.status.replace(/_/g, " ")}
                </span>
              </td>
              <td class="px-4 py-4 text-sm" style="color: var(--theme-muted);">
                {formatDate(connection.lastVerifiedAt)}
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
