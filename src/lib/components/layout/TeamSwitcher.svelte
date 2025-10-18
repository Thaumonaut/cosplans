<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import LucideIcon from "$lib/components/icons/LucideIcon.svelte";
  import { navigation as navigationStore } from "$lib/stores/navigation";

  export let collapsed = false;

  let isOpen = false;
  const dispatch = createEventDispatcher<{ teamSelected: { id: string; name: string } }>();

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest("[data-team-dropdown]")) {
      isOpen = false;
    }
  }

  // Mock team list - replace with real data from store
  const teams = [
    { id: "1", name: $navigationStore.team?.name ?? "Cosplans Team", isActive: true },
    { id: "2", name: "Creative Team", isActive: false },
    { id: "3", name: "Event Crew", isActive: false },
  ];

  function selectTeam(teamId: string) {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      dispatch("teamSelected", { id: team.id, name: team.name });
      isOpen = false;
    }
  }

  // Get first letter of team name for collapsed state
  $: teamInitial = ($navigationStore.team?.name ?? "T").charAt(0).toUpperCase();
</script>

<svelte:window on:click={handleClickOutside} />

{#if collapsed}
  <!-- When collapsed, just show the team icon as a non-interactive badge -->
  <div
    class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700"
    title={$navigationStore.team?.name ?? "Team"}
  >
    <span class="text-sm font-semibold">{teamInitial}</span>
  </div>
{:else}
  <!-- Full width navigation-style dropdown -->
  <div class="relative w-full" data-team-dropdown>
    <button
      type="button"
      class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--theme-sidebar-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-sidebar-accent)]"
      on:click={() => (isOpen = !isOpen)}
    >
      <div
        class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 flex-shrink-0"
      >
        <LucideIcon name="Users" size={16} />
      </div>
      <div class="flex-1 text-left">
        <p class="text-sm font-semibold text-[var(--theme-sidebar-text)]">
          {$navigationStore.team?.name ?? "Team"}
        </p>
      </div>
      <LucideIcon
        name={isOpen ? "ChevronUp" : "ChevronDown"}
        size={16}
        class="text-[var(--theme-sidebar-muted)]"
      />
    </button>

    {#if isOpen}
      <div
        class="absolute left-0 right-0 z-50 mt-1 space-y-1 rounded-lg p-1 border"
        style="background: var(--theme-background); border-color: var(--theme-sidebar-border); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.2);"
      >
        {#each teams as team (team.id)}
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors {team.isActive
              ? 'bg-[var(--theme-sidebar-active)]'
              : 'hover:bg-[var(--theme-sidebar-hover)]'}"
            style={team.isActive
              ? "color: var(--theme-sidebar-accent);"
              : "color: var(--theme-foreground);"}
            on:click={() => selectTeam(team.id)}
            role="menuitem"
          >
            <LucideIcon name="Users" size={16} />
            <span class="flex-1 text-left">{team.name}</span>
            {#if team.isActive}
              <LucideIcon name="Check" size={16} class="ml-auto" />
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/if}
