# Data Model: Teams Creation

**Date**: October 20, 2025  
**Feature**: Teams Creation (MVP - Shoots deferred)

---

## Entity Relationship Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth - existing)
│─────────────────│
│ id (PK)         │
│ email           │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N (owns teams)
         │
         ▼
┌─────────────────────────┐
│        teams            │
│─────────────────────────│
│ id (PK)                 │
│ name                    │
│ description             │
│ owner_id (FK → users)   │◄─────┐
│ image_url               │      │
│ archived_at             │      │
│ created_at              │      │
│ updated_at              │      │
└────────┬────────────────┘      │
         │                        │
         │ 1:N                    │
         │                        │
         ▼                        │
┌─────────────────────────────────┐
│       team_members              │
│─────────────────────────────────│
│ id (PK)                         │
│ team_id (FK → teams)            │
│ user_id (FK → users)            │
│ role (owner/admin/member)       │
│ joined_at                       │
│ invited_by (FK → users)         │
│ last_active                     │
│ custom_permissions (JSONB)      │
│ created_at                      │
│ updated_at                      │
│ UNIQUE(team_id, user_id)        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│      team_invitations           │
│─────────────────────────────────│
│ id (PK)                         │
│ team_id (FK → teams)            │
│ email                           │
│ role (admin/member)             │
│ token (unique)                  │
│ invited_by (FK → users)         │
│ expires_at                      │
│ accepted_at                     │
│ created_at                      │
└─────────────────────────────────┘
```

---

## Table Definitions

### 1. `teams`

**Purpose**: Core team entity representing a group of collaborators

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique team identifier |
| `name` | TEXT | NOT NULL | Team display name (user-customizable) |
| `description` | TEXT | NULL | Optional team description |
| `owner_id` | UUID | NOT NULL, REFERENCES auth.users(id) ON DELETE RESTRICT | Team owner (constitutional requirement) |
| `image_url` | TEXT | NULL | Optional team avatar/logo URL |
| `archived_at` | TIMESTAMPTZ | NULL | Soft delete timestamp (NULL = active) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Team creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
```sql
CREATE INDEX idx_teams_owner_id ON teams(owner_id);
CREATE INDEX idx_teams_archived_at ON teams(archived_at) WHERE archived_at IS NULL;
```

**Constraints**:
```sql
-- Prevent deletion of owner's last team (enforced at application level)
-- RLS policies ensure users only see their teams
```

**Validation Rules**:
- `name`: 1-100 characters, required
- `description`: 0-500 characters, optional
- `owner_id`: Must be valid user ID
- `archived_at`: If set, team is soft-deleted

---

### 2. `team_members`

**Purpose**: Junction table tracking team membership with roles and metadata

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique membership record |
| `team_id` | UUID | NOT NULL, REFERENCES teams(id) ON DELETE CASCADE | Team reference |
| `user_id` | UUID | NOT NULL, REFERENCES auth.users(id) ON DELETE CASCADE | User reference |
| `role` | TEXT | NOT NULL, CHECK (role IN ('owner', 'admin', 'member')) | User's role in team |
| `joined_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | When user joined team |
| `invited_by` | UUID | NULL, REFERENCES auth.users(id) ON DELETE SET NULL | Who invited this user |
| `last_active` | TIMESTAMPTZ | NULL | Last activity timestamp (updated on actions) |
| `custom_permissions` | JSONB | NOT NULL, DEFAULT '{}' | Future: custom permission overrides |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
```sql
CREATE UNIQUE INDEX idx_team_members_unique ON team_members(team_id, user_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_role ON team_members(role);
```

**Constraints**:
```sql
-- Unique membership per team
ALTER TABLE team_members ADD CONSTRAINT unique_team_user UNIQUE (team_id, user_id);

-- Role validation
ALTER TABLE team_members ADD CONSTRAINT valid_role 
  CHECK (role IN ('owner', 'admin', 'member'));

-- Owner must exist in team_members
-- Enforced by application logic and RLS policies
```

**Validation Rules**:
- `role`: Must be 'owner', 'admin', or 'member'
- `team_id` + `user_id`: Unique combination (one membership per team)
- `invited_by`: Must be existing user or NULL (for owner/auto-created)

---

### 3. `team_invitations`

**Purpose**: Pending team invitations with expiration and tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique invitation ID |
| `team_id` | UUID | NOT NULL, REFERENCES teams(id) ON DELETE CASCADE | Team being invited to |
| `email` | TEXT | NOT NULL | Invitee email address |
| `role` | TEXT | NOT NULL, CHECK (role IN ('admin', 'member')) | Role to assign on acceptance |
| `token` | TEXT | NOT NULL, UNIQUE | Secure invitation token (UUID) |
| `invited_by` | UUID | NOT NULL, REFERENCES auth.users(id) ON DELETE CASCADE | Who sent invitation |
| `expires_at` | TIMESTAMPTZ | NOT NULL | Invitation expiration (7 days from creation) |
| `accepted_at` | TIMESTAMPTZ | NULL | When invitation was accepted (NULL = pending) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Invitation creation timestamp |

**Indexes**:
```sql
CREATE UNIQUE INDEX idx_team_invitations_token ON team_invitations(token);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);
CREATE INDEX idx_team_invitations_team_id ON team_invitations(team_id);
CREATE INDEX idx_team_invitations_expires_at ON team_invitations(expires_at);
```

