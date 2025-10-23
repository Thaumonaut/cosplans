import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { costumeService } from '$lib/server/resources/costume-service';
import { getAdminClient } from '$lib/server/supabase/admin-client';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    throw redirect(303, '/login');
  }

  let teamId = url.searchParams.get('team_id');
  
  if (!teamId) {
    const adminClient = getAdminClient();
    const { data: memberships } = await adminClient
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id)
      .limit(1);
    
    if (!memberships || memberships.length === 0) {
      throw error(400, 'You must be a member of a team. Please create or join a team first.');
    }
    teamId = (memberships[0] as any).team_id;
  }

  // Get pagination parameters
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const status = url.searchParams.get('status') || undefined;
  const searchQuery = url.searchParams.get('q') || undefined;
  const offset = (page - 1) * limit;

  try {
    console.log('[Costumes] Searching with params:', { team_id: teamId, query: searchQuery, status, limit, offset });
    
    // Fetch costumes with pagination and filters
    const result = await costumeService.search({
      team_id: teamId,
      query: searchQuery,
      status,
      limit,
      offset
    });

    console.log('[Costumes] Search result:', { count: result.resources.length, total: result.total });

    return {
      costumes: result.resources,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((result.total || 0) / limit),
        totalItems: result.total || 0,
        itemsPerPage: limit
      },
      filters: {
        status,
        searchQuery
      },
      teamId
    };
  } catch (err) {
    console.error('[Costumes] Error loading costumes:', err);
    console.error('[Costumes] Error details:', JSON.stringify(err, null, 2));
    throw error(500, `Failed to load costumes: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};
