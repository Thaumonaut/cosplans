/**
 * Team Details Page - Server Logic
 * Task: T020
 * 
 * Loads team details, members, and user permissions
 */

import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	// SECURITY: Use safeGetSession which validates JWT via getUser()
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/login');
	}

	const { teamId } = params;
	const userId = user.id;

	// Fetch team details
	const { data: team, error: teamError } = await locals.supabase
		.from('teams')
		.select('*')
		.eq('id', teamId)
		.single();

	if (teamError || !team) {
		console.error('Team not found:', teamError);
		throw error(404, 'Team not found');
	}

	// Fetch team members
	const { data: members, error: membersError } = await locals.supabase
		.from('team_members')
		.select('user_id, role, joined_at')
		.eq('team_id', teamId)
		.order('joined_at', { ascending: true });

	if (membersError) {
		console.error('Error fetching team members:', membersError);
		throw error(500, 'Failed to load team members');
	}

	// Get current user's role in this team
	const currentUserMember = members?.find(m => m.user_id === userId);
	const userRole = currentUserMember?.role || null;

	// Check if user is a member of this team
	if (!userRole) {
		throw error(403, 'You are not a member of this team');
	}

	// Determine permissions based on role
	const canManageMembers = userRole === 'owner' || userRole === 'admin';
	const canEditTeam = userRole === 'owner' || userRole === 'admin';
	const canDeleteTeam = userRole === 'owner';

	return {
		team,
		members: members || [],
		userRole,
		permissions: {
			canManageMembers,
			canEditTeam,
			canDeleteTeam
		}
	};
};
