# Feature Specification: Resource Management System

**Feature Branch**: `045-resource-management`  
**Created**: October 21, 2025  
**Status**: Draft  
**Input**: Resource management pages for managing costumes (previous and in progress outfits), crew members (people you are working with or have previously worked with), Props, equipment, locations, and other resources defined in the constitution

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Manage Costume Inventory (Priority: P1)

As a cosplayer, I want to track all my costumes (completed and in-progress) with their lifecycle states, photos, and details so that I know what I own, what's available for shoots, and what needs repair or maintenance.

**Why this priority**: Costume tracking is foundational for shoot planning. Cosplayers invest hundreds of dollars per costume and need to track availability, condition, and location. This is the highest-value resource type and blocks shoot assignment features.

**Independent Test**: User can create costume entries, add photos, set lifecycle states (owned, in-progress, sold, damaged, stored), search/filter costumes, and view costume details independently of other features.

**Acceptance Scenarios**:

1. **Given** I'm logged into my team, **When** I navigate to Costumes page and click "Add Costume", **Then** I see a form to enter character name, series, costume type, status, and upload photos
2. **Given** I have a completed costume, **When** I set status to "Owned" and add storage location "Closet A", **Then** costume displays with green "Owned" badge and location
3. **Given** I sold a costume, **When** I change status to "Sold" and enter sale date/price, **Then** costume moves to archive with sale details visible
4. **Given** I have 20 costumes, **When** I filter by "In Progress" status, **Then** only costumes with that status display
5. **Given** I'm planning a shoot, **When** I view costumes list, **Then** I can quickly see which costumes are available (owned, ready) vs unavailable (sold, damaged, loaned)

---

### User Story 2 - Manage Crew Directory (Priority: P1)

As a team coordinator, I want to maintain a directory of crew members (photographers, assistants, makeup artists, models) with their roles, contact info, and availability so that I can quickly find and assign people to shoots.

**Why this priority**: Crew management is essential for shoot planning. Teams need to track external collaborators who aren't full team members but participate in specific shoots. This enables the constitutional "External Crew Member Roles" requirement.

**Independent Test**: User can add crew members with contact details and roles, search/filter crew, view crew profiles, and mark crew as favorites independently of shoot assignment.

**Acceptance Scenarios**:

1. **Given** I'm organizing shoots, **When** I navigate to Crew page and click "Add Crew Member", **Then** I see a form for name, role, email, phone, portfolio URL, and notes
2. **Given** I add photographer "Jane Smith" with email and portfolio link, **When** I save, **Then** crew member appears in directory with role badge
3. **Given** I have 15 crew members, **When** I filter by role "Photographer", **Then** only photographers display
4. **Given** I frequently work with certain people, **When** I mark them as "Favorite", **Then** they appear at top of crew list
5. **Given** I'm viewing crew member profile, **When** I click email or phone, **Then** system opens default email client or dialer

---

### User Story 3 - Manage Equipment Inventory (Priority: P2)

As a photographer, I want to track my equipment (cameras, lenses, lighting, tripods) with ownership, condition, and availability so that I know what gear I have and what I need to rent or borrow for shoots.

**Why this priority**: Equipment tracking prevents forgotten gear and enables better shoot preparation. Builds on P1 costume/crew foundation by adding another resource type needed for shoot planning.

**Independent Test**: User can add equipment items with type, brand, model, condition, and ownership status, create equipment checklists, and mark items as available/unavailable independently.

**Acceptance Scenarios**:

1. **Given** I'm managing gear, **When** I navigate to Equipment page and click "Add Equipment", **Then** I see a form for item name, type, brand, model, condition, and ownership (owned/rented/borrowed)
2. **Given** I own a Canon 5D Mark IV, **When** I add it with condition "Excellent" and ownership "Owned", **Then** equipment displays with camera icon and green status
3. **Given** I'm planning a shoot, **When** I create equipment checklist and add items, **Then** I can check off items as packed
4. **Given** equipment is damaged, **When** I change condition to "Needs Repair" and add repair notes, **Then** item shows warning badge and is marked unavailable
5. **Given** I have borrowed equipment, **When** I set return date, **Then** system shows days remaining until return

---

### User Story 4 - Manage Props Catalog (Priority: P2)

As a cosplayer, I want to track props (weapons, accessories, wigs) with their condition, ownership, and storage location so that I can find props for shoots and track what needs maintenance or replacement.

**Why this priority**: Props are essential costume components that need separate tracking from full costumes. Many props are reused across multiple costumes/characters. Builds on P1-P2 resource management patterns.

**Independent Test**: User can add props with photos, condition, storage location, and ownership status, search/filter props, and track prop lifecycle independently.

**Acceptance Scenarios**:

1. **Given** I'm managing props, **When** I navigate to Props page and click "Add Prop", **Then** I see a form for prop name, type, character/series, condition, storage location, and photos
2. **Given** I have a foam sword prop, **When** I add it with condition "Good" and location "Prop Box 3", **Then** prop displays with location tag
3. **Given** prop is damaged, **When** I change status to "Damaged" and add repair notes/cost, **Then** prop shows warning and estimated repair cost
4. **Given** I loaned a prop, **When** I set status to "Loaned" with borrower name and return date, **Then** prop shows as unavailable with return countdown
5. **Given** I'm searching for a specific prop, **When** I filter by character "Link" or type "Weapon", **Then** matching props display

---

### User Story 5 - Manage Location Library (Priority: P3)

As a photographer, I want to maintain a library of shoot locations (studios, parks, convention venues) with photos, addresses, and notes so that I can quickly find suitable locations for shoots and share location details with team.

**Why this priority**: Location tracking improves shoot planning efficiency but is less critical than costumes/crew/equipment. Nice-to-have that builds on established resource management patterns.

**Independent Test**: User can add locations with address, photos, accessibility notes, and parking info, search locations by type or name, and mark locations as favorites independently.

**Acceptance Scenarios**:

1. **Given** I'm planning shoots, **When** I navigate to Locations page and click "Add Location", **Then** I see a form for location name, address, type (studio/outdoor/convention), photos, and notes
2. **Given** I add "Golden Gate Park - Japanese Garden" with address and photos, **When** I save, **Then** location displays with map preview and outdoor badge
3. **Given** I have 10 locations, **When** I filter by type "Studio", **Then** only studio locations display
4. **Given** location has parking challenges, **When** I add note "Limited parking, arrive early", **Then** note displays prominently on location card
5. **Given** I frequently use certain locations, **When** I mark them as "Favorite", **Then** they appear at top of location list

---

### User Story 6 - Manage Accessories Collection (Priority: P2)

As a cosplayer, I want to track my costume accessories and makeup (jewelry, colored contacts, makeup products, wigs) with their condition, usage, and maintenance schedules so that I can coordinate accessories with costumes and maintain my collection properly.

**Why this priority**: Accessories represent significant investment and are essential for complete costume looks. They need different tracking than full costumes (more frequent maintenance, expiration dates for makeup, usage coordination). Builds on established resource management patterns.

**Independent Test**: User can add accessories with type-specific fields (prescription info for contacts, expiration dates for makeup), track usage and maintenance, and link accessories to costumes independently.

**Acceptance Scenarios**:

1. **Given** I'm managing accessories, **When** I navigate to Accessories page and click "Add Accessory", **Then** I see type-specific forms (makeup with expiration dates, contacts with prescription details, jewelry with metal type)
2. **Given** I have colored contacts, **When** I add them with prescription and usage schedule, **Then** system tracks wear and suggests replacement timing
3. **Given** makeup is approaching expiry, **When** I set expiration date, **Then** system warns 30 days before expiry and marks as unavailable
4. **Given** wig needs restyling, **When** I schedule maintenance and track usage, **Then** system reminds me before next use
5. **Given** I'm coordinating a costume, **When** I view accessory suggestions, **Then** I see accessories that match the character or have been used together before

---

### User Story 7 - Resource Lifecycle Tracking (Priority: P2)

As a team coordinator, I want to track the complete lifecycle of costumes and props (planned → acquiring → in-progress → ready → owned → sold/damaged/rented/lost/stored/loaned) so that I have accurate inventory and can make informed decisions about availability and value.

**Why this priority**: Constitutional requirement (Section IV) for comprehensive lifecycle tracking. Essential for accurate inventory management, insurance claims, tax records, and preventing scheduling conflicts with unavailable items.

**Independent Test**: User can transition resources through all lifecycle states, add state-specific metadata (sale price, damage cost, rental period, borrower info), and view lifecycle history independently.

**Acceptance Scenarios**:

1. **Given** I'm planning a new costume, **When** I create costume with status "Planned", **Then** costume shows in planning view with estimated cost field
2. **Given** costume is in progress, **When** I change status to "In Progress" and add completion percentage, **Then** progress bar displays
3. **Given** costume is complete, **When** I change status to "Owned" and add completion date, **Then** costume moves to active inventory
4. **Given** I sold a costume, **When** I change status to "Sold" with sale date and price, **Then** costume archives with sale record for tax purposes
5. **Given** costume is damaged, **When** I change status to "Damaged" with incident details and repair cost, **Then** costume shows as unavailable with insurance claim info
6. **Given** I loaned a prop, **When** I set status to "Loaned" with borrower and return date, **Then** system sends reminder 3 days before return date
7. **Given** I'm viewing costume history, **When** I open lifecycle timeline, **Then** I see all status changes with dates and notes

### Edge Cases

- What happens when a costume is assigned to a shoot but then marked as "Sold" or "Damaged"? (System should warn user and suggest reassignment)
- How does system handle duplicate costume/prop names? (Allow duplicates but show warning, add character/series to disambiguate)
- What happens when crew member is deleted but assigned to future shoots? (Prevent deletion, require reassignment first)
- How does system handle equipment with multiple conditions (e.g., camera body works but lens is damaged)? (Track condition per item, not per kit)
- What happens when location address is invalid or changes? (Validate address on save, allow manual override, track address history)
- How does system handle resources shared across multiple teams? (Resources are team-scoped, no cross-team sharing in MVP)
- What happens when lifecycle state transition is invalid (e.g., "Sold" → "In Progress")? (Enforce strict transition rules with override confirmation - block invalid transitions but allow corrections via confirmation dialog showing reason and consequences)
- How does system handle bulk operations (e.g., mark 10 costumes as "Stored")? (Support multi-select with bulk actions)
- What happens when resource photos exceed storage limits? (Compress images, enforce max file size, show storage usage)
- How does system handle resources without photos? (Show placeholder icon based on type, encourage photo upload)

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

**Costume Management:**
- **FR-001**: System MUST allow users to create, read, update, and delete costume entries within their team
- **FR-002**: System MUST support costume lifecycle states: planned, acquiring, in-progress, ready, owned, sold, damaged, rented, lost, stored, loaned
- **FR-002a**: System MUST enforce strict lifecycle state transition rules with override confirmation for corrections
- **FR-003**: System MUST allow users to upload 1-10 photos per costume (minimum 1, maximum 10)
- **FR-004**: System MUST track costume metadata: character name, series, costume type, estimated cost, actual cost, completion date, storage location
- **FR-005**: System MUST allow users to filter costumes by status, character, series, or availability
- **FR-006**: System MUST display costume availability status for shoot planning (available/unavailable)
- **FR-007**: System MUST track state-specific metadata: sale price/date for sold, damage details/cost for damaged, borrower/return date for loaned

**Crew Management:**
- **FR-008**: System MUST allow users to create, read, update, and delete crew member entries within their team
- **FR-009**: System MUST track crew metadata: name, role, email, phone, portfolio URL, social media links, notes, favorite status
- **FR-010**: System MUST support crew roles: photographer, assistant, makeup artist, model, coordinator, other
- **FR-011**: System MUST allow users to filter crew by role or favorite status
- **FR-012**: System MUST enable click-to-email and click-to-call functionality for crew contact info
- **FR-013**: System MUST allow marking crew members as favorites for quick access
- **FR-013a**: System MUST suggest linking crew members to Cosplans accounts when email matches, requiring manual confirmation before linking

