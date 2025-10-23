<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { Costume, CrewMember, Equipment, Prop, Location } from '$lib/types/resources'
  import CosplansLogo from '$lib/components/icons/CosplansLogo.svelte'

  // Resource type union for all 5 resource types
  type Resource = Costume | CrewMember | Equipment | Prop | Location

  interface Props {
    resource: Resource
    variant?: 'default' | 'compact' | 'list'
    showPhotos?: boolean
    showActions?: boolean
    onEdit?: (resource: Resource) => void
    onDelete?: (resource: Resource) => void
    onFavorite?: (resource: Resource) => void
    class?: string
  }

  let {
    resource,
    variant = 'default',
    showPhotos = true,
    showActions = true,
    onEdit,
    onDelete,
    onFavorite,
    class: className = ''
  }: Props = $props()

  const dispatch = createEventDispatcher<{
    edit: { resource: Resource }
    delete: { resource: Resource }
    favorite: { resource: Resource }
  }>()

  // Get the primary photo for display
  $derived primaryPhoto = resource.photos?.find(photo => photo.is_primary) || resource.photos?.[0]

  // Check if resource is available (for costumes/props/equipment)
  $derived isAvailable = 'status' in resource ?
    ['owned', 'ready'].includes(resource.status) :
    true

  // Get status badge styling
  $derived statusStyle = resource.status ? `background: var(--theme-${getStatusColor(resource.status)}); color: white;` : ''

  // Helper functions
  function getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      planned: 'info',
      acquiring: 'warning',
      in_progress: 'warning',
      ready: 'info',
      owned: 'success',
      sold: 'muted',
      damaged: 'error',
      loaned: 'warning',
      stored: 'info',
      lost: 'error',
      rented: 'warning',
      cancelled: 'muted',
      paused: 'warning'
    }
    return statusColors[status] || 'muted'
  }

  function getResourceTypeLabel(): string {
    if ('character_name' in resource) return 'Costume'
    if ('role' in resource) return 'Crew'
    if ('equipment_type' in resource) return 'Equipment'
    if ('prop_type' in resource) return 'Prop'
    if ('location_type' in resource) return 'Location'
    return 'Resource'
  }

  function getResourceIcon(): string {
    if ('character_name' in resource) return 'Shirt'
    if ('role' in resource) return 'Users'
    if ('equipment_type' in resource) return 'Wrench'
    if ('prop_type' in resource) return 'Package'
    if ('location_type' in resource) return 'MapPin'
    return 'Package'
  }

  function getResourceName(): string {
    if ('character_name' in resource) return resource.character_name
    if ('name' in resource) return resource.name
    return 'Unnamed'
  }

  function getResourceStatus(): string | undefined {
    if ('status' in resource) return resource.status
    return undefined
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString()
  }
</script>

