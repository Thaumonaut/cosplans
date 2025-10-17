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

  function getProgressColor(progress: number): string {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  }

  function getProgressBarColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
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
      <div class="h-4 bg-gray-300 rounded w-3/4"></div>
      <div class="h-2 bg-gray-300 rounded"></div>
      <div class="grid grid-cols-2 gap-4">
        {#each Array(6) as _}
          <div class="text-center">
            <div class="h-6 bg-gray-300 rounded w-8 mx-auto mb-1"></div>
            <div class="h-3 bg-gray-300 rounded w-16 mx-auto"></div>
          </div>
        {/each}
      </div>
    </div>

  {:else if error}
    <!-- Error State -->
    <div class="text-center py-4">
      <div class="text-red-500 mb-2">
        <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-sm text-red-600">{error}</p>
    </div>

  {:else if progressData}
    <!-- Overall Progress -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700">Overall Progress</span>
        <span class={`text-sm font-semibold ${getProgressColor(progressData.overall_progress)}`}>
          {progressData.overall_progress}%
        </span>
      </div>
      
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          class={`h-2.5 rounded-full transition-all duration-300 ${getProgressBarColor(progressData.overall_progress)}`}
          style="width: {progressData.overall_progress}%"
        ></div>
      </div>
    </div>

    <!-- Category Breakdown -->
    {#if widget.settings?.showDetails !== false}
      <div class="grid grid-cols-2 gap-3 text-xs">
        {#each progressData.categories as category}
          <div class="text-center">
            <div class={`text-lg font-semibold mb-1 ${getProgressColor(category.progress)}`}>
              {category.progress}%
            </div>
            <div class="text-gray-500 mb-1">{category.name}</div>
            <div class="w-full bg-gray-200 rounded-full h-1">
              <div 
                class={`h-1 rounded-full ${category.color}`}
                style="width: {category.progress}%"
              ></div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Outstanding Tasks -->
      {#if progressData.outstanding_tasks.length > 0}
        <div class="border-t pt-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-gray-700">Outstanding Tasks</span>
            <span class="text-xs text-gray-500">{progressData.outstanding_tasks.length}</span>
          </div>
          
          <div class="space-y-1">
            {#each progressData.outstanding_tasks.slice(0, 3) as task}
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 truncate pr-2">{task.description}</span>
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
                <a href="/progress" class="text-xs text-blue-600 hover:text-blue-800">
                  +{progressData.outstanding_tasks.length - 3} more tasks
                </a>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Recent Updates -->
      {#if progressData.recent_updates.length > 0}
        <div class="border-t pt-3">
          <div class="text-xs font-medium text-gray-700 mb-2">Recent Updates</div>
          <div class="space-y-1">
            {#each progressData.recent_updates.slice(0, 2) as update}
              <div class="flex items-start space-x-2 text-xs">
                <div class="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div class="flex-1">
                  <span class="text-gray-600">{update.description}</span>
                  <div class="text-gray-400 text-xs">{formatTimeAgo(update.timestamp)}</div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    {:else}
      <!-- Compact view - just show top categories -->
      <div class="flex justify-between text-xs">
        {#each progressData.categories.slice(0, 4) as category}
          <div class="text-center">
            <div class={`text-sm font-semibold ${getProgressColor(category.progress)}`}>
              {category.progress}%
            </div>
            <div class="text-gray-500 text-xs">{category.name}</div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Action Link -->
    <div class="pt-2 border-t">
      <a href="/progress" class="text-xs text-blue-600 hover:text-blue-800 font-medium">
        View detailed progress →
      </a>
    </div>
  {/if}
</div>