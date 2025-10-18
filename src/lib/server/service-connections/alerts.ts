import { randomUUID } from "node:crypto";

import { dispatchNotification } from "$lib/server/notifications/dispatch";
import {
  linkHeartbeatToErrorEvent,
  type RecordHeartbeatOutcomeResult,
} from "$lib/server/service-connections/health.repository";
import {
  acknowledgeErrorEvent,
  recordErrorEvent,
  type ErrorEventRecord,
} from "$lib/server/service-connections/errors.repository";

interface HeartbeatAlertInput {
  teamId: string;
  serviceConnectionId: string;
  connectionName: string;
  outcome: RecordHeartbeatOutcomeResult;
  errorCode?: string | null;
}

export interface HeartbeatAlertResult {
  createdIncident?: ErrorEventRecord;
  resolved?: boolean;
}

const HEARTBEAT_THRESHOLD = 2;

export async function evaluateHeartbeatAlerts(
  input: HeartbeatAlertInput
): Promise<HeartbeatAlertResult> {
  const { outcome } = input;
  const status = outcome.snapshot.currentStatus;
  const previousStatus = outcome.previousStatus;
  const errorCode = input.errorCode ?? "HEARTBEAT_FAILURE";

  if (status === "error" && outcome.consecutiveFailures >= HEARTBEAT_THRESHOLD) {
    if (outcome.snapshot.lastErrorEventId && previousStatus === "error") {
      // Incident already open; nothing additional to do
      return { createdIncident: undefined, resolved: false };
    }

    const incident = await recordErrorEvent({
      teamId: input.teamId,
      serviceConnectionId: input.serviceConnectionId,
      correlationId: randomUUID(),
      errorCode,
      userMessage: `We lost connectivity with ${input.connectionName}. Our team is investigating.`,
      severity: "critical",
      operatorContext: {
        source: "heartbeat",
        heartbeatId: outcome.heartbeatId,
        consecutiveFailures: outcome.consecutiveFailures,
      },
    });

    await linkHeartbeatToErrorEvent({
      teamId: input.teamId,
      serviceConnectionId: input.serviceConnectionId,
      heartbeatId: outcome.heartbeatId,
      errorEventId: incident.id,
    });

    await dispatchNotification({
      type: "service.health.incident",
      severity: "critical",
      channel: "in_app",
      audience: {
        teamId: input.teamId,
        roles: ["operations"],
      },
      context: {
        serviceConnectionId: input.serviceConnectionId,
        connectionName: input.connectionName,
        consecutiveFailures: outcome.consecutiveFailures,
        errorCode,
        incidentId: incident.id,
      },
    });

    return { createdIncident: incident, resolved: false };
  }

  if (status === "degraded" && previousStatus !== "degraded") {
    await dispatchNotification({
      type: "service.health.degraded",
      severity: "warning",
      channel: "in_app",
      audience: {
        teamId: input.teamId,
        roles: ["operations"],
      },
      context: {
        serviceConnectionId: input.serviceConnectionId,
        connectionName: input.connectionName,
        errorCode,
      },
    });
  }

  if (status === "active" && previousStatus && previousStatus !== "active") {
    await dispatchNotification({
      type: "service.health.recovered",
      severity: "info",
      channel: "in_app",
      audience: {
        teamId: input.teamId,
        roles: ["operations"],
      },
      context: {
        serviceConnectionId: input.serviceConnectionId,
        connectionName: input.connectionName,
      },
    });

    return { resolved: true };
  }

  return { resolved: false };
}

interface AcknowledgeIncidentInput {
  teamId: string;
  incidentId: string;
  operatorId: string;
}

export async function acknowledgeIncident(
  input: AcknowledgeIncidentInput
): Promise<ErrorEventRecord | null> {
  const result = await acknowledgeErrorEvent(input.teamId, input.incidentId, input.operatorId);

  if (result) {
    await dispatchNotification({
      type: "service.health.acknowledged",
      severity: "info",
      channel: "in_app",
      audience: {
        teamId: input.teamId,
        roles: ["operations"],
      },
      context: {
        incidentId: input.incidentId,
        acknowledgedBy: input.operatorId,
        serviceConnectionId: result.serviceConnectionId,
      },
    });
  }

  return result;
}
