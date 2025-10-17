import { createClient } from "@supabase/supabase-js";

// Types for our database schema
import type {
  DashboardWidget,
  TimelineView,
  ProgressTracker,
  CharacterProfile,
  BudgetOverview,
  InventoryLifecycle,
  TimelineEvent,
} from "$lib/types/dashboard";

export interface Database {
  public: {
    Tables: {
      dashboard_widgets: {
        Row: DashboardWidget;
        Insert: Omit<DashboardWidget, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DashboardWidget, "id" | "created_at">>;
      };
      timeline_views: {
        Row: TimelineView;
        Insert: Omit<TimelineView, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<TimelineView, "id" | "created_at">>;
      };
      progress_trackers: {
        Row: ProgressTracker;
        Insert: Omit<ProgressTracker, "overall_progress" | "calculation_timestamp" | "updated_at">;
        Update: Partial<
          Omit<ProgressTracker, "shoot_id" | "overall_progress" | "calculation_timestamp">
        >;
      };
      character_profiles: {
        Row: CharacterProfile;
        Insert: Omit<CharacterProfile, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<CharacterProfile, "id" | "created_at">>;
      };
      budget_overviews: {
        Row: BudgetOverview;
        Insert: Omit<BudgetOverview, "calculation_timestamp" | "updated_at">;
        Update: Partial<Omit<BudgetOverview, "team_id" | "calculation_timestamp">>;
      };
      inventory_lifecycle: {
        Row: InventoryLifecycle;
        Insert: Omit<InventoryLifecycle, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<InventoryLifecycle, "id" | "created_at">>;
      };
      timeline_events: {
        Row: TimelineEvent;
        Insert: Omit<TimelineEvent, "id" | "timestamp">;
        Update: never; // Events are immutable
      };
    };
  };
}

// Fallback values for development - replace with actual values
const supabaseUrl = "http://localhost:54321";
const supabaseAnonKey = "your-anon-key-here";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to handle Supabase errors
export function handleSupabaseError(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    const { message } = error as { message?: string };
    if (message) {
      return message;
    }
  }

  return "An unexpected error occurred";
}
