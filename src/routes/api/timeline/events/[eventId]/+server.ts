import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  const { supabase, ability } = locals;
  const eventId = params.eventId;

  if (!ability || !ability.can('update', 'TimelineView')) {
    throw error(403, 'Unauthorized to update timeline events');
  }

  const { start_date, end_date } = await request.json();

  if (!start_date || !end_date) {
    throw error(400, 'start_date and end_date are required');
  }

  // Validate dates
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw error(400, 'Invalid date format');
  }

  if (endDate < startDate) {
    throw error(400, 'End date must be after start date');
  }

  // Update the timeline event
  const { data: timelineEvent, error: updateError } = await supabase
    .from('timeline_events')
    .update({
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', eventId)
    .select()
    .single();

  if (updateError) {
    console.error('Failed to update timeline event:', updateError);
    throw error(500, 'Failed to update timeline event');
  }

  // TODO: Broadcast update via SSE to notify other users
  // Could emit event like: { type: 'timeline-event-updated', data: timelineEvent }

  return json({
    success: true,
    event: timelineEvent
  });
};
