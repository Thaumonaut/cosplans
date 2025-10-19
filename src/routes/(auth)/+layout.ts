import type { LayoutLoad } from "./$types";
import { navigation } from "$lib/stores/navigation";

export const load: LayoutLoad = async ({ parent }) => {
  await parent();

  const dummyUser = {
    id: "user-demo-123",
    name: "Demo User",
    email: "demo@cosplans.app",
    avatarUrl: undefined,
    role: "member",
  };

  const dummyTeam = {
    id: "team-demo-456",
    name: "Demo Team",
    avatarUrl: undefined,
  };

  navigation.setUser(dummyUser);
  navigation.setTeam(dummyTeam);

  return {
    user: dummyUser,
    team: dummyTeam,
  };
};
