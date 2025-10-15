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

