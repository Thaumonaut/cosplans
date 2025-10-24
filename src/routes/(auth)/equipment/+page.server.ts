import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { equipmentService } from '$lib/server/resources/equipment-service';
import { getAdminClient } from '$lib/server/supabase/admin-client';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    return { error: 'Unauthorized', equipment: [], teams: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
  }

  // Get all teams the user belongs to
  const adminClient = getAdminClient();
  const { data: memberships } = await adminClient
    .from('team_members')
    .select('team_id, teams(id, name)')
    .eq('user_id', user.id);
  
  if (!memberships || memberships.length === 0) {
    return { error: 'No team found', equipment: [], teams: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
  }

  // Extract team IDs and team info
  const teamIds = memberships.map((m: any) => m.team_id);
  const teamsMap = new Map(memberships.map((m: any) => [m.team_id, m.teams]));

  console.log('[Equipment List] Loading for', teamIds.length, 'teams');

  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  // Get equipment from all user's teams
  const { data: allEquipment, error: equipmentError } = await adminClient
    .from('equipment')
    .select('*')
    .in('team_id', teamIds)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (equipmentError) {
    console.error('[Equipment List] Error:', equipmentError);
    return { error: equipmentError.message, equipment: [], teams: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
  }

  // Get total count
  const { count } = await adminClient
    .from('equipment')
    .select('*', { count: 'exact', head: true })
    .in('team_id', teamIds);
  
  console.log('[Equipment List] Found', count, 'items across all teams');

  // Add team info to each equipment
  const equipmentWithTeams = (allEquipment || []).map((eq: any) => ({
    ...eq,
    team: teamsMap.get(eq.team_id)
  }));

  return {
    equipment: equipmentWithTeams,
    teams: Array.from(teamsMap.values()),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
      totalItems: count || 0
    }
  };
};
