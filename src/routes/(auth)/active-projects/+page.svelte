<script lang="ts">
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import ThemedButton from '$lib/components/ui/ThemedButton.svelte';
  import ThemedAlert from '$lib/components/ui/ThemedAlert.svelte';
  import { Plus, Zap, Clock, CheckCircle2, AlertCircle } from 'lucide-svelte';

  // Placeholder data - will be replaced with real data from database
  let activeProjects = [
    {
      id: '1',
      title: 'Elden Ring - Malenia Cosplay',
      description: 'Blade of Miquella armor set',
      status: 'active',
      progress: 65,
      dueDate: '2025-11-15',
      priority: 'high'
    }
  ];

  const maxActiveProjects = 3; // Free tier limit
  const canAddMore = activeProjects.length < maxActiveProjects;
</script>

<svelte:head>
  <title>Active Projects | Cosplans</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">
        Active Projects
      </h1>
      <p class="mt-2 text-sm" style="color: var(--theme-sidebar-muted);">
        Work-in-progress cosplays. Free tier: {activeProjects.length}/{maxActiveProjects} active projects.
      </p>
    </div>
    {#if canAddMore}
      <ThemedButton variant="primary">
        <Plus class="mr-2 h-4 w-4" />
        New Project
      </ThemedButton>
    {/if}
  </div>

  <!-- Limit Warning -->
  {#if !canAddMore}
    <ThemedAlert type="warning">
      <div class="flex items-start gap-2">
        <AlertCircle class="h-5 w-5 mt-0.5" />
        <div>
          <strong>Project Limit Reached</strong>
          <p class="text-sm mt-1">
            You've reached the free tier limit of {maxActiveProjects} active projects. 
            Complete or archive a project to start a new one, or upgrade to Premium for unlimited projects.
          </p>
        </div>
      </div>
    </ThemedAlert>
  {/if}

  <!-- Stats -->
  <div class="grid gap-4 md:grid-cols-4">
    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Active</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {activeProjects.filter(p => p.status === 'active').length}
          </p>
        </div>
        <Zap class="h-8 w-8" style="color: var(--theme-warning);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Paused</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {activeProjects.filter(p => p.status === 'paused').length}
          </p>
        </div>
        <Clock class="h-8 w-8" style="color: var(--theme-info);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Avg Progress</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {Math.round(activeProjects.reduce((sum, p) => sum + p.progress, 0) / activeProjects.length)}%
          </p>
        </div>
        <CheckCircle2 class="h-8 w-8" style="color: var(--theme-success);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Slots Available</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {maxActiveProjects - activeProjects.length}
          </p>
        </div>
        <Plus class="h-8 w-8" style="color: var(--theme-sidebar-accent);" />
      </div>
    </ThemedCard>
  </div>

  <!-- Active Projects List -->
  <ThemedCard title="Your Active Projects">
    {#if activeProjects.length === 0}
      <div class="py-12 text-center">
        <Zap class="mx-auto h-12 w-12 mb-4" style="color: var(--theme-sidebar-muted);" />
        <h3 class="text-lg font-medium mb-2" style="color: var(--theme-foreground);">
          No active projects
        </h3>
        <p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
          Start working on a cosplay project. You can have up to {maxActiveProjects} active projects.
        </p>
        <ThemedButton variant="primary">
          <Plus class="mr-2 h-4 w-4" />
          Start Your First Project
        </ThemedButton>
      </div>
    {:else}
      <div class="space-y-4">
        {#each activeProjects as project (project.id)}
          <div
            class="rounded-lg border p-4 transition-all hover:shadow-md"
            style="border-color: var(--theme-sidebar-border); background: var(--theme-sidebar-bg);"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-lg font-semibold" style="color: var(--theme-foreground);">
                    {project.title}
                  </h3>
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style="background: var(--theme-warning); color: white;"
                  >
                    {project.status.toUpperCase()}
                  </span>
                </div>
                <p class="text-sm" style="color: var(--theme-sidebar-muted);">
                  {project.description}
                </p>
              </div>
              <div class="flex gap-2">
                <ThemedButton variant="secondary">View Details</ThemedButton>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-3">
              <div class="flex items-center justify-between text-sm mb-1">
                <span style="color: var(--theme-sidebar-muted);">Progress</span>
                <span style="color: var(--theme-foreground);" class="font-medium">
                  {project.progress}%
                </span>
              </div>
              <div
                class="h-2 rounded-full overflow-hidden"
                style="background: var(--theme-sidebar-border);"
              >
                <div
                  class="h-full transition-all duration-300"
                  style="width: {project.progress}%; background: var(--theme-success);"
                ></div>
              </div>
            </div>

            <!-- Metadata -->
            <div class="flex items-center gap-4 text-sm">
              <span style="color: var(--theme-sidebar-muted);">
                <Clock class="inline h-4 w-4 mr-1" />
                Due: {new Date(project.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </ThemedCard>

  <!-- Info Box -->
  <ThemedCard>
    <div class="flex items-start gap-3">
      <Zap class="h-5 w-5 mt-0.5" style="color: var(--theme-warning);" />
      <div>
        <h4 class="font-medium mb-1" style="color: var(--theme-foreground);">
          About Active Projects
        </h4>
        <p class="text-sm" style="color: var(--theme-sidebar-muted);">
          Active projects are cosplays you're currently working on. The free tier allows up to 
          {maxActiveProjects} active projects at once to help you stay focused. When a project is complete, 
          move it to Archive to free up a slot. Upgrade to Premium for unlimited active projects.
        </p>
      </div>
    </div>
  </ThemedCard>
</div>
