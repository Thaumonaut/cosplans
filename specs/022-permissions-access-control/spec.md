# Feature Specification: Permissions & Access Control

**Feature Branch**: `022-permissions-access-control`  
**Created**: October 16, 2025  
**Status**: Draft  
**Tier**: 0 - Foundation (Critical)  
**Priority**: P0 (Must build early)

## Overview

Permissions and access control define what each user can do within teams and shoots. This system ensures data security, enables collaborative workflows with clear role boundaries, and prevents unauthorized access. Implemented as role-based access control (RBAC) with specific permissions tied to roles.

---

## User Scenarios & Testing

### User Story 1 - Assign User Roles in Team (Priority: P1)

Team owner wants to define what each team member can do by assigning them roles.

**Why this priority**: Essential for team security and workflow. Different users need different capabilities.

**Independent Test**: Team owners can assign roles and role permissions are enforced independently.

**Acceptance Scenarios**:

1. **Given** team owner is on team settings, **When** owner selects member, **Then** role dropdown shows available roles
2. **Given** owner changes member role from "Member" to "Coordinator", **When** change is saved, **Then** member's permissions update immediately
3. **Given** member is assigned "Viewer" role, **When** member tries to edit content, **Then** system prevents edit with "Permission Denied"
4. **Given** user is "Admin" on team, **When** user invites new member, **Then** invitation sent (Admin can manage team)
5. **Given** user is "Member" on team, **When** user tries to remove another member, **Then** system prevents with "Permission Denied"

---

### User Story 2 - Enforce Role-Based Permissions (Priority: P1)

System enforces appropriate permissions based on user role across all features.

**Why this priority**: Core security feature. Permissions must be enforced consistently.

**Independent Test**: Different roles have different capabilities; permissions are enforced on all operations.

**Acceptance Scenarios**:

1. **Given** user has "Viewer" role, **When** user attempts to create shoot, **Then** create button is disabled/hidden
2. **Given** user has "Member" role, **When** user creates shoot, **Then** shoot is created successfully
3. **Given** user has "Coordinator" role, **When** user manages team schedule, **Then** all planning features available
4. **Given** user has "Admin" role, **When** user accesses team settings, **Then** all admin features visible and functional
5. **Given** user has "Owner" role, **When** user accesses team settings, **Then** all settings including delete/archive available

---

### User Story 3 - Control Shoot Access by Role (Priority: P2)

Each role has different capabilities within a specific shoot.

**Why this priority**: Enables flexible shoot team structure but not critical for MVP.

**Independent Test**: Shoot-level permissions work independently from team-level permissions.

**Acceptance Scenarios**:

1. **Given** user is assigned "Photographer" to shoot, **When** user accesses shoot, **Then** user can upload photos and notes
2. **Given** user is assigned "Makeup" to shoot, **When** user accesses shoot, **Then** user can mark their tasks complete
3. **Given** user is assigned "Observer" to shoot, **When** user views shoot, **Then** user can view but not edit content
4. **Given** shoot permission is removed, **When** user tries to access shoot, **Then** user receives "Access Denied"
5. **Given** team permission is "Member", **When** user is assigned "Photographer" on specific shoot, **Then** user can access that shoot

---

### User Story 4 - Default Permissions for New Members (Priority: P2)

New team members automatically receive appropriate default permissions based on role.

**Why this priority**: Important for usability but not critical for MVP.

**Independent Test**: Default permissions are applied automatically to new members.

**Acceptance Scenarios**:

1. **Given** new user is invited with role "Member", **When** invitation accepted, **Then** user automatically has member permissions
2. **Given** new user is invited as "Viewer", **When** invitation accepted, **Then** user can only view content (no edit/create)
3. **Given** new user joins, **When** user accesses team, **Then** user can see content their role allows
4. **Given** role doesn't have edit permission, **When** user tries to edit, **Then** system hides/disables edit UI

---

### User Story 5 - Audit Access for Compliance (Priority: P3)

System tracks access and permission changes for security audit.

**Why this priority**: Important for compliance but not critical for MVP.

**Independent Test**: Access logs can be viewed independently by admins.

**Acceptance Scenarios**:

1. **Given** admin views access log, **When** admin filters by user, **Then** all user actions are shown with timestamps
2. **Given** permission is changed, **When** change is saved, **Then** action logged with who/when/what changed
3. **Given** unauthorized access attempted, **When** attempt occurs, **Then** attempt is logged as security event
4. **Given** user accesses sensitive data, **When** access occurs, **Then** action is logged for compliance

---

### Edge Cases

