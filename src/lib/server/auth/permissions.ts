/**
 * Authorization middleware using @casl/ability for dashboard permissions
 * Implements Constitutional Principle VII (Team Roles & Permissions)
 */

import { AbilityBuilder, createMongoAbility, type MongoAbility } from '@casl/ability';
import type { Database } from '$lib/types/supabase';

type Subjects = 
  | 'DashboardWidget' 
  | 'TimelineView' 
  | 'ProgressTracker' 
  | 'CharacterProfile' 
  | 'TeamBudget' 
  | 'CostumeInventory'
  | 'Shoot'
  | 'Team'
  | 'all';

type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

type TeamRole = Database['public']['Enums']['team_role'];

interface User {
  id: string;
  email: string;
}

interface TeamMembership {
  team_id: string;
  role: TeamRole;
}

/**
 * Define permissions based on team role
 */
export function defineAbilitiesFor(user: User, teamMemberships: TeamMembership[]): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  // User can always read and manage their own dashboard widgets
  can('manage', 'DashboardWidget', { user_id: user.id });

  // User can read their own data
  can('read', 'ProgressTracker');
  can('read', 'CharacterProfile', { cosplayer_id: user.id });

  // Team-based permissions
  for (const membership of teamMemberships) {
    switch (membership.role) {
      case 'owner':
      case 'admin':
        // Full permissions for team content
        can('manage', 'all', { team_id: membership.team_id });
        break;

      case 'editor':
        // Can read and update most content
        can('read', 'all', { team_id: membership.team_id });
        can('update', 'Shoot', { team_id: membership.team_id });
        can('update', 'TimelineView', { team_id: membership.team_id });
        can('update', 'ProgressTracker', { team_id: membership.team_id });
        can('update', 'CostumeInventory', { team_id: membership.team_id });
        can('create', 'CharacterProfile', { team_id: membership.team_id });
        can('update', 'CharacterProfile', { team_id: membership.team_id });
        // Cannot manage budget or delete content
        cannot('delete', 'all');
        cannot('update', 'TeamBudget');
        cannot('create', 'TeamBudget');
        break;

      case 'viewer':
        // Read-only access
        can('read', 'all', { team_id: membership.team_id });
        break;

      default:
        // No permissions for unknown roles
        break;
    }
  }

  return build();
}

/**
 * Middleware to attach user abilities to request locals
 */
export async function attachAbilities(
  user: User,
  supabaseClient: any
): Promise<AppAbility> {
  // Fetch user's team memberships
  const { data: teamMemberships, error } = await supabaseClient
    .from('team_members')
    .select('team_id, role')
    .eq('user_id', user.id);

  if (error) {
    console.warn('⚠️ Error fetching team memberships (user may not have completed onboarding):', error.message);
    // Return minimal permissions - this is expected for new users who haven't completed onboarding
    return defineAbilitiesFor(user, []);
  }

  // Empty array is valid - new users won't have team memberships until onboarding
  if (!teamMemberships || teamMemberships.length === 0) {
    console.log('ℹ️ User has no team memberships yet (likely needs onboarding)');
  }

  return defineAbilitiesFor(user, teamMemberships || []);
}

/**
 * Helper to check if user can perform action on subject
 */
export function checkAbility(
  ability: AppAbility,
  action: Actions,
  subject: Subjects,
  conditions?: Record<string, any>
): boolean {
  return ability.can(action, subject, conditions);
}

/**
 * Throw error if user cannot perform action
 */
export function assertAbility(
  ability: AppAbility,
  action: Actions,
  subject: Subjects,
  conditions?: Record<string, any>
): void {
  if (!ability.can(action, subject, conditions)) {
    throw new Error(`Forbidden: Cannot ${action} ${subject}`);
  }
}
