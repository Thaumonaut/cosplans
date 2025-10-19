import type { PostgresChangesPayload, RealtimeChannel } from "@supabase/supabase-js";
import type { RequestEvent } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

import { supabase } from "$lib/supabase";
import { logCosplansError, toCosplansError } from "$lib/utils/errors";

type RecordPayload = PostgresChangesPayload<Record<string, unknown>>;

function extractStringField(record: Record<string, unknown> | null | undefined, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value : undefined;
}

export async function GET(event: RequestEvent) {
  try {
    const stream = new ReadableStream({
      start(controller) {
        // Helper function to send SSE data
        const sendEvent = <T>(data: T, event?: string, id?: string) => {
          let message = "";
          if (id) message += `id: ${id}\n`;
          if (event) message += `event: ${event}\n`;
          message += `data: ${JSON.stringify(data)}\n\n`;

          try {
            controller.enqueue(new TextEncoder().encode(message));
          } catch (error) {
            console.error("Failed to send SSE event:", error);
          }
        };

        // Send initial connection event
        sendEvent(
          {
            type: "connection",
            message: "Connected to dashboard real-time updates",
            timestamp: new Date().toISOString(),
          },
          "connect"
        );

        // Set up Supabase realtime subscriptions
        const subscriptions: RealtimeChannel[] = [];

        // Subscribe to dashboard widgets changes
        const widgetsChannel = supabase
          .channel("dashboard_widgets")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "dashboard_widgets" },
            (payload: RecordPayload) => {
              const entityId =
                extractStringField(payload.new, "id") ??
                extractStringField(payload.old, "id") ??
                undefined;
              sendEvent(
                {
                  type: "widget_update",
                  entity_id: entityId ?? null,
                  action: payload.eventType,
                  data: payload.new ?? payload.old ?? null,
                  timestamp: new Date().toISOString(),
                },
                "widget_update"
              );
            }
          )
          .subscribe();

        subscriptions.push(widgetsChannel);

        // Subscribe to progress tracker changes
        const progressChannel = supabase
          .channel("progress_trackers")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "progress_trackers" },
            (payload: RecordPayload) => {
              const entityId =
                extractStringField(payload.new, "shoot_id") ??
                extractStringField(payload.old, "shoot_id") ??
                undefined;
              sendEvent(
                {
                  type: "progress_update",
                  entity_id: entityId ?? null,
                  action: payload.eventType,
                  data: payload.new ?? payload.old ?? null,
                  timestamp: new Date().toISOString(),
                },
                "progress_update"
              );
            }
          )
          .subscribe();

        subscriptions.push(progressChannel);

        // Subscribe to timeline events
        const timelineChannel = supabase
          .channel("timeline_events")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "timeline_events" },
            (payload: RecordPayload) => {
              sendEvent(
                {
                  type: "timeline_change",
                  entity_id: extractStringField(payload.new, "shoot_id") ?? null,
                  action: "event_added",
                  data: payload.new ?? null,
                  timestamp: new Date().toISOString(),
                },
                "timeline_change"
              );
            }
          )
          .subscribe();

        subscriptions.push(timelineChannel);

        // Subscribe to inventory lifecycle changes
        const inventoryChannel = supabase
          .channel("inventory_lifecycle")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "inventory_lifecycle" },
            (payload: RecordPayload) => {
              const entityId =
                extractStringField(payload.new, "id") ??
                extractStringField(payload.old, "id") ??
                undefined;
              sendEvent(
                {
                  type: "inventory_status",
                  entity_id: entityId ?? null,
                  action: payload.eventType,
                  data: payload.new ?? payload.old ?? null,
                  timestamp: new Date().toISOString(),
                },
                "inventory_status"
              );
            }
          )
          .subscribe();

        subscriptions.push(inventoryChannel);

        // Keep-alive ping every 30 seconds
        const keepAlive = setInterval(() => {
          sendEvent(
            {
              type: "ping",
              timestamp: new Date().toISOString(),
            },
            "ping"
          );
        }, 30000);

        // Cleanup function
        const cleanup = () => {
          clearInterval(keepAlive);
          subscriptions.forEach((channel) => {
            supabase.removeChannel(channel);
          });
        };

        // Handle client disconnect
        event.request.signal.addEventListener("abort", cleanup);

        // Handle stream closure
        return cleanup;
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
      },
    });
  } catch (error) {
    const cosplansError = logCosplansError(error as Error | string | null | undefined, {
      context: {
        request: "GET /api/events",
      },
    });

    const normalized = toCosplansError(cosplansError);

    return json(
      {
        error: normalized.code,
        message: normalized.userMessage,
        correlationId: normalized.correlationId,
        severity: normalized.severity,
      },
      { status: 500 }
    );
  }
}
