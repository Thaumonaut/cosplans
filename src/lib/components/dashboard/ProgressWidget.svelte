<script lang="ts">
  import { onMount } from 'svelte';
  import type { DashboardWidget } from '$lib/types/dashboard';

  // Props  
  export let widget: DashboardWidget;
  export let teamId: string;

  // Component state
  let progressData: any = null;
  let loading = true;
  let error: string | null = null;

  // Mock progress data
  const mockProgressData = {
    overall_progress: 67,
    categories: [
      { name: 'Costumes', progress: 85, color: 'bg-green-500' },
      { name: 'Props', progress: 45, color: 'bg-yellow-500' },
      { name: 'Location', progress: 90, color: 'bg-blue-500' },
      { name: 'Team', progress: 75, color: 'bg-purple-500' },
      { name: 'Editing', progress: 30, color: 'bg-red-500' },
      { name: 'Checklist', progress: 60, color: 'bg-indigo-500' }
    ],
    outstanding_tasks: [
      { id: '1', description: 'Wig styling for Sailor Moon', due_date: '2025-10-23', priority: 'high' },
      { id: '2', description: 'Props weathering', due_date: '2025-10-25', priority: 'medium' },
      { id: '3', description: 'Location permits', due_date: '2025-10-27', priority: 'high' }
    ],
    recent_updates: [
      { description: 'Costume construction completed', timestamp: '2025-10-16T10:30:00Z' },
      { description: 'Props base coat applied', timestamp: '2025-10-16T09:15:00Z' }
    ]
  };

  onMount(async () => {
    try {
      loading = true;
      console.log('Loading progress for team:', teamId);
      
      // In a real app, this would aggregate progress from multiple shoots
      // const { data, error: fetchError } = await supabase
      //   .from('progress_trackers')
      //   .select(`
      //     *,
      //     shoots!inner(team_id)
      //   `)
      //   .eq('shoots.team_id', teamId);
      
      // For now, use mock data
      progressData = mockProgressData;
      error = null;
    } catch (err) {
      error = 'Failed to load progress data';
      console.error('Error loading progress:', err);
    } finally {
      loading = false;
    }
  });

  // Theme-aware progress color system
  // Uses CSS custom properties with fallback colors that work on any theme
  function getProgressBarStyle(progress: number): string {
    if (progress >= 80) {
      // Excellent: Bright green with glow
      return 'background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%); box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);';
    } else if (progress >= 60) {
      // Good: Bright teal
      return 'background: linear-gradient(90deg, #06b6d4 0%, #0891b2 100%); box-shadow: 0 0 8px rgba(6, 182, 212, 0.4);';
    } else if (progress >= 40) {
      // Moderate: Bright amber
      return 'background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%); box-shadow: 0 0 8px rgba(251, 191, 36, 0.4);';
    } else if (progress >= 20) {
      // Low: Bright orange
      return 'background: linear-gradient(90deg, #fb923c 0%, #f97316 100%); box-shadow: 0 0 8px rgba(251, 146, 60, 0.4);';
    } else {
      // Critical: Bright red
      return 'background: linear-gradient(90deg, #f87171 0%, #ef4444 100%); box-shadow: 0 0 8px rgba(248, 113, 113, 0.4);';
    }
  }

  function getProgressTextColor(progress: number): string {
    if (progress >= 80) return 'color: #22c55e; font-weight: 700;'; // Bright green
    if (progress >= 60) return 'color: #06b6d4; font-weight: 700;'; // Bright cyan
    if (progress >= 40) return 'color: #fbbf24; font-weight: 700;'; // Bright amber
    if (progress >= 20) return 'color: #fb923c; font-weight: 700;'; // Bright orange
    return 'color: #f87171; font-weight: 700;'; // Bright red
  }

  function formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  }
</script>

