# Feature Specification: Contact Directory

**Feature Branch**: `017-contact-directory`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: User description: "017-contact-directory"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Team Contact Management (Priority: P1)

Team organizers can maintain a central contact directory for all team members, models, and photographers with names, phone numbers, emails, social media handles, and notes about their roles/specializations.

**Why this priority**: Core contact management that centralizes team communication information in one accessible location.

**Independent Test**: Can be fully tested by creating contact entries with all fields, viewing directory list, and searching by name/role.

**Acceptance Scenarios**:

1. **Given** a team with members, **When** organizer adds contact with name, phone, email, Instagram handle, **Then** contact appears in directory list with all fields visible
2. **Given** directory with 20+ contacts, **When** user searches for "photographer", **Then** all contacts with photographer role display in filtered list
3. **Given** a contact entry, **When** user clicks phone number or email, **Then** device opens phone dialer or email client with pre-filled recipient

---

### User Story 2 - Availability Calendars (Priority: P2)

Team members can mark their availability status (available, busy, out of town) on calendar view, making it easy to schedule shoots when key participants are available without messaging everyone individually.

**Why this priority**: Streamlines scheduling by visualizing team availability, building on P1's contact information.

**Independent Test**: Can be fully tested by marking availability dates on calendar, viewing team calendar with all members' status, and filtering by available members for date range.

**Acceptance Scenarios**:

1. **Given** a team member contact entry, **When** user marks dates as "Out of town" on calendar, **Then** dates highlight in red with hover tooltip showing reason
2. **Given** team calendar view with all members, **When** user selects date range, **Then** members available for all dates in range highlight in green with count displayed
3. **Given** shoot planning with required roles (photographer, model), **When** user checks availability, **Then** calendar shows only members with matching roles and their availability status

---

### User Story 3 - Skills & Equipment Listings (Priority: P3)

Contacts can list their skills (photography, makeup, sewing, prop-making), owned equipment (cameras, lenses, lighting, wigs), and experience level, searchable when planning shoots to find qualified team members.

**Why this priority**: Enhances contact profiles with capabilities, useful for matching skills to shoot needs.

**Independent Test**: Can be fully tested by adding skills/equipment to contact profiles, searching directory by skill/equipment, and viewing detailed capability listings.

**Acceptance Scenarios**:

1. **Given** a photographer contact, **When** user adds skills (portrait, action shots) and equipment (Canon R5, 24-70mm lens), **Then** profile displays skills and equipment with icons
2. **Given** shoot planning requiring makeup artist, **When** user searches directory for "makeup", **Then** all contacts with makeup skill display with experience level (beginner/intermediate/expert)
3. **Given** equipment search for "lighting", **When** user views results, **Then** contacts with lighting equipment display with gear list and availability for lending

---

### User Story 4 - Emergency Contact Information (Priority: P4)

Users can designate emergency contacts with separate fields for emergency name, relationship, and phone number, accessible offline and exportable for convention shoots where medical emergencies might require quick contact.

**Why this priority**: Safety feature important for conventions and remote locations, less critical for everyday use.

**Independent Test**: Can be fully tested by adding emergency contact info to profiles, exporting contact list with emergency details as PDF, and verifying offline access.

**Acceptance Scenarios**:

1. **Given** a team member profile, **When** user adds emergency contact (name, relationship, phone), **Then** emergency info displays in separate "Emergency" section marked with alert icon
2. **Given** directory with emergency contacts, **When** user exports contact list, **Then** PDF includes member names, phones, and emergency contact details formatted for print
3. **Given** offline mode at convention, **When** user opens contact directory, **Then** all contact info including emergency contacts is accessible without internet connection

---

### Edge Cases

- What happens when contact has multiple phone numbers? System MUST allow multiple phone entries with labels (Mobile, Work, Home), show primary number prominently, and allow clicking any number to dial
- How are duplicate contacts prevented? System MUST check for existing contacts by email/phone on save, show "Possible Duplicate" warning with merge option, and allow user to proceed if intentionally separate
- What if availability calendar conflicts with shoot assignments? System MUST show warning when assigning member to shoot on marked "Unavailable" dates, allow override with confirmation, and log override reason
- How are removed team members handled? System MUST allow archiving contacts (vs deletion), hide archived from main directory, preserve historical shoot participation, and allow restoring if member returns
- What happens when exporting large directory (100+ contacts)? System MUST generate PDF export as background job (if > 50 contacts), email download link when ready (< 2 min), and include export date/team name in header
- How is privacy handled for personal phone numbers? System MUST allow contacts to mark phone/email as "Private" (visible only to organizers), respect privacy in exports, and show "Contact via platform" message to other members
- What if member updates their own contact info? System MUST allow team members to edit their own entries (phone, email, social handles, skills), send notification to organizers on changes, and log edit history
- How are preferred communication methods indicated? System MUST allow contacts to mark preferred method (email, text, Discord, Instagram DM) with rank order, show preference badge on profile, and suggest method when initiating contact

