# Feature Specification: Teams Creation & Cross-Team Management

**Feature Branch**: `021-shoots-teams-creation`  
**Created**: October 16, 2025  
**Updated**: October 20, 2025 (Added cross-team architecture: All Teams widget & dashboard)  
**Status**: Draft  
**Tier**: 0 - Foundation (Critical)  
**Priority**: P0 (Must build early)

## Overview

Teams are the core organizational unit in Cosplans. A Team is a group of collaborators (photographers, assistants, coordinators) who work together on photography projects. This feature enables users to create teams, invite members, and manage team membership across three levels of interaction:

1. **Team-Scoped Dashboard** (Primary Workspace): Focused view for managing a single team's shoots, costumes, and schedules
2. **All Teams Activity Widget**: Quick awareness of upcoming shoots across all teams without context switching
3. **All Teams Dashboard**: Unified cross-team view with calendar, timeline, and task management for power users

This is foundational because it satisfies the constitutional requirement that every user must own at least one team, and it unblocks user onboarding completion. The three-level architecture provides progressive disclosure: solo users work within single teams, multi-team users gain awareness through the widget, and power users leverage the full All Teams dashboard for complex coordination.

**Scope Note**: Shoots functionality (creating and managing photography events within teams) has been deferred to the next feature phase to accelerate delivery of the auth onboarding blocker. This feature focuses exclusively on team infrastructure and cross-team navigation patterns.

---

## User Scenarios & Testing

### User Story 1 - Create a New Team (Priority: P1)

User wants to create a team to organize and collaborate with other members on shoots.

**Why this priority**: Teams are the foundational organizational unit. Most users will create a team before their first shoot.

**Independent Test**: Users can create teams, invite members, and manage team settings independently.

**Acceptance Scenarios**:

1. **Given** user is logged in, **When** user clicks "Create Team", **Then** team creation form is displayed
2. **Given** user fills team name and description, **When** user submits, **Then** team is created and user becomes owner
3. **Given** team is created, **When** user navigates to teams, **Then** newly created team appears in list
4. **Given** user attempts team name with special characters, **When** user submits, **Then** team is created with sanitized name
5. **Given** user creates duplicate team with same name, **When** user submits, **Then** duplicate team is created (same name allowed for different users)

---

### User Story 2 - Add Members to Team (Priority: P1)

Team owner wants to invite other users to join their team.

**Why this priority**: Collaboration requires multiple team members. Critical for MVP.

**Independent Test**: Team owners can invite members and manage team roster independently.

**Acceptance Scenarios**:

1. **Given** user is team owner, **When** user navigates to team settings, **Then** "Invite Members" option is visible
2. **Given** user clicks invite, **When** user enters email and selects role, **Then** invitation is created and email sent to invitee
3. **Given** invitee receives email, **When** invitee clicks invite link, **Then** invitee is added to team (with existing account) or prompted to sign up (new account)
4. **Given** team member is invited, **When** 7 days pass without acceptance, **Then** invitation expires and can be re-sent
5. **Given** user enters non-existent email, **When** user submits invitation, **Then** invitation is sent anyway (email may bounce)
6. **Given** user tries to invite self, **When** user submits, **Then** system prevents self-invite with error message

---

### User Story 5 - View Team Hierarchy (Priority: P2)

User wants to see all their teams organized and easily accessible.

**Why this priority**: Essential for navigation and team management. Slightly lower priority than creation.

**Independent Test**: Users can navigate team hierarchy independently.

**Acceptance Scenarios**:

1. **Given** user has multiple teams, **When** user navigates to Teams page, **Then** all teams are listed with member counts
2. **Given** user is on team page, **When** user views team details, **Then** team name, description, and members are displayed
3. **Given** user is member of 5 teams, **When** user views dashboard, **Then** all teams are accessible from sidebar/navigation
4. **Given** user has 100+ teams, **When** user views teams list, **Then** teams are paginated for performance
5. **Given** user searches for team, **When** user enters team name, **Then** matching teams are filtered in real-time

---

### User Story 6 - Team Member Management (Priority: P2)

Team owner wants to view team members, change their roles, and remove them if needed.

**Why this priority**: Important for team administration but not critical for MVP.

**Independent Test**: Team owners can manage member roster independently.

**Acceptance Scenarios**:

1. **Given** team owner is on team settings, **When** user views members list, **Then** all members and pending invites are shown
2. **Given** member role needs changing, **When** owner updates role in member list, **Then** member's permissions change immediately
3. **Given** team owner removes member, **When** removal is confirmed, **Then** member loses access to team and its shoots
4. **Given** member is removed, **When** user tries to access team, **Then** user receives "Access Denied" error
5. **Given** pending invitation exists, **When** owner cancels it, **Then** invitation is marked expired and invitee doesn't receive it

---

### User Story 7 - All Teams Activity Widget (Priority: P2)

User with multiple teams wants quick awareness of upcoming shoots across all teams without switching context.

**Why this priority**: Provides cross-team awareness without overwhelming single-team users. Important for multi-team coordination but not critical for MVP.

**Independent Test**: Widget displays correctly and links to All Teams dashboard independently of team context.

**Acceptance Scenarios**:

1. **Given** user is on team dashboard, **When** user views page, **Then** "All Teams Activity" widget shows 5 upcoming shoots from all teams
2. **Given** widget shows shoots, **When** user views shoot items, **Then** each shoot displays team badge with team name and color
3. **Given** user clicks widget shoot, **When** shoot is clicked, **Then** user navigates to that shoot's detail page in its team context
4. **Given** user clicks "View All Teams Timeline", **When** link is clicked, **Then** user navigates to `/all-teams` dashboard
5. **Given** user has no upcoming shoots, **When** user views widget, **Then** widget shows "No upcoming shoots across all teams" message
6. **Given** user has only one team, **When** user views dashboard, **Then** widget is hidden (no need for cross-team awareness)

