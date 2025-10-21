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
	const { data: teamMemberships, error: membershipsError} = await locals.supabase
		.from('team_members')
		.select(`
			team_id,
			role,
			teams (
				id,
				name,
				description,
				owner_id,
				is_personal,
				created_at
			)
		`)
		.eq('user_id', userId);

	if (membershipsError) {
		console.error('Error fetching team memberships:', membershipsError);
		throw error(500, 'Failed to load teams');
	}

	// Get member counts for each team
	const teamIds = (teamMemberships || []).map((m: any) => m.teams.id);
	const { data: memberCounts } = await locals.supabase
		.from('team_members')
		.select('team_id')
		.in('team_id', teamIds);

	const countMap = (memberCounts || []).reduce((acc: any, m: any) => {
		acc[m.team_id] = (acc[m.team_id] || 0) + 1;
		return acc;
	}, {});

	// Transform the data to a cleaner format
	const teams = (teamMemberships || []).map((membership: any) => ({
		id: membership.teams.id,
		name: membership.teams.name,
		description: membership.teams.description,
		owner_id: membership.teams.owner_id,
		is_personal: membership.teams.is_personal,
		role: membership.role,
		member_count: countMap[membership.teams.id] || 1,
		created_at: membership.teams.created_at
	}));

	// Sort: personal teams first, then public teams by name
	teams.sort((a: any, b: any) => {
		if (a.is_personal && !b.is_personal) return -1;
		if (!a.is_personal && b.is_personal) return 1;
		return a.name.localeCompare(b.name);
	});

	return json({ teams });
};
