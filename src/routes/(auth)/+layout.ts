import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent, data }) => {
  const parentData = await parent();

  // Server already handles auth check in +layout.server.ts
  // Just pass through the data and add team info
  
  // TODO: Get user's team information from database
  // For now, use a default team structure
  const userTeam = {
    id: "team-default",
    name: "My Team",
    avatarUrl: data.user?.user_metadata?.avatar_url || null,
  };

  return {
    ...parentData,
    ...data,
    team: userTeam,
  };
};
