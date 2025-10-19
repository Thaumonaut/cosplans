# Feature Specification: User Management and Access Control

**Feature Branch**: `020-user-management-and-access`
**Created**: October 19, 2025
**Status**: Draft
**Tier**: 0 - Foundation (Critical - blocks everything else)
**Priority**: P0 (Must build first)

## Overview

User management and access control form the foundational security layer of Cosplans. This system handles user authentication (verifying identity) and authorization (defining what authenticated users can do). Together, they enable secure collaboration, protect sensitive data, and ensure users can only access appropriate features and content.

The system implements a two-layer approach:
1. **Authentication Layer**: Email/password registration, login/logout, session management, and password recovery
2. **Authorization Layer**: Role-based access control (RBAC) with team-level and shoot-level roles

---

## User Scenarios & Testing

### Authentication User Stories

#### User Story 1 - New User Sign Up (Priority: P1)

A new user discovers Cosplans and wants to create an account to start planning their first shoot.

**Why this priority**: New user acquisition is critical for any application. This is the entry point for all users.

**Independent Test**: New users can register, receive confirmation, and access the app independently.

**Acceptance Scenarios**:

1. **Given** user is on sign-up page, **When** user enters email and password, **Then** account is created and confirmation email is sent
2. **Given** user receives confirmation email, **When** user clicks confirmation link, **Then** account is activated and user can log in
3. **Given** user enters weak password, **When** user attempts signup, **Then** system shows password requirements and prevents signup
4. **Given** user enters existing email, **When** user attempts signup, **Then** system shows error "Email already registered"

---

#### User Story 2 - User Login (Priority: P1)

Returning user wants to log in to access their shoots and team data.

**Why this priority**: Essential daily workflow. Users must authenticate each session.

**Independent Test**: Authenticated users can access protected features; unauthenticated users are redirected to login.

**Acceptance Scenarios**:

