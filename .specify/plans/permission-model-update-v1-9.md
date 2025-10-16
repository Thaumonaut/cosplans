# Permission Model Update - Summary

**Date**: October 16, 2025  
**Constitution Version**: 1.9.0  
**Changes**: Added Owner role, updated crew contact visibility

---

## Changes Made

### 1. Added Owner Role (New)
- **Owner**: Full system control, positioned for future privilege expansion
- Differentiated from Admin to allow future governance enhancements
- Can manage team settings (which admin cannot do in current model)
- Can manage team members and view analytics (same as admin)

### 2. Updated Crew Contact Visibility
- **Before**: Only admins could see crew email/phone
- **After**: All team members (owner, admin, member, viewer) can see crew contact info
- Rationale: Enables efficient coordination and scheduling across team

### 3. Crew Management Authority
- **Owner & Admin**: Can add/edit/remove crew from shoots
- **Member & Viewer**: Can only view crew assignments and contact info

---

## Permission Hierarchy

```
Owner
├── Full team control
├── Can manage team settings
├── Can manage members
├── Can view analytics
├── Can manage crew
└── Can view crew contact info

Admin
├── Can create/edit/delete shoots
├── Can manage crew
├── Can manage members (but NOT team settings)
├── Can view analytics
└── Can view crew contact info

Member
├── Can edit shoots
├── Can create costumes/props
├── Can view everything
└── Can view crew contact info

Viewer
├── Read-only access
└── Can view crew contact info
```

---

## Access Control Matrix (Updated)

| Action | Owner | Admin | Member | Viewer |
|--------|-------|-------|--------|--------|
| Create shoot | ✅ | ✅ | ❌ | ❌ |
| Edit shoot | ✅ | ✅ | ✅ | ❌ |
| Delete shoot | ✅ | ✅ | ❌ | ❌ |
| View shoot | ✅ | ✅ | ✅ | ✅ |
| **View crew contact** | ✅ | ✅ | ✅ | ✅ |
| **Manage crew** | ✅ | ✅ | ❌ | ❌ |
| Manage team settings | ✅ | ❌ | ❌ | ❌ |
| Manage members | ✅ | ✅ | ❌ | ❌ |
| View analytics | ✅ | ✅ | ❌ | ❌ |

**Key Changes** (highlighted in bold):
- Crew contact visibility expanded to all members
- Owner role added with team management control

---

## Database Changes

### role_permissions Table Update

```sql
-- New seed data:
INSERT INTO role_permissions (role, can_create_shoot, can_edit_shoot, can_delete_shoot, 
  can_view_shoot, can_create_costume, can_edit_costume, can_delete_costume, 
  can_manage_crew, can_view_crew_contact, can_manage_team, can_manage_members, can_view_analytics)
VALUES
  ('owner', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
  ('admin', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE),
  ('member', FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE),
  ('viewer', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE);
```

**Changes**:
- Added `'owner'` role (new)
- Changed `can_view_crew_contact` from FALSE to TRUE for member and viewer roles
- Admin cannot manage team settings (`can_manage_team = FALSE`)

---

## Files Updated

1. **Constitution (v1.9.0)**
   - Updated Principle VII: Added owner role, clarified permission hierarchy
   - Updated visibility language: Members can now view crew contact info

2. **data-model-v2.md**
   - Updated role_permissions SQL with owner role and TRUE for crew contact visibility
   - Updated access control matrix (owner column added)
   - Updated migration strategy to reference owner/admin/member/viewer

3. **crew-management-spec.md**
   - Updated UI visibility descriptions
   - Updated access control examples (added owner example)
   - Updated permission descriptions for member/viewer

---

## Migration Path (Existing Teams)

For teams with existing members:
1. Create new `'owner'` role in role_permissions table
2. Identify team creator (likely first member)
3. Assign owner role to team creator: `UPDATE team_members SET role = 'owner' WHERE user_id = creator_id AND team_id = team_id`
4. Keep other members at their current roles
5. Verify contact info visibility: Run query on crew table to confirm access permissions

**No breaking changes**: Members already had some permissions; we're expanding crew contact visibility which is backwards compatible.

---

## Future Expansion (Owner Role Reserved For)

Owner role is intentionally positioned for future capabilities such as:
- Team billing/subscription management
- Team deletion or archival
- Role templates or permission customization
- Team transfer/delegation to another owner
- Advanced audit logging access
- API key management
- Integration permissions (Google Apps, email service)

---

## Testing Scenarios

### Scenario 1: Member Views Crew Contact
1. Member opens crew management page
2. Searches for "Alice"
3. ✅ Sees: Alice, alice@example.com, 555-1234, work history
4. ✅ Cannot edit or remove Alice from shoots

### Scenario 2: Owner Manages Team
1. Owner opens team settings
2. ✅ Can change team name, subscription tier, etc.
3. ✅ Can manage members and their roles
4. ✅ Can manage crew
5. Owner promotes member to admin role

### Scenario 3: Viewer Sees Contact Info
1. Viewer opens shoot detail
2. ✅ Sees crew assignments with full contact info
3. ✅ Cannot add/edit/remove crew

---

## Documentation Links

- **Constitution**: `.specify/memory/constitution.md` (v1.9.0)
- **Data Model**: `.specify/plans/data-model-v2.md` (updated)
- **Crew Management Spec**: `.specify/plans/crew-management-spec.md` (updated)
