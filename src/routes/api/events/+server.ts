import { supabase } from '$lib/supabase';

export async function GET({ request }: { request: Request }) {
  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Helper function to send SSE data
      const sendEvent = (data: any, event?: string, id?: string) => {
        let message = '';
        if (id) message += `id: ${id}\n`;
        if (event) message += `event: ${event}\n`;
        message += `data: ${JSON.stringify(data)}\n\n`;
        
        try {
          controller.enqueue(new TextEncoder().encode(message));
        } catch (error) {
          console.error('Failed to send SSE event:', error);
        }
      };

      // Send initial connection event
      sendEvent({ 
        type: 'connection', 
        message: 'Connected to dashboard real-time updates',
        timestamp: new Date().toISOString()
      }, 'connect');

      // Set up Supabase realtime subscriptions
      const subscriptions: any[] = [];

      // Subscribe to dashboard widgets changes
      const widgetsChannel = supabase
        .channel('dashboard_widgets')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'dashboard_widgets' }, 
          (payload) => {
            sendEvent({
              type: 'widget_update',
              entity_id: (payload.new as any)?.id || (payload.old as any)?.id,
              action: payload.eventType,
              data: payload.new || payload.old,
              timestamp: new Date().toISOString()
            }, 'widget_update');
          }
        )
        .subscribe();

      subscriptions.push(widgetsChannel);

      // Subscribe to progress tracker changes
      const progressChannel = supabase
        .channel('progress_trackers')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'progress_trackers' },
          (payload) => {
            sendEvent({
              type: 'progress_update',
              entity_id: (payload.new as any)?.shoot_id || (payload.old as any)?.shoot_id,
              action: payload.eventType,
              data: payload.new || payload.old,
              timestamp: new Date().toISOString()
            }, 'progress_update');
          }
        )
        .subscribe();

      subscriptions.push(progressChannel);

      // Subscribe to timeline events
      const timelineChannel = supabase
        .channel('timeline_events')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'timeline_events' },
          (payload) => {
            sendEvent({
              type: 'timeline_change',
              entity_id: (payload.new as any)?.shoot_id,
              action: 'event_added',
              data: payload.new,
              timestamp: new Date().toISOString()
            }, 'timeline_change');
          }
        )
        .subscribe();

      subscriptions.push(timelineChannel);

      // Subscribe to inventory lifecycle changes
      const inventoryChannel = supabase
        .channel('inventory_lifecycle')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'inventory_lifecycle' },
          (payload) => {
            sendEvent({
              type: 'inventory_status',
              entity_id: (payload.new as any)?.id || (payload.old as any)?.id,
              action: payload.eventType,
              data: payload.new || payload.old,
              timestamp: new Date().toISOString()
            }, 'inventory_status');
          }
        )
        .subscribe();

      subscriptions.push(inventoryChannel);

      // Keep-alive ping every 30 seconds
      const keepAlive = setInterval(() => {
        sendEvent({ 
          type: 'ping',
          timestamp: new Date().toISOString()
        }, 'ping');
      }, 30000);

      // Cleanup function
      const cleanup = () => {
        clearInterval(keepAlive);
        subscriptions.forEach(channel => {
          supabase.removeChannel(channel);
        });
      };

      // Handle client disconnect
      request.signal.addEventListener('abort', cleanup);
      
      // Handle stream closure
      return cleanup;
    }
  });

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
};