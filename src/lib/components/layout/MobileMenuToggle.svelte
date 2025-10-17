<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Menu, X } from "lucide-svelte";

  export let open = false;
  export let label = "Toggle sidebar navigation";

  const dispatch = createEventDispatcher<{ toggle: boolean }>();

  function handleClick() {
    dispatch("toggle", !open);
  }
</script>

<button
  type="button"
  class="inline-flex items-center justify-center rounded-md border border-[var(--theme-sidebar-border)] bg-[var(--theme-sidebar-bg)] p-2 text-[var(--theme-sidebar-text)] shadow-sm transition-colors hover:bg-[var(--theme-sidebar-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-sidebar-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-sidebar-bg)]"
  aria-label={label}
  aria-expanded={open}
  on:click={handleClick}
>
  {#if open}
    <X size={22} aria-hidden="true" />
  {:else}
    <Menu size={22} aria-hidden="true" />
  {/if}
</button>
