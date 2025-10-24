<script lang="ts">
  import { goto } from '$app/navigation';
  import type { Costume } from '$lib/types/resources';
  import { getStateLabel, getStateColor, isAvailableForShoots } from '$lib/utils/lifecycle-states';
  import LifecycleStateBadge from './LifecycleStateBadge.svelte';

  interface Props {
    costume: Costume;
    variant?: 'card' | 'compact' | 'list';
    showActions?: boolean;
    class?: string;
  }

  let {
    costume,
    variant = 'card',
    showActions = true,
    class: className = ''
  }: Props = $props();

  // Computed properties
  const isAvailable = $derived(isAvailableForShoots(costume.status));
  const hasPhotos = $derived(costume.photos && costume.photos.length > 0);
  const primaryPhoto = $derived(costume.photos?.find(p => p.is_primary) || costume.photos?.[0]);

  // Format currency
  function formatCurrency(amount: number | undefined): string {
    if (!amount) return 'Not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Navigate to costume detail
  function viewCostume() {
    goto(`/costumes/${costume.id}`);
  }
</script>

{#if variant === 'compact'}
  <!-- Compact view for lists -->
  <button
    type="button"
    class="w-full text-left flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-md {className}"
    style="background: var(--theme-background); border-color: var(--theme-sidebar-border);"
    onclick={viewCostume}
  >
    <!-- Photo or placeholder -->
    <div class="flex-shrink-0">
      {#if primaryPhoto}
        <img
          src={primaryPhoto.storage_path}
          alt={primaryPhoto.caption || costume.character_name}
          class="h-12 w-12 rounded object-cover"
        />
      {:else}
        <div
          class="flex h-12 w-12 items-center justify-center rounded"
          style="background: var(--theme-sidebar-hover); color: var(--theme-sidebar-accent);"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      {/if}
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h3 class="font-medium truncate" style="color: var(--theme-foreground);">
          {costume.character_name}
        </h3>
        <LifecycleStateBadge status={costume.status} size="sm" />
      </div>
      {#if costume.series}
        <p class="text-sm truncate" style="color: var(--theme-sidebar-muted);">
          {costume.series}
        </p>
      {/if}
    </div>

    <!-- Availability indicator -->
    <div class="flex-shrink-0">
      <div
        class="w-2 h-2 rounded-full"
        style="background: {isAvailable ? 'var(--theme-success)' : 'var(--theme-error)'};"
        title={isAvailable ? 'Available for shoots' : 'Not available'}
      ></div>
    </div>
  </button>

{:else if variant === 'list'}
  <!-- List view with more details -->
  <button
    type="button"
    class="w-full text-left flex items-center gap-4 rounded-lg border p-4 transition-all hover:shadow-md {className}"
    style="background: var(--theme-background); border-color: var(--theme-sidebar-border);"
    onclick={viewCostume}
  >
    <!-- Photo -->
    <div class="flex-shrink-0">
      {#if primaryPhoto}
        <img
          src={primaryPhoto.storage_path}
          alt={primaryPhoto.caption || costume.character_name}
          class="h-20 w-20 rounded object-cover"
        />
      {:else}
        <div
          class="flex h-20 w-20 items-center justify-center rounded"
          style="background: var(--theme-sidebar-hover); color: var(--theme-sidebar-accent);"
        >
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      {/if}
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <h3 class="text-lg font-medium truncate" style="color: var(--theme-foreground);">
          {costume.character_name}
        </h3>
        <LifecycleStateBadge status={costume.status} />
      </div>
      
      <div class="flex items-center gap-3 text-sm" style="color: var(--theme-sidebar-muted);">
        {#if costume.series}
          <span>{costume.series}</span>
        {/if}
        {#if costume.costume_type}
          <span>• {costume.costume_type}</span>
        {/if}
        {#if costume.estimated_cost}
          <span>• {formatCurrency(costume.estimated_cost)}</span>
        {/if}
      </div>
    </div>

    <!-- Availability -->
    <div class="flex-shrink-0 text-center">
      <div
        class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
        style="background: {isAvailable ? 'var(--theme-success)' : 'var(--theme-error)'}; color: white;"
      >
        <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        {isAvailable ? 'Available' : 'Unavailable'}
      </div>
    </div>
  </button>

{:else}
  <!-- Card view (default) -->
  <button
    type="button"
    class="w-full text-left rounded-lg border overflow-hidden transition-all hover:shadow-lg {className}"
    style="background: var(--theme-background); border-color: var(--theme-sidebar-border);"
    onclick={viewCostume}
  >
    <!-- Photo -->
    <div class="relative h-48 overflow-hidden" style="background: var(--theme-sidebar-hover);">
      {#if primaryPhoto}
        <img
          src={primaryPhoto.storage_path}
          alt={primaryPhoto.caption || costume.character_name}
          class="w-full h-full object-cover"
        />
      {:else}
        <div class="flex items-center justify-center h-full" style="color: var(--theme-sidebar-accent);">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      {/if}
      
      <!-- Availability indicator overlay -->
      <div class="absolute top-2 right-2">
        <div
          class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm"
          style="background: {isAvailable ? 'var(--theme-success)' : 'var(--theme-error)'}; color: white;"
        >
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          {isAvailable ? 'Available' : 'Unavailable'}
        </div>
      </div>

      <!-- Photo count badge -->
      {#if hasPhotos && costume.photos && costume.photos.length > 1}
        <div class="absolute bottom-2 right-2">
          <div
            class="px-2 py-1 rounded text-xs font-medium backdrop-blur-sm"
            style="background: rgba(0, 0, 0, 0.6); color: white;"
          >
            {costume.photos.length} photos
          </div>
        </div>
      {/if}
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-start justify-between mb-2">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-medium truncate" style="color: var(--theme-foreground);">
            {costume.character_name}
          </h3>
          {#if costume.series}
            <p class="text-sm truncate" style="color: var(--theme-sidebar-muted);">
              {costume.series}
            </p>
          {/if}
        </div>
        <LifecycleStateBadge status={costume.status} />
      </div>

      <!-- Details -->
      <div class="space-y-1 text-sm">
        {#if costume.costume_type}
          <div class="flex justify-between">
            <span style="color: var(--theme-sidebar-muted);">Type:</span>
            <span style="color: var(--theme-foreground);">{costume.costume_type}</span>
          </div>
        {/if}
        
        {#if costume.estimated_cost || costume.actual_cost}
          <div class="flex justify-between">
            <span style="color: var(--theme-sidebar-muted);">Cost:</span>
            <span style="color: var(--theme-foreground);">
              {costume.actual_cost ? formatCurrency(costume.actual_cost) : formatCurrency(costume.estimated_cost)}
            </span>
          </div>
        {/if}

        {#if costume.storage_location}
          <div class="flex justify-between">
            <span style="color: var(--theme-sidebar-muted);">Storage:</span>
            <span class="truncate ml-2" style="color: var(--theme-foreground);">{costume.storage_location}</span>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="mt-3 pt-3 border-t text-xs" style="border-color: var(--theme-sidebar-border); color: var(--theme-sidebar-muted);">
        <div class="flex justify-between items-center">
          <span>Added {new Date(costume.created_at).toLocaleDateString()}</span>
          {#if costume.completion_date}
            <span>Completed {new Date(costume.completion_date).toLocaleDateString()}</span>
          {/if}
        </div>
      </div>
    </div>
  </button>
{/if}

<style>
  button {
    cursor: pointer;
  }

  buttonfocus-visible {
    outline: 2px solid var(--theme-primary);
    outline-offset: 2px;
  }
</style>
