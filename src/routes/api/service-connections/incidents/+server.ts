import { json, type RequestHandler } from "@sveltejs/kit";

import { acknowledgeIncident } from "$lib/server/service-connections/alerts";

export const POST: RequestHandler = async ({ request }) => {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return json({ error: "Invalid payload supplied." }, { status: 400 });
  }

  const { incidentId, operatorId, teamId } = payload as Record<string, unknown>;

  if (typeof incidentId !== "string" || incidentId.length === 0) {
    return json({ error: "incidentId is required." }, { status: 400 });
  }

  const effectiveTeamId =
    typeof teamId === "string" && teamId.length > 0 ? teamId : "team-demo-456";
  const effectiveOperatorId =
    typeof operatorId === "string" && operatorId.length > 0 ? operatorId : "operator-demo-123";

  const result = await acknowledgeIncident({
    teamId: effectiveTeamId,
    incidentId,
    operatorId: effectiveOperatorId,
  });

  if (!result) {
    return json({ error: "Incident could not be acknowledged." }, { status: 404 });
  }

  return json({
    incidentId: result.id,
    acknowledgedAt: result.acknowledgedAt ? result.acknowledgedAt.toISOString() : null,
    acknowledgedBy: result.acknowledgedBy,
  });
};
