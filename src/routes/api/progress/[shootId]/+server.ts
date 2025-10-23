import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /api/progress/:shootId
 * Fetches aggregated progress data for a specific shoot
 */
export const GET: RequestHandler = async ({ params, locals }) => {
  const { shootId } = params;
  
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    // Fetch shoot to verify access
    const { data: shoot, error: shootError } = await locals.supabase
      .from('shoots')
      .select('*, team_id')
      .eq('id', shootId)
      .single();

    if (shootError || !shoot) {
      throw error(404, 'Shoot not found');
    }

    // Check permissions
    if (locals.ability && !locals.ability.can('read', 'ProgressTracker')) {
      throw error(403, 'Forbidden');
    }

    // Calculate fresh progress data using optimized function
    const { data: freshProgress, error: calcError } = await locals.supabase
      .rpc('calculate_shoot_progress_optimized', { p_shoot_id: shootId });

    if (calcError) {
      console.error('Error calculating progress:', calcError);
      throw error(500, 'Failed to calculate progress');
    }

    // Update progress tracker with fresh data
    const { data: updatedProgress, error: updateError } = await locals.supabase
      .from('progress_trackers')
      .upsert({
        shoot_id: shootId,
        costume_progress: freshProgress[0]?.costume_progress || 0,
        props_progress: freshProgress[0]?.props_progress || 0,
        location_progress: freshProgress[0]?.location_progress || 0,
        team_progress: freshProgress[0]?.team_progress || 0,
        checklist_progress: freshProgress[0]?.checklist_progress || 0,
        editing_progress: freshProgress[0]?.editing_progress || 0,
        overall_progress: freshProgress[0]?.overall_progress || 0,
        calculation_timestamp: new Date().toISOString(),
      }, {
        onConflict: 'shoot_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (updateError) {
      console.error('Error updating progress tracker:', updateError);
      // Don't fail the request, just log the error
    }

    return json(updatedProgress || {
      shoot_id: shootId,
      costume_progress: freshProgress[0]?.costume_progress || 0,
      props_progress: freshProgress[0]?.props_progress || 0,
      location_progress: freshProgress[0]?.location_progress || 0,
      team_progress: freshProgress[0]?.team_progress || 0,
      checklist_progress: freshProgress[0]?.checklist_progress || 0,
      editing_progress: freshProgress[0]?.editing_progress || 0,
      overall_progress: freshProgress[0]?.overall_progress || 0,
      calculation_timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error fetching progress:', err);
    throw error(500, 'Internal server error');
  }
};

/**
 * POST /api/progress/:shootId/recalculate
 * Triggers progress recalculation for a shoot
 */
export const POST: RequestHandler = async ({ params, locals }) => {
  const { shootId } = params;
  
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    // Fetch shoot to verify access
    const { data: shoot, error: shootError } = await locals.supabase
      .from('shoots')
      .select('*, team_id')
      .eq('id', shootId)
      .single();

    if (shootError || !shoot) {
      throw error(404, 'Shoot not found');
    }

    // Check permissions
    if (locals.ability && !locals.ability.can('update', 'ProgressTracker')) {
      throw error(403, 'Forbidden');
    }

    // Calculate fresh progress using optimized function
    const { data: freshProgress, error: calcError } = await locals.supabase
      .rpc('calculate_shoot_progress_optimized', { p_shoot_id: shootId });

    if (calcError) {
      console.error('Error calculating progress:', calcError);
      throw error(500, 'Failed to calculate progress');
    }

    // Update progress tracker
    const { data: updatedProgress, error: updateError } = await locals.supabase
      .from('progress_trackers')
      .upsert({
        shoot_id: shootId,
        costume_progress: freshProgress[0]?.costume_progress || 0,
        props_progress: freshProgress[0]?.props_progress || 0,
        location_progress: freshProgress[0]?.location_progress || 0,
        team_progress: freshProgress[0]?.team_progress || 0,
        checklist_progress: freshProgress[0]?.checklist_progress || 0,
        editing_progress: freshProgress[0]?.editing_progress || 0,
        overall_progress: freshProgress[0]?.overall_progress || 0,
        calculation_timestamp: new Date().toISOString(),
      }, {
        onConflict: 'shoot_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (updateError) {
      console.error('Error updating progress tracker:', updateError);
      throw error(500, 'Failed to update progress');
    }

    return json(updatedProgress);
  } catch (err) {
    console.error('Error recalculating progress:', err);
    throw error(500, 'Internal server error');
  }
};
