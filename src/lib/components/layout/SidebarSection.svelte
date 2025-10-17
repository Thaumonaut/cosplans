<script lang="ts">
  import NavigationItem from "$lib/components/layout/NavigationItem.svelte";
  import type {
    NavigationItem as NavigationItemType,
    NavigationSection,
  } from "$lib/types/navigation";

  export let section: NavigationSection;
  export let collapsed = false;

  const items: NavigationItemType[] = section.items;
</script>

<section aria-labelledby={`${section.id}-label`} class="space-y-2">
  <header
    class={`px-3 text-xs font-semibold uppercase tracking-wide text-[var(--theme-sidebar-muted)] ${collapsed ? "sr-only" : "block"}`}
  >
    <h2 id={`${section.id}-label`}>{section.label}</h2>
  </header>
  <ul class="space-y-1">
    {#each items as item (item.id)}
      <NavigationItem {item} {collapsed} />
    {/each}
  </ul>
</section>
