/**
 * TeamService - Core team business logic
 * Handles team creation, retrieval, and management
 * 
 * Constitutional Requirements:
 * - Principle II.5: Every user MUST own at least one team
 * - Principle II: Real-time collaboration support
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Team, TeamMember, TeamWithMembers, TeamRole } from '$lib/types/teams';

export class TeamService {
	constructor(private supabase: SupabaseClient) {}

	/**
	 * Create a new team with the user as owner
	 * Automatically adds creator as team owner in team_members table
	 * 
	 * @param userId - ID of the user creating the team
	 * @param name - Team name (1-100 characters)
	 * @param description - Optional team description (0-500 characters)
	 * @returns Created team with member data
	 */
	async createTeam(
		userId: string,
		name: string,
		description?: string
	): Promise<{ team: Team; error: Error | null }> {
		// Validate inputs
		if (!name || name.length < 1 || name.length > 100) {
			return {
				team: null as any,
				error: new Error('Team name must be between 1 and 100 characters')
			};
		}

		if (description && description.length > 500) {
			return {
				team: null as any,
				error: new Error('Team description must be 500 characters or less')
			};
		}

		// Create team
		const { data: team, error: teamError } = await this.supabase
			.from('teams')
			.insert({
				name,
				description: description || null,
				owner_id: userId
			})
			.select()
			.single();

		if (teamError || !team) {
			return {
				team: null as any,
				error: teamError || new Error('Failed to create team')
			};
		}

		// Add creator as owner in team_members
		const { error: memberError } = await this.supabase.from('team_members').insert({
			team_id: team.id,
			user_id: userId,
			role: 'owner' as TeamRole,
			invited_by: null // Creator wasn't invited
		});

		if (memberError) {
			// Rollback: delete the team if member creation fails
			await this.supabase.from('teams').delete().eq('id', team.id);
			return {
				team: null as any,
				error: new Error('Failed to add user as team owner')
			};
		}

		return { team, error: null };
	}

	/**
	 * Get all teams the user is a member of
	 * Excludes archived teams by default
	 * 
	 * @param userId - ID of the user
	 * @param includeArchived - Whether to include archived teams
	 * @returns Array of teams with member counts and user's role
	 */
	async getUserTeams(
		userId: string,
		includeArchived = false
	): Promise<{ teams: TeamWithMembers[]; error: Error | null }> {
		// Get teams where user is a member
		let query = this.supabase
			.from('teams')
			.select(
				`
				*,
				members:team_members(*)
			`
			)
			.eq('team_members.user_id', userId);

		if (!includeArchived) {
			query = query.is('archived_at', null);
		}

		const { data: teams, error } = await query.order('created_at', { ascending: false });

		if (error) {
			return { teams: [], error };
		}

		// Transform to TeamWithMembers format
		const teamsWithMembers: TeamWithMembers[] = (teams || []).map((team: any) => {
			const userMember = team.members.find((m: TeamMember) => m.user_id === userId);
			return {
				...team,
				memberCount: team.members.length,
				userRole: userMember?.role || 'member'
			};
		});

		return { teams: teamsWithMembers, error: null };
	}

	/**
	 * Get a specific team by ID with member data
	 * User must be a member of the team (enforced by RLS)
	 * 
	 * @param teamId - ID of the team
	 * @param userId - ID of the requesting user
	 * @returns Team with members or null if not found/unauthorized
	 */
	async getTeamById(
		teamId: string,
		userId: string
	): Promise<{ team: TeamWithMembers | null; error: Error | null }> {
		const { data: team, error } = await this.supabase
			.from('teams')
			.select(
				`
				*,
				members:team_members(*)
			`
			)
			.eq('id', teamId)
			.single();

		if (error || !team) {
			return { team: null, error: error || new Error('Team not found') };
		}

		// Find user's role
		const userMember = team.members.find((m: TeamMember) => m.user_id === userId);
		if (!userMember) {
			return { team: null, error: new Error('User is not a member of this team') };
		}

		const teamWithMembers: TeamWithMembers = {
			...team,
			memberCount: team.members.length,
			userRole: userMember.role
		};

		return { team: teamWithMembers, error: null };
	}

	/**
	 * Check if a user can delete a team
	 * Constitutional requirement: Users must own at least one team
	 * 
	 * @param userId - ID of the user
	 * @param teamId - ID of the team to delete
	 * @returns Whether the team can be deleted
	 */
	async canDeleteTeam(userId: string, teamId: string): Promise<boolean> {
		// Check if user is the owner of this team
		const { data: team } = await this.supabase
			.from('teams')
			.select('owner_id')
			.eq('id', teamId)
			.single();

		if (!team || team.owner_id !== userId) {
			return false;
		}

		// Count how many teams the user owns
		const { data: ownedTeams } = await this.supabase
			.from('teams')
			.select('id')
			.eq('owner_id', userId)
			.is('archived_at', null);

		// User must own at least one team (constitutional requirement)
		// Can only delete if they own more than one team
		return (ownedTeams?.length || 0) > 1;
	}

	/**
	 * Soft delete a team (set archived_at timestamp)
	 * Validates constitutional requirement: user must own at least one team
	 * 
	 * @param userId - ID of the user
	 * @param teamId - ID of the team to delete
	 * @returns Success status
	 */
	async deleteTeam(
		userId: string,
		teamId: string
	): Promise<{ success: boolean; error: Error | null }> {
		// Check if deletion is allowed
		const canDelete = await this.canDeleteTeam(userId, teamId);
		if (!canDelete) {
			return {
				success: false,
				error: new Error(
					'Cannot delete team: You must own at least one team (constitutional requirement)'
				)
			};
		}

		// Soft delete by setting archived_at
		const { error } = await this.supabase
			.from('teams')
			.update({ archived_at: new Date().toISOString() })
			.eq('id', teamId)
			.eq('owner_id', userId);

		if (error) {
			return { success: false, error };
		}

		return { success: true, error: null };
	}

	/**
	 * Update team details (name, description, image)
	 * Only owner can update team details
	 * 
	 * @param userId - ID of the user
	 * @param teamId - ID of the team
	 * @param updates - Fields to update
	 * @returns Updated team
	 */
	async updateTeam(
		userId: string,
		teamId: string,
		updates: { name?: string; description?: string; image_url?: string }
	): Promise<{ team: Team | null; error: Error | null }> {
		// Validate inputs
		if (updates.name && (updates.name.length < 1 || updates.name.length > 100)) {
			return {
				team: null,
				error: new Error('Team name must be between 1 and 100 characters')
			};
		}

		if (updates.description && updates.description.length > 500) {
			return {
				team: null,
				error: new Error('Team description must be 500 characters or less')
			};
		}

		// Update team (RLS ensures only owner can update)
		const { data: team, error } = await this.supabase
			.from('teams')
			.update(updates)
			.eq('id', teamId)
			.eq('owner_id', userId)
			.select()
			.single();

		if (error || !team) {
			return { team: null, error: error || new Error('Failed to update team') };
		}

		return { team, error: null };
	}
}
