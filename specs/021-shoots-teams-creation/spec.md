# Feature Specification: Shoots & Teams Creation

**Feature Branch**: `021-shoots-teams-creation`  
**Created**: October 16, 2025  
**Status**: Draft  
**Tier**: 0 - Foundation (Critical)  
**Priority**: P0 (Must build early)

## Overview

Shoots and Teams are the core organizational units in Cosplans. A Team is a group of collaborators (photographers, assistants, coordinators), and a Shoot is a planned event within a team context. This feature enables users to create these entities and add members. This is foundational because almost every other feature depends on existing shoots and teams.

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

### User Story 3 - Create a Shoot (Priority: P1)

Team member wants to create a new shoot event to plan and track a photography session.

**Why this priority**: Shoots are central to the app's purpose. Users need to create shoots to use any other feature.

**Independent Test**: Team members can create shoots independently.

**Acceptance Scenarios**:

1. **Given** user is in a team, **When** user clicks "Create Shoot", **Then** shoot creation form is displayed
2. **Given** user fills shoot title, date, location, **When** user submits, **Then** shoot is created in team
3. **Given** shoot is created, **When** user navigates to team shoots, **Then** new shoot appears in list
4. **Given** user sets future shoot date, **When** shoot is created, **Then** shoot appears in upcoming shoots
5. **Given** user sets past shoot date, **When** shoot is created, **Then** shoot still appears (allows archiving past shoots)
6. **Given** user attempts to create shoot without team, **When** user submits, **Then** system shows error "Select team first"

---

### User Story 4 - Edit Shoot Details (Priority: P2)

Team member wants to update shoot information as plans change.

**Why this priority**: Important for managing shoot lifecycle but not critical for MVP.

**Independent Test**: Users can update shoot details independently.

**Acceptance Scenarios**:

1. **Given** user is team member on shoot, **When** user clicks edit, **Then** shoot form is shown with current values
2. **Given** user updates shoot fields, **When** user saves, **Then** changes are persisted and all team members see updates in real-time
3. **Given** shoot time is changed, **When** change is saved, **Then** team members are notified of time change
4. **Given** user removes shoot date, **When** user saves, **Then** shoot is marked as unscheduled
5. **Given** user with view-only permission attempts edit, **When** user tries to save, **Then** system shows error "Permission denied"

---

### User Story 5 - View Team and Shoot Hierarchy (Priority: P2)

User wants to see all their teams and shoots organized hierarchically.

**Why this priority**: Essential for navigation and team/shoot management. Slightly lower priority than creation.

**Independent Test**: Users can navigate team/shoot hierarchy independently.

**Acceptance Scenarios**:

1. **Given** user has multiple teams, **When** user navigates to Teams page, **Then** all teams are listed
2. **Given** user is on team page, **When** user views shoots section, **Then** all team shoots are listed
3. **Given** shoot is created, **When** user navigates to team, **Then** shoot appears in team's shoot list with date and status
4. **Given** user is member of 5 teams, **When** user views dashboard, **Then** all teams are accessible from sidebar/navigation
5. **Given** user filters shoots by date, **When** filter is applied, **Then** only shoots in date range are shown

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
- **FR-008**: System MUST track team member roles (owner, admin, coordinator, member, viewer)
- **FR-009**: System MUST allow team owner to change member roles
- **FR-010**: System MUST allow team owner to remove members from team
- **FR-011**: System MUST allow authenticated user to create a shoot within a team
- **FR-012**: System MUST associate shoot with team upon creation
- **FR-013**: System MUST allow shoot creator to be marked as shoot lead/organizer
- **FR-014**: System MUST store shoot details: title, description, date, time, location, thumbnail/cover image
- **FR-015**: System MUST allow team members to edit shoot details (permissions-dependent)
- **FR-016**: System MUST prevent non-team members from accessing team data
- **FR-017**: System MUST display team members and their current roles
- **FR-018**: System MUST display pending invitations with expiration dates
- **FR-019**: System MUST allow canceling pending invitations
- **FR-020**: System MUST display all shoots in a team, filterable by date/status
- **FR-021**: System MUST support team archive/unarchive (soft delete)
- **FR-022**: System MUST support shoot archive/unarchive (soft delete)

### Key Entities

- **Team**: Represents a group of collaborators
  - Attributes: id, name, description, owner_id, created_at, updated_at, archived_at, image_url
  - Relationships: has_many Users (via TeamMembers), has_many Shoots, has_many TeamInvitations

- **TeamMember**: Represents membership of a user in a team
  - Attributes: id, team_id, user_id, role (owner/admin/coordinator/member/viewer), joined_at
  - Relationships: belongs_to Team, belongs_to User

- **TeamInvitation**: Represents pending team membership invitation
  - Attributes: id, team_id, email, role, token, created_at, expires_at, accepted_at
  - Relationships: belongs_to Team

- **Shoot**: Represents a planned photography event
  - Attributes: id, team_id, title, description, date, time, location, status, created_by_id, created_at, updated_at, archived_at, thumbnail_url
  - Relationships: belongs_to Team, belongs_to User (creator), has_many Photos, has_many Notes

- **ShootMember**: Optional - tracks which specific team members are assigned to a shoot
  - Attributes: id, shoot_id, user_id, role (photographer/assistant/makeup/etc), assigned_at
  - Relationships: belongs_to Shoot, belongs_to User

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: User can create team in under 1 minute
- **SC-002**: Team invitation email is sent within 10 seconds of invite action
- **SC-003**: Invitee can accept invitation and join team in under 2 minutes
- **SC-004**: User can create shoot in under 2 minutes
- **SC-005**: User can add 10 team members in under 5 minutes
- **SC-006**: All team members see shoot/team updates in real-time (within 1 second)
- **SC-007**: System supports 1000+ teams per user without performance degradation
- **SC-008**: 99% of team operations complete in under 500ms
- **SC-009**: Invitation acceptance works for users with and without existing accounts
- **SC-010**: Team member count can scale to 1000+ members without performance issues

---

## Assumptions

- Email delivery works reliably (handled by auth service, see Auth spec)
- Each user has unique email for invitation purposes
- Team names can contain Unicode characters and special characters
- Shoot dates can be in past, present, or future
- Team owner cannot be removed (must transfer ownership first)
- Soft delete (archiving) is used instead of hard delete for historical tracking
- Real-time updates use existing sync mechanism (see Realtime & Offline spec)

---

## Dependencies

- **Depends on**: Authentication system (Auth spec) - must know which user is creating teams/shoots
- **Blocks**: Permissions system refinement, Shoot planning features, Team communication
- **Related to**: Permissions & Access Control spec (member roles)

---

## Out of Scope (For Future Phases)

- Team hierarchy/sub-teams
- Team templates
- Duplicate team/shoot functionality
- Advanced member filtering/search
- Team analytics
- Member skill tracking
- Shift/slot management for shoots
- Shoot capacity limits
