import { wigService } from '$lib/server/resources/wig-service';
import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { session, user } = await locals.safeGetSession();
	
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}
	
	// Verify user has access to this wig via team membership
	const adminClient = getAdminClient();
	const { data: wig, error: wigError } = await adminClient
		.from('wigs')
		.select(`
			*,
			teams!inner(id, name)
		`)
		.eq('id', params.id)
		.single();
	
	if (wigError || !wig) {
		console.error('[Wig Detail] Error:', wigError);
		throw error(404, 'Wig not found');
	}
	
	// Verify user is member of this wig's team
	const { data: membership } = await adminClient
		.from('team_members')
		.select('team_id')
		.eq('user_id', user.id)
		.eq('team_id', wig.team_id)
		.single();
	
	if (!membership) {
		throw error(403, 'You do not have access to this wig');
	}
	
	// Get all characters for linking
	const { data: characters } = await adminClient
		.from('characters')
		.select('id, character_name, series')
		.eq('team_id', wig.team_id)
		.order('character_name', { ascending: true });
	
	return {
		wig,
		characters: characters || []
	};
};

export const actions: Actions = {
	// Update wig fields
	update: async ({ request, params, locals }) => {
		const session = await locals.safeGetSession();
		
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		
		const formData = await request.formData();
		const updates: Record<string, any> = {};
		
		// Extract all form fields
		for (const [key, value] of formData.entries()) {
			if (value !== null && value !== undefined) {
				updates[key] = value.toString();
			}
		}
		
		try {
			await wigService.update(params.id, updates);
			return { success: true };
		} catch (err) {
			console.error('Error updating wig:', err);
			return fail(500, { error: 'Failed to update wig' });
		}
	},
	
	// Delete wig
	delete: async ({ params, locals }) => {
		const session = await locals.safeGetSession();
		
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		
		try {
			await wigService.delete(params.id);
		} catch (err) {
			console.error('Error deleting wig:', err);
			return fail(500, { error: 'Failed to delete wig' });
		}
		
		// Redirect to wigs overview after successful delete
		throw redirect(303, '/wigs');
	}
};

