<script lang="ts">
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import { Plus, Camera, Package, CheckCircle, AlertCircle } from 'lucide-svelte';
  export let data;
  
  // Calculate stats
  $: stats = {
    total: data.equipment.length,
    types: new Set(data.equipment.map(e => e.equipment_type)).size,
    excellent: data.equipment.filter(e => e.condition === 'excellent' || e.condition === 'good').length,
    owned: data.equipment.filter(e => e.ownership_status === 'owned').length
  };
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">
        Equipment Inventory
      </h1>
      <p class="mt-2 text-sm" style="color: var(--theme-sidebar-muted);">
        Track your photography gear, condition, and ownership status.
      </p>
    </div>
    <a
      href="/equipment/new"
      class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
      style="background: var(--theme-sidebar-accent); color: white;"
    >
      <Plus class="mr-2 h-4 w-4" />
      Add Equipment
    </a>
  </div>

  <!-- Stats -->
  <div class="grid gap-4 md:grid-cols-4">
    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Total Items</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.total}
          </p>
        </div>
        <Camera class="h-8 w-8" style="color: var(--theme-sidebar-accent);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Equipment Types</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.types}
          </p>
        </div>
        <Package class="h-8 w-8" style="color: var(--theme-info);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Good Condition</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.excellent}
          </p>
        </div>
        <CheckCircle class="h-8 w-8" style="color: var(--theme-success);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Owned</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.owned}
          </p>
        </div>
        <AlertCircle class="h-8 w-8" style="color: var(--theme-warning);" />
      </div>
    </ThemedCard>
  </div>

  <!-- Equipment List -->
  <ThemedCard title="Your Equipment">
    {#if data.equipment.length === 0}
      <div class="py-12 text-center">
        <Camera class="mx-auto h-12 w-12 mb-4" style="color: var(--theme-sidebar-muted);" />
        <h3 class="text-lg font-medium mb-2" style="color: var(--theme-foreground);">
          No equipment found
        </h3>
        <p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
          Track your cameras, lenses, lighting, and other photography gear.
        </p>
        <a
          href="/equipment/new"
          class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
          style="background: var(--theme-sidebar-accent); color: white;"
        >
          <Plus class="mr-2 h-4 w-4" />
          Add Your First Equipment
        </a>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each data.equipment as item}
          <div class="p-4 border rounded-lg" style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border);">
            <h3 class="font-medium text-lg mb-1" style="color: var(--theme-foreground);">{item.name}</h3>
            <p class="text-sm mb-2" style="color: var(--theme-sidebar-muted);">
              {item.equipment_type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </p>
            <div class="flex gap-2">
              <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium" style="background: var(--theme-info); color: white;">
                {item.condition}
              </span>
              <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium" style="background: var(--theme-success); color: white;">
                {item.ownership_status}
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
      <Camera class="h-5 w-5 mt-0.5" style="color: var(--theme-info);" />
      <div>
        <h4 class="font-medium mb-1" style="color: var(--theme-foreground);">
          About Equipment Inventory
        </h4>
        <p class="text-sm" style="color: var(--theme-sidebar-muted);">
          Keep track of all your photography equipment including cameras, lenses, lighting, and accessories. 
          Monitor condition status to know what needs maintenance, and track ownership to manage rentals and loans.
        </p>
      </div>
    </div>
  </ThemedCard>
</div>
