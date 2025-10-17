-- Dashboard Views Database Schema
-- Based on data-model.md specifications

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Dashboard Widgets Table
CREATE TABLE IF NOT EXISTS dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('upcoming_shoots', 'ideas', 'alerts', 'budget', 'weather', 'progress')),
  user_id UUID NOT NULL, -- References auth.users
  template TEXT NOT NULL CHECK (template IN ('compact', 'detailed', 'timeline-focus')),
  position INTEGER NOT NULL,
  visible BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, template, position) -- Ensure unique positioning within template
);

-- Timeline Views Table
CREATE TABLE IF NOT EXISTS timeline_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- References auth.users
  team_id UUID NOT NULL, -- References teams table (to be created in other features)
  zoom_level TEXT NOT NULL CHECK (zoom_level IN ('day', 'week', 'month', 'quarter', 'year')),
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  visible_shoots UUID[] DEFAULT '{}',
  filter_settings JSONB DEFAULT '{}',
  milestone_markers JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CHECK (date_range_start <= date_range_end)
);

-- Progress Trackers Table (One-to-one with shoots)
CREATE TABLE IF NOT EXISTS progress_trackers (
  shoot_id UUID PRIMARY KEY, -- References shoots table
  costume_progress INTEGER DEFAULT 0 CHECK (costume_progress >= 0 AND costume_progress <= 100),
  props_progress INTEGER DEFAULT 0 CHECK (props_progress >= 0 AND props_progress <= 100),
  location_progress INTEGER DEFAULT 0 CHECK (location_progress >= 0 AND location_progress <= 100),
  team_progress INTEGER DEFAULT 0 CHECK (team_progress >= 0 AND team_progress <= 100),
  checklist_progress INTEGER DEFAULT 0 CHECK (checklist_progress >= 0 AND checklist_progress <= 100),
  editing_progress INTEGER DEFAULT 0 CHECK (editing_progress >= 0 AND editing_progress <= 100),
  overall_progress INTEGER GENERATED ALWAYS AS (
    (costume_progress + props_progress + location_progress + team_progress + checklist_progress + editing_progress) / 6
  ) STORED,
  outstanding_tasks JSONB DEFAULT '[]',
  calculation_timestamp TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline Events Table (Event sourcing)
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shoot_id UUID NOT NULL, -- References shoots table
  event_type TEXT NOT NULL CHECK (event_type IN ('reschedule', 'dependency_add', 'dependency_remove', 'status_change')),
  event_data JSONB NOT NULL,
  user_id UUID NOT NULL, -- References auth.users
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Character Profiles Table
CREATE TABLE IF NOT EXISTS character_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_name TEXT NOT NULL,
  series_name TEXT NOT NULL,
  character_type TEXT CHECK (character_type IN ('main', 'side', 'original')),
  team_id UUID NOT NULL,
  gallery_images JSONB DEFAULT '[]',
  costume_details JSONB DEFAULT '{}',
  shoot_history UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget Overview Table
CREATE TABLE IF NOT EXISTS budget_overviews (
  team_id UUID PRIMARY KEY,
  total_budget DECIMAL(10,2) DEFAULT 0,
  allocated_budget DECIMAL(10,2) DEFAULT 0,
  spent_amount DECIMAL(10,2) DEFAULT 0,
  categories JSONB DEFAULT '[]',
  settlements JSONB DEFAULT '[]',
  calculation_timestamp TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Lifecycle Table
CREATE TABLE IF NOT EXISTS inventory_lifecycle (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('costume', 'prop', 'accessory', 'makeup')),
  character_id UUID REFERENCES character_profiles(id),
  current_status TEXT NOT NULL CHECK (current_status IN ('planning', 'sourcing', 'construction', 'completed')),
  status_history JSONB DEFAULT '[]',
  dependencies UUID[] DEFAULT '{}',
  assigned_to UUID, -- References auth.users
  target_completion TIMESTAMPTZ,
  actual_completion TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_user_template ON dashboard_widgets(user_id, template);
CREATE INDEX IF NOT EXISTS idx_timeline_views_team ON timeline_views(team_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_shoot ON timeline_events(shoot_id);
CREATE INDEX IF NOT EXISTS idx_character_profiles_team ON character_profiles(team_id);
CREATE INDEX IF NOT EXISTS idx_inventory_lifecycle_character ON inventory_lifecycle(character_id);
CREATE INDEX IF NOT EXISTS idx_inventory_lifecycle_status ON inventory_lifecycle(current_status);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dashboard_widgets_updated_at 
  BEFORE UPDATE ON dashboard_widgets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timeline_views_updated_at 
  BEFORE UPDATE ON timeline_views 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_trackers_updated_at 
  BEFORE UPDATE ON progress_trackers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_profiles_updated_at 
  BEFORE UPDATE ON character_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_overviews_updated_at 
  BEFORE UPDATE ON budget_overviews 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_lifecycle_updated_at 
  BEFORE UPDATE ON inventory_lifecycle 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (Row Level Security)
-- Note: These assume auth.users table exists from Supabase Auth

ALTER TABLE dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_trackers ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_overviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_lifecycle ENABLE ROW LEVEL SECURITY;

-- Dashboard widgets: Users can only manage their own widgets
CREATE POLICY "Users can manage own widgets" ON dashboard_widgets
  FOR ALL USING (auth.uid() = user_id);

-- Timeline views: Users can view team timelines if they're team members
CREATE POLICY "Team members can manage timeline views" ON timeline_views
  FOR ALL USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_id = timeline_views.team_id AND user_id = auth.uid()
    )
  );

-- Progress trackers: Team members can view progress for their team's shoots
CREATE POLICY "Team members can view progress" ON progress_trackers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shoots s
      JOIN team_members tm ON s.team_id = tm.team_id
      WHERE s.id = progress_trackers.shoot_id AND tm.user_id = auth.uid()
    )
  );

-- Timeline events: Team members can view events for their team's shoots
CREATE POLICY "Team members can view timeline events" ON timeline_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shoots s
      JOIN team_members tm ON s.team_id = tm.team_id
      WHERE s.id = timeline_events.shoot_id AND tm.user_id = auth.uid()
    )
  );

-- Character profiles: Team members can manage team characters
CREATE POLICY "Team members can manage characters" ON character_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_id = character_profiles.team_id AND user_id = auth.uid()
    )
  );

-- Budget overviews: Team members can view team budgets
CREATE POLICY "Team members can view budgets" ON budget_overviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_id = budget_overviews.team_id AND user_id = auth.uid()
    )
  );

-- Inventory lifecycle: Team members can manage team inventory
CREATE POLICY "Team members can manage inventory" ON inventory_lifecycle
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM character_profiles cp
      JOIN team_members tm ON cp.team_id = tm.team_id
      WHERE cp.id = inventory_lifecycle.character_id AND tm.user_id = auth.uid()
    )
  );