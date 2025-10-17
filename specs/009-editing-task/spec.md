# Feature Specification: Reference Pose Library

**Feature Branch**: `010-reference-pose-library`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: Save/organize reference images from any source, tag by character/difficulty/location, quick linking, community sharing

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Save References from Any Source (Priority: P1)

As a cosplayer planning shoots, I want to save reference images from my camera roll, web URLs, or other apps into an organized library so that I have all my inspiration in one searchable place instead of scattered across devices.

**Why this priority**: Core reference collection - the foundation of the library. Solves "where did I save that pose?" problem.

**Independent Test**: User can import images from multiple sources, see them in unified library view, search/browse later.

**Acceptance Scenarios**:

1. **Given** I find inspiring pose on Pinterest, **When** I paste URL into reference importer, **Then** image saves to my library with source attribution
2. **Given** I have pose photos in camera roll, **When** I select 5 images and import, **Then** all 5 appear in my reference library
3. **Given** I'm using feature 002 (AI poses), **When** I click "Save to library" on generated pose, **Then** pose saves with "AI Generated" tag
4. **Given** I have 100+ references, **When** I scroll library, **Then** images load smoothly with infinite scroll/pagination

---

### User Story 2 - Tag & Organize References (Priority: P2)

As a library curator, I want to tag references with character name, pose difficulty, location type, and custom tags so that I can quickly find the right reference for each shoot.

**Why this priority**: Makes P1 library searchable and useful. Without tags, large libraries become unmanageable.

**Independent Test**: User can add tags to references, filter by tags, see tag suggestions based on past usage.

**Acceptance Scenarios**:

1. **Given** I'm saving a reference, **When** I add tags "Sailor Moon, standing pose, easy difficulty, urban location", **Then** tags save and appear as filterable chips
2. **Given** I have tagged references, **When** I click "easy difficulty" tag, **Then** library filters to show only easy poses
3. **Given** I'm tagging new reference, **When** I start typing "Sai...", **Then** system suggests "Sailor Moon" from my previous tags
4. **Given** I view tag cloud, **When** I see most used tags, **Then** "Sailor Moon (25)", "Genshin (18)", "easy (40)" show usage counts

---

### User Story 3 - Quick Link to Shoots & Shots (Priority: P3)

As a shoot planner, I want to quickly attach library references to shoots or specific shots (from feature 004) so that I don't have to re-upload the same reference images multiple times.

**Why this priority**: Integration benefit - connects library to planning workflow. Requires P1 library and feature 004.

**Independent Test**: User can browse library while planning shot, attach reference with one click, reference links to both library and shot.

**Acceptance Scenarios**:

1. **Given** I'm planning shot #3, **When** I click "Add reference from library", **Then** library modal opens with search/filter
2. **Given** library modal is open, **When** I select 2 poses and click "Attach", **Then** both link to shot #3 and modal closes
3. **Given** reference is linked to multiple shots, **When** I view reference in library, **Then** I see "Used in: Shoot A shot #3, Shoot B shot #7"
4. **Given** I update library reference tags, **When** viewing linked shot, **Then** reference shows updated tags (linked, not copied)

---

### User Story 4 - Community Sharing (Optional) (Priority: P4)

As an advanced user, I want to optionally share my reference library (or collections within it) with the community so that others can benefit from my curated inspiration, and I can discover others' libraries.

**Why this priority**: Social feature that adds value but isn't essential. Requires moderation and privacy considerations.

**Independent Test**: User can mark collection as "Public", browse community collections, save references from others' collections to their library.

**Acceptance Scenarios**:

1. **Given** I have "Dynamic Action Poses" collection, **When** I toggle "Make Public", **Then** collection appears in community browse with my username
2. **Given** I'm browsing community, **When** I filter "Genshin Impact" tag, **Then** I see public collections from other users with that tag
3. **Given** I find useful reference in public collection, **When** I click "Save to my library", **Then** reference copies with attribution "Originally shared by @username"
4. **Given** privacy concerns, **When** I toggle "Make Private", **Then** collection immediately hidden from community and only visible to me

---

### Edge Cases

