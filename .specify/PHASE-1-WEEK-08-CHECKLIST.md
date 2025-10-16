# Phase 1 MVP Implementation: Week 8 Checklist

**Timeline**: Week 8 (5 working days)  
**Focus**: Permissions & Crew Management (@casl/ability + RLS)  
**Deliverable**: GitHub PR with full permission system + crew management UI  
**Dependency**: Week 1-7 must be merged first

---

## 🎯 Acceptance Criteria

### @casl/ability Permission Rules

- [ ] **Role-Based Permissions**
  - **Owner**: Full control (create/edit/delete shoots, costumes, invite crew)
  - **Editor**: Can edit shoot details, costumes, props (not delete shoots)
  - **Viewer**: Read-only access
  - **Crew Member**: Can only view assigned shoots + update own crew profile

- [ ] **Permission Checks in Frontend**
  - Buttons hidden based on user ability: "Edit" button hidden for Viewers
  - Form fields disabled for Viewers
  - Navigation menu updated by role (Crew Members see limited menu)
  - Example: `@casl/ability` rule: `can('edit', 'Shoot', { team_id: user.team_ids })`

- [ ] **Permission Checks in API**
  - Every endpoint verifies user ability before returning data
  - Example: `POST /api/shoots/{id}` returns `401 Unauthorized` if user cannot edit
  - Error response: `{ error: "You don't have permission to edit this shoot" }`

- [ ] **Ability Definition** (`src/lib/ability.ts`)
  - Rules defined declaratively
  - Synced from database: `user_permissions` table
  - Updated when user role changes
  - Ability instance: `defineAbility((can, cannot) => { ... })`

### Row-Level Security (RLS) Policies

- [ ] **RLS on All Tables**
  - Table: `shoots`
    - Owner can see all
    - Team members can see if assigned to shoot
    - Others cannot see
  - Table: `crew_members`
    - User can see own profile
    - Team members can see team crew
  - Table: `costumes`
    - Owner can see all
    - Team members can see team costumes
  - Similar policies on `props`, `team_members`

- [ ] **RLS Policy Testing**
  - Test: Owner queries shoots → sees all
  - Test: Viewer queries shoots → sees only assigned shoots
  - Test: Crew member queries shoots → sees only own shoots
  - Test: User from different team cannot see shoots

### Crew Management Page

- [ ] **Crew List View**
  - Table showing all crew members on team
  - Columns: Name, Role, Email, Phone, Status (available/unavailable)
  - Edit button (only for Owners/Editors)
  - Delete button (only for Owners)

- [ ] **Crew Member Details**
  - Profile page for each crew member
  - Fields: Full name, email, phone, position(s), experience level, portfolio URL
  - Edit form (self-edit or owner-edit)
  - Availability calendar (when crew member available for shoots)

- [ ] **Invite Crew Members**
  - Button: "Invite Team Member"
  - Modal: email, role selection (Editor, Viewer, Crew)
  - Sends email: "You're invited to join {TeamName} on Cosplans"
  - Invite link: valid for 7 days
  - Registering with invite link auto-adds to team with selected role

- [ ] **Remove Crew Members**
  - Owner can remove team members
  - Endpoint: `DELETE /api/team-members/{user_id}`
  - Soft delete: marks `removed_at` timestamp
  - User can still see historical shoots they worked on

### Team Roles & Permissions Table

- [ ] **Schema: `team_member_roles`**
  - Columns: `user_id, team_id, role (owner/editor/viewer/crew)`
  - Unique constraint: one role per user per team
  - Updated when user invited or role changed

- [ ] **Default Permissions by Role**
  - **Owner**: all actions
  - **Editor**: create/edit shoots, costumes, props; invite crew; cannot delete shoots
  - **Viewer**: read-only access
  - **Crew**: can only access shoots assigned to them; can update own profile

### Dynamic Permission Updates

