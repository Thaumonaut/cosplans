# Data Model: User Management and Access Control

## Core Entities

### User (extends Supabase auth.users)

**Primary Entity**: Represents a person in the system with extended profile information

**Attributes**:
- `id` (UUID, Primary Key) - References Supabase auth.users.id
- `email` (String, Unique) - User's email address (from Supabase auth)
- `first_name` (String, Required) - User's first name
- `last_name` (String, Required) - User's last name
- `avatar_url` (String, Optional) - URL to user's profile picture
- `bio` (Text, Optional) - User's biography/description
- `created_at` (Timestamp) - Account creation timestamp
- `updated_at` (Timestamp) - Last profile update timestamp
- `deactivated_at` (Timestamp, Optional) - Account deactivation timestamp

**Relationships**:
- **Many-to-Many** with Teams (via TeamMember junction table)
- **One-to-Many** with AuthSessions (user's active sessions)
- **One-to-Many** with PasswordResets (pending password resets)
- **One-to-Many** with AuditLogs (user's authentication events)
- **Many-to-Many** with Shoots (via ShootMember junction table)

**Validation Rules**:
- `first_name` and `last_name`: 1-100 characters, alphanumeric + spaces
- `avatar_url`: Valid URL format if provided
- `bio`: Maximum 1000 characters if provided

**State Transitions**:
- `Active` → `Deactivated` (via account deletion request)
- `Deactivated` → `Active` (within 30-day grace period)

---

### AuthSession

**Entity**: Represents active user login sessions for security tracking

**Attributes**:
- `id` (UUID, Primary Key) - Unique session identifier
- `user_id` (UUID, Foreign Key) - References User.id
- `token` (String) - JWT session token (managed by Supabase)
- `created_at` (Timestamp) - Session creation timestamp
- `expires_at` (Timestamp) - Session expiration timestamp
- `last_activity_at` (Timestamp) - Last user activity timestamp
- `ip_address` (String) - Client IP address for security logging
- `user_agent` (String) - Client user agent for device tracking

**Relationships**:
- **Belongs to** User (many sessions per user)
- **Referenced by** AuditLog (for session-related events)

**Validation Rules**:
- `expires_at`: Must be 30 days after `created_at`
- `last_activity_at`: Updated on each authenticated request
- `ip_address`: Valid IPv4/IPv6 format

**State Transitions**:
- `Active` → `Expired` (automatic after 30 days or 1 hour idle)

---

### PasswordReset

**Entity**: Temporary tokens for password recovery flow

**Attributes**:
- `id` (UUID, Primary Key) - Unique reset token identifier
- `user_id` (UUID, Foreign Key) - References User.id
- `token` (String, Unique) - Secure reset token (managed by Supabase)
- `created_at` (Timestamp) - Token creation timestamp
- `expires_at` (Timestamp) - Token expiration timestamp (24 hours)
- `used_at` (Timestamp, Optional) - Token usage timestamp

**Relationships**:
- **Belongs to** User (one reset per user at a time)

**Validation Rules**:
- `expires_at`: Must be 24 hours after `created_at`
- `token`: Cryptographically secure random string

**State Transitions**:
- `Pending` → `Used` (when password reset completes)
- `Pending` → `Expired` (after 24 hours)

---

### AuditLog

**Entity**: Security audit trail for authentication events

**Attributes**:
- `id` (UUID, Primary Key) - Unique audit entry identifier
- `user_id` (UUID, Foreign Key) - References User.id
- `event_type` (Enum) - Type of authentication event
  - `login_success`, `login_failure`, `logout`, `password_reset`, `email_verification`
- `ip_address` (String) - Client IP address
- `user_agent` (String) - Client user agent string
- `created_at` (Timestamp) - Event timestamp
- `metadata` (JSON, Optional) - Additional event-specific data

**Relationships**:
- **Belongs to** User (many events per user)

**Validation Rules**:
- `event_type`: Must be valid enum value
- `ip_address`: Valid IPv4/IPv6 format
- `created_at`: Cannot be future timestamp

**Retention Policy**: Keep for 1 year for security compliance

## Authorization Entities

### Role

**Entity**: Represents a collection of permissions for access control

**Attributes**:
- `id` (UUID, Primary Key) - Unique role identifier
- `name` (String, Unique) - Human-readable role name
- `team_id` (UUID, Optional, Foreign Key) - References Team.id (null for global roles)
- `permissions` (JSON) - Permission bitmask or array of permission strings
- `created_at` (Timestamp) - Role creation timestamp
- `updated_at` (Timestamp) - Last role modification timestamp

**Relationships**:
- **One-to-Many** with TeamMembers (users assigned this role)
- **One-to-Many** with ShootMembers (shoot-specific role assignments)

**Validation Rules**:
- `name`: 1-50 characters, alphanumeric + underscores
- `permissions`: Valid permission structure (see Permission entity)

**Predefined Roles**:
- **Team Level**: Owner, Admin, Coordinator, Member, Viewer
- **Shoot Level**: Photographer, Makeup, Assistant, Stylist, Observer

---

### Permission

**Entity**: Represents individual permissions that can be granted to roles

**Attributes**:
- `id` (UUID, Primary Key) - Unique permission identifier
- `name` (String, Unique) - Permission identifier (e.g., "can_create_shoots")
- `description` (String) - Human-readable permission description
- `resource` (String) - Resource type (e.g., "shoots", "teams", "photos")
- `action` (Enum) - CRUD operation type
  - `create`, `read`, `update`, `delete`, `manage`

**Relationships**:
- **Many-to-Many** with Roles (via role_permissions junction)

**Validation Rules**:
- `name`: snake_case format, 1-100 characters
- `resource`: Valid resource type from system
- `action`: Must be valid CRUD operation

---

### TeamMember

**Entity**: Junction table linking users to teams with role assignments

**Attributes**:
- `id` (UUID, Primary Key) - Unique team membership identifier
- `team_id` (UUID, Foreign Key) - References Team.id
- `user_id` (UUID, Foreign Key) - References User.id
- `role_id` (UUID, Foreign Key) - References Role.id
- `assigned_at` (Timestamp) - Role assignment timestamp
- `updated_at` (Timestamp) - Last role change timestamp
- `assigned_by` (UUID, Foreign Key) - References User.id (who made the assignment)

**Relationships**:
- **Belongs to** Team, User, Role
- **Composite Unique**: (team_id, user_id) - One role per user per team

**Validation Rules**:
- Cannot assign Owner role to self-removal
- `assigned_by`: Must have Admin or Owner role in team

---

### ShootMember

**Entity**: Optional shoot-specific role assignments (extends team roles)

**Attributes**:
- `id` (UUID, Primary Key) - Unique shoot assignment identifier
- `shoot_id` (UUID, Foreign Key) - References Shoot.id
- `user_id` (UUID, Foreign Key) - References User.id
- `role_id` (UUID, Foreign Key) - References Role.id
- `assigned_at` (Timestamp) - Role assignment timestamp

**Relationships**:
- **Belongs to** Shoot, User, Role

**Validation Rules**:
- Shoot-level role cannot grant higher permissions than team-level role
- User must be team member to be assigned to shoot

---

### PermissionAuditLog

**Entity**: Audit trail for permission changes and access attempts

**Attributes**:
- `id` (UUID, Primary Key) - Unique audit entry identifier
- `user_id` (UUID, Foreign Key) - References User.id (who performed action)
- `action` (Enum) - Permission change type
  - `grant`, `revoke`, `modify`, `access_denied`, `access_granted`
- `role_id` (UUID, Foreign Key) - References Role.id (affected role)
- `resource_id` (UUID, Foreign Key) - References target resource (Team/Shoot)
- `granted_by_id` (UUID, Foreign Key) - References User.id (who authorized change)
- `timestamp` (Timestamp) - When action occurred
- `details` (JSON, Optional) - Additional context about the action

**Relationships**:
- **Belongs to** User (actor), Role, User (granter)

**Validation Rules**:
- `granted_by_id`: Must have sufficient permissions for the action
- `timestamp`: Cannot be future timestamp

## Database Schema Notes

### Indexes Required
- `users(email)` - For login lookups
- `auth_sessions(user_id, expires_at)` - For session cleanup
- `password_resets(user_id, expires_at)` - For cleanup and uniqueness
- `audit_logs(user_id, created_at)` - For user activity queries
- `team_members(team_id, user_id)` - For membership checks
- `shoot_members(shoot_id, user_id)` - For shoot access checks

### Row Level Security Policies
- Users can only access their own data
- Team members can access team data based on role permissions
- Shoot members can access shoot data based on role permissions
- Audit logs are readable by admins and the user themselves

### Data Retention
- `auth_sessions`: 30 days after expiration
- `password_resets`: 24 hours after expiration
- `audit_logs`: 1 year for compliance
- Deactivated user data: 30 days grace period before deletion