<div class="space-y-4">
  {#if loading}
    <!-- Loading State -->
    <div class="animate-pulse space-y-4">
      <div class="h-4 rounded w-3/4" style="background: var(--theme-sidebar-border);"></div>
      <div class="h-2 rounded" style="background: var(--theme-sidebar-border);"></div>
      <div class="grid grid-cols-2 gap-4">
        {#each Array(6) as _}
          <div class="text-center">
            <div class="h-6 rounded w-8 mx-auto mb-1" style="background: var(--theme-sidebar-border);"></div>
            <div class="h-3 rounded w-16 mx-auto" style="background: var(--theme-sidebar-border);"></div>
          </div>
        {/each}
      </div>
    </div>

  {:else if error}
    <!-- Error State -->
    <div class="text-center py-4">
      <div class="mb-2" style="color: var(--theme-sidebar-accent);">
        <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-sm" style="color: var(--theme-sidebar-text);">{error}</p>
    </div>

  {:else if progressData}
    <!-- Overall Progress -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium" style="color: var(--theme-foreground);">Overall Progress</span>
        <span class="text-sm font-bold" style="{getProgressTextColor(progressData.overall_progress)}">
          {progressData.overall_progress}%
        </span>
      </div>
      
      <div class="w-full rounded-full h-3.5" style="background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(4px);">
        <div 
          class="h-3.5 rounded-full transition-all duration-500"
          style="width: {progressData.overall_progress}%; {getProgressBarStyle(progressData.overall_progress)}"
        ></div>
      </div>
    </div>

    <!-- Category Breakdown -->
    {#if widget.settings?.showDetails !== false}
      <div class="grid grid-cols-2 gap-4 text-xs">
        {#each progressData.categories as category}
          <div class="text-center">
            <div class="text-lg font-bold mb-1" style="{getProgressTextColor(category.progress)}">
              {category.progress}%
            </div>
            <div class="mb-2 text-xs font-medium" style="color: var(--theme-sidebar-text); opacity: 0.8;">{category.name}</div>
            <div class="w-full rounded-full h-2.5" style="background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(4px);">
              <div 
                class="h-2.5 rounded-full transition-all duration-500"
                style="width: {category.progress}%; {getProgressBarStyle(category.progress)}"
              ></div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Outstanding Tasks -->
      {#if progressData.outstanding_tasks.length > 0}
        <div class="pt-3" style="border-top: 1px solid var(--theme-sidebar-border);">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium" style="color: var(--theme-foreground);">Outstanding Tasks</span>
            <span class="text-xs" style="color: var(--theme-sidebar-text); opacity: 0.6;">{progressData.outstanding_tasks.length}</span>
          </div>
          
          <div class="space-y-1">
            {#each progressData.outstanding_tasks.slice(0, 3) as task}
              <div class="flex items-center justify-between text-xs">
                <span class="truncate pr-2" style="color: var(--theme-sidebar-text); opacity: 0.8;">{task.description}</span>
                <span class={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            {/each}
            
            {#if progressData.outstanding_tasks.length > 3}
              <div class="text-center pt-1">
                <a href="/progress" class="text-xs" style="color: var(--theme-sidebar-accent);">
                  +{progressData.outstanding_tasks.length - 3} more tasks
                </a>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Recent Updates -->
      {#if progressData.recent_updates.length > 0}
        <div class="pt-3" style="border-top: 1px solid var(--theme-sidebar-border);">
          <div class="text-xs font-medium mb-2" style="color: var(--theme-foreground);">Recent Updates</div>
          <div class="space-y-1">
            {#each progressData.recent_updates.slice(0, 2) as update}
              <div class="flex items-start space-x-2 text-xs">
                <div class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--theme-sidebar-accent);"></div>
                <div class="flex-1">
                  <span style="color: var(--theme-sidebar-text); opacity: 0.8;">{update.description}</span>
                  <div class="text-xs" style="color: var(--theme-sidebar-text); opacity: 0.5;">{formatTimeAgo(update.timestamp)}</div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    {:else}
      <!-- Compact view - just show top categories -->
      <div class="flex justify-between text-xs gap-2">
        {#each progressData.categories.slice(0, 4) as category}
          <div class="text-center flex-1">
            <div class="text-sm font-bold mb-1" style="{getProgressTextColor(category.progress)}">
              {category.progress}%
            </div>
            <div class="text-xs mb-1" style="color: var(--theme-sidebar-text); opacity: 0.7;">{category.name}</div>
            <div class="w-full rounded-full h-2" style="background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(4px);">
              <div 
                class="h-2 rounded-full transition-all duration-500"
                style="width: {category.progress}%; {getProgressBarStyle(category.progress)}"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Action Link -->
    <div class="pt-2" style="border-top: 1px solid var(--theme-sidebar-border);">
      <a href="/progress" class="text-xs font-medium" style="color: var(--theme-sidebar-accent);">
        View detailed progress →
      </a>
    </div>
  {/if}
</div>