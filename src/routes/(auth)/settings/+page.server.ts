import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { TeamService } from '$lib/server/teams/team-service';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	// Get user's teams
	const teamService = new TeamService(locals.supabase);
	const { teams } = await teamService.getUserTeams(user.id);

	// Separate personal and public teams
	const personalTeam = teams.find((t) => t.is_personal);
	const publicTeams = teams.filter((t) => !t.is_personal);

	return {
		user,
		personalTeam,
		publicTeams
	};
};

export const actions: Actions = {
	createTeam: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString()?.trim() || '';
		const description = formData.get('description')?.toString()?.trim() || '';

		// Validate team name
		if (!name || name.length < 1 || name.length > 100) {
			return fail(400, {
				error: 'Team name must be between 1 and 100 characters',
				name,
				description
			});
		}

		// Create public team (isPersonal = false)
		const teamService = new TeamService(locals.supabase);
		const { team, error } = await teamService.createTeam(
			user.id,
			name,
			description || undefined,
			false // isPersonal = false (public team)
		);

		if (error || !team) {
			return fail(500, {
				error: error?.message || 'Failed to create team',
				name,
				description
			});
		}

		return {
			success: true,
			team: {
				id: team.id,
				name: team.name
			}
		};
	}
};
