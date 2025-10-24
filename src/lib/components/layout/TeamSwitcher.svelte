<script lang="ts">
  import { onMount } from "svelte";
  import { goto, invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  
  import LucideIcon from "$lib/components/icons/LucideIcon.svelte";
  import { navigation as navigationStore } from "$lib/stores/navigation";
  import { team as teamStore, type Team } from "$lib/stores/team";

  export let collapsed = false;

  let isOpen = false;

  // Function to reload teams
  async function reloadTeams() {
    try {
      const response = await fetch('/api/teams');
      if (response.ok) {
        const data = await response.json();
        const teams: Team[] = data.teams.map((t: any) => ({
          id: t.id,
          name: t.name,
          slug: t.name.toLowerCase().replace(/\s+/g, '-'),
          role: t.role,
          permissions: getPermissionsForRole(t.role),
          is_personal: t.is_personal,
          member_count: t.member_count,
        }));
        
        teamStore.initialize(teams);
      }
    } catch (error) {
      console.error('Error reloading teams:', error);
    }
  }

  // Expose reload function globally so it can be called from anywhere
  if (typeof window !== 'undefined') {
    (window as any).reloadTeamSwitcher = reloadTeams;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest("[data-team-dropdown]")) {
      isOpen = false;
    }
  }

  // Load real teams from API
  onMount(async () => {
    try {
      const response = await fetch('/api/teams');
      if (response.ok) {
        const data = await response.json();
        const teams: Team[] = data.teams.map((t: any) => ({
          id: t.id,
          name: t.name,
          slug: t.name.toLowerCase().replace(/\s+/g, '-'),
          role: t.role,
          permissions: getPermissionsForRole(t.role),
          is_personal: t.is_personal,
          member_count: t.member_count,
        }));
        
        teamStore.initialize(teams);
      } else {
        console.error('Failed to load teams');
        teamStore.initialize([]);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
      teamStore.initialize([]);
    }
  });

  function getPermissionsForRole(role: string): string[] {
    switch (role) {
      case 'owner':
        return ['admin', 'manage_shoots', 'manage_members', 'delete_team'];
      case 'admin':
        return ['manage_shoots', 'manage_members'];
      case 'member':
        return ['view_shoots', 'edit_shoots'];
      case 'viewer':
        return ['view_shoots'];
      default:
        return [];
    }
  }

  async function selectTeam(teamId: string) {
    const success = await teamStore.switchTeam(teamId);
    
    if (success) {
      // Update sidebar team context
      const teamContext = teamStore.getSidebarContext();
      navigationStore.setTeam(teamContext);
      
      // Navigate to the selected team's page
      await goto(`/teams/${teamId}`);
      
      isOpen = false;
    }
  }

  // Get team data from store
  $: teams = $teamStore.teams;
  $: currentTeam = $teamStore.current;
  $: teamInitial = (currentTeam?.name ?? "T").charAt(0).toUpperCase();
  
  // Separate personal and public teams
  $: personalTeams = teams.filter((t: any) => t.is_personal);
  $: publicTeams = teams.filter((t: any) => !t.is_personal);
</script>

<svelte:window onclick={handleClickOutside} />

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
      onclick={() => (isOpen = !isOpen)}
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
        className="text-[var(--theme-sidebar-muted)]"
      />
    </button>

    {#if isOpen}
      <div
        class="absolute left-0 right-0 z-50 mt-1 rounded-lg p-2 border"
        style="background: var(--theme-background); border-color: var(--theme-sidebar-border); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.2);"
      >
        <!-- Personal Teams Section -->
        {#if personalTeams.length > 0}
          <div class="px-2 py-1">
            <p class="text-xs font-semibold uppercase tracking-wide" style="color: var(--theme-sidebar-muted);">
              Personal
            </p>
          </div>
          {#each personalTeams as teamItem (teamItem.id)}
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors {teamItem.id === currentTeam?.id
                ? 'bg-[var(--theme-sidebar-active)]'
                : 'hover:bg-[var(--theme-sidebar-hover)]'}"
              style={teamItem.id === currentTeam?.id
                ? "color: var(--theme-sidebar-accent);"
                : "color: var(--theme-foreground);"}
              onclick={() => selectTeam(teamItem.id)}
              role="menuitem"
            >
              <LucideIcon name="User" size={16} />
              <span class="flex-1 text-left">{teamItem.name}</span>
              {#if teamItem.id === currentTeam?.id}
                <LucideIcon name="Check" size={16} className="ml-auto" />
              {/if}
            </button>
          {/each}
        {/if}

        <!-- Divider -->
        {#if personalTeams.length > 0 && publicTeams.length > 0}
          <div class="my-2" style="border-top: 1px solid var(--theme-sidebar-border);"></div>
        {/if}

        <!-- Public Teams Section -->
        {#if publicTeams.length > 0}
          <div class="px-2 py-1">
            <p class="text-xs font-semibold uppercase tracking-wide" style="color: var(--theme-sidebar-muted);">
              Public
            </p>
          </div>
          {#each publicTeams as teamItem (teamItem.id)}
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors {teamItem.id === currentTeam?.id
                ? 'bg-[var(--theme-sidebar-active)]'
                : 'hover:bg-[var(--theme-sidebar-hover)]'}"
              style={teamItem.id === currentTeam?.id
                ? "color: var(--theme-sidebar-accent);"
                : "color: var(--theme-foreground);"}
              onclick={() => selectTeam(teamItem.id)}
              role="menuitem"
            >
              <LucideIcon name="Users" size={16} />
              <span class="flex-1 text-left">{teamItem.name}</span>
              <span class="text-xs" style="color: var(--theme-sidebar-muted);">
                ({teamItem.member_count || 1})
              </span>
              {#if teamItem.id === currentTeam?.id}
                <LucideIcon name="Check" size={16} className="ml-auto" />
              {/if}
            </button>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
{/if}
