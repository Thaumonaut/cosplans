<script lang="ts">
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import ThemedButton from '$lib/components/ui/ThemedButton.svelte';
  import ThemedSelect from '$lib/components/ui/ThemedSelect.svelte';
  import { Archive, CheckCircle2, Calendar, Award, Search } from 'lucide-svelte';

  // Placeholder data - will be replaced with real data from database
  let archivedProjects = [
    {
      id: '1',
      title: 'Final Fantasy XIV - Warrior of Light',
      description: 'Complete Endwalker armor set',
      completedDate: '2025-09-20',
      rating: 5,
      eventName: 'PAX West 2025'
    }
  ];

  let filterYear = 'all';
  let searchQuery = '';
</script>

<svelte:head>
  <title>Archive | Cosplans</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">
        Project Archive
      </h1>
      <p class="mt-2 text-sm" style="color: var(--theme-sidebar-muted);">
        Your completed cosplay projects and portfolio history.
      </p>
    </div>
  </div>

  <!-- Stats -->
  <div class="grid gap-4 md:grid-cols-4">
    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Total Completed</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {archivedProjects.length}
          </p>
        </div>
        <CheckCircle2 class="h-8 w-8" style="color: var(--theme-success);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">This Year</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {archivedProjects.filter(p => new Date(p.completedDate).getFullYear() === 2025).length}
          </p>
        </div>
        <Calendar class="h-8 w-8" style="color: var(--theme-info);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Avg Rating</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {(archivedProjects.reduce((sum, p) => sum + p.rating, 0) / archivedProjects.length).toFixed(1)}
          </p>
        </div>
        <Award class="h-8 w-8" style="color: var(--theme-warning);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Events</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {new Set(archivedProjects.map(p => p.eventName)).size}
          </p>
        </div>
        <Archive class="h-8 w-8" style="color: var(--theme-sidebar-accent);" />
      </div>
    </ThemedCard>
  </div>

  <!-- Filters -->
  <ThemedCard>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex-1 max-w-md">
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style="color: var(--theme-sidebar-muted);"
          />
          <input
            type="text"
            placeholder="Search projects..."
            bind:value={searchQuery}
            class="w-full rounded-md border px-10 py-2 text-sm transition-colors focus:outline-none focus:ring-2"
            style="
              background: var(--theme-sidebar-bg);
              border-color: var(--theme-sidebar-border);
              color: var(--theme-foreground);
            "
          />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm" style="color: var(--theme-sidebar-muted);">Filter by year:</span>
        <ThemedSelect name="filterYear" bind:value={filterYear}>
          <option value="all">All Years</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </ThemedSelect>
      </div>
    </div>
  </ThemedCard>

  <!-- Archived Projects List -->
  <ThemedCard title="Completed Projects">
    {#if archivedProjects.length === 0}
      <div class="py-12 text-center">
        <Archive class="mx-auto h-12 w-12 mb-4" style="color: var(--theme-sidebar-muted);" />
        <h3 class="text-lg font-medium mb-2" style="color: var(--theme-foreground);">
          No archived projects yet
        </h3>
        <p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
          Complete your first project to start building your cosplay portfolio!
        </p>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2">
        {#each archivedProjects as project (project.id)}
          <div
            class="rounded-lg border p-4 transition-all hover:shadow-md"
            style="border-color: var(--theme-sidebar-border); background: var(--theme-sidebar-bg);"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="text-lg font-semibold mb-1" style="color: var(--theme-foreground);">
                  {project.title}
                </h3>
                <p class="text-sm mb-2" style="color: var(--theme-sidebar-muted);">
                  {project.description}
                </p>
                
                <!-- Rating -->
                <div class="flex items-center gap-1 mb-2">
                  {#each Array(5) as _, i}
                    <svg
                      class="h-4 w-4"
                      fill={i < project.rating ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style="color: var(--theme-warning);"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  {/each}
                </div>

                <!-- Metadata -->
                <div class="flex flex-col gap-1 text-sm">
                  <span style="color: var(--theme-sidebar-muted);">
                    <Calendar class="inline h-4 w-4 mr-1" />
                    Completed: {new Date(project.completedDate).toLocaleDateString()}
                  </span>
                  {#if project.eventName}
                    <span style="color: var(--theme-sidebar-muted);">
                      <Award class="inline h-4 w-4 mr-1" />
                      Event: {project.eventName}
                    </span>
                  {/if}
                </div>
              </div>
            </div>

            <div class="flex gap-2 mt-3">
              <ThemedButton variant="secondary" fullWidth>View Details</ThemedButton>
              <ThemedButton variant="secondary">
                <Archive class="h-4 w-4" />
              </ThemedButton>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </ThemedCard>

  <!-- Info Box -->
  <ThemedCard>
    <div class="flex items-start gap-3">
      <Archive class="h-5 w-5 mt-0.5" style="color: var(--theme-success);" />
      <div>
        <h4 class="font-medium mb-1" style="color: var(--theme-foreground);">
          About the Archive
        </h4>
        <p class="text-sm" style="color: var(--theme-sidebar-muted);">
          Your archive is your permanent cosplay portfolio. Completed projects are stored here 
          with photos, notes, costs, and ratings. This helps you track your progress over time 
          and showcase your work. Archived projects don't count toward your active project limit.
        </p>
      </div>
    </div>
  </ThemedCard>
</div>
