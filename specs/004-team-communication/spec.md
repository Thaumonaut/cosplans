# Feature Specification: Team Communication & Chat

**Feature Branch**: `011-011-team-communication`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: Team/shoot-level chat, @mentions, file sharing, activity feed, read receipts, mobile notifications

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Shoot-Level Chat Threads (Priority: P1)

As a team member, I want to send messages in a shoot-specific chat so that all discussions about that shoot stay organized in one place instead of scattered across group texts and social media.

**Why this priority**: Core communication - keeps shoot discussions centralized and searchable.

**Independent Test**: User can post message in shoot chat, all team members see it in real-time, messages persist and are searchable.

**Acceptance Scenarios**:

1. **Given** I'm viewing Shoot A, **When** I type "Running 15 min late" and send, **Then** message appears in shoot chat for all team members
2. **Given** team member posts message, **When** I'm viewing shoot, **Then** message appears in chat within 2 seconds
3. **Given** shoot has 50+ messages, **When** I scroll up, **Then** message history loads with infinite scroll
4. **Given** I need to find something, **When** I search "wig" in shoot chat, **Then** all messages containing "wig" highlight with context

---

### User Story 2 - @Mentions & Notifications (Priority: P2)

As a coordinator needing someone's attention, I want to @mention specific team members in messages so that they receive notifications and know I need their response.

**Why this priority**: Ensures important messages don't get buried. Builds on P1 chat with targeted attention.

**Independent Test**: User can @mention others, mentioned users receive notifications, can filter to "Mentions of me".

**Acceptance Scenarios**:

1. **Given** I'm writing message, **When** I type "@sarah" and select from autocomplete, **Then** Sarah's name becomes clickable mention
2. **Given** someone @mentions me, **When** message sent, **Then** I receive push notification "You were mentioned in Shoot A"
3. **Given** I have unread mentions, **When** I view shoots list, **Then** shoot shows "3 mentions" badge in red
4. **Given** I want to see all mentions, **When** I filter chat by "Mentions of me", **Then** only messages with my @mention display

---

### User Story 3 - File & Link Sharing (Priority: P3)

As a team member sharing resources, I want to attach images, documents, and links in chat so that everyone has access to references, contracts, or inspiration without leaving the app.

**Why this priority**: Makes chat more functional for file-heavy cosplay planning. Builds on P1-P2 messaging.

**Independent Test**: User can upload files, paste links, view shared media gallery, download attachments.

**Acceptance Scenarios**:

1. **Given** I want to share reference, **When** I drag JPG into chat, **Then** image uploads and displays inline with thumbnail
2. **Given** I paste Pinterest URL, **When** message sends, **Then** link preview shows with image/title/description
3. **Given** shoot chat has 20 shared images, **When** I click "Media" tab, **Then** gallery view shows all images chronologically
4. **Given** teammate shares PDF contract, **When** I click attachment, **Then** file downloads or opens in viewer

---

### User Story 4 - Activity Feed Integration (Priority: P4)

As a team member catching up, I want to see shoot activity (chat messages, status changes, budget updates, etc.) in unified feed so that I understand what changed while I was away.

**Why this priority**: Contextual awareness enhancement. Nice-to-have but chat works without activity integration.

**Independent Test**: User sees activity feed mixing chat messages with system events, can filter by activity type.

**Acceptance Scenarios**:

1. **Given** shoot has activity, **When** I view activity feed, **Then** I see "Sarah: Running late (2:15pm), Budget updated +$45 (2:20pm), Mike: Arrived! (2:30pm)"
2. **Given** I want just chat, **When** I toggle "Messages only", **Then** system events hide and only chat messages show
3. **Given** I was offline 2 days, **When** I return, **Then** feed shows "23 new activities since Oct 13" with expandable groups
4. **Given** activity involves me, **When** I see "@you were assigned 5 photos", **Then** activity links directly to editing queue

---

### Edge Cases

