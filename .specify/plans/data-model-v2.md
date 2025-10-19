# Data Model & Schema Design (Updated for Crew Management)

**Created**: October 16, 2025  
**Updated**: October 16, 2025  
**Database**: Supabase PostgreSQL  
**Normalization**: Third Normal Form (3NF)

---

## Core Entities

### 1. User

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  oauth_provider TEXT NOT NULL, -- 'google', 'github', 'apple'
  oauth_id TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  analytics_disabled BOOLEAN DEFAULT FALSE,
  email_preferences JSONB DEFAULT '{"reminders": true, "team_updates": true}',
  account_deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Why JSONB for email_preferences: Single JSON object easier than separate table
-- Why oauth fields: Supports multiple OAuth providers per user
```

### 2. Team

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by_id UUID REFERENCES users(id) NOT NULL,
  storage_used_bytes BIGINT DEFAULT 0,
  storage_limit_bytes BIGINT DEFAULT 2147483648, -- 2GB free tier
  api_calls_today INT DEFAULT 0,
  api_call_limit INT DEFAULT 1000, -- Free tier
  subscription_tier TEXT DEFAULT 'free', -- 'free' or 'paid'
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- storage_used_bytes: Updated on image upload
-- api_calls_today: Reset daily via cron job
-- subscription_tier: Determines feature access
```

### 3. Team Member

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  role TEXT NOT NULL, -- 'admin', 'member', 'viewer'
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Enforce: Only one role per user per team
-- Permissions derived from role (see permission matrix below)
-- IMPORTANT: This is app-level access control, not shoot crew assignment
```

### 4. Crew (Personnel Master)

```sql
CREATE TABLE crew (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) NOT NULL,

  -- Personnel information
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,

  -- External person indicator (not an app user)
  is_app_user BOOLEAN DEFAULT FALSE,
  app_user_id UUID REFERENCES users(id),

  -- Contact info access control
  created_by_id UUID REFERENCES users(id) NOT NULL, -- Who added this crew member

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_crew_per_team UNIQUE(team_id, email)
);

-- Crew represents individuals who have worked with the team
-- Email used as secondary unique key (crew member with same email across shoots)
-- Contact info (email, phone) access-controlled (admins only)
-- is_app_user + app_user_id: Track if crew member is also a team member
-- Indexes: team_id (list all crew for team), app_user_id (find crew by user)
```

### 5. Shoot

```sql
CREATE TABLE shoots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE,
  location_name TEXT,
  location_lat FLOAT,
  location_lon FLOAT,
  notes TEXT,
  budget_usd DECIMAL(10, 2),

  -- Workflow state
  workflow_state TEXT DEFAULT 'idea', -- 'idea', 'planning', 'scheduled', 'editing', 'posted', 'complete'

  -- Image references
  reference_image_ids UUID[] DEFAULT ARRAY[]::UUID[],
  progress_photo_ids UUID[] DEFAULT ARRAY[]::UUID[],

  -- Real-time sync
  version INT DEFAULT 0, -- Incremented on edit, used for conflict detection
  last_modified_by_id UUID REFERENCES users(id),

  created_by_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- version: Required for operational transform conflict detection
-- Indexes: team_id (filter shoots by team), scheduled_date (calendar view)
-- IMPORTANT: No direct crew assignment here; use shoot_crew table
```

### 6. Shoot Crew Assignment

```sql
CREATE TABLE shoot_crew (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoot_id UUID REFERENCES shoots(id) NOT NULL,
  crew_id UUID REFERENCES crew(id) NOT NULL,

  -- Multiple roles per crew member on a shoot
  roles TEXT[] NOT NULL, -- e.g., ARRAY['photographer', 'assistant']
  -- Valid roles: 'photographer', 'cosplayer', 'makeup_artist', 'prop_master', 'hair_stylist', 'assistant', 'custom'

  notes TEXT, -- Role-specific notes (e.g., "Bringing camera equipment")

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(shoot_id, crew_id)
);

