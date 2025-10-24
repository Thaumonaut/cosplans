<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { Costume, CrewMember, Equipment, Prop, Location, ResourceSearchParams } from '$lib/types/resources'
  import ResourceCard from './ResourceCard.svelte'
  import ThemedInput from '$lib/components/ui/ThemedInput.svelte'

  // Resource type union
  type Resource = Costume | CrewMember | Equipment | Prop | Location

  interface Props {
    resources: Resource[]
    loading?: boolean
    searchQuery?: string
    filters?: ResourceSearchParams
    variant?: 'grid' | 'list'
    showPhotos?: boolean
    showActions?: boolean
    onEdit?: (resource: Resource) => void
    onDelete?: (resource: Resource) => void
    onFavorite?: (resource: Resource) => void
    onSearch?: (query: string) => void
    onFilter?: (filters: ResourceSearchParams) => void
    class?: string
  }

  let {
    resources,
    loading = false,
    searchQuery = '',
    filters = {},
    variant = 'grid',
    showPhotos = true,
    showActions = true,
    onEdit,
    onDelete,
    onFavorite,
    onSearch,
    onFilter,
    class: className = ''
  }: Props = $props()

  const dispatch = createEventDispatcher<{
    search: { query: string }
    filter: { filters: ResourceSearchParams }
    edit: { resource: Resource }
    delete: { resource: Resource }
    favorite: { resource: Resource }
  }>()

  // Local search state with debouncing
  let localSearchQuery = searchQuery
  let searchTimeout: number | null = null

  // Handle search input with debouncing
  function handleSearch(event: Event) {
    const target = event.target as HTMLInputElement
    localSearchQuery = target.value

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    searchTimeout = setTimeout(() => {
      dispatch('search', { query: localSearchQuery })
      onSearch?.(localSearchQuery)
    }, 300) // 300ms debounce
  }

  // Handle filter changes
  function handleFilterChange(key: keyof ResourceSearchParams, value: any) {
    const newFilters = { ...filters, [key]: value }
    dispatch('filter', { filters: newFilters })
    onFilter?.(newFilters)
  }

  // Clear all filters
  function clearFilters() {
    const clearedFilters: ResourceSearchParams = {}
    dispatch('filter', { filters: clearedFilters })
    onFilter?.(clearedFilters)
  }

  // Get active filter count
  $derived activeFilterCount = Object.values(filters).filter(value =>
    value !== undefined && value !== '' && value !== null
  ).length

  // Check if any resources match current filters
  $derived hasResults = resources.length > 0
  $derived hasActiveFilters = activeFilterCount > 0
</script>

