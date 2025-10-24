import { wigService } from '$lib/server/resources/wig-service';
import { characterService } from '$lib/server/resources/character-service';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.safeGetSession();
	
	if (!session?.user) {
		throw error(401, 'Unauthorized');
	}
	
	try {
		const [wigs, characters] = await Promise.all([
			wigService.list(),
			characterService.list()
		]);
		
		return {
			wigs,
			characters
		};
	} catch (err) {
		console.error('Error loading wigs:', err);
		throw error(500, 'Failed to load wigs');
	}
};

