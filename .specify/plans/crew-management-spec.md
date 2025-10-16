# Crew Management Clarification

**Date**: October 16, 2025  
**Status**: Specification Update for Constitution v1.7.0

---

## Summary

Cosplans now implements a **two-tier role system**:

### 1. Team-Level Permissions (app-wide access control)
- **Admin**: Can create/edit/delete shoots, manage team, manage crew assignments
- **Member**: Can edit shoots and their content, view crew assignments
- **Viewer**: Can view shoots and crew assignments (read-only)

### 2. Crew Roles (per-shoot, informational only)
- **Photographer, Cosplayer, Makeup Artist, Prop Master, Hair Stylist, Assistant, Custom**
- One crew member can have multiple roles on a single shoot (e.g., photographer + assistant)
- Crew roles do NOT affect permissions
- All permission enforcement is at the team level

---

## Data Model Changes

### New Tables

#### Crew (Personnel Master)
```sql
CREATE TABLE crew (
  id UUID,
  team_id UUID,
  name TEXT,
  email TEXT,              -- Access-controlled (admins only)
  phone TEXT,              -- Access-controlled (admins only)
  is_app_user BOOLEAN,
  app_user_id UUID,        -- If crew member is also a team member
  created_by_id UUID,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Purpose**: Persistent record of individuals who have worked with the team, including work history and contact information.

#### Shoot Crew Assignment (Junction Table)
```sql
CREATE TABLE shoot_crew (
  id UUID,
  shoot_id UUID,
  crew_id UUID,
  roles TEXT[],            -- Array: ['photographer', 'assistant']
  notes TEXT,              -- Role-specific notes
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Purpose**: Per-shoot crew assignment with multiple roles per person.

### Key Differences from Previous Model

| Concept | Previous | New |
|---------|----------|-----|
| **Crew Assignment** | Stored in shoots table | Separate shoot_crew junction table |
| **Crew Roles** | Team-level global roles | Per-shoot informational roles |
| **Crew Records** | Implicit (no dedicated table) | Explicit crew table with history |
| **Contact Access** | No control | Role-based (admins only) |
| **Collaboration History** | Not tracked | Tracked via shoot_crew |

---

## User Interfaces

### 1. Crew Management Page
**Purpose**: Team-wide personnel administration and history tracking

**Features**:
- List all crew members who have worked with team
- View work history (which shoots, roles assigned)
- Add new crew members (manually or from previous shoots)
- Edit crew member contact information (admin/owner only)
- Remove crew members from future shoots
- Search/filter crew by name, email, or role

**Visibility**:
- Owner: Can see names, emails, phones, work history
- Admin: Can see names, emails, phones, work history
- Member: Can see names, emails, phones, work history (cannot edit)
- Viewer: Can see names, emails, phones, work history (cannot edit)

### 2. Shoot Detail View (Crew Section)
**Purpose**: Inline crew management while planning/editing shoot

**Features**:
- Display current crew assignments for shoot
- Add crew members inline (quick selection from team crew list)
- Edit crew roles for each person
- Remove crew from shoot
- Assign multiple roles per crew member (checkboxes for each role)

**Visibility**:
- Owner: Can see all crew info, edit assignments
- Admin: Can see all crew info, edit assignments
- Member: Can see crew names/roles/contact (cannot edit assignments)
- Viewer: Can see crew names/roles/contact (read-only)

### 3. Inline Resource Management
**As mentioned**: Shoot detail view should also support editing:
- ✅ Costumes (add, edit, remove)
- ✅ Props (add, edit, remove)
- ✅ Crew (add, edit, remove) ← Implemented with new crew tables
- ✅ Images (upload, organize)
- ✅ Schedule/location details

All changes made inline are tracked via version control for conflict resolution.

---

## API Endpoints (New/Updated)

### Crew Management

```
GET /api/v1/teams/{teamId}/crew
  → List all crew for team (with work history)

POST /api/v1/teams/{teamId}/crew
  → Add new crew member to team
  → Body: {name, email?, phone?, notes?}

PATCH /api/v1/teams/{teamId}/crew/{crewId}
  → Update crew contact info (admin only)
  → Body: {name?, email?, phone?}

DELETE /api/v1/teams/{teamId}/crew/{crewId}
  → Remove crew from team (won't delete shoot_crew records; just marks inactive)

GET /api/v1/teams/{teamId}/crew/{crewId}/shoots
  → View work history for crew member
```

### Shoot Crew Assignment

```
GET /api/v1/teams/{teamId}/shoots/{shootId}/crew
  → List crew assigned to shoot

POST /api/v1/teams/{teamId}/shoots/{shootId}/crew
  → Assign crew member to shoot
  → Body: {crew_id, roles: ['photographer', 'assistant']}

PATCH /api/v1/teams/{teamId}/shoots/{shootId}/crew/{crewId}
  → Update roles for crew on shoot
  → Body: {roles: ['cosplayer', 'makeup_artist'], notes?: '...'}

DELETE /api/v1/teams/{teamId}/shoots/{shootId}/crew/{crewId}
  → Remove crew from shoot
```

### Permissions for Crew Endpoints

All crew endpoints require `can_manage_crew` permission (admin only).

Contact information endpoints (email, phone) require `can_view_crew_contact` permission (admin only).

---

## Access Control Examples

### Example 1: Team Member Views Shoot
```
User Role: member
Sees: Crew names, roles (photographer, cosplayer, etc.), contact info (email, phone)
Blocked: Cannot edit crew assignments
```

### Example 2: Admin Edits Crew
```
User Role: admin
Sees: Full crew info (names, emails, phones)
Can: Add crew, edit contact info, assign to shoots, remove from shoots
```

### Example 3: Owner Has Full Control
```
User Role: owner
Sees: Full crew info (names, emails, phones)
Can: All admin actions + team settings, member management, analytics access
```

### Example 4: Viewer Inspects Shoot
```
User Role: viewer
Sees: Crew names, roles, contact info (read-only)
Blocked: Cannot edit permissions, cannot manage crew
```

---

## Implementation Priority

1. ✅ Create crew and shoot_crew tables
2. ✅ Implement crew management page (list, add, edit contact, history)
3. ✅ Implement shoot crew assignment inline (within shoot detail view)
4. ✅ Add permission checks (can_manage_crew, can_view_crew_contact)
5. ✅ Create API endpoints for crew CRUD
6. ✅ Test crew role assignment with multiple roles per person
7. ✅ Build crew history tracking
8. ✅ Implement contact info access control

---

## Testing Scenarios

### Scenario 1: Admin Assigns Multiple Roles
1. Admin opens shoot detail view
2. Clicks "Add Crew"
3. Selects "Alice" from crew list
4. Checks: photographer, assistant
5. Saves
6. ✅ shoot_crew row created: {shoot_id, crew_id, roles: ['photographer', 'assistant']}

### Scenario 2: Member Views Crew
1. Member opens shoot detail view
2. Sees crew section: "Alice (photographer, assistant)"
3. Clicks to see more → navigates to crew management page
4. Sees: Alice, 5 shoots, roles across shoots
5. ✅ Crew contact info blocked (no email, phone visible)

### Scenario 3: Admin Views Crew History
1. Admin opens crew management page
2. Searches for "Alice"
3. Clicks on Alice → sees work history
4. Views: 5 shoots, roles assigned in each, dates
5. ✅ shoot_crew records queried and displayed chronologically

### Scenario 4: Viewer Limitation
1. Viewer opens shoot detail
2. Sees crew names and roles
3. Clicks "Manage Crew" button
4. ✅ Error: "You don't have permission to manage crew"

---

## Constitution Alignment

✅ **Principle VII (Updated)**: Teams support two distinct role systems:
- Team-level permissions (global app access): admin, member, viewer
- Crew roles (per-shoot, informational): photographer, cosplayer, makeup artist, etc.

✅ **Principle II (Real-Time Collaboration)**: Crew assignments use same real-time sync as shoots/costumes/props

✅ **Security & Privacy**: Contact information (email, phone) is access-controlled per team role

✅ **Technical Architecture**: Crew management uses same API patterns, versioning, and conflict resolution as other resources

---

## Next Steps

1. Update database migrations to include crew and shoot_crew tables
2. Implement crew management page UI (Svelte component)
3. Implement crew section in shoot detail view (inline management)
4. Build API endpoints with proper permission checks
5. Add comprehensive E2E tests for crew workflows
6. Update documentation and quickstart guide
