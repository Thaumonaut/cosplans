<script lang="ts">
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import { Plus, MapPin, Star, Building, Map, Navigation } from 'lucide-svelte';
  export let data;
  
  // Calculate stats
  $: stats = {
    total: data.locations.length,
    types: new Set(data.locations.map(l => l.location_type)).size,
    favorites: data.locations.filter(l => l.is_favorite).length,
    withAddress: data.locations.filter(l => l.address).length
  };
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">
        Location Library
      </h1>
      <p class="mt-2 text-sm" style="color: var(--theme-sidebar-muted);">
        Maintain a library of shoot locations with photos, addresses, and accessibility notes.
      </p>
    </div>
    <a
      href="/locations/new"
      class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
      style="background: var(--theme-sidebar-accent); color: white;"
    >
      <Plus class="mr-2 h-4 w-4" />
      Add Location
    </a>
  </div>

  <!-- Stats -->
  <div class="grid gap-4 md:grid-cols-4">
    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Total Locations</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.total}
          </p>
        </div>
        <MapPin class="h-8 w-8" style="color: var(--theme-sidebar-accent);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Location Types</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.types}
          </p>
        </div>
        <Building class="h-8 w-8" style="color: var(--theme-info);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Favorites</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.favorites}
          </p>
        </div>
        <Star class="h-8 w-8" style="color: var(--theme-warning);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">With Address</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.withAddress}
          </p>
        </div>
        <Navigation class="h-8 w-8" style="color: var(--theme-success);" />
      </div>
    </ThemedCard>
  </div>

  <!-- Locations List -->
  <ThemedCard title="Your Locations">
    {#if data.locations.length === 0}
      <div class="py-12 text-center">
        <MapPin class="mx-auto h-12 w-12 mb-4" style="color: var(--theme-sidebar-muted);" />
        <h3 class="text-lg font-medium mb-2" style="color: var(--theme-foreground);">
          No locations found
        </h3>
        <p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
          Build a library of studios, outdoor spots, and other shoot locations.
        </p>
        <a
          href="/locations/new"
          class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
          style="background: var(--theme-sidebar-accent); color: white;"
        >
          <Plus class="mr-2 h-4 w-4" />
          Add Your First Location
        </a>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each data.locations as location}
          <div class="p-4 border rounded-lg" style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border);">
            <div class="flex items-start gap-3">
              <MapPin class="w-5 h-5 mt-0.5" style="color: var(--theme-sidebar-accent);" />
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-medium text-lg" style="color: var(--theme-foreground);">{location.name}</h3>
                  {#if location.is_favorite}
                    <Star class="w-4 h-4 fill-current" style="color: var(--theme-warning);" />
                  {/if}
                </div>
                <p class="text-sm mb-1" style="color: var(--theme-sidebar-muted);">
                  {location.location_type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </p>
                {#if location.address}
                  <p class="text-sm" style="color: var(--theme-sidebar-muted);">{location.address}</p>
                {/if}
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
      <Map class="h-5 w-5 mt-0.5" style="color: var(--theme-info);" />
      <div>
        <h4 class="font-medium mb-1" style="color: var(--theme-foreground);">
          About Location Library
        </h4>
        <p class="text-sm" style="color: var(--theme-sidebar-muted);">
          Maintain a comprehensive library of shoot locations including studios, outdoor spaces, and convention centers. 
          Store addresses, contact information, parking details, and accessibility notes. Mark favorites for quick access 
          to your go-to locations.
        </p>
      </div>
    </div>
  </ThemedCard>
</div>
