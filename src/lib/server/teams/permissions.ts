/**
 * Team Permissions Helper
 * Centralized permission checking for team operations
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { TeamRole } from '$lib/types/teams';

/**
 * Check if a user can manage team members (invite, remove, change roles)
 * Only owners and admins can manage members
 * 
 * @param supabase - Supabase client
 * @param userId - ID of the user
 * @param teamId - ID of the team
 * @returns Whether the user can manage members
 */
export async function canManageMembers(
	supabase: SupabaseClient,
	userId: string,
	teamId: string
): Promise<boolean> {
	const { data: member } = await supabase
		.from('team_members')
		.select('role')
		.eq('team_id', teamId)
		.eq('user_id', userId)
		.single();

	if (!member) {
		return false;
	}

	return member.role === 'owner' || member.role === 'admin';
}

/**
 * Check if a user can delete a team
 * Only the owner can delete a team
 * 
 * @param supabase - Supabase client
 * @param userId - ID of the user
 * @param teamId - ID of the team
 * @returns Whether the user can delete the team
 */
export async function canDeleteTeam(
	supabase: SupabaseClient,
	userId: string,
	teamId: string
): Promise<boolean> {
	const { data: team } = await supabase
		.from('teams')
		.select('owner_id')
		.eq('id', teamId)
		.single();

	return team?.owner_id === userId;
}

/**
 * Check if a user can transfer team ownership
 * Only the current owner can transfer ownership
 * 
 * @param supabase - Supabase client
 * @param userId - ID of the user
 * @param teamId - ID of the team
 * @returns Whether the user can transfer ownership
 */
export async function canTransferOwnership(
	supabase: SupabaseClient,
	userId: string,
	teamId: string
): Promise<boolean> {
	return canDeleteTeam(supabase, userId, teamId);
}

/**
 * Check if a user can update team settings (name, description, image)
 * Only the owner can update team settings
 * 
 * @param supabase - Supabase client
 * @param userId - ID of the user
 * @param teamId - ID of the team
 * @returns Whether the user can update team settings
 */
export async function canUpdateTeam(
	supabase: SupabaseClient,
	userId: string,
	teamId: string
): Promise<boolean> {
	return canDeleteTeam(supabase, userId, teamId);
}

/**
 * Get a user's role in a team
 * 
 * @param supabase - Supabase client
 * @param userId - ID of the user
 * @param teamId - ID of the team
 * @returns User's role or null if not a member
 */
export async function getUserRole(
	supabase: SupabaseClient,
	userId: string,
	teamId: string
): Promise<TeamRole | null> {
	const { data: member } = await supabase
		.from('team_members')
		.select('role')
		.eq('team_id', teamId)
		.eq('user_id', userId)
		.single();

	return member?.role || null;
}

/**
 * Check if a user is a member of a team
 * 
 * @param supabase - Supabase client
 * @param userId - ID of the user
 * @param teamId - ID of the team
 * @returns Whether the user is a member
 */
export async function isTeamMember(
	supabase: SupabaseClient,
	userId: string,
	teamId: string
): Promise<boolean> {
	const role = await getUserRole(supabase, userId, teamId);
	return role !== null;
}

/**
 * Check if a user can remove a specific team member
 * Owners and admins can remove members, but:
 * - Cannot remove the owner
 * - Admins cannot remove other admins (only owner can)
 * 
 * @param supabase - Supabase client
 * @param userId - ID of the user performing the action
 * @param teamId - ID of the team
 * @param targetUserId - ID of the user to be removed
 * @returns Whether the removal is allowed
 */
export async function canRemoveMember(
	supabase: SupabaseClient,
	userId: string,
	teamId: string,
	targetUserId: string
): Promise<boolean> {
	// Get both users' roles
	const [actorRole, targetRole] = await Promise.all([
		getUserRole(supabase, userId, teamId),
		getUserRole(supabase, targetUserId, teamId)
	]);

	if (!actorRole || !targetRole) {
		return false;
	}

	// Cannot remove the owner
	if (targetRole === 'owner') {
		return false;
	}

	// Owner can remove anyone (except themselves, checked above)
	if (actorRole === 'owner') {
		return true;
	}

	// Admins can only remove regular members, not other admins
	if (actorRole === 'admin') {
		return targetRole === 'member';
	}

	// Regular members cannot remove anyone
	return false;
}

/**
 * Check if a user can change a member's role
 * Only owners can change roles
 * 
 * @param supabase - Supabase client
 * @param userId - ID of the user performing the action
 * @param teamId - ID of the team
 * @param targetUserId - ID of the user whose role is being changed
 * @param newRole - The new role to assign
 * @returns Whether the role change is allowed
 */
export async function canChangeRole(
	supabase: SupabaseClient,
	userId: string,
	teamId: string,
	targetUserId: string,
	newRole: TeamRole
): Promise<boolean> {
	const actorRole = await getUserRole(supabase, userId, teamId);

	// Only owners can change roles
	if (actorRole !== 'owner') {
		return false;
	}

	// Cannot change owner's role (must transfer ownership instead)
	const targetRole = await getUserRole(supabase, targetUserId, teamId);
	if (targetRole === 'owner') {
		return false;
	}

	// Cannot assign owner role (must transfer ownership instead)
	if (newRole === 'owner') {
		return false;
	}

	return true;
}
