import { wigService } from '$lib/server/resources/wig-service';
import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}
	
	// Get all teams the user belongs to (same pattern as costumes/characters page)
	const adminClient = getAdminClient();
	const { data: memberships } = await adminClient
		.from('team_members')
		.select('team_id, teams(id, name)')
		.eq('user_id', user.id);
	
	if (!memberships || memberships.length === 0) {
		return { 
			wigs: [],
			characters: [],
			error: 'No team found. Please create or join a team first.'
		};
	}
	
	// Extract team IDs
	const teamIds = memberships.map((m: any) => m.team_id);
	
	try {
		console.log('[Wigs] Loading for', teamIds.length, 'teams');
		
		// Get wigs and characters from all user's teams
		const [wigsResult, charactersResult] = await Promise.all([
			adminClient
				.from('wigs')
				.select('*')
				.in('team_id', teamIds)
				.order('created_at', { ascending: false }),
			adminClient
				.from('characters')
				.select('id, character_name, series')
				.in('team_id', teamIds)
				.order('character_name', { ascending: true })
		]);
		
		if (wigsResult.error) {
			console.error('[Wigs] Error:', wigsResult.error);
			throw error(500, `Failed to load wigs: ${wigsResult.error.message}`);
		}
		
		if (charactersResult.error) {
			console.error('[Wigs] Characters error:', charactersResult.error);
			// Non-fatal, continue without characters
		}
		
		console.log('[Wigs] Found', wigsResult.data?.length || 0, 'wigs');
		
		return {
			wigs: wigsResult.data || [],
			characters: charactersResult.data || []
		};
	} catch (err) {
		console.error('[Wigs] Error loading wigs:', err);
		throw error(500, `Failed to load wigs: ${err instanceof Error ? err.message : 'Unknown error'}`);
	}
};

