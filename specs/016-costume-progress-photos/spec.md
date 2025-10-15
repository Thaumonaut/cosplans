# Feature Specification: Costume Progress Photos

**Feature Branch**: `016-costume-progress-photos`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: User description: "016-costume-progress-photos"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Progress Timeline Documentation (Priority: P1)

Cosplayers can document their costume creation process by uploading progress photos with dates and notes, creating a visual timeline from initial planning through final completion that automatically organizes chronologically.

**Why this priority**: Core documentation functionality that helps cosplayers track their work-in-progress and share their creative journey.

**Independent Test**: Can be fully tested by creating costume entry, uploading photos at different stages with dates/notes, and viewing chronological timeline with thumbnails.

**Acceptance Scenarios**:

1. **Given** a new costume project, **When** user uploads progress photo with date and note "Cut fabric pieces", **Then** photo appears in timeline with date stamp and note visible below
2. **Given** multiple progress photos uploaded out of order, **When** user views timeline, **Then** photos auto-sort chronologically by date with earliest at top
3. **Given** progress timeline with 10+ photos, **When** user clicks photo, **Then** full-size image displays with swipe navigation to previous/next photos

---

### User Story 2 - Before/After Comparisons (Priority: P2)

Users can create side-by-side before/after comparison views showing costume evolution (initial fabric vs finished piece, wig styling stages, armor construction steps) with slider control for dramatic reveals.

**Why this priority**: Enhances progress visualization by showing transformation clearly, building on P1's timeline documentation.

**Independent Test**: Can be fully tested by selecting two progress photos from timeline, creating comparison view with slider control, and verifying smooth transition between images.

**Acceptance Scenarios**:

1. **Given** timeline with progress photos, **When** user selects "Create Comparison" and picks two photos, **Then** side-by-side view displays with vertical slider control
2. **Given** before/after comparison view, **When** user drags slider left/right, **Then** slider reveals before image (left) and after image (right) smoothly
3. **Given** multiple comparisons created, **When** user views costume page, **Then** featured comparisons display as gallery with play button for auto-slide animation

---

### User Story 3 - Construction Notes & Materials (Priority: P3)

Cosplayers can attach detailed construction notes to progress photos including techniques used, materials/patterns purchased, time spent, and challenges encountered, searchable for future reference.

**Why this priority**: Adds context and reference value to progress photos, useful for portfolio and future projects.

**Independent Test**: Can be fully tested by adding detailed notes to progress photo (materials, time, techniques), saving, and searching notes by keyword to find relevant photos.

**Acceptance Scenarios**:

1. **Given** a progress photo, **When** user adds construction note with materials (Worbla, EVA foam), time (5 hours), techniques (heat forming), **Then** note saves with structured fields visible on photo detail page
2. **Given** multiple photos with notes mentioning "Worbla", **When** user searches construction notes for "Worbla", **Then** all relevant photos display with matching notes highlighted
3. **Given** costume with completion date, **When** user views costume summary, **Then** total time spent (sum of all photo time entries) displays with material cost aggregation

---

### User Story 4 - Pattern & Reference Attachments (Priority: P4)

Users can attach sewing patterns (PDF), reference images, tutorial links, and material receipts to costume progress entries for complete project documentation that's accessible during future builds.

**Why this priority**: Completes comprehensive documentation with all related files organized with progress photos.

**Independent Test**: Can be fully tested by uploading pattern PDF, reference images, and tutorial URLs to costume entry, then accessing files from progress timeline.

**Acceptance Scenarios**:

1. **Given** a costume progress entry, **When** user uploads sewing pattern PDF, **Then** pattern appears in "Attachments" section with download link and file size
2. **Given** progress photo with reference images attached, **When** user clicks "View References", **Then** all reference images display in lightbox gallery
3. **Given** multiple patterns/receipts attached, **When** user views costume archive, **Then** all files remain accessible with original filenames and upload dates preserved

---

### Edge Cases

- What happens when progress photos are uploaded without dates? System MUST use upload timestamp as default date, allow user to edit date retroactively, and show warning icon if date seems unrealistic (future date or > 5 years past)
- How are very large photo collections handled? System MUST implement pagination (20 photos per page), thumbnail lazy loading, and option to collapse timeline sections by month/year for better navigation
- What if user wants to reorganize timeline manually? System MUST allow drag-and-drop reordering of photos overriding chronological sort, with "Reset to Chronological" button to restore date-based ordering
- How are deleted progress photos handled in comparisons? System MUST detect deleted photos in saved comparisons, show placeholder with "Photo Removed" message, and allow user to select replacement photo or delete comparison
- What happens when construction notes have sensitive pricing info? System MUST allow users to mark notes/materials as "Private" (visible only to creator), excluding private data from shared/exported versions
- How are pattern PDFs with large file sizes handled? System MUST enforce 50MB per-file limit, compress PDFs automatically if > 10MB, and show upload progress bar for files > 5MB
- What if user forgets to log time spent? System MUST allow retroactive time entry editing, calculate gaps in timeline (days between photos), and suggest estimated hours based on costume complexity
- How are before/after comparisons shared externally? System MUST generate shareable comparison URLs (read-only, no login required), with optional password protection and expiration dates

