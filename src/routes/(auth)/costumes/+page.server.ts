import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { costumeService } from '$lib/server/resources/costume-service';
import { getAdminClient } from '$lib/server/supabase/admin-client';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    return { error: 'Unauthorized', costumes: [], teams: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
  }

  // Get all teams the user belongs to
  const adminClient = getAdminClient();
  const { data: memberships } = await adminClient
    .from('team_members')
    .select('team_id, teams(id, name)')
    .eq('user_id', user.id);
  
  if (!memberships || memberships.length === 0) {
    return { error: 'No team found', costumes: [], teams: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
  }

  // Extract team IDs and team info
  const teamIds = memberships.map((m: any) => m.team_id);
  const teamsMap = new Map(memberships.map((m: any) => [m.team_id, m.teams]));

  // Get pagination parameters
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const status = url.searchParams.get('status') || undefined;
  const searchQuery = url.searchParams.get('q') || undefined;
  const offset = (page - 1) * limit;

  try {
    console.log('[Costumes] Loading for', teamIds.length, 'teams');
    
    // Get costumes from all user's teams with filters
    let query = adminClient
      .from('costumes')
      .select('*')
      .in('team_id', teamIds)
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,character_name.ilike.%${searchQuery}%,series.ilike.%${searchQuery}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: allCostumes, error: costumesError } = await query
      .range(offset, offset + limit - 1);

    if (costumesError) {
      console.error('[Costumes] Error:', costumesError);
      return { error: costumesError.message, costumes: [], teams: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
    }

    // Get total count with same filters
    let countQuery = adminClient
      .from('costumes')
      .select('*', { count: 'exact', head: true })
      .in('team_id', teamIds);
    
    if (searchQuery) {
      countQuery = countQuery.or(`name.ilike.%${searchQuery}%,character_name.ilike.%${searchQuery}%,series.ilike.%${searchQuery}%`);
    }
    if (status) {
      countQuery = countQuery.eq('status', status);
    }
    
    const { count } = await countQuery;
    
    console.log('[Costumes] Found', count, 'items across all teams');

    // Add team info to each costume
    const costumesWithTeams = (allCostumes || []).map((costume: any) => ({
      ...costume,
      team: teamsMap.get(costume.team_id)
    }));

    return {
      costumes: costumesWithTeams,
      teams: Array.from(teamsMap.values()),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit
      },
      filters: {
        status,
        searchQuery
      }
    };
  } catch (err) {
    console.error('[Costumes] Error loading costumes:', err);
    throw error(500, `Failed to load costumes: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};
