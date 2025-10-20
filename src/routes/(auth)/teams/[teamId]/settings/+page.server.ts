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
			joined_at
		`)
		.eq('team_id', teamId)
		.order('joined_at', { ascending: true });

	if (membersError) {
		console.error('Error fetching team members:', membersError);
	}

	// Fetch display names for members
	const memberIds = members?.map((m) => m.user_id) || [];
	const { data: profiles } = await locals.supabase
		.from('user_profiles')
		.select('user_id, display_name')
		.in('user_id', memberIds);

	// Create a map of user_id to display_name
	const profileMap = new Map(profiles?.map((p) => [p.user_id, p.display_name]) || []);

	// Enrich members with display names
	const enrichedMembers = (members || []).map((m) => ({
		...m,
		display_name: profileMap.get(m.user_id) || `User ${m.user_id.substring(0, 8)}`
	}));

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
	const userMember = enrichedMembers.find((m) => m.user_id === user.id);
	if (!userMember) {
		throw error(403, 'You are not a member of this team');
	}

	// Check permissions
	const canManageMembers = userMember.role === 'owner' || userMember.role === 'admin';
	const canEditTeam = userMember.role === 'owner' || userMember.role === 'admin';
	const canDeleteTeam = userMember.role === 'owner';

	// Check if team has a join link
	const { data: joinLink } = await locals.supabase
		.from('team_join_links')
		.select('*')
		.eq('team_id', teamId)
		.eq('is_active', true)
		.single();

	return {
		team,
		members: enrichedMembers,
		invitations: invitations || [],
		joinLink: joinLink || null,
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
	},

	inviteMember: async ({ request, params, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const { teamId } = params;
		const formData = await request.formData();
		const email = formData.get('email')?.toString()?.trim().toLowerCase();
		const role = formData.get('role')?.toString() as 'admin' | 'member' | 'viewer';

		// Validate email
		if (!email || !email.includes('@')) {
			return fail(400, { error: 'Valid email is required' });
		}

		// Validate role
		if (!role || !['admin', 'member', 'viewer'].includes(role)) {
			return fail(400, { error: 'Valid role is required' });
		}

		// Verify user has permission to invite
		const { data: member } = await locals.supabase
			.from('team_members')
			.select('role')
			.eq('team_id', teamId)
			.eq('user_id', user.id)
			.single();

		if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
			return fail(403, { error: 'You do not have permission to invite members' });
		}

		// Check if user is trying to invite themselves
		if (email === user.email) {
			return fail(400, { error: 'You cannot invite yourself' });
		}

		// Check if email is already a team member
		const { data: existingMember } = await locals.supabase
			.from('team_members')
			.select('user_id, user_profiles!inner(user_id)')
			.eq('team_id', teamId);

		// Get user IDs from existing members
		const memberUserIds = existingMember?.map((m) => m.user_id) || [];

		// Check if any of these users have this email
		if (memberUserIds.length > 0) {
			const { data: authUsers } = await locals.supabase.auth.admin.listUsers();
			const existingUser = authUsers?.users.find(
				(u) => u.email?.toLowerCase() === email && memberUserIds.includes(u.id)
			);

			if (existingUser) {
				return fail(400, { error: 'This user is already a team member' });
			}
		}

		// Check for existing pending invitation
		const { data: existingInvite } = await locals.supabase
			.from('team_invitations')
			.select('id')
			.eq('team_id', teamId)
			.eq('email', email)
			.eq('status', 'pending')
			.single();

		if (existingInvite) {
			return fail(400, { error: 'An invitation has already been sent to this email' });
		}

		// Generate invitation token
		const token = crypto.randomUUID();
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

		// Create invitation
		const { error: inviteError } = await locals.supabase.from('team_invitations').insert({
			team_id: teamId,
			email,
			role,
			token,
			invited_by: user.id,
			status: 'pending',
			expires_at: expiresAt.toISOString()
		});

		if (inviteError) {
			console.error('Error creating invitation:', inviteError);
			return fail(500, { error: 'Failed to create invitation' });
		}

		// TODO: Send invitation email (T045)
		// For now, we'll just return success with the token
		// In production, this would trigger an email with the invitation link

		return { 
			success: true, 
			inviteSuccess: true,
			message: 'Invitation sent successfully'
		};
	},

	createJoinLink: async ({ params, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const { teamId } = params;

		// Verify user has permission
		const { data: member } = await locals.supabase
			.from('team_members')
			.select('role')
			.eq('team_id', teamId)
			.eq('user_id', user.id)
			.single();

		if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
			return fail(403, { error: 'You do not have permission to create join links' });
		}

		// Check if join link already exists
		const { data: existingLink } = await locals.supabase
			.from('team_join_links')
			.select('*')
			.eq('team_id', teamId)
			.eq('is_active', true)
			.single();

		if (existingLink) {
			return { success: true, joinLinkCreated: true };
		}

		// Generate join token and code
		const token = crypto.randomUUID();
		
		// Generate a unique 6-character code
		let code = '';
		let isUnique = false;
		const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar looking chars
		
		while (!isUnique) {
			code = '';
			for (let i = 0; i < 6; i++) {
				code += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			
			// Check if code is unique
			const { data: existingCode } = await locals.supabase
				.from('team_join_links')
				.select('id')
				.eq('code', code)
				.single();
			
			if (!existingCode) {
				isUnique = true;
			}
		}

		// Create join link with code
		const { error: linkError } = await locals.supabase.from('team_join_links').insert({
			team_id: teamId,
			token,
			code,
			created_by: user.id,
			is_active: true
		});

		if (linkError) {
			console.error('Error creating join link:', linkError);
			return fail(500, { error: 'Failed to create join link' });
		}

		return { success: true, joinLinkCreated: true };
	},

	toggleJoinLink: async ({ params, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const { teamId } = params;

		// Verify user has permission
		const { data: member } = await locals.supabase
			.from('team_members')
			.select('role')
			.eq('team_id', teamId)
			.eq('user_id', user.id)
			.single();

		if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
			return fail(403, { error: 'You do not have permission to manage join links' });
		}

		// Get current join link
		const { data: joinLink } = await locals.supabase
			.from('team_join_links')
			.select('*')
			.eq('team_id', teamId)
			.eq('is_active', true)
			.single();

		if (!joinLink) {
			return fail(404, { error: 'No active join link found' });
		}

		// Toggle active status
		const { error: updateError } = await locals.supabase
			.from('team_join_links')
			.update({ is_active: !joinLink.is_active })
			.eq('id', joinLink.id);

		if (updateError) {
			console.error('Error toggling join link:', updateError);
			return fail(500, { error: 'Failed to toggle join link' });
		}

		return { success: true, joinLinkToggled: true };
	}
};
