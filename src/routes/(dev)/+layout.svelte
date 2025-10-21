<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import ThemeSwitcher from "$lib/components/layout/ThemeSwitcher.svelte";
  import { theme } from "$lib/stores/theme";

  onMount(() => {
    if (browser) {
      theme.initialize();
    }
  });
</script>

<svelte:head>
  <title>Cosplans Developer Workspace</title>
</svelte:head>

<div class="min-h-screen transition-colors duration-200" style="background: var(--theme-background); color: var(--theme-foreground);">
  <header class="border-b backdrop-blur" style="border-color: var(--theme-sidebar-border); background: var(--theme-sidebar-bg);">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <h1 class="text-lg font-semibold tracking-wide" style="color: var(--theme-foreground);">Developer Tools</h1>
      <div class="flex items-center gap-4">
        <p class="text-xs uppercase" style="color: var(--theme-sidebar-muted);">{$page.url.pathname}</p>
        <ThemeSwitcher inHeader={true} />
      </div>
    </div>
  </header>
  <main class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
    <slot />
  </main>
</div>
