# Tasks: User Management and Access Control

**Input**: Design documents from `/specs/020-user-management-and-access/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan in `src/lib/auth/`, `src/lib/permissions/`, `src/lib/server/`
- [ ] T002 Initialize SvelteKit project with Bun runtime and required dependencies (Supabase, testing framework)
- [ ] T003 [P] Configure linting, formatting, and TypeScript with Bun
- [ ] T004 [P] Setup Supabase project with authentication and database configuration
- [ ] T005 [P] Configure environment variables for Supabase and development settings

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Setup Supabase client and authentication utilities in `src/lib/supabase.ts`
- [ ] T007 [P] Create base TypeScript types for authentication and permissions in `src/lib/types/`
- [ ] T008 [P] Implement error handling and logging infrastructure in `src/lib/utils/errors.ts`
- [ ] T009 Create authentication store for client-side state management in `src/lib/auth/auth-store.ts`
- [ ] T010 [P] Setup API helper functions for HTTP requests in `src/lib/utils/api.ts`
- [ ] T011 [P] Create validation utilities with Zod schemas in `src/lib/utils/validation.ts`
- [ ] T012 Implement theme system with CSS variables as per constitutional requirements

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - New User Sign Up (Priority: P1) 🎯 MVP

**Goal**: Enable new users to create accounts and verify email addresses

**Independent Test**: New users can register, receive confirmation, and access the app independently

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [P] [US1] Contract test for signup endpoint in `tests/contract/auth/signup.test.ts`
- [ ] T014 [P] [US1] Integration test for signup flow in `tests/integration/auth/signup-flow.test.ts`
- [ ] T015 [P] [US1] Unit test for password validation in `tests/unit/utils/validation.test.ts`

### Implementation for User Story 1

- [X] T016 [P] [US1] Create signup form component in `src/routes/register/+page.svelte` ✅ DONE
- [X] T017 [P] [US1] Implement email validation utilities (basic validation in place) ✅ DONE
- [ ] T018 [P] [US1] Create password strength validation component in `src/lib/components/auth/PasswordStrength.svelte`
- [X] T019 [US1] Implement signup via Supabase client in `src/lib/stores/auth.ts` ✅ DONE
- [ ] T020 [US1] Create email verification handler in `src/routes/callback/+page.svelte`
- [ ] T021 [US1] Add user profile creation trigger in Supabase (SQL migration)
- [X] T022 [US1] Implement signup success and error handling in UI components ✅ DONE

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 3.5: User Onboarding Flow (Priority: P1) 🎯 MVP

**Goal**: Guide new users through initial setup after registration (team creation, profile setup, preferences)

**Independent Test**: After signup, users complete onboarding and are redirected to dashboard with their team created

**Constitutional Requirement**: All users MUST be part of at least one team they own

### Implementation for Onboarding

- [ ] T022a [US1] Create onboarding page in `src/routes/onboarding/+page.svelte`
- [ ] T022b [US1] Implement onboarding flow controller in `src/routes/onboarding/+page.server.ts`
- [ ] T022c [P] [US1] Create team name input component in onboarding
- [ ] T022d [P] [US1] Create profile picture upload component in `src/lib/components/auth/ProfilePictureUpload.svelte`
- [ ] T022e [P] [US1] Create profile settings component (public profile toggle, display name, bio)
- [ ] T022f [US1] Implement automatic team creation with user as owner
- [ ] T022g [US1] Save user preferences to database (profile visibility, etc.)
- [ ] T022h [US1] Implement onboarding completion redirect to dashboard
- [ ] T022i [US1] Add "Skip for now" option with sensible defaults (private profile, generated team name)
- [ ] T022j [US1] Store onboarding completion status to prevent re-showing

**Checkpoint**: New users complete onboarding and have their initial team created

---

## Phase 4: User Story 2 - User Login (Priority: P1) 🎯 MVP

**Goal**: Enable returning users to authenticate and access their accounts

**Independent Test**: Authenticated users can access protected features; unauthenticated users are redirected to login

### Tests for User Story 2

- [ ] T023 [P] [US2] Contract test for login endpoint in `tests/contract/auth/login.test.ts`
- [ ] T024 [P] [US2] Integration test for login flow in `tests/integration/auth/login-flow.test.ts`
- [ ] T025 [P] [US2] Unit test for credential validation in `tests/unit/auth/auth-utils.test.ts`

### Implementation for User Story 2

- [X] T026 [P] [US2] Create login form component in `src/routes/login/+page.svelte` ✅ DONE
- [X] T027 [US2] Implement login via Supabase in `src/lib/stores/auth.ts` ✅ DONE
- [ ] T028 [US2] Create session management utilities in `src/lib/auth/auth-utils.ts`
- [ ] T029 [US2] Implement "Remember Me" functionality with persistent sessions
- [X] T030 [US2] Add login success redirect to dashboard ✅ DONE
- [ ] T031 [US2] Implement account lockout after failed attempts (5 attempts → 15min cooldown)
- [ ] T032 [US2] Add security logging for login events

**Checkpoint**: User Story 2 login flow complete and independently testable

---

## Phase 5: User Story 3 - Password Reset (Priority: P1) 🎯 MVP

**Goal**: Enable users to recover access to their accounts when passwords are forgotten

**Independent Test**: Users can reset password and regain access independently

### Tests for User Story 3

- [ ] T033 [P] [US3] Contract test for password reset in `tests/contract/auth/password-reset.test.ts`
- [ ] T034 [P] [US3] Integration test for reset flow in `tests/integration/auth/password-reset-flow.test.ts`

### Implementation for User Story 3

- [X] T035 [P] [US3] Create forgot password form in `src/routes/forgot-password/+page.svelte` ✅ DONE
- [X] T036 [P] [US3] Implement forgot password handler in `src/routes/forgot-password/+page.server.ts` ✅ DONE
- [X] T037 [P] [US3] Create reset password form in `src/routes/reset-password/+page.svelte` ✅ DONE
- [X] T038 [US3] Implement reset password handler in `src/routes/reset-password/+page.server.ts` ✅ DONE
- [ ] T039 [US3] Add email template configuration in Supabase for reset emails
- [ ] T040 [US3] Implement 24-hour token expiration for reset links
- [ ] T041 [US3] Add rate limiting for password reset requests

**Checkpoint**: Password reset flow complete and independently testable

---

## Phase 5.5: OAuth Social Login (Priority: P1) 🎯 MVP ⚠️ CONSTITUTIONAL REQUIREMENT

**Goal**: Implement OAuth authentication as PRIMARY authentication mechanism per Constitution

**Independent Test**: Users can sign up and log in using Google, Instagram/Facebook, or X/Twitter

**Constitutional Mandate**: "OAuth MUST be the primary authentication mechanism" - Required for MVP

### Tests for OAuth Social Login

- [ ] T041a [P] [US2] Contract test for OAuth callback in `tests/contract/auth/oauth-callback.test.ts`
- [ ] T041b [P] [US2] Integration test for OAuth flows in `tests/integration/auth/oauth-flow.test.ts`
- [ ] T041c [P] [US2] Unit test for OAuth provider configuration in `tests/unit/auth/oauth-config.test.ts`

### Implementation for OAuth Social Login

- [ ] T041d [P] [US1/US2] Configure OAuth providers in Supabase Dashboard (Google, Facebook, Twitter)
- [ ] T041e [P] [US1/US2] Create OAuth button components in `src/lib/components/auth/OAuthButtons.svelte`
- [ ] T041f [P] [US1/US2] Implement Google OAuth handler in `src/routes/auth/callback/google/+server.ts`
- [ ] T041g [P] [US1/US2] Implement Facebook/Instagram OAuth handler in `src/routes/auth/callback/facebook/+server.ts`
- [ ] T041h [P] [US1/US2] Implement X/Twitter OAuth handler in `src/routes/auth/callback/twitter/+server.ts`
- [ ] T041i [US1/US2] Create unified OAuth callback route in `src/routes/auth/callback/+server.ts`
- [ ] T041j [US1/US2] Implement social account linking logic in `src/lib/auth/social-linking.ts`
- [ ] T041k [US1/US2] Add OAuth provider selection to login page
- [ ] T041l [US1/US2] Add OAuth provider selection to signup page
- [ ] T041m [US1/US2] Implement account merge flow for existing email with different provider
- [ ] T041n [US1/US2] Add social provider display in user profile

**Checkpoint**: OAuth social login fully functional per constitutional requirements

---

## Phase 6: User Story 4 - Profile Management (Priority: P2)

**Goal**: Allow users to manage their profile information and settings

**Independent Test**: Users can view and modify their profile independently

### Tests for User Story 4

- [ ] T042 [P] [US4] Contract test for profile endpoints in `tests/contract/profile/profile-crud.test.ts`
- [ ] T043 [P] [US4] Integration test for profile management in `tests/integration/profile/profile-flow.test.ts`

### Implementation for User Story 4

- [ ] T044 [P] [US4] Create profile settings page in `src/routes/(auth)/settings/profile/+page.svelte`
- [ ] T045 [P] [US4] Implement profile API endpoints in `src/routes/api/profile/+server.ts`
- [ ] T046 [US4] Create profile edit form component in `src/lib/components/auth/ProfileForm.svelte`
- [ ] T047 [US4] Implement avatar upload functionality in `src/lib/components/auth/AvatarUpload.svelte`
- [ ] T048 [US4] Add profile update validation and confirmation
- [ ] T049 [US4] Implement real-time profile updates across team views

**Checkpoint**: Profile management complete and independently testable

---

## Phase 7: User Story 7 - Assign User Roles in Team (Priority: P1) 🎯 MVP

**Goal**: Enable team owners to assign roles and manage team permissions

**Independent Test**: Team owners can assign roles and role permissions are enforced independently

### Tests for User Story 7

- [ ] T050 [P] [US7] Contract test for role assignment in `tests/contract/permissions/role-assignment.test.ts`
- [ ] T051 [P] [US7] Integration test for role management in `tests/integration/permissions/role-management.test.ts`

### Implementation for User Story 7

- [ ] T052 [P] [US7] Create team settings page in `src/routes/(auth)/settings/team/+page.svelte`
- [ ] T053 [US7] Implement role assignment API in `src/routes/api/teams/[teamId]/members/+server.ts`
- [ ] T054 [US7] Create role management components in `src/lib/components/permissions/RoleManager.svelte`
- [ ] T055 [US7] Implement permission checking utilities in `src/lib/permissions/role-utils.ts`
- [ ] T056 [US7] Add role dropdown and assignment interface
- [ ] T057 [US7] Implement immediate permission updates across user sessions

**Checkpoint**: Role assignment complete and independently testable

---

## Phase 8: User Story 8 - Enforce Role-Based Permissions (Priority: P1) 🎯 MVP

**Goal**: Implement comprehensive permission enforcement across all application features

**Independent Test**: Different roles have different capabilities; permissions are enforced on all operations

### Tests for User Story 8

- [ ] T058 [P] [US8] Contract test for permission enforcement in `tests/contract/permissions/permission-checks.test.ts`
- [ ] T059 [P] [US8] Integration test for role-based access in `tests/integration/permissions/access-control.test.ts`

### Implementation for User Story 8

- [ ] T060 [P] [US8] Implement @casl/ability permission system in `src/lib/permissions/permissions-store.ts`
- [ ] T061 [US8] Create route guards for authorization in `src/lib/permissions/guards.ts`
- [ ] T062 [US8] Add permission checks to all API endpoints in `src/lib/server/permissions.ts`
- [ ] T063 [US8] Implement UI permission hiding/disabling in components
- [ ] T064 [US8] Add 403 Forbidden responses for unauthorized access
- [ ] T065 [US8] Implement real-time permission updates via Supabase realtime

**Checkpoint**: Permission enforcement complete and independently testable

---

## Phase 9: User Story 6 - Session Management & Security (Priority: P2)

**Goal**: Implement secure session management and security features

**Independent Test**: Sessions are properly managed and terminated; unauthorized access is prevented

### Tests for User Story 6

- [ ] T066 [P] [US6] Contract test for session management in `tests/contract/auth/session-management.test.ts`
- [ ] T067 [P] [US6] Integration test for security features in `tests/integration/auth/security-flow.test.ts`

### Implementation for User Story 6

- [ ] T068 [P] [US6] Implement session timeout handling in `src/lib/auth/auth-store.ts`
- [ ] T069 [US6] Create logout functionality in `src/routes/api/auth/logout/+server.ts`
- [ ] T070 [US6] Implement session refresh mechanism in `src/routes/api/auth/refresh/+server.ts`
- [ ] T071 [US6] Add idle timeout detection and re-authentication prompts
- [ ] T072 [US6] Implement account lockout after 10 failed password attempts
- [ ] T073 [US6] Add comprehensive security audit logging

**Checkpoint**: Session management complete and independently testable

---

## Phase 10: User Story 9 - Control Shoot Access by Role (Priority: P2)

**Goal**: Enable granular permissions for specific shoots beyond team-level roles

**Independent Test**: Shoot-level permissions work independently from team-level permissions

### Tests for User Story 9

- [ ] T074 [P] [US9] Contract test for shoot permissions in `tests/contract/permissions/shoot-access.test.ts`
- [ ] T075 [P] [US9] Integration test for shoot role management in `tests/integration/permissions/shoot-roles.test.ts`

### Implementation for User Story 9

- [ ] T076 [US9] Create shoot member assignment API in `src/routes/api/shoots/[shootId]/members/+server.ts`
- [ ] T077 [US9] Implement shoot-specific role checking in `src/lib/permissions/role-utils.ts`
- [ ] T078 [US9] Add shoot access validation to shoot pages and components
- [ ] T079 [US9] Create shoot member management UI in shoot detail pages
- [ ] T080 [US9] Implement permission inheritance (team → shoot) logic

**Checkpoint**: Shoot-level permissions complete and independently testable

---

## Phase 11: User Story 10 - Default Permissions for New Members (Priority: P2)

**Goal**: Automatically assign appropriate permissions to new team members

**Independent Test**: Default permissions are applied automatically to new members

### Tests for User Story 10

- [ ] T081 [P] [US10] Contract test for default permissions in `tests/contract/permissions/default-roles.test.ts`
- [ ] T082 [P] [US10] Integration test for new member onboarding in `tests/integration/permissions/onboarding.test.ts`

### Implementation for User Story 10

- [ ] T083 [US10] Implement automatic role assignment in team invitation flow
- [ ] T084 [US10] Create default permission templates for each role type
- [ ] T085 [US10] Add role-based UI element visibility logic
- [ ] T086 [US10] Implement new member welcome and permission explanation

**Checkpoint**: Default permissions complete and independently testable

---

## Phase 12: User Story 5 - Account Deactivation (Priority: P3)

**Goal**: Enable users to delete their accounts with proper data cleanup

**Independent Test**: Users can request account deletion independently

### Tests for User Story 5

- [ ] T087 [P] [US5] Contract test for account deactivation in `tests/contract/auth/deactivation.test.ts`
- [ ] T088 [P] [US5] Integration test for deletion flow in `tests/integration/auth/deletion-flow.test.ts`

### Implementation for User Story 5

- [ ] T089 [US5] Create account deletion request API in `src/routes/api/auth/deactivate/+server.ts`
- [ ] T090 [US5] Implement 30-day grace period with cancellation option
- [ ] T091 [US5] Create data cleanup procedures for user account deletion
- [ ] T092 [US5] Add account deletion UI in settings page

**Checkpoint**: Account deactivation complete and independently testable

---

## Phase 13: User Story 11 - Audit Access for Compliance (Priority: P3)

**Goal**: Track access and permission changes for security audit and compliance

**Independent Test**: Access logs can be viewed independently by admins

### Tests for User Story 11

- [ ] T093 [P] [US11] Contract test for audit logging in `tests/contract/security/audit-log.test.ts`
- [ ] T094 [P] [US11] Integration test for audit functionality in `tests/integration/security/audit-flow.test.ts`

### Implementation for User Story 11

- [ ] T095 [US11] Implement audit logging system in `src/lib/server/audit-log.ts`
- [ ] T096 [US11] Create audit log viewing interface for admins
- [ ] T097 [US11] Add audit logging to all permission changes
- [ ] T098 [US11] Implement log filtering and search functionality

**Checkpoint**: Audit logging complete and independently testable

---

## Dependencies & Execution Order

### User Story Completion Order (Priority-Based)

```
US1 (Signup) → US2 (Login) → US3 (Password Reset)
    ↓
