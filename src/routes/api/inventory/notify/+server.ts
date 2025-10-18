import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
  const { supabase, ability } = locals;

  if (!ability || !ability.can('update', 'CostumeInventory')) {
    throw error(403, 'Unauthorized to update inventory');
  }

  const { item_id, old_status, new_status, item_type, item_name, user_name, team_id } = await request.json();

  // Create notification record
  const { data: notification, error: notifError } = await supabase
    .from('inventory_notifications')
    .insert({
      team_id,
      item_id,
      item_type,
      item_name,
      old_status,
      new_status,
      changed_by: locals.user?.id,
      changed_by_name: user_name,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (notifError) {
    throw error(500, 'Failed to create notification');
  }

  // Broadcast via SSE (handled by /api/events endpoint)
  // The SSE endpoint will pick this up via realtime subscription

  return new Response(JSON.stringify({ success: true, notification }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
