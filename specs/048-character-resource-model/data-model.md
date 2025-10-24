# Data Model: Character-Centric Resource Model

**Feature**: 048-character-resource-model  
**Date**: October 24, 2025  
**Phase**: 1 - Data Model & Contracts

## Overview

This document defines the database schema for the character-centric resource model, including new entities (Character, Wig), enhanced entities (Costume), and junction tables for many-to-many relationships.

## Entity Relationship Diagram

```
┌─────────────┐
│  Character  │
│             │
│ - id        │
│ - name      │
│ - series    │
│ - aliases   │
│ - images[]  │
└──────┬──────┘
       │
       │ 1:1 ────────────────────────┐
       │                              │
       │ 1:many                       │
       ├───────────────┐              │
       │               │              │
       ▼               ▼              ▼
┌──────────┐    ┌──────────┐   ┌───────────┐
│character_│    │character_│   │character_ │
│  wigs    │    │  props   │   │ costumes  │
│          │    │          │   │           │
│ many:many│    │ many:many│   │   1:1     │
└────┬─────┘    └────┬─────┘   └─────┬─────┘
     │               │                │
     ▼               ▼                ▼
┌─────────┐    ┌─────────┐     ┌──────────┐
│   Wig   │    │   Prop  │     │ Costume  │
│         │    │         │     │          │
│ - tasks │    │ (exist) │     │ + version│
│ - mater.│    │         │     │ + pattern│
└─────────┘    └─────────┘     └──────────┘
```

---

## New Entities

### 1. Character

**Purpose**: Central organizational hub for cosplay projects, linking all resources for a specific character

**Table**: `characters`

```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  
  -- Identity
  character_name TEXT NOT NULL,
  series_name TEXT NOT NULL,
  source_medium TEXT NOT NULL CHECK (source_medium IN (
    'anime', 'manga', 'video_game', 'movie', 'tv_show', 
    'book', 'comic', 'stage_production', 'original'
  )),
  
  -- Aliases (comma-separated for flexible search)
  aliases TEXT, -- e.g., "Saber, Artoria Pendragon, Altria Pendragon"
  
  -- Description
  appearance_description TEXT,
  personality_notes TEXT,
  
  -- Images (R2 URLs stored as JSONB array)
  reference_images JSONB DEFAULT '[]'::jsonb, -- [{"url": "...", "filename": "..."}]
  
  -- Completion tracking (cached)
  completion_percentage INTEGER DEFAULT 0,
  completion_calculated_at TIMESTAMPTZ,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ, -- Soft delete (6-month retention)
  
  CONSTRAINT valid_completion CHECK (completion_percentage >= 0 AND completion_percentage <= 100)
);

-- Indexes
CREATE INDEX idx_characters_team ON characters(team_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_characters_series ON characters(series_name) WHERE deleted_at IS NULL;
CREATE INDEX idx_characters_source_medium ON characters(source_medium) WHERE deleted_at IS NULL;

-- Full-text search index for name + aliases + series
CREATE INDEX idx_characters_search ON characters USING gin(
  to_tsvector('english', character_name || ' ' || COALESCE(aliases, '') || ' ' || series_name)
) WHERE deleted_at IS NULL;
```

**Fields**:
- `character_name`: Primary name of character (e.g., "Saber")
- `series_name`: Series/franchise (e.g., "Fate/stay night")
- `source_medium`: Original medium (anime, manga, game, etc.)
- `aliases`: Comma-separated alternate names for search (e.g., "Saber, Artoria Pendragon")
- `appearance_description`: Physical description (hair color, outfit details, etc.)
- `personality_notes`: Character traits, personality references
- `reference_images`: Array of R2 image URLs with metadata (1-10 images)
- `completion_percentage`: Cached value (0-100)
- `completion_calculated_at`: Timestamp of last calculation

**Relationships**:
- One-to-one with Costume (via `character_costumes` junction)
- Many-to-many with Wig (via `character_wigs` junction)
- Many-to-many with Prop (via `character_props` junction)
- Many-to-many with Accessory (via `character_accessories` junction)

