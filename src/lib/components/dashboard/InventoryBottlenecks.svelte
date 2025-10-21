<script lang="ts">
  import { onMount } from 'svelte';

  export let shootId: string;

  interface BottleneckItem {
    id: string;
    name: string;
    type: 'costume' | 'prop' | 'accessory' | 'makeup';
    status: string;
    character_name: string;
    days_stuck: number;
    blocking_reason: string;
    estimated_resolution_days: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    assigned_to: string | null;
    dependencies: string[];
  }

  let bottlenecks: BottleneckItem[] = [];
  let isLoading = true;
  let sortBy: 'priority' | 'days_stuck' | 'resolution' = 'priority';

  // Mock bottleneck data
  const mockBottlenecks: BottleneckItem[] = [
    {
      id: '1',
      name: 'Jill Valentine Police Vest',
      type: 'costume',
      status: 'ordered',
      character_name: 'Jill Valentine',
      days_stuck: 12,
      blocking_reason: 'Waiting for vendor shipment - delayed by supplier',
      estimated_resolution_days: 5,
      priority: 'critical',
      assigned_to: 'Sarah Chen',
      dependencies: ['Jill Valentine Pants', 'Jill Valentine Boots']
    },
    {
      id: '2',
      name: 'RE Typewriter Prop',
      type: 'prop',
      status: 'in_fabrication',
      character_name: 'Set Piece',
      days_stuck: 8,
      blocking_reason: '3D print failed twice - needs redesign',
      estimated_resolution_days: 10,
      priority: 'high',
      assigned_to: 'Mike Johnson',
      dependencies: []
    },
    {
      id: '3',
      name: 'First Aid Spray Props',
      type: 'prop',
      status: 'needed',
      character_name: 'Multiple',
      days_stuck: 5,
      blocking_reason: 'Budget approval pending for materials',
      estimated_resolution_days: 3,
      priority: 'medium',
      assigned_to: null,
      dependencies: []
    }
  ];

  onMount(() => {
    loadBottlenecks();
  });

  async function loadBottlenecks() {
    isLoading = true;
    // TODO: Replace with actual Supabase query that calculates:
    // - Items stuck in same status for > 7 days
    // - Items blocking other items via dependencies
    // - Items with missed target dates
    await new Promise(resolve => setTimeout(resolve, 500));
    bottlenecks = mockBottlenecks;
    isLoading = false;
  }

  function getPriorityColor(priority: BottleneckItem['priority']): string {
    const colors = {
      low: 'rgb(59, 130, 246)',
      medium: 'rgb(245, 158, 11)',
      high: 'rgb(239, 68, 68)',
      critical: 'rgb(127, 29, 29)'
    };
    return colors[priority];
  }

  function getTypeIcon(type: BottleneckItem['type']): string {
    const icons = {
      costume: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      prop: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      accessory: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      makeup: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
    };
    return icons[type];
  }

  async function resolveBottleneck(itemId: string) {
    // TODO: Implement resolution workflow
    bottlenecks = bottlenecks.filter(b => b.id !== itemId);
  }

  async function assignToMe(itemId: string) {
    // TODO: Implement assignment
    bottlenecks = bottlenecks.map(b => 
      b.id === itemId ? { ...b, assigned_to: 'Current User' } : b
    );
  }

  $: sortedBottlenecks = [...bottlenecks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === 'days_stuck') {
      return b.days_stuck - a.days_stuck;
    } else {
      return a.estimated_resolution_days - b.estimated_resolution_days;
    }
  });

  $: criticalCount = bottlenecks.filter(b => b.priority === 'critical').length;
  $: unassignedCount = bottlenecks.filter(b => !b.assigned_to).length;
</script>

