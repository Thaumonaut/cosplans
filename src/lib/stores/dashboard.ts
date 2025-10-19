import { writable, derived } from "svelte/store";
import type { DashboardWidget, DashboardLayout } from "$lib/types/dashboard";

// Dashboard widgets store
export const dashboardWidgets = writable<DashboardWidget[]>([]);

// Current dashboard template
export const currentTemplate = writable<"compact" | "detailed" | "timeline-focus">("detailed");

// Dashboard layout configuration
export const dashboardLayout = writable<DashboardLayout>({
  template: "detailed",
  grid_columns: 3,
  widget_positions: [],
});

// Loading state
export const isLoading = writable<boolean>(false);

// Error state
export const error = writable<string | null>(null);

// Derived store for visible widgets
export const visibleWidgets = derived(dashboardWidgets, ($widgets) =>
  $widgets.filter((widget) => widget.visible)
);

// Derived store for widgets by template
export const widgetsByTemplate = derived(
  [dashboardWidgets, currentTemplate],
  ([$widgets, $template]) =>
    $widgets
      .filter((widget) => widget.template === $template)
      .sort((a, b) => a.position - b.position)
);

// Widget actions
export const dashboardActions = {
  // Add or update a widget
  upsertWidget: (widget: Partial<DashboardWidget>) => {
    dashboardWidgets.update((widgets) => {
      const existingIndex = widgets.findIndex((w) => w.id === widget.id);
      if (existingIndex >= 0) {
        widgets[existingIndex] = { ...widgets[existingIndex], ...widget };
      } else if (widget.id) {
        widgets.push(widget as DashboardWidget);
      }
      return widgets;
    });
  },

  // Remove a widget
  removeWidget: (widgetId: string) => {
    dashboardWidgets.update((widgets) => widgets.filter((widget) => widget.id !== widgetId));
  },

  // Toggle widget visibility
  toggleWidget: (widgetId: string) => {
    dashboardWidgets.update((widgets) =>
      widgets.map((widget) =>
        widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
      )
    );
  },

  // Reorder widgets
  reorderWidgets: (templateType: string, newOrder: string[]) => {
    dashboardWidgets.update((widgets) =>
      widgets.map((widget) => {
        if (widget.template === templateType) {
          const newPosition = newOrder.indexOf(widget.id);
          return newPosition >= 0 ? { ...widget, position: newPosition } : widget;
        }
        return widget;
      })
    );
  },

  // Switch template
  switchTemplate: (template: "compact" | "detailed" | "timeline-focus") => {
    currentTemplate.set(template);
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    isLoading.set(loading);
  },

  // Set error state
  setError: (errorMsg: string | null) => {
    error.set(errorMsg);
  },
};