**Equipment Management:**
- **FR-014**: System MUST allow users to create, read, update, and delete equipment entries within their team
- **FR-015**: System MUST track equipment metadata: name, type, brand, model, condition, ownership status, purchase date, purchase price
- **FR-016**: System MUST support equipment types: camera, lens, lighting, tripod, backdrop, audio, other
- **FR-017**: System MUST support ownership statuses: owned, rented, borrowed
- **FR-018**: System MUST track equipment condition: excellent, good, fair, needs repair, broken
- **FR-019**: System MUST allow users to create equipment checklists for shoots
- **FR-020**: System MUST mark equipment as available/unavailable based on condition and rental/borrow status

**Props Management:**
- **FR-021**: System MUST allow users to create, read, update, and delete prop entries within their team
- **FR-022**: System MUST support prop lifecycle states matching costume states (planned, owned, sold, damaged, loaned, etc.)
- **FR-023**: System MUST track prop metadata: name, type, character/series, condition, storage location, estimated cost, actual cost
- **FR-024**: System MUST allow users to upload 1-10 photos per prop (minimum 1, maximum 10)
- **FR-025**: System MUST allow users to filter props by status, character, type, or availability
- **FR-026**: System MUST track state-specific metadata for props (same as costumes)

**Location Management:**
- **FR-027**: System MUST allow users to create, read, update, and delete location entries within their team
- **FR-028**: System MUST track location metadata: name, address, type, accessibility notes, parking info, cost, favorite status
- **FR-029**: System MUST support location types: studio, outdoor, convention, private residence, other
- **FR-030**: System MUST allow users to upload 1-10 photos per location (minimum 1, maximum 10)
- **FR-031**: System MUST allow users to filter locations by type or favorite status
- **FR-032**: System MUST display location address with map preview (if address provided)

**Accessories Management:**
- **FR-044**: System MUST allow users to create, read, update, and delete accessory entries within their team
- **FR-045**: System MUST support accessory types: jewelry, contacts, makeup, wig, other
- **FR-046**: System MUST track accessory metadata: name, type, color/style, brand, size, prescription info (contacts), expiration date (makeup), condition, storage location, purchase cost, purchase date
- **FR-047**: System MUST support accessory-specific lifecycle states: available, in-use, needs-cleaning, needs-repair, damaged, lost, expired (makeup), needs-restyling (wigs)
- **FR-048**: System MUST allow users to upload 1-5 photos per accessory (minimum 1, maximum 5)
- **FR-049**: System MUST allow users to filter accessories by type, color, condition, availability, or character association
- **FR-050**: System MUST track accessory usage history and frequency for maintenance planning
- **FR-051**: System MUST support maintenance reminders for accessories (cleaning schedules, repair due dates, restyling intervals)
- **FR-052**: System MUST allow linking accessories to costumes for coordination planning and requirement tracking
- **FR-053**: System MUST provide expiration warnings for makeup products (30 days advance notice)
- **FR-054**: System MUST support makeup-specific features: usage level tracking (new, half-full, low, empty), skin tone matching, brand categorization

**Cross-Resource Requirements:**
- **FR-033**: All resources MUST be scoped to teams (no cross-team resource sharing in MVP)
- **FR-034**: System MUST support real-time search across all resource types by name or description with 300ms debouncing
- **FR-035**: System MUST support bulk operations (multi-select and bulk status changes)
- **FR-036**: System MUST track creation date, last modified date, and created by user for all resources
- **FR-037**: System MUST enforce team permissions (only team members can view/edit team resources)
- **FR-038**: System MUST compress uploaded images to optimize storage and bandwidth
- **FR-039**: System MUST provide resource usage statistics (total costumes, props, crew, equipment, locations, accessories)
- **FR-040**: System MUST support exporting resource lists to CSV for backup/reporting
- **FR-041**: System MUST soft-delete resources (mark as deleted, retain for 6 months, then permanently delete)
- **FR-042**: System MUST provide archive view for deleted resources within 6-month retention period
- **FR-043**: System MUST allow restoration of soft-deleted resources before permanent deletion

### Key Entities

