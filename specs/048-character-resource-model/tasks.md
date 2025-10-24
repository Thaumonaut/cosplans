# Tasks: Comprehensive Resource Management System (Character-Centric Model)

**Input**: Design documents from `/specs/048-character-resource-model/`  
**Prerequisites**: spec.md (180 FRs), plan.md (5-phase strategy), ui-design.md (stress-reducing UI)

**⚠️ SCOPE NOTE**: This spec consolidates 3 previous specs (045, 046, 047) with 180 functional requirements and 12 resource types. To maintain **VIII.5 Solo Developer Efficiency**, tasks are broken into incremental, independently deliverable phases.

**Tests**: Not explicitly requested in spec - implementation-first approach with manual testing per user story

**Organization**: Tasks grouped by user story for independent implementation and delivery

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

All paths relative to repository root (`C:\Projects\Web\Vibe Coding\cosplans\`):
- Components: `src/lib/components/[resource]/`
- Server services: `src/lib/server/resources/`
- Routes: `src/routes/(auth)/[resource]/`
- Database migrations: `supabase/migrations/`
- Types: `src/lib/types/resources.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, theme integration, and foundational UI components

**Estimated Time**: 1-2 hours

- [x] T001 Create `src/lib/components/characters/` directory for character components
- [x] T002 Create `src/lib/components/wigs/` directory for wig components
- [x] T003 [P] Update `src/lib/types/resources.ts` to add Character, Wig, CharacterWig junction types
- [x] T004 [P] Install JetBrains Mono font and update `app.html` with Google Fonts link per ui-design.md
- [x] T005 [P] Update existing `light-green` theme in `src/lib/utils/theme-variants.ts` to use exact logo colors (#19DA5A, #21F96A, #008F31)
- [x] T006 Review `theme-integration-guide.md` and ensure all new components will use CSS custom properties

**Checkpoint**: ✅ Foundation ready - character implementation can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema and core infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until database migration is complete

**Estimated Time**: 2-3 hours

### Database Migration

- [ ] T007 Create migration file `supabase/migrations/[timestamp]_characters_and_wigs.sql` for characters, wigs, junction tables
- [ ] T008 In migration, create `characters` table with columns: id (uuid), team_id (uuid FK), character_name (text), series (text), source_medium (text enum), appearance_description (text), personality_notes (text), aliases (text), reference_images (text[] for R2 URLs), budget_mode (text enum: personal/commission), budget_limit (numeric), completion_percentage (numeric), created_at, updated_at, created_by, updated_by
- [ ] T009 [P] In migration, create `wigs` table with columns: id (uuid), team_id (uuid FK), wig_name (text), color (text), length (text enum), fiber_type (text enum), base_wig_brand (text), status (text enum), base_wig_cost (numeric), styling_cost (numeric), total_cost (numeric), condition (text enum), last_washed_date (timestamptz), maintenance_notes (text), storage_location (text), storage_method (text), source_type (text enum), vendor_id (uuid FK nullable), created_at, updated_at
- [ ] T010 [P] In migration, create `character_wigs` junction table with columns: id (uuid), character_id (uuid FK), wig_id (uuid FK), notes (text), created_at
- [ ] T011 In migration, add Row Level Security (RLS) policies for characters table: SELECT (team member), INSERT (team member), UPDATE (team member), DELETE (team owner/admin)
- [ ] T012 [P] In migration, add RLS policies for wigs table (same pattern as characters)
- [ ] T013 [P] In migration, add RLS policies for character_wigs table (same pattern)
- [ ] T014 Run migration with `bun run db:migrate` and verify tables created in Supabase dashboard
- [ ] T015 Add database types to `src/lib/types/resources.ts`: Character, Wig, CharacterWig matching migration schema

### Server Services

- [ ] T016 [P] Create `src/lib/server/resources/character-service.ts` with CRUD methods (create, getById, list, update, delete, searchByName, searchBySeries, filterBySourceMedium, calculateCompletionPercentage)
- [ ] T017 [P] Create `src/lib/server/resources/wig-service.ts` with CRUD methods (create, getById, list, update, delete, filterByCharacter, filterByStatus)
- [ ] T018 Create `src/lib/server/resources/allocation-service.ts` stub (for future material allocation, currently returns empty arrays)

**Checkpoint**: ✅ Database and services ready - UI implementation can now begin in parallel

---

## Phase 3: User Story 1 - Character Brainstorming Hub (Priority: P1) 🎯 **MVP**

**Goal**: Cosplayers can create character entries with series, appearance details, reference notes, and use them as organizational hubs for brainstorming without requiring any linked resources

**Independent Test**: 
1. Navigate to `/characters`
2. Click "Create Character"
3. Fill in character name, series, source medium, appearance details
4. Upload 1-3 reference images
5. Save character
6. Verify character displays in list with all details
7. Filter by series and source medium
8. View character detail page (empty state for linked resources)

**Estimated Time**: 6-8 hours

### Character Overview Page

- [ ] T019 [P] [US1] Create `src/routes/(auth)/characters/+page.svelte` with grid layout per ui-design.md (clean, spacious, 64px section gaps)
- [ ] T020 [P] [US1] Create `src/routes/(auth)/characters/+page.server.ts` load function to fetch characters via character-service
- [ ] T021 [US1] In characters overview page, add page header with JetBrains Mono Bold H1 "CHARACTERS" per ui-design.md typography
- [ ] T022 [US1] Add hint icon next to heading with tooltip explaining character hub concept (stress-reducing design, not info card)
- [ ] T023 [US1] Add search input with 300ms debounce for real-time filtering by character name, series, or aliases
- [ ] T024 [US1] Add filter dropdown for source medium (Anime, Manga, Video Game, Movie, TV Show, Book, Comic, Stage, Original)
- [ ] T025 [US1] Add filter dropdown for completion status (All, 0-25%, 26-50%, 51-75%, 76-99%, 100%)
- [ ] T026 [US1] Add "Create Character" button (primary style with logo green #19DA5A, gentle hover to #21F96A)
- [ ] T027 [US1] Display empty state when no characters exist: illustration + "Create your first character to start planning" with primary action button

### Character Card Component

- [ ] T028 [P] [US1] Create `src/lib/components/characters/CharacterCard.svelte` with 280×360px dimensions per ui-design.md
- [ ] T029 [US1] In CharacterCard, display primary reference image (280×200px object-cover) or placeholder if no images
- [ ] T030 [US1] Add glassmorphism overlay on hover with quick actions (Edit, Delete) using `var(--theme-card-bg)` with backdrop-filter
- [ ] T031 [US1] Display character name (H3, JetBrains Mono SemiBold), series (secondary text), source medium badge
- [ ] T032 [US1] Show completion percentage with progress bar (gentle green gradient `var(--theme-primary)` to `var(--theme-accent)`)
- [ ] T033 [US1] Add smooth hover lift animation (-4px translate, shadow-lg, 200ms ease-out per stress-reducing design)
- [ ] T034 [US1] On card click, navigate to `/characters/[id]` detail page

### Character Detail Page (MVP: No Linked Resources Yet)

- [ ] T035 [P] [US1] Create `src/routes/(auth)/characters/[id]/+page.svelte` with character hub layout per ui-design.md
- [ ] T036 [P] [US1] Create `src/routes/(auth)/characters/[id]/+page.server.ts` load function to fetch character by ID
- [ ] T037 [US1] Add hero section with primary reference image background (if available), gradient overlay, character avatar (120×120px circle)
- [ ] T038 [US1] Display character name (H1, JetBrains Mono Bold 48px), series, source medium below avatar
- [ ] T039 [US1] Add stats row with 3 cards (32px padding): Completion (percentage), Budget (placeholder $0/$0), Event (placeholder "No events")
- [ ] T040 [US1] Add "Details" section with inline-editable fields: Character Name (InlineEditField), Aliases (comma-separated), Series, Source Medium (dropdown), Appearance Description (ThemedTextarea), Personality Notes (ThemedTextarea)
- [ ] T041 [US1] Add reference images gallery (1-10 photos, thumbnail strip, lightbox view on click, drag-to-reorder)
- [ ] T042 [US1] Add "Linked Resources" section with empty states for Outfits, Wigs, Props, Accessories (shows "No [resource] linked yet" with + Add button disabled or showing "Coming soon" tooltip)
- [ ] T043 [US1] Add delete button (danger style, bottom of page) with confirmation dialog showing "This will unlink X resources" (currently 0)

### Character CRUD Actions

- [ ] T044 [P] [US1] Create `src/routes/(auth)/characters/[id]/+page.server.ts` form action `create` to create character via character-service
- [ ] T045 [P] [US1] Create form action `update` to update character fields (inline edits call this)
- [ ] T046 [P] [US1] Create form action `delete` to soft-delete character and unlink resources (currently just deletes character)
- [ ] T047 [US1] Add client-side redirect handling per existing patterns (redirect: 'manual', check 3xx status, window.location.href)
- [ ] T048 [US1] Add form validation: character_name required, series required, source_medium required
- [ ] T049 [US1] Add error handling with calm toast notifications (✗ "Failed to save character" with retry button)

### Reference Image Upload

- [ ] T050 [P] [US1] Create `src/lib/components/shared/PhotoUpload.svelte` component for Cloudflare R2 uploads
- [ ] T051 [P] [US1] Add drop zone UI (dashed border, 200px min-height, drag-over state with brand green tint)
- [ ] T052 [US1] Implement file upload to Cloudflare R2 with 3 retry attempts (FR-051: exponential backoff 1s, 2s, 4s)
- [ ] T053 [US1] Add upload progress indicator (linear progress bar, percentage text)
- [ ] T054 [US1] Add file preview grid (3-col desktop, 2-col tablet, 1-col mobile) with remove button
- [ ] T055 [US1] Add photo compression warning for files >5MB with gentle warning badge (amber)
- [ ] T056 [US1] On upload failure after 3 retries, save character as draft without images and show retry option
- [ ] T057 [US1] Store R2 URLs in character.reference_images array (text[] column)

### Character Search & Filtering

- [ ] T058 [P] [US1] Implement real-time search in characters overview with debounce (300ms) querying character_name, series, aliases
- [ ] T059 [P] [US1] Implement source medium filter dropdown with multi-select checkboxes and result count per option
- [ ] T060 [US1] Implement completion percentage filter with range options (0-25%, 26-50%, etc.)
- [ ] T061 [US1] Add "Clear all filters" button when filters active, showing filter chips (removable pills)
- [ ] T062 [US1] Display result count "Showing X of Y characters" below filters

### Duplicate Prevention

- [ ] T063 [P] [US1] Implement duplicate detection on character create: query existing characters with same series + name
- [ ] T064 [US1] Show warning modal if duplicate found: "Character '{name}' from '{series}' already exists. Create anyway?" with Confirm/Cancel
- [ ] T065 [US1] Allow user to proceed with duplicate or cancel to edit (FR-001a explicit confirmation)

**Checkpoint**: ✅ User Story 1 complete - Cosplayers can brainstorm and organize character ideas independently

**MVP Delivery**: At this point, you have a fully functional character management system that delivers value:
- Create, edit, delete characters
- Upload reference images
- Search and filter characters
- Character detail pages as organizational hubs
- Stress-reducing UI (calm, clean, spacious)

---

## Phase 4: User Story 2 - Wigs as Independent Resource Category (Priority: P1)

**Goal**: Wigs are separate from accessories with full project tracking (tasks, materials, costs, status)

**Independent Test**:
1. Navigate to `/wigs`
2. Click "Create Wig"
3. Fill wig details (name, color, length, fiber type, status)
4. Link to character (optional)
5. Add tasks with due dates
6. Track costs (base + styling)
7. Verify wig displays in list
8. Filter by character or status

**Dependencies**: ✅ Phase 3 (Characters must exist to link wigs)

**Estimated Time**: 6-8 hours

### Wigs Overview Page

- [ ] T066 [P] [US2] Create `src/routes/(auth)/wigs/+page.svelte` with grid layout (same pattern as characters)
- [ ] T067 [P] [US2] Create `src/routes/(auth)/wigs/+page.server.ts` load function to fetch wigs via wig-service
- [ ] T068 [US2] Add page header "WIGS" (JetBrains Mono Bold H1) with hint icon tooltip
- [ ] T069 [US2] Add search input (debounced 300ms) for wig name
- [ ] T070 [US2] Add filter dropdowns: Linked Character (dropdown of all characters), Status (Planned, Ordered, Received, In Progress, Completed, Needs Restyling, Damaged), Length, Fiber Type
- [ ] T071 [US2] Add "Create Wig" button (primary green style)
- [ ] T072 [US2] Display empty state when no wigs exist

### Wig Card Component

- [ ] T073 [P] [US2] Create `src/lib/components/wigs/WigCard.svelte` (280×360px card)
- [ ] T074 [US2] Display primary wig photo or placeholder (colored block matching wig color field)
- [ ] T075 [US2] Show wig name (H3), color, length, fiber type (secondary text)
- [ ] T076 [US2] Display status badge with appropriate color (planned=blue, in-progress=amber, completed=green per ui-design.md)
- [ ] T077 [US2] Show linked character(s) as small chips below wig name (click to navigate to character)
- [ ] T078 [US2] Display total cost (base + styling) in bottom right corner
- [ ] T079 [US2] Add quick actions overlay on hover (Edit, Delete)

### Wig Detail Page

- [ ] T080 [P] [US2] Create `src/routes/(auth)/wigs/[id]/+page.svelte` with tabbed layout: Details | Tasks | Photos | History
- [ ] T081 [P] [US2] Create `src/routes/(auth)/wigs/[id]/+page.server.ts` load function to fetch wig by ID
- [ ] T082 [US2] **Details Tab**: Add inline-editable fields: Wig Name, Color, Length (dropdown: Short/Medium/Long/Extra-Long), Fiber Type (dropdown: Synthetic/Human Hair/Blend), Base Wig Brand, Status (dropdown with all statuses), Condition (dropdown: Pristine/Good/Needs Care/Damaged)
- [ ] T083 [US2] Add cost tracking fields: Base Wig Cost (currency input), Styling Cost (currency input), Total Cost (auto-calculated, read-only)
- [ ] T084 [US2] Add character linking section: "Linked Characters" with multi-select picker (allows linking wig to multiple characters per FR-013)
- [ ] T085 [US2] Add vendor dropdown (nullable FK to vendors table - stub for now, shows "No vendors yet")
- [ ] T086 [US2] Add maintenance tracking fields: Last Washed Date (date picker), Maintenance Notes (textarea), Storage Location (text), Storage Method (text)

### Wig Tasks Management

- [ ] T087 [P] [US2] Add "Tasks" tab on wig detail page with task list component (reuse pattern from costume tasks)
- [ ] T088 [US2] Create wig_tasks table in migration (if not already in T007): columns id, wig_id FK, task_title, task_description, due_date, status (pending/in-progress/completed), created_at
- [ ] T089 [US2] Display task list with checkboxes, drag-to-reorder, due date badges (overdue=red, due soon=yellow per ui-design.md)
- [ ] T090 [US2] Add quick task input at bottom: "+ Add task" inline input with due date picker
- [ ] T091 [US2] Show progress bar: "X of Y tasks complete" with gentle green fill
- [ ] T092 [US2] Add task actions: Mark complete (checkbox), Edit (inline), Delete (trash icon)

### Wig CRUD Actions

- [ ] T093 [P] [US2] Create form action `create` in `src/routes/(auth)/wigs/[id]/+page.server.ts` via wig-service
- [ ] T094 [P] [US2] Create form action `update` for inline edits
- [ ] T095 [P] [US2] Create form action `delete` with confirmation dialog
- [ ] T096 [US2] Add validation: wig_name required, color required, length required, fiber_type required
- [ ] T097 [US2] Add character linking logic: insert/delete records in character_wigs junction table
- [ ] T098 [US2] Auto-calculate total_cost = base_wig_cost + styling_cost on save

### Wig Filtering & Search

- [ ] T099 [P] [US2] Implement search across wig_name with debounce
- [ ] T100 [P] [US2] Implement character filter: query wigs joined to character_wigs where character_id matches
- [ ] T101 [US2] Implement status filter with multi-select
- [ ] T102 [US2] Add filter chips and clear all button

**Checkpoint**: ✅ User Story 2 complete - Wigs are fully trackable independent resources with tasks and costs

---

## Phase 5: User Story 3 - Resource-to-Character Linking (Priority: P1)

**Goal**: Link outfits, wigs, props, accessories to characters; view all resources per character on character detail page; show completion percentage

**Independent Test**:
1. Navigate to existing character detail page
2. Click "Link Wig" in Linked Resources section
3. Select existing wig or create new wig with character pre-filled
4. Verify wig displays on character page with status
5. Repeat for outfit, prop (future)
6. Verify completion percentage updates (completed resources / total resources)

**Dependencies**: ✅ Phase 3 (Characters), ✅ Phase 4 (Wigs)

**Estimated Time**: 4-6 hours

### Character Detail Page - Linked Resources Section

- [ ] T103 [P] [US3] Update `src/routes/(auth)/characters/[id]/+page.server.ts` load function to fetch linked wigs via character_wigs join
- [ ] T104 [US3] In character detail page, replace "Linked Resources" empty state with actual data display
- [ ] T105 [US3] Add "Wigs" section with horizontal scroll of wig cards (mini version, 200×250px)
- [ ] T106 [US3] Add "+ Link Wig" button that opens inline dropdown (search existing wigs + "Create New Wig" option per ui-design.md inline modal pattern)
- [ ] T107 [US3] Implement wig search in link modal: filter wigs by name with real-time search
- [ ] T108 [US3] On wig select, insert record into character_wigs junction table and refresh character page
- [ ] T109 [US3] Add "Remove" button on each linked wig card (removes junction record, keeps wig)
- [ ] T110 [US3] Show wig status badge on linked wig cards (completed/in-progress/planned color coding)

### Completion Percentage Calculation

- [ ] T111 [P] [US3] Implement completion percentage calculation in character-service: `(completed resources / total resources) × 100`
- [ ] T112 [US3] Count "completed" resources as: wigs with status="Completed", outfits with status="Completed" (future), props with status="Ready" (future)
- [ ] T113 [US3] Update character.completion_percentage field on resource status change (trigger or manual recalc)
- [ ] T114 [US3] Display completion percentage in character card on overview page (progress bar with percentage label)
- [ ] T115 [US3] Display completion percentage in character detail page stats row (large circular progress per ui-design.md)

### Multi-Character Wig Linking

- [ ] T116 [P] [US3] Allow linking same wig to multiple characters (many-to-many via character_wigs junction)
- [ ] T117 [US3] On wig detail page, show all linked characters as chips with click-to-navigate
- [ ] T118 [US3] On character deletion, remove character_wigs records but keep wig (automatic unlinking per FR-009)

### Character List Filtering

- [ ] T119 [P] [US3] Add completion percentage filter to characters overview page (0-25%, 26-50%, 51-75%, 76-99%, 100%)
- [ ] T120 [US3] Implement filter query: WHERE completion_percentage BETWEEN X AND Y
- [ ] T121 [US3] Display result count after filtering

**Checkpoint**: ✅ User Story 3 complete - Characters act as organizational hubs with linked resources and completion tracking

---

## Phase 6: User Story 4 - Enhanced Outfit Tracking (Priority: P2) 🔮 **FUTURE**

**Status**: ⏭️ **DEFERRED** - P2 priority, implement after MVP validation

**Goal**: Outfits specify version/variation, track patterns, alteration notes, crafting tasks

**Dependencies**: ✅ Phase 3 (Characters), existing outfit system

**Scope**: 
- Add `version` field to outfits (required if character linked per FR-104)
- Add pattern file uploads (PDF to R2)
- Add alteration notes (textarea)
- Add outfit tasks (similar to wig tasks)
- Link outfits to characters
- Update costume service to outfit service (rename)

**Estimated Tasks**: ~20 tasks, 6-8 hours

**Reason for Deferral**: Outfits already exist in the codebase (from spec 045/047). This story enhances existing functionality rather than creating net-new capability. Validate character + wig MVP first before enhancing outfits.

---

## Phase 7: User Story 5 - Consolidated Resource Management (Priority: P2) 🔮 **FUTURE**

**Status**: ⏭️ **DEFERRED** - P2 priority, developer-focused consolidation

**Goal**: Spec 048 supersedes specs 045, 046, 047 with clear data model and migration strategy

**Dependencies**: ✅ All previous phases

**Scope**:
- Data migration from accessories to wigs table
- Update all resource types to support optional character FK
- Consolidation documentation
- Deprecate old specs

**Estimated Tasks**: ~15 tasks, 4-6 hours

**Reason for Deferral**: This is cleanup/consolidation work. Complete MVP and validate with users before investing in migration.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final touches, performance optimization, documentation

**⏭️ Implement after Phases 3-5 complete**

- [ ] T122 Add loading skeletons to all overview pages (shimmer effect per ui-design.md)
- [ ] T123 Add error boundaries to character and wig detail pages
- [ ] T124 Optimize image loading: lazy load below-fold images, WebP format with JPG fallback
- [ ] T125 Add keyboard shortcuts: Cmd+K for search, Escape to close modals
- [ ] T126 Test all pages across all 8 themes (light-default, light-green, light-warm, light-cool, dark-default, dark-cozy, dark-cosmic, dark-fantasy)
- [ ] T127 Verify WCAG AA contrast ratios (4.5:1 text, 3:1 large text)
- [ ] T128 Test mobile responsiveness (44px touch targets, bottom nav if needed)
- [ ] T129 Add helpful empty states with illustrations per ui-design.md
- [ ] T130 Update sidebar navigation to include "Characters" and "Wigs" menu items
- [ ] T131 Document completion: Update README with character/wig features
- [ ] T132 Create `specs/048-character-resource-model/INTEGRATION.md` summary

---

## Dependencies & Execution Order

**Sequential Phases** (must complete in order):
1. Phase 1: Setup → Phase 2: Foundational → Phase 3: User Story 1 (MVP)
2. Phase 3 → Phase 4: User Story 2 (Wigs depend on Characters)
3. Phase 4 → Phase 5: User Story 3 (Linking requires both Characters and Wigs)

**Parallel Opportunities Within Phases**:
- Phase 1: T003, T004, T005, T006 can run in parallel (different files)
- Phase 2: T009 (wigs table), T010 (junction), T012-T013 (RLS), T015 (types) can run parallel after T008 (characters table)
- Phase 2: T016 (character-service), T017 (wig-service), T018 (allocation-service) can run in parallel
- Phase 3: T019-T020 (overview page), T028-T034 (card component), T035-T043 (detail page), T050-T057 (photo upload) can start in parallel after T016
- Phase 4: T066-T072 (overview), T073-T079 (card), T080-T086 (detail) can start in parallel after T017
- Phase 5: T103-T110 (character linking), T111-T115 (completion %), T116-T118 (multi-char), T119-T121 (filtering) can run in parallel

---

## Implementation Strategy

### MVP-First Approach

**Week 1: Foundation + Characters** (Phases 1-3)
- Goal: Ship character management as standalone value
- Deliverable: Cosplayers can create character hubs with references
- Validation: Test with 3-5 users, gather feedback

**Week 2: Wigs** (Phase 4)
- Goal: Add wig tracking as second resource type
- Deliverable: Cosplayers can manage wig projects with tasks
- Validation: Test character + wig workflow

**Week 3: Linking** (Phase 5)
- Goal: Connect characters and wigs, show completion
- Deliverable: Character detail page shows all resources
- Validation: Test full character-centric workflow

**Future: Enhancements** (Phases 6-7)
- Defer until MVP validated with real users
- Prioritize based on user feedback

### Success Criteria per Phase

**Phase 3 Success** (MVP):
- [ ] Can create 10+ characters with references
- [ ] Search/filter works across 10+ characters
- [ ] Character detail page loads <2s
- [ ] Photo uploads succeed 95%+ of time
- [ ] UI feels calm and stress-reducing (user feedback)

**Phase 4 Success**:
- [ ] Can create 5+ wigs with tasks
- [ ] Task completion tracking works
- [ ] Cost calculation accurate
- [ ] Filter by character works

**Phase 5 Success**:
- [ ] Linking workflow is intuitive
- [ ] Completion percentage updates correctly
- [ ] Multi-character wigs work
- [ ] Character deletion unlinks resources properly

---

## Parallel Execution Examples

### Phase 2 Parallel Work
```
Developer A: T007-T015 (Database migration and types)
Developer B: T016 (Character service - waits for T015)
Developer C: T017 (Wig service - waits for T015)
```

### Phase 3 Parallel Work
```
Developer A: T019-T027 (Overview page UI)
Developer B: T028-T034 (Card component)
Developer C: T050-T057 (Photo upload component)
Developer D: T044-T049 (Server actions - waits for T016)
```

---

## Risk Mitigation

**Risks**:
1. **Photo upload failures** (R2 integration): Mitigated by 3 retries + draft fallback (FR-051)
2. **Character completion calculation performance**: Mitigated by caching percentage in character table
3. **Concurrent edits**: Mitigated by last-write-wins with timestamp notification (FR-052)
4. **Scope creep from 180 FRs**: Mitigated by deferring P2 stories and future systems

**Dependencies on External Systems**:
- Cloudflare R2 (photo storage): Already in use, proven pattern
- Supabase PostgreSQL: Already in use, proven pattern
- JetBrains Mono font: Google Fonts CDN, fallback to system fonts

---

## Out of Scope (Deferred to Future Specs)

The following systems are defined in spec 048 but **explicitly deferred** to maintain solo developer efficiency:

**12-Resource Full System** (FR-054 to FR-148):
- Materials / Craft Supplies Management (FR-073 to FR-087)
- Tools Management (FR-088 to FR-102)
- Accessories Management (FR-103 to FR-115)
- Enhanced Props (FR-116 to FR-124)
- Enhanced Equipment (FR-125 to FR-130)
- Enhanced Crew (FR-131 to FR-134)
- Enhanced Locations (FR-135 to FR-140)
- Events / Convention Management (FR-054 to FR-060)
- Vendor / Shop Management (FR-061 to FR-067)
- Universal Receipt System (FR-143 to FR-145)
- Post-Event Care Reminders (FR-146 to FR-148)
- Weather API Integration (location warnings)
- Difficulty / Skill Assessment (FR-068 to FR-072)

**Rationale**: These systems represent Phase 1, 3, 4, 5 of the implementation plan. They add immense value but are NOT blocking for the character-centric model MVP. Ship character + wig + linking first, validate with users, then iterate.

---

## Total Task Summary

**Setup & Foundation**: 18 tasks (T001-T018) - ~3-5 hours  
**User Story 1 (MVP)**: 47 tasks (T019-T065) - ~6-8 hours  
**User Story 2 (Wigs)**: 37 tasks (T066-T102) - ~6-8 hours  
**User Story 3 (Linking)**: 19 tasks (T103-T121) - ~4-6 hours  
**Polish**: 11 tasks (T122-T132) - ~2-3 hours

**Total MVP (Phases 1-5)**: 132 tasks, ~21-30 hours  
**Deferred (Phases 6-7)**: ~35 tasks, ~10-14 hours (implement after validation)

**MVP Delivery Timeline**: 3-4 weeks for solo developer with existing codebase patterns

---

## Notes

- **Stress-Reducing Design**: All UI tasks reference ui-design.md for calm, clean, spacious design (generous whitespace, gentle animations, no confetti/sound effects)
- **Theme Integration**: All components use CSS custom properties (`var(--theme-*)`) per theme-integration-guide.md
- **JetBrains Mono**: Headings use monospace font for technical precision aesthetic
- **Logo Green**: Primary color #19DA5A, accent #21F96A, dark #008F31 throughout
- **Incremental Delivery**: Each phase delivers independent value, can ship to production
- **Constitutional Compliance**: Phased approach maintains VIII.5 Solo Developer Efficiency by avoiding 180-FR waterfall

---

**Ready to Implement!** 🚀

Start with Phase 1 (Setup) and proceed sequentially through Phase 5 for a complete MVP.

