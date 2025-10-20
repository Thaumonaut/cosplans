/**
 * Team Details Page - Server Logic
 * Task: T020
 * 
 * Loads team details, members, and user permissions
 */

import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAdminClient } from '$lib/server/supabase/admin-client';

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

	// Fetch user display names from user_profiles
	const userIds = members?.map(m => m.user_id) || [];
	const { data: profiles } = await locals.supabase
		.from('user_profiles')
		.select('id, display_name')
		.in('id', userIds);
	
	// Create a map of user_id to display_name for quick lookup
	const profileMap = new Map(
		profiles?.map(p => [p.id, p.display_name]) || []
	);

	// Enrich members with display names with full fallback chain
	const enrichedMembers = await Promise.all(
		(members || []).map(async (m) => {
			let displayName = profileMap.get(m.user_id);
			
			// Always fetch auth user for fallback chain using admin client
			const adminClient = getAdminClient();
			const { data: { user: authUser } } = await adminClient.auth.admin.getUserById(m.user_id);
			
			// If no display name in profile (null, undefined, or empty), use fallback chain
			if (!displayName || (typeof displayName === 'string' && displayName.trim() === '')) {
				if (authUser) {
					// Try full_name from metadata
					displayName = authUser.user_metadata?.full_name || authUser.user_metadata?.name;
					
					// Try first_name + last_name
					if (!displayName) {
						const firstName = authUser.user_metadata?.first_name || authUser.user_metadata?.firstName || '';
						const lastName = authUser.user_metadata?.last_name || authUser.user_metadata?.lastName || '';
						const fullName = `${firstName} ${lastName}`.trim();
						if (fullName) {
							displayName = fullName;
						}
					}
					
					// Fall back to email (should always exist)
					if (!displayName) {
						displayName = authUser.email;
					}
				}
				
				// Last resort: user ID (should never happen if auth user exists)
				if (!displayName) {
					displayName = `User ${m.user_id.substring(0, 8)}`;
				}
			}
			
			return {
				...m,
				displayName
			};
		})
	);

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
		members: enrichedMembers,
		userRole,
		permissions: {
			canManageMembers,
			canEditTeam,
			canDeleteTeam
		}
	};
};