## Requirements *(mandatory)*

### Functional Requirements

#### Contact Management (FR-001 to FR-006)

- **FR-001**: System MUST allow users to create contact entries with fields: name, role (photographer/model/makeup artist/other), phone (multiple with labels), email, Instagram, Discord, notes
- **FR-002**: System MUST display contact directory as searchable/sortable list with filters by role, availability status, and alphabetical sections (A-Z)
- **FR-003**: System MUST provide click-to-contact functionality where clicking phone opens dialer, email opens mail client, social handles open respective apps/websites
- **FR-004**: System MUST detect potential duplicate contacts by matching email or phone number, show merge interface with field comparison, and allow user to merge or keep separate
- **FR-005**: System MUST allow archiving contacts (vs deletion) to preserve historical shoot participation while removing from active directory
- **FR-006**: System MUST support importing contacts from CSV files with field mapping interface and validation for phone/email formats

#### Availability Calendars (FR-007 to FR-011)

- **FR-007**: System MUST provide calendar interface for each contact to mark availability status: Available (green), Busy (yellow), Out of town (red), with optional reason notes
- **FR-008**: System MUST display team availability calendar showing all members' status side-by-side with date range selector (week/month view)
- **FR-009**: System MUST highlight dates when all required roles (based on shoot planning) are available with member count and click-to-view details
- **FR-010**: System MUST send availability reminders to team members asking them to update calendar before major events (conventions, planned shoots)
- **FR-011**: System MUST show warnings when assigning members to shoots on dates marked as "Busy" or "Out of town", allowing override with confirmation and reason logging

#### Skills & Equipment (FR-012 to FR-016)

- **FR-012**: System MUST allow contacts to list skills with categories (photography, makeup, sewing, prop-making, wig styling, editing) and experience level (beginner/intermediate/expert)
- **FR-013**: System MUST allow contacts to list owned equipment with categories (cameras, lenses, lighting, wigs, props, costumes) and availability for lending (yes/no/ask first)
- **FR-014**: System MUST provide search functionality across skills and equipment with filters by experience level and lending availability
- **FR-015**: System MUST display skill/equipment badges on contact cards in directory list for quick visual identification
- **FR-016**: System MUST suggest contacts based on shoot requirements (e.g., "Need photographer with lighting equipment") matching skills and equipment to needs

#### Emergency & Privacy (FR-017 to FR-020)

- **FR-017**: System MUST allow adding emergency contact information to profiles with separate fields for emergency contact name, relationship, phone number, marked with alert icon
- **FR-018**: System MUST export contact directory to PDF including member info, roles, and emergency contacts formatted for print with export date and team name
- **FR-019**: System MUST allow contacts to mark phone/email as "Private" (visible only to organizers) and show "Contact via platform" message to non-organizers
- **FR-020**: System MUST allow team members to edit their own contact entries with notification to organizers on changes and edit history logging (date, field, old/new values)

### Key Entities

- **Contact**: Directory entry with name, role, phone numbers (multiple), email, social handles, notes, privacy settings
- **AvailabilityCalendar**: Calendar entries per contact marking dates as available/busy/out of town with optional reason notes
- **ContactSkill**: Listed skill with category, experience level, and notes about specialization
- **ContactEquipment**: Listed equipment item with category, model/brand, and lending availability status
- **EmergencyContact**: Emergency contact info with name, relationship, phone number, linked to team member contact

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]  
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*

- **Contact**: Directory entry with name, role, phone numbers (multiple), email, social handles, notes, privacy settings
- **AvailabilityCalendar**: Calendar entries per contact marking dates as available/busy/out of town with optional reason notes
- **ContactSkill**: Listed skill with category, experience level, and notes about specialization
- **ContactEquipment**: Listed equipment item with category, model/brand, and lending availability status
- **EmergencyContact**: Emergency contact info with name, relationship, phone number, linked to team member contact

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create contact entry with all fields in under 2 minutes
- **SC-002**: Directory search returns results in under 1 second for 100+ contacts
- **SC-003**: Duplicate detection identifies potential matches in under 500ms on contact save
- **SC-004**: Team availability calendar loads and displays 10+ members for month view in under 2 seconds
- **SC-005**: CSV import processes 50 contacts with validation in under 30 seconds
- **SC-006**: PDF export generation for 100 contacts completes in under 2 minutes with email notification
- **SC-007**: Click-to-contact functionality (phone/email/social) opens correct app in under 1 second
- **SC-008**: Skill/equipment search filters and updates results in real-time (< 500ms per keystroke)
- **SC-009**: 90% of team members successfully update their own contact info within 5 minutes on first use
- **SC-010**: Offline contact directory access (cached) loads in under 1 second without internet connection
