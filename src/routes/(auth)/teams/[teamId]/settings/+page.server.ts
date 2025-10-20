import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	const { teamId } = params;

	// Fetch team details
	const { data: team, error: teamError } = await locals.supabase
		.from('teams')
		.select('*')
		.eq('id', teamId)
		.single();

	if (teamError || !team) {
		throw error(404, 'Team not found');
	}

	// Fetch team members with user profiles
	const { data: members, error: membersError } = await locals.supabase
		.from('team_members')
		.select(`
			user_id,
			role,
			joined_at,
			user_profiles!inner(display_name)
		`)
		.eq('team_id', teamId)
		.order('joined_at', { ascending: true });

	if (membersError) {
		console.error('Error fetching team members:', membersError);
	}

	// Fetch pending invitations
	const { data: invitations, error: invitationsError } = await locals.supabase
		.from('team_invitations')
		.select('*')
		.eq('team_id', teamId)
		.eq('status', 'pending')
		.order('created_at', { ascending: false });

	if (invitationsError) {
		console.error('Error fetching invitations:', invitationsError);
	}

	// Check user's role in this team
	const userMember = members?.find((m) => m.user_id === user.id);
	if (!userMember) {
		throw error(403, 'You are not a member of this team');
	}

	// Check permissions
	const canManageMembers = userMember.role === 'owner' || userMember.role === 'admin';
	const canEditTeam = userMember.role === 'owner' || userMember.role === 'admin';
	const canDeleteTeam = userMember.role === 'owner';

	return {
		team,
		members: members || [],
		invitations: invitations || [],
		userRole: userMember.role,
		permissions: {
			canManageMembers,
			canEditTeam,
			canDeleteTeam
		}
	};
};

export const actions: Actions = {
	updateTeam: async ({ request, params, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const { teamId } = params;
		const formData = await request.formData();
		const name = formData.get('name')?.toString();
		const description = formData.get('description')?.toString();

		if (!name || name.trim().length === 0) {
			return fail(400, { error: 'Team name is required' });
		}

		if (name.length > 100) {
			return fail(400, { error: 'Team name must be 100 characters or less' });
		}

		if (description && description.length > 500) {
			return fail(400, { error: 'Description must be 500 characters or less' });
		}

		// Verify user has permission
		const { data: member } = await locals.supabase
			.from('team_members')
			.select('role')
			.eq('team_id', teamId)
			.eq('user_id', user.id)
			.single();

		if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
			return fail(403, { error: 'You do not have permission to edit this team' });
		}

		// Update team
		const { error: updateError } = await locals.supabase
			.from('teams')
			.update({
				name: name.trim(),
				description: description?.trim() || null,
				updated_at: new Date().toISOString()
			})
			.eq('id', teamId);

		if (updateError) {
			console.error('Error updating team:', updateError);
			return fail(500, { error: 'Failed to update team' });
		}

		return { success: true };
	}
};
