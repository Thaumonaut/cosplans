import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();
	const code = url.searchParams.get('code');

	return {
		user,
		prefillCode: code || ''
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			// Redirect to login with return URL
			const formData = await request.formData();
			const code = formData.get('code')?.toString()?.toUpperCase().trim();
			throw redirect(303, `/login?redirect=/join${code ? `?code=${code}` : ''}`);
		}

		const formData = await request.formData();
		const code = formData.get('code')?.toString()?.toUpperCase().trim();

		if (!code || code.length !== 6) {
			return fail(400, { error: 'Please enter a valid 6-character join code' });
		}

		// Find join link by code
		const { data: joinLink, error: linkError } = await locals.supabase
			.from('team_join_links')
			.select(`
				*,
				teams!inner(id, name)
			`)
			.eq('code', code)
			.eq('is_active', true)
			.single();

		if (linkError || !joinLink) {
			return fail(404, { error: 'Invalid join code. Please check the code and try again.' });
		}

		// Check if expired
		if (joinLink.expires_at) {
			const expiresAt = new Date(joinLink.expires_at);
			if (expiresAt < new Date()) {
				return fail(400, { error: 'This join code has expired' });
			}
		}

		// Check max uses
		if (joinLink.max_uses && joinLink.current_uses >= joinLink.max_uses) {
			return fail(400, { error: 'This join code has reached its maximum number of uses' });
		}

		// Check if already a member
		const { data: existingMember } = await locals.supabase
			.from('team_members')
			.select('id')
			.eq('team_id', joinLink.team_id)
			.eq('user_id', user.id)
			.single();

		if (existingMember) {
			return fail(400, { error: `You are already a member of ${joinLink.teams.name}` });
		}

		// Add user to team (default role: member)
		const { error: memberError } = await locals.supabase.from('team_members').insert({
			team_id: joinLink.team_id,
			user_id: user.id,
			role: 'member', // Join codes always add as member
			joined_at: new Date().toISOString()
		});

		if (memberError) {
			console.error('Error adding team member:', memberError);
			return fail(500, { error: 'Failed to join team' });
		}

		// Increment use count
		await locals.supabase
			.from('team_join_links')
			.update({ current_uses: joinLink.current_uses + 1 })
			.eq('id', joinLink.id);

		// Redirect to team page
		throw redirect(303, `/teams/${joinLink.team_id}`);
	}
};