**RLS Policies**:
```sql
-- Users can only see characters from their teams
CREATE POLICY characters_team_isolation ON characters
  FOR SELECT
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Users can only create characters in teams they're members of
CREATE POLICY characters_team_create ON characters
  FOR INSERT
  WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Users can only update/delete characters in their teams
CREATE POLICY characters_team_update ON characters
  FOR UPDATE
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY characters_team_delete ON characters
  FOR DELETE
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));
```

---

### 2. Wig (Separated from Accessories)

**Purpose**: Dedicated resource for wig styling projects with task tracking, material requirements, and cost management

**Table**: `wigs`

```sql
CREATE TABLE wigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  
  -- Basic Info
  wig_name TEXT NOT NULL,
  color TEXT,
  length TEXT CHECK (length IN ('short', 'medium', 'long', 'extra_long')),
  fiber_type TEXT CHECK (fiber_type IN ('synthetic', 'human_hair', 'blend')),
  base_wig_brand TEXT, -- e.g., "Arda Wigs", "Epic Cosplay"
  base_wig_model TEXT,
  
  -- Status (free transition between any states)
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN (
    'planned', 'ordered', 'received', 'in_progress', 
    'completed', 'needs_restyling', 'damaged'
  )),
  
  -- Cost Tracking
  base_wig_cost DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  
  -- Time Tracking (Hybrid: automatic with manual override)
  time_spent_auto INTEGER, -- Minutes, calculated from status_history
  time_spent_manual INTEGER, -- Minutes, user override (nullable)
  status_history JSONB DEFAULT '[]'::jsonb, -- [{status: '...', timestamp: '...'}]
  completion_date TIMESTAMPTZ,
  
  -- Notes
  styling_notes TEXT, -- Techniques used, tips for restyling
  
  -- Images (R2 URLs - progress photos)
  progress_photos JSONB DEFAULT '[]'::jsonb, -- [{"url": "...", "filename": "..."}]
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  CONSTRAINT positive_cost CHECK (base_wig_cost >= 0)
);

-- Indexes
CREATE INDEX idx_wigs_team ON wigs(team_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_wigs_status ON wigs(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_wigs_created_at ON wigs(created_at DESC) WHERE deleted_at IS NULL;
```

**Fields**:
- `wig_name`: User-defined name (e.g., "Saber Blonde Wig", "Generic Short Black")
- `color`: Hair color
- `length`: Short (chin), Medium (shoulders), Long (waist), Extra Long (below waist)
- `fiber_type`: Synthetic, Human Hair, or Blend
- `base_wig_brand`, `base_wig_model`: Base wig product info
- `status`: Current state with free transitions
- `time_spent_auto`: Calculated elapsed time (minutes)
- `time_spent_manual`: User-entered actual time (minutes, nullable)
- `status_history`: JSONB array tracking all status changes with timestamps
- `styling_notes`: Free-form notes about techniques, modifications

**Relationships**:
- Many-to-many with Character (via `character_wigs`)
- One-to-many with WigTask
- One-to-many with WigMaterial

**RLS Policies**: Same pattern as characters (team-based isolation)

---

### 3. WigTask

**Purpose**: Individual styling tasks for wig projects with due dates and completion tracking

**Table**: `wig_tasks`

```sql
CREATE TABLE wig_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wig_id UUID NOT NULL REFERENCES wigs(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wig_tasks_wig ON wig_tasks(wig_id);
CREATE INDEX idx_wig_tasks_status ON wig_tasks(status);
CREATE INDEX idx_wig_tasks_due_date ON wig_tasks(due_date) WHERE status != 'completed';
```

**Example Tasks**:
- "Cut wefts for ahoge spike"
- "Style bangs and side pieces"
- "Heat-seal pointed edges"
- "Dye blonde to platinum"

---

### 4. WigMaterial

**Purpose**: Material requirements for wig styling with purchase tracking and cost calculation

**Table**: `wig_materials`

