<script lang="ts">
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import { Plus, Camera, Package, CheckCircle, AlertCircle, Users, DollarSign, Calendar, HelpCircle } from 'lucide-svelte';
  export let data;
  
  // Calculate stats
  $: stats = {
    total: data.equipment.length,
    types: new Set(data.equipment.map(e => e.equipment_type)).size,
    excellent: data.equipment.filter(e => e.condition === 'excellent' || e.condition === 'good').length,
    owned: data.equipment.filter(e => e.ownership_status === 'owned').length
  };
  
  let showHelp = false;
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <div class="flex items-center gap-3">
        <h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">Equipment Inventory</h1>
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
                Keep track of all your photography equipment including cameras, lenses, lighting, and accessories. 
                Monitor condition status to know what needs maintenance, and track ownership to manage rentals and loans.
              </p>
            </div>
          {/if}
        </button>
      </div>
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
          <a
            href="/equipment/{item.id}"
            class="block p-4 border rounded-lg transition-all hover:shadow-md"
            style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border);"
          >
            <!-- Header with Image and Name -->
            <div class="flex items-start gap-3 mb-3">
              <!-- Equipment Image Placeholder -->
              <div 
                class="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                style="background: var(--theme-sidebar-hover);"
              >
                <Camera class="w-8 h-8" style="color: var(--theme-sidebar-muted);" />
              </div>
              
              <!-- Name and Type -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-medium truncate mb-1" style="color: var(--theme-foreground);">
                  {item.name}
                </h3>
                <p class="text-sm" style="color: var(--theme-sidebar-muted);">
                  {item.equipment_type.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </p>
              </div>
            </div>

            <!-- Equipment Details - Always Visible -->
            <div class="space-y-1.5 text-sm mb-3">
              <!-- Brand & Model -->
              <div class="flex items-center gap-2" style="color: {item.brand || item.model ? 'var(--theme-sidebar-muted)' : 'var(--theme-sidebar-border)'};">
                <Package class="w-4 h-4 flex-shrink-0" />
                <span class="truncate {item.brand || item.model ? '' : 'italic'}">
                  {#if item.brand && item.model}
                    {item.brand} {item.model}
                  {:else if item.brand}
                    {item.brand}
                  {:else if item.model}
                    {item.model}
                  {:else}
                    No brand/model
                  {/if}
                </span>
              </div>
              
              <!-- Ownership-specific info -->
              {#if item.ownership_status === 'owned'}
                <!-- Purchase Price -->
                <div class="flex items-center gap-2" style="color: {item.purchase_price ? 'var(--theme-sidebar-muted)' : 'var(--theme-sidebar-border)'};">
                  <DollarSign class="w-4 h-4 flex-shrink-0" />
                  <span class="{item.purchase_price ? '' : 'italic'}">
                    {item.purchase_price ? `$${item.purchase_price.toFixed(2)}` : 'Price not recorded'}
                  </span>
                </div>
              {:else if item.ownership_status === 'rented'}
                <!-- Rental Cost -->
                <div class="flex items-center gap-2" style="color: {item.rental_cost ? 'var(--theme-sidebar-muted)' : 'var(--theme-sidebar-border)'};">
                  <DollarSign class="w-4 h-4 flex-shrink-0" />
                  <span class="{item.rental_cost ? '' : 'italic'}">
                    {item.rental_cost ? `$${item.rental_cost.toFixed(2)} rental` : 'Rental cost not recorded'}
                  </span>
                </div>
                <!-- Return Date -->
                <div class="flex items-center gap-2" style="color: {item.rental_return_date ? 'var(--theme-warning)' : 'var(--theme-sidebar-border)'};">
                  <Calendar class="w-4 h-4 flex-shrink-0" />
                  <span class="{item.rental_return_date ? 'font-medium' : 'italic'}">
                    {item.rental_return_date ? `Return: ${new Date(item.rental_return_date).toLocaleDateString()}` : 'No return date'}
                  </span>
                </div>
              {:else if item.ownership_status === 'needs_sourcing'}
                <!-- Estimated Cost -->
                <div class="flex items-center gap-2" style="color: {item.estimated_purchase_cost || item.estimated_rental_cost ? 'var(--theme-sidebar-muted)' : 'var(--theme-sidebar-border)'};">
                  <DollarSign class="w-4 h-4 flex-shrink-0" />
                  <span class="{item.estimated_purchase_cost || item.estimated_rental_cost ? '' : 'italic'}">
                    {#if item.estimated_purchase_cost && item.estimated_rental_cost}
                      Est: ${item.estimated_purchase_cost.toFixed(2)} / ${item.estimated_rental_cost.toFixed(2)} rental
                    {:else if item.estimated_purchase_cost}
                      Est: ${item.estimated_purchase_cost.toFixed(2)}
                    {:else if item.estimated_rental_cost}
                      Est: ${item.estimated_rental_cost.toFixed(2)} rental
                    {:else}
                      No cost estimate
                    {/if}
                  </span>
                </div>
              {/if}
            </div>

            <!-- Status Tags -->
            <div class="flex flex-wrap gap-2 pb-3 mb-3 border-b" style="border-color: var(--theme-sidebar-border);">
              <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium" style="background: var(--theme-info); color: white;">
                {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
              </span>
              <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium" style="background: var(--theme-success); color: white;">
                {item.ownership_status.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </span>
            </div>

            <!-- Team Tag at Bottom -->
            {#if item.team}
              <div class="flex items-center gap-1.5 text-xs" style="color: var(--theme-sidebar-muted);">
                <Users class="w-3 h-3" />
                <span>{item.team.name}</span>
              </div>
            {/if}
          </a>
        {/each}
      </div>
    {/if}
  </ThemedCard>

</div>
