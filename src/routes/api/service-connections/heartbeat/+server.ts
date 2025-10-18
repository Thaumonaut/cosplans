import { error, json, type RequestHandler } from "@sveltejs/kit";
import { env as dynamicEnv } from "$env/dynamic/private";
import { runServiceConnectionHeartbeats } from "$lib/server/service-connections/heartbeat-runner";

const AUTH_HEADER = "authorization";
const FALLBACK_HEADER = "x-service-heartbeat-token";

const resolveToken = () => dynamicEnv.SERVICE_HEARTBEAT_TOKEN ?? "";

const verifyAuthorization = (request: Request): void => {
  const expectedToken = resolveToken();
  if (!expectedToken) {
    return;
  }

  const authHeader = request.headers.get(AUTH_HEADER);
  if (authHeader && authHeader.trim() === `Bearer ${expectedToken}`) {
    return;
  }

  const fallbackHeader = request.headers.get(FALLBACK_HEADER);
  if (fallbackHeader && fallbackHeader.trim() === expectedToken) {
    return;
  }

  throw error(401, "Unauthorized heartbeat invocation");
};

export const POST: RequestHandler = async ({ request }) => {
  verifyAuthorization(request);

  try {
    const results = await runServiceConnectionHeartbeats();
    return json({ ok: true, count: results.length, results });
  } catch (cause) {
    console.error("Heartbeat execution failed", cause);
    throw error(500, "Heartbeat execution failed");
  }
};
