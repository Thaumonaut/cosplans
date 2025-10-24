<script lang="ts">
  import { onMount } from 'svelte';

  export let shootId: string;
  export let timeRange: '7d' | '30d' | '90d' = '30d';

  interface ProgressSnapshot {
    date: string;
    overall_progress: number;
    costume_progress: number;
    props_progress: number;
    location_progress: number;
    team_progress: number;
    checklist_progress: number;
    editing_progress: number;
  }

  let progressHistory: ProgressSnapshot[] = [];
  let isLoading = true;
  let selectedCategory: 'overall' | 'costume' | 'props' | 'location' | 'team' | 'checklist' | 'editing' = 'overall';

  // Mock historical data
  const mockProgressHistory: ProgressSnapshot[] = [
    { date: '2025-10-01', overall_progress: 20, costume_progress: 15, props_progress: 10, location_progress: 30, team_progress: 25, checklist_progress: 20, editing_progress: 0 },
    { date: '2025-10-05', overall_progress: 35, costume_progress: 30, props_progress: 25, location_progress: 50, team_progress: 40, checklist_progress: 35, editing_progress: 0 },
    { date: '2025-10-08', overall_progress: 45, costume_progress: 40, props_progress: 40, location_progress: 60, team_progress: 50, checklist_progress: 45, editing_progress: 10 },
    { date: '2025-10-12', overall_progress: 58, costume_progress: 55, props_progress: 60, location_progress: 80, team_progress: 65, checklist_progress: 55, editing_progress: 20 },
    { date: '2025-10-15', overall_progress: 72, costume_progress: 70, props_progress: 75, location_progress: 100, team_progress: 80, checklist_progress: 70, editing_progress: 40 },
    { date: '2025-10-18', overall_progress: 82, costume_progress: 85, props_progress: 85, location_progress: 100, team_progress: 90, checklist_progress: 80, editing_progress: 55 }
  ];

  onMount(() => {
    loadProgressHistory();
  });

  async function loadProgressHistory() {
    isLoading = true;
    // TODO: Replace with actual Supabase query
    await new Promise(resolve => setTimeout(resolve, 500));
    progressHistory = mockProgressHistory;
    isLoading = false;
  }

  function getProgressValue(snapshot: ProgressSnapshot): number {
    switch (selectedCategory) {
      case 'overall': return snapshot.overall_progress;
      case 'costume': return snapshot.costume_progress;
      case 'props': return snapshot.props_progress;
      case 'location': return snapshot.location_progress;
      case 'team': return snapshot.team_progress;
      case 'checklist': return snapshot.checklist_progress;
      case 'editing': return snapshot.editing_progress;
      default: return snapshot.overall_progress;
    }
  }

  function getCategoryColor(category: typeof selectedCategory): string {
    const colors = {
      overall: '#8b5cf6',
      costume: '#10b981',
      props: '#3b82f6',
      location: '#f59e0b',
      team: '#ec4899',
      checklist: '#06b6d4',
      editing: '#ef4444'
    };
    return colors[category];
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  $: chartData = progressHistory.map(snapshot => ({
    date: snapshot.date,
    value: getProgressValue(snapshot)
  }));

  $: maxValue = Math.max(...chartData.map(d => d.value), 100);
  
  $: trendDirection = (() => {
    if (chartData.length < 2) return 'neutral';
    const recent = chartData.slice(-3);
    const first = recent[0].value;
    const last = recent[recent.length - 1].value;
    const change = last - first;
    
    if (change > 10) return 'up';
    if (change < -5) return 'down';
    return 'neutral';
  })();

  $: averageGrowth = (() => {
    if (chartData.length < 2) return 0;
    const total = chartData[chartData.length - 1].value - chartData[0].value;
    const days = chartData.length - 1;
    return days > 0 ? (total / days).toFixed(1) : 0;
  })();
</script>

<div class="space-y-4">
  <!-- Category Selection -->
  <div class="flex flex-wrap gap-2">
    {#each [
      { key: 'overall', label: 'Overall' },
      { key: 'costume', label: 'Costume' },
      { key: 'props', label: 'Props' },
      { key: 'location', label: 'Location' },
      { key: 'team', label: 'Team' },
      { key: 'checklist', label: 'Checklist' },
      { key: 'editing', label: 'Editing' }
    ] as category}
      <button
        onclick={() => selectedCategory = category.key}
        class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
        class:selected={selectedCategory === category.key}
        style="background: {selectedCategory === category.key ? getCategoryColor(category.key) : 'var(--theme-sidebar-hover)'}; color: {selectedCategory === category.key ? 'white' : 'var(--theme-sidebar-text)'};"
      >
        {category.label}
      </button>
    {/each}
  </div>

  <!-- Trend Stats -->
  <div class="grid grid-cols-2 gap-4">
    <div
      class="p-4 rounded-lg border"
      style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border);"
    >
      <div class="text-sm mb-1" style="color: var(--theme-sidebar-muted);">
        Current Progress
      </div>
      <div class="text-2xl font-bold" style="color: var(--theme-foreground);">
        {chartData.length > 0 ? chartData[chartData.length - 1].value : 0}%
      </div>
    </div>
    
    <div
      class="p-4 rounded-lg border"
      style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border);"
    >
      <div class="text-sm mb-1" style="color: var(--theme-sidebar-muted);">
        Avg. Growth per Day
      </div>
      <div class="text-2xl font-bold flex items-center gap-2" style="color: var(--theme-foreground);">
        {averageGrowth}%
        {#if trendDirection === 'up'}
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        {:else if trendDirection === 'down'}
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        {:else}
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
          </svg>
        {/if}
      </div>
    </div>
  </div>

  <!-- Chart -->
  {#if isLoading}
    <div class="text-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
        style="border-color: var(--theme-sidebar-accent);"
      ></div>
    </div>
  {:else if chartData.length === 0}
    <div class="text-center py-12" style="color: var(--theme-sidebar-muted);">
      <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p class="text-sm">No progress history available</p>
    </div>
  {:else}
    <div
      class="p-6 rounded-lg border"
      style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border);"
    >
      <!-- SVG Chart -->
      <svg class="w-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
        <!-- Grid lines -->
        {#each [0, 25, 50, 75, 100] as gridLine}
          <line
            x1="50"
            y1={250 - (gridLine / 100) * 200}
            x2="780"
            y2={250 - (gridLine / 100) * 200}
            stroke="var(--theme-sidebar-border)"
            stroke-width="1"
            stroke-dasharray="4,4"
          />
          <text
            x="30"
            y={250 - (gridLine / 100) * 200 + 5}
            fill="var(--theme-sidebar-muted)"
            font-size="12"
            text-anchor="end"
          >
            {gridLine}%
          </text>
        {/each}

        <!-- Line chart -->
        <polyline
          fill="none"
          stroke={getCategoryColor(selectedCategory)}
          stroke-width="3"
          points={chartData
            .map((d, i) => {
              const x = 50 + (i / (chartData.length - 1 || 1)) * 730;
              const y = 250 - (d.value / maxValue) * 200;
              return `${x},${y}`;
            })
            .join(' ')}
        />

        <!-- Data points -->
        {#each chartData as d, i}
          {@const x = 50 + (i / (chartData.length - 1 || 1)) * 730}
          {@const y = 250 - (d.value / maxValue) * 200}
          <circle
            cx={x}
            cy={y}
            r="5"
            fill={getCategoryColor(selectedCategory)}
            stroke="white"
            stroke-width="2"
          />
          
          <!-- Date labels -->
          <text
            x={x}
            y="280"
            fill="var(--theme-sidebar-muted)"
            font-size="11"
            text-anchor="middle"
          >
            {formatDate(d.date)}
          </text>
        {/each}

        <!-- Area fill -->
        <polygon
          fill={getCategoryColor(selectedCategory)}
          fill-opacity="0.1"
          points={[
            ...chartData.map((d, i) => {
              const x = 50 + (i / (chartData.length - 1 || 1)) * 730;
              const y = 250 - (d.value / maxValue) * 200;
              return `${x},${y}`;
            }),
            `${50 + 730},250`,
            `50,250`
          ].join(' ')}
        />
      </svg>
    </div>
  {/if}
</div>

<style>
  .selected {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
</style>
