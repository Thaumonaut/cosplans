# Feature Specification: Editing Task Assignment

**Feature Branch**: `009-009-editing-task`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: Assign photos to editors, track editing status, annotation tools, version history, approval workflow

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Assign Photos to Editors (Priority: P1)

As a photographer/lead, I want to assign specific photos from a shoot to editors so that editing work is distributed clearly and progress can be tracked.

**Why this priority**: Core task assignment - the foundation for all editing coordination and workflow management.

**Independent Test**: User can select photos, assign to editors, editors see their assigned photos with download/edit capabilities.

**Acceptance Scenarios**:

1. **Given** shoot has 50 uploaded photos, **When** I select 10 photos and assign to "@editor_sarah", **Then** Sarah sees 10 assigned photos in her editing queue
2. **Given** I'm assigning photos, **When** I select multiple editors, **Then** same photos can be assigned to multiple people (e.g., primary and backup editor)
3. **Given** editor receives assignment, **When** they view their queue, **Then** photos display with shoot context (shoot name, date, character details)
4. **Given** assignments are made, **When** I view shoot overview, **Then** I see "15 photos assigned to Sarah, 20 to Mike, 15 unassigned"

---

### User Story 2 - Track Editing Status (Priority: P2)

As an editor, I want to mark photos as "Not Started", "In Progress", "Ready for Review", or "Approved" so that the team knows editing progress in real-time.

**Why this priority**: Status visibility enables coordination. Builds on P1 assignments with progress tracking.

**Independent Test**: Editor can update status per photo, photographer sees real-time status updates and filtering options.

**Acceptance Scenarios**:

1. **Given** I have 10 assigned photos, **When** I start editing photo #1, I mark it "In Progress", **Then** status updates for whole team with timestamp
2. **Given** I finish editing photo #1, **When** I mark "Ready for Review", **Then** photographer receives notification and photo appears in their review queue
3. **Given** photographer reviews photo, **When** they mark "Approved", **Then** photo moves to finals collection and I see confirmation
4. **Given** shoot has mixed statuses, **When** viewing overview, **Then** progress shows "5 approved, 3 ready for review, 4 in progress, 3 not started"

---

### User Story 3 - Add Editing Notes & Annotations (Priority: P3)

As a photographer providing feedback, I want to add text notes or visual annotations (arrows, circles, comments) to photos so that editors understand exactly what changes are needed.

**Why this priority**: Improves communication quality. Works with P2 review workflow to clarify editing direction.

**Independent Test**: User can add text notes and draw annotations on photos, annotations save and display for assigned editor.

**Acceptance Scenarios**:

1. **Given** photo is "Ready for Review", **When** I add note "Please brighten face by +0.5 stops", **Then** note appears with photo for editor and me
2. **Given** I'm reviewing photo, **When** I use annotation tool to circle area and add "Remove photobomber here", **Then** arrow/circle saves as layer on image preview
3. **Given** editor views photo with annotations, **When** they click annotation marker, **Then** full note and annotation display clearly
4. **Given** photo has multiple rounds of feedback, **When** viewing note history, **Then** all previous notes show with timestamps and authors

---

### User Story 4 - Version History (Priority: P4)

As an editor, I want to upload multiple versions of an edited photo so that we can compare edits and revert if needed without losing work.

**Why this priority**: Protects work and enables iteration. Valuable for professional workflows but basic editing works without versions.

**Independent Test**: User can upload v1, v2, v3 of same photo, switch between versions, compare side-by-side.

**Acceptance Scenarios**:

1. **Given** I edited photo and marked "Ready for Review", **When** I upload new version after feedback, **Then** system stores v1 and displays v2 as current
2. **Given** photo has 3 versions, **When** photographer views it, **Then** version dropdown shows "v1 (Oct 12), v2 (Oct 13), v3 (Oct 14 - current)"
3. **Given** I want to compare versions, **When** I select "Compare v1 and v3", **Then** side-by-side view displays both with swipe/toggle
4. **Given** v2 was better than v3, **When** photographer marks "Use v2 as final", **Then** v2 becomes approved version and v3 remains in history

---

### Edge Cases