<div class="space-y-4">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-lg font-semibold" style="color: var(--theme-foreground);">
        Inventory Bottlenecks
        {#if criticalCount > 0}
          <span
            class="ml-2 px-2 py-0.5 text-xs rounded-full"
            style="background: rgb(127, 29, 29); color: white;"
          >
            {criticalCount} Critical
          </span>
        {/if}
      </h3>
      <p class="text-sm mt-1" style="color: var(--theme-sidebar-muted);">
        Items blocking shoot progress
      </p>
    </div>

    <div class="flex gap-2">
      <select
        bind:value={sortBy}
        class="px-3 py-1.5 rounded border text-sm"
        style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border); color: var(--theme-sidebar-text);"
      >
        <option value="priority">Sort by Priority</option>
        <option value="days_stuck">Sort by Days Stuck</option>
        <option value="resolution">Sort by Resolution Time</option>
      </select>
    </div>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-3 gap-4">
    <div
      class="p-4 rounded-lg border"
      style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border);"
    >
      <div class="text-2xl font-bold" style="color: var(--theme-foreground);">
        {bottlenecks.length}
      </div>
      <div class="text-sm" style="color: var(--theme-sidebar-muted);">
        Total Bottlenecks
      </div>
    </div>

    <div
      class="p-4 rounded-lg border"
      style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border);"
    >
      <div class="text-2xl font-bold" style="color: var(--theme-foreground);">
        {unassignedCount}
      </div>
      <div class="text-sm" style="color: var(--theme-sidebar-muted);">
        Unassigned
      </div>
    </div>

    <div
      class="p-4 rounded-lg border"
      style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border);"
    >
      <div class="text-2xl font-bold" style="color: var(--theme-foreground);">
        {bottlenecks.reduce((sum, b) => sum + b.days_stuck, 0)}
      </div>
      <div class="text-sm" style="color: var(--theme-sidebar-muted);">
        Total Days Blocked
      </div>
    </div>
  </div>

  <!-- Bottlenecks List -->
  {#if isLoading}
    <div class="text-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
        style="border-color: var(--theme-sidebar-accent);"
      ></div>
    </div>
  {:else if sortedBottlenecks.length === 0}
    <div
      class="text-center py-12 rounded-lg border"
      style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border); color: var(--theme-sidebar-muted);"
    >
      <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>No bottlenecks detected</p>
      <p class="text-xs mt-1">All inventory items are progressing smoothly!</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each sortedBottlenecks as item (item.id)}
        <div
          class="p-4 rounded-lg border"
          style="background: var(--theme-sidebar-hover); border-color: {getPriorityColor(item.priority)}; border-left-width: 4px;"
        >
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div
              class="p-2 rounded-lg"
              style="background: {getPriorityColor(item.priority)}20;"
            >
              <svg
                class="w-5 h-5"
                style="color: {getPriorityColor(item.priority)};"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d={getTypeIcon(item.type)}
                />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1">
              <div class="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h4 class="font-semibold" style="color: var(--theme-foreground);">
                    {item.name}
                  </h4>
                  <p class="text-sm" style="color: var(--theme-sidebar-muted);">
                    {item.character_name} • {item.type}
                  </p>
                </div>

                <div class="flex gap-2">
                  <span
                    class="px-2 py-0.5 text-xs rounded-full uppercase font-medium"
                    style="background: {getPriorityColor(item.priority)}; color: white;"
                  >
                    {item.priority}
                  </span>
                  <span
                    class="px-2 py-0.5 text-xs rounded"
                    style="background: var(--theme-sidebar-border); color: var(--theme-sidebar-muted);"
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              <!-- Blocking Reason -->
              <div
                class="p-3 rounded mb-3"
                style="background: var(--theme-sidebar-border);"
              >
                <div class="text-xs font-medium mb-1" style="color: var(--theme-sidebar-muted);">
                  Blocking Reason
                </div>
                <p class="text-sm" style="color: var(--theme-sidebar-text);">
                  {item.blocking_reason}
                </p>
              </div>

              <!-- Stats & Actions -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 text-xs" style="color: var(--theme-sidebar-muted);">
                  <span class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Stuck {item.days_stuck} days
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    ~{item.estimated_resolution_days} days to resolve
                  </span>
                  {#if item.assigned_to}
                    <span class="flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {item.assigned_to}
                    </span>
                  {:else}
                    <span class="flex items-center gap-1 text-amber-500">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Unassigned
                    </span>
                  {/if}
                  {#if item.dependencies.length > 0}
                    <span class="flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Blocks {item.dependencies.length} items
                    </span>
                  {/if}
                </div>

                <div class="flex gap-2">
                  {#if !item.assigned_to}
                    <Button
                      variant="ghost"
                      size="sm"
                      on:click={() => assignToMe(item.id)}
                    >
                      Assign to Me
                    </Button>
                  {/if}
                  <Button
                    variant="default"
                    size="sm"
                    on:click={() => resolveBottleneck(item.id)}
                  >
                    Mark Resolved
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
