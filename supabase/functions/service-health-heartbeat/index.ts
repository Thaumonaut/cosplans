/**
 * @deprecated
 *
 * Supabase edge functions are no longer used for service heartbeats.
 * Deployments should rely on the Bun-based runner defined in
 * `src/lib/server/service-connections/heartbeat-runner.ts` instead.
 */

export const serviceHealthHeartbeatDeprecated = true;