- **Accessory**: Represents costume accessories and makeup items with type, color, condition, usage tracking, and maintenance schedules. Links to costumes for coordination planning.
- **Makeup Product**: Represents makeup items with brand, shade, expiration dates, usage levels, and skin tone matching. Specialized tracking for consumable beauty products.
- **Accessory Type**: Categorizes accessories (jewelry, contacts, makeup, wig) with specific metadata fields and validation rules for each type.
- **Accessory Usage History**: Tracks when and how accessories are used, including which costumes they were paired with and condition changes over time.
- **Maintenance Schedule**: Represents scheduled maintenance tasks for accessories (cleaning, repair, restyling) with due dates and completion tracking.
- **Costume-Accessory Link**: Junction entity linking accessories to costumes with usage notes and character-specific associations.

## Clarifications

### Session 2025-10-21

- Q: What is the maximum number of photos allowed per resource (costume/prop/location)? → A: 1 minimum, 10 maximum photos per resource
- Q: When a crew member in the directory has a Cosplans account, should the system automatically link them or require manual linking? → A: Manual linking with email-based suggestions - System suggests linking when email matches but requires user confirmation
- Q: Should search be real-time (as-you-type) or require explicit search button click? → A: Real-time with debouncing (300ms delay after typing stops)
- Q: Should the system enforce strict state transition rules or allow any transition with a warning? → A: Strict rules with override confirmation - Prevents invalid transitions but allows corrections via confirmation dialog
- Q: Should deleted resources be permanently removed or soft-deleted (archived) for history preservation? → A: Soft delete with 6-month retention - Resources archived on deletion, retained for 6 months, then permanently deleted

---

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Users can add a new costume with photos and details in under 2 minutes
- **SC-002**: Users can find a specific resource (costume, crew, equipment, prop, location, accessory) in under 10 seconds using search/filter
- **SC-003**: 90% of users successfully create their first resource entry on first attempt without help documentation
- **SC-004**: System displays resource lists with 50+ items without performance degradation (page load under 2 seconds)
- **SC-005**: Users can transition a costume through complete lifecycle (planned → owned → sold) with all required metadata in under 5 minutes
- **SC-006**: Resource photos load and display within 1 second on 3G connection (compressed thumbnails)
- **SC-007**: 80% of users report that resource management reduces shoot planning time by at least 30%
- **SC-008**: Users can export complete resource inventory to CSV in under 30 seconds
- **SC-009**: Zero data loss incidents for resource photos and metadata
- **SC-010**: Resource availability status (available/unavailable) is accurate 100% of the time for shoot planning

## Assumptions

- Users have basic familiarity with inventory management concepts
- Teams will primarily use web interface for resource management (mobile support in future phases)
- Photo uploads will be limited to 5MB per image (compressed automatically)
- Address validation for locations will use standard geocoding services
- Resource sharing across teams is not required for MVP (future enhancement)
- Users understand lifecycle state transitions (tooltips provided for guidance)
- Crew members listed in directory may or may not have Cosplans accounts
- Equipment checklists are simple lists (advanced packing features in future phases)
- Map previews for locations are read-only (no interactive navigation in MVP)
- CSV export format follows standard conventions (UTF-8, comma-delimited)

## Dependencies

- Team management system must be functional (resources are team-scoped)
- User authentication and authorization must be working
- File upload and storage system must support image compression
- Database must support JSONB for lifecycle state metadata
- Search functionality requires full-text search capability
- Photo thumbnails require image processing on upload
- CSV export requires server-side data formatting
- Map previews require geocoding API integration (optional for MVP)

## Out of Scope

- Cross-team resource sharing (future enhancement)
- Real-time collaboration on resource editing (future enhancement)
- Advanced equipment packing algorithms (future enhancement)
- Automated costume value appraisal (future enhancement)
- Integration with external inventory systems (future enhancement)
- Barcode/QR code scanning for equipment (future enhancement)
- Calendar integration for equipment rental tracking (future enhancement)
- Automated reminders for loaned item returns (future enhancement)
- Resource depreciation tracking (future enhancement)
- Insurance claim form generation (future enhancement)