1. **Given** user has active account, **When** user enters correct email/password, **Then** user is logged in and redirected to dashboard
2. **Given** user enters wrong password, **When** user attempts login, **Then** system shows "Invalid credentials" after 3 attempts
3. **Given** user enters non-existent email, **When** user attempts login, **Then** system shows generic error message (security: don't reveal email status)
4. **Given** user is logged in, **When** user closes browser, **Then** session persists for 30 days (or until logout)

---

#### User Story 3 - Password Reset (Priority: P1)

User forgot their password and needs to regain access to their account.

**Why this priority**: Common use case. Must not lock users out permanently.

**Independent Test**: Users can reset password and regain access independently.

**Acceptance Scenarios**:

1. **Given** user is on login page, **When** user clicks "Forgot Password", **Then** user is shown email entry form
2. **Given** user enters registered email, **When** user submits, **Then** password reset email is sent within 60 seconds
3. **Given** user receives reset email, **When** user clicks reset link, **Then** user can set new password and is logged in
4. **Given** password reset link is 24 hours old, **When** user tries to use it, **Then** system shows "Link expired" and prompts for new reset

---

#### User Story 4 - Profile Management (Priority: P2)

User wants to update their profile information (name, photo, bio, etc.).

**Why this priority**: Improves team collaboration and user experience but not blocking MVP.

**Independent Test**: Users can view and modify their profile independently.

**Acceptance Scenarios**:

1. **Given** user is logged in, **When** user navigates to profile settings, **Then** current information is displayed in editable form
2. **Given** user updates profile fields, **When** user clicks Save, **Then** changes are persisted and confirmation shown
3. **Given** user uploads profile photo, **When** upload completes, **Then** photo is displayed in profile and team views
4. **Given** user profile is updated, **When** other team members view team, **Then** updated profile info is visible to them

---

#### User Story 5 - Account Deactivation (Priority: P3)

User wants to delete their account and all associated data.

**Why this priority**: Important for privacy/GDPR compliance but not critical for MVP launch.

**Independent Test**: Users can request account deletion independently.

**Acceptance Scenarios**:

1. **Given** user is on account settings, **When** user clicks "Delete Account", **Then** system shows confirmation dialog with warnings
2. **Given** user confirms deletion, **When** user enters password for verification, **Then** account and all data are scheduled for deletion
3. **Given** account deletion is requested, **When** 30 days pass, **Then** all account data is permanently removed from system
4. **Given** user initiates deletion, **When** 30 days haven't passed, **Then** user can cancel deletion within grace period

---

#### User Story 6 - Session Management & Security (Priority: P2)

System maintains secure sessions and prevents unauthorized access.

**Why this priority**: Security is critical but can be implemented in parallel with core features.

**Independent Test**: Sessions are properly managed and terminated; unauthorized access is prevented.

**Acceptance Scenarios**:

1. **Given** user is logged in from multiple devices, **When** user logs out from one device, **Then** session terminates on that device only
2. **Given** user's session is idle for 1 hour, **When** user attempts action, **Then** user is prompted to re-authenticate
3. **Given** user logs in from new location, **When** login completes, **Then** system may send security notification (optional for MVP)
4. **Given** attacker attempts account access with 10 wrong passwords, **When** 10th attempt is made, **Then** account is temporarily locked for 15 minutes

---

### Authorization User Stories

#### User Story 7 - Assign User Roles in Team (Priority: P1)

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

#### User Story 8 - Enforce Role-Based Permissions (Priority: P1)

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

#### User Story 9 - Control Shoot Access by Role (Priority: P2)

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

#### User Story 10 - Default Permissions for New Members (Priority: P2)

New team members automatically receive appropriate default permissions based on role.

**Why this priority**: Important for usability but not critical for MVP.

**Independent Test**: Default permissions are applied automatically to new members.

**Acceptance Scenarios**:

1. **Given** new user is invited with role "Member", **When** invitation accepted, **Then** user automatically has member permissions
2. **Given** new user is invited as "Viewer", **When** invitation accepted, **Then** user can only view content (no edit/create)
3. **Given** new user joins, **When** user accesses team, **Then** user can see content their role allows
4. **Given** role doesn't have edit permission, **When** user tries to edit, **Then** system hides/disables edit UI

---

#### User Story 11 - Audit Access for Compliance (Priority: P3)

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

**Authentication Edge Cases**:
- What happens if user signs up with temporary/disposable email? (Allow, but may have delivery issues)
- How does system handle users with special characters in name/email? (Support full UTF-8)
- What if user loses access to email account? (Manual support process required)
- What if password reset email is intercepted? (HTTPS required; link expires in 24h)
- How many active sessions per user? (Allow unlimited for MVP, add device management later)
- What happens if database is compromised? (Passwords must be hashed with bcrypt/argon2, not plain text)

**Authorization Edge Cases**:
- What if user has multiple roles? (Support multiple roles per user with combined permissions - OR logic)
- What if team owner removes own access? (Prevent - owner must transfer ownership first)
- What if admin adds new permission to role? (Apply to all users with that role retroactively)
- What if user removed from team but added back? (Can be re-invited; permissions reset to default for role)
- What if role is deleted? (Reassign members to different role; prevent orphaned members)
- What if permission requirement changes? (Graceful degradation - user sees "limited access" message)

---

## Requirements

### Authentication Functional Requirements

- **FR-001**: System MUST support email/password registration with email verification
- **FR-002**: System MUST hash all passwords using industry-standard algorithm (bcrypt, Argon2, or PBKDF2)
- **FR-003**: System MUST enforce minimum password requirements: 8+ characters, mix of uppercase/lowercase/numbers
- **FR-004**: System MUST support email-based login with email and password credentials
- **FR-005**: System MUST prevent account lockout after 5 failed login attempts (15-minute cooldown)
- **FR-006**: System MUST support "Forgot Password" flow with email-based reset token
- **FR-007**: System MUST support profile editing (name, bio, avatar, contact info)
- **FR-008**: System MUST support logout and session termination
- **FR-009**: System MUST maintain user sessions with 30-day expiration by default
- **FR-010**: System MUST automatically extend session expiration on each user activity
- **FR-011**: System MUST support idle session timeout (1 hour without activity) requiring re-authentication
- **FR-012**: System MUST support account deactivation with 30-day grace period before permanent deletion
- **FR-013**: System MUST enforce HTTPS for all authentication-related operations
- **FR-014**: System MUST not display whether an email is registered when login fails (prevent email enumeration)
- **FR-015**: System MUST support future OAuth2/Google Sign-In integration (architecture, not implementation required)
- **FR-016**: System MUST log all authentication events (login, logout, password reset, failed attempts)
- **FR-017**: System MUST securely store and transmit all authentication tokens
- **FR-018**: System MUST support "Remember Me" functionality (optional, 30-day persistent session)

### Authorization Functional Requirements

- **FR-019**: System MUST implement role-based access control (RBAC) with predefined roles
- **FR-020**: System MUST support roles: Owner, Admin, Coordinator, Member, Viewer (at team level)
- **FR-021**: System MUST support roles: Photographer, Makeup, Assistant, Stylist, Observer (at shoot level)
- **FR-022**: System MUST assign Owner role automatically to team creator
- **FR-023**: System MUST allow Owner/Admin to change any user's role
- **FR-024**: System MUST prevent Owner from removing their own role
- **FR-025**: System MUST inherit team permissions to all team shoots (user can't access shoot if no team access)
- **FR-026**: System MUST allow shoot-specific role assignment that overrides team role if more restrictive
- **FR-027**: System MUST enforce permissions on all create/read/update/delete operations
- **FR-028**: System MUST return 403 Forbidden when user lacks permission (not 404 to prevent data disclosure)
- **FR-029**: System MUST hide edit/delete UI elements for users without permission
- **FR-030**: System MUST log all permission grants/revokes with timestamp and actor
- **FR-031**: System MUST allow temporary role assignment with expiration date
- **FR-032**: System MUST support custom role creation for future flexibility
- **FR-033**: System MUST prevent privilege escalation (user cannot grant themselves higher role)
- **FR-034**: System MUST check permissions on both client and server side
- **FR-035**: System MUST apply permission changes immediately to all user sessions
- **FR-036**: System MUST track which user made each permission change

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

### Authentication Measurable Outcomes

- **SC-001**: New user can complete signup and verify email in under 5 minutes
- **SC-002**: Existing user can login in under 30 seconds
- **SC-003**: Password reset flow completes in under 3 minutes
- **SC-004**: System handles 100 concurrent authentication requests without degradation
- **SC-005**: Session tokens are validated in under 50ms average response time
- **SC-006**: 99.9% of password reset emails are delivered within 60 seconds
- **SC-007**: Zero instances of password breach (passwords always hashed, never stored plaintext)
- **SC-008**: 100% of failed login attempts are logged for security audit
- **SC-009**: Account lockout prevents unauthorized access while allowing legitimate user recovery
- **SC-010**: User profile can be updated in single request with all changes persisted within 1 second

### Authorization Measurable Outcomes

- **SC-011**: Permission check completes in under 10ms
- **SC-012**: Permission change applies to all user sessions within 2 seconds
- **SC-013**: Unauthorized access attempts are blocked with error (zero unauthorized data access)
- **SC-014**: 100% of data access respects user's role permissions
- **SC-015**: System handles 10,000+ permission checks per second
- **SC-016**: All permission-related operations are auditable (logged)
- **SC-017**: Permission inheritance (team→shoot) works correctly for 100% of access patterns
- **SC-018**: UI elements correctly reflect user permissions (no "access denied" errors in allowed areas)
- **SC-019**: Role changes take effect immediately without requiring user logout/login
- **SC-020**: New members receive correct default permissions on first login

---

## Key Entities

### Authentication Entities

- **User**: Core entity representing a person in the system
  - Attributes: id, email, password_hash, first_name, last_name, avatar_url, bio, created_at, updated_at, deactivated_at
  - Relationships: owns Shoots, is member of Teams, creates content

- **AuthSession**: Represents active user login session
  - Attributes: id, user_id, token, created_at, expires_at, last_activity_at, ip_address, user_agent
  - Relationships: belongs_to User

- **PasswordReset**: Temporary token for password recovery
  - Attributes: id, user_id, token, created_at, expires_at, used_at
  - Relationships: belongs_to User

- **AuditLog**: Security audit trail for authentication events
  - Attributes: id, user_id, event_type, ip_address, user_agent, created_at
  - Relationships: belongs_to User

### Authorization Entities

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

- Email delivery service is available and reliable (will use Supabase built-in or SendGrid)
- All users have valid email addresses for recovery
- Passwords are transmitted over HTTPS only (enforced at infrastructure level)
- Initial implementation uses email/password only; OAuth2 is future enhancement
- User consent for data processing is obtained separately (see Legal & Compliance spec)
- Permissions are checked before every operation (security by default)
- Team roles are primary; shoot roles are secondary and must not grant access higher than team role
- Default roles are sufficient for MVP (no custom roles required initially)
- Permission changes apply in real-time (rely on realtime sync feature)
- Audit logs are retained for compliance (retention policy defined separately)
- Permission errors never expose data (return same error regardless of whether resource exists)

---

## Dependencies

- **Blocks**: All other features depend on this (Teams, Shoots, Permissions, Content features, etc.)
- **Required for**: All collaborative features, data protection, and user workflows
- **External**: Email delivery service (Supabase Auth or SendGrid)

---

## Out of Scope (For Future Phases)

**Authentication**:
- Two-factor authentication (2FA)
- OAuth2 / Social sign-in
- Single Sign-On (SSO)
- Magic link authentication
- WebAuthn/biometric authentication
- SAML authentication

**Authorization**:
- Custom role creation
- Dynamic permission assignment
- Attribute-based access control (ABAC)
- Data classification/sensitivity levels
- Temporary access tokens
- Delegated permissions
- Cross-team permissions
- Approval workflows
