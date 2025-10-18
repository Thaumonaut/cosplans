import { describe, it, expect, beforeEach } from "vitest";
import { get } from "svelte/store";

import { navigation } from "$lib/stores/navigation";

describe("Sidebar", () => {
  beforeEach(() => {
    navigation.reset();
  });

  it("toggles collapsed state", () => {
    navigation.toggleCollapse(true);

    const state = get(navigation);
    expect(state.isCollapsed).toBe(true);
  });

  it("toggles mobile open state", () => {
    navigation.toggleMobile(true);

    const state = get(navigation);
    expect(state.isOpen).toBe(true);
  });

  it("closes mobile sidebar", () => {
    navigation.toggleMobile(true);
    navigation.closeMobile();

    const state = get(navigation);
    expect(state.isOpen).toBe(false);
  });

  it("tracks active navigation item", () => {
    navigation.setActiveItem("gallery");

    const state = get(navigation);
    expect(state.activeItem).toBe("gallery");
  });

  it("updates connection status", () => {
    navigation.setConnectionStatus("offline");

    const state = get(navigation);
    expect(state.connectionStatus).toBe("offline");
  });
});
