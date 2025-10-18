import { randomUUID } from "node:crypto";

export type NotificationSeverity = "info" | "warning" | "critical";
export type NotificationChannel = "in_app" | "email" | "slack";

export interface NotificationAudience {
  teamId: string;
  roles?: string[];
  users?: string[];
}

export interface NotificationEvent {
  type: string;
  severity: NotificationSeverity;
  channel: NotificationChannel;
  audience: NotificationAudience;
  context?: Record<string, unknown>;
  message?: string;
}

export interface DispatchedNotification extends NotificationEvent {
  id: string;
  dispatchedAt: Date;
}

const inMemoryNotifications: DispatchedNotification[] = [];

export async function dispatchNotification(event: NotificationEvent): Promise<void> {
  const payload: DispatchedNotification = {
    ...event,
    id: randomUUID(),
    dispatchedAt: new Date(),
  };

  if (process.env.COSPLANS_TEST_MODE === "1" || process.env.NODE_ENV === "test") {
    inMemoryNotifications.unshift(payload);
    return;
  }

  console.error(
    "[Notification]",
    JSON.stringify(
      {
        id: payload.id,
        type: payload.type,
        severity: payload.severity,
        channel: payload.channel,
        audience: payload.audience,
        context: payload.context,
        message: payload.message,
        dispatchedAt: payload.dispatchedAt.toISOString(),
      },
      null,
      2
    )
  );
}

export function getDispatchedNotifications(): DispatchedNotification[] {
  return [...inMemoryNotifications];
}

export function clearNotificationLog(): void {
  inMemoryNotifications.length = 0;
}