- What happens when someone deletes a message? (Soft delete with "Message deleted" placeholder, or hard delete if within 5 min?)
- How to handle chat in archived shoots? (Read-only mode, or keep active for post-shoot coordination?)
- What if file upload fails mid-transfer? (Retry mechanism, show progress, allow cancel)
- Should there be message edit capability? (Support edit within 15 min, show "edited" indicator)
- How to handle very active chats (100+ messages/day)? (Group by date, "Jump to latest", unread marker)
- What about direct messages between team members? (Not in MVP, focus on shoot-level chat)
- Should chat support reactions/emojis? (Nice-to-have: thumbs up, heart, checkmark for quick acknowledgment)
- How to handle timezone differences in timestamps? (Display in viewer's local time with hover for UTC)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide shoot-level chat thread accessible to all team members
- **FR-002**: System MUST support sending text messages (max 2000 characters) with real-time delivery (< 2 seconds)
- **FR-003**: System MUST display messages with sender name, avatar, timestamp, and content
- **FR-004**: System MUST support message history with infinite scroll pagination
- **FR-005**: System MUST provide search within shoot chat by message content
- **FR-006**: System MUST support @mention autocomplete showing team member names
- **FR-007**: System MUST send push notification when user is @mentioned
- **FR-008**: System MUST display unread mention badge count on shoot list
- **FR-009**: System MUST provide "Mentions of me" filter showing only messages with user's @mention
- **FR-010**: System MUST support file attachments (images, PDFs, up to 10MB per file)
- **FR-011**: System MUST display image attachments inline with thumbnail preview
- **FR-012**: System MUST generate link previews for pasted URLs (image, title, description)
- **FR-013**: System MUST provide "Media" gallery view showing all shared images chronologically
- **FR-014**: System MUST allow downloading attached files
- **FR-015**: System MUST provide unified activity feed mixing chat messages with system events (budget changes, status updates, assignments, etc.)
- **FR-016**: System MUST allow filtering activity feed by type (all, messages only, system events only)
- **FR-017**: System MUST group activities by date with "Jump to latest" shortcut
- **FR-018**: System MUST display unread message indicator showing last read position
- **FR-019**: System MUST support message edit within 15 minutes with "edited" indicator
- **FR-020**: System MUST support message deletion with "Message deleted" placeholder
- **FR-021**: System MUST convert timestamps to viewer's local timezone with UTC hover tooltip
- **FR-022**: System MUST support emoji reactions on messages (👍 ❤️ ✓) for quick acknowledgment

### Key Entities

- **ChatMessage**: Message in shoot chat. Attributes: shoot ID, sender user ID, message text, sent timestamp, edited timestamp (optional), deleted flag, attachment references
- **MessageAttachment**: File attached to message. Attributes: message ID, file type, file path, file size, original filename, upload timestamp
- **MessageMention**: @mention in message. Attributes: message ID, mentioned user ID, mention timestamp
- **ActivityEvent**: System event for feed. Attributes: shoot ID, event type (budget_change, status_update, assignment, etc.), actor user ID, event data (JSON), event timestamp
- **MessageReaction**: Emoji reaction on message. Attributes: message ID, user ID, emoji type, reaction timestamp
- **ReadReceipt**: Track what user has read. Attributes: user ID, shoot ID, last read message ID, last read timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Messages deliver to all team members within 2 seconds
- **SC-002**: @mention notifications arrive within 5 seconds of message sent
- **SC-003**: File uploads complete within 10 seconds for 5MB files on broadband
- **SC-004**: Link preview generation completes within 3 seconds
- **SC-005**: Chat search returns results in under 1 second for 500+ message history
- **SC-006**: Message edit/delete actions sync to all viewers within 2 seconds
- **SC-007**: 90% of teams with 5+ members use chat daily (indicates adoption)
- **SC-008**: Teams using chat report 40% reduction in external messaging tool usage (measured via survey)
- **SC-009**: Average response time to @mentions is under 2 hours (indicates notification effectiveness)
- **SC-010**: Zero message loss during delivery (100% reliability with retry mechanism)

## Team Roles & Member Management *(mandatory)*

### Overview

Effective team collaboration requires clear role definitions and member management capabilities. This section defines how teams are structured, what roles exist, and how team membership is managed across shoots and projects.

### Team Roles

The system supports the following team roles, each with specific responsibilities and permissions:

#### 1. **Team Owner**
- **Purpose**: Ultimate authority over the team and all shoots
- **Permissions**:
  - Create, edit, and delete any shoot
  - Manage all team members (invite, remove, change roles)
  - Manage team settings and billing
  - Access all team data and analytics
  - Transfer ownership to another member
- **Limits**: Exactly one owner per team
- **Default**: User who creates the team

#### 2. **Team Admin**
- **Purpose**: Help manage team operations without full ownership
- **Permissions**:
  - Create and manage shoots
  - Invite and remove members (cannot remove owner or other admins)
  - View team analytics and reports
  - Edit team profile and settings (except billing)
  - Assign roles to members (except owner and admin)
- **Limits**: No hard limit, but recommend 2-3 per team
- **Use Cases**: Co-coordinators, experienced team leads

#### 3. **Coordinator**
- **Purpose**: Manage specific shoots they're assigned to
- **Permissions**:
  - Create shoots and invite members to shoots they coordinate
  - Edit shoot details, budget, and schedules for assigned shoots
  - Assign tasks and gear to team members in their shoots
  - View and approve shot deliverables
  - Cannot remove team members from the team (only from their shoots)
- **Limits**: Permissions are shoot-specific
- **Use Cases**: Project leads, shoot organizers

#### 4. **Member (Standard)**
- **Purpose**: Active participants in shoots
- **Permissions**:
  - View shoots they're invited to
  - Post in chat, upload files, complete assigned tasks
  - Mark their own tasks complete
  - Upload photos/videos for shoots they're part of
  - Edit their own profile and availability
  - Cannot create shoots or manage other members
- **Limits**: None
- **Use Cases**: Cosplayers, photographers, makeup artists, assistants

#### 5. **Viewer (Read-Only)**
- **Purpose**: Observe shoots without active participation
- **Permissions**:
  - View shoot details, schedules, and chat
  - Download shared files
  - Cannot post messages, edit data, or upload content
- **Limits**: Cannot be assigned tasks or responsibilities
- **Use Cases**: Clients, family members, friends observing progress

### Team Member Management

#### Inviting Members

- **Invite Methods**:
  - Email invitation with unique join link
  - Shareable team join link (with optional approval requirement)
  - In-app username search and invite
  - Import from previous shoots
- **Invite Flow**:
  1. Inviter selects role for new member
  2. System sends invite via email/SMS
  3. Recipient accepts invite and creates account (or logs in)
  4. Member added to team with assigned role
- **Permissions**: Owner, Admin, and Coordinator can invite (Coordinator can only invite to their shoots)

#### Removing Members

- **Removal Actions**:
  - Remove from entire team (Owner/Admin only)
  - Remove from specific shoot (Coordinator can do this for their shoots)
  - Member can leave team voluntarily
- **Data Impact**:
  - Member's past contributions (messages, uploads) remain attributed
  - Member loses access to all team/shoot data
  - If member was assigned tasks, system prompts to reassign
  - If member uploaded deliverables, they remain in shoot gallery
- **Confirmation**: Removal requires confirmation dialog with warning about impact

#### Changing Roles

- **Who Can Change Roles**:
  - Owner: Can change any role
  - Admin: Can change Member/Viewer/Coordinator roles (not Owner/Admin)
  - Others: Cannot change roles
- **Role Change Flow**:
  1. Select member from team roster
  2. Choose new role from dropdown
  3. Confirm change
  4. Member receives notification of role change
  5. Permissions update immediately
- **Restrictions**:
  - Cannot demote the only Owner (must transfer ownership first)
  - Role changes are logged in team activity feed

#### Team Roster & Directory

- **Roster View**:
  - List all team members with name, avatar, role, join date
  - Filter by role, status (active/inactive), or shoot participation
  - Search by name or skills
  - Sort by name, role, join date, or activity level
- **Member Profiles**:
  - Display name, profile picture, bio
  - Role and permissions summary
  - Shoot history (shoots participated in)
  - Contribution stats (tasks completed, photos uploaded, messages sent)
  - Skills/specializations (photographer, makeup, props, etc.)
  - Availability calendar (integrated with scheduling)
  - Contact preferences (email, phone, preferred notification method)

### Key Entities for Team Management

- **Team**: Top-level organizational unit. Attributes: team ID, team name, owner user ID, created date, team settings, billing info
- **TeamMember**: User's membership in team. Attributes: team ID, user ID, role, join date, invited by user ID, status (active/inactive)
- **ShootMember**: User's participation in specific shoot. Attributes: shoot ID, user ID, role (specific to this shoot), added date, added by user ID
- **TeamInvite**: Pending invitation. Attributes: invite ID, team ID, inviter user ID, invitee email, role, invite link, status (pending/accepted/expired), created date, expiry date
- **RoleChangeLog**: Audit trail for role changes. Attributes: team ID, user ID, old role, new role, changed by user ID, change timestamp, reason (optional)

### Functional Requirements for Team Management

- **FR-TM-001**: System MUST support five distinct team roles: Owner, Admin, Coordinator, Member, Viewer
- **FR-TM-002**: System MUST enforce role-based permissions for all team actions
- **FR-TM-003**: System MUST allow Owner/Admin to invite new members via email with role assignment
- **FR-TM-004**: System MUST generate unique, shareable team invite links with optional approval workflow
- **FR-TM-005**: System MUST allow Owner/Admin to change member roles with immediate permission updates
- **FR-TM-006**: System MUST allow Owner/Admin to remove members from team with confirmation dialog
- **FR-TM-007**: System MUST allow Coordinators to add/remove members from shoots they coordinate
- **FR-TM-008**: System MUST display team roster with member details, roles, and activity stats
- **FR-TM-009**: System MUST allow searching and filtering team roster by role, shoot participation, or name
- **FR-TM-010**: System MUST preserve attribution of member contributions after removal (chat messages, uploads)
- **FR-TM-011**: System MUST prompt for task reassignment when removing member with assigned tasks
- **FR-TM-012**: System MUST log all role changes with timestamp, actor, and affected user in audit trail
- **FR-TM-013**: System MUST send notifications to members when their role changes
- **FR-TM-014**: System MUST allow member to view their own permissions and limitations
- **FR-TM-015**: System MUST prevent team from having zero Owners (require ownership transfer before demotion)
- **FR-TM-016**: System MUST allow members to leave team voluntarily with confirmation
- **FR-TM-017**: System MUST display member profiles with contribution history, skills, and availability
- **FR-TM-018**: System MUST support shoot-specific role assignments that differ from team-wide role

### Success Criteria for Team Management

- **SC-TM-001**: 95% of teams have clearly defined roles for all members within first week
- **SC-TM-002**: Teams with 5+ members report 60% less confusion about "who can do what" (survey)
- **SC-TM-003**: Zero unauthorized actions due to permission enforcement (100% compliance)
- **SC-TM-004**: Average time to invite and onboard new member is under 3 minutes
- **SC-TM-005**: Member removal completes in under 10 seconds with proper cleanup
- **SC-TM-006**: 90% of Coordinators successfully manage their shoots without Admin intervention
- **SC-TM-007**: Role change notifications arrive within 5 seconds of change
- **SC-TM-008**: Team roster loads in under 1 second for teams with up to 50 members

