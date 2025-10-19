# Feature Specification: Photo Management & Storage

**Feature Branch**: `023-photo-management-storage`  
**Created**: October 16, 2025  
**Status**: Draft  
**Tier**: 0 - Foundation (Critical)  
**Priority**: P0 (Must build early)

## Overview

Photo management is central to Cosplans. Users need to upload, organize, view, and manage photos from shoots. This feature handles file storage, metadata tracking, photo organization within shoots, and basic editing capabilities. Storage is critical infrastructure that enables portfolio, editing, and sharing features.

---

## User Scenarios & Testing

### User Story 1 - Upload Photos to Shoot (Priority: P1)

Photographer wants to upload photos from their shoot to the Cosplans app to share with team.

**Why this priority**: This is core functionality. App is incomplete without photo uploads.

**Independent Test**: Users can upload single and multiple photos independently.

**Acceptance Scenarios**:

1. **Given** user is in shoot, **When** user clicks "Upload Photos", **Then** file upload dialog opens
2. **Given** user selects multiple photo files, **When** user submits, **Then** all photos upload simultaneously
3. **Given** photos are uploading, **When** upload progress is visible, **Then** user can see upload percentage for each photo
4. **Given** upload completes, **When** upload finishes, **Then** photos appear in shoot with thumbnails
5. **Given** user uploads large file (>200MB), **When** upload completes, **Then** file is stored and indexed
6. **Given** user has no upload permission, **When** user tries to upload, **Then** upload button hidden/disabled
7. **Given** user uploads invalid format, **When** user submits, **Then** error shown "Only JPG, PNG, RAW, GIF supported"

---

### User Story 2 - Organize Photos in Shoot (Priority: P1)

User wants to organize and tag photos within a shoot (rating, flagging, grouping by scene/subject).

**Why this priority**: Essential for shoot organization. Users need to manage large photo sets.

**Independent Test**: Users can organize photos within shoots independently.

**Acceptance Scenarios**:

1. **Given** shoot contains 100+ photos, **When** user views shoot, **Then** photos displayed in organized grid/list view
2. **Given** user views individual photo, **When** user rates it (1-5 stars), **Then** rating saved and photo sorted by rating
3. **Given** user flags photo as "Best Shot", **When** filter applied, **Then** only flagged photos shown
4. **Given** user adds tags to photo, **When** tags saved, **Then** photo searchable by tag
5. **Given** user creates album/collection in shoot, **When** photos added to album, **Then** photos grouped together
6. **Given** collection is created, **When** user exports, **Then** only collection photos included

---

### User Story 3 - View & Search Photos (Priority: P1)

User wants to view photos in various ways and quickly find specific photos.

**Why this priority**: Essential for any photo management app.

**Independent Test**: Users can browse and search photos independently.

**Acceptance Scenarios**:

1. **Given** shoot contains photos, **When** user views shoot, **Then** all photos displayed in gallery view
2. **Given** user clicks photo, **When** photo clicked, **Then** detailed view shown with full resolution
3. **Given** user navigates thumbnails, **When** arrow keys pressed, **Then** move through photos
4. **Given** user searches for "sunset" photos, **When** search executed, **Then** only sunset-tagged photos shown
5. **Given** user filters by date range, **When** filter applied, **Then** only photos from range shown
6. **Given** large photo count (1000+), **When** page loads, **Then** photos paginate/lazy-load efficiently

---

### User Story 4 - Basic Photo Editing (Priority: P2)

User wants to make quick edits to photos (crop, rotate, brightness) without leaving app.

**Why this priority**: Nice-to-have for MVP but useful for quick touch-ups.

**Independent Test**: Users can apply basic edits independently.

**Acceptance Scenarios**:

1. **Given** user views photo, **When** user clicks "Edit", **Then** editing interface appears
2. **Given** editing interface open, **When** user rotates photo, **Then** rotation applied and saved
3. **Given** editing interface open, **When** user crops photo, **Then** cropped version saved (original preserved)
4. **Given** editing interface open, **When** user adjusts brightness/contrast, **Then** changes applied
5. **Given** edits applied, **When** user exits edit, **Then** edited photo saved and thumbnail updated
6. **Given** user wants original, **When** user selects "Revert", **Then** original photo restored

