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
import type {
  DiagnosticRunStatus,
  DiagnosticScenario,
  DiagnosticTrigger,
  ErrorEventSeverity,
  ServiceConnectionEnvironment,
  ServiceConnectionServiceType,
  ServiceConnectionStatus,
  ServiceHealthStatus,
} from "$lib/types/service-connections";

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
      service_connection_profiles: {
        Row: {
          id: string;
          team_id: string;
          service_type: ServiceConnectionServiceType;
          environment: ServiceConnectionEnvironment;
          supabase_project_ref: string | null;
          status: ServiceConnectionStatus;
          last_verified_at: string | null;
          connection_metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          service_type: ServiceConnectionServiceType;
          environment: ServiceConnectionEnvironment;
          supabase_project_ref?: string | null;
          status?: ServiceConnectionStatus;
          last_verified_at?: string | null;
          connection_metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<{
          team_id: string;
          service_type: ServiceConnectionServiceType;
          environment: ServiceConnectionEnvironment;
          supabase_project_ref: string | null;
          status: ServiceConnectionStatus;
          last_verified_at: string | null;
          connection_metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        }>;
      };
      diagnostic_test_runs: {
        Row: {
          id: string;
          service_connection_id: string;
          scenario: DiagnosticScenario;
          status: DiagnosticRunStatus;
          trigger_source: DiagnosticTrigger;
          executed_by: string | null;
          started_at: string;
          completed_at: string | null;
          duration_ms: number | null;
          evidence_url: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_connection_id: string;
          scenario: DiagnosticScenario;
          status: DiagnosticRunStatus;
          trigger_source?: DiagnosticTrigger;
          executed_by?: string | null;
          started_at?: string;
          completed_at?: string | null;
          duration_ms?: number | null;
          evidence_url?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          service_connection_id: string;
          scenario: DiagnosticScenario;
          status: DiagnosticRunStatus;
          trigger_source: DiagnosticTrigger;
          executed_by: string | null;
          started_at: string;
          completed_at: string | null;
          duration_ms: number | null;
          evidence_url: string | null;
          notes: string | null;
          created_at: string;
        }>;
      };
      error_events: {
        Row: {
          id: string;
          service_connection_id: string;
          correlation_id: string;
          severity: ErrorEventSeverity;
          error_code: string;
          user_message: string;
          operator_context: Record<string, unknown>;
          occurred_at: string;
          acknowledged_at: string | null;
          acknowledged_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_connection_id: string;
          correlation_id: string;
          severity?: ErrorEventSeverity;
          error_code: string;
          user_message: string;
          operator_context?: Record<string, unknown>;
          occurred_at?: string;
          acknowledged_at?: string | null;
          acknowledged_by?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          service_connection_id: string;
          correlation_id: string;
          severity: ErrorEventSeverity;
          error_code: string;
          user_message: string;
          operator_context: Record<string, unknown>;
          occurred_at: string;
          acknowledged_at: string | null;
          acknowledged_by: string | null;
          created_at: string;
        }>;
      };
      service_connection_heartbeats: {
        Row: {
          id: string;
          service_connection_id: string;
          status: "pass" | "fail";
          latency_ms: number | null;
          error_code: string | null;
          error_event_id: string | null;
          occurred_at: string;
          consecutive_failures: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_connection_id: string;
          status: "pass" | "fail";
          latency_ms?: number | null;
          error_code?: string | null;
          error_event_id?: string | null;
          occurred_at?: string;
          consecutive_failures?: number;
          created_at?: string;
        };
        Update: Partial<{
          service_connection_id: string;
          status: "pass" | "fail";
          latency_ms: number | null;
          error_code: string | null;
          error_event_id: string | null;
          occurred_at: string;
          consecutive_failures: number;
          created_at: string;
        }>;
      };
    };
    Views: {
      service_health_snapshots: {
        Row: {
          service_connection_id: string;
          current_status: ServiceHealthStatus;
          uptime_percent_24h: number;
          recent_failures: number;
          last_heartbeat_at: string | null;
          last_error_event_id: string | null;
          last_latency_ms: number | null;
          consecutive_failures: number;
          last_error_code: string | null;
        };
      };
    };
    Functions: {
      refresh_service_health_snapshots: {
        Args: Record<string, never>;
        Returns: void;
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
