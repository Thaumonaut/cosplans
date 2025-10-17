# Feature Specification: Shot-by-Shot Planning with Director Notes

**Feature Branch**: `004-004-shot-by`  
**Created**: 2025-01-09  
**Status**: Draft  
**Input**: Storyboard builder with shot list, director notes, camera angles, timing markers, and reference images per shot

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Basic Shot List (Priority: P1)

As a photographer/director, I want to create a numbered list of shots for a shoot so that I can organize the sequence of photos/videos we'll capture and share it with the team.

**Why this priority**: Core functionality that delivers immediate value - a simple shot list is the foundation for all planning and coordination. Can be used even without advanced features.

**Independent Test**: User can create a shoot, add numbered shots with descriptions, reorder them, and share the list view with team members who can all see the same sequence.

**Acceptance Scenarios**:

1. **Given** I'm viewing a shoot, **When** I click "Plan Shots" and add a new shot with description "Opening wide shot of location", **Then** shot #1 is created and displayed in the shot list
2. **Given** I have 3 shots in my list, **When** I drag shot #3 to position #1, **Then** all shots renumber automatically (3→1, 1→2, 2→3)
3. **Given** another team member views the same shoot, **When** I add/reorder shots, **Then** their view updates in real-time
4. **Given** I have a shot list, **When** I mark shot #5 as "Completed", **Then** the shot shows completed status and progress indicator updates

---

### User Story 2 - Add Director Notes & Camera Details (Priority: P2)

As a director, I want to add technical notes to each shot including camera angle, lens choice, lighting setup, and creative direction so that the photographer and team know exactly what to capture.

**Why this priority**: Adds professional planning capability that significantly improves shoot efficiency and quality. Builds on P1 with detailed technical information.

**Independent Test**: User can add/edit director notes fields to existing shots, and photographers can view these notes on mobile during the shoot to follow the creative vision.

**Acceptance Scenarios**:

1. **Given** I'm editing shot #4, **When** I select camera angle "Low angle (looking up)", lens "50mm f/1.8", and add notes "Golden hour lighting, dramatic shadows", **Then** all fields save and display on shot detail view
2. **Given** I'm planning a character shoot, **When** I add pose reference "heroic stance" and composition note "rule of thirds, character right side", **Then** photographer can view these notes on their phone during shooting
3. **Given** I've specified lighting "natural window light", **When** the photographer is on location, **Then** they can check off this requirement as achieved
4. **Given** multiple shots have similar setups, **When** I use "Copy settings from shot #2", **Then** camera angle, lens, and lighting copy to current shot but notes remain independent

---

### User Story 3 - Attach Reference Images (Priority: P3)

As a creative director, I want to attach multiple reference images to each shot (from pose library, web uploads, or previous shoots) so that everyone visualizes the intended composition, pose, and style.

**Why this priority**: Visual references dramatically improve communication and alignment. Requires P1 shot structure and enhances P2 technical notes.

**Independent Test**: User can attach 1-5 reference images per shot from various sources, view them in shot details, and see thumbnail previews in shot list view.

**Acceptance Scenarios**:

1. **Given** I'm planning shot #7, **When** I click "Add reference" and select image from AI pose library (feature 002), **Then** reference attaches and displays thumbnail in shot card
2. **Given** I have reference inspiration from Pinterest, **When** I upload JPG file or paste image URL, **Then** image imports and displays alongside other references
3. **Given** shot #3 has 4 reference images, **When** photographer taps shot on mobile, **Then** they can swipe through full-screen references while shooting
4. **Given** I want to reuse a shot from previous shoot, **When** I select photo from team's completed shoot gallery, **Then** it attaches as reference with link to original shoot context

---

### User Story 4 - Add Timing Markers & Schedule (Priority: P4)

As a shoot planner, I want to assign estimated duration and scheduled time to each shot so that we can manage shoot day timeline and ensure we complete everything within available time.

**Why this priority**: Critical for professional shoots with time constraints, but shot list is still valuable without timing. Builds on P1-P3 by adding schedule management.

**Independent Test**: User can assign estimated minutes per shot, view total duration calculation, and optionally sync specific shots to calendar time blocks.

**Acceptance Scenarios**:

