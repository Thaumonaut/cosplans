import { characterService } from '$lib/server/resources/character-service';
import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	// Create new character
	create: async ({ request, locals }) => {
		const session = await locals.safeGetSession();
		
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		
		const formData = await request.formData();
		
		// Extract required fields
		const characterName = formData.get('character_name')?.toString();
		const series = formData.get('series')?.toString();
		
		// Validation
		if (!characterName || !characterName.trim()) {
			return fail(400, { error: 'Character name is required' });
		}
		if (!series || !series.trim()) {
			return fail(400, { error: 'Series is required' });
		}
		
		// Extract optional fields
		const sourceMedium = formData.get('source_medium')?.toString() || undefined;
		const aliases = formData.get('aliases')?.toString() || undefined;
		const appearanceDescription = formData.get('appearance_description')?.toString() || undefined;
		const personalityNotes = formData.get('personality_notes')?.toString() || undefined;
		const budgetMode = formData.get('budget_mode')?.toString() as 'personal' | 'commission' || 'personal';
		const budgetLimitStr = formData.get('budget_limit')?.toString();
		const budgetLimit = budgetLimitStr ? parseFloat(budgetLimitStr) : undefined;
		
		// Get user's first team (or default team) - same pattern as other pages
		const adminClient = getAdminClient();
		const { data: memberships } = await adminClient
			.from('team_members')
			.select('team_id')
			.eq('user_id', session.user.id)
			.limit(1)
			.single();
		
		if (!memberships) {
			return fail(400, { error: 'No team found. Please create or join a team first.' });
		}
		
		const teamId = memberships.team_id;
		
		try {
			// Check for duplicate (character_name + series combination)
			const duplicate = await characterService.findDuplicate(characterName, series, teamId);
			if (duplicate) {
				return fail(409, { 
					error: `Character "${characterName}" from "${series}" already exists` 
				});
			}
			
			// Create character
			const character = await characterService.create({
				team_id: teamId,
				character_name: characterName,
				series,
				source_medium: sourceMedium,
				aliases,
				appearance_description: appearanceDescription,
				personality_notes: personalityNotes,
				budget_mode: budgetMode,
				budget_limit: budgetLimit,
				reference_images: [],
				created_by: session.user.id
			});
			
			// Redirect to character detail page
			throw redirect(303, `/characters/${character.id}`);
		} catch (err: any) {
			// If it's a redirect, re-throw it
			if (err.status === 303) {
				throw err;
			}
			
			console.error('Error creating character:', err);
			return fail(500, { 
				error: err.message || 'Failed to create character. Please try again.' 
			});
		}
	}
};

