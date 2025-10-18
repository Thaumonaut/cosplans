<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';

  export let teamId: string;

  interface Alert {
    id: string;
    shoot_id: string;
    shoot_name: string;
    type: 'delayed' | 'at_risk' | 'blocked' | 'milestone_missed';
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'overall' | 'costume' | 'props' | 'location' | 'team' | 'checklist' | 'editing';
    message: string;
    current_progress: number;
    expected_progress: number;
    days_behind: number;
    created_at: string;
    acknowledged: boolean;
  }

  let alerts: Alert[] = [];
  let isLoading = true;
  let filter: 'all' | 'unacknowledged' = 'unacknowledged';

  // Mock alerts data
  const mockAlerts: Alert[] = [
    {
      id: '1',
      shoot_id: 'shoot-1',
      shoot_name: 'Resident Evil Photoshoot',
      type: 'delayed',
      severity: 'high',
      category: 'costume',
      message: 'Costume progress is 15% behind schedule. Expected 85%, currently at 70%.',
      current_progress: 70,
      expected_progress: 85,
      days_behind: 3,
      created_at: '2025-10-17T10:00:00Z',
      acknowledged: false
    },
    {
      id: '2',
      shoot_id: 'shoot-2',
      shoot_name: 'Final Fantasy XIV Convention',
      type: 'at_risk',
      severity: 'medium',
      category: 'props',
      message: 'Props progress trending below target. May miss deadline if pace continues.',
      current_progress: 55,
      expected_progress: 65,
      days_behind: 2,
      created_at: '2025-10-16T14:30:00Z',
      acknowledged: false
    },
    {
      id: '3',
      shoot_id: 'shoot-1',
      shoot_name: 'Resident Evil Photoshoot',
      type: 'milestone_missed',
      severity: 'critical',
      category: 'editing',
      message: 'Editing milestone "First Draft Complete" was due 2 days ago.',
      current_progress: 35,
      expected_progress: 100,
      days_behind: 2,
      created_at: '2025-10-18T08:00:00Z',
      acknowledged: false
    },
    {
      id: '4',
      shoot_id: 'shoot-3',
      shoot_name: 'Anime Expo Group Shoot',
      type: 'blocked',
      severity: 'high',
      category: 'location',
      message: 'Location scouting blocked - awaiting venue confirmation.',
      current_progress: 30,
      expected_progress: 50,
      days_behind: 5,
      created_at: '2025-10-15T16:00:00Z',
      acknowledged: true
    }
  ];

  onMount(() => {
    loadAlerts();
  });

  async function loadAlerts() {
    isLoading = true;
    // TODO: Replace with actual Supabase query
    await new Promise(resolve => setTimeout(resolve, 500));
    alerts = mockAlerts;
    isLoading = false;
  }

  async function acknowledgeAlert(alertId: string) {
    // TODO: Update in Supabase
    alerts = alerts.map(a => 
      a.id === alertId ? { ...a, acknowledged: true } : a
    );
  }

  async function dismissAlert(alertId: string) {
    // TODO: Delete from Supabase
    alerts = alerts.filter(a => a.id !== alertId);
  }

  function getSeverityColor(severity: Alert['severity']): string {
    const colors = {
      low: 'rgb(59, 130, 246)', // blue
      medium: 'rgb(245, 158, 11)', // amber
      high: 'rgb(239, 68, 68)', // red
      critical: 'rgb(127, 29, 29)' // dark red
    };
    return colors[severity];
  }

  function getAlertIcon(type: Alert['type']): string {
    const icons = {
      delayed: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      at_risk: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      blocked: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
      milestone_missed: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return icons[type];
  }

  function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  $: filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => !a.acknowledged);

  $: unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;
</script>

<div class="space-y-4">
  <!-- Header with Filters -->
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold" style="color: var(--theme-foreground);">
      Progress Alerts
      {#if unacknowledgedCount > 0}
        <span
          class="ml-2 px-2 py-0.5 text-xs rounded-full"
          style="background: rgb(239, 68, 68); color: white;"
        >
          {unacknowledgedCount}
        </span>
      {/if}
    </h3>

    <div class="flex gap-2">
      <button
        on:click={() => filter = 'unacknowledged'}
        class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
        class:active={filter === 'unacknowledged'}
        style="background: {filter === 'unacknowledged' ? 'var(--theme-sidebar-accent)' : 'var(--theme-sidebar-hover)'}; color: {filter === 'unacknowledged' ? 'white' : 'var(--theme-sidebar-text)'};"
      >
        Unacknowledged
      </button>
      <button
        on:click={() => filter = 'all'}
        class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
        class:active={filter === 'all'}
        style="background: {filter === 'all' ? 'var(--theme-sidebar-accent)' : 'var(--theme-sidebar-hover)'}; color: {filter === 'all' ? 'white' : 'var(--theme-sidebar-text)'};"
      >
        All
      </button>
    </div>
  </div>

  <!-- Alerts List -->
  {#if isLoading}
    <div class="text-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
        style="border-color: var(--theme-sidebar-accent);"
      ></div>
    </div>
  {:else if filteredAlerts.length === 0}
    <div
      class="text-center py-12 rounded-lg border"
      style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border); color: var(--theme-sidebar-muted);"
    >
      <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>No alerts to display</p>
      <p class="text-xs mt-1">All shoots are on track!</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each filteredAlerts as alert (alert.id)}
        <div
          class="p-4 rounded-lg border transition-all"
          class:opacity-60={alert.acknowledged}
          style="background: var(--theme-sidebar-hover); border-color: {getSeverityColor(alert.severity)}; border-left-width: 4px;"
        >
          <div class="flex items-start justify-between gap-4">
            <!-- Icon & Content -->
            <div class="flex items-start gap-3 flex-1">
              <div
                class="p-2 rounded-lg"
                style="background: {getSeverityColor(alert.severity)}20;"
              >
                <svg
                  class="w-5 h-5"
                  style="color: {getSeverityColor(alert.severity)};"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d={getAlertIcon(alert.type)}
                  />
                </svg>
              </div>

              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-semibold" style="color: var(--theme-foreground);">
                    {alert.shoot_name}
                  </h4>
                  <span
                    class="px-2 py-0.5 text-xs rounded-full uppercase font-medium"
                    style="background: {getSeverityColor(alert.severity)}; color: white;"
                  >
                    {alert.severity}
                  </span>
                  <span
                    class="px-2 py-0.5 text-xs rounded"
                    style="background: var(--theme-sidebar-border); color: var(--theme-sidebar-muted);"
                  >
                    {alert.category}
                  </span>
                </div>

                <p class="text-sm mb-2" style="color: var(--theme-sidebar-text);">
                  {alert.message}
                </p>

                <div class="flex items-center gap-4 text-xs" style="color: var(--theme-sidebar-muted);">
                  <span>{alert.days_behind} days behind</span>
                  <span>•</span>
                  <span>{formatRelativeTime(alert.created_at)}</span>
                  {#if alert.acknowledged}
                    <span>•</span>
                    <span class="flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Acknowledged
                    </span>
                  {/if}
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              {#if !alert.acknowledged}
                <Button
                  variant="ghost"
                  size="sm"
                  on:click={() => acknowledgeAlert(alert.id)}
                >
                  Acknowledge
                </Button>
              {/if}
              <Button
                variant="ghost"
                size="sm"
                on:click={() => dismissAlert(alert.id)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>
