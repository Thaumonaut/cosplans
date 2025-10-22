# Data Model: Resource Management System

**Feature**: 045-resource-management  
**Date**: October 21, 2025  
**Phase**: 1 - Database Schema Design

## Overview

This document defines the complete database schema for the Resource Management System, including all 5 resource types (Costumes, Crew, Equipment, Props, Locations) and supporting tables.

---

## Entity Relationship Diagram

```
teams (existing)
  ↓ 1:N
costumes, crew_members, equipment, props, locations
  ↓ 1:N
resource_photos
  
crew_members
  ↓ N:1 (optional)
auth.users (via crew_account_links)

costumes, props
  ↓ 1:N
lifecycle_history
```

---

## Tables

### 1. costumes

Tracks cosplay outfits with complete lifecycle from planning to disposal.

```sql
CREATE TABLE costumes (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Core Fields
  character_name TEXT NOT NULL,
  series TEXT,
  costume_type TEXT, -- e.g., "armor", "dress", "casual", "formal"
  
  -- Lifecycle State
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN (
    'planned', 'acquiring', 'in-progress', 'ready', 'owned',
    'sold', 'damaged', 'rented', 'lost', 'stored', 'loaned'
  )),
  
  -- Cost Tracking
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  
  -- Dates
  completion_date DATE,
  
  -- Storage & Location
  storage_location TEXT,
  
  -- State-Specific Metadata (JSONB for flexibility)
  state_metadata JSONB DEFAULT '{}', -- { sale_price, sale_date, damage_details, borrower, return_date, etc. }
  
  -- Notes
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

-- Indexes
CREATE INDEX idx_costumes_team ON costumes(team_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_costumes_status ON costumes(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_costumes_search ON costumes USING GIN(search_vector);
CREATE INDEX idx_costumes_deleted ON costumes(deleted_at) WHERE deleted_at IS NOT NULL;

-- RLS Policies
ALTER TABLE costumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view their team's costumes"
  ON costumes FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can insert costumes"
  ON costumes FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can update their team's costumes"
  ON costumes FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can delete their team's costumes"
  ON costumes FOR DELETE
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_costumes_updated_at
  BEFORE UPDATE ON costumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

### 2. crew_members

Directory of people who work with the team (photographers, assistants, models, etc.).

```sql
CREATE TABLE crew_members (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Core Fields
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN (
    'photographer', 'assistant', 'makeup_artist', 'model', 'coordinator', 'other'
  )),
  
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
    setweight(to_tsvector('english', coalesce(role, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(notes, '')), 'C')
  ) STORED,
  
  -- Soft Delete
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_crew_team ON crew_members(team_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_crew_role ON crew_members(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_crew_favorite ON crew_members(is_favorite) WHERE is_favorite = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_crew_search ON crew_members USING GIN(search_vector);
CREATE INDEX idx_crew_deleted ON crew_members(deleted_at) WHERE deleted_at IS NOT NULL;

-- RLS Policies (same pattern as costumes)
ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;

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

-- Trigger
CREATE TRIGGER update_crew_updated_at
  BEFORE UPDATE ON crew_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

### 3. crew_account_links

Links crew members to Cosplans user accounts (for shoot invitations).

```sql
CREATE TABLE crew_account_links (
  -- Composite Primary Key
  crew_member_id UUID NOT NULL REFERENCES crew_members(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadata
  linked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  linked_by UUID NOT NULL REFERENCES auth.users(id),
  
  PRIMARY KEY (crew_member_id, user_id)
);

-- Indexes
CREATE INDEX idx_crew_links_user ON crew_account_links(user_id);

-- RLS Policies
ALTER TABLE crew_account_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view crew links for their team"
  ON crew_account_links FOR SELECT
  USING (
    crew_member_id IN (
      SELECT id FROM crew_members 
      WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Team members can create crew links"
  ON crew_account_links FOR INSERT
  WITH CHECK (
    crew_member_id IN (
      SELECT id FROM crew_members 
      WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Team members can delete crew links"
  ON crew_account_links FOR DELETE
  USING (
    crew_member_id IN (
      SELECT id FROM crew_members 
      WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    )
  );
```

---

### 4. equipment

Photography and production gear inventory.

```sql
CREATE TABLE equipment (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Core Fields
  name TEXT NOT NULL,
  equipment_type TEXT NOT NULL CHECK (equipment_type IN (
    'camera', 'lens', 'lighting', 'tripod', 'backdrop', 'audio', 'other'
  )),
  brand TEXT,
  model TEXT,
  
  -- Condition & Ownership
  condition TEXT NOT NULL DEFAULT 'good' CHECK (condition IN (
    'excellent', 'good', 'fair', 'needs_repair', 'broken'
  )),
  ownership_status TEXT NOT NULL DEFAULT 'owned' CHECK (ownership_status IN (
    'owned', 'rented', 'borrowed'
  )),
  
  -- Purchase Info
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  
  -- Rental/Borrow Info (JSONB)
  rental_info JSONB DEFAULT '{}', -- { return_date, rental_cost, rental_company, borrower_name, etc. }
  
  -- Notes
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

-- Indexes
CREATE INDEX idx_equipment_team ON equipment(team_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_equipment_type ON equipment(equipment_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_equipment_condition ON equipment(condition) WHERE deleted_at IS NULL;
CREATE INDEX idx_equipment_search ON equipment USING GIN(search_vector);
CREATE INDEX idx_equipment_deleted ON equipment(deleted_at) WHERE deleted_at IS NOT NULL;

-- RLS Policies (same pattern)
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

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

-- Trigger
CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

### 5. props

Costume accessories, weapons, wigs, etc. with lifecycle tracking.

```sql
CREATE TABLE props (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Core Fields
  name TEXT NOT NULL,
  prop_type TEXT, -- e.g., "weapon", "accessory", "wig", "jewelry"
  character_series TEXT, -- Which character/series this prop is for
  
  -- Lifecycle State (same as costumes)
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN (
    'planned', 'acquiring', 'in-progress', 'ready', 'owned',
    'sold', 'damaged', 'rented', 'lost', 'stored', 'loaned'
  )),
  
  -- Cost Tracking
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  
  -- Storage & Condition
  storage_location TEXT,
  condition TEXT,
  
  -- State-Specific Metadata
  state_metadata JSONB DEFAULT '{}',
  
  -- Notes
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

-- Indexes (same pattern as costumes)
CREATE INDEX idx_props_team ON props(team_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_props_status ON props(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_props_search ON props USING GIN(search_vector);
CREATE INDEX idx_props_deleted ON props(deleted_at) WHERE deleted_at IS NOT NULL;

-- RLS Policies (same pattern)
ALTER TABLE props ENABLE ROW LEVEL SECURITY;

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

-- Trigger
CREATE TRIGGER update_props_updated_at
  BEFORE UPDATE ON props
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

### 6. locations

Shoot location library (studios, parks, convention venues).

```sql
CREATE TABLE locations (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Core Fields
  name TEXT NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN (
    'studio', 'outdoor', 'convention', 'private_residence', 'other'
  )),
  
  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Details
  accessibility_notes TEXT,
  parking_info TEXT,
  cost_info TEXT, -- e.g., "Free", "$50/hour", "Requires permit"
  
  -- Metadata
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  
  -- Search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(address, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(notes, '')), 'C')
  ) STORED,
  
  -- Soft Delete
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_locations_team ON locations(team_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_locations_type ON locations(location_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_locations_favorite ON locations(is_favorite) WHERE is_favorite = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_locations_search ON locations USING GIN(search_vector);
CREATE INDEX idx_locations_deleted ON locations(deleted_at) WHERE deleted_at IS NOT NULL;

-- RLS Policies (same pattern)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

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

-- Trigger
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

### 7. resource_photos

Photos for all resource types (polymorphic relationship).

```sql
CREATE TABLE resource_photos (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Polymorphic Foreign Key
  resource_type TEXT NOT NULL CHECK (resource_type IN (
    'costume', 'crew_member', 'equipment', 'prop', 'location'
  )),
  resource_id UUID NOT NULL,
  
  -- Photo Details
  storage_path TEXT NOT NULL, -- Supabase Storage path
  filename TEXT NOT NULL,
  file_size INTEGER NOT NULL, -- bytes
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  
  -- Ordering & Metadata
  display_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  is_primary BOOLEAN DEFAULT FALSE, -- First photo shown in cards
  
  -- Timestamps
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_photos_resource ON resource_photos(resource_type, resource_id);
CREATE INDEX idx_photos_primary ON resource_photos(resource_type, resource_id, is_primary) WHERE is_primary = TRUE;

-- RLS Policies
ALTER TABLE resource_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view photos for resources they can access"
  ON resource_photos FOR SELECT
  USING (
    CASE resource_type
      WHEN 'costume' THEN resource_id IN (
        SELECT id FROM costumes WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'crew_member' THEN resource_id IN (
        SELECT id FROM crew_members WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'equipment' THEN resource_id IN (
        SELECT id FROM equipment WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'prop' THEN resource_id IN (
        SELECT id FROM props WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'location' THEN resource_id IN (
        SELECT id FROM locations WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
    END
  );

CREATE POLICY "Users can insert photos for resources they can access"
  ON resource_photos FOR INSERT
  WITH CHECK (
    CASE resource_type
      WHEN 'costume' THEN resource_id IN (
        SELECT id FROM costumes WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'crew_member' THEN resource_id IN (
        SELECT id FROM crew_members WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'equipment' THEN resource_id IN (
        SELECT id FROM equipment WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'prop' THEN resource_id IN (
        SELECT id FROM props WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'location' THEN resource_id IN (
        SELECT id FROM locations WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
    END
  );

CREATE POLICY "Users can delete photos for resources they can access"
  ON resource_photos FOR DELETE
  USING (
    CASE resource_type
      WHEN 'costume' THEN resource_id IN (
        SELECT id FROM costumes WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'crew_member' THEN resource_id IN (
        SELECT id FROM crew_members WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'equipment' THEN resource_id IN (
        SELECT id FROM equipment WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'prop' THEN resource_id IN (
        SELECT id FROM props WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'location' THEN resource_id IN (
        SELECT id FROM locations WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
    END
  );
```

---

### 8. lifecycle_history

Tracks state transitions for costumes and props (audit trail).

```sql
CREATE TABLE lifecycle_history (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Polymorphic Foreign Key
  resource_type TEXT NOT NULL CHECK (resource_type IN ('costume', 'prop')),
  resource_id UUID NOT NULL,
  
  -- State Transition
  from_status TEXT,
  to_status TEXT NOT NULL,
  
  -- Metadata
  state_metadata JSONB DEFAULT '{}', -- Snapshot of state-specific data at transition
  notes TEXT,
  
  -- Audit
  changed_by UUID NOT NULL REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_lifecycle_resource ON lifecycle_history(resource_type, resource_id);
CREATE INDEX idx_lifecycle_changed_at ON lifecycle_history(changed_at DESC);

-- RLS Policies
ALTER TABLE lifecycle_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view lifecycle history for resources they can access"
  ON lifecycle_history FOR SELECT
  USING (
    CASE resource_type
      WHEN 'costume' THEN resource_id IN (
        SELECT id FROM costumes WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
      WHEN 'prop' THEN resource_id IN (
        SELECT id FROM props WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
      )
    END
  );

CREATE POLICY "System can insert lifecycle history"
  ON lifecycle_history FOR INSERT
  WITH CHECK (true); -- Inserted by triggers, not directly by users
```

---

## Helper Functions

### update_updated_at_column()

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### record_lifecycle_change()

```sql
CREATE OR REPLACE FUNCTION record_lifecycle_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO lifecycle_history (
      resource_type,
      resource_id,
      from_status,
      to_status,
      state_metadata,
      changed_by
    ) VALUES (
      TG_ARGV[0], -- 'costume' or 'prop'
      NEW.id,
      OLD.status,
      NEW.status,
      NEW.state_metadata,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to costumes
CREATE TRIGGER record_costume_lifecycle_change
  AFTER UPDATE ON costumes
  FOR EACH ROW
  EXECUTE FUNCTION record_lifecycle_change('costume');

-- Apply to props
CREATE TRIGGER record_prop_lifecycle_change
  AFTER UPDATE ON props
  FOR EACH ROW
  EXECUTE FUNCTION record_lifecycle_change('prop');
```

---

## Validation Rules

### Photo Limits

- Minimum 1 photo per resource (enforced in application)
- Maximum 10 photos per resource (enforced in application)
- Maximum 5MB per photo (enforced client-side before upload)

### Lifecycle Transitions

- Enforced in application layer using finite state machine
- Invalid transitions blocked with option for override confirmation
- All transitions logged in `lifecycle_history`

### Team Scoping

- All resources MUST have `team_id`
- RLS policies enforce team-based access
- No cross-team resource sharing in MVP

---

## Storage Buckets (Supabase Storage)

### resource-photos

```sql
-- Bucket configuration
{
  "id": "resource-photos",
  "name": "resource-photos",
  "public": false,
  "file_size_limit": 5242880, -- 5MB
  "allowed_mime_types": ["image/jpeg", "image/png", "image/webp"]
}

-- RLS Policies
CREATE POLICY "Users can upload photos for their team's resources"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resource-photos' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM teams 
      WHERE id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can view photos for their team's resources"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resource-photos' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM teams 
      WHERE id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can delete photos for their team's resources"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resource-photos' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM teams 
      WHERE id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    )
  );
```

**Storage Path Structure**:
```
resource-photos/
  {teamId}/
    costumes/
      {costumeId}/
        {photoId}.webp
    crew/
      {crewId}/
        {photoId}.webp
    equipment/
      {equipmentId}/
        {photoId}.webp
    props/
      {propId}/
        {photoId}.webp
    locations/
      {locationId}/
        {photoId}.webp
```

---

## Migration Strategy

1. Create all tables in single migration file
2. Create helper functions
3. Create triggers
4. Create RLS policies
5. Create storage bucket and policies
6. Verify with test data

**Migration File**: `supabase/migrations/[timestamp]_resource_management.sql`

---

## Next Steps

✅ **Phase 1 Data Model Complete**

**Continue Phase 1**:
1. Generate API contracts in `contracts/` directory
2. Create `quickstart.md` with setup instructions
3. Update agent context

**Then Phase 2** (via `/speckit.tasks`):
1. Generate task breakdown
2. Implement database migration
3. Build services and routes
4. Write tests
