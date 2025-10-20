# Tasks: Shoots & Teams Creation

**Input**: Design documents from `/specs/021-shoots-teams-creation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and teams feature structure

- [X] T001 Create teams directory structure in `src/lib/components/teams/`, `src/lib/server/teams/`, `src/lib/types/`
- [X] T002 [P] Create TypeScript types for teams in `src/lib/types/teams.ts`
- [X] T003 [P] Run database migration `database/migrations/004_teams_schema.sql` to create teams, team_members, and team_invitations tables
- [ ] T004 [P] Verify RLS policies are active on all team tables in Supabase dashboard
- [X] T005 [P] Add team-related environment variables if needed (none required per research.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core team infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create TeamService class in `src/lib/server/teams/team-service.ts` with createTeam, getUserTeams, getTeamById methods
- [X] T007 [P] Create InvitationService class in `src/lib/server/teams/invitation-service.ts` with createInvitation, acceptInvitation methods
- [X] T008 [P] Create team permissions helper in `src/lib/server/teams/permissions.ts` with canManageMembers, canDeleteTeam functions
- [X] T009 [P] Create team store for client-side state in `src/lib/stores/team.ts` (update existing file)
- [ ] T010 [P] Add user_profiles table migration if not exists for onboarding_completed flag

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create a New Team (Priority: P1) 🎯 MVP

**Goal**: Enable users to create teams and become owners

**Independent Test**: Users can create teams, see them in team list, and are automatically set as owners

**Constitutional Requirement**: Every user MUST own at least one team (Principle II.5)

### Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US1] Unit test for TeamService.createTeam in `tests/unit/teams/team-service.test.ts`
- [X] T012 [P] [US1] Unit test for team ownership validation in `tests/unit/teams/team-service.test.ts`
- [ ] T013 [P] [US1] E2E test for team creation flow in `tests/e2e/teams/team-creation.spec.ts`

### Implementation for User Story 1

- [X] T014 [P] [US1] Create team creation form component in `src/lib/components/teams/TeamCreateForm.svelte`
- [X] T015 [P] [US1] Create teams list page in `src/routes/(auth)/teams/+page.svelte`
- [X] T016 [P] [US1] Implement teams list loader in `src/routes/(auth)/teams/+page.server.ts`
- [X] T017 [US1] Create team creation page in `src/routes/(auth)/teams/create/+page.svelte`
- [X] T018 [US1] Implement team creation form action in `src/routes/(auth)/teams/create/+page.server.ts`
- [X] T019 [US1] Create team details page in `src/routes/(auth)/teams/[teamId]/+page.svelte`
- [X] T020 [US1] Implement team details loader in `src/routes/(auth)/teams/[teamId]/+page.server.ts`
- [X] T021 [US1] Add team validation (name 1-100 chars, description 0-500 chars)
- [X] T022 [US1] Implement automatic owner assignment in team_members table

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 3.5: Onboarding with Team Creation (Priority: P0) 🎯 MVP BLOCKER

**Goal**: Complete user onboarding by creating their first team (constitutional requirement)

**Independent Test**: After signup, users complete onboarding, create team, and are redirected to dashboard

**Constitutional Requirement**: All users MUST be part of at least one team they own

### Implementation for Onboarding

- [ ] T023 [US1] Create onboarding page in `src/routes/onboarding/+page.svelte`
- [ ] T024 [US1] Implement onboarding loader in `src/routes/onboarding/+page.server.ts` (check if already completed)
- [ ] T025 [US1] Add team name input to onboarding form (pre-filled with user's name)
- [ ] T026 [US1] Implement onboarding form action to create team in `src/routes/onboarding/+page.server.ts`
- [ ] T027 [US1] Update auth callback to redirect to onboarding if not completed in `src/routes/auth/callback/+server.ts`
- [ ] T028 [US1] Store onboarding_completed flag in user_profiles table
- [ ] T029 [US1] Implement redirect to dashboard after onboarding completion
- [ ] T030 [P] [US1] Add "Skip for now" option with auto-generated team name (optional enhancement)

**Checkpoint**: New users complete onboarding and have their initial team created

---

## Phase 4: User Story 2 - Add Members to Team (Priority: P1) 🎯 MVP

**Goal**: Enable team owners and admins to invite other users to join their teams

**Independent Test**: Team owners can send invitations, invitees receive emails, and can accept to join team

### Tests for User Story 2

- [ ] T031 [P] [US2] Unit test for InvitationService.createInvitation in `tests/unit/teams/invitation-service.test.ts`
- [ ] T032 [P] [US2] Unit test for InvitationService.acceptInvitation in `tests/unit/teams/invitation-service.test.ts`
- [ ] T033 [P] [US2] E2E test for invitation flow in `tests/e2e/teams/team-invitation-flow.spec.ts`

### Implementation for User Story 2

- [ ] T034 [P] [US2] Create team invite form component in `src/lib/components/teams/TeamInviteForm.svelte`
- [ ] T035 [P] [US2] Create team member list component in `src/lib/components/teams/TeamMemberList.svelte`
- [ ] T036 [US2] Create team settings page in `src/routes/teams/[teamId]/settings/+page.svelte`
- [ ] T037 [US2] Implement team settings loader in `src/routes/teams/[teamId]/settings/+page.server.ts`
- [ ] T038 [US2] Add inviteMember form action in `src/routes/teams/[teamId]/settings/+page.server.ts`
- [ ] T039 [US2] Implement invitation token generation using crypto.randomUUID()
- [ ] T040 [US2] Create invitation acceptance page in `src/routes/invite/[token]/+page.svelte`
- [ ] T041 [US2] Implement invitation acceptance loader in `src/routes/invite/[token]/+page.server.ts`
- [ ] T042 [US2] Add invitation acceptance form action in `src/routes/invite/[token]/+page.server.ts`
- [ ] T043 [US2] Implement auto-join logic for pending invitations (match email on signup)
- [ ] T043a [US2] Store pending invitations for non-existent users in team_invitations table
- [ ] T043b [US2] Check for pending invitations on new user signup in auth callback
- [ ] T043c [US2] Auto-accept matching invitations and add user to teams on signup
- [ ] T044 [US2] Add invitation expiration validation (7 days)
- [ ] T045 [US2] Implement email invitation sending (configure Supabase email template)

**Checkpoint**: Team invitation flow complete and independently testable

---

## Phase 5: User Story 6 - Team Member Management (Priority: P2)

**Goal**: Enable team owners and admins to manage team members (change roles, remove members)

**Independent Test**: Team owners can view members, change roles, and remove members independently

### Tests for User Story 6

- [ ] T046 [P] [US6] Unit test for role change validation in `tests/unit/teams/permissions.test.ts`
- [ ] T047 [P] [US6] Unit test for member removal validation in `tests/unit/teams/permissions.test.ts`
- [ ] T048 [P] [US6] E2E test for member management in `tests/e2e/teams/member-management.spec.ts`

### Implementation for User Story 6

- [ ] T049 [P] [US6] Add updateMemberRole form action in `src/routes/teams/[teamId]/settings/+page.server.ts`
- [ ] T050 [P] [US6] Add removeMember form action in `src/routes/teams/[teamId]/settings/+page.server.ts`
- [ ] T051 [P] [US6] Add cancelInvitation form action in `src/routes/teams/[teamId]/settings/+page.server.ts`
- [ ] T052 [US6] Implement role change UI in TeamMemberList component
- [ ] T053 [US6] Implement member removal UI with confirmation dialog
- [ ] T054 [US6] Add permission checks (only owner/admin can manage members)
- [ ] T055 [US6] Display pending invitations in team settings
- [ ] T056 [US6] Implement invitation cancellation UI

**Checkpoint**: Member management complete and independently testable

---

## Phase 6: User Story 5 - View Team and Shoot Hierarchy (Priority: P2)

**Goal**: Enable users to see all their teams organized hierarchically

**Independent Test**: Users can navigate team list and view team details independently

**Note**: Shoots deferred to next feature (spec decision)

### Tests for User Story 5

- [ ] T057 [P] [US5] E2E test for team navigation in `tests/e2e/teams/team-navigation.spec.ts`

### Implementation for User Story 5

- [ ] T058 [P] [US5] Update TeamSwitcher component in `src/lib/components/layout/TeamSwitcher.svelte` (existing file)
- [ ] T059 [P] [US5] Add team filtering by name in teams list page
- [ ] T060 [P] [US5] Add team sorting options (created date, name, member count)
- [ ] T061 [US5] Implement pagination for teams list (support 1000+ teams per spec SC-007)
- [ ] T062 [US5] Add member count display in team list
- [ ] T063 [US5] Add user role badge display in team list

**Checkpoint**: Team hierarchy navigation complete and independently testable

---

## Phase 7: Real-Time Collaboration (Priority: P1) 🎯 MVP

**Goal**: Implement real-time updates for team member changes (constitutional requirement)

**Independent Test**: Team member changes appear in real-time for all team members (<1s latency per spec SC-006)

**Constitutional Requirement**: Real-time collaboration (Principle II)

### Tests for Real-Time

- [ ] T064 [P] [US2] Integration test for real-time member updates in `tests/integration/teams/realtime-updates.test.ts`

### Implementation for Real-Time

- [ ] T065 [P] [US2] Create Supabase Realtime channel subscription in team store
- [ ] T066 [P] [US2] Add real-time listener for team_members table changes
- [ ] T067 [US2] Implement UI updates on real-time events (invalidate team members)
- [ ] T068 [US2] Add connection status indicator for real-time sync
- [ ] T069 [US2] Implement reconnection logic for offline scenarios

**Checkpoint**: Real-time collaboration functional per constitutional requirements

---

## Phase 8: Team Deletion & Ownership Transfer (Priority: P2)

**Goal**: Enable team owners to delete teams or transfer ownership (with constitutional safeguards)

**Independent Test**: Owners can delete teams (except last owned team) and transfer ownership independently

**Constitutional Requirement**: Users must own at least one team (Principle II.5)

### Tests for Deletion & Transfer

- [ ] T070 [P] [US6] Unit test for canDeleteTeam validation in `tests/unit/teams/team-service.test.ts`
- [ ] T071 [P] [US6] Unit test for ownership transfer in `tests/unit/teams/team-service.test.ts`

### Implementation for Deletion & Transfer

- [ ] T072 [P] [US6] Add deleteTeam form action in `src/routes/teams/[teamId]/settings/+page.server.ts`
- [ ] T073 [P] [US6] Add transferOwnership form action in `src/routes/teams/[teamId]/settings/+page.server.ts`
- [ ] T074 [US6] Implement last-team deletion prevention (validate user owns other teams)
- [ ] T075 [US6] Add team deletion UI with confirmation and warning
- [ ] T076 [US6] Add ownership transfer UI (select new owner from admins)
- [ ] T077 [US6] Implement soft delete (set archived_at timestamp)
- [ ] T078 [US6] Display error message when attempting to delete last owned team

**Checkpoint**: Team deletion and ownership transfer complete with constitutional safeguards

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final touches, performance optimization, and user experience improvements

- [ ] T079 [P] Add loading states to all team forms
- [ ] T080 [P] Add error handling and user-friendly error messages
- [ ] T081 [P] Implement optimistic UI updates for team operations
- [ ] T082 [P] Add team image upload functionality (optional)
- [ ] T083 [P] Add team description editing
- [ ] T084 [P] Implement team search/filter in teams list
- [ ] T085 [P] Add keyboard shortcuts for team navigation
- [ ] T086 [P] Optimize database queries with proper indexes (already in migration)
- [ ] T087 [P] Add analytics tracking for team creation and invitations
- [ ] T088 [P] Implement team activity feed (last_active tracking)
- [ ] T089 Verify all RLS policies work correctly (manual security review)
- [ ] T090 Performance test: Verify <500ms for team operations (per spec SC-008)
- [ ] T091 Performance test: Verify support for 1000+ teams per user (per spec SC-007)

---

## Dependencies & Execution Order

### Critical Path (Sequential)

1. **Phase 1: Setup** → **Phase 2: Foundational** (MUST complete first)
2. **Phase 2** → **Phase 3: User Story 1** (team creation)
3. **Phase 3** → **Phase 3.5: Onboarding** (unblocks auth completion)
4. **Phase 3.5** → **Phase 4: User Story 2** (invitations)

### Parallel Opportunities

After Phase 2 is complete, these can run in parallel:
- User Story 1 (team creation)
- User Story 5 (team hierarchy views)

After Phase 4 is complete, these can run in parallel:
- User Story 6 (member management)
- Phase 7 (real-time updates)
- Phase 8 (deletion & transfer)

### User Story Completion Order

**Priority 1 (MVP - Must Have)**:
1. US1: Create a New Team ✅
2. Onboarding with Team Creation ✅ (Constitutional blocker)
3. US2: Add Members to Team ✅
4. Real-Time Collaboration ✅ (Constitutional requirement)

**Priority 2 (Important - Should Have)**:
5. US6: Team Member Management
6. US5: View Team Hierarchy
7. Team Deletion & Ownership Transfer

**Deferred to Next Feature**:
- US3: Create a Shoot (deferred per clarification decision)
- US4: Edit Shoot Details (deferred)

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**Goal**: Unblock auth onboarding and satisfy constitutional requirements

**Includes**:
- Phase 1: Setup
- Phase 2: Foundational
- Phase 3: User Story 1 (team creation)
- Phase 3.5: Onboarding (CRITICAL - blocks auth completion)
- Phase 4: User Story 2 (invitations)
- Phase 7: Real-time updates (constitutional requirement)

**Estimated Time**: 6-8 hours

**Deliverable**: Users can complete onboarding, create teams, invite members, and see real-time updates

### Post-MVP Enhancements

**Phase 1 Enhancements**:
- User Story 6 (member management)
- User Story 5 (team hierarchy)
- Phase 8 (deletion & transfer)

**Phase 2 Enhancements**:
- Phase 9 (polish)
- Team image uploads
- Activity tracking
- Advanced search/filtering

---

## Testing Strategy

### Unit Tests (Vitest)

**Coverage Target**: 80%+ for service layer

- TeamService methods (createTeam, getUserTeams, canDeleteTeam)
- InvitationService methods (createInvitation, acceptInvitation)
- Permission helpers (canManageMembers, canDeleteTeam)

### Integration Tests

- Team creation flow (create → verify owner → list teams)
- Invitation flow (create → send → accept → verify member)
- Real-time updates (member added → all clients notified)

### E2E Tests (Playwright)

- Complete onboarding with team creation
- Team creation and navigation
- Invitation acceptance flow
- Member management operations

### Manual Testing

- RLS policy verification (cannot access other teams)
- Performance testing (1000+ teams, <500ms operations)
- Real-time latency (<1s updates)
- Constitutional requirement validation (cannot delete last owned team)

---

## Success Criteria

**MVP Complete When**:
- ✅ Users can complete onboarding by creating a team
- ✅ Users can create additional teams
- ✅ Users can invite members to teams
- ✅ Invitees can accept invitations and join teams
- ✅ Team member changes appear in real-time
- ✅ RLS policies prevent unauthorized access
- ✅ Constitutional requirement satisfied (all users own at least one team)

**Performance Targets** (per spec):
- ✅ Team operations complete in <500ms (SC-008)
- ✅ Real-time updates <1s latency (SC-006)
- ✅ Support 1000+ teams per user (SC-007)

**Quality Targets**:
- ✅ 80%+ unit test coverage
- ✅ All E2E tests passing
- ✅ Zero RLS policy violations
- ✅ Zero console errors in production

---

## Task Summary

**Total Tasks**: 94
- Setup: 5 tasks
- Foundational: 5 tasks
- User Story 1: 12 tasks (3 tests + 9 implementation)
- Onboarding: 8 tasks
- User Story 2: 18 tasks (3 tests + 15 implementation) ← Updated: +3 tasks for FR-007
- User Story 6: 11 tasks (3 tests + 8 implementation)
- User Story 5: 7 tasks (1 test + 6 implementation)
- Real-Time: 6 tasks (1 test + 5 implementation)
- Deletion & Transfer: 9 tasks (2 tests + 7 implementation)
- Polish: 13 tasks

**Parallel Opportunities**: 45 tasks marked with [P]

**MVP Tasks**: ~43 tasks (Phases 1-4 + Phase 7) ← Updated: +3 tasks

**Estimated MVP Time**: 7-9 hours ← Updated: +1 hour for FR-007 implementation

**Estimated Full Feature Time**: 13-16 hours
