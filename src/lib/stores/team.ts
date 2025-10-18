import { writable, derived, get } from "svelte/store";
import { browser } from "$app/environment";
import type { SidebarTeamContext } from "$lib/types/navigation";

export interface Team {
  id: string;
  name: string;
  slug: string;
  avatarUrl?: string;
  role: "owner" | "admin" | "member" | "viewer";
  permissions: string[];
}

export interface TeamState {
  current: Team | null;
  teams: Team[];
  isLoading: boolean;
  isSwitching: boolean;
}

const STORAGE_KEY = "cosplans:current-team";

function createTeamStore() {
  const initialState: TeamState = {
    current: null,
    teams: [],
    isLoading: false,
    isSwitching: false,
  };

  const { subscribe, set, update } = writable<TeamState>(initialState);

  return {
    subscribe,

    /**
     * Initialize the team store with user's teams
     */
    async initialize(teams: Team[]) {
      update((state) => ({ ...state, teams, isLoading: true }));

      try {
        // Try to restore last selected team from localStorage
        let currentTeam: Team | null = null;

        if (browser) {
          const storedTeamId = localStorage.getItem(STORAGE_KEY);
          if (storedTeamId) {
            currentTeam = teams.find((t) => t.id === storedTeamId) ?? null;
          }
        }

        // Fall back to first team if no stored selection
        if (!currentTeam && teams.length > 0) {
          currentTeam = teams[0];
        }

        update((state) => ({
          ...state,
          current: currentTeam,
          isLoading: false,
        }));

        // Persist selection
        if (currentTeam && browser) {
          localStorage.setItem(STORAGE_KEY, currentTeam.id);
        }
      } catch (error) {
        console.error("Failed to initialize team store:", error);
        update((state) => ({ ...state, isLoading: false }));
      }
    },

    /**
     * Switch to a different team
     */
    async switchTeam(teamId: string): Promise<boolean> {
      const state = get({ subscribe });

      const newTeam = state.teams.find((t) => t.id === teamId);
      if (!newTeam) {
        console.error(`Team with id ${teamId} not found`);
        return false;
      }

      update((s) => ({ ...s, isSwitching: true }));

      try {
        // Persist selection
        if (browser) {
          localStorage.setItem(STORAGE_KEY, teamId);
        }

        // Update current team
        update((s) => ({
          ...s,
          current: newTeam,
          isSwitching: false,
        }));

        return true;
      } catch (error) {
        console.error("Failed to switch team:", error);
        update((s) => ({ ...s, isSwitching: false }));
        return false;
      }
    },

    /**
     * Check if current team has a specific permission
     */
    hasPermission(permission: string): boolean {
      const state = get({ subscribe });
      return state.current?.permissions.includes(permission) ?? false;
    },

    /**
     * Get team context for sidebar
     */
    getSidebarContext(): SidebarTeamContext | null {
      const state = get({ subscribe });
      if (!state.current) return null;

      return {
        id: state.current.id,
        name: state.current.name,
        avatarUrl: state.current.avatarUrl,
      };
    },

    /**
     * Add or update a team in the list
     */
    upsertTeam(team: Team) {
      update((state) => {
        const index = state.teams.findIndex((t) => t.id === team.id);
        const teams = [...state.teams];

        if (index >= 0) {
          teams[index] = team;
        } else {
          teams.push(team);
        }

        return { ...state, teams };
      });
    },

    /**
     * Remove a team from the list
     */
    removeTeam(teamId: string) {
      update((state) => ({
        ...state,
        teams: state.teams.filter((t) => t.id !== teamId),
      }));
    },

    /**
     * Reset the store to initial state
     */
    reset() {
      set(initialState);
      if (browser) {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  };
}

export const team = createTeamStore();

// Derived store for current team
export const currentTeam = derived(team, ($team) => $team.current);

// Derived store for checking if user has teams
export const hasTeams = derived(team, ($team) => $team.teams.length > 0);

// Derived store for checking loading state
export const isLoadingTeams = derived(team, ($team) => $team.isLoading);

// Derived store for checking switching state
export const isSwitchingTeams = derived(team, ($team) => $team.isSwitching);