{#if variant === 'compact'}
  <!-- Compact card for list views -->
  <div
    class="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-[var(--theme-sidebar-hover)] {className}"
    style="border-color: var(--theme-sidebar-border);"
  >
    <!-- Photo or icon -->
    <div class="flex-shrink-0">
      {#if primaryPhoto}
        <img
          src={primaryPhoto.storage_path}
          alt={primaryPhoto.caption || getResourceName() || 'Resource'}
          class="h-10 w-10 rounded object-cover"
        />
      {:else}
        <div
          class="flex h-10 w-10 items-center justify-center rounded"
          style="background: var(--theme-sidebar-hover); color: var(--theme-sidebar-accent);"
        >
          <CosplansLogo size="w-6 h-6" color="currentColor" />
        </div>
      {/if}
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h3 class="font-medium truncate" style="color: var(--theme-sidebar-text);">
          {getResourceName()}
        </h3>
        {#if getResourceStatus()}
          <span
            class="px-1.5 py-0.5 rounded text-xs font-medium"
            style={statusStyle}
          >
            {getResourceStatus()}
          </span>
        {/if}
      </div>
      <p class="text-sm truncate" style="color: var(--theme-sidebar-muted);">
        {getResourceTypeLabel()}
      </p>
    </div>

    <!-- Actions -->
    {#if showActions}
      <div class="flex items-center gap-1">
        {#if onFavorite && 'is_favorite' in resource}
          <button
            type="button"
            class="p-1 rounded transition-colors hover:bg-[var(--theme-sidebar-hover)]"
            style="color: var(--theme-sidebar-muted);"
            on:click={() => onFavorite(resource)}
            aria-label={resource.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg class="h-4 w-4 {resource.is_favorite ? 'fill-current' : ''}" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        {/if}
        {#if onEdit}
          <button
            type="button"
            class="p-1 rounded transition-colors hover:bg-[var(--theme-sidebar-hover)]"
            style="color: var(--theme-sidebar-muted);"
            on:click={() => onEdit(resource)}
            aria-label="Edit"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        {/if}
        {#if onDelete}
          <button
            type="button"
            class="p-1 rounded transition-colors hover:bg-[var(--theme-error)] hover:text-white"
            style="color: var(--theme-sidebar-muted);"
            on:click={() => onDelete(resource)}
            aria-label="Delete"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        {/if}
      </div>
    {/if}
  </div>

{:else if variant === 'list'}
  <!-- List item view -->
  <div
    class="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-[var(--theme-sidebar-hover)] {className}"
    style="border-color: var(--theme-sidebar-border);"
  >
    <!-- Photo -->
    {#if showPhotos}
      <div class="flex-shrink-0">
        {#if primaryPhoto}
          <img
            src={primaryPhoto.storage_path}
            alt={primaryPhoto.caption || resource.name || 'Resource'}
            class="h-16 w-16 rounded object-cover"
          />
        {:else}
          <div
            class="flex h-16 w-16 items-center justify-center rounded"
            style="background: var(--theme-sidebar-hover); color: var(--theme-sidebar-accent);"
          >
            <CosplansLogo size="w-8 h-8" color="currentColor" />
          </div>
        {/if}
      </div>
    {/if}

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <h3 class="font-medium truncate" style="color: var(--theme-sidebar-text);">
          {resource.name || ('character_name' in resource ? resource.character_name : 'Unnamed')}
        </h3>
        {#if resource.status}
          <span
            class="px-2 py-1 rounded text-xs font-medium"
            style={statusStyle}
          >
            {resource.status}
          </span>
        {/if}
        {#if 'is_favorite' in resource && resource.is_favorite}
          <svg class="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        {/if}
      </div>

      <div class="flex items-center gap-4 text-sm" style="color: var(--theme-sidebar-muted);">
        <span>{getResourceTypeLabel()}</span>
        {#if 'series' in resource && resource.series}
          <span>• {resource.series}</span>
        {/if}
        {#if 'brand' in resource && resource.brand}
          <span>• {resource.brand}</span>
        {/if}
        {#if 'location_type' in resource && resource.location_type}
          <span>• {resource.location_type}</span>
        {/if}
        {#if 'role' in resource && resource.role}
          <span>• {resource.role}</span>
        {/if}
        <span>• Updated {formatDate(resource.updated_at)}</span>
      </div>
    </div>

    <!-- Actions -->
    {#if showActions}
      <div class="flex items-center gap-2">
        {#if onFavorite && 'is_favorite' in resource}
          <button
            type="button"
            class="p-2 rounded transition-colors hover:bg-[var(--theme-sidebar-hover)]"
            style="color: var(--theme-sidebar-muted);"
            on:click={() => onFavorite(resource)}
            aria-label={resource.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg class="h-4 w-4 {resource.is_favorite ? 'fill-current text-yellow-500' : ''}" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        {/if}
        {#if onEdit}
          <button
            type="button"
            class="p-2 rounded transition-colors hover:bg-[var(--theme-sidebar-hover)]"
            style="color: var(--theme-sidebar-muted);"
            on:click={() => onEdit(resource)}
            aria-label="Edit"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        {/if}
        {#if onDelete}
          <button
            type="button"
            class="p-2 rounded transition-colors hover:bg-[var(--theme-error)] hover:text-white"
            style="color: var(--theme-sidebar-muted);"
            on:click={() => onDelete(resource)}
            aria-label="Delete"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        {/if}
      </div>
    {/if}
  </div>

{:else}
  <!-- Default card view -->
  <div
    class="rounded-lg border p-6 transition-all hover:shadow-lg {className}"
    style="background: var(--theme-background); border-color: var(--theme-sidebar-border);"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-lg"
          style="background: var(--theme-sidebar-hover); color: var(--theme-sidebar-accent);"
        >
          <CosplansLogo size="w-6 h-6" color="currentColor" />
        </div>
        <div>
          <h3 class="font-semibold" style="color: var(--theme-foreground);">
            {resource.name || ('character_name' in resource ? resource.character_name : 'Unnamed')}
          </h3>
          <p class="text-sm" style="color: var(--theme-sidebar-muted);">
            {getResourceTypeLabel()}
          </p>
        </div>
      </div>

      <!-- Status and favorite -->
      <div class="flex items-center gap-2">
        {#if resource.status}
          <span
            class="px-2 py-1 rounded text-sm font-medium"
            style={statusStyle}
          >
            {resource.status}
          </span>
        {/if}
        {#if 'is_favorite' in resource && resource.is_favorite}
          <svg class="h-5 w-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        {/if}
      </div>
    </div>

    <!-- Photo grid -->
    {#if showPhotos && resource.photos?.length}
      <div class="mb-4">
        <div class="grid grid-cols-4 gap-2">
          {#each resource.photos.slice(0, 4) as photo, index}
            <div class="relative aspect-square rounded overflow-hidden">
              <img
                src={photo.storage_path}
                alt={photo.caption || 'Resource photo'}
                class="h-full w-full object-cover"
              />
              {#if index === 3 && resource.photos.length > 4}
                <div class="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium">
                  +{resource.photos.length - 4}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Details -->
    <div class="space-y-2 mb-4">
      {#if 'character_name' in resource}
        <div class="flex justify-between">
          <span class="text-sm" style="color: var(--theme-sidebar-muted);">Character:</span>
          <span class="text-sm font-medium" style="color: var(--theme-foreground);">
            {resource.character_name}
          </span>
        </div>
      {/if}

      {#if 'series' in resource && resource.series}
        <div class="flex justify-between">
          <span class="text-sm" style="color: var(--theme-sidebar-muted);">Series:</span>
          <span class="text-sm font-medium" style="color: var(--theme-foreground);">
            {resource.series}
          </span>
        </div>
      {/if}

      {#if 'role' in resource && resource.role}
        <div class="flex justify-between">
          <span class="text-sm" style="color: var(--theme-sidebar-muted);">Role:</span>
          <span class="text-sm font-medium" style="color: var(--theme-foreground);">
            {resource.role}
          </span>
        </div>
      {/if}

      {#if 'equipment_type' in resource && resource.equipment_type}
        <div class="flex justify-between">
          <span class="text-sm" style="color: var(--theme-sidebar-muted);">Type:</span>
          <span class="text-sm font-medium" style="color: var(--theme-foreground);">
            {resource.equipment_type}
          </span>
        </div>
      {/if}

      {#if 'brand' in resource && resource.brand}
        <div class="flex justify-between">
          <span class="text-sm" style="color: var(--theme-sidebar-muted);">Brand:</span>
          <span class="text-sm font-medium" style="color: var(--theme-foreground);">
            {resource.brand}
          </span>
        </div>
      {/if}

      {#if 'location_type' in resource && resource.location_type}
        <div class="flex justify-between">
          <span class="text-sm" style="color: var(--theme-sidebar-muted);">Type:</span>
          <span class="text-sm font-medium" style="color: var(--theme-foreground);">
            {resource.location_type}
          </span>
        </div>
      {/if}

      {#if 'address' in resource && resource.address}
        <div class="flex justify-between">
          <span class="text-sm" style="color: var(--theme-sidebar-muted);">Address:</span>
          <span class="text-sm font-medium" style="color: var(--theme-foreground);">
            {resource.address}
          </span>
        </div>
      {/if}

      {#if 'condition' in resource && resource.condition}
        <div class="flex justify-between">
          <span class="text-sm" style="color: var(--theme-sidebar-muted);">Condition:</span>
          <span class="text-sm font-medium" style="color: var(--theme-foreground);">
            {resource.condition}
          </span>
        </div>
      {/if}

      {#if 'storage_location' in resource && resource.storage_location}
        <div class="flex justify-between">
          <span class="text-sm" style="color: var(--theme-sidebar-muted);">Storage:</span>
          <span class="text-sm font-medium" style="color: var(--theme-foreground);">
            {resource.storage_location}
          </span>
        </div>
      {/if}
    </div>

    <!-- Metadata -->
    <div class="flex items-center justify-between text-xs" style="color: var(--theme-sidebar-muted);">
      <span>Updated {formatDate(resource.updated_at)}</span>
      {#if 'costume_type' in resource && resource.costume_type}
        <span>{resource.costume_type}</span>
      {/if}
      {#if 'prop_type' in resource && resource.prop_type}
        <span>{resource.prop_type}</span>
      {/if}
      {#if 'ownership_status' in resource && resource.ownership_status}
        <span>{resource.ownership_status}</span>
      {/if}
    </div>

    <!-- Actions -->
    {#if showActions}
      <div class="flex items-center justify-end gap-2 mt-4 pt-4 border-t" style="border-color: var(--theme-sidebar-border);">
        {#if onFavorite && 'is_favorite' in resource}
          <button
            type="button"
            class="px-3 py-1 rounded text-sm transition-colors hover:bg-[var(--theme-sidebar-hover)]"
            style="color: var(--theme-sidebar-muted);"
            on:click={() => onFavorite(resource)}
          >
            {resource.is_favorite ? '★ Favorited' : '☆ Add to favorites'}
          </button>
        {/if}
        {#if onEdit}
          <button
            type="button"
            class="px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-[var(--theme-sidebar-hover)]"
            style="color: var(--theme-sidebar-accent);"
            on:click={() => onEdit(resource)}
          >
            Edit
          </button>
        {/if}
        {#if onDelete}
          <button
            type="button"
            class="px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-[var(--theme-error)] hover:text-white"
            style="color: var(--theme-error);"
            on:click={() => onDelete(resource)}
          >
            Delete
          </button>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  /* Ensure images don't overflow */
  img {
    max-width: 100%;
    height: auto;
  }
</style>
