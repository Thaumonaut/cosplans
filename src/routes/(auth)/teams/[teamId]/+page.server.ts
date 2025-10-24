import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { TeamJoinService } from '$lib/server/teams/join-service';
import { TeamService } from '$lib/server/teams/team-service';
import { getAdminClient } from '$lib/server/supabase/admin-client';

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
		// Team not found or user doesn't have access - redirect to personal team
		const { data: personalTeam } = await locals.supabase
			.from('teams')
			.select('id')
			.eq('owner_id', user.id)
			.eq('is_personal', true)
			.single();

		if (personalTeam) {
			throw redirect(303, `/teams/${personalTeam.id}`);
		}

		// Fallback to dashboard
		throw redirect(303, '/dashboard');
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

	// Create a map of user_id to display_name from profiles
	const profileMap = new Map(profiles?.map((p) => [p.user_id, p.display_name]) || []);

	// Get admin client once for all lookups
	const adminClient = getAdminClient();

	// Enrich members with display names and emails using full fallback chain
	const enrichedMembers = await Promise.all(
		(members || []).map(async (m) => {
			let displayName = profileMap.get(m.user_id);
			let email = '';

			// Use admin client for auth fallback
			const { data: { user: authUser } } = await adminClient.auth.admin.getUserById(m.user_id);

			if (authUser) {
				// Always get email from auth
				email = authUser.email || '';

				// If no display name in profile (null, undefined, or empty), use fallback chain
				if (!displayName || (typeof displayName === 'string' && displayName.trim() === '')) {
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
			}

			// Last resort: user ID (should never happen if auth user exists)
			if (!displayName) {
				displayName = `User ${m.user_id.substring(0, 8)}`;
			}

			return {
				...m,
				display_name: displayName,
				email: email
			};
		})
	);

	// Sort members by role hierarchy: owner -> admin -> member -> viewer
	const roleOrder = { owner: 0, admin: 1, member: 2, viewer: 3 };
	enrichedMembers.sort((a, b) => {
		const aOrder = roleOrder[a.role as keyof typeof roleOrder] ?? 999;
		const bOrder = roleOrder[b.role as keyof typeof roleOrder] ?? 999;
		if (aOrder !== bOrder) {
			return aOrder - bOrder;
		}
		// If same role, sort alphabetically by display name
		return (a.display_name || '').localeCompare(b.display_name || '');
	});

	// Fetch pending invitations (where accepted_at is NULL)
	const { data: invitations, error: invitationsError } = await locals.supabase
		.from('team_invitations')
		.select('*')
		.eq('team_id', teamId)
		.is('accepted_at', null)
		.order('created_at', { ascending: false });

	if (invitationsError) {
		console.error('Error fetching invitations:', invitationsError);
	}

	// Check user's role in this team
	const userMember = enrichedMembers.find((m) => m.user_id === user.id);
	if (!userMember) {
		// User is not a member - redirect to their personal team
		const { data: personalTeam } = await locals.supabase
			.from('teams')
			.select('id')
			.eq('owner_id', user.id)
			.eq('is_personal', true)
			.single();

		if (personalTeam) {
			throw redirect(303, `/teams/${personalTeam.id}`);
		}

		// Fallback if no personal team found (shouldn't happen)
		throw redirect(303, '/dashboard');
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
			return fail(400, { error: 'Team name is required', action: 'updateTeam' });
		}

		if (name.length > 100) {
			return fail(400, { error: 'Team name must be 100 characters or less', action: 'updateTeam' });
		}

		if (description && description.length > 500) {
			return fail(400, { error: 'Description must be 500 characters or less', action: 'updateTeam' });
		}

		// Verify user has permission
		const { data: member } = await locals.supabase
			.from('team_members')
			.select('role')
			.eq('team_id', teamId)
			.eq('user_id', user.id)
			.single();

		if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
			return fail(403, { error: 'You do not have permission to edit this team', action: 'updateTeam' });
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
			return fail(500, { error: 'Failed to update team', action: 'updateTeam' });
		}

		return { success: true, action: 'updateTeam' };
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
	},

	joinTeamWithCode: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const code = formData.get('code')?.toString()?.trim() || '';

		const joinService = new TeamJoinService(locals.supabase);
		const result = await joinService.joinTeamWithCode(user.id, code);

		if (!result.success) {
			return fail(400, { error: result.error, action: 'joinTeamWithCode' });
		}

		// Return success with team info - let user choose whether to switch
		return {
			success: true,
			action: 'joinTeamWithCode',
			joinedTeam: {
				id: result.teamId,
				name: result.teamName
			}
		};
	},

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
				action: 'createTeam',
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
				action: 'createTeam',
				name,
				description
			});
		}

		return {
			success: true,
			action: 'createTeam',
			team: {
				id: team.id,
				name: team.name,
				joinCode: (team as any).joinCode // Join code from TeamService
			}
		};
	},

	updateMemberRole: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user) {
			throw redirect(303, '/login');
		}

		const { teamId } = params;
		const formData = await request.formData();
		const userId = formData.get('userId')?.toString();
		const newRole = formData.get('role')?.toString();

		if (!userId || !newRole) {
			return fail(400, { error: 'Missing required fields' });
		}

		// Validate role
		if (!['owner', 'admin', 'member', 'viewer'].includes(newRole)) {
			return fail(400, { error: 'Invalid role' });
		}

		// Check if user has permission (must be owner or admin)
		const { data: membership } = await locals.supabase
			.from('team_members')
			.select('role')
			.eq('team_id', teamId)
			.eq('user_id', user.id)
			.single();

		if (!membership || !['owner', 'admin'].includes(membership.role)) {
			return fail(403, { error: 'You do not have permission to change roles' });
		}

		// Cannot change owner role
		if (newRole === 'owner') {
			return fail(400, { error: 'Cannot change to owner role. Use ownership transfer instead.' });
		}

		// Cannot change your own role
		if (userId === user.id) {
			return fail(400, { error: 'Cannot change your own role' });
		}

		// Admins cannot change other admins (only owner can)
		if (membership.role === 'admin') {
			const { data: targetMember } = await locals.supabase
				.from('team_members')
				.select('role')
				.eq('team_id', teamId)
				.eq('user_id', userId)
				.single();

			if (targetMember?.role === 'admin' || newRole === 'admin') {
				return fail(403, { error: 'Only the owner can change admin roles' });
			}
		}

		// Update the role
		const { error } = await locals.supabase
			.from('team_members')
			.update({ role: newRole })
			.eq('team_id', teamId)
			.eq('user_id', userId);

		if (error) {
			return fail(500, { error: 'Failed to update role' });
		}

		return { roleUpdateSuccess: true, action: 'updateMemberRole' };
	},

	removeMember: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user) {
			throw redirect(303, '/login');
		}

		const { teamId } = params;
		const formData = await request.formData();
		const userId = formData.get('userId')?.toString();

		if (!userId) {
			return fail(400, { error: 'Missing user ID' });
		}

		// Check if user has permission (must be owner or admin)
		const { data: membership } = await locals.supabase
			.from('team_members')
			.select('role')
			.eq('team_id', teamId)
			.eq('user_id', user.id)
			.single();

		if (!membership || !['owner', 'admin'].includes(membership.role)) {
			return fail(403, { error: 'You do not have permission to remove members' });
		}

		// Cannot remove the owner
		const { data: targetMember } = await locals.supabase
			.from('team_members')
			.select('role')
			.eq('team_id', teamId)
			.eq('user_id', userId)
			.single();

		if (targetMember?.role === 'owner') {
			return fail(400, { error: 'Cannot remove the owner. Transfer ownership first.' });
		}

		// Remove the member
		const { error } = await locals.supabase
			.from('team_members')
			.delete()
			.eq('team_id', teamId)
			.eq('user_id', userId);

		if (error) {
			return fail(500, { error: 'Failed to remove member' });
		}

		return { removeMemberSuccess: true, action: 'removeMember' };
	},

	leaveTeam: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user) {
			throw redirect(303, '/login');
		}

		const { teamId } = params;

		// Check if this is a personal team
		const { data: team } = await locals.supabase
			.from('teams')
			.select('is_personal, owner_id')
			.eq('id', teamId)
			.single();

		if (team?.is_personal) {
			return fail(400, { error: 'Cannot leave personal teams' });
		}

		// Check if user is the owner
		if (team?.owner_id === user.id) {
			return fail(400, { error: 'Owners must transfer ownership before leaving the team' });
		}

		// Remove user from team
		const { error } = await locals.supabase
			.from('team_members')
			.delete()
			.eq('team_id', teamId)
			.eq('user_id', user.id);

		if (error) {
			return fail(500, { error: 'Failed to leave team' });
		}

		// Check if team is now empty and delete if so
		const { data: remainingMembers } = await locals.supabase
			.from('team_members')
			.select('user_id')
			.eq('team_id', teamId);

		if (!remainingMembers || remainingMembers.length === 0) {
			await locals.supabase
				.from('teams')
				.delete()
				.eq('id', teamId);
		}

		// Redirect to user's personal team or dashboard
		const { data: personalTeam } = await locals.supabase
			.from('teams')
			.select('id')
			.eq('owner_id', user.id)
			.eq('is_personal', true)
			.single();

		if (personalTeam) {
			throw redirect(303, `/teams/${personalTeam.id}`);
		}

		throw redirect(303, '/dashboard');
	},

	transferOwnership: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user) {
			throw redirect(303, '/login');
		}

		const { teamId } = params;
		const formData = await request.formData();
		const newOwnerId = formData.get('newOwnerId')?.toString();

		if (!newOwnerId) {
			return fail(400, { error: 'Must select a new owner', action: 'transferOwnership' });
		}

		// Check if current user is the owner
		const { data: team } = await locals.supabase
			.from('teams')
			.select('owner_id, is_personal')
			.eq('id', teamId)
			.single();

		if (!team) {
			return fail(404, { error: 'Team not found', action: 'transferOwnership' });
		}

		if (team.owner_id !== user.id) {
			return fail(403, { error: 'Only the owner can transfer ownership', action: 'transferOwnership' });
		}

		if (team.is_personal) {
			return fail(400, { error: 'Cannot transfer ownership of personal teams', action: 'transferOwnership' });
		}

		// Verify new owner is a member of the team
		const { data: newOwnerMembership } = await locals.supabase
			.from('team_members')
			.select('user_id, role')
			.eq('team_id', teamId)
			.eq('user_id', newOwnerId)
			.single();

		if (!newOwnerMembership) {
			return fail(400, { error: 'New owner must be a member of the team', action: 'transferOwnership' });
		}

		// Start transaction: update team owner and update roles
		// 1. Update team owner
		const { error: teamError } = await locals.supabase
			.from('teams')
			.update({ owner_id: newOwnerId })
			.eq('id', teamId);

		if (teamError) {
			console.error('Transfer ownership - team update error:', teamError);
			return fail(500, { error: 'Failed to transfer ownership', action: 'transferOwnership' });
		}

		// 2. Update new owner's role to owner
		const { error: newOwnerError } = await locals.supabase
			.from('team_members')
			.update({ role: 'owner' })
			.eq('team_id', teamId)
			.eq('user_id', newOwnerId);

		if (newOwnerError) {
			console.error('Transfer ownership - new owner role update error:', newOwnerError);
			// Rollback team owner change
			await locals.supabase
				.from('teams')
				.update({ owner_id: user.id })
				.eq('id', teamId);
			return fail(500, { error: 'Failed to update new owner role', action: 'transferOwnership' });
		}

		// 3. Update previous owner's role to admin
		const { error: prevOwnerError } = await locals.supabase
			.from('team_members')
			.update({ role: 'admin' })
			.eq('team_id', teamId)
			.eq('user_id', user.id);

		if (prevOwnerError) {
			console.error('Failed to update previous owner role:', prevOwnerError);
			// Don't fail the whole operation, just log it
		}

		return { transferOwnershipSuccess: true, action: 'transferOwnership' };
	},

	deleteTeam: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user) {
			throw redirect(303, '/login');
		}

		const { teamId } = params;

		// Check if user is the owner
		const { data: team } = await locals.supabase
			.from('teams')
			.select('owner_id, is_personal, name')
			.eq('id', teamId)
			.single();

		if (!team) {
			return fail(404, { error: 'Team not found', action: 'deleteTeam' });
		}

		if (team.owner_id !== user.id) {
			return fail(403, { error: 'Only the owner can delete the team', action: 'deleteTeam' });
		}

		if (team.is_personal) {
			return fail(400, { error: 'Cannot delete personal teams', action: 'deleteTeam' });
		}

		// Delete the team (cascade will handle team_members, invitations, etc.)
		const { error: deleteError } = await locals.supabase
			.from('teams')
			.delete()
			.eq('id', teamId);

		if (deleteError) {
			console.error('Delete team error:', deleteError);
			return fail(500, { error: 'Failed to delete team', action: 'deleteTeam' });
		}

		// Redirect to personal team
		const { data: personalTeam } = await locals.supabase
			.from('teams')
			.select('id')
			.eq('owner_id', user.id)
			.eq('is_personal', true)
			.single();

		if (personalTeam) {
			throw redirect(303, `/teams/${personalTeam.id}`);
		}

		throw redirect(303, '/dashboard');
	}
};
