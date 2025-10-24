# Feature Specification: Resource Management System Expansion

> ⚠️ **SUPERSEDED BY SPEC 048 (Character-Centric Resource Model)**  
> This specification has been consolidated into [spec 048-character-resource-model](../048-character-resource-model/spec.md).  
> **What was retained**: Standalone task management and craft supplies features are maintained as separate features in spec 048.  
> **What was integrated**: Pattern storage is now part of the enhanced outfit entity in spec 048. Accessories/makeup pages are integrated with character linking.  
> **This spec is retained for historical reference only.**  
> See [spec 048 Integration Notes](../048-character-resource-model/spec.md#integration-notes) for complete consolidation details.

**Feature Branch**: `047-resource-expansion`  
**Created**: October 24, 2025  
**Status**: ~~Draft~~ **SUPERSEDED** (Consolidated into Spec 048)  
**Input**: User description: "I want to make sure that my specs are up to date for the resource pages. I had made changes while implementing but I don't think we updated the spec to match those changes. I also wanted to add to the spec files a new page or two for managing general tasks (we have tasks for props and outfits but maybe someone wants to create a tasks to reach out to someone or something else related but not specific to a resource), managing accessories (rings, earrings, necklaces, etc) and managing makeup (references, styles, products, etc.). I also want to make sure there is a place on the outfits for storing templates and patterns people might use when sewing their own cosplay. Also a section for managing misc resources like foam used to make props and paints etc"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Standalone Task Management (Priority: P1)

As a cosplayer and coordinator, I want to create and manage general tasks that aren't tied to specific resources (like "reach out to venue coordinator" or "order fabric samples") so that I can track all my project-related work in one place, not just resource-specific tasks.

**Why this priority**: Users need a general task management system beyond resource-specific checklists. Many cosplay project tasks (communication, research, planning) don't belong to a specific outfit or prop but still need tracking. This is foundational for project organization.

**Independent Test**: User can create standalone tasks, organize them by category/project, set due dates and priorities, mark tasks complete, and filter/search tasks independently of any resource pages.

**Acceptance Scenarios**:

1. **Given** I'm planning a convention appearance, **When** I navigate to Tasks page and click "Add Task", **Then** I see a form to enter task title, description, category, due date, priority, and status
2. **Given** I need to contact a venue, **When** I create task "Email Golden Gate Park about shooting permit" with category "Communication" and due date next Friday, **Then** task appears in my task list with deadline countdown
3. **Given** I have 20 general tasks, **When** I filter by category "Shopping" or priority "High", **Then** only matching tasks display
4. **Given** I completed a task, **When** I mark it as complete, **Then** task moves to completed section with completion timestamp
5. **Given** I'm reviewing my work, **When** I view task history, **Then** I see all completed tasks with completion dates

---

### User Story 2 - Outfit Templates and Patterns Storage (Priority: P1)

As a cosplayer who sews, I want to store and organize sewing patterns and templates for my outfits (PDF patterns, reference images, tutorial links, measurement notes) so that I can easily access my sewing resources when working on outfits.

**Why this priority**: Many cosplayers create or purchase sewing patterns that need to be tracked with their outfits. Pattern files are expensive (often $15-30 each) and need proper organization. This fills a gap in the existing outfit management system.

**Independent Test**: User can upload pattern files (PDF, images), add pattern metadata (brand, size, modifications), link patterns to outfits, and search patterns independently of other features.

**Acceptance Scenarios**:

1. **Given** I purchased a Simplicity pattern for a dress, **When** I navigate to outfit detail page and click "Add Pattern", **Then** I see a form to upload PDF/images, enter pattern name, brand, size, and notes
2. **Given** I have pattern files, **When** I upload "Simplicity 8234 - Size 12.pdf" with notes "Lengthen bodice by 2 inches", **Then** pattern displays in outfit's patterns section with download link
3. **Given** I'm working on an outfit, **When** I view attached patterns, **Then** I see all pattern files with modification notes and can download originals
4. **Given** I use a pattern for multiple outfits, **When** I link existing pattern to new outfit, **Then** same pattern appears on both outfits without re-uploading
5. **Given** I'm searching for a specific pattern, **When** I search by brand name or pattern number, **Then** matching patterns display with their associated outfits

---

### User Story 3 - Craft Supplies and Materials Management (Priority: P2)

As a prop maker and outfit creator, I want to track craft supplies and materials (foam, paints, fabrics, adhesives, tools) with quantities, costs, and storage locations so that I know what materials I have before starting projects and can track material costs accurately.

**Why this priority**: Cosplayers invest hundreds of dollars in craft supplies that need inventory tracking. Knowing what foam, paint colors, and fabrics are in stock prevents duplicate purchases and enables better project budgeting. Builds on established resource management patterns.

**Independent Test**: User can add craft supplies with type, quantity, cost, storage location, and usage tracking, create supply shopping lists, and mark supplies as running low independently of outfits/props.

**Acceptance Scenarios**:

1. **Given** I'm managing materials, **When** I navigate to Craft Supplies page and click "Add Supply", **Then** I see a form for supply name, category (foam/paint/fabric/adhesive/tool), quantity, unit, cost, brand, color/size, and storage location
2. **Given** I have EVA foam sheets, **When** I add "EVA Foam 5mm - Black" with quantity "10 sheets", cost "$30", location "Craft Room Shelf A", **Then** supply displays with quantity badge and location tag
3. **Given** I'm planning a prop build, **When** I check foam inventory, **Then** I see all foam types with quantities and colors to determine if I need to purchase more
4. **Given** I use materials for a project, **When** I update quantity from "10 sheets" to "7 sheets", **Then** system tracks usage and shows remaining quantity
5. **Given** supply is running low, **When** quantity drops below threshold (e.g., 2 sheets), **Then** supply shows "Low Stock" warning and appears in shopping list
6. **Given** I need to purchase supplies, **When** I view shopping list, **Then** I see all low-stock items with estimated costs and purchase links (if provided)
7. **Given** I'm tracking project costs, **When** I view material usage history, **Then** I see total material costs by project or time period

---

### User Story 4 - Accessories and Makeup Dedicated Pages (Priority: P2)

As a cosplayer with extensive accessory and makeup collections, I want dedicated pages for managing jewelry, contacts, wigs, and makeup products (separate from general outfit management) so that I can maintain detailed records with type-specific fields like expiration dates for makeup and prescription info for contacts.

**Why this priority**: Accessories and makeup were included in spec 045 but need dedicated pages with specialized features. These items have unique requirements (expiration tracking, prescription info, maintenance schedules) that deserve focused management separate from full outfits.

**Independent Test**: User can access dedicated Accessories and Makeup pages, add items with type-specific fields, track expiration/maintenance, and link accessories to outfits for coordination independently.

**Acceptance Scenarios**:

1. **Given** I'm managing accessories, **When** I navigate to dedicated Accessories page, **Then** I see categorized view of jewelry, contacts, wigs with type-specific filters
2. **Given** I'm adding colored contacts, **When** I click "Add Contacts", **Then** I see specialized form with prescription details (base curve, diameter, power), brand, color, purchase date, and replacement schedule
3. **Given** I'm managing makeup, **When** I navigate to dedicated Makeup page, **Then** I see products organized by category (foundation, eyeshadow, lipstick) with expiration warnings
4. **Given** I'm adding foundation, **When** I enter purchase date and typical shelf life, **Then** system calculates expiration date and warns 30 days before expiry
5. **Given** I'm coordinating an outfit, **When** I view outfit detail page, **Then** I see linked accessories/makeup with quick-add from existing collection
6. **Given** wig needs restyling, **When** I set maintenance reminder, **Then** system alerts me before next scheduled use of that outfit

---

### User Story 5 - Retrospective Documentation Updates (Priority: P1)

As a developer maintaining the system, I want the specification to accurately reflect what was actually implemented during development (series autocomplete, character autocomplete, source medium, component linking, photo uploads, task checklists) so that the spec serves as accurate documentation for future development and onboarding.

**Why this priority**: Specification-implementation drift creates confusion and technical debt. Accurate specs are essential for maintenance, future development, and team onboarding. This ensures the spec reflects reality and serves as living documentation.

**Independent Test**: Developer can review spec updates against actual implementation, verify all implemented features are documented, and confirm no documented features are missing from implementation.

**Acceptance Scenarios**:

1. **Given** series field was implemented with autocomplete, **When** reviewing outfit spec, **Then** spec documents series autocomplete with external API integration (AniList, RAWG, TMDB, Google Books)
2. **Given** character name has autocomplete with autofill, **When** reviewing outfit spec, **Then** spec documents character search with series/medium autofill behavior
3. **Given** "outfit type" was changed to "source medium", **When** reviewing outfit spec, **Then** spec reflects updated field name and new values (Anime, Manga, Video Game, TV Show, Movie, Book, Original)
4. **Given** component linking was implemented with inline dropdowns, **When** reviewing outfit spec, **Then** spec documents linking wigs, makeup, props, equipment to outfits
5. **Given** photo upload section was added, **When** reviewing outfit spec, **Then** spec documents photo upload with preview and management capabilities
6. **Given** task checklist was implemented with local storage, **When** reviewing outfit spec, **Then** spec documents task management within outfit detail pages

---

### Edge Cases

- What happens when a standalone task is no longer relevant? (Allow task deletion with confirmation, or mark as "Cancelled" status)
- How does system handle pattern files that are very large (>10MB PDFs)? (Enforce 10MB file size limit with compression if possible, suggest external storage links for large files)
- What happens when craft supply quantity goes negative (e.g., user forgets to log purchase)? (Allow negative quantities with warning, prompt user to correct inventory)
- How does system handle expired makeup products that users want to keep as reference? (Allow marking as "Reference Only" status, remove from active inventory but keep in archives)
- What happens when user tries to link a pattern to multiple outfits that require different sizes? (Store pattern link with outfit-specific notes, allow size variations per outfit)
- How does system handle craft supplies shared across multiple props/outfits? (Track material usage per project with usage notes, maintain running quantity)
- What happens when accessory prescription info needs updating (new eye prescription)? (Allow editing prescription details, track prescription history for reference)
- How does system handle bulk import of existing inventory (user has spreadsheet of 100 supplies)? (Provide CSV import functionality with field mapping and validation)
- What happens when task due dates are in the past? (Show overdue badge with days overdue, allow updating due date or marking complete)
- How does system handle patterns purchased from multiple vendors with different formats? (Support common formats: PDF, JPG, PNG, links to external sites like Etsy/Patreon)

## Requirements *(mandatory)*

### Functional Requirements

**Standalone Task Management:**
- **FR-001**: System MUST allow users to create, read, update, and delete standalone tasks within their team
- **FR-002**: System MUST track task metadata: title, description, category, due date, priority (low/medium/high), status (pending/in-progress/completed/cancelled), created date, completed date, optional custom tags, optional assigned team member
- **FR-003**: System MUST support predefined task categories: Communication, Shopping, Research, Planning, Maintenance, Other (fixed list for consistent filtering)
- **FR-003a**: System MUST allow users to add custom tags/labels to tasks for additional organization beyond predefined categories
- **FR-003b**: System MUST allow tasks to be unassigned (team-wide) or optionally assigned to specific team members
- **FR-004**: System MUST allow users to filter tasks by category, priority, status, due date range, custom tags, or assigned member (including "unassigned" filter)
- **FR-005**: System MUST display overdue tasks with visual warning and days overdue counter
- **FR-006**: System MUST show upcoming tasks with deadline countdown (e.g., "Due in 3 days")
- **FR-007**: System MUST allow users to mark tasks as complete with automatic completion timestamp
- **FR-008**: System MUST support task search across title and description fields with real-time filtering
- **FR-009**: System MUST allow bulk operations on tasks (multi-select and bulk status changes)
- **FR-010**: System MUST provide task statistics (total tasks, completed percentage, overdue count)

**Outfit Patterns and Templates:**
- **FR-011**: System MUST allow users to upload pattern files (PDF, JPG, PNG) up to 10MB per file to outfit detail pages using Cloudflare R2 storage
- **FR-012**: System MUST track pattern metadata: name, brand, pattern number, size, purchased date, cost, modification notes, and R2 file URL/path
- **FR-013**: System MUST support multiple patterns per outfit (1-20 patterns)
- **FR-014**: System MUST allow linking existing patterns to multiple outfits without re-uploading
- **FR-015**: System MUST provide pattern download functionality with original filename preservation
- **FR-016**: System MUST support external pattern links (Etsy, Patreon, personal websites) as alternative to file uploads
- **FR-017**: System MUST display pattern thumbnails for image files and PDF icon for PDF files
- **FR-018**: System MUST allow users to add modification notes to patterns (alterations, sizing adjustments)
- **FR-019**: System MUST allow users to search patterns by brand, pattern number, or outfit association
- **FR-020**: System MUST track pattern usage across outfits for inventory purposes

**Craft Supplies and Materials:**
- **FR-021**: System MUST allow users to create, read, update, and delete craft supply entries within their team
- **FR-022**: System MUST support supply categories: Foam, Paint, Fabric, Adhesive, Tool, Hardware, Electronics, Other
- **FR-023**: System MUST track supply metadata: name, category, quantity, unit (sheets/bottles/yards/pieces), cost per unit, total cost, brand, color/size, storage location, purchase date, supplier/link
- **FR-024**: System MUST allow users to update quantities as supplies are used (addition/subtraction)
- **FR-025**: System MUST track supply usage history with date, quantity change, and optional project/outfit association
- **FR-026**: System MUST support per-supply low-stock thresholds with optional global default (users can set individual thresholds per item or use team-wide default value)
- **FR-027**: System MUST generate shopping lists from low-stock items with estimated restock costs
- **FR-028**: System MUST allow users to upload 1-3 photos per supply (product photo, storage location photo) to Cloudflare R2 storage
- **FR-029**: System MUST allow users to filter supplies by category, color, brand, or storage location
- **FR-030**: System MUST calculate total inventory value across all supplies
- **FR-031**: System MUST support bulk quantity updates via CSV import for initial inventory setup
- **FR-032**: System MUST allow users to mark supplies as "running low" manually even if above threshold

**Accessories and Makeup Pages:**
- **FR-033**: System MUST provide dedicated Accessories page separate from outfit management with categories: Jewelry, Contacts, Wigs, Other Accessories
- **FR-034**: System MUST provide dedicated Makeup page separate from outfit management with categories: Foundation, Eyes, Lips, Nails, SFX, Body Paint, Tools
- **FR-035**: System MUST support type-specific fields for contacts: prescription details (base curve, diameter, power), usage schedule, replacement reminder
- **FR-036**: System MUST support type-specific fields for makeup: expiration date, usage level (new/half-full/low/empty), skin tone match, finish type
- **FR-037**: System MUST support type-specific fields for wigs: fiber type (synthetic/human hair), style, color, cap size, restyling needs
- **FR-038**: System MUST provide expiration warnings for makeup products (30 days advance notice, visual warning at 7 days)
- **FR-039**: System MUST allow linking accessories and makeup to outfits for coordination and requirement tracking
- **FR-040**: System MUST support maintenance schedules for wigs (cleaning, restyling) and contacts (replacement) with in-app badge/indicator warnings
- **FR-040a**: System MUST provide optional email notifications for maintenance reminders (opt-in per user preference)
- **FR-041**: System MUST allow users to mark makeup as "Reference Only" after expiration for color matching
- **FR-042**: System MUST display accessory/makeup usage history (which outfits, how often)

**Retrospective Documentation:**
- **FR-043**: Specification MUST document series autocomplete feature with external API integration (AniList, RAWG, TMDB, Google Books)
- **FR-044**: Specification MUST document character autocomplete with autofill behavior (series and source medium)
- **FR-045**: Specification MUST document "source medium" field replacing "outfit type" with values: Anime, Manga, Video Game, TV Show, Movie, Book, Comic, Stage Production, Original
- **FR-046**: Specification MUST document component linking feature (linking wigs, makeup, props, equipment to outfits)
- **FR-047**: Specification MUST document photo upload implementation on outfit detail pages
- **FR-048**: Specification MUST document task checklist implementation within outfit detail pages with local storage
- **FR-049**: Specification MUST document inline dropdown UI pattern for adding components (search and create)
- **FR-050**: Specification MUST document delete confirmation dialogs for all resource pages

**Cross-Feature Requirements:**
- **FR-051**: All new resources (tasks, patterns, supplies, accessories, makeup) MUST be scoped to teams
- **FR-052**: System MUST maintain consistent UI patterns across all new resource pages (matching existing resource management design)
- **FR-053**: System MUST support real-time search across all new resource types with 300ms debouncing
- **FR-054**: System MUST enforce team permissions (only team members can view/edit team resources)
- **FR-055**: System MUST track creation date, last modified date, and created by user for all new resources
- **FR-056**: System MUST support exporting all new resource types to CSV for backup/reporting
- **FR-057**: System MUST soft-delete all new resources (retain for 6 months, then permanently delete)
- **FR-058**: System MUST provide archive view for deleted resources within 6-month retention period

### Key Entities

- **Task**: Represents standalone tasks with title, description, predefined category (6 fixed options), optional custom tags/labels, optional assigned team member, due date, priority, status, and completion tracking. Not tied to specific resources but can reference them in description.
- **Pattern**: Represents sewing patterns and templates with file storage, metadata (brand, size, cost), modification notes, and multi-outfit linking capability.
- **Craft Supply**: Represents materials and supplies with quantity tracking, usage history, cost tracking, per-item low-stock thresholds (with global default fallback), low-stock warnings, and shopping list generation.
- **Accessory (Dedicated)**: Enhanced accessory entity with type-specific fields, maintenance scheduling, prescription tracking for contacts, and outfit coordination links.
- **Makeup Product (Dedicated)**: Enhanced makeup entity with expiration tracking, usage levels, skin tone matching, and reference-only status for expired items.
- **Pattern-Outfit Link**: Junction entity linking patterns to outfits with outfit-specific notes (size variations, modifications per outfit).
- **Supply Usage Record**: Tracks material consumption with date, quantity change, optional project association, and running quantity balance.
- **Shopping List Item**: Generated from low-stock supplies with supply reference, desired quantity, estimated cost, priority, and purchase status.

## Clarifications

### Session 2025-10-24

- Q: Where should pattern files (PDF, JPG, PNG up to 10MB) be stored? → A: Upload files to Cloudflare R2 storage; also migrate existing image uploads (outfits, props, supplies) to Cloudflare R2 for better scalability and cost optimization
- Q: Should low-stock threshold warnings be set globally for all supplies or per-supply item? → A: Per-supply threshold with optional global default (users can set per-item or use global fallback)
- Q: Can users add entirely new task categories or only use predefined ones? → A: Predefined categories plus custom tags/labels (6 fixed categories for filtering, plus optional user-defined tags)
- Q: Can tasks be assigned to specific team members or are they unassigned/team-wide only? → A: Unassigned by default, optional assignment to team members (flexible for solo and team use)
- Q: How should users be notified about upcoming maintenance (wigs, contacts)? → A: In-app badge/indicator plus optional email notifications (badges on accessory cards, opt-in email reminders)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a standalone task with all details in under 30 seconds
- **SC-002**: Users can upload and attach a pattern file to an outfit in under 1 minute
- **SC-003**: Users can add a craft supply with photo and quantity in under 1 minute
- **SC-004**: System generates accurate shopping list from low-stock supplies in under 2 seconds
- **SC-005**: 90% of users successfully find and access dedicated Accessories and Makeup pages on first attempt
- **SC-006**: Makeup expiration warnings display 30 days before expiry with 100% accuracy
- **SC-007**: Users can link existing patterns to multiple outfits without re-uploading in under 20 seconds per outfit
- **SC-008**: Supply quantity updates reflect immediately across all views with zero lag
- **SC-009**: Task filtering and search return results in under 500ms for lists with 100+ tasks
- **SC-010**: Users report that standalone task management reduces missed deadlines by at least 40%
- **SC-011**: Pattern file uploads complete in under 10 seconds for files up to 5MB
- **SC-012**: 85% of users successfully import existing supply inventory via CSV on first attempt
- **SC-013**: System accurately tracks craft supply costs with zero calculation errors
- **SC-014**: Specification updates reflect 100% of implemented features with no omissions

## Assumptions

- Users have basic file management skills for uploading patterns
- Pattern files will primarily be PDF (80%) with some images (20%)
- Craft supply inventory will range from 20-200 items per team
- Users will manually log supply usage (no barcode scanning in MVP)
- Task management needs are relatively simple (no Gantt charts or complex dependencies)
- Most teams will have 10-50 active tasks at any given time
- Accessories and makeup collections will average 30-50 items per team
- Users understand basic sewing pattern terminology (pattern number, size, etc.)
- Shopping lists are manual reference (no auto-purchase integration)
- Photo uploads for supplies follow same constraints as outfits (5MB limit, auto-compression)

## Dependencies

- Team management system must be functional (all resources are team-scoped)
- User authentication and authorization must be working
- Cloudflare R2 storage integration for file uploads (patterns, images)
- Migration of existing image uploads from current storage to Cloudflare R2
- File upload system must support pattern file storage (PDF, images) with R2 backend
- Database must support JSONB for task and supply metadata
- Database must store R2 file URLs/paths for patterns and images
- Existing resource management UI patterns established in spec 045
- Search functionality requires full-text search capability
- CSV import/export requires server-side parsing and validation
- Photo upload requires image compression before R2 upload
- Email notification system for maintenance reminders (opt-in)
- External API integration for series/character autocomplete (documented in retrospective)

## Out of Scope

- Task dependencies and project management (Gantt charts, critical path)
- Automated material cost calculations per outfit/prop (manual association only)
- Barcode/QR code scanning for supply inventory
- Integration with online shopping platforms (Amazon, Etsy) for automatic purchasing
- Pattern sharing marketplace between teams
- Automated pattern printing or scaling
- Supply expiration tracking (only makeup expiration)
- Real-time collaboration on task lists
- Multi-assignment of tasks (tasks can only be assigned to one team member or left unassigned)
- Integration with external task management tools (Trello, Asana)
- Push notifications for mobile devices (only email and in-app notifications in MVP)
- Automated restock notifications for supplies
- Pattern version control or modification tracking
- Supply lending/borrowing tracking between team members
- Outfit component requirement calculation from patterns

## Integration Notes

This specification expands spec 045 (Resource Management System) with:

1. **New Resource Types**: Standalone tasks, craft supplies, patterns
2. **Enhanced Pages**: Dedicated accessories and makeup pages (splitting from general outfit accessories)
3. **Retrospective Updates**: Documenting already-implemented features that weren't captured in original spec

All new features should follow established patterns from spec 045 for consistency:
- Similar page layouts and navigation
- Consistent CRUD operations
- Matching search/filter UI
- Same soft-delete and archive behavior
- Identical permission model
- Similar photo upload handling
