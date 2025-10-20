/**
 * Teams List Page - Server Loader
 * Task: T016
 * 
 * Loads all teams the user is a member of
 * Enforces authentication
 */

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { TeamService } from '$lib/server/teams/team-service';

export const load: PageServerLoad = async ({ locals }) => {
	// SECURITY: Use safeGetSession which validates JWT via getUser()
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/login');
	}

	const userId = user.id;
	const teamService = new TeamService(locals.supabase);

	// Get user's teams
	const { teams, error } = await teamService.getUserTeams(userId);

	if (error) {
		console.error('Failed to load teams:', error);
		return {
			teams: [],
			error: 'Failed to load teams. Please try again.'
		};
	}

	return {
		teams,
		error: null
	};
};
