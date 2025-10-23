<script lang="ts">
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import type { ComponentType } from 'svelte';
  
  export let label: string;
  export let value: number | string;
  export let icon: ComponentType;
  export let iconColor: string = 'var(--theme-sidebar-accent)';
</script>

<ThemedCard padding="p-4">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">{label}</p>
      <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
        {value}
      </p>
    </div>
    <svelte:component this={icon} class="h-8 w-8" style="color: {iconColor};" />
  </div>
</ThemedCard>
