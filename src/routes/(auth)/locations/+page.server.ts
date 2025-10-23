import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { locationService } from '$lib/server/resources/location-service';
import { getAdminClient } from '$lib/server/supabase/admin-client';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) throw redirect(303, '/login');

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

  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const result = await locationService.search({ team_id: teamId, limit, offset });

  return {
    locations: result.resources,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil((result.total || 0) / limit),
      totalItems: result.total || 0
    }
  };
};