1. **Given** I'm planning 12 shots, **When** I set shot #1 duration to "15 min" and shot #2 to "10 min", **Then** system shows running total time (25 min so far) and estimated completion time
2. **Given** shoot day starts at 10:00 AM, **When** I enable "Schedule mode", **Then** each shot shows calculated start time (shot #1: 10:00-10:15, shot #2: 10:15-10:25)
3. **Given** we're running behind schedule during shoot, **When** we complete shot #4 at 11:30 instead of 11:15, **Then** system recalculates remaining shot times and warns if we'll exceed end time
4. **Given** I've planned shot times, **When** I link to Google Calendar event, **Then** shots sync as sub-tasks with time blocks within the main shoot event

---

### Edge Cases

- What happens when a user drags a shot to reorder but connection drops mid-drag? (Optimistic UI with rollback on conflict)
- How does system handle very large shot lists (100+ shots)? (Pagination or virtual scrolling)
- What if two users simultaneously edit the same shot's notes? (Manual conflict resolution with diff view showing both versions)
- How are reference images handled if original source is deleted? (Store copies, not just links; handle gracefully with placeholder if lost)
- What happens when timing estimates are wildly inaccurate during shoot? (Easy manual time adjustment + learn from actual time taken for future estimates)
- Should completed shots affect the order/sequence? (No auto-reorder, but offer filter to "hide completed" view)
- What if user deletes a shot then wants to restore it from archive? (Restore appends to end of current list, user can then reorder as needed)
- How long should archived shots be retained? (Indefinitely as part of shoot history, unless shoot itself is deleted)
- What happens if user edits a shot offline and another user deletes it online? (Conflict resolution prompt: "Shot was deleted, restore with your changes or discard?")

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create numbered shots within a shoot with description field (min 1, max 500 characters)
- **FR-002**: System MUST support drag-and-drop reordering of shots with automatic renumbering
- **FR-003**: System MUST persist shot order and broadcast changes to all connected team members in real-time (< 2 second propagation)
- **FR-004**: System MUST allow marking individual shots as "Not Started", "In Progress", "Completed", or "Skipped"
- **FR-005**: System MUST display overall progress (e.g., "5 of 12 shots completed")
- **FR-006**: System MUST provide shot detail view with expandable fields for director notes, camera settings, and references
- **FR-007**: System MUST support camera angle selection from predefined dropdown ("Eye level", "High angle", "Low angle", "Dutch angle", "Over-the-shoulder", "POV", "Bird's eye", "Worm's eye") with "Other (specify)" free text option
- **FR-008**: System MUST support lens/focal length input from predefined common options ("16mm", "24mm", "35mm", "50mm", "85mm", "100mm macro", "70-200mm zoom") with free text fallback for custom lenses
- **FR-009**: System MUST support lighting setup via predefined presets ("Golden hour natural", "Studio 3-point", "Overcast diffused", "Ring light", "Backlit", "Low-key dramatic") with additional free text notes field
- **FR-010**: System MUST allow director notes field (max 2000 characters) with rich text formatting (bold, italic, bullet lists, numbered lists) that saves as Markdown
- **FR-011**: System MUST support attaching 1-5 reference images per shot from multiple sources: AI pose library (feature 002), file upload (JPG/PNG, max 5MB each), URL import, previous shoot photos
- **FR-012**: System MUST store copies of reference images (not just links) to prevent broken references
- **FR-013**: System MUST display reference image thumbnails in shot list view and full-screen swipeable gallery in shot detail
- **FR-014**: System MUST allow optional estimated duration per shot in minutes (0-999)
- **FR-015**: System MUST calculate and display total estimated shoot duration from sum of all shot durations
- **FR-016**: System MUST optionally calculate scheduled start time per shot based on shoot start time and cumulative durations
- **FR-017**: System MUST allow marking actual start/end time during shoot for schedule tracking
- **FR-018**: System MUST recalculate remaining schedule when actual times differ from estimates
- **FR-019**: System MUST warn user when schedule overruns the shoot end time
- **FR-020**: System MUST support copying camera/lighting settings from one shot to another (notes remain independent)
- **FR-021**: System MUST support soft deletion of shots with automatic renumbering (sequence remains consecutive: 1,2,3,4 after deleting old #3) and maintain separate "Archived Shots" list showing deleted shots with original numbers and deletion timestamp
- **FR-022**: System MUST provide mobile-optimized view for viewing shots during active shooting
- **FR-023**: System MUST work offline with full edit capabilities and manual conflict resolution prompts when connection restored (user chooses which version to keep or merges changes)
- **FR-024**: System MUST integrate with Google Calendar to optionally sync shots as sub-tasks/blocks within shoot event
- **FR-025**: System MUST provide "Archived Shots" view showing all deleted shots with original sequence numbers, description, deletion timestamp, and restore capability

### Key Entities

- **Shot**: Represents a single planned photo/video in a shoot sequence. Attributes: sequence number, description, status (not started/in progress/completed/skipped), camera angle, lens/focal length, lighting setup, director notes, estimated duration, actual start time, actual end time, creation timestamp, last modified timestamp
- **ShotReference**: Link between Shot and reference image. Attributes: shot ID, image source (uploaded file path, URL, AI library ID, previous shoot photo ID), display order (1-5), caption/note
- **Shoot**: Parent entity for shots (already exists in system). Extended with: shot planning enabled flag, shoot start time (for schedule calculation)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a basic 5-shot plan within 3 minutes from shoot page
- **SC-002**: Shot list updates appear on all connected clients within 2 seconds of changes
- **SC-003**: Mobile view loads shot list with references in under 2 seconds on 3G connection
- **SC-004**: 90% of shoots using shot planning feature complete planning before shoot day (indicates planning value)
- **SC-005**: Users can reorder 10+ shots via drag-drop without perceived lag or UI jank
- **SC-006**: Reference images remain accessible even if original source deleted (100% reliability)
- **SC-007**: Photographers report shot list improved shoot efficiency (measured via post-shoot survey, target: 75% agree)
- **SC-008**: Schedule calculation accurately reflects actual shoot duration within ±20% variance (improves over time with actual time tracking)
- **SC-009**: Offline mode allows viewing all shot details and marking completion, syncs successfully when reconnected (99% success rate)
- **SC-010**: Zero data loss during concurrent editing conflicts (automated or manual resolution)