```sql
CREATE TABLE wig_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wig_id UUID NOT NULL REFERENCES wigs(id) ON DELETE CASCADE,
  
  material_name TEXT NOT NULL, -- e.g., "Blonde weft pack", "Got2B gel", "Fabric glue"
  quantity TEXT, -- e.g., "2 packs", "1 bottle"
  cost DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  
  purchased BOOLEAN DEFAULT FALSE,
  purchase_link TEXT, -- URL to product page
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wig_materials_wig ON wig_materials(wig_id);
```

**Total Wig Cost Calculation**:
```sql
SELECT 
  w.base_wig_cost + COALESCE(SUM(wm.cost), 0) as total_cost
FROM wigs w
LEFT JOIN wig_materials wm ON w.id = wm.wig_id
WHERE w.id = $1
GROUP BY w.id, w.base_wig_cost;
```

---

### 5. OutfitTask

**Purpose**: Construction tasks for outfit/costume projects with due dates and completion tracking

**Table**: `outfit_tasks`

```sql
CREATE TABLE outfit_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  costume_id UUID NOT NULL REFERENCES costumes(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_outfit_tasks_costume ON outfit_tasks(costume_id);
CREATE INDEX idx_outfit_tasks_status ON outfit_tasks(status);
CREATE INDEX idx_outfit_tasks_due_date ON outfit_tasks(due_date) WHERE status != 'completed';
```

**Example Tasks**:
- "Cut fabric pieces from pattern"
- "Sew bodice seams"
- "Attach armor plates"
- "Install invisible zipper"

---

## Junction Tables (Many-to-Many Relationships)

### 6. CharacterWig

**Purpose**: Links wigs to characters (many-to-many: one wig can be reused across multiple characters)

```sql
CREATE TABLE character_wigs (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  wig_id UUID NOT NULL REFERENCES wigs(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (character_id, wig_id)
);

CREATE INDEX idx_character_wigs_character ON character_wigs(character_id);
CREATE INDEX idx_character_wigs_wig ON character_wigs(wig_id);
```

### 7. CharacterProp

**Purpose**: Links props to characters (many-to-many: props can be reused)

```sql
CREATE TABLE character_props (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  prop_id UUID NOT NULL REFERENCES props(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (character_id, prop_id)
);

CREATE INDEX idx_character_props_character ON character_props(character_id);
CREATE INDEX idx_character_props_prop ON character_props(prop_id);
```

### 8. CharacterAccessory

**Purpose**: Links accessories to characters (many-to-many)

```sql
CREATE TABLE character_accessories (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  accessory_id UUID NOT NULL REFERENCES accessories(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (character_id, accessory_id)
);

CREATE INDEX idx_character_accessories_character ON character_accessories(character_id);
CREATE INDEX idx_character_accessories_accessory ON character_accessories(accessory_id);
```

### 9. CharacterCostume

**Purpose**: Links costumes to characters (one-to-one: each costume represents a specific character version)

```sql
CREATE TABLE character_costumes (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  costume_id UUID NOT NULL REFERENCES costumes(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (character_id, costume_id),
  UNIQUE(costume_id) -- Enforce one-to-one: each costume linked to only one character
);

CREATE INDEX idx_character_costumes_character ON character_costumes(character_id);
CREATE UNIQUE INDEX idx_character_costumes_costume ON character_costumes(costume_id);
```

---

## Enhanced Entities

### 10. Costume (Enhanced)

**Purpose**: Existing costume entity enhanced with version tracking, pattern files, and construction tasks

**Modifications to `costumes` table**:

```sql
ALTER TABLE costumes ADD COLUMN version TEXT; -- Required when linked to character
ALTER TABLE costumes ADD COLUMN pattern_files JSONB DEFAULT '[]'::jsonb; -- [{url, name, brand, pattern_number, size, cost}]
ALTER TABLE costumes ADD COLUMN alteration_notes TEXT;
ALTER TABLE costumes ADD COLUMN time_spent_auto INTEGER; -- Minutes
ALTER TABLE costumes ADD COLUMN time_spent_manual INTEGER; -- Minutes, nullable
ALTER TABLE costumes ADD COLUMN status_history JSONB DEFAULT '[]'::jsonb;

-- Add constraint: version required when linked to character
CREATE OR REPLACE FUNCTION check_costume_version()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM character_costumes WHERE costume_id = NEW.id) 
     AND NEW.version IS NULL THEN
    RAISE EXCEPTION 'Version is required for costumes linked to characters';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_costume_version
BEFORE INSERT OR UPDATE ON costumes
FOR EACH ROW EXECUTE FUNCTION check_costume_version();
```

