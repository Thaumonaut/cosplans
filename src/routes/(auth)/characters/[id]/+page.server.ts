import { characterService } from '$lib/server/resources/character-service';
import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { session, user } = await locals.safeGetSession();
	
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}
	
	// Verify user has access to this character via team membership
	const adminClient = getAdminClient();
	const { data: character, error: characterError } = await adminClient
		.from('characters')
		.select(`
			*,
			teams!inner(id, name)
		`)
		.eq('id', params.id)
		.single();
	
	if (characterError || !character) {
		console.error('[Character Detail] Error:', characterError);
		throw error(404, 'Character not found');
	}
	
	// Verify user is member of this character's team
	const { data: membership } = await adminClient
		.from('team_members')
		.select('team_id')
		.eq('user_id', user.id)
		.eq('team_id', character.team_id)
		.single();
	
	if (!membership) {
		throw error(403, 'You do not have access to this character');
	}
	
	return {
		character
	};
};

export const actions: Actions = {
	// Update character fields
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
			await characterService.update(params.id, updates);
			return { success: true };
		} catch (err) {
			console.error('Error updating character:', err);
			return fail(500, { error: 'Failed to update character' });
		}
	},
	
	// Delete character
	delete: async ({ params, locals }) => {
		const session = await locals.safeGetSession();
		
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		
		try {
			await characterService.delete(params.id);
		} catch (err) {
			console.error('Error deleting character:', err);
			return fail(500, { error: 'Failed to delete character' });
		}
		
		// Redirect to characters overview after successful delete
		throw redirect(303, '/characters');
	}
};