---

### User Story 5 - Download and Export Photos (Priority: P2)

User wants to download photos individually or in bulk for external use.

**Why this priority**: Important for users who need photos outside Cosplans.

**Independent Test**: Users can download and export independently.

**Acceptance Scenarios**:

1. **Given** user views photo, **When** user clicks "Download", **Then** photo downloads to device
2. **Given** shoot contains multiple photos, **When** user selects "Export All", **Then** zip file created with all photos
3. **Given** user selects subset of photos, **When** user chooses "Export Selected", **Then** zip contains only selected photos
4. **Given** export in progress, **When** user can see progress, **Then** download link shown when complete
5. **Given** export requested, **When** file size calculated, **Then** user warned if >1GB

---

### User Story 6 - Share Photo Links (Priority: P2)

User wants to share individual photos with external people (clients, stakeholders).

**Why this priority**: Useful for sharing but not critical for MVP.

**Independent Test**: Users can generate share links independently.

**Acceptance Scenarios**:

1. **Given** user views photo, **When** user clicks "Share", **Then** share dialog appears
2. **Given** share dialog open, **When** user enables public link, **Then** shareable URL generated
3. **Given** public link created, **When** anyone accesses link, **Then** photo viewable without login
4. **Given** link shared with password, **When** password required, **Then** user enters password to view
5. **Given** share link expires, **When** date/time set, **Then** link inaccessible after expiration

---

### User Story 7 - Metadata & Photo Info (Priority: P3)

User wants to view and edit metadata (photographer, camera, date, location, etc.).

**Why this priority**: Nice-to-have for metadata nerds but not critical.

**Independent Test**: Users can view and edit photo metadata independently.

**Acceptance Scenarios**:

1. **Given** user views photo, **When** user views photo info, **Then** EXIF data displayed (camera, settings, date)
2. **Given** photo details displayed, **When** user edits photographer name, **Then** custom metadata saved
3. **Given** photo uploaded, **When** EXIF location available, **Then** location shown on map (if enabled)
4. **Given** bulk photos imported, **When** user sets photographer for group, **Then** photographer assigned to all

---

### Edge Cases

