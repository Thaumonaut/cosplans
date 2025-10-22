<script lang="ts">
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import ThemedButton from '$lib/components/ui/ThemedButton.svelte';
  import { Plus, Lightbulb, Image, DollarSign, FileText } from 'lucide-svelte';

  // Placeholder data - will be replaced with real data from database
  let planningItems = [
    {
      id: '1',
      title: 'Cyberpunk 2077 - V Cosplay',
      description: 'Full costume with LED accents',
      status: 'planning',
      estimatedCost: 450,
      priority: 'high'
    }
  ];
</script>

<svelte:head>
  <title>Planning - Idea Bank | Cosplans</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">
        Planning & Idea Bank
      </h1>
      <p class="mt-2 text-sm" style="color: var(--theme-sidebar-muted);">
        Unlimited ideas for future cosplays. Promote to Active Projects when ready (max 3 active).
      </p>
    </div>
    <ThemedButton variant="primary">
      <Plus class="mr-2 h-4 w-4" />
      New Idea
    </ThemedButton>
  </div>

  <!-- Stats -->
  <div class="grid gap-4 md:grid-cols-4">
    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Total Ideas</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {planningItems.length}
          </p>
        </div>
        <Lightbulb class="h-8 w-8" style="color: var(--theme-sidebar-accent);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">High Priority</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {planningItems.filter(i => i.priority === 'high').length}
          </p>
        </div>
        <FileText class="h-8 w-8" style="color: var(--theme-warning);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">With Mood Boards</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">0</p>
        </div>
        <Image class="h-8 w-8" style="color: var(--theme-info);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Est. Total Cost</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            ${planningItems.reduce((sum, item) => sum + item.estimatedCost, 0)}
          </p>
        </div>
        <DollarSign class="h-8 w-8" style="color: var(--theme-success);" />
      </div>
    </ThemedCard>
  </div>

  <!-- Planning Items List -->
  <ThemedCard title="Your Ideas">
    {#if planningItems.length === 0}
      <div class="py-12 text-center">
        <Lightbulb class="mx-auto h-12 w-12 mb-4" style="color: var(--theme-sidebar-muted);" />
        <h3 class="text-lg font-medium mb-2" style="color: var(--theme-foreground);">
          No ideas yet
        </h3>
        <p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
          Start brainstorming your next cosplay project. Add unlimited ideas here!
        </p>
        <ThemedButton variant="primary">
          <Plus class="mr-2 h-4 w-4" />
          Create Your First Idea
        </ThemedButton>
      </div>
    {:else}
      <div class="space-y-4">
        {#each planningItems as item (item.id)}
          <div
            class="rounded-lg border p-4 transition-all hover:shadow-md"
            style="border-color: var(--theme-sidebar-border); background: var(--theme-sidebar-bg);"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-semibold mb-1" style="color: var(--theme-foreground);">
                  {item.title}
                </h3>
                <p class="text-sm mb-3" style="color: var(--theme-sidebar-muted);">
                  {item.description}
                </p>
                <div class="flex items-center gap-4 text-sm">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium"
                    style="background: var(--theme-warning); color: white;"
                  >
                    {item.priority.toUpperCase()}
                  </span>
                  <span style="color: var(--theme-sidebar-muted);">
                    Est. ${item.estimatedCost}
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <ThemedButton variant="primary">Promote to Active</ThemedButton>
                <ThemedButton variant="secondary">Edit</ThemedButton>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </ThemedCard>

  <!-- Info Box -->
  <ThemedCard>
    <div class="flex items-start gap-3">
      <Lightbulb class="h-5 w-5 mt-0.5" style="color: var(--theme-info);" />
      <div>
        <h4 class="font-medium mb-1" style="color: var(--theme-foreground);">
          About the Idea Bank
        </h4>
        <p class="text-sm" style="color: var(--theme-sidebar-muted);">
          Store unlimited cosplay ideas here with mood boards, estimated costs, patterns, tutorials, 
          and location ideas. When you're ready to start working on one, promote it to Active Projects 
          (you can have up to 3 active projects at once on the free tier).
        </p>
      </div>
    </div>
  </ThemedCard>
</div>