- What happens when web URL image is deleted/broken? (Store copy locally, show "Source unavailable" if original link breaks)
- How to handle very large images (10MB+ high-res art)? (Compress for preview, keep original if under size limit, or link only for oversized)
- What if user imports duplicate images? (Detect duplicates via hash, offer "Already in library" with link to existing)
- Should references have version history like editing? (Not initially, but track source updates if URL-based)
- How to handle NSFW content in community sharing? (Content reporting, moderation queue, user preference filters)
- What if tags become inconsistent (sailor-moon vs Sailor Moon vs sailormoon)? (Tag normalization, suggest existing similar tags)
- Should there be collection limits? (Free: 500 refs, Pro: 5000, Team: unlimited?)
- How to handle copyright concerns with community sharing? (Clear terms: personal use only, DMCA takedown process)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow importing reference images from: camera roll upload, web URL, AI pose generation (feature 002), file upload (JPG/PNG/WebP)
- **FR-002**: System MUST store imported images locally (not just links) with source attribution metadata
- **FR-003**: System MUST display reference library in grid view with thumbnail previews (< 1 second load on 3G)
- **FR-004**: System MUST support infinite scroll or pagination for libraries with 100+ references
- **FR-005**: System MUST allow adding multiple tags per reference: character name, difficulty (easy/medium/hard), location type, custom tags
- **FR-006**: System MUST provide tag autocomplete based on user's previous tags
- **FR-007**: System MUST support filtering library by any combination of tags (AND logic)
- **FR-008**: System MUST display tag cloud showing most used tags with usage counts
- **FR-009**: System MUST support search by tag name or reference title
- **FR-010**: System MUST allow creating named collections to group related references
- **FR-011**: System MUST support quick-attach from library when planning shots (feature 004 integration)
- **FR-012**: System MUST display "Used in" information showing which shoots/shots link to reference
- **FR-013**: System MUST maintain references as linked (not copied) so tag updates reflect everywhere
- **FR-014**: System MUST detect duplicate images via perceptual hash and offer "Already exists" warning
- **FR-015**: System MUST compress large images for preview while preserving original (if under size limit)
- **FR-016**: System MUST handle broken source URLs gracefully with "Source unavailable" indicator
- **FR-017**: System MUST support optional community sharing toggle per collection
- **FR-018**: System MUST provide community browse/search interface with tag filtering
- **FR-019**: System MUST attribute community references to original sharer
- **FR-020**: System MUST support reporting inappropriate community content
- **FR-021**: System MUST allow users to make collections private (remove from community)
- **FR-022**: System MUST implement storage limits per tier: Free (500 refs), Pro (5000 refs), Team (unlimited)

### Key Entities

- **ReferenceImage**: Stored reference photo. Attributes: image file path, thumbnail path, source type (upload/URL/AI), source URL, original filename, dimensions, file size, uploader user ID, upload timestamp, view count
- **ReferenceTag**: Tag on reference. Attributes: reference ID, tag text (normalized), tag type (character/difficulty/location/custom), created timestamp
- **ReferenceCollection**: Grouped references. Attributes: collection name, owner user ID, is public, created date, last modified date
- **CollectionMembership**: Links references to collections. Attributes: collection ID, reference ID, added timestamp, added by user ID
- **ShotReferenceLink**: Links library reference to shot. Attributes: shot ID (from feature 004), reference ID, linked timestamp
- **CommunityReport**: Report inappropriate content. Attributes: reference or collection ID, reporter user ID, reason, report timestamp, resolution status

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can import 10 references in under 2 minutes
- **SC-002**: Library grid loads with visible thumbnails in under 1 second on 3G
- **SC-003**: Tag autocomplete suggestions appear in under 200ms
- **SC-004**: Duplicate detection identifies identical images with 95%+ accuracy
- **SC-005**: Quick-attach modal opens and displays library in under 1 second
- **SC-006**: 80% of users with 10+ references use tags (indicates feature adoption)
- **SC-007**: Users with organized libraries (5+ tags used) create shoots 20% faster (measured by time from shoot creation to first shot planned)
- **SC-008**: Community collections receive 500+ views in first month (indicates sharing value)
- **SC-009**: Reported content resolved within 48 hours (moderation responsiveness)
- **SC-010**: Zero broken image links for locally stored references (100% reliability)

