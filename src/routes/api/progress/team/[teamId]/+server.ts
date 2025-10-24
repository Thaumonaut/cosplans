import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /api/progress/team/:teamId
 * Fetches aggregated progress data for all shoots in a team
 */
export const GET: RequestHandler = async ({ params, locals }) => {
  const { teamId } = params;

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    // Verify user has access to this team
    const { data: teamMember, error: memberError } = await locals.supabase
      .from('team_members')
      .select('team_id')
      .eq('team_id', teamId)
      .eq('user_id', locals.user.id)
      .single();

    if (memberError || !teamMember) {
      throw error(404, 'Team not found or access denied');
    }

    // Calculate progress for all shoots in the team
    const { data: shootsProgress, error: calcError } = await locals.supabase
      .rpc('calculate_team_progress', { p_team_id: teamId });

    if (calcError) {
      console.error('Error calculating team progress:', calcError);
      throw error(500, 'Failed to calculate team progress');
    }

    // If no shoots or data, return default structure
    if (!shootsProgress || shootsProgress.length === 0) {
      return json({
        overall_progress: 0,
        costume_progress: 0,
        props_progress: 0,
        location_progress: 0,
        team_progress: 0,
        checklist_progress: 0,
        editing_progress: 0,
        shoot_count: 0,
        outstanding_tasks: [],
        calculation_timestamp: new Date().toISOString(),
      });
    }

    // Aggregate progress across all shoots
    const aggregated = shootsProgress[0];
    const shootCount = shootsProgress.length;

    return json({
      overall_progress: Math.round(aggregated.avg_overall_progress || 0),
      costume_progress: Math.round(aggregated.avg_costume_progress || 0),
      props_progress: Math.round(aggregated.avg_props_progress || 0),
      location_progress: Math.round(aggregated.avg_location_progress || 0),
      team_progress: Math.round(aggregated.avg_team_progress || 0),
      checklist_progress: Math.round(aggregated.avg_checklist_progress || 0),
      editing_progress: Math.round(aggregated.avg_editing_progress || 0),
      shoot_count: shootCount,
      outstanding_tasks: [], // TODO: Aggregate from all shoots
      calculation_timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error fetching team progress:', err);
    throw error(500, 'Internal server error');
  }
};
