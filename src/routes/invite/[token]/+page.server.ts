import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { token } = params;

	// Fetch invitation by token
	const { data: invitation, error: inviteError } = await locals.supabase
		.from('team_invitations')
		.select(`
			*,
			teams!inner(id, name, description)
		`)
		.eq('token', token)
		.single();

	if (inviteError || !invitation) {
		throw error(404, 'Invitation not found');
	}

	// Check if invitation is expired
	const expiresAt = new Date(invitation.expires_at);
	if (expiresAt < new Date()) {
		return {
			invitation,
			expired: true
		};
	}

	// Check if invitation is already accepted or rejected
	if (invitation.status !== 'pending') {
		return {
			invitation,
			alreadyProcessed: true,
			status: invitation.status
		};
	}

	// Check if user is logged in
	const { user } = await locals.safeGetSession();

	// If logged in, check if email matches
	if (user) {
		const emailMatches = user.email?.toLowerCase() === invitation.email.toLowerCase();
		
		// Check if already a member
		const { data: existingMember } = await locals.supabase
			.from('team_members')
			.select('id')
			.eq('team_id', invitation.team_id)
			.eq('user_id', user.id)
			.single();

		return {
			invitation,
			user,
			emailMatches,
			alreadyMember: !!existingMember
		};
	}

	return {
		invitation
	};
};

export const actions: Actions = {
	accept: async ({ params, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			// Redirect to login with return URL
			throw redirect(303, `/login?redirect=/invite/${params.token}`);
		}

		const { token } = params;

		// Fetch invitation
		const { data: invitation, error: inviteError } = await locals.supabase
			.from('team_invitations')
			.select('*')
			.eq('token', token)
			.single();

		if (inviteError || !invitation) {
			return fail(404, { error: 'Invitation not found' });
		}

		// Check if expired
		const expiresAt = new Date(invitation.expires_at);
		if (expiresAt < new Date()) {
			return fail(400, { error: 'This invitation has expired' });
		}

		// Check if already processed
		if (invitation.status !== 'pending') {
			return fail(400, { error: 'This invitation has already been processed' });
		}

		// Check if email matches
		if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
			return fail(403, { 
				error: `This invitation was sent to ${invitation.email}. Please log in with that email address.` 
			});
		}

		// Check if already a member
		const { data: existingMember } = await locals.supabase
			.from('team_members')
			.select('id')
			.eq('team_id', invitation.team_id)
			.eq('user_id', user.id)
			.single();

		if (existingMember) {
			// Update invitation status
			await locals.supabase
				.from('team_invitations')
				.update({ status: 'accepted', accepted_at: new Date().toISOString() })
				.eq('id', invitation.id);

			return fail(400, { error: 'You are already a member of this team' });
		}

		// Add user to team
		const { error: memberError } = await locals.supabase.from('team_members').insert({
			team_id: invitation.team_id,
			user_id: user.id,
			role: invitation.role,
			joined_at: new Date().toISOString()
		});

		if (memberError) {
			console.error('Error adding team member:', memberError);
			return fail(500, { error: 'Failed to join team' });
		}

		// Update invitation status
		const { error: updateError } = await locals.supabase
			.from('team_invitations')
			.update({ 
				status: 'accepted', 
				accepted_at: new Date().toISOString() 
			})
			.eq('id', invitation.id);

		if (updateError) {
			console.error('Error updating invitation:', updateError);
		}

		// Redirect to team page
		throw redirect(303, `/teams/${invitation.team_id}`);
	},

	decline: async ({ params, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			return fail(401, { error: 'You must be logged in to decline an invitation' });
		}

		const { token } = params;

		// Fetch invitation
		const { data: invitation, error: inviteError } = await locals.supabase
			.from('team_invitations')
			.select('*')
			.eq('token', token)
			.single();

		if (inviteError || !invitation) {
			return fail(404, { error: 'Invitation not found' });
		}

		// Check if email matches
		if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
			return fail(403, { 
				error: `This invitation was sent to ${invitation.email}` 
			});
		}

		// Update invitation status
		const { error: updateError } = await locals.supabase
			.from('team_invitations')
			.update({ 
				status: 'rejected', 
				accepted_at: new Date().toISOString() 
			})
			.eq('id', invitation.id);

		if (updateError) {
			console.error('Error declining invitation:', updateError);
			return fail(500, { error: 'Failed to decline invitation' });
		}

		// Redirect to dashboard
		throw redirect(303, '/dashboard');
	}
};
