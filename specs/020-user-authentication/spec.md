# Feature Specification: User Authentication and Account Management

**Feature Branch**: `020-user-authentication`  
**Created**: October 16, 2025  
**Status**: Draft  
**Tier**: 0 - Foundation (Critical - blocks everything else)  
**Priority**: P0 (Must build first)

## Overview

User authentication and account management is the foundational system that enables all other features in Cosplans. Without this, users cannot be identified, their work cannot be persisted, and no collaborative features can function.

---

## User Scenarios & Testing

### User Story 1 - New User Sign Up (Priority: P1)

A new user discovers Cosplans and wants to create an account to start planning their first shoot.

**Why this priority**: New user acquisition is critical for any application. This is the entry point for all users.

**Independent Test**: New users can register, receive confirmation, and access the app independently.

**Acceptance Scenarios**:

1. **Given** user is on sign-up page, **When** user enters email and password, **Then** account is created and confirmation email is sent
2. **Given** user receives confirmation email, **When** user clicks confirmation link, **Then** account is activated and user can log in
3. **Given** user enters weak password, **When** user attempts signup, **Then** system shows password requirements and prevents signup
4. **Given** user enters existing email, **When** user attempts signup, **Then** system shows error "Email already registered"

---

### User Story 2 - User Login (Priority: P1)

Returning user wants to log in to access their shoots and team data.

**Why this priority**: Essential daily workflow. Users must authenticate each session.

**Independent Test**: Authenticated users can access protected features; unauthenticated users are redirected to login.

**Acceptance Scenarios**:

1. **Given** user has active account, **When** user enters correct email/password, **Then** user is logged in and redirected to dashboard
2. **Given** user enters wrong password, **When** user attempts login, **Then** system shows "Invalid credentials" after 3 attempts
3. **Given** user enters non-existent email, **When** user attempts login, **Then** system shows generic error message (security: don't reveal email status)
4. **Given** user is logged in, **When** user closes browser, **Then** session persists for 30 days (or until logout)

---

### User Story 3 - Password Reset (Priority: P1)

User forgot their password and needs to regain access to their account.

**Why this priority**: Common use case. Must not lock users out permanently.

**Independent Test**: Users can reset password and regain access independently.

**Acceptance Scenarios**:

1. **Given** user is on login page, **When** user clicks "Forgot Password", **Then** user is shown email entry form
2. **Given** user enters registered email, **When** user submits, **Then** password reset email is sent within 60 seconds
3. **Given** user receives reset email, **When** user clicks reset link, **Then** user can set new password and is logged in
4. **Given** password reset link is 24 hours old, **When** user tries to use it, **Then** system shows "Link expired" and prompts for new reset

---

### User Story 4 - Profile Management (Priority: P2)

User wants to update their profile information (name, photo, bio, etc.).

**Why this priority**: Improves team collaboration and user experience but not blocking MVP.

**Independent Test**: Users can view and modify their profile independently.

**Acceptance Scenarios**:

1. **Given** user is logged in, **When** user navigates to profile settings, **Then** current information is displayed in editable form
2. **Given** user updates profile fields, **When** user clicks Save, **Then** changes are persisted and confirmation shown
3. **Given** user uploads profile photo, **When** upload completes, **Then** photo is displayed in profile and team views
4. **Given** user profile is updated, **When** other team members view team, **Then** updated profile info is visible to them

---

### User Story 5 - Account Deactivation (Priority: P3)

User wants to delete their account and all associated data.

**Why this priority**: Important for privacy/GDPR compliance but not critical for MVP launch.

**Independent Test**: Users can request account deletion independently.

**Acceptance Scenarios**:

1. **Given** user is on account settings, **When** user clicks "Delete Account", **Then** system shows confirmation dialog with warnings
2. **Given** user confirms deletion, **When** user enters password for verification, **Then** account and all data are scheduled for deletion
3. **Given** account deletion is requested, **When** 30 days pass, **Then** all account data is permanently removed from system
4. **Given** user initiates deletion, **When** 30 days haven't passed, **Then** user can cancel deletion within grace period

---

### User Story 6 - Session Management & Security (Priority: P2)

System maintains secure sessions and prevents unauthorized access.

**Why this priority**: Security is critical but can be implemented in parallel with core features.

**Independent Test**: Sessions are properly managed and terminated; unauthorized access is prevented.

**Acceptance Scenarios**:

1. **Given** user is logged in from multiple devices, **When** user logs out from one device, **Then** session terminates on that device only
2. **Given** user's session is idle for 1 hour, **When** user attempts action, **Then** user is prompted to re-authenticate
3. **Given** user logs in from new location, **When** login completes, **Then** system may send security notification (optional for MVP)
4. **Given** attacker attempts account access with 10 wrong passwords, **When** 10th attempt is made, **Then** account is temporarily locked for 15 minutes

---

### Edge Cases

- What happens if user signs up with temporary/disposable email? (Allow, but may have delivery issues)
- How does system handle users with special characters in name/email? (Support full UTF-8)
- What if user loses access to email account? (Manual support process required)
- What if password reset email is intercepted? (HTTPS required; link expires in 24h)
- How many active sessions per user? (Allow unlimited for MVP, add device management later)
- What happens if database is compromised? (Passwords must be hashed with bcrypt/argon2, not plain text)

---

## Requirements

### Functional Requirements

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

### Key Entities

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

---

## Success Criteria

### Measurable Outcomes

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

---

## Assumptions

- Email delivery service is available and reliable (will use Supabase built-in or SendGrid)
- All users have valid email addresses for recovery
- Passwords are transmitted over HTTPS only (enforced at infrastructure level)
- Initial implementation uses email/password only; OAuth2 is future enhancement
- User consent for data processing is obtained separately (see Legal & Compliance spec)
- GDPR/privacy requirements are handled in separate compliance spec

---

## Dependencies

- **Blocks**: All other features depend on this (Teams, Shoots, Permissions, etc.)
- **Required for**: Permissions system (knows which user to assign permissions to)
- **External**: Email delivery service (Supabase Auth or SendGrid)

---

## Out of Scope (For Future Phases)

- Two-factor authentication (2FA)
- OAuth2 / Social sign-in
- Single Sign-On (SSO)
- Magic link authentication
- WebAuthn/biometric authentication
- SAML authentication
