<script lang="ts">
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import { Plus, HelpCircle } from 'lucide-svelte';
  
  // Props
  export let title: string;
  export let description: string;
  export let addButtonText: string = 'Add Item';
  export let addButtonHref: string;
  export let helpText: string = '';
  
  let showHelp = false;
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <div class="flex items-center gap-2">
        <h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">
          {title}
        </h1>
        {#if helpText}
          <div class="relative">
            <button
              type="button"
              class="p-1 rounded-full hover:bg-[var(--theme-sidebar-hover)] transition-colors"
              onmouseenter={() => showHelp = true}
              onmouseleave={() => showHelp = false}
              onfocus={() => showHelp = true}
              onblur={() => showHelp = false}
            >
              <HelpCircle class="h-5 w-5" style="color: var(--theme-sidebar-muted);" />
            </button>
            
            {#if showHelp}
              <div
                class="absolute left-0 top-full mt-2 w-80 p-3 rounded-lg shadow-lg border z-50"
                style="background: var(--theme-background); border-color: var(--theme-sidebar-border);"
              >
                <p class="text-sm" style="color: var(--theme-foreground);">
                  {helpText}
                </p>
              </div>
            {/if}
          </div>
        {/if}
      </div>
      <p class="mt-2 text-sm" style="color: var(--theme-sidebar-muted);">
        {description}
      </p>
    </div>
    <a
      href={addButtonHref}
      class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
      style="background: var(--theme-sidebar-accent); color: white;"
    >
      <Plus class="mr-2 h-4 w-4" />
      {addButtonText}
    </a>
  </div>

  <!-- Stats Cards Slot -->
  {#if $$slots.stats}
    <div class="grid gap-4 md:grid-cols-4">
      <slot name="stats" />
    </div>
  {/if}

  <!-- Filters Slot -->
  {#if $$slots.filters}
    <slot name="filters" />
  {/if}

  <!-- Content Slot -->
  <slot name="content" />
</div>
