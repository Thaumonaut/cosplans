/**
 * Team Join Service
 * Handles joining teams via join codes
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface JoinTeamResult {
	success: boolean;
	teamId?: string;
	teamName?: string;
	error?: string;
}

export class TeamJoinService {
	constructor(private supabase: SupabaseClient) {}

	/**
	 * Join a team using a join code
	 * @param userId - The user ID attempting to join
	 * @param code - The 6-character join code
	 * @returns Result object with success status and team info or error
	 */
	async joinTeamWithCode(userId: string, code: string): Promise<JoinTeamResult> {
		// Validate code format
		if (!code || code.length !== 6) {
			return {
				success: false,
				error: 'Please enter a valid 6-character join code'
			};
		}

		const normalizedCode = code.toUpperCase().trim();
		console.log('🔍 Attempting to join team with code:', normalizedCode);

		// Find join link by code
		const { data: joinLink, error: linkError } = await this.supabase
			.from('team_join_links')
			.select('*, teams(id, name)')
			.eq('code', normalizedCode)
			.eq('is_active', true)
			.single();

		if (linkError || !joinLink) {
			console.error('❌ Join link error:', linkError);
			return {
				success: false,
				error: 'Invalid join code. Please check the code and try again.'
			};
		}

		console.log('✅ Found join link:', joinLink);

		// Check if expired
		if (joinLink.expires_at) {
			const expiresAt = new Date(joinLink.expires_at);
			if (expiresAt < new Date()) {
				console.log('❌ Code expired');
				return {
					success: false,
					error: 'This join code has expired'
				};
			}
		}

		// Check max uses
		if (joinLink.max_uses && joinLink.current_uses >= joinLink.max_uses) {
			console.log('❌ Max uses reached');
			return {
				success: false,
				error: 'This join code has reached its maximum number of uses'
			};
		}

		// Check if already a member
		const { data: existingMember } = await this.supabase
			.from('team_members')
			.select('id')
			.eq('team_id', joinLink.team_id)
			.eq('user_id', userId)
			.single();

		if (existingMember) {
			console.log('❌ Already a member');
			const teamName = joinLink.teams?.name || 'this team';
			return {
				success: false,
				error: `You are already a member of ${teamName}`
			};
		}

		console.log('✅ All checks passed, adding to team...');

		// Add user to team
		const { error: memberError } = await this.supabase.from('team_members').insert({
			team_id: joinLink.team_id,
			user_id: userId,
			role: 'member',
			joined_at: new Date().toISOString()
		});

		if (memberError) {
			console.error('❌ Error adding member:', memberError);
			return {
				success: false,
				error: 'Failed to join team. Please try again.'
			};
		}

		// Increment use count
		await this.supabase
			.from('team_join_links')
			.update({ current_uses: joinLink.current_uses + 1 })
			.eq('id', joinLink.id);

		console.log('✅ Successfully joined team via code:', joinLink.team_id);

		return {
			success: true,
			teamId: joinLink.team_id,
			teamName: joinLink.teams?.name || 'Team'
		};
	}
}