- What if user has multiple roles? (Support multiple roles per user with combined permissions - OR logic)
- What if team owner removes own access? (Prevent - owner must transfer ownership first)
- What if admin adds new permission to role? (Apply to all users with that role retroactively)
- What if user removed from team but added back? (Can be re-invited; permissions reset to default for role)
- What if role is deleted? (Reassign members to different role; prevent orphaned members)
- What if permission requirement changes? (Graceful degradation - user sees "limited access" message)

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST implement role-based access control (RBAC) with predefined roles
- **FR-002**: System MUST support roles: Owner, Admin, Coordinator, Member, Viewer (at team level)
- **FR-003**: System MUST support roles: Photographer, Makeup, Assistant, Stylist, Observer (at shoot level)
- **FR-004**: System MUST assign Owner role automatically to team creator
- **FR-005**: System MUST allow Owner/Admin to change any user's role
- **FR-006**: System MUST prevent Owner from removing their own role
- **FR-007**: System MUST inherit team permissions to all team shoots (user can't access shoot if no team access)
- **FR-008**: System MUST allow shoot-specific role assignment that overrides team role if more restrictive
- **FR-009**: System MUST enforce permissions on all create/read/update/delete operations
- **FR-010**: System MUST return 403 Forbidden when user lacks permission (not 404 to prevent data disclosure)
- **FR-011**: System MUST hide edit/delete UI elements for users without permission
- **FR-012**: System MUST log all permission grants/revokes with timestamp and actor
- **FR-013**: System MUST allow temporary role assignment with expiration date
- **FR-014**: System MUST support custom role creation for future flexibility
- **FR-015**: System MUST prevent privilege escalation (user cannot grant themselves higher role)
- **FR-016**: System MUST check permissions on both client and server side
- **FR-017**: System MUST apply permission changes immediately to all user sessions
- **FR-018**: System MUST track which user made each permission change

### Role Definitions & Default Permissions

#### Team-Level Roles

**Owner**:
- Manage team settings, name, description
- Invite/remove members
- Change member roles
- Delete team
- Access all shoots
- Full content editing

**Admin**:
- Manage team settings
- Invite/remove members (except owner)
- Change member roles (except owner)
- Access all shoots
- Full content editing
- Cannot delete team or change team ownership

**Coordinator**:
- Invite members (can't remove)
- Access all shoots
- Create shoots
- Edit shoots
- View all content
- Cannot manage team settings or change member roles

**Member**:
- Create shoots (own)
- Edit shoots (own)
- Access all shoots
- View all content
- Upload photos
- Create notes
- Cannot manage team or invite members

**Viewer**:
- View-only access to shoots
- View-only access to team
- Cannot create/edit content
- Cannot upload
- Perfect for clients/stakeholders

#### Shoot-Level Roles (Optional, overrides team role)

**Photographer**:
- Upload photos
- Edit photos
- View all shot details
- Create/edit notes

**Makeup**:
- Mark makeup tasks
- View makeup schedule
- Can't upload photos but can view them

**Assistant**:
- Support photographer
- Can help with notes and scheduling
- Limited editing

**Stylist**:
- View shoot details
- Suggest styling
- View-only for photos

**Observer**:
- Complete view-only access
- No modifications allowed

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Permission check completes in under 10ms
- **SC-002**: Permission change applies to all user sessions within 2 seconds
- **SC-003**: Unauthorized access attempts are blocked with error (zero unauthorized data access)
- **SC-004**: 100% of data access respects user's role permissions
- **SC-005**: System handles 10,000+ permission checks per second
- **SC-006**: All permission-related operations are auditable (logged)
- **SC-007**: Permission inheritance (team→shoot) works correctly for 100% of access patterns
- **SC-008**: UI elements correctly reflect user permissions (no "access denied" errors in allowed areas)
- **SC-009**: Role changes take effect immediately without requiring user logout/login
- **SC-010**: New members receive correct default permissions on first login

---

### Key Entities

- **Role**: Represents a collection of permissions
  - Attributes: id, name, team_id (optional), permissions (JSON), created_at, updated_at
  - Relationships: has_many TeamMembers, has_many Permissions

- **Permission**: Represents allowed action
  - Attributes: id, name, description, resource, action (create/read/update/delete)
  - Example: can_view_shoots, can_edit_shoots, can_manage_team, can_upload_photos

- **TeamMember**: Updated to track role
  - Attributes: id, team_id, user_id, role_id, assigned_at, updated_at
  - Relationships: has Role, belongs_to Team, belongs_to User

- **ShootMember**: Optional shoot-level role
  - Attributes: id, shoot_id, user_id, role_id, assigned_at
  - Relationships: has Role, belongs_to Shoot, belongs_to User

- **PermissionAuditLog**: Security audit trail
  - Attributes: id, user_id, action (grant/revoke), role_id, resource_id, granted_by_id, timestamp
  - Relationships: belongs_to User, belongs_to Role

---

## Assumptions

- Permissions are checked before every operation (security by default)
- Team roles are primary; shoot roles are secondary and must not grant access higher than team role
- Default roles are sufficient for MVP (no custom roles required initially)
- Permission changes apply in real-time (rely on realtime sync feature)
- Audit logs are retained for compliance (retention policy defined separately)
- Permission errors never expose data (return same error regardless of whether resource exists)

---

## Dependencies

- **Depends on**: Authentication (Auth spec) and Teams (Shoots & Teams spec)
- **Blocks**: Photo management, Team communication, Shoot planning, Content features
- **Related to**: Real-time sync (permission changes need real-time propagation)

---

## Out of Scope (For Future Phases)

- Custom role creation
- Dynamic permission assignment
- Attribute-based access control (ABAC)
- Data classification/sensitivity levels
- Temporary access tokens
- Delegated permissions
- Cross-team permissions
- Approval workflows