---

### User Story 8 - All Teams Dashboard (Priority: P3)

User managing multiple teams wants a unified view to coordinate shoots, tasks, and schedules across all projects simultaneously.

**Why this priority**: Power user feature for complex multi-team coordination. Lower priority as it serves advanced use cases.

**Independent Test**: All Teams dashboard functions independently of team context switching.

**Acceptance Scenarios**:

1. **Given** user navigates to `/all-teams`, **When** page loads, **Then** calendar view shows shoots from all user's teams with color-coded team indicators
2. **Given** user is on calendar view, **When** user switches to timeline view, **Then** Gantt chart displays all teams' shoots in parallel timelines
3. **Given** user is on timeline view, **When** user switches to tasks view, **Then** aggregated task list shows tasks from all teams sorted by priority and due date
4. **Given** user views calendar, **When** user clicks team filter dropdown, **Then** user can filter view to specific teams or "All Teams"
5. **Given** user filters to specific team, **When** filter is applied, **Then** only that team's shoots/tasks are displayed
6. **Given** user clicks shoot on calendar, **When** shoot is clicked, **Then** shoot detail modal opens showing team context and full shoot information
7. **Given** user has 10+ teams, **When** user views timeline, **Then** timeline is scrollable and performant with all teams visible
8. **Given** user switches team context in navigation, **When** user returns to All Teams page, **Then** All Teams page still shows all teams (not affected by context switch)
9. **Given** user has no teams, **When** user navigates to `/all-teams`, **Then** user sees empty state with prompt to create first team

---

### Edge Cases

- What if user creates team but never adds members? (Allowed - single-user team is valid)
- What if user is invited to team they already own? (Prevent duplicate membership)
- What if team owner leaves team? (Transfer ownership to oldest member or prevent removal)
- What if all team members are removed? (Team continues to exist, empty team is valid)
- What if shoot name contains Unicode characters? (Support full UTF-8)
- What if user is member of 1000 teams? (Might need pagination/filtering on UI)
- What if shoot is created with past date? (Allowed - for historical tracking)

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow authenticated user to create a team with name and optional description
- **FR-002**: System MUST automatically set team creator as team owner
- **FR-003**: System MUST allow team owner to invite other users by email to join team
- **FR-004**: System MUST send invitation email to invitees with join link
- **FR-005**: System MUST create pending invitation that expires after 7 days
- **FR-006**: System MUST allow invitee to accept invitation via email link
- **FR-007**: System MUST auto-create account for invited user if they don't have one (store pending user in system)
- **FR-008**: System MUST track team member roles (owner, admin, member)
- **FR-009**: System MUST allow team owner or admin to change member roles
- **FR-010**: System MUST allow team owner or admin to remove members from team
- **FR-011**: System MUST prevent non-team members from accessing team data
- **FR-012**: System MUST display team members and their current roles
- **FR-013**: System MUST display pending invitations with expiration dates
- **FR-014**: System MUST allow canceling pending invitations
- **FR-015**: System MUST support team archive/unarchive (soft delete)

### Key Entities

- **Team**: Represents a group of collaborators
  - Attributes: id, name, description, owner_id, created_at, updated_at, archived_at, image_url
  - Relationships: has_many Users (via TeamMembers), has_many TeamInvitations

- **TeamMember**: Represents membership of a user in a team
  - Attributes: id, team_id, user_id, role (owner/admin/member), joined_at, invited_by, last_active, custom_permissions, created_at, updated_at
  - Relationships: belongs_to Team, belongs_to User, belongs_to User (invited_by)

- **TeamInvitation**: Represents pending team membership invitation
  - Attributes: id, team_id, email, role, token, created_at, expires_at, accepted_at
  - Relationships: belongs_to Team

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: User can create team in under 1 minute
- **SC-002**: Team invitation email is sent within 10 seconds of invite action
- **SC-003**: Invitee can accept invitation and join team in under 2 minutes
- **SC-004**: User can add 10 team members in under 5 minutes
- **SC-005**: All team members see team updates in real-time (within 1 second)
- **SC-006**: System supports 1000+ teams per user without performance degradation
- **SC-007**: 99% of team operations complete in under 500ms
- **SC-008**: Invitation acceptance works for users with and without existing accounts
- **SC-009**: Team member count can scale to 1000+ members without performance issues

---

## Assumptions

- Email delivery works reliably (handled by auth service, see Auth spec)
- Each user has unique email for invitation purposes
- Team names can contain Unicode characters and special characters
- Team owner cannot be removed (must transfer ownership first)
- Soft delete (archiving) is used instead of hard delete for historical tracking
- Real-time updates use existing sync mechanism (Supabase Realtime)

---

## Dependencies

- **Depends on**: Authentication system (Auth spec 020) - must know which user is creating teams
- **Blocks**: User onboarding completion (constitutional requirement)
- **Enables**: Shoot planning features (next phase), Team communication
- **Related to**: Permissions & Access Control spec (member roles)

---

## Out of Scope (For This Phase)

### Deferred to Next Feature (Shoots)
- Shoot creation and management
- Shoot details (title, date, location, etc.)
- Shoot member assignments
- Shoot archiving

### Future Phases
- Team hierarchy/sub-teams
- Team templates
- Duplicate team functionality
- Advanced member filtering/search
- Team analytics
- Member skill tracking
