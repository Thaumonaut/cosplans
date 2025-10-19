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

    // Fetch progress tracker data
    const { data: progressData, error: progressError } = await locals.supabase
      .from('progress_trackers')
      .select('*')
      .eq('shoot_id', shootId)
      .single();

    if (progressError) {
      // If no progress tracker exists, create one with default values
      const { data: newProgress, error: createError } = await locals.supabase
        .from('progress_trackers')
        .insert({
          shoot_id: shootId,
          costume_progress: 0,
          props_progress: 0,
          location_progress: 0,
          team_progress: 0,
          checklist_progress: 0,
          editing_progress: 0,
          overall_progress: 0,
          outstanding_tasks: []
        })
        .select()
        .single();

      if (createError) {
        throw error(500, 'Failed to create progress tracker');
      }

      return json(newProgress);
    }

    return json(progressData);
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

    // Calculate progress from various sources
    // TODO: Implement actual calculation logic from related entities
    
    // For now, fetch current data and return it
    const { data: progressData, error: progressError } = await locals.supabase
      .from('progress_trackers')
      .select('*')
      .eq('shoot_id', shootId)
      .single();

    if (progressError) {
      throw error(404, 'Progress tracker not found');
    }

    // Calculate overall progress as weighted average
    const categories = [
      progressData.costume_progress,
      progressData.props_progress,
      progressData.location_progress,
      progressData.team_progress,
      progressData.checklist_progress,
      progressData.editing_progress
    ];
    
    const overall = Math.round(
      categories.reduce((sum, val) => sum + val, 0) / categories.length
    );

    // Update overall progress
    const { data: updated, error: updateError } = await locals.supabase
      .from('progress_trackers')
      .update({
        overall_progress: overall,
        calculation_timestamp: new Date().toISOString()
      })
      .eq('shoot_id', shootId)
      .select()
      .single();

    if (updateError) {
      throw error(500, 'Failed to update progress');
    }

    return json(updated);
  } catch (err) {
    console.error('Error recalculating progress:', err);
    throw error(500, 'Internal server error');
  }
};
