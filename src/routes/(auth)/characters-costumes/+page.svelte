<script lang="ts">
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import ThemedButton from '$lib/components/ui/ThemedButton.svelte';
  import ThemedSelect from '$lib/components/ui/ThemedSelect.svelte';
  import { Plus, Shirt, User, Package, Search, Tag } from 'lucide-svelte';

  // Placeholder data - will be replaced with real data from database
  let inventory = [
    {
      id: '1',
      characterName: 'Geralt of Rivia',
      series: 'The Witcher',
      costumeType: 'Full Armor',
      condition: 'excellent',
      location: 'Storage Closet A',
      lastWorn: '2025-08-15'
    }
  ];

  let filterCondition = 'all';
  let searchQuery = '';
</script>

<svelte:head>
  <title>Characters & Costumes | Cosplans</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">
        Characters & Costumes
      </h1>
      <p class="mt-2 text-sm" style="color: var(--theme-sidebar-muted);">
        Your physical costume inventory - separate from active projects.
      </p>
    </div>
    <ThemedButton variant="primary">
      <Plus class="mr-2 h-4 w-4" />
      Add Costume
    </ThemedButton>
  </div>

  <!-- Stats -->
  <div class="grid gap-4 md:grid-cols-4">
    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Total Costumes</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {inventory.length}
          </p>
        </div>
        <Shirt class="h-8 w-8" style="color: var(--theme-sidebar-accent);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Characters</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {new Set(inventory.map(i => i.characterName)).size}
          </p>
        </div>
        <User class="h-8 w-8" style="color: var(--theme-info);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Excellent Condition</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {inventory.filter(i => i.condition === 'excellent').length}
          </p>
        </div>
        <Tag class="h-8 w-8" style="color: var(--theme-success);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Storage Locations</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {new Set(inventory.map(i => i.location)).size}
          </p>
        </div>
        <Package class="h-8 w-8" style="color: var(--theme-warning);" />
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
            placeholder="Search costumes or characters..."
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
        <span class="text-sm" style="color: var(--theme-sidebar-muted);">Condition:</span>
        <ThemedSelect name="filterCondition" bind:value={filterCondition}>
          <option value="all">All</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="needs-repair">Needs Repair</option>
        </ThemedSelect>
      </div>
    </div>
  </ThemedCard>

  <!-- Inventory List -->
  <ThemedCard title="Your Costume Inventory">
    {#if inventory.length === 0}
      <div class="py-12 text-center">
        <Shirt class="mx-auto h-12 w-12 mb-4" style="color: var(--theme-sidebar-muted);" />
        <h3 class="text-lg font-medium mb-2" style="color: var(--theme-foreground);">
          No costumes in inventory
        </h3>
        <p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
          Add your completed costumes to track your physical inventory, storage locations, and condition.
        </p>
        <ThemedButton variant="primary">
          <Plus class="mr-2 h-4 w-4" />
          Add Your First Costume
        </ThemedButton>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each inventory as item (item.id)}
          <div
            class="rounded-lg border p-4 transition-all hover:shadow-md"
            style="border-color: var(--theme-sidebar-border); background: var(--theme-sidebar-bg);"
          >
            <!-- Placeholder for costume image -->
            <div
              class="mb-3 h-48 rounded-md flex items-center justify-center"
              style="background: var(--theme-sidebar-border);"
            >
              <Shirt class="h-12 w-12" style="color: var(--theme-sidebar-muted);" />
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-1" style="color: var(--theme-foreground);">
                {item.characterName}
              </h3>
              <p class="text-sm mb-2" style="color: var(--theme-sidebar-muted);">
                {item.series}
              </p>

              <!-- Details -->
              <div class="space-y-1 text-sm mb-3">
                <div class="flex items-center justify-between">
                  <span style="color: var(--theme-sidebar-muted);">Type:</span>
                  <span style="color: var(--theme-foreground);">{item.costumeType}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span style="color: var(--theme-sidebar-muted);">Condition:</span>
                  <span
                    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                    style="background: var(--theme-success); color: white;"
                  >
                    {item.condition}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span style="color: var(--theme-sidebar-muted);">Location:</span>
                  <span style="color: var(--theme-foreground);">{item.location}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span style="color: var(--theme-sidebar-muted);">Last Worn:</span>
                  <span style="color: var(--theme-foreground);">
                    {new Date(item.lastWorn).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div class="flex gap-2">
                <ThemedButton variant="secondary" fullWidth>View Details</ThemedButton>
                <ThemedButton variant="secondary">
                  <Package class="h-4 w-4" />
                </ThemedButton>
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
      <Package class="h-5 w-5 mt-0.5" style="color: var(--theme-info);" />
      <div>
        <h4 class="font-medium mb-1" style="color: var(--theme-foreground);">
          About Characters & Costumes
        </h4>
        <p class="text-sm" style="color: var(--theme-sidebar-muted);">
          This is your physical costume inventory - separate from active projects. Track completed 
          costumes, their condition, storage locations, and maintenance history. This helps you manage 
          your collection, plan repairs, and quickly find costumes for events. Add photos, notes, and 
          component lists to each costume for easy reference.
        </p>
      </div>
    </div>
  </ThemedCard>
</div>
