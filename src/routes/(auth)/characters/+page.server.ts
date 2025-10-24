import { characterService } from '$lib/server/resources/character-service';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.safeGetSession();
	
	if (!session?.user) {
		throw error(401, 'Unauthorized');
	}
	
	// Get user's current team
	const teamId = locals.teamId;
	
	if (!teamId) {
		throw error(400, 'No team selected');
	}
	
	try {
		// Fetch characters for the team
		const result = await characterService.list({
			team_id: teamId,
			limit: 100 // Show all characters on overview page
		});
		
		return {
			characters: result.resources,
			total: result.total
		};
	} catch (err) {
		console.error('Error loading characters:', err);
		throw error(500, 'Failed to load characters');
	}
};