-- One row per crew member per shoot (UNIQUE constraint)
-- roles array: supports multiple roles (photographer + assistant)
-- Indexes: shoot_id (find crew for shoot), crew_id (find shoots for crew member)
-- IMPORTANT: This is informational only; no permission enforcement
```

### 7. Costume

```sql
CREATE TABLE costumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) NOT NULL,
  shoot_id UUID REFERENCES shoots(id),

  name TEXT NOT NULL,
  character_name TEXT,
  source_material TEXT, -- 'anime', 'game', 'movie', 'original'
  description TEXT,

  -- Lifecycle tracking (per Constitution §IV)
  lifecycle_state TEXT NOT NULL DEFAULT 'planned',
  -- States: planned, acquiring, in_progress, ready, owned,
  --         sold, damaged, rented, lost, stored, loaned
  lifecycle_history JSONB NOT NULL DEFAULT '[]', -- [{state, changed_at, changed_by_id, notes}]

  -- Financial tracking
  estimated_cost_usd DECIMAL(10, 2),
  actual_cost_usd DECIMAL(10, 2),
  sale_price_usd DECIMAL(10, 2),
  sale_date DATE,

  -- Damage/repair tracking
  damage_notes TEXT,
  repair_cost_usd DECIMAL(10, 2),

  -- Rental tracking
  rental_start_date DATE,
  rental_end_date DATE,
  rental_cost_usd DECIMAL(10, 2),
  rental_borrower_name TEXT,

  -- Storage/loan tracking
  storage_location TEXT,
  loaned_to_name TEXT,
  loan_return_date DATE,

  -- Loss incident tracking
  lost_date DATE,
  loss_incident_description TEXT,

  -- Media
  reference_image_ids UUID[] DEFAULT ARRAY[]::UUID[],
  progress_photo_ids UUID[] DEFAULT ARRAY[]::UUID[],

  -- Real-time sync
  version INT DEFAULT 0,
  last_modified_by_id UUID REFERENCES users(id),

  created_by_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- lifecycle_history: JSON array tracks state transitions for audit trail
-- Multiple financial fields: Support all lifecycle states (sale, damage, rental, loss)
-- Indexes: team_id, lifecycle_state (filter by status)
```

### 8. Prop

```sql
CREATE TABLE props (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) NOT NULL,
  shoot_id UUID REFERENCES shoots(id),

  name TEXT NOT NULL,
  description TEXT,
  material TEXT,

  -- Lifecycle tracking (same as costume)
  lifecycle_state TEXT NOT NULL DEFAULT 'planned',
  lifecycle_history JSONB NOT NULL DEFAULT '[]',

  -- Financial tracking
  estimated_cost_usd DECIMAL(10, 2),
  actual_cost_usd DECIMAL(10, 2),
  sale_price_usd DECIMAL(10, 2),

  -- Media
  reference_image_ids UUID[] DEFAULT ARRAY[]::UUID[],
  progress_photo_ids UUID[] DEFAULT ARRAY[]::UUID[],

  -- Real-time sync
  version INT DEFAULT 0,
  last_modified_by_id UUID REFERENCES users(id),

  created_by_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Similar structure to Costume for consistency
```

### 9. Image

```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) NOT NULL,

  -- Original upload metadata
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL, -- 'image/webp', 'image/jpeg'
  original_size_bytes BIGINT NOT NULL,

  -- Generated sizes
  sizes JSONB NOT NULL, -- {320: {url, size_bytes}, 640: {...}, 1280: {...}, 2560: {...}}
  thumbnail_url TEXT,

  -- Storage location (Supabase Storage path)
  storage_path TEXT NOT NULL,

  -- Linked entities
  shoot_id UUID REFERENCES shoots(id),
  costume_id UUID REFERENCES costumes(id),
  prop_id UUID REFERENCES props(id),

  -- Usage tracking
  image_type TEXT NOT NULL, -- 'reference', 'progress', 'instagram_post'

  uploaded_by_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Separate table for images enables reuse across shoots/costumes/props
-- sizes JSONB: {320: {url: "...", size_bytes: 45000}, 640: {...}}
-- storage_path: "teams/{team_id}/images/{image_id}.webp"
```

### 10. Permission (Role-Based Access Control)

```sql
CREATE TABLE role_permissions (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL UNIQUE, -- 'owner', 'admin', 'member', 'viewer'

  -- Shoot permissions
  can_create_shoot BOOLEAN DEFAULT FALSE,
  can_edit_shoot BOOLEAN DEFAULT FALSE,
  can_delete_shoot BOOLEAN DEFAULT FALSE,
  can_view_shoot BOOLEAN DEFAULT FALSE,

  -- Costume/prop permissions
  can_create_costume BOOLEAN DEFAULT FALSE,
  can_edit_costume BOOLEAN DEFAULT FALSE,
  can_delete_costume BOOLEAN DEFAULT FALSE,

  -- Crew permissions (team-level, not per-shoot)
  can_manage_crew BOOLEAN DEFAULT FALSE, -- Can add/edit/remove crew from shoots
  can_view_crew_contact BOOLEAN DEFAULT TRUE, -- All members can view contact info

  -- Team permissions
  can_manage_team BOOLEAN DEFAULT FALSE,
  can_manage_members BOOLEAN DEFAULT FALSE,
  can_view_analytics BOOLEAN DEFAULT FALSE
);

