<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  
  import LucideIcon from "$lib/components/icons/LucideIcon.svelte";
  import { navigation as navigationStore } from "$lib/stores/navigation";
  import { team as teamStore, type Team } from "$lib/stores/team";

  export let collapsed = false;

  let isOpen = false;

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest("[data-team-dropdown]")) {
      isOpen = false;
    }
  }

  // Initialize with mock data for now (replace with real API call later)
  onMount(() => {
    const mockTeams: Team[] = [
      {
        id: "1",
        name: "Cosplans Team",
        slug: "cosplans-team",
        role: "owner",
        permissions: ["admin", "manage_shoots", "manage_members"],
      },
      {
        id: "2",
        name: "Creative Team",
        slug: "creative-team",
        role: "admin",
        permissions: ["manage_shoots", "view_members"],
      },
      {
        id: "3",
        name: "Event Crew",
        slug: "event-crew",
        role: "member",
        permissions: ["view_shoots"],
      },
    ];

    teamStore.initialize(mockTeams);
  });

  async function selectTeam(teamId: string) {
    const success = await teamStore.switchTeam(teamId);
    
    if (success) {
      // Update sidebar team context
      const teamContext = teamStore.getSidebarContext();
      navigationStore.setTeam(teamContext);
      
      // TODO: Implement smart redirect logic
      // For now, just stay on current page if valid, otherwise go to dashboard
      const currentPath = $page.url.pathname;
      
      // Simple redirect to dashboard for team switch
      // Later: Check if current route is valid for new team permissions
      if (!currentPath.startsWith("/dashboard")) {
        await goto("/dashboard");
      }
      
      isOpen = false;
    }
  }

  // Get team data from store
  $: teams = $teamStore.teams;
  $: currentTeam = $teamStore.current;
  $: teamInitial = (currentTeam?.name ?? "T").charAt(0).toUpperCase();
</script>

<svelte:window on:click={handleClickOutside} />

{#if collapsed}
  <!-- When collapsed, just show the team icon as a non-interactive badge -->
  <div
    class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700"
    title={currentTeam?.name ?? "Team"}
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
      disabled={$teamStore.isSwitching}
    >
      <div
        class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 flex-shrink-0"
      >
        <LucideIcon name="Users" size={16} />
      </div>
      <div class="flex-1 text-left">
        <p class="text-sm font-semibold text-[var(--theme-sidebar-text)]">
          {currentTeam?.name ?? "Loading..."}
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
        {#each teams as teamItem (teamItem.id)}
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors {teamItem.id === currentTeam?.id
              ? 'bg-[var(--theme-sidebar-active)]'
              : 'hover:bg-[var(--theme-sidebar-hover)]'}"
            style={teamItem.id === currentTeam?.id
              ? "color: var(--theme-sidebar-accent);"
              : "color: var(--theme-foreground);"}
            on:click={() => selectTeam(teamItem.id)}
            role="menuitem"
          >
            <LucideIcon name="Users" size={16} />
            <span class="flex-1 text-left">{teamItem.name}</span>
            {#if teamItem.id === currentTeam?.id}
              <LucideIcon name="Check" size={16} class="ml-auto" />
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/if}
