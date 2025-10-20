/**
 * Teams API Endpoint
 * Returns all teams for the authenticated user
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	// SECURITY: Use safeGetSession which validates JWT via getUser()
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}

	const userId = user.id;

	// Fetch all teams where user is a member
	const { data: teamMemberships, error: membershipsError } = await locals.supabase
		.from('team_members')
		.select(`
			team_id,
			role,
			teams (
				id,
				name,
				description,
				owner_id,
				created_at
			)
		`)
		.eq('user_id', userId);

	if (membershipsError) {
		console.error('Error fetching team memberships:', membershipsError);
		throw error(500, 'Failed to load teams');
	}

	// Transform the data to a cleaner format
	const teams = (teamMemberships || []).map((membership: any) => ({
		id: membership.teams.id,
		name: membership.teams.name,
		description: membership.teams.description,
		owner_id: membership.teams.owner_id,
		role: membership.role,
		created_at: membership.teams.created_at
	}));

	return json({ teams });
};