- What happens when editor downloads photo for offline editing? (Track download but don't block other assignments, allow manual upload of edited version)
- How to handle very large RAW files (50MB+)? (Support but provide thumbnail previews, full res download on demand)
- What if photographer wants to reassign photo mid-edit? (Allow reassignment, notify original editor, preserve work/status)
- Should there be edit deadlines per photo? (Optional deadline field with reminders 24hrs before)
- How to handle batch status updates? (Select multiple, update status all at once)
- What if annotation tools are used on mobile? (Support basic touch annotations, full tools on desktop)
- Should approved photos be locked from further edits? (Soft lock with "Reopen editing" option requiring photographer approval)
- How to handle color profile/calibration differences? (Display profile metadata, warn if mismatched)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow selecting one or more photos from shoot and assigning to one or more editors
- **FR-002**: System MUST display assigned photos in editor's personal editing queue with shoot context
- **FR-003**: System MUST show assignment overview per shoot: assigned count per editor, unassigned count
- **FR-004**: System MUST support photo statuses: Not Started, In Progress, Ready for Review, Approved
- **FR-005**: System MUST allow editors to update photo status with real-time sync (< 2 seconds) to all team members
- **FR-006**: System MUST notify photographer when photo marked "Ready for Review"
- **FR-007**: System MUST display shoot-wide progress summary with counts per status
- **FR-008**: System MUST support filtering photos by status and assigned editor
- **FR-009**: System MUST allow adding text notes to photos (max 1000 characters per note)
- **FR-010**: System MUST support visual annotations on photos: arrows, circles, rectangles, freehand drawing, text boxes
- **FR-011**: System MUST save annotations as non-destructive layer overlay on image preview
- **FR-012**: System MUST display all notes and annotations to photo owner and assigned editors
- **FR-013**: System MUST preserve note history with timestamp and author for each note
- **FR-014**: System MUST support uploading multiple versions of same photo (v1, v2, v3...)
- **FR-015**: System MUST display version history with upload date and version number
- **FR-016**: System MUST allow selecting which version is "current" for review
- **FR-017**: System MUST provide side-by-side version comparison view
- **FR-018**: System MUST support high-resolution image display (RAW, PNG, JPG up to 50MB)
- **FR-019**: System MUST generate thumbnail previews for fast loading (< 1 second on 3G)
- **FR-020**: System MUST allow reassigning photos with notification to original and new editor
- **FR-021**: System MUST support optional deadline per photo with 24-hour reminder notifications
- **FR-022**: System MUST support batch operations: assign multiple photos at once, update status for multiple at once

### Key Entities

- **PhotoAssignment**: Links photo to editor. Attributes: photo ID, shoot ID, assigned editor user ID, assigned date, status (Not Started/In Progress/Ready for Review/Approved), deadline (optional), status updated timestamp
- **EditingNote**: Feedback on photo. Attributes: photo ID, author user ID, note text, created timestamp
- **PhotoAnnotation**: Visual markup on photo. Attributes: photo ID, annotation type (arrow/circle/rectangle/freehand/textbox), coordinates/path data, label text, author user ID, created timestamp
- **PhotoVersion**: Multiple versions of edited photo. Attributes: photo ID, version number, file path, uploaded by user ID, upload timestamp, is current version (boolean)
- **Photo**: From existing system. Extended with: current status, version count, assignment references

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can assign 20 photos to an editor in under 1 minute
- **SC-002**: Status updates sync to all team members within 2 seconds
- **SC-003**: Editor receives "Ready for Review" notification within 30 seconds of status change
- **SC-004**: Photo thumbnails load in under 1 second on 3G connection
- **SC-005**: Full-resolution photo (up to 50MB) downloads in under 10 seconds on broadband
- **SC-006**: Annotation tools respond with < 100ms latency for smooth drawing
- **SC-007**: Version comparison view loads both images in under 3 seconds
- **SC-008**: 80% of assigned photos reach "Approved" status (indicates workflow completion)
- **SC-009**: Shoots using editing workflow complete post-production 30% faster than without (measured by time from shoot to final delivery)
- **SC-010**: Photographers using annotation tools report 50% fewer clarification questions from editors (measured via survey)

