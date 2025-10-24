<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from '../ui/Button.svelte';
  import Badge from '../ui/Badge.svelte';

  export let isOpen: boolean = false;
  export let shootId: string;
  export let shootName: string;
  export let progressData: {
    costume_progress: number;
    props_progress: number;
    location_progress: number;
    team_progress: number;
    checklist_progress: number;
    editing_progress: number;
    overall_progress: number;
    outstanding_tasks: Array<{
      id: string;
      category: string;
      title: string;
      status: string;
      assigned_to?: string;
    }>;
  };

  const dispatch = createEventDispatcher<{
    close: void;
    taskClick: { taskId: string; category: string };
  }>();

  interface CategoryDetail {
    label: string;
    progress: number;
    icon: string;
    color: string;
  }

  $: categories: CategoryDetail[] = [
    {
      label: 'Costume',
      progress: progressData.costume_progress,
      icon: 'shirt',
      color: getCategoryColor(progressData.costume_progress)
    },
    {
      label: 'Props',
      progress: progressData.props_progress,
      icon: 'cube',
      color: getCategoryColor(progressData.props_progress)
    },
    {
      label: 'Location',
      progress: progressData.location_progress,
      icon: 'map',
      color: getCategoryColor(progressData.location_progress)
    },
    {
      label: 'Team',
      progress: progressData.team_progress,
      icon: 'users',
      color: getCategoryColor(progressData.team_progress)
    },
    {
      label: 'Checklist',
      progress: progressData.checklist_progress,
      icon: 'checklist',
      color: getCategoryColor(progressData.checklist_progress)
    },
    {
      label: 'Editing',
      progress: progressData.editing_progress,
      icon: 'photo',
      color: getCategoryColor(progressData.editing_progress)
    }
  ];

  $: outstandingByCategory = progressData.outstanding_tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof progressData.outstanding_tasks>);

  function getCategoryColor(progress: number): string {
    if (progress >= 80) return 'text-green-600 bg-green-100';
    if (progress >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }

  function getProgressBarColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  function handleClose() {
    isOpen = false;
    dispatch('close');
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleTaskClick(taskId: string, category: string) {
    dispatch('taskClick', { taskId, category });
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    onclick={handleBackdropClick}
  >
    <div
      class="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl"
      style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-6 py-4 border-b"
        style="background: var(--theme-header-bg); border-color: var(--theme-sidebar-border);"
      >
        <div>
          <h2 id="modal-title" class="text-xl font-bold" style="color: var(--theme-header-text);">
            Progress Details
          </h2>
          <p class="text-sm mt-1" style="color: var(--theme-header-text); opacity: 0.8;">
            {shootName}
          </p>
        </div>
        <button
          onclick={handleClose}
          class="p-2 rounded-lg hover:bg-opacity-10"
          style="color: var(--theme-header-text);"
          aria-label="Close"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4 space-y-6">
        <!-- Overall Progress -->
        <div class="text-center py-4">
          <div class="text-5xl font-bold mb-2" style="color: var(--theme-foreground);">
            {progressData.overall_progress}%
          </div>
          <div class="text-sm" style="color: var(--theme-sidebar-muted);">
            Overall Progress
          </div>
        </div>

        <!-- Category Breakdown -->
        <div>
          <h3 class="text-sm font-semibold mb-4 uppercase tracking-wide" style="color: var(--theme-foreground); opacity: 0.7;">
            Progress by Category
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each categories as category}
              <div
                class="p-4 rounded-lg border"
                style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border);"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class={`p-2 rounded-lg ${category.color}`}>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {#if category.icon === 'shirt'}
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                        {:else if category.icon === 'cube'}
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        {:else if category.icon === 'map'}
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        {:else if category.icon === 'users'}
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        {:else if category.icon === 'checklist'}
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        {:else if category.icon === 'photo'}
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        {/if}
                      </svg>
                    </div>
                    <span class="font-medium" style="color: var(--theme-foreground);">
                      {category.label}
                    </span>
                  </div>
                  <span class="text-lg font-bold" style="color: var(--theme-foreground);">
                    {category.progress}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(category.progress)}`}
                    style="width: {category.progress}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Outstanding Tasks -->
        {#if progressData.outstanding_tasks.length > 0}
          <div>
            <h3 class="text-sm font-semibold mb-4 uppercase tracking-wide" style="color: var(--theme-foreground); opacity: 0.7;">
              Outstanding Tasks ({progressData.outstanding_tasks.length})
            </h3>
            <div class="space-y-4">
              {#each Object.entries(outstandingByCategory) as [category, tasks]}
                <div>
                  <div class="text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
                    {category} ({tasks.length})
                  </div>
                  <div class="space-y-2">
                    {#each tasks as task}
                      <button
                        onclick={() => handleTaskClick(task.id, category)}
                        class="w-full text-left p-3 rounded-lg border transition-all hover:shadow-md"
                        style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border);"
                      >
                        <div class="flex items-start justify-between">
                          <div class="flex-1">
                            <div class="font-medium" style="color: var(--theme-foreground);">
                              {task.title}
                            </div>
                            {#if task.assigned_to}
                              <div class="text-sm mt-1" style="color: var(--theme-sidebar-muted);">
                                Assigned to: {task.assigned_to}
                              </div>
                            {/if}
                          </div>
                          <Badge className="text-xs px-2 py-1 rounded-full" variant="ghost">
                            {task.status}
                          </Badge>
                        </div>
                      </button>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {:else}
          <div class="text-center py-8" style="color: var(--theme-sidebar-muted);">
            <svg class="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm">All tasks completed! 🎉</p>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div
        class="flex justify-end gap-3 px-6 py-4 border-t"
        style="background: var(--theme-header-bg); border-color: var(--theme-sidebar-border);"
      >
        <Button variant="solid" onclick={handleClose}>
          Close
        </Button>
      </div>
    </div>
  </div>
{/if}