-- Seed data:
INSERT INTO role_permissions (role, can_create_shoot, can_edit_shoot, can_delete_shoot,
  can_view_shoot, can_create_costume, can_edit_costume, can_delete_costume,
  can_manage_crew, can_view_crew_contact, can_manage_team, can_manage_members, can_view_analytics)
VALUES
  ('owner', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
  ('admin', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE),
  ('member', FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE),
  ('viewer', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE);

-- IMPORTANT: Crew roles (photographer, cosplayer, etc.) are NOT enforced in permissions
-- All permission enforcement is at team level (owner, admin, member, viewer)
-- Crew roles are purely informational (who participated in shoot)
-- Owner role reserved for future privilege expansion beyond admin
```

### 11. Analytics Events

```sql
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  context JSONB NOT NULL, -- {page: 'shoot_create', step: 1}
  timestamp TIMESTAMP DEFAULT NOW(),
  team_id UUID REFERENCES teams(id), -- Anonymous if NULL

  -- NO user_id, no PII, no content data
  CONSTRAINT no_pii_in_analytics CHECK (
    context::text NOT LIKE '%@%' AND -- No emails
    context::text NOT LIKE '%password%' AND
    context::text NOT LIKE '%token%'
  )
);

-- Indexes: (event_name, timestamp) for quick aggregation
-- Daily cron purges events older than 7 days
```

### 12. Analytics Metrics (Aggregated)

```sql
CREATE TABLE analytics_metrics (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  metric_date DATE NOT NULL,
  count INT DEFAULT 0,
  context_aggregates JSONB, -- {abandoned_step: 2, count: 45}, {abandoned_step: 3, count: 12}
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_name, metric_date)
);

-- Example query: SELECT * FROM analytics_metrics WHERE event_name = 'costume_form_abandon' AND metric_date >= NOW() - INTERVAL '30 days'
-- Result: See abandonment trends over last month
```

---

## Relationships & Constraints

```
User (1) ──── (N) Team via team_members
User (1) ──── (N) Shoot (created_by_id)
User (1) ──── (N) Costume (created_by_id)

Team (1) ──── (N) Shoot
Team (1) ──── (N) Costume
Team (1) ──── (N) Prop
Team (1) ──── (N) Image
Team (1) ──── (N) Crew ← NEW

Shoot (1) ──── (N) Costume
Shoot (1) ──── (N) Prop
Shoot (1) ──── (N) shoot_crew ← NEW junction table
shoot_crew (N) ──── (1) Crew

Image (N) ──── (0..1) Shoot
Image (N) ──── (0..1) Costume
Image (N) ──── (0..1) Prop

-- IMPORTANT: No direct shoot → crew relationship
-- Crew assignment is per-shoot via shoot_crew junction table
```

---

## Key Changes from Previous Model

### Added: Crew Table

- Persistent record of individuals who have worked with team
- Stores name, contact info (email, phone)
- Tracks collaboration history across shoots
- Supports both app users and external collaborators

### Added: Shoot Crew Assignment Table

- Junction table: shoot (1) ──── (N) crew via shoot_crew
- One row per crew member per shoot
- Supports multiple roles per crew member (array of role strings)
- Roles are purely informational (no permission enforcement)

### Modified: Team Members

- Clarified that team_members stores app-level access control
- Team roles (admin, member, viewer) do NOT translate to crew roles
- Crew assignment is separate from team membership

### Modified: Role Permissions

- Added `can_manage_crew` (add/edit/remove crew from shoots)
- Added `can_view_crew_contact` (see email/phone)
- Crew roles (photographer, cosplayer, etc.) NOT stored in role_permissions
- All enforcement is at team level; crew roles are metadata only

---

## Validation Rules

| Entity         | Field           | Rule                                                 |
| -------------- | --------------- | ---------------------------------------------------- |
| **Shoot**      | title           | NOT NULL, min 3 chars, max 200 chars                 |
| **Shoot**      | scheduled_date  | Must be >= TODAY for scheduled state                 |
| **Costume**    | lifecycle_state | Must be valid value (enum: planned, acquiring, etc.) |
| **Crew**       | name            | NOT NULL, min 2 chars, max 100 chars                 |
| **Crew**       | email           | Valid email format (if provided), unique per team    |
| **Shoot Crew** | roles           | NOT NULL, array length >= 1, valid role values       |
| **Image**      | mime_type       | Must be 'image/webp' or 'image/jpeg'                 |
| **Team**       | api_calls_today | If >= api_call_limit, return HTTP 429                |

---

## Indexes for Performance

```sql
-- Shoot queries
CREATE INDEX idx_shoots_team_id ON shoots(team_id);
CREATE INDEX idx_shoots_scheduled_date ON shoots(scheduled_date);
CREATE INDEX idx_shoots_workflow_state ON shoots(workflow_state);

