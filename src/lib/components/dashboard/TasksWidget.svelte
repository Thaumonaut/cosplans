<script lang="ts">
  import { onMount } from "svelte";
  import type { DashboardWidget } from "$lib/types/dashboard";

  // Props
  export let widget: DashboardWidget;
  export let teamId: string;

  // Component state
  interface Task {
    id: string;
    title: string;
    category: TaskCategory;
    shoot_title: string;
    due_date: string;
    priority: "high" | "medium" | "low";
    completed: boolean;
    assigned_to: string;
    shoot_id: string;
    team_id: string;
  }

  let tasks: Task[] = [];
  let loading = true;
  let error: string | null = null;
  const loadingPlaceholders = Array.from({ length: 4 }, (_, index) => index);

  // Task categories
  type TaskCategory = "props" | "costumes" | "location" | "team" | "general";

  // Mock tasks data
  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Wig styling for Sailor Moon",
      category: "costumes" as TaskCategory,
      shoot_title: "Convention Shoot",
      due_date: "2025-10-23",
      priority: "high",
      completed: false,
      assigned_to: "Alex Chen",
      shoot_id: "1",
      team_id: "demo-team",
    },
    {
      id: "2",
      title: "Weather foam sword",
      category: "props" as TaskCategory,
      shoot_title: "Convention Shoot",
      due_date: "2025-10-25",
      priority: "medium",
      completed: false,
      assigned_to: "Sarah Kim",
      shoot_id: "1",
      team_id: "demo-team",
    },
    {
      id: "3",
      title: "Paint EVA foam wings",
      category: "props" as TaskCategory,
      shoot_title: "Studio Session",
      due_date: "2025-10-28",
      priority: "medium",
      completed: false,
      assigned_to: "Mike Rodriguez",
      shoot_id: "2",
      team_id: "demo-team",
    },
    {
      id: "4",
      title: "Hem Asuka plugsuit",
      category: "costumes" as TaskCategory,
      shoot_title: "Studio Session",
      due_date: "2025-10-29",
      priority: "low",
      completed: false,
      assigned_to: "Jordan Lee",
      shoot_id: "2",
      team_id: "demo-team",
    },
    {
      id: "5",
      title: "Nezuko muzzle construction",
      category: "props" as TaskCategory,
      shoot_title: "Outdoor Cosplay",
      due_date: "2025-11-10",
      priority: "high",
      completed: false,
      assigned_to: "Taylor Swift",
      shoot_id: "3",
      team_id: "demo-team",
    },
  ];

  const DEFAULT_UPCOMING_LIMIT = 3;
  const DEFAULT_URGENT_DAYS = 3;

  $: upcomingLimit =
    typeof widget?.settings?.limit === "number"
      ? Math.max(1, widget.settings.limit)
      : DEFAULT_UPCOMING_LIMIT;

  $: urgentDayThreshold =
    typeof widget?.settings?.urgentDays === "number"
      ? Math.max(1, widget.settings.urgentDays)
      : DEFAULT_URGENT_DAYS;

  onMount(async () => {
    try {
      loading = true;
      tasks = mockTasks.filter((t) => t.team_id === teamId && !t.completed);
      error = null;
    } catch (err) {
      error = "Failed to load tasks";
      console.error("Error loading tasks:", err);
    } finally {
      loading = false;
    }
  });

  function getCategoryIcon(category: TaskCategory): string {
    const icons: Record<TaskCategory, string> = {
      props: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      costumes: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      location:
        "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
      team: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
      general:
        "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    };
    return icons[category];
  }

  function getCategoryColor(category: TaskCategory): string {
    const colors: Record<TaskCategory, string> = {
      props: "text-purple-600 bg-purple-50",
      costumes: "text-pink-600 bg-pink-50",
      location: "text-blue-600 bg-blue-50",
      team: "text-green-600 bg-green-50",
      general: "text-gray-600 bg-gray-50",
    };
    return colors[category];
  }

  function getPriorityBadge(priority: string): string {
    const badges: Record<string, string> = {
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-green-100 text-green-700 border-green-200",
    };
    return badges[priority] || badges.medium;
  }

  function formatDueDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `${diffDays} days`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function toggleTask(taskId: string) {
    tasks = tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
  }

  $: urgentTasks = tasks.filter((t) => {
    const due = new Date(t.due_date);
    const today = new Date();
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= urgentDayThreshold || t.priority === "high";
  });

  $: upcomingTasks = tasks.filter((t) => !urgentTasks.includes(t));
</script>

<div class="space-y-4">
  {#if loading}
    <div class="space-y-2">
      {#each loadingPlaceholders as placeholder (placeholder)}
        <div
          class="animate-pulse flex items-center space-x-3 p-3 rounded-md"
          style="background: var(--theme-sidebar-hover);"
        >
          <div class="w-4 h-4 rounded" style="background: var(--theme-sidebar-border);"></div>
          <div class="flex-1 space-y-1">
            <div class="h-3 rounded w-3/4" style="background: var(--theme-sidebar-border);"></div>
            <div class="h-2 rounded w-1/2" style="background: var(--theme-sidebar-border);"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="text-center py-4">
      <div class="mb-2" style="color: var(--theme-sidebar-accent);">
        <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p class="text-sm" style="color: var(--theme-sidebar-text);">{error}</p>
    </div>
  {:else if tasks.length === 0}
    <div class="text-center py-6">
      <div class="mb-2" style="color: var(--theme-sidebar-accent);">
        <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p class="text-sm font-medium" style="color: var(--theme-sidebar-accent);">
        All tasks complete!
      </p>
      <p class="text-xs mt-1" style="color: var(--theme-sidebar-text); opacity: 0.6;">
        No pending tasks for props or costumes
      </p>
    </div>
  {:else}
    {#if urgentTasks.length > 0}
      <div>
        <div class="flex items-center gap-2 mb-2">
          <svg
            class="w-4 h-4"
            style="color: var(--theme-sidebar-accent);"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-xs font-semibold uppercase" style="color: var(--theme-sidebar-accent);"
            >Urgent ({urgentTasks.length})</span
          >
        </div>

        <div class="space-y-2">
          {#each urgentTasks as task (task.id)}
            <a
              href="/shoots/{task.shoot_id}/tasks/{task.id}"
              class="group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:z-10"
              style="background: var(--theme-sidebar-hover); border: 1.5px solid var(--theme-alert-color);"
            >
              <input
                type="checkbox"
                checked={task.completed}
                on:click|stopPropagation
                on:change={() => toggleTask(task.id)}
                class="mt-0.5 w-4 h-4 rounded"
                style="accent-color: var(--theme-alert-color);"
              />

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1">
                    <p class="text-sm font-medium" style="color: var(--theme-foreground);">
                      {task.title}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <span
                        class={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d={getCategoryIcon(task.category)}
                          />
                        </svg>
                        {task.category}
                      </span>
                      <span class="text-xs" style="color: var(--theme-sidebar-text); opacity: 0.8;"
                        >{task.shoot_title}</span
                      >
                    </div>
                  </div>

                  <div class="flex flex-col items-end gap-1">
                    <span
                      class={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(task.priority)}`}
                    >
                      {formatDueDate(task.due_date)}
                    </span>
                    {#if task.assigned_to}
                      <span class="text-xs" style="color: var(--theme-sidebar-text); opacity: 0.6;"
                        >@{task.assigned_to.split(" ")[0]}</span
                      >
                    {/if}
                  </div>
                </div>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}

    {#if upcomingTasks.length > 0}
      <div>
        <div class="flex items-center gap-2 mb-2">
          <svg
            class="w-4 h-4"
            style="color: var(--theme-sidebar-accent);"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span
            class="text-xs font-semibold uppercase"
            style="color: var(--theme-foreground); opacity: 0.9;"
            >Upcoming ({upcomingTasks.length})</span
          >
        </div>

        <div class="space-y-2">
          {#each upcomingTasks.slice(0, upcomingLimit) as task (task.id)}
            <a
              href="/shoots/{task.shoot_id}/tasks/{task.id}"
              class="group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:z-10"
              style="background: var(--theme-sidebar-hover); border: 1px solid var(--theme-sidebar-border);"
            >
              <input
                type="checkbox"
                checked={task.completed}
                on:click|stopPropagation
                on:change={() => toggleTask(task.id)}
                class="mt-0.5 w-4 h-4 rounded"
                style="accent-color: var(--theme-sidebar-accent);"
              />

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1">
                    <p class="text-sm font-medium" style="color: var(--theme-foreground);">
                      {task.title}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <span
                        class={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d={getCategoryIcon(task.category)}
                          />
                        </svg>
                        {task.category}
                      </span>
                      <span class="text-xs" style="color: var(--theme-sidebar-text); opacity: 0.8;"
                        >{task.shoot_title}</span
                      >
                    </div>
                  </div>

                  <div class="flex flex-col items-end gap-1">
                    <span
                      class={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(task.priority)}`}
                    >
                      {formatDueDate(task.due_date)}
                    </span>
                    {#if task.assigned_to}
                      <span class="text-xs" style="color: var(--theme-sidebar-text); opacity: 0.6;"
                        >@{task.assigned_to.split(" ")[0]}</span
                      >
                    {/if}
                  </div>
                </div>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}

    <div class="pt-2" style="border-top: 1px solid var(--theme-sidebar-border);">
      <a href="/tasks" class="text-xs font-medium" style="color: var(--theme-sidebar-accent);">
        View all tasks →
      </a>
    </div>
  {/if}
</div>