- [ ] **Permissions Cache**
  - User permissions cached in SvelteKit `locals.user`
  - Ability instance computed from cache
  - Cache invalidated on role change

- [ ] **Real-Time Permission Updates**
  - If user role changes → client receives update via Supabase Realtime
  - Ability instance regenerated
  - UI updated (buttons/fields re-evaluated)

### Error Handling & Edge Cases

- [ ] **Permission Denied Errors**
  - User tries to edit shoot they can't access → `401 Unauthorized`
  - API returns: `{ error: "Insufficient permissions", requiredPermission: "edit:Shoot" }`
  - Frontend shows toast: "You don't have permission to edit this"

- [ ] **Role Removal**
  - User removed from team → all RLS queries fail
  - User sees: "You no longer have access to this team"

### Testing (70% coverage minimum)

- [ ] **Unit Tests**
  - Permission rule evaluation (owner, editor, viewer, crew)
  - Ability instance creation
  - Role-based access control logic
  - **Target**: 12+ unit tests

- [ ] **Integration Tests**
  - RLS policies on all tables (shoots, costumes, crew, props)
  - User can only see their team's resources
  - Role change updates permissions immediately
  - **Target**: 12+ integration tests

- [ ] **E2E Tests** (Playwright)
  - Owner views shoot, editor cannot edit (button hidden)
  - Viewer cannot delete (button hidden)
  - Crew member can only see assigned shoots
  - **Target**: 4+ E2E tests

- [ ] **Coverage**: 70%+ minimum

### Documentation

- [ ] **Roles & Permissions** (`.specify/roles-permissions.md`)
  - Matrix: Role → Permissions
  - Examples for each role
  - How to change roles

- [ ] **@casl/ability Guide** (`.specify/casl-guide.md`)
  - How to define rules
  - How to check permissions in components
  - How to check permissions in API

- [ ] **RLS Policies** (`.specify/rls-policies.md`)
  - SQL for each table's RLS policies
  - How to test RLS

---

## 🔗 Constitution References

**Principle VIII (Creator Community Marketplace)**
- [ ] Crew members can access community features based on role

**Principle IX (Team Roles & Structure)**
- [ ] Owner, Editor, Viewer, Crew roles implemented
- [ ] Multi-team support (user can be member of multiple teams)
- [ ] Dynamic permission updates via Realtime

**Technology Stack (Constitution v2.2.0)**
- [ ] @casl/ability for declarative permissions
- [ ] Supabase RLS for database security
- [ ] Vitest + Playwright for testing

---

## 📦 Deliverables

### Code
- [ ] `src/lib/ability.ts` (Ability definition)
- [ ] `src/lib/services/permissions.ts` (permission utilities)
- [ ] `src/routes/(app)/team/crew/+page.svelte` (crew list)
- [ ] `src/routes/(app)/team/crew/[user_id]/+page.svelte` (crew detail + edit)
- [ ] `src/routes/api/team-members/invite/+server.ts` (send invite)
- [ ] `src/routes/api/team-members/[user_id]/+server.ts` (update/delete)
- [ ] `src/hooks.server.ts` update (load ability in locals)
- [ ] Database migrations: RLS policies on all tables, `team_member_roles` table

### Tests
- [ ] Unit tests: 12+
- [ ] Integration tests: 12+
- [ ] E2E tests: 4+
- [ ] Coverage: 70%+

### Documentation
- [ ] Roles & permissions matrix
- [ ] @casl/ability guide
- [ ] RLS policies reference

---

## ✅ Sign-Off Criteria

**Week 8 COMPLETE when**:
1. ✅ @casl/ability rules defined and working
2. ✅ RLS policies enforced on all tables
3. ✅ Crew management page fully functional
4. ✅ Team member invites working
5. ✅ Role-based UI hiding/showing controls
6. ✅ 70%+ test coverage
7. ✅ PR approved and merged

---

**Timeline**: Week 8 of 12  
**Dependency**: Week 1-7 merged  
**Next**: Week 9 (Core UI)