**Constraints**:
```sql
-- Token must be unique
ALTER TABLE team_invitations ADD CONSTRAINT unique_token UNIQUE (token);

-- Role validation (owner cannot be invited, must be created)
ALTER TABLE team_invitations ADD CONSTRAINT valid_invitation_role 
  CHECK (role IN ('admin', 'member'));

-- Expiration must be in future
ALTER TABLE team_invitations ADD CONSTRAINT valid_expiration 
  CHECK (expires_at > created_at);
```

**Validation Rules**:
- `email`: Valid email format, required
- `role`: Must be 'admin' or 'member' (not 'owner')
- `token`: Cryptographically secure UUID
- `expires_at`: Must be > created_at (7 days default)
- `accepted_at`: NULL = pending, set = accepted

---

## Row Level Security (RLS) Policies

### `teams` Table

```sql
-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Users can view teams they're members of
CREATE POLICY "Users can view their teams"
  ON teams FOR SELECT
  USING (
    id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can create teams (become owner)
CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Only owners can update their teams
CREATE POLICY "Owners can update their teams"
  ON teams FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Only owners can delete teams (with validation)
CREATE POLICY "Owners can delete their teams"
  ON teams FOR DELETE
  USING (owner_id = auth.uid());
```

### `team_members` Table

```sql
-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Users can view members of their teams
CREATE POLICY "Users can view team members"
  ON team_members FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
    )
  );

-- Owners and admins can add members
CREATE POLICY "Owners and admins can add members"
  ON team_members FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Owners and admins can update member roles
CREATE POLICY "Owners and admins can update members"
  ON team_members FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Owners and admins can remove members
CREATE POLICY "Owners and admins can remove members"
  ON team_members FOR DELETE
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );
```

### `team_invitations` Table

```sql
-- Enable RLS
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- Users can view invitations for their teams
CREATE POLICY "Users can view team invitations"
  ON team_invitations FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
    )
  );

-- Owners and admins can create invitations
CREATE POLICY "Owners and admins can create invitations"
  ON team_invitations FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Anyone can update invitation (for acceptance)
-- Validated by token match in application logic
CREATE POLICY "Anyone can accept invitations"
  ON team_invitations FOR UPDATE
  USING (true)
  WITH CHECK (accepted_at IS NOT NULL);

-- Owners and admins can delete (cancel) invitations
CREATE POLICY "Owners and admins can cancel invitations"
  ON team_invitations FOR DELETE
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );
```

---

## Database Functions

### 1. Update `updated_at` Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to teams
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to team_members
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. Validate Team Ownership (Application-Level)

```typescript
// Prevent deletion of user's last owned team
async function canDeleteTeam(userId: string, teamId: string): Promise<boolean> {
  const ownedTeams = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', userId)
    .eq('role', 'owner');
  
  return ownedTeams.data.length > 1;
}
```

---

## State Transitions

### Team Lifecycle

```
[Created] → [Active] → [Archived]
    │          │            │
    │          │            └─→ [Deleted] (if not last owned team)
    │          │
    │          └─→ [Ownership Transferred]
    │
    └─→ [Auto-created during onboarding]
```

### Invitation Lifecycle

```
[Created] → [Pending] → [Accepted] → [Member Added]
    │          │            │
    │          │            └─→ [Invitation Marked Accepted]
    │          │
    │          └─→ [Expired] (after 7 days)
    │          │
    │          └─→ [Cancelled] (by owner/admin)
```

### Member Lifecycle

```
[Invited] → [Joined] → [Active] → [Removed]
    │          │          │           │
    │          │          │           └─→ [Membership Deleted]
    │          │          │
    │          │          └─→ [Role Changed] (owner/admin action)
    │          │
    │          └─→ [Auto-joined] (owner during team creation)
```

---

## Data Integrity Rules

1. **Team Ownership**: Every team MUST have exactly one owner
2. **User Ownership**: Every user MUST own at least one team (constitutional requirement)
3. **Unique Membership**: User can be member of team only once
4. **Invitation Expiration**: Invitations expire after 7 days
5. **Token Uniqueness**: Invitation tokens must be globally unique
6. **Soft Delete**: Teams use `archived_at` for soft deletion
7. **Cascade Delete**: Deleting team cascades to members and invitations
8. **Owner Transfer**: Ownership can be transferred, old owner becomes admin

---

## Performance Considerations

1. **Indexes**: All foreign keys indexed for fast joins
2. **RLS Optimization**: Policies use indexed columns (user_id, team_id)
3. **Pagination**: Team lists paginated for users with 1000+ teams
4. **Real-time Filtering**: RLS policies automatically filter real-time subscriptions
5. **Query Optimization**: Use `select` with specific columns, avoid `select *`

---

## Migration Strategy

**File**: `database/migrations/004_teams_schema.sql`

**Order**:
1. Create `teams` table
2. Create `team_members` table
3. Create `team_invitations` table
4. Create indexes
5. Enable RLS on all tables
6. Create RLS policies
7. Create triggers for `updated_at`

**Rollback**: Drop tables in reverse order (invitations → members → teams)

---

## Future Extensions (Post-MVP)

1. **Shoots Table**: Add shoots linked to teams (deferred to next phase)
2. **Team Settings**: Custom team preferences (notifications, visibility)
3. **Team Analytics**: Member activity tracking, engagement metrics
4. **Custom Permissions**: Granular permissions per member (using `custom_permissions` JSONB)
5. **Team Hierarchy**: Sub-teams or team groups
6. **Team Templates**: Pre-configured team structures
