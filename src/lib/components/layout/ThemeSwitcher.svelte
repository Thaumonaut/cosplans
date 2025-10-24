<script lang="ts">
  import LucideIcon from "$lib/components/icons/LucideIcon.svelte";
  import Dropdown from "$lib/components/layout/Dropdown.svelte";
  import { theme } from "$lib/stores/theme";
  import type { ThemeVariant } from "$lib/types/theme";

  export let inHeader = false;

  let isOpen = false;

  function selectTheme(themeId: string) {
    theme.setTheme(themeId);
    isOpen = false;
  }

  function createCustomTheme() {
    // Navigate to custom theme creator
    window.location.href = "/settings/appearance";
    isOpen = false;
  }

  // Get icon based on theme mode
  function getThemeIcon(variant: ThemeVariant): string {
    if (variant.id === "custom") return "Palette";
    return variant.mode === "dark" ? "Moon" : "Sun";
  }

  // Group themes by mode
  $: defaultLightTheme = $theme.variants.find((v) => v.id === "light-default");
  $: defaultDarkTheme = $theme.variants.find((v) => v.id === "dark-default");
  $: lightThemes = $theme.variants.filter((v) => v.mode === "light" && v.id !== "light-default");
  $: darkThemes = $theme.variants.filter((v) => v.mode === "dark" && v.id !== "dark-default");
  $: customTheme = $theme.custom;
  $: currentTheme = [...$theme.variants, customTheme].find((t) => t && t.id === $theme.activeId);
  $: currentLabel = currentTheme?.label ?? "Theme";
  
  // Get display label for theme (override defaults)
  function getThemeLabel(variant: ThemeVariant): string {
    if (variant.id === "light-default") return "Default Light";
    if (variant.id === "dark-default") return "Default Dark";
    return variant.label;
  }
</script>

<Dropdown
  bind:isOpen
  label={inHeader ? currentLabel : ""}
  icon={inHeader ? "Palette" : null}
  align={inHeader ? "right" : "left"}
  triggerClass={inHeader ? "hover:bg-[var(--theme-header-hover)]" : ""}
  textColorClass={inHeader ? "text-[var(--theme-header-text)]" : "text-[var(--theme-sidebar-text)]"}
>
  <div class="p-1 max-h-[400px] overflow-y-auto">
    <!-- Default Themes -->
    <div
      class="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider"
      style="color: var(--theme-sidebar-muted);"
    >
      Default Themes
    </div>
    {#if defaultLightTheme}
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors {$theme.activeId ===
        defaultLightTheme.id
          ? 'bg-[var(--theme-sidebar-active)]'
          : 'hover:bg-[var(--theme-sidebar-hover)]'}"
        style={$theme.activeId === defaultLightTheme.id
          ? "color: var(--theme-sidebar-accent);"
          : "color: var(--theme-foreground);"}
        onclick={() => selectTheme(defaultLightTheme.id)}
        role="menuitem"
      >
        <LucideIcon name={getThemeIcon(defaultLightTheme)} size={16} />
        <span class="flex-1 text-left">{getThemeLabel(defaultLightTheme)}</span>
        {#if $theme.activeId === defaultLightTheme.id}
          <LucideIcon name="Check" size={16} class="ml-auto" />
        {/if}
      </button>
    {/if}
    {#if defaultDarkTheme}
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors {$theme.activeId ===
        defaultDarkTheme.id
          ? 'bg-[var(--theme-sidebar-active)]'
          : 'hover:bg-[var(--theme-sidebar-hover)]'}"
        style={$theme.activeId === defaultDarkTheme.id
          ? "color: var(--theme-sidebar-accent);"
          : "color: var(--theme-foreground);"}
        onclick={() => selectTheme(defaultDarkTheme.id)}
        role="menuitem"
      >
        <LucideIcon name={getThemeIcon(defaultDarkTheme)} size={16} />
        <span class="flex-1 text-left">{getThemeLabel(defaultDarkTheme)}</span>
        {#if $theme.activeId === defaultDarkTheme.id}
          <LucideIcon name="Check" size={16} class="ml-auto" />
        {/if}
      </button>
    {/if}

    <!-- Light Themes -->
    <div
      class="mt-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider border-t border-[var(--theme-sidebar-border)]"
      style="color: var(--theme-sidebar-muted);"
    >
      Light Themes
    </div>
    {#each lightThemes as themeVariant (themeVariant.id)}
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors {$theme.activeId ===
        themeVariant.id
          ? 'bg-[var(--theme-sidebar-active)]'
          : 'hover:bg-[var(--theme-sidebar-hover)]'}"
        style={$theme.activeId === themeVariant.id
          ? "color: var(--theme-sidebar-accent);"
          : "color: var(--theme-foreground);"}
        onclick={() => selectTheme(themeVariant.id)}
        role="menuitem"
      >
        <LucideIcon name={getThemeIcon(themeVariant)} size={16} />
        <span class="flex-1 text-left">{getThemeLabel(themeVariant)}</span>
        {#if $theme.activeId === themeVariant.id}
          <LucideIcon name="Check" size={16} class="ml-auto" />
        {/if}
      </button>
    {/each}

    <!-- Dark Themes -->
    <div
      class="mt-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider border-t border-[var(--theme-sidebar-border)]"
      style="color: var(--theme-sidebar-muted);"
    >
      Dark Themes
    </div>
    {#each darkThemes as themeVariant (themeVariant.id)}
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors {$theme.activeId ===
        themeVariant.id
          ? 'bg-[var(--theme-sidebar-active)]'
          : 'hover:bg-[var(--theme-sidebar-hover)]'}"
        style={$theme.activeId === themeVariant.id
          ? "color: var(--theme-sidebar-accent);"
          : "color: var(--theme-foreground);"}
        onclick={() => selectTheme(themeVariant.id)}
        role="menuitem"
      >
        <LucideIcon name={getThemeIcon(themeVariant)} size={16} />
        <span class="flex-1 text-left">{getThemeLabel(themeVariant)}</span>
        {#if $theme.activeId === themeVariant.id}
          <LucideIcon name="Check" size={16} className="ml-auto" />
        {/if}
      </button>
    {/each}

    <!-- Custom Theme -->
    {#if customTheme}
      <div
        class="mt-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider border-t border-[var(--theme-sidebar-border)]"
        style="color: var(--theme-sidebar-muted);"
      >
        Custom
      </div>
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors {$theme.activeId ===
        'custom'
          ? 'bg-[var(--theme-sidebar-active)]'
          : 'hover:bg-[var(--theme-sidebar-hover)]'}"
        style={$theme.activeId === "custom"
          ? "color: var(--theme-sidebar-accent);"
          : "color: var(--theme-foreground);"}
        onclick={() => selectTheme("custom")}
        role="menuitem"
      >
        <LucideIcon name="Palette" size={16} />
        <span class="flex-1 text-left">{customTheme.label}</span>
        {#if $theme.activeId === "custom"}
          <LucideIcon name="Check" size={16} class="ml-auto" />
        {/if}
      </button>
    {/if}

    <!-- Create Custom Theme Button -->
    <div class="mt-2 border-t border-[var(--theme-sidebar-border)] pt-1">
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--theme-sidebar-accent)] transition-colors hover:bg-[var(--theme-sidebar-hover)]"
        onclick={createCustomTheme}
        role="menuitem"
      >
        <LucideIcon name="Palette" size={16} />
        <span class="flex-1 text-left"
          >{customTheme ? "Edit Custom Theme" : "Create Custom Theme"}</span
        >
      </button>
    </div>
  </div>
</Dropdown>
