import { characterService } from '$lib/server/resources/character-service';
import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}
	
	// Get all teams the user belongs to (same pattern as costumes page)
	const adminClient = getAdminClient();
	const { data: memberships } = await adminClient
		.from('team_members')
		.select('team_id, teams(id, name)')
		.eq('user_id', user.id);
	
	if (!memberships || memberships.length === 0) {
		return { 
			characters: [],
			error: 'No team found. Please create or join a team first.'
		};
	}
	
	// Extract team IDs
	const teamIds = memberships.map((m: any) => m.team_id);
	
	try {
		console.log('[Characters] Loading for', teamIds.length, 'teams');
		
		// Get characters from all user's teams
		const { data: characters, error: charactersError } = await adminClient
			.from('characters')
			.select('*')
			.in('team_id', teamIds)
			.order('created_at', { ascending: false });
		
		if (charactersError) {
			console.error('[Characters] Error:', charactersError);
			throw error(500, `Failed to load characters: ${charactersError.message}`);
		}
		
		console.log('[Characters] Found', characters?.length || 0, 'characters');
		
		return {
			characters: characters || []
		};
	} catch (err) {
		console.error('[Characters] Error loading characters:', err);
		throw error(500, `Failed to load characters: ${err instanceof Error ? err.message : 'Unknown error'}`);
	}
};

