/**
 * Team Creation Page - Server Actions
 * Tasks: T018, T021, T022
 * 
 * Handles team creation with validation
 * Automatically assigns creator as owner (T022)
 */

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { TeamService } from '$lib/server/teams/team-service';

export const load: PageServerLoad = async ({ locals }) => {
	// SECURITY: Use safeGetSession which validates JWT via getUser()
	const { session, user } = await locals.safeGetSession();

	// If user is not authenticated, redirect to login
	if (!session || !user) {
		throw redirect(302, '/login');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// SECURITY: Use safeGetSession which validates JWT via getUser()
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'You must be logged in to create a team' });
		}

		const userId = user.id;
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const description = formData.get('description')?.toString().trim();

		// T021: Validation (name 1-100 chars, description 0-500 chars)
		if (!name) {
			return fail(400, { error: 'Team name is required' });
		}

		if (name.length < 1 || name.length > 100) {
			return fail(400, { error: 'Team name must be between 1 and 100 characters' });
		}

		if (description && description.length > 500) {
			return fail(400, { error: 'Team description must be 500 characters or less' });
		}

		const teamService = new TeamService(locals.supabase);

		// T022: Create team and automatically assign creator as owner
		const { team, error } = await teamService.createTeam(userId, name, description || undefined);

		if (error || !team) {
			console.error('Failed to create team:', error);
			return fail(500, { error: error?.message || 'Failed to create team. Please try again.' });
		}

		// Redirect to the newly created team
		throw redirect(303, `/teams/${team.id}`);
	}
};
