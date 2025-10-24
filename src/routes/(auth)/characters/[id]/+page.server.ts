import { characterService } from '$lib/server/resources/character-service';
import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.safeGetSession();
	
	if (!session?.user) {
		throw error(401, 'Unauthorized');
	}
	
	try {
		const character = await characterService.getById(params.id);
		
		if (!character) {
			throw error(404, 'Character not found');
		}
		
		return {
			character
		};
	} catch (err) {
		console.error('Error loading character:', err);
		throw error(500, 'Failed to load character');
	}
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

