import { listErrorEvents } from "$lib/server/service-connections/errors.repository";

const TEAM_ID = "team-demo-456";

export const load = async () => {
  const events = await listErrorEvents(TEAM_ID, { limit: 100 });

  return {
    teamId: TEAM_ID,
    events,
  };
};
