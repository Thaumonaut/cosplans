<script lang="ts">
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import ThemedButton from '$lib/components/ui/ThemedButton.svelte';
  import ThemedSelect from '$lib/components/ui/ThemedSelect.svelte';
  import ThemedAlert from '$lib/components/ui/ThemedAlert.svelte';
  import { Settings, Eye, EyeOff, Pin, Layout, Info } from 'lucide-svelte';

  // Placeholder data - will be replaced with real data from database
  let navigationLayout = 'auto';
  let hiddenSections: string[] = [];
  let pinnedSections: string[] = ['dashboard', 'planning', 'active-projects'];

  // Available navigation sections
  const allSections = [
    { id: 'dashboard', name: 'Dashboard', category: 'Main' },
    { id: 'planning', name: 'Planning', category: 'Main' },
    { id: 'active-projects', name: 'Active Projects', category: 'Main' },
    { id: 'gallery', name: 'Gallery', category: 'Main' },
    { id: 'calendar', name: 'Calendar', category: 'Main' },
    { id: 'archive', name: 'Archive', category: 'Main' },
    { id: 'characters-costumes', name: 'Characters & Costumes', category: 'Resources' },
    { id: 'props', name: 'Props', category: 'Resources' },
    { id: 'crew', name: 'Crew', category: 'Resources' },
    { id: 'locations', name: 'Locations', category: 'Resources' },
    { id: 'equipment', name: 'Equipment', category: 'Resources' },
    { id: 'budgeting', name: 'Budgeting', category: 'Resources' }
  ];

  function togglePin(sectionId: string) {
    if (pinnedSections.includes(sectionId)) {
      pinnedSections = pinnedSections.filter(id => id !== sectionId);
    } else {
      pinnedSections = [...pinnedSections, sectionId];
    }
  }

  function toggleHide(sectionId: string) {
    if (hiddenSections.includes(sectionId)) {
      hiddenSections = hiddenSections.filter(id => id !== sectionId);
    } else {
      hiddenSections = [...hiddenSections, sectionId];
    }
  }

  async function saveSettings() {
    // TODO: Save to database
    console.log('Saving navigation settings:', {
      navigationLayout,
      hiddenSections,
      pinnedSections
    });
  }
</script>

