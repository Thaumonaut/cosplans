import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";

import { navigation } from "$lib/stores/navigation";
import type { NavigationItem as NavigationItemType } from "$lib/types/navigation";

describe("NavigationItem", () => {
  const mockItem: NavigationItemType = {
    id: "dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    href: "/dashboard",
    group: "main",
  };

  beforeEach(() => {
    navigation.reset();
    vi.clearAllMocks();
  });

  it("sets active item in store", () => {
    navigation.setActiveItem("dashboard");

    const state = get(navigation);
    expect(state.activeItem).toBe("dashboard");
  });

  it("displays notification badge when count > 0", () => {
    navigation.setNotificationCount("dashboard", 5);

    const state = get(navigation);
    expect(state.notifications.dashboard).toBe(5);
  });

  it("closes mobile sidebar after navigation", () => {
    navigation.toggleMobile(true);
    expect(get(navigation).isOpen).toBe(true);

    navigation.closeMobile();
    expect(get(navigation).isOpen).toBe(false);
  });

  it("clears notification when setting active item", () => {
    navigation.setNotificationCount("dashboard", 5);
    navigation.setActiveItem("dashboard");

    const state = get(navigation);
    expect(state.notifications.dashboard).toBe(0);
  });
});
