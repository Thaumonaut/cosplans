// Data model types for Dashboard & Specialized Views
// Generated from specs/001-dashboard-views/data-model.md

export interface DashboardWidget {
  id: string;
  type: "upcoming_shoots" | "ideas" | "alerts" | "budget" | "weather" | "progress" | "recent_activity" | "tasks" | "timeline";
  user_id: string;
  template: "compact" | "detailed" | "timeline-focus";
  position: number;
  visible: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TimelineView {
  id: string;
  user_id: string;
  team_id: string;
  zoom_level: "day" | "week" | "month" | "quarter" | "year";
  date_range_start: string;
  date_range_end: string;
  visible_shoots: string[];
  filter_settings: Record<string, unknown>;
  milestone_markers: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProgressTracker {
  shoot_id: string;
  costume_progress: number; // 0-100
  props_progress: number; // 0-100
  location_progress: number; // 0-100
  team_progress: number; // 0-100
  checklist_progress: number; // 0-100
  editing_progress: number; // 0-100
  overall_progress: number; // calculated average
  outstanding_tasks: Array<{
    id: string;
    type: string;
    description: string;
    due_date?: string;
  }>;
  calculation_timestamp: string;
  updated_at: string;
}

export interface CharacterProfile {
  id: string;
  character_name: string;
  series_name: string;
  character_type: "main" | "side" | "original";
  team_id: string;
  gallery_images: Array<{
    id: string;
    url: string;
    caption?: string;
    type: "reference" | "progress" | "final";
  }>;
  costume_details: {
    complexity_rating: number; // 1-5
    estimated_cost: number;
    construction_notes?: string;
    materials_list?: string[];
  };
  shoot_history: string[]; // shoot_ids
  created_at: string;
  updated_at: string;
}

export interface BudgetOverview {
  team_id: string;
  total_budget: number;
  allocated_budget: number;
  spent_amount: number;
  categories: Array<{
    name: string;
    budgeted: number;
    spent: number;
    remaining: number;
  }>;
  settlements: Array<{
    member_id: string;
    member_name: string;
    total_spent: number;
    share_owed: number;
    balance: number; // positive = owed money, negative = owes money
  }>;
  calculation_timestamp: string;
  updated_at: string;
}

export interface InventoryLifecycle {
  id: string;
  item_name: string;
  item_type: "costume" | "prop" | "accessory" | "makeup";
  character_id: string;
  current_status: "planning" | "sourcing" | "construction" | "completed";
  status_history: Array<{
    status: string;
    timestamp: string;
    notes?: string;
    user_id: string;
  }>;
  dependencies: string[]; // other inventory item IDs
  assigned_to: string; // user_id
  target_completion: string;
  actual_completion?: string;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  shoot_id: string;
  event_type: "reschedule" | "dependency_add" | "dependency_remove" | "status_change";
  event_data: Record<string, unknown>;
  user_id: string;
  timestamp: string;
}

// Real-time update payloads
export interface RealtimeUpdate {
  type: "widget_update" | "progress_update" | "timeline_change" | "inventory_status";
  entity_id: string;
  user_id: string;
  timestamp: string;
  data: unknown;
}

// Dashboard layout configuration
export interface DashboardLayout {
  template: "compact" | "detailed" | "timeline-focus";
  grid_columns: number;
  widget_positions: Array<{
    widget_id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}
