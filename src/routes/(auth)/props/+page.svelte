<script lang="ts">
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import { Plus, Package, Tag, CheckCircle, TrendingUp, HelpCircle } from 'lucide-svelte';
  import LifecycleStateBadge from '$lib/components/resources/LifecycleStateBadge.svelte';
  export let data;
  
  // Calculate stats
  $: stats = {
    total: data.props.length,
    series: new Set(data.props.filter(p => p.character_series).map(p => p.character_series)).size,
    ready: data.props.filter(p => p.status === 'ready' || p.status === 'owned').length,
    inProgress: data.props.filter(p => p.status === 'in_progress' || p.status === 'planned').length
  };
  
  let showHelp = false;
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <div class="flex items-center gap-3">
        <h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">Props Catalog</h1>
        <button
          type="button"
          class="relative p-1 rounded-full transition-colors hover:bg-[var(--theme-sidebar-hover)]"
          style="color: var(--theme-sidebar-muted);"
          onmouseenter={() => showHelp = true}
          onmouseleave={() => showHelp = false}
          onclick={() => showHelp = !showHelp}
        >
          <HelpCircle class="w-5 h-5" />
          {#if showHelp}
            <div 
              class="absolute left-0 top-full mt-2 w-80 p-4 rounded-lg shadow-lg border z-50"
              style="background: var(--theme-background); border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
            >
              <p class="text-sm" style="color: var(--theme-sidebar-muted);">
                Manage costume accessories, weapons, and other props. Track lifecycle states from planning through completion, 
                organize by character or series, and monitor storage locations to keep everything organized.
              </p>
            </div>
          {/if}
        </button>
      </div>
      <p class="mt-2 text-sm" style="color: var(--theme-sidebar-muted);">
        Track costume accessories and props with lifecycle states and storage.
      </p>
    </div>
    <a
      href="/props/new"
      class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
      style="background: var(--theme-sidebar-accent); color: white;"
    >
      <Plus class="mr-2 h-4 w-4" />
      Add Prop
    </a>
  </div>

  <!-- Stats -->
  <div class="grid gap-4 md:grid-cols-4">
    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Total Props</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.total}
          </p>
        </div>
        <Package class="h-8 w-8" style="color: var(--theme-sidebar-accent);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Series/Characters</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.series}
          </p>
        </div>
        <Tag class="h-8 w-8" style="color: var(--theme-info);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Ready/Owned</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.ready}
          </p>
        </div>
        <CheckCircle class="h-8 w-8" style="color: var(--theme-success);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">In Progress</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.inProgress}
          </p>
        </div>
        <TrendingUp class="h-8 w-8" style="color: var(--theme-warning);" />
      </div>
    </ThemedCard>
  </div>

  <!-- Props List -->
  <ThemedCard title="Your Props">
    {#if data.props.length === 0}
      <div class="py-12 text-center">
        <Package class="mx-auto h-12 w-12 mb-4" style="color: var(--theme-sidebar-muted);" />
        <h3 class="text-lg font-medium mb-2" style="color: var(--theme-foreground);">
          No props found
        </h3>
        <p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
          Track costume accessories, weapons, and other props with lifecycle states.
        </p>
        <a
          href="/props/new"
          class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
          style="background: var(--theme-sidebar-accent); color: white;"
        >
          <Plus class="mr-2 h-4 w-4" />
          Add Your First Prop
        </a>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each data.props as prop}
          <div class="p-4 border rounded-lg" style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border);">
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1">
                <h3 class="font-medium text-lg" style="color: var(--theme-foreground);">{prop.name}</h3>
                {#if prop.character_series}
                  <p class="text-sm" style="color: var(--theme-sidebar-muted);">{prop.character_series}</p>
                {/if}
              </div>
              <LifecycleStateBadge state={prop.status} size="sm" />
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </ThemedCard>
</div>
