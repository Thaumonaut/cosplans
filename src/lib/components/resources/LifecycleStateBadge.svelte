<script lang="ts">
  import type { LifecycleState } from '$lib/types/resources'
  import { getStateColor, getStateLabel } from '$lib/utils/lifecycle-states'

  interface Props {
    state: LifecycleState
    size?: 'sm' | 'md' | 'lg'
    variant?: 'solid' | 'outline'
    showLabel?: boolean
    class?: string
  }

  let {
    state,
    size = 'md',
    variant = 'solid',
    showLabel = true,
    class: className = ''
  }: Props = $props()

  // Get styling based on state
  const backgroundColor = $derived(variant === 'solid' ? getStateColor(state) : 'transparent');
  const textColor = $derived(variant === 'solid' ? 'white' : getStateColor(state));
  const borderColor = $derived(variant === 'outline' ? getStateColor(state) : 'transparent');

  // Size classes
  const sizeClasses = $derived({
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-sm font-medium'
  }[size]);

  // Get human-readable label
  const label = $derived(getStateLabel(state));
</script>

<span
  class="inline-flex items-center rounded-full font-medium {sizeClasses} {className}"
  style="background: {backgroundColor}; color: {textColor}; border: 1px solid {borderColor};"
>
  {#if showLabel}
    {label}
  {:else}
    <!-- Just show first letter for icon-only badges -->
    {label.charAt(0).toUpperCase()}
  {/if}
</span>

<style>
  /* Ensure proper contrast for all states */
  :global(.dark) span {
    /* Dark mode adjustments if needed */
  }
</style>
