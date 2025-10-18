<script lang="ts">
  import { onMount } from 'svelte';

  export let teamId: string;
  export let settings: { limit?: number } = { limit: 5 };

  interface TimelineEvent {
    id: string;
    shoot_name: string;
    start_date: string;
    end_date: string;
    status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
    color?: string;
  }

  let events: TimelineEvent[] = [];
  let isLoading = true;
  let startDate: Date = new Date();
  let endDate: Date = new Date();

  // Mock data
  const mockEvents: TimelineEvent[] = [
    {
      id: '1',
      shoot_name: 'MHA Convention',
      start_date: '2025-11-15',
      end_date: '2025-11-15',
      status: 'planned',
      color: '#10b981'
    },
    {
      id: '2',
      shoot_name: 'JJK Outdoor',
      start_date: '2025-12-05',
      end_date: '2025-12-05',
      status: 'planned',
      color: '#3b82f6'
    },
    {
      id: '3',
      shoot_name: 'Demon Slayer',
      start_date: '2025-12-20',
      end_date: '2025-12-20',
      status: 'in-progress',
      color: '#8b5cf6'
    }
  ];

  onMount(() => {
    loadEvents();
  });

  async function loadEvents() {
    isLoading = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    
    events = mockEvents.slice(0, settings.limit || 5);
    
    if (events.length > 0) {
      const allDates = events.flatMap(e => [new Date(e.start_date), new Date(e.end_date)]);
      startDate = new Date(Math.min(...allDates.map(d => d.getTime())));
      endDate = new Date(Math.max(...allDates.map(d => d.getTime())));
      
      startDate.setDate(startDate.getDate() - 3);
      endDate.setDate(endDate.getDate() + 7);
    }
    
    isLoading = false;
  }

  function getDaysBetween(date1: Date, date2: Date): number {
    const diff = date2.getTime() - date1.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function getPositionAndWidth(itemStart: string, itemEnd: string): { left: number; width: number } {
    const start = new Date(itemStart);
    const end = new Date(itemEnd);
    
    const totalDays = getDaysBetween(startDate, endDate);
    const startOffset = getDaysBetween(startDate, start);
    const duration = getDaysBetween(start, end) || 1;
    
    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;
    
    return { left: Math.max(0, left), width: Math.max(1, width) };
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function getStatusColor(status: TimelineEvent['status']): string {
    const colors = {
      planned: '#6b7280',
      'in-progress': '#f59e0b',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status];
  }
</script>

<div class="space-y-3">
  {#if isLoading}
    <div class="text-center py-4">
      <div
        class="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto"
        style="border-color: var(--theme-sidebar-accent);"
      ></div>
    </div>
  {:else if events.length === 0}
    <div class="text-center py-6" style="color: var(--theme-sidebar-muted);">
      <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-sm">No upcoming shoots</p>
    </div>
  {:else}
    <!-- Compact Timeline View -->
    <div class="space-y-2">
      {#each events as event (event.id)}
        {@const position = getPositionAndWidth(event.start_date, event.end_date)}
        <div class="space-y-1">
          <!-- Event Header -->
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full"
                style="background: {event.color || getStatusColor(event.status)};"
              ></div>
              <span class="font-medium" style="color: var(--theme-foreground);">
                {event.shoot_name}
              </span>
            </div>
            <span class="text-xs" style="color: var(--theme-sidebar-muted);">
              {formatDate(event.start_date)}
            </span>
          </div>
          
          <!-- Mini Timeline Bar -->
          <div class="h-2 rounded-full relative" style="background: var(--theme-sidebar-border);">
            <div
              class="absolute h-full rounded-full transition-all"
              style="left: {position.left}%; width: {position.width}%; background: {event.color || getStatusColor(event.status)};"
            ></div>
          </div>
        </div>
      {/each}
    </div>

    <!-- View All Link -->
    <div class="pt-2 border-t" style="border-color: var(--theme-sidebar-border);">
      <a
        href="/timeline"
        class="flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
        style="color: var(--theme-sidebar-accent);"
      >
        View Full Timeline
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  {/if}
</div>
