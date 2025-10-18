import { beforeEach, describe, expect, it } from "vitest";
import { get } from "svelte/store";

import { theme } from "$lib/stores/theme";
import { DEFAULT_THEME_ID, THEME_VARIANTS } from "$lib/utils/theme-variants";

describe("theme store", () => {
  beforeEach(() => {
    localStorage.clear();
    theme.reset();
  });

  it("initializes with the default theme", () => {
    const state = get(theme);
    expect(state.activeId).toBe(DEFAULT_THEME_ID);
    expect(state.variants).toHaveLength(THEME_VARIANTS.length);
    expect(document.documentElement.dataset.theme).toBe(DEFAULT_THEME_ID);
  });

  it("switches to another built-in theme and persists the selection", () => {
    const target = "dark-default";
    theme.setTheme(target);

    const state = get(theme);
    expect(state.activeId).toBe(target);
    expect(state.resolvedMode).toBe("dark");
    expect(localStorage.getItem("cosplans:theme-id")).toBe(target);
    expect(document.documentElement.dataset.theme).toBe(target);
  });

  it("falls back to default when selecting an unknown theme id", () => {
    theme.setTheme("unknown-theme");
    const state = get(theme);
    expect(state.activeId).toBe(DEFAULT_THEME_ID);
  });

  it("supports custom themes with persistence and fallback", () => {
    theme.setCustomTheme({
      id: "custom-incoming",
      label: "Custom Sunrise",
      description: "Test custom theme",
      mode: "light",
      preview: {
        primary: "#ff0000",
        accent: "#00ff00",
        muted: "#0000ff",
        background: "#ffffff",
      },
      cssVars: {
        "--theme-background": "#ffffff",
      },
    });

    let state = get(theme);
    expect(state.activeId).toBe("custom");
    expect(state.custom?.label).toBe("Custom Sunrise");
    expect(localStorage.getItem("cosplans:theme-custom")).toContain("Custom Sunrise");

    theme.setCustomTheme(undefined);
    state = get(theme);
    expect(state.activeId).toBe(DEFAULT_THEME_ID);
    expect(state.custom).toBeUndefined();
    expect(localStorage.getItem("cosplans:theme-custom")).toBeNull();
  });

  it("replays stored theme preference on initialize", () => {
    localStorage.setItem("cosplans:theme-id", "dark-default");
    theme.initialize();

    const state = get(theme);
    expect(state.activeId).toBe("dark-default");
    expect(document.documentElement.dataset.theme).toBe("dark-default");
  });
});
