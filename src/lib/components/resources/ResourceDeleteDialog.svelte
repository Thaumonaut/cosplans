<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { Costume, CrewMember, Equipment, Prop, Location } from '$lib/types/resources'

  // Resource type union
  type Resource = Costume | CrewMember | Equipment | Prop | Location

  interface Props {
    resource: Resource | null
    isOpen: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
    class?: string
  }

  let {
    resource,
    isOpen,
    title = 'Confirm Delete',
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    variant = 'danger',
    class: className = ''
  }: Props = $props()

  const dispatch = createEventDispatcher<{
    confirm: { resource: Resource }
    cancel: void
    close: void
  }>()

  // Generate default message based on resource type
  $: defaultMessage = resource ? `Are you sure you want to delete "${getResourceName(resource)}"? This action cannot be undone.` : ''

  // Get resource name for display
  function getResourceName(resource: Resource): string {
    if ('character_name' in resource) return resource.character_name
    if ('name' in resource) return resource.name
    return 'this resource'
  }

  // Get resource type label
  function getResourceTypeLabel(resource: Resource): string {
    if ('character_name' in resource) return 'Costume'
    if ('role' in resource) return 'Crew Member'
    if ('equipment_type' in resource) return 'Equipment'
    if ('prop_type' in resource) return 'Prop'
    if ('location_type' in resource) return 'Location'
    return 'Resource'
  }

  // Handle confirm
  function handleConfirm() {
    if (resource) {
      dispatch('confirm', { resource })
      dispatch('close')
    }
  }

  // Handle cancel
  function handleCancel() {
    dispatch('cancel')
    dispatch('close')
  }

  // Handle escape key
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleCancel()
    }
  }

  // Variant styling
  $: variantStyles = {
    danger: {
      button: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'text-red-500'
    },
    warning: {
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      icon: 'text-yellow-500'
    },
    info: {
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: 'text-blue-500'
    }
  }[variant]
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    onclick={handleCancel}
  >
    <!-- Modal -->
    <div
      class="relative max-w-md w-full mx-4 rounded-lg border shadow-lg"
      style="background: var(--theme-background); border-color: var(--theme-sidebar-border);"
      onclick|stopPropagation
      onkeydown={handleKeydown}
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <!-- Header -->
      <div class="flex items-center gap-3 p-6 pb-4">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 {variantStyles.icon}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold" style="color: var(--theme-foreground);">
            {title}
          </h3>
          {#if resource}
            <p class="text-sm mt-1" style="color: var(--theme-sidebar-muted);">
              {getResourceTypeLabel(resource)} • {getResourceName(resource)}
            </p>
          {/if}
        </div>
      </div>

      <!-- Body -->
      <div class="px-6 pb-6">
        <p class="text-sm leading-relaxed" style="color: var(--theme-sidebar-text);">
          {message || defaultMessage}
        </p>

        <!-- Warning for resources with photos -->
        {#if resource && 'photos' in resource && resource.photos?.length}
          <div class="mt-4 p-3 rounded border" style="background: var(--theme-warning); border-color: var(--theme-warning); color: var(--theme-foreground);">
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <span class="text-sm font-medium">This {getResourceTypeLabel(resource).toLowerCase()} has {resource.photos.length} photo{resource.photos.length === 1 ? '' : 's'}</span>
            </div>
            <p class="text-xs mt-1 opacity-90">
              Photos will be permanently deleted and cannot be recovered.
            </p>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t" style="border-color: var(--theme-sidebar-border);">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium rounded transition-colors hover:bg-[var(--theme-sidebar-hover)]"
          style="color: var(--theme-sidebar-muted);"
          onclick={handleCancel}
        >
          {cancelText}
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium rounded transition-colors {variantStyles.button}"
          onclick={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}
