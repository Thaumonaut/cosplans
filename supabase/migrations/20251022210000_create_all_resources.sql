-- ============================================================================
-- RESOURCE MANAGEMENT SYSTEM - COMPLETE SETUP
-- ============================================================================
-- Creates all 5 resource types: Costumes, Crew, Equipment, Props, Locations
-- Plus supporting tables for photos
-- ============================================================================

-- ============================================================================
-- 1. COSTUMES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.costumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),

  -- Core Fields
  character_name TEXT NOT NULL,
  series TEXT,
  costume_type TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN (
    'planned', 'acquiring', 'in_progress', 'ready', 'owned', 
    'sold', 'damaged', 'rented', 'lost', 'stored', 'loaned', 
    'cancelled', 'paused'
  )),

  -- Cost Tracking
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  completion_date DATE,

  -- Storage
  storage_location TEXT,
  state_metadata JSONB DEFAULT '{}',
  notes TEXT,

  -- Search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(character_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(series, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(notes, '')), 'C')
  ) STORED,

  -- Soft Delete
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. CREW MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crew_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),

  -- Core Fields
  name TEXT NOT NULL,
  previous_roles TEXT[] DEFAULT '{}', -- Array of roles they've performed

  -- Contact Info
  email TEXT,
  phone TEXT,
  portfolio_url TEXT,
  instagram_handle TEXT,
  twitter_handle TEXT,

  -- Metadata
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,

  -- Search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(previous_roles, ' '), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(notes, '')), 'C')
  ) STORED,

  -- Soft Delete
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. EQUIPMENT TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),

  -- Core Fields
  name TEXT NOT NULL,
  equipment_type TEXT NOT NULL CHECK (equipment_type IN (
    'camera', 'lens', 'lighting', 'audio', 'tripod', 'backdrop', 'other'
  )),
  brand TEXT,
  model TEXT,

  -- Condition & Ownership
  condition TEXT NOT NULL DEFAULT 'good' CHECK (condition IN (
    'excellent', 'good', 'fair', 'poor', 'needs_repair'
  )),
  ownership_status TEXT NOT NULL DEFAULT 'owned' CHECK (ownership_status IN (
    'owned', 'rented', 'borrowed', 'loaned_out'
  )),

  -- Details
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  serial_number TEXT,
  storage_location TEXT,
  notes TEXT,

  -- Search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(brand, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(model, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(notes, '')), 'C')
  ) STORED,

  -- Soft Delete
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. PROPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.props (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),

  -- Core Fields
  name TEXT NOT NULL,
  prop_type TEXT,
  character_series TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN (
    'planned', 'acquiring', 'in_progress', 'ready', 'owned', 
    'sold', 'damaged', 'rented', 'lost', 'stored', 'loaned', 
    'cancelled', 'paused'
  )),

  -- Cost Tracking
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  completion_date DATE,

  -- Storage
  storage_location TEXT,
  state_metadata JSONB DEFAULT '{}',
  notes TEXT,

  -- Search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(character_series, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(notes, '')), 'C')
  ) STORED,

  -- Soft Delete
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. LOCATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),

  -- Core Fields
  name TEXT NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN (
    'studio', 'outdoor', 'convention_center', 'private_residence', 'public_space', 'other'
  )),

  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,

  -- Details
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,

  -- Search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(address, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(city, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(notes, '')), 'C')
  ) STORED,

  -- Soft Delete
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. RESOURCE PHOTOS TABLE (shared by all resources)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.resource_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Polymorphic relationship to any resource
  resource_type TEXT NOT NULL CHECK (resource_type IN (
    'costume', 'crew_member', 'equipment', 'prop', 'location'
  )),
  resource_id UUID NOT NULL,

  -- Photo Details
  storage_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  display_order INTEGER DEFAULT 0,
  caption TEXT,
  is_primary BOOLEAN DEFAULT FALSE,

  -- Metadata
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by UUID NOT NULL REFERENCES auth.users(id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Costumes
CREATE INDEX IF NOT EXISTS idx_costumes_team ON costumes(team_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_costumes_status ON costumes(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_costumes_search ON costumes USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_costumes_deleted ON costumes(deleted_at) WHERE deleted_at IS NOT NULL;

-- Crew Members
CREATE INDEX IF NOT EXISTS idx_crew_team ON crew_members(team_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_crew_favorite ON crew_members(is_favorite) WHERE is_favorite = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_crew_search ON crew_members USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_crew_deleted ON crew_members(deleted_at) WHERE deleted_at IS NOT NULL;

-- Equipment
CREATE INDEX IF NOT EXISTS idx_equipment_team ON equipment(team_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(equipment_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_equipment_condition ON equipment(condition) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_equipment_search ON equipment USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_equipment_deleted ON equipment(deleted_at) WHERE deleted_at IS NOT NULL;

-- Props
CREATE INDEX IF NOT EXISTS idx_props_team ON props(team_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_props_status ON props(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_props_search ON props USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_props_deleted ON props(deleted_at) WHERE deleted_at IS NOT NULL;

-- Locations
CREATE INDEX IF NOT EXISTS idx_locations_team ON locations(team_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(location_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_locations_favorite ON locations(is_favorite) WHERE is_favorite = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_locations_search ON locations USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_locations_deleted ON locations(deleted_at) WHERE deleted_at IS NOT NULL;

-- Resource Photos
CREATE INDEX IF NOT EXISTS idx_photos_resource ON resource_photos(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_photos_primary ON resource_photos(resource_id) WHERE is_primary = TRUE;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE costumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE props ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_photos ENABLE ROW LEVEL SECURITY;

-- Costumes Policies
CREATE POLICY "Team members can view their team's costumes"
  ON costumes FOR SELECT
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can insert costumes"
  ON costumes FOR INSERT
  WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can update their team's costumes"
  ON costumes FOR UPDATE
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can delete their team's costumes"
  ON costumes FOR DELETE
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Crew Members Policies (same pattern)
CREATE POLICY "Team members can view their team's crew"
  ON crew_members FOR SELECT
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can insert crew"
  ON crew_members FOR INSERT
  WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can update their team's crew"
  ON crew_members FOR UPDATE
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can delete their team's crew"
  ON crew_members FOR DELETE
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Equipment Policies
CREATE POLICY "Team members can view their team's equipment"
  ON equipment FOR SELECT
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can insert equipment"
  ON equipment FOR INSERT
  WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can update their team's equipment"
  ON equipment FOR UPDATE
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can delete their team's equipment"
  ON equipment FOR DELETE
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Props Policies
CREATE POLICY "Team members can view their team's props"
  ON props FOR SELECT
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can insert props"
  ON props FOR INSERT
  WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can update their team's props"
  ON props FOR UPDATE
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can delete their team's props"
  ON props FOR DELETE
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Locations Policies
CREATE POLICY "Team members can view their team's locations"
  ON locations FOR SELECT
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can insert locations"
  ON locations FOR INSERT
  WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can update their team's locations"
  ON locations FOR UPDATE
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Team members can delete their team's locations"
  ON locations FOR DELETE
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Resource Photos Policies
CREATE POLICY "Users can view photos for resources they can access"
  ON resource_photos FOR SELECT
  USING (
    CASE resource_type
      WHEN 'costume' THEN resource_id IN (SELECT id FROM costumes WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
      WHEN 'crew_member' THEN resource_id IN (SELECT id FROM crew_members WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
      WHEN 'equipment' THEN resource_id IN (SELECT id FROM equipment WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
      WHEN 'prop' THEN resource_id IN (SELECT id FROM props WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
      WHEN 'location' THEN resource_id IN (SELECT id FROM locations WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
    END
  );

CREATE POLICY "Users can insert photos for resources they can access"
  ON resource_photos FOR INSERT
  WITH CHECK (
    CASE resource_type
      WHEN 'costume' THEN resource_id IN (SELECT id FROM costumes WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
      WHEN 'crew_member' THEN resource_id IN (SELECT id FROM crew_members WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
      WHEN 'equipment' THEN resource_id IN (SELECT id FROM equipment WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
      WHEN 'prop' THEN resource_id IN (SELECT id FROM props WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
      WHEN 'location' THEN resource_id IN (SELECT id FROM locations WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
    END
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all resource tables
CREATE TRIGGER update_costumes_updated_at
  BEFORE UPDATE ON costumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crew_updated_at
  BEFORE UPDATE ON crew_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_props_updated_at
  BEFORE UPDATE ON props
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMPLETE!
-- ============================================================================
-- All resource tables, indexes, RLS policies, and triggers are now set up.
-- You can now use the resource management system!
-- ============================================================================