-- Costume/prop queries
CREATE INDEX idx_costumes_team_id ON costumes(team_id);
CREATE INDEX idx_costumes_lifecycle_state ON costumes(lifecycle_state);

-- Crew queries
CREATE INDEX idx_crew_team_id ON crew(team_id);
CREATE INDEX idx_crew_app_user_id ON crew(app_user_id);
CREATE INDEX idx_shoot_crew_shoot_id ON shoot_crew(shoot_id);
CREATE INDEX idx_shoot_crew_crew_id ON shoot_crew(crew_id);

-- Image queries
CREATE INDEX idx_images_team_id ON images(team_id);
CREATE INDEX idx_images_shoot_id ON images(shoot_id);

-- Analytics queries
CREATE INDEX idx_analytics_events_event_name_timestamp ON analytics_events(event_name, timestamp);

-- Permission checks
CREATE INDEX idx_team_members_user_id_team_id ON team_members(user_id, team_id);
```

---

## Access Control Matrix

### Team-Level Permissions (app-wide)

| Action                     | Owner | Admin | Member | Viewer | Notes                            |
| -------------------------- | ----- | ----- | ------ | ------ | -------------------------------- |
| Create shoot               | ✅    | ✅    | ❌     | ❌     | Owner & admin only               |
| Edit shoot                 | ✅    | ✅    | ✅     | ❌     | Members can edit own shoots      |
| Delete shoot               | ✅    | ✅    | ❌     | ❌     | Owner & admin only               |
| View shoot                 | ✅    | ✅    | ✅     | ✅     | All team members                 |
| View crew contact info     | ✅    | ✅    | ✅     | ✅     | All members can view email/phone |
| Add/remove crew from shoot | ✅    | ✅    | ❌     | ❌     | Owner & admin only               |
| Manage team settings       | ✅    | ❌    | ❌     | ❌     | Owner only                       |
| Manage team members        | ✅    | ✅    | ❌     | ❌     | Owner & admin                    |
| View analytics             | ✅    | ✅    | ❌     | ❌     | Owner & admin only               |

### Crew Role Visibility

| Who Can See | Names  | Roles  | Contact Info |
| ----------- | ------ | ------ | ------------ |
| **Owner**   | ✅ All | ✅ All | ✅ Yes       |
| **Admin**   | ✅ All | ✅ All | ✅ Yes       |
| **Member**  | ✅ All | ✅ All | ✅ Yes       |
| **Viewer**  | ✅ All | ✅ All | ✅ Yes       |

---

## Migration Strategy

Phase 1 migrations (in order):

1. Create users, teams, team_members tables
2. Create shoots, costumes, props tables
3. Create crew table (NEW)
4. Create shoot_crew table (NEW)
5. Create images table
6. Create role_permissions table (seed with owner/admin/member/viewer)
7. Create analytics_events, analytics_metrics tables

Each migration includes:

- Forward script (CREATE TABLE, CREATE INDEX)
- Rollback script (DROP TABLE)
- Data validation tests
- Performance tests on each index

---

## Example Queries

### List crew for a shoot

```sql
SELECT
  c.id, c.name, c.email, sc.roles
FROM shoot_crew sc
JOIN crew c ON sc.crew_id = c.id
WHERE sc.shoot_id = 'shoot-123'
ORDER BY c.name;
```

### Find shoots crew member participated in (history)

```sql
SELECT
  s.id, s.title, s.scheduled_date, sc.roles
FROM shoot_crew sc
JOIN shoots s ON sc.shoot_id = s.id
WHERE sc.crew_id = 'crew-456' AND s.team_id = 'team-xyz'
ORDER BY s.scheduled_date DESC;
```

### Count crew by role across all shoots

```sql
SELECT
  role, COUNT(*) as count
FROM shoot_crew
CROSS JOIN LATERAL unnest(roles) AS role
WHERE shoot_id IN (SELECT id FROM shoots WHERE team_id = 'team-xyz')
GROUP BY role
ORDER BY count DESC;
```

### Check if user can view crew contact info

```sql
SELECT
  rp.can_view_crew_contact
FROM team_members tm
JOIN role_permissions rp ON tm.role = rp.role
WHERE tm.team_id = 'team-123' AND tm.user_id = 'user-456';
```

If result is TRUE, user can access crew.email and crew.phone fields.