## Requirements *(mandatory)*

### Functional Requirements

#### Progress Timeline (FR-001 to FR-006)

- **FR-001**: System MUST allow users to create costume progress entries associated with costume items in inventory, with title, character/series, start date, and target completion date
- **FR-002**: System MUST allow users to upload progress photos (JPEG/PNG) with date, caption/notes (up to 500 characters), and automatic thumbnail generation (200px, 800px)
- **FR-003**: System MUST display progress timeline view with photos sorted chronologically (earliest to latest), showing date stamps, captions, and photo count per stage
- **FR-004**: System MUST allow users to edit progress photo dates, captions, and order via drag-and-drop or date picker interface
- **FR-005**: System MUST implement photo lightbox viewer with swipe/keyboard navigation (prev/next) and pinch-to-zoom on mobile devices
- **FR-006**: System MUST allow users to organize timeline by stages (Planning, Fabric Cutting, Sewing, Details, Final) with collapsible sections and photo counts per stage

#### Before/After Comparisons (FR-007 to FR-010)

- **FR-007**: System MUST allow users to create before/after comparison views by selecting two progress photos from timeline with side-by-side or slider layout
- **FR-008**: System MUST provide slider control for comparisons that reveals before (left) and after (right) images smoothly as user drags handle
- **FR-009**: System MUST allow users to save comparison views with captions (e.g., "Wig Styling Evolution") and feature them on costume detail page
- **FR-010**: System MUST generate shareable comparison URLs (no login required) with optional password protection and 30/90-day expiration dates

#### Construction Notes & Materials (FR-011 to FR-016)

- **FR-011**: System MUST allow users to attach structured construction notes to progress photos including materials used, techniques applied, time spent (hours), and challenges encountered
- **FR-012**: System MUST provide material library with autocomplete for commonly used items (Worbla, EVA foam, fabric types, paints, adhesives) and custom entry option
- **FR-013**: System MUST calculate total time spent and material costs per costume by aggregating time/cost entries across all progress photos
- **FR-014**: System MUST provide search functionality across construction notes by keywords, materials, techniques, or date ranges
- **FR-015**: System MUST allow users to mark notes/materials as "Private" (visible only to creator) or "Public" (visible in shared views)
- **FR-016**: System MUST generate costume summary report with timeline, total time/cost, materials list, and key progress milestones (PDF export)

#### Pattern & Reference Attachments (FR-017 to FR-020)

- **FR-017**: System MUST allow users to upload pattern files (PDF, max 50MB) and attach to costume progress entries with filename, upload date, and file size visible
- **FR-018**: System MUST allow users to attach reference images (multiple) to progress photos with lightbox gallery view for quick access
- **FR-019**: System MUST allow users to save tutorial links (YouTube, blogs, forums) with title, URL, and preview thumbnail extracted from link
- **FR-020**: System MUST preserve all attachments (patterns, references, receipts) with original filenames and make downloadable from costume archive view

### Key Entities

- **CostumeProgress**: Progress tracking entry for costume with title, character, start date, target completion date, total time/cost
- **ProgressPhoto**: Individual progress photo with image URL, date, caption, stage, construction notes, time spent
- **BeforeAfterComparison**: Saved comparison view with two photo references, caption, layout type (side-by-side/slider), share settings
- **ConstructionNote**: Structured note with materials list, techniques used, time spent, cost, challenges, privacy setting
- **ProgressAttachment**: Attached file (pattern PDF, receipt, reference image, tutorial link) with filename, type, upload date, file size

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

- **CostumeProgress**: Progress tracking entry for costume with title, character, start date, target completion date, total time/cost
- **ProgressPhoto**: Individual progress photo with image URL, date, caption, stage, construction notes, time spent
- **BeforeAfterComparison**: Saved comparison view with two photo references, caption, layout type (side-by-side/slider), share settings
- **ConstructionNote**: Structured note with materials list, techniques used, time spent, cost, challenges, privacy setting
- **ProgressAttachment**: Attached file (pattern PDF, receipt, reference image, tutorial link) with filename, type, upload date, file size

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can upload progress photo with date and notes in under 90 seconds
- **SC-002**: Timeline view loads 50+ progress photos in under 3 seconds with lazy loading
- **SC-003**: Before/after comparison slider responds smoothly with < 16ms frame time (60 FPS)
- **SC-004**: Construction note search returns results in under 1 second across 100+ entries
- **SC-005**: Pattern PDF upload (10MB) completes in under 30 seconds with progress indicator
- **SC-006**: Total time/cost calculation updates in real-time (< 500ms) as user enters new progress entries
- **SC-007**: 90% of users successfully create and view progress timeline within 10 minutes on first use
- **SC-008**: Shareable comparison URLs load in under 2 seconds for external viewers (no login)
- **SC-009**: Costume summary report PDF generation (20 photos, notes) completes in under 60 seconds
- **SC-010**: Mobile photo upload from camera roll completes in under 15 seconds per photo (3G connection)