US7 (Team Roles) → US8 (Permission Enforcement) → US9 (Shoot Roles)
    ↓                                               ↓
US6 (Session Mgmt) ← US4 (Profile) ←─────────────── US10 (Default Perms)
    ↓                                               ↓
US5 (Deactivation) ←───────────────────────────── US11 (Audit)
```

### Parallel Execution Opportunities

**Phase 1 (Setup)**: T002, T003, T004, T005 can run in parallel
**Phase 2 (Foundation)**: T007, T008, T009, T010, T011, T012 can run in parallel
**User Story 1**: T016, T017, T018 can run in parallel
**User Story 2**: T026 can run in parallel with T027, T028
**User Story 7**: T052, T053 can run in parallel
**User Story 8**: T060, T061, T062 can run in parallel

### Independent Testing Strategy

Each user story can be tested independently:
- **US1**: Test signup → email verification → login flow
- **US2**: Test login → session management → logout
- **US3**: Test forgot password → reset → login with new password
- **US4**: Test profile viewing → editing → avatar upload
- **US5**: Test deactivation request → grace period → data cleanup
- **US6**: Test session timeout → refresh → security events
- **US7**: Test role assignment → permission enforcement → role changes
- **US8**: Test permission checking → UI hiding → 403 responses
- **US9**: Test shoot role assignment → access control → inheritance
- **US10**: Test new member invitation → automatic permissions → UI adaptation
- **US11**: Test audit logging → admin viewing → compliance reporting

---

## Implementation Strategy

### MVP-First Approach

1. **Phase 1-2**: Complete foundational setup (1-2 days)
2. **Phase 3-5**: Implement P1 user stories (US1, US2, US3, US7, US8) for core MVP (3-4 days)
3. **Phase 6-7**: Add P2 features (US4, US6, US9, US10) for enhanced UX (2-3 days)
4. **Phase 8-9**: Complete P3 features (US5, US11) for compliance (1-2 days)

### Incremental Delivery

Each user story delivers independent value:
- **Week 1**: US1, US2, US3 (basic auth working)
- **Week 2**: US7, US8 (team permissions working)
- **Week 3**: US4, US6, US9, US10 (enhanced features)
- **Week 4**: US5, US11 (compliance features)

### Testing Integration

- Tests written BEFORE implementation for each user story
- Integration tests verify complete user journeys
- E2E tests validate critical authentication flows
- Test dashboard provides development-time observability

### Success Metrics

- ✅ All P1 user stories implemented and tested
- ✅ Authentication flows working end-to-end
- ✅ Role-based permissions properly enforced
- ✅ Session management secure and functional
- ✅ Test coverage meets constitutional requirements (70%+)
- ✅ Performance targets met (<100ms auth response, <50ms permission checks)