<div class="space-y-4 {className}">
  <!-- Search and filters header -->
  <div class="space-y-3">
    <!-- Search input -->
    <div class="relative">
      <ThemedInput
        type="text"
        placeholder="Search resources..."
        bind:value={localSearchQuery}
        on:input={handleSearch}
        class="pl-10"
      />
      <div class="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg class="h-5 w-5" style="color: var(--theme-sidebar-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
    </div>

    <!-- Filter controls (if filters provided) -->
    {#if Object.keys(filters).length > 0}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium" style="color: var(--theme-sidebar-text);">Filters:</span>

          <!-- Filter buttons -->
          <div class="flex flex-wrap gap-2">
            <!-- Status filter -->
            {#if 'status' in filters}
              <select
                class="px-3 py-1 rounded border text-sm"
                style="background: var(--theme-background); border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
                value={filters.status || ''}
                onchange={(e) => handleFilterChange('status', (e.target as HTMLSelectElement).value || undefined)}
              >
                <option value="">All Statuses</option>
                <option value="owned">Owned</option>
                <option value="ready">Ready</option>
                <option value="in_progress">In Progress</option>
                <option value="damaged">Damaged</option>
                <option value="sold">Sold</option>
              </select>
            {/if}

            <!-- Role filter -->
            {#if 'role' in filters}
              <select
                class="px-3 py-1 rounded border text-sm"
                style="background: var(--theme-background); border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
                value={filters.role || ''}
                onchange={(e) => handleFilterChange('role', (e.target as HTMLSelectElement).value || undefined)}
              >
                <option value="">All Roles</option>
                <option value="photographer">Photographer</option>
                <option value="assistant">Assistant</option>
                <option value="makeup_artist">Makeup Artist</option>
                <option value="model">Model</option>
                <option value="coordinator">Coordinator</option>
              </select>
            {/if}

            <!-- Type filter -->
            {#if 'type' in filters}
              <select
                class="px-3 py-1 rounded border text-sm"
                style="background: var(--theme-background); border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
                value={filters.type || ''}
                onchange={(e) => handleFilterChange('type', (e.target as HTMLSelectElement).value || undefined)}
              >
                <option value="">All Types</option>
                <option value="costume">Costumes</option>
                <option value="crew">Crew</option>
                <option value="equipment">Equipment</option>
                <option value="prop">Props</option>
                <option value="location">Locations</option>
              </select>
            {/if}

            <!-- Favorite filter -->
            {#if 'is_favorite' in filters}
              <button
                type="button"
                class="px-3 py-1 rounded border text-sm transition-colors {filters.is_favorite ? 'bg-yellow-100 text-yellow-800' : ''}"
                style="background: var(--theme-background); border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
                onclick={() => handleFilterChange('is_favorite', filters.is_favorite ? undefined : true)}
              >
                ⭐ Favorites
              </button>
            {/if}

            <!-- Clear filters -->
            {#if hasActiveFilters}
              <button
                type="button"
                class="px-3 py-1 rounded border text-sm font-medium transition-colors hover:bg-[var(--theme-error)] hover:text-white"
                style="border-color: var(--theme-sidebar-border); color: var(--theme-error);"
                onclick={clearFilters}
              >
                Clear ({activeFilterCount})
              </button>
            {/if}
          </div>
        </div>

        <!-- Results count -->
        <div class="text-sm" style="color: var(--theme-sidebar-muted);">
          {resources.length} {resources.length === 1 ? 'result' : 'results'}
        </div>
      </div>
    {/if}
  </div>

  <!-- Loading state -->
  {#if loading}
    <div class="space-y-4">
      {#each Array(6) as _, i}
        <div class="rounded-lg border p-6 animate-pulse" style="border-color: var(--theme-sidebar-border);">
          <div class="flex items-center gap-3 mb-4">
            <div class="h-12 w-12 rounded-lg" style="background: var(--theme-sidebar-border);"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 rounded" style="background: var(--theme-sidebar-border); width: 60%;"></div>
              <div class="h-3 rounded" style="background: var(--theme-sidebar-border); width: 40%;"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-3 rounded" style="background: var(--theme-sidebar-border); width: 100%;"></div>
            <div class="h-3 rounded" style="background: var(--theme-sidebar-border); width: 80%;"></div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Empty state -->
  {#if !loading && !hasResults}
    <div class="text-center py-12" style="color: var(--theme-sidebar-muted);">
      <div class="mx-auto h-12 w-12 rounded-lg mb-4" style="background: var(--theme-sidebar-border);"></div>
      <h3 class="text-lg font-medium mb-2" style="color: var(--theme-sidebar-text);">No resources found</h3>
      <p class="text-sm">
        {#if hasActiveFilters}
          Try adjusting your search or filters
        {:else}
          Get started by adding your first resource
        {/if}
      </p>
    </div>
  {/if}

  <!-- Resource grid/list -->
  {#if !loading && hasResults}
    {#if variant === 'list'}
      <div class="space-y-3">
        {#each resources as resource (resource.id)}
          <ResourceCard
            {resource}
            variant="list"
            {showPhotos}
            {showActions}
            onEdit={(r) => dispatch('edit', { resource: r })}
            onDelete={(r) => dispatch('delete', { resource: r })}
            onFavorite={(r) => dispatch('favorite', { resource: r })}
          />
        {/each}
      </div>
    {:else}
      <!-- Grid view (default) -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each resources as resource (resource.id)}
          <ResourceCard
            {resource}
            variant="default"
            {showPhotos}
            {showActions}
            onEdit={(r) => dispatch('edit', { resource: r })}
            onDelete={(r) => dispatch('delete', { resource: r })}
            onFavorite={(r) => dispatch('favorite', { resource: r })}
          />
        {/each}
      </div>
    {/if}
  {/if}
</div>
