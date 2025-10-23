import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { crewService } from '$lib/server/resources/crew-service';
import { getAdminClient } from '$lib/server/supabase/admin-client';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    throw redirect(303, '/login');
  }

  // Get team_id from URL or user's first team
  let teamId = url.searchParams.get('team_id');
  
  if (!teamId) {
    // Get user's teams
    const adminClient = getAdminClient();
    const { data: memberships } = await adminClient
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id)
      .limit(1);
    
    if (!memberships || memberships.length === 0) {
      throw error(400, 'You must be a member of a team to view crew members. Please create or join a team first.');
    }
    teamId = (memberships[0] as any).team_id;
  }

  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const role = url.searchParams.get('role') || undefined;
  const searchQuery = url.searchParams.get('q') || undefined;
  const showFavorites = url.searchParams.get('favorites') === 'true';
  const offset = (page - 1) * limit;

  try {
    const result = await crewService.search({
      team_id: teamId,
      query: searchQuery,
      role,
      is_favorite: showFavorites ? true : undefined,
      limit,
      offset
    });

    return {
      crewMembers: result.resources,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((result.total || 0) / limit),
        totalItems: result.total || 0,
        itemsPerPage: limit
      },
      filters: {
        role,
        searchQuery,
        showFavorites
      },
      teamId
    };
  } catch (err) {
    console.error('Error loading crew members:', err);
    throw error(500, 'Failed to load crew members');
  }
};