**New Fields**:
- `version`: Text field for version/adaptation (e.g., "Fate/stay night anime", "Fate/Grand Order", "Personal redesign")
- `pattern_files`: JSONB array of pattern file metadata with R2 URLs
- `alteration_notes`: Free-form notes about modifications to patterns
- `time_spent_auto`: Automatic time calculation (same as wigs)
- `time_spent_manual`: Manual time override (same as wigs)
- `status_history`: Track status changes for time calculation

**Pattern File Structure**:
```json
[
  {
    "url": "https://pub-xxx.r2.dev/patterns/costume-id/simplicity-8234.pdf",
    "filename": "Simplicity 8234 - Size 12.pdf",
    "brand": "Simplicity",
    "pattern_number": "8234",
    "size": "12",
    "cost": 15.99,
    "notes": "Lengthen bodice by 2 inches, widen hips by 1 inch"
  }
]
```

---

## Migration Queries

### Create All New Tables

See `supabase/migrations/[timestamp]_create_character_resource_model.sql` for complete migration.

### Migrate Wigs from Accessories

```sql
-- Step 1: Create wigs table (done in migration)

-- Step 2: Copy wig data
INSERT INTO wigs (
  id, team_id, wig_name, color, length, fiber_type,
  base_wig_brand, status, base_wig_cost, currency,
  styling_notes, created_by, created_at, updated_at
)
SELECT 
  id, team_id, name as wig_name, 
  metadata->>'color' as color,
  CASE 
    WHEN metadata->>'length' IN ('short', 'medium', 'long', 'extra_long') 
    THEN metadata->>'length'
    ELSE 'medium' -- Default if not specified
  END as length,
  COALESCE(metadata->>'fiber_type', 'synthetic') as fiber_type,
  metadata->>'brand' as base_wig_brand,
  status,
  CAST(COALESCE(cost, 0) AS DECIMAL(10,2)) as base_wig_cost,
  'USD' as currency,
  notes as styling_notes,
  created_by, created_at, updated_at
FROM accessories
WHERE type = 'wig' OR category = 'wig'
  AND deleted_at IS NULL;

-- Step 3: Verify migration
SELECT 
  (SELECT COUNT(*) FROM accessories WHERE type = 'wig' AND deleted_at IS NULL) as source_count,
  (SELECT COUNT(*) FROM wigs WHERE deleted_at IS NULL) as migrated_count;

-- Step 4: After verification (30 days), delete old wig records
-- DELETE FROM accessories WHERE type = 'wig';
```

---

## Validation Rules

### Character
- `character_name`: Required, max 200 chars
- `series_name`: Required, max 200 chars
- `source_medium`: Must be one of enum values
- `aliases`: Optional, max 500 chars
- `reference_images`: Max 10 images, each URL max 500 chars
- `completion_percentage`: 0-100

### Wig
- `wig_name`: Required, max 200 chars
- `color`: Optional, max 50 chars
- `length`: Must be one of enum values
- `fiber_type`: Must be one of enum values
- `status`: Must be one of enum values
- `base_wig_cost`: >= 0
- `time_spent_auto`, `time_spent_manual`: >= 0

### Costume (Enhanced)
- `version`: Required when linked to character (via trigger)
- `pattern_files`: Max 20 patterns per costume
- Each pattern file URL max 500 chars

---

## Query Performance Targets

- Character detail with all resources: <2 seconds (SC-004)
- Character list with completion percentages: <1 second for 100 characters
- Character search (name + aliases + series): <500ms (SC-009)
- Wig cost calculation (base + materials): <100ms
- Completion percentage recalculation: <500ms (SC-006)

All indexes and query patterns designed to meet these targets.