<svelte:head>
  <title>Navigation Settings | Cosplans</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">
        Navigation Settings
      </h1>
      <p class="mt-2 text-sm" style="color: var(--theme-sidebar-muted);">
        Customize your sidebar navigation layout and visibility.
      </p>
    </div>
    <ThemedButton variant="primary" onclick={saveSettings}>
      Save Changes
    </ThemedButton>
  </div>

  <!-- Layout Preset -->
  <ThemedCard title="Navigation Layout Preset">
    <div class="space-y-4">
      <div>
        <label for="layout" class="block text-sm font-medium mb-2" style="color: var(--theme-foreground);">
          Choose a preset layout
        </label>
        <ThemedSelect name="layout" bind:value={navigationLayout}>
          <option value="auto">Auto (Recommended) - Smart layout based on team type</option>
          <option value="minimal">Minimal - Essential features only</option>
          <option value="full">Full - All features visible</option>
          <option value="photographer">Photographer Focus - Gallery, calendar, equipment</option>
          <option value="coordinator">Coordinator Focus - Team, crew, budgeting</option>
        </ThemedSelect>
      </div>

      <ThemedAlert type="info">
        <div class="flex items-start gap-2">
          <Info class="h-5 w-5 mt-0.5" />
          <div>
            <strong>About Auto Layout</strong>
            <p class="text-sm mt-1">
              Auto layout adapts based on your team type. Personal teams show simplified navigation 
              (hides team features), while shared teams show full navigation. Unused sections are 
              automatically hidden after 30 days of inactivity.
            </p>
          </div>
        </div>
      </ThemedAlert>
    </div>
  </ThemedCard>

  <!-- Section Visibility -->
  <ThemedCard title="Section Visibility">
    <div class="space-y-4">
      <p class="text-sm" style="color: var(--theme-sidebar-muted);">
        Customize which sections appear in your sidebar. Hidden sections will appear in the "More..." overflow menu.
      </p>

      {#each ['Main', 'Resources'] as category}
        <div>
          <h3 class="text-sm font-semibold mb-3" style="color: var(--theme-foreground);">
            {category}
          </h3>
          <div class="space-y-2">
            {#each allSections.filter(s => s.category === category) as section}
              <div
                class="flex items-center justify-between rounded-lg border p-3"
                style="border-color: var(--theme-sidebar-border); background: var(--theme-sidebar-bg);"
              >
                <div class="flex items-center gap-3">
                  <Layout class="h-4 w-4" style="color: var(--theme-sidebar-muted);" />
                  <span style="color: var(--theme-foreground);">{section.name}</span>
                  {#if pinnedSections.includes(section.id)}
                    <span
                      class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                      style="background: var(--theme-info); color: white;"
                    >
                      <Pin class="h-3 w-3 mr-1" />
                      Pinned
                    </span>
                  {/if}
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="rounded-md p-2 transition-colors hover:brightness-90"
                    style="color: {pinnedSections.includes(section.id) ? 'var(--theme-info)' : 'var(--theme-sidebar-muted)'};"
                    onclick={() => togglePin(section.id)}
                    title={pinnedSections.includes(section.id) ? 'Unpin' : 'Pin (prevent auto-hide)'}
                  >
                    <Pin class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    class="rounded-md p-2 transition-colors hover:brightness-90"
                    style="color: {hiddenSections.includes(section.id) ? 'var(--theme-error)' : 'var(--theme-sidebar-muted)'};"
                    onclick={() => toggleHide(section.id)}
                    title={hiddenSections.includes(section.id) ? 'Show in sidebar' : 'Hide in overflow menu'}
                  >
                    {#if hiddenSections.includes(section.id)}
                      <EyeOff class="h-4 w-4" />
                    {:else}
                      <Eye class="h-4 w-4" />
                    {/if}
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </ThemedCard>

  <!-- Auto-Hide Settings -->
  <ThemedCard title="Auto-Hide Settings">
    <div class="space-y-4">
      <p class="text-sm" style="color: var(--theme-sidebar-muted);">
        Sections you haven't used in 30 days will automatically move to the "More..." overflow menu 
        to keep your navigation clean. Pinned sections are never auto-hidden.
      </p>

      <div class="flex items-center justify-between rounded-lg border p-4" style="border-color: var(--theme-sidebar-border);">
        <div>
          <h4 class="font-medium mb-1" style="color: var(--theme-foreground);">
            Enable Auto-Hide
          </h4>
          <p class="text-sm" style="color: var(--theme-sidebar-muted);">
            Automatically hide unused sections after 30 days
          </p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked class="sr-only peer" />
          <div
            class="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
            style="background: var(--theme-success);"
          ></div>
        </label>
      </div>
    </div>
  </ThemedCard>

  <!-- Team Override Info -->
  <ThemedCard>
    <div class="flex items-start gap-3">
      <Settings class="h-5 w-5 mt-0.5" style="color: var(--theme-info);" />
      <div>
        <h4 class="font-medium mb-1" style="color: var(--theme-foreground);">
          Per-Team Overrides
        </h4>
        <p class="text-sm" style="color: var(--theme-sidebar-muted);">
          These settings are your global defaults. You can override them per-team in Team Settings. 
          Team admins can also recommend a layout for their team (but it won't be enforced). 
          Your preferences sync across all your devices.
        </p>
      </div>
    </div>
  </ThemedCard>

  <!-- Summary -->
  <ThemedCard>
    <div class="space-y-2 text-sm">
      <h4 class="font-medium" style="color: var(--theme-foreground);">Current Configuration</h4>
      <div class="grid gap-2 md:grid-cols-3">
        <div>
          <span style="color: var(--theme-sidebar-muted);">Layout:</span>
          <span style="color: var(--theme-foreground);" class="font-medium ml-2">
            {navigationLayout}
          </span>
        </div>
        <div>
          <span style="color: var(--theme-sidebar-muted);">Pinned:</span>
          <span style="color: var(--theme-foreground);" class="font-medium ml-2">
            {pinnedSections.length} sections
          </span>
        </div>
        <div>
          <span style="color: var(--theme-sidebar-muted);">Hidden:</span>
          <span style="color: var(--theme-foreground);" class="font-medium ml-2">
            {hiddenSections.length} sections
          </span>
        </div>
      </div>
    </div>
  </ThemedCard>
</div>
