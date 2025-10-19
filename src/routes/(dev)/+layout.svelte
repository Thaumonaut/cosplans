<script lang="ts">
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>Cosplans Developer Workspace</title>
</svelte:head>

<div class="min-h-screen bg-slate-950/95 text-slate-200">
  <header class="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <h1 class="text-lg font-semibold tracking-wide text-slate-100">Developer Tools</h1>
      <p class="text-xs uppercase text-slate-400">{$page.url.pathname}</p>
    </div>
  </header>
  <main class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
    <slot />
  </main>
</div>