- What if storage quota exceeded? (Show warning, prevent upload, suggest upgrade)
- What if user uploads same photo twice? (Allow - different shoots or backups valid)
- What if photo is corrupted during upload? (Detect and fail gracefully)
- What if user deletes photo after editing? (Revert doesn't restore deleted photo)
- What if 10,000 photos in one shoot? (Performance handling with pagination/lazy-load)
- What if user has no internet during download? (Pause and resume capability or fail with message)
- What if share link is guessed? (Require strong random tokens, not sequential IDs)

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST support uploading photos in JPG, PNG, GIF, WebP, RAW formats
- **FR-002**: System MUST validate image files (check magic bytes, not just extension)
- **FR-003**: System MUST generate thumbnails for all uploaded photos automatically
- **FR-004**: System MUST generate multiple thumbnail sizes (small, medium, large) for responsive display
- **FR-005**: System MUST store original photo files (no destructive compression initially)
- **FR-006**: System MUST preserve EXIF/metadata from photos during upload
- **FR-007**: System MUST associate photos with shoots and teams
- **FR-008**: System MUST allow photos to be organized within shoots (albums, collections)
- **FR-009**: System MUST support photo rating (1-5 stars) and favoriting
- **FR-010**: System MUST support photo tagging (custom tags per photo)
- **FR-011**: System MUST support searching photos by tag, date, rating, photographer
- **FR-012**: System MUST support basic photo editing: rotate, crop, brightness, contrast
- **FR-013**: System MUST track original photo and preserve it when edits applied
- **FR-014**: System MUST allow reverting edited photos to original
- **FR-015**: System MUST support downloading photos individually
- **FR-016**: System MUST support bulk export of photos to ZIP file
- **FR-017**: System MUST support batch operations on multiple photos (delete, tag, rate, move)
- **FR-018**: System MUST enforce permissions (only team members can access team photos)
- **FR-019**: System MUST display upload progress for large files
- **FR-020**: System MUST handle resume/retry for failed uploads
- **FR-021**: System MUST support public sharing via temporary links
- **FR-022**: System MUST support password-protected share links
- **FR-023**: System MUST support expiring share links (time-based access)
- **FR-024**: System MUST track upload source/date/photographer metadata
- **FR-025**: System MUST support sorting: date, name, rating, size, upload date

### Storage Architecture

- **Cloud Storage Provider**: [NEEDS CLARIFICATION: S3, Google Cloud Storage, or Supabase Storage?]
- **CDN for serving photos**: [NEEDS CLARIFICATION: CloudFront, CloudFlare, or built-in?]
- **Storage quota per user**: [NEEDS CLARIFICATION: Unlimited for MVP or quota-based?]

### Key Entities

- **Photo**: Represents uploaded image file
  - Attributes: id, shoot_id, uploaded_by_id, filename, original_url, thumbnail_url, size, format, created_at, updated_at, deleted_at
  - Relationships: belongs_to Shoot, belongs_to User, has_many Tags, has PhotoMetadata

- **PhotoMetadata**: Stores EXIF and custom metadata
  - Attributes: id, photo_id, camera_make, camera_model, iso, aperture, shutter_speed, focal_length, taken_at, location, photographer_name, custom_data (JSON)
  - Relationships: belongs_to Photo

- **PhotoTag**: User-created tags for photos
  - Attributes: id, photo_id, tag_name, created_at
  - Relationships: belongs_to Photo

- **PhotoRating**: User ratings and favorites
  - Attributes: id, photo_id, user_id, rating (1-5), favorited, created_at
  - Relationships: belongs_to Photo, belongs_to User

- **PhotoEdit**: History of edits applied to photo
  - Attributes: id, photo_id, edit_type (rotate/crop/brightness/etc), parameters (JSON), edited_by_id, created_at
  - Relationships: belongs_to Photo, belongs_to User

- **PhotoCollection**: Albums or groupings within shoot
  - Attributes: id, shoot_id, name, description, created_at
  - Relationships: belongs_to Shoot, has_many Photos

- **ShareLink**: Public sharing tokens
  - Attributes: id, photo_id, token, password_hash, created_by_id, created_at, expires_at, password_required
  - Relationships: belongs_to Photo, belongs_to User

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: User can upload photos and have them appear in shoot within 30 seconds
- **SC-002**: Upload speed: 10 MB photo uploads in under 10 seconds (on 10Mbps connection)
- **SC-003**: Thumbnail generation completes within 5 seconds of upload completion
- **SC-004**: Photo grid loads and displays 100 photos in under 3 seconds
- **SC-005**: Searching 10,000 photos returns results in under 500ms
- **SC-006**: User can rate/tag 50 photos in under 5 minutes
- **SC-007**: Bulk export of 1000 photos completes in under 60 seconds
- **SC-008**: Share links are generated in under 1 second
- **SC-009**: Photo download starts within 2 seconds of request
- **SC-010**: Basic edits (rotate, crop) apply within 2 seconds and save within 5 seconds

---

## Assumptions

- Users have reliable internet connection (no comprehensive offline support initially)
- Photo file sizes range from 2MB to 200MB typical
- Storage is cloud-based (AWS S3, Google Cloud Storage, or Supabase Storage)
- Users trust Cosplans with their photos (non-encrypted at rest initially)
- EXIF data preservation is best-effort (some formats may lack metadata)
- Bulk operations (export, delete) have reasonable limits to prevent abuse
- Original files are retained for audit/recovery purposes

---

## Dependencies

- **Depends on**: Authentication (know who uploaded), Permissions (control access), Teams/Shoots (organize photos)
- **Blocks**: Portfolio gallery, Editing tasks, Social media scheduling, Photo sharing
- **Related to**: Real-time sync (new uploads should appear immediately), Dashboard (show recent photos)

---

## Out of Scope (For Future Phases)

- Advanced editing (AI-powered, Photoshop-like tools)
- Advanced AI photo organization (auto-tagging, scene detection)
- Print-on-demand integration
- Stock photo selling
- Cloud backup/recovery
- Photo comparison/before-after
- Version history of edits
- Watermarking at scale
- Photo contests/voting
- Access logs for photo views
