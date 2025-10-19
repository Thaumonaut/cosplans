<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  export let teamId: string;

  interface TimelineEvent {
    id: string;
    shoot_id: string;
    shoot_name: string;
    start_date: string;
    end_date: string;
    status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
    dependencies: string[];
    team_members: string[];
    color?: string;
  }

  interface CostumeBuild {
    id: string;
    shoot_id: string;
    character_name: string;
    phase: 'planning' | 'sourcing' | 'building' | 'complete';
    start_date: string;
    end_date: string;
  }

  type ZoomLevel = 'day' | 'week' | 'month' | 'quarter' | 'year';

  let events: TimelineEvent[] = [];
  let costumeBuilds: CostumeBuild[] = [];
  let zoomLevel: ZoomLevel = 'month';
  let startDate: Date = new Date();
  let endDate: Date = new Date();
  let isLoading = true;
  let isDragging = false;
  let draggedEventId: string | null = null;
  let isZooming = false;
  let dragStartX = 0;
  let timelineWidth = 0;
  let timelineElement: HTMLElement | null = null;

  // Mock data
  const mockEvents: TimelineEvent[] = [
    {
      id: '1',
      shoot_id: 'shoot-1',
      shoot_name: 'MHA Convention Shoot',
      start_date: '2025-11-15',
      end_date: '2025-11-15',
      status: 'planned',
      dependencies: [],
      team_members: ['user-1', 'user-2'],
      color: '#10b981'
    },
    {
      id: '2',
      shoot_id: 'shoot-2',
      shoot_name: 'JJK Outdoor Shoot',
      start_date: '2025-12-05',
      end_date: '2025-12-05',
      status: 'planned',
      dependencies: ['1'],
      team_members: ['user-1'],
      color: '#3b82f6'
    },
    {
      id: '3',
      shoot_id: 'shoot-3',
      shoot_name: 'Demon Slayer Group',
      start_date: '2025-12-20',
      end_date: '2025-12-20',
      status: 'in-progress',
      dependencies: [],
      team_members: ['user-2', 'user-3'],
      color: '#8b5cf6'
    }
  ];

  const mockCostumeBuilds: CostumeBuild[] = [
    {
      id: 'c1',
      shoot_id: 'shoot-1',
      character_name: 'Deku',
      phase: 'building',
      start_date: '2025-10-20',
      end_date: '2025-11-14'
    },
    {
      id: 'c2',
      shoot_id: 'shoot-2',
      character_name: 'Gojo',
      phase: 'sourcing',
      start_date: '2025-11-01',
      end_date: '2025-12-04'
    },
    {
      id: 'c3',
      shoot_id: 'shoot-3',
      character_name: 'Tanjiro',
      phase: 'complete',
      start_date: '2025-10-01',
      end_date: '2025-10-30'
    }
  ];

  onMount(() => {
    loadTimelineData();
  });

  async function loadTimelineData() {
    isLoading = true;
    // TODO: Replace with actual Supabase query
    await new Promise(resolve => setTimeout(resolve, 500));
    
    events = mockEvents;
    costumeBuilds = mockCostumeBuilds;
    
    // Calculate date range
    const allDates = [
      ...events.flatMap(e => [new Date(e.start_date), new Date(e.end_date)]),
      ...costumeBuilds.flatMap(c => [new Date(c.start_date), new Date(c.end_date)])
    ];
    
    if (allDates.length > 0) {
      startDate = new Date(Math.min(...allDates.map(d => d.getTime())));
      endDate = new Date(Math.max(...allDates.map(d => d.getTime())));
      
      // Add padding
      startDate.setDate(startDate.getDate() - 7);
      endDate.setDate(endDate.getDate() + 14);
    }
    
    isLoading = false;
  }

  function handleZoomChange(level: ZoomLevel) {
    if (zoomLevel === level) return;
    
    isZooming = true;
    zoomLevel = level;
    
    // Reset zooming flag after animation
    setTimeout(() => {
      isZooming = false;
    }, 300);
  }

  function getPhaseColor(phase: CostumeBuild['phase']): string {
    const colors = {
      planning: '#9333ea',
      sourcing: '#f59e0b',
      building: '#3b82f6',
      complete: '#10b981'
    };
    return colors[phase];
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

  function formatDateForZoom(date: Date): string {
    switch (zoomLevel) {
      case 'day':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'week':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      case 'quarter':
        return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
      case 'year':
        return date.getFullYear().toString();
      default:
        return date.toLocaleDateString();
    }
  }

  $: timelineMonths = (() => {
    const months = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  })();

  function handleEventDragStart(eventId: string) {
    isDragging = true;
    draggedEventId = eventId;
  }

  function handleEventDragEnd() {
    isDragging = false;
    draggedEventId = null;
  }

  async function handleEventDrop(eventId: string, newDate: Date) {
    // TODO: Update event date in database and trigger SSE notification
    console.log(`Moving event ${eventId} to ${newDate}`);
  }

  function handleTimelineDragOver(e: DragEvent) {
    e.preventDefault();
    if (!isDragging || !draggedEventId) return;
  }

  function handleTimelineDrop(e: DragEvent) {
    e.preventDefault();
    if (!draggedEventId || !timelineElement) return;

    const rect = timelineElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;

    const totalDays = getDaysBetween(startDate, endDate);
    const daysFromStart = Math.floor(totalDays * percentage);

    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + daysFromStart);

    // Update the event date
    const event = events.find(ev => ev.id === draggedEventId);
    if (event) {
      const duration = getDaysBetween(new Date(event.start_date), new Date(event.end_date));
      const newEndDate = new Date(newDate);
      newEndDate.setDate(newEndDate.getDate() + duration);

      // Update events array
      events = events.map(ev => 
        ev.id === draggedEventId
          ? { ...ev, start_date: newDate.toISOString().split('T')[0], end_date: newEndDate.toISOString().split('T')[0] }
          : ev
      );

      // Call API to persist changes
      updateEventDates(draggedEventId, newDate, newEndDate);
    }

    isDragging = false;
    draggedEventId = null;
  }

  async function updateEventDates(eventId: string, startDate: Date, endDate: Date) {
    try {
      const response = await fetch(`/api/timeline/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          start_date: startDate.toISOString(), 
          end_date: endDate.toISOString() 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update event');
      }
      
      const { event } = await response.json();
      console.log(`Successfully updated event ${eventId}`, event);
      
      // TODO: Event will be broadcast via SSE to notify other users
    } catch (error) {
      console.error('Failed to update event dates:', error);
      // Revert changes
      await loadTimelineData();
    }
  }
</script>

<div class="space-y-4">
  <!-- Controls -->
  <div class="flex items-center justify-between gap-4 flex-wrap">
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium" style="color: var(--theme-foreground);">
        Zoom:
      </span>
      <div class="flex gap-1">
        {#each ['day', 'week', 'month', 'quarter', 'year'] as level}
          <button
            on:click={() => handleZoomChange(level as ZoomLevel)}
            class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            class:selected={zoomLevel === level}
            style="background: {zoomLevel === level ? 'var(--theme-sidebar-accent)' : 'var(--theme-sidebar-hover)'}; color: {zoomLevel === level ? 'white' : 'var(--theme-sidebar-text)'};"
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        {/each}
      </div>
    </div>

    <div class="flex items-center gap-2 text-sm" style="color: var(--theme-sidebar-muted);">
      <span>
        {formatDateForZoom(startDate)} - {formatDateForZoom(endDate)}
      </span>
    </div>
  </div>

  <!-- Timeline Grid -->
  {#if isLoading}
    <div class="text-center py-12">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto"
        style="border-color: var(--theme-sidebar-accent);"
      ></div>
    </div>
  {:else}
    <div 
      class="border rounded-lg overflow-hidden timeline-container"
      class:zooming={isZooming}
      style="border-color: var(--theme-sidebar-border);"
    >
      <!-- Timeline Header (Months) -->
      <div class="flex border-b" style="background: var(--theme-header-bg); border-color: var(--theme-sidebar-border);">
        <div class="w-48 flex-shrink-0 px-4 py-3 font-semibold" style="color: var(--theme-header-text);">
          Event / Task
        </div>
        <div class="flex-1 flex">
          {#each timelineMonths as month}
            <div
              class="flex-1 px-2 py-3 text-center text-sm font-medium border-l"
              style="color: var(--theme-header-text); border-color: var(--theme-sidebar-border);"
            >
              {formatDateForZoom(month)}
            </div>
          {/each}
        </div>
      </div>

      <!-- Shoot Events -->
      <div style="background: var(--theme-sidebar-bg);">
        {#each events as event (event.id)}
          {@const position = getPositionAndWidth(event.start_date, event.end_date)}
          <div class="flex border-b" style="border-color: var(--theme-sidebar-border);">
            <div class="w-48 flex-shrink-0 px-4 py-4">
              <div class="font-medium text-sm" style="color: var(--theme-foreground);">
                {event.shoot_name}
              </div>
              <div class="text-xs mt-1" style="color: var(--theme-sidebar-muted);">
                {event.team_members.length} member{event.team_members.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div 
              class="flex-1 relative py-4 px-2"
              bind:this={timelineElement}
              on:dragover={handleTimelineDragOver}
              on:drop={handleTimelineDrop}
              role="region"
              aria-label="Timeline grid"
            >
              <!-- Timeline bar -->
              <div
                class="absolute h-8 rounded-lg transition-all cursor-move"
                draggable="true"
                role="button"
                tabindex="0"
                aria-label="Drag to reschedule {event.shoot_name}"
                on:dragstart={() => handleEventDragStart(event.id)}
                on:dragend={handleEventDragEnd}
                style="left: {position.left}%; width: {position.width}%; background: {event.color || getStatusColor(event.status)}; opacity: {isDragging && draggedEventId === event.id ? 0.5 : 1};"
              >
                <div class="flex items-center justify-center h-full text-white text-xs font-medium px-2">
                  {event.shoot_name}
                </div>
              </div>
            </div>
          </div>

          <!-- Associated costume builds -->
          {#each costumeBuilds.filter(c => c.shoot_id === event.shoot_id) as build (build.id)}
            {@const buildPosition = getPositionAndWidth(build.start_date, build.end_date)}
            <div class="flex border-b" style="border-color: var(--theme-sidebar-border);">
              <div class="w-48 flex-shrink-0 px-4 py-3 pl-8">
                <div class="text-sm" style="color: var(--theme-sidebar-muted);">
                  └ {build.character_name}
                </div>
                <div class="text-xs capitalize" style="color: var(--theme-sidebar-muted);">
                  {build.phase}
                </div>
              </div>
              <div class="flex-1 relative py-3 px-2">
                <div
                  class="absolute h-6 rounded transition-all"
                  style="left: {buildPosition.left}%; width: {buildPosition.width}%; background: {getPhaseColor(build.phase)}; opacity: 0.7;"
                >
                  <div class="flex items-center justify-center h-full text-white text-xs px-2">
                    {build.phase}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        {/each}
      </div>

      <!-- Dependency Arrows (SVG Overlay) -->
      <svg 
        class="absolute top-0 left-0 w-full h-full pointer-events-none"
        style="z-index: 1;"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="var(--theme-sidebar-accent)" />
          </marker>
        </defs>

        {#each events as event, eventIndex}
          {#if event.dependencies && event.dependencies.length > 0}
            {#each event.dependencies as depId}
              {@const dependentEvent = events.find(e => e.id === depId)}
              {#if dependentEvent}
                {@const fromPos = getPositionAndWidth(dependentEvent.start_date, dependentEvent.end_date)}
                {@const toPos = getPositionAndWidth(event.start_date, event.end_date)}
                {@const fromIndex = events.findIndex(e => e.id === depId)}
                {@const rowHeight = 60}
                {@const labelWidth = 192}
                {@const fromY = fromIndex * rowHeight + rowHeight / 2 + 60}
                {@const toY = eventIndex * rowHeight + rowHeight / 2 + 60}
                {@const fromX = labelWidth + (fromPos.left + fromPos.width) * 0.01 * (timelineWidth || 800)}
                {@const toX = labelWidth + toPos.left * 0.01 * (timelineWidth || 800)}
                {@const midX = (fromX + toX) / 2}
                
                <path
                  d="M {fromX} {fromY} C {midX} {fromY}, {midX} {toY}, {toX} {toY}"
                  stroke="var(--theme-sidebar-accent)"
                  stroke-width="2"
                  fill="none"
                  marker-end="url(#arrowhead)"
                  opacity="0.6"
                />
              {/if}
            {/each}
          {/if}
        {/each}
      </svg>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-4 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background: #10b981;"></div>
        <span style="color: var(--theme-sidebar-muted);">Shoot Event</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background: #3b82f6; opacity: 0.7;"></div>
        <span style="color: var(--theme-sidebar-muted);">Costume Build</span>
      </div>
      <div class="flex items-center gap-2">
        <svg class="w-6 h-4" viewBox="0 0 24 16">
          <path
            d="M2 8 L22 8"
            stroke="var(--theme-sidebar-accent)"
            stroke-width="2"
            fill="none"
            marker-end="url(#arrowhead)"
          />
        </svg>
        <span style="color: var(--theme-sidebar-muted);">Dependency</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .selected {
    box-shadow: 0 0 0 2px var(--theme-sidebar-accent);
    transform: scale(1.02);
  }
  
  .timeline-container {
    transition: opacity 0.3s ease-in-out;
  }
  
  .timeline-container.zooming {
    opacity: 0.7;
  }
  
  .timeline-container :global(.transition-all) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  button {
    transition: all 0.2s ease-in-out;
  }
  
  button:hover:not(.selected) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  button:active {
    transform: translateY(0);
  }
  
  .cursor-move:hover {
    filter: brightness(1.1);
  }
  
  .cursor-move:active {
    cursor: grabbing;
  }
</style>
