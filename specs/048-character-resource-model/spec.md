# Feature Specification: Comprehensive Resource Management System (Character-Centric Model)

> ✅ **SINGLE SOURCE OF TRUTH FOR RESOURCE MANAGEMENT**  
> This specification consolidates and supersedes specs 045, 046, and 047.  
> It provides a unified, character-centric approach to managing all cosplay resources (characters, costumes, wigs, props, accessories, makeup, equipment, locations, crew, tasks, and craft supplies).  
> **All future resource management development should reference THIS spec.**

**Feature Branch**: `048-character-resource-model`  
**Created**: October 24, 2025  
**Status**: **Active** (Consolidated from specs 045, 046, 047)  
**Consolidation Date**: October 24, 2025  
**Original Input**: User description: "I want to update the spec to clarify that wigs will be their own category. Wigs, as well as accessories and props and outfit, can be linked to a character. I also want a specific character section useful for when brainstorming ideas for new cosplay. Wigs will be able to track tasks for completion, due date, material requirements, and cost. Character will track the series and character name and relevant details about the character. The outfit (costume) section will be update to be what version of the character (video game, manga, anime, movie, tv show, etc.) as well as saving patterns, alteration notes, tasks, and other details for crafting a cosplay outfit"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Character Brainstorming Hub (Priority: P1)

As a cosplayer planning future projects, I want a dedicated character section where I can collect and organize character ideas with their series, appearance details, and reference notes so that I can evaluate which characters to cosplay and use them as a central hub for all related resources.

**Why this priority**: Character is the fundamental organizing principle for cosplay. Before creating costumes, wigs, or props, cosplayers research characters and gather references. This entity becomes the hub that all resources (costumes, wigs, props, accessories) link to, enabling character-centric planning and organization.

**Independent Test**: User can create character entries with series, character name, appearance details, and notes, browse character collection, and use characters as reference without creating any costumes/wigs yet.

**Acceptance Scenarios**:

1. **Given** I'm researching cosplay ideas, **When** I navigate to Characters page and click "Add Character", **Then** I see a form for character name, aliases (comma-separated), series, source medium, appearance details, personality notes, and reference images
2. **Given** I want to cosplay Saber from Fate/stay night, **When** I create character entry with series "Fate/stay night", name "Saber (Artoria Pendragon)", and appearance notes "blonde hair, green eyes, armor with blue and silver", **Then** character displays in my collection with all details
3. **Given** I have 15 character ideas, **When** I filter by series "Fate" or source medium "Anime", **Then** matching characters display
4. **Given** I'm planning which character to cosplay next, **When** I view character detail page, **Then** I see linked resources (costumes, wigs, props) and can add new ones from this central hub
5. **Given** I'm gathering inspiration, **When** I upload reference images to character entry, **Then** images display in character gallery for future reference

---

### User Story 2 - Wigs as Independent Resource Category (Priority: P1)

As a cosplayer who creates and styles wigs, I want wigs to be a separate resource category (not under accessories) with task tracking, material requirements, due dates, and cost tracking so that I can manage wig projects with the same detail as costumes and props.

**Why this priority**: Wigs are major cosplay components requiring significant time (10-40 hours styling), materials ($30-200+ per wig), and project management. Treating wigs as accessories undervalues their complexity. Separate wig category enables proper project tracking, material planning, and cost management.

**Independent Test**: User can create wig entries with color, length, style, track styling tasks with due dates, list material requirements (wefts, dye, styling products), and calculate costs independently of other resources.

**Acceptance Scenarios**:

1. **Given** I'm managing wig projects, **When** I navigate to Wigs page and click "Add Wig", **Then** I see a form for wig name, color, length, fiber type, base wig brand, character link, status, and cost
2. **Given** I'm creating a wig for Saber, **When** I add wig "Saber Blonde Wig" linked to Saber character with status "In Progress", **Then** wig appears in wigs list with character association
3. **Given** wig requires styling work, **When** I add tasks "Cut wefts for ahoge", "Style bangs", "Heat-seal spikes" with due dates, **Then** tasks display on wig detail page with deadline tracking
4. **Given** I need materials for wig, **When** I list material requirements "2x blonde weft packs", "Got2B gel", "fabric glue", **Then** materials show with option to mark as purchased
5. **Given** I'm tracking wig costs, **When** I enter base wig cost "$45", materials "$30", **Then** system calculates total cost "$75" and shows budget tracking
6. **Given** wig is complete, **When** I mark status as "Completed", **Then** wig moves to completed section with automatic time calculation shown, and I can optionally override with actual hours worked

---

### User Story 3 - Resource-to-Character Linking (Priority: P1)

As a cosplayer managing multiple character cosplays, I want to link costumes, wigs, props, and accessories to their associated characters so that I can see all resources for a character in one place and understand which characters have incomplete resource sets.

**Why this priority**: Cosplayers often juggle multiple characters with varying completion states. Character-centric organization (all Saber resources in one view) is more intuitive than resource-centric organization (all costumes, then all wigs separately). This enables better planning, prevents duplicate resources, and shows completion status per character.

**Independent Test**: User can link existing or new resources (costumes, wigs, props, accessories) to characters, view all resources for a character on character detail page, and see resource completion status per character.

**Acceptance Scenarios**:

1. **Given** I have a character "Saber" and existing costume, **When** I open Saber's detail page and click "Link Costume", **Then** I see list of my costumes with option to link existing or create new
2. **Given** I'm viewing Saber character page, **When** I link costume "Saber Armor", wig "Saber Blonde Wig", and prop "Excalibur Sword", **Then** all resources display under Saber with status badges (completed/in-progress/planned)
3. **Given** I'm planning a new character, **When** I create character and immediately add resources, **Then** resources are created with character association automatically set
4. **Given** I have props/accessories for multiple characters, **When** I link prop "Generic Katana" to both "Character A" and "Character B", **Then** prop shows on both character pages (reusable resources)
5. **Given** I'm reviewing character completion, **When** I view character list, **Then** each character shows completion percentage calculated as (completed resources / total resources) × 100 (e.g., "Saber: 75% (3 of 4 complete)")
6. **Given** I want to see all resources for a shoot, **When** I filter resources by character "Saber", **Then** all linked costumes, wigs, props, accessories display together

---

### User Story 4 - Enhanced Outfit Tracking with Version/Variation (Priority: P2)

As a cosplayer who creates multiple versions of the same character, I want outfit entries to specify which version/adaptation (video game, manga, anime, movie, TV show, stage, original) and track patterns, alteration notes, and crafting tasks so that I can distinguish between versions and maintain detailed construction records.

**Why this priority**: Many characters have multiple canon appearances (Saber has 10+ outfit variations across Fate series). Specifying version prevents confusion ("Which Saber outfit?") and enables better organization. Enhanced tracking (patterns, alterations, tasks) supports the sewing/crafting workflow central to costume creation.

**Independent Test**: User can create outfit entries with version specification, upload/link patterns, add alteration notes, track crafting tasks with due dates, and view construction history independently.

**Acceptance Scenarios**:

1. **Given** I'm creating an outfit for Saber, **When** I click "Add Outfit" from Saber character page, **Then** I see form with character pre-filled, plus version field (Fate/stay night anime, Fate/Zero, Fate/Grand Order, etc.)
2. **Given** I have multiple Saber outfits, **When** I view Saber character page, **Then** outfits display with version labels: "Armor (Fate/stay night anime)", "Casual Outfit (Fate/Grand Order)"
3. **Given** I'm sewing a costume, **When** I upload pattern file "Simplicity 8234.pdf" to outfit with notes "Lengthen bodice 2 inches, widen hips 1 inch", **Then** pattern and alterations display on outfit detail page
4. **Given** outfit requires construction work, **When** I add tasks "Cut fabric", "Sew bodice", "Attach armor plates" with due dates, **Then** tasks show with progress tracking
5. **Given** I made alterations during construction, **When** I add alteration notes "Added back zipper instead of lacing for easier wear", **Then** notes save for future reference
6. **Given** outfit is complete, **When** I review outfit detail page, **Then** I see complete construction record: patterns used, alterations made, time spent, total cost

---

### User Story 5 - Consolidated Resource Management (Priority: P2)

As a developer maintaining the system, I want this specification to supersede and consolidate character-related requirements from specs 045 and 047, establishing Character as the primary organizational entity with clear relationships to all resource types.

**Why this priority**: This spec refactors the resource management model from flat resource lists to character-centric organization. Clear specification prevents conflicting implementations and ensures consistent data model. Essential for technical clarity and future development.

**Independent Test**: Developer can review spec and understand complete data model (Character entity, relationships to all resources, enhanced wig/outfit schemas) without referencing other specs.

**Acceptance Scenarios**:

1. **Given** this spec is approved, **When** implementing character entity, **Then** all resource types (costume/outfit, wig, prop, accessory, equipment, location, crew) can optionally link to character
2. **Given** wigs are separated from accessories, **When** migrating existing data, **Then** wig records move from accessories table to dedicated wigs table with enhanced fields
3. **Given** character is organizational hub, **When** deleting a character, **Then** system automatically unlinks all resources (keeps resources, removes character association) with confirmation dialog showing count of affected resources
4. **Given** outfit versioning is added, **When** creating outfit, **Then** version field is required if character is linked (to prevent ambiguity)
5. **Given** resource linking is flexible, **When** creating resources, **Then** character link is always optional (some props/equipment aren't character-specific)

---

### Edge Cases

- What happens when user deletes a character that has linked resources? (Allow deletion with automatic unlinking; all resources kept with character association removed; show confirmation dialog with count of resources that will be unlinked)
- How does system handle multiple outfits with same character and version? (Allow duplicates with distinguishing names, e.g., "Saber Armor (V1 - first attempt)" and "Saber Armor (V2 - remake)")
- What happens when wig is used for multiple characters (generic blonde wig)? (Allow multi-character linking; wig shows on multiple character pages)
- How does system handle character name changes or alternate names? (Support aliases via comma-separated field; user enters "Saber, Artoria Pendragon, Altria Pendragon" in aliases field; search finds character by any alias)
- What happens when outfit version doesn't match predefined options? (Provide "Custom" option with text field for specific version description)
- How does system handle wigs in various completion states? (Support statuses: Planned, Ordered, Received, In Progress, Completed, Needs Restyling, Damaged; allow free transition between any statuses without restrictions)
- What happens when material requirements for wig change during styling? (Allow editing material list; track changes in notes)
- How does system handle costumes worn with different wigs? (Costume and wig are independently linked to character; outfit detail shows "typically worn with [wig name]" as suggestion, not requirement)
- What happens when character has no linked resources yet? (Show empty state with prompts to add costume, wig, props; character acts as planning placeholder)
- How does system handle series with many characters (e.g., Fate series with 50+ characters)? (Support series-based filtering; character search across series names)

## Requirements *(mandatory)*

### Functional Requirements

**Character Management:**
- **FR-001**: System MUST allow users to create, read, update, and delete character entries within their team
- **FR-002**: System MUST track character metadata: character name, series name, source medium (anime/manga/game/movie/TV/book/comic/stage/original), appearance description, personality notes, reference images (1-10 images)
- **FR-003**: System MUST support character aliases/alternate names via comma-separated text field for flexible searching (users enter aliases as "Saber, Artoria Pendragon, Altria Pendragon"; search finds character by any alias)
- **FR-004**: System MUST allow users to upload 1-10 reference images per character to Cloudflare R2 storage
- **FR-005**: System MUST display character detail page as hub showing all linked resources (costumes, wigs, props, accessories) with status indicators
- **FR-006**: System MUST calculate character completion percentage as: (number of completed resources / total linked resources) × 100, where completed means resource status is "Completed" or "Owned" or equivalent terminal state
- **FR-007**: System MUST allow users to filter characters by series, source medium, or completion status
- **FR-008**: System MUST support character search across name, series, and aliases with real-time filtering
- **FR-009**: System MUST allow character deletion with automatic resource unlinking (all linked resources kept with character association removed, no data loss)

**Wig Category (Separate from Accessories):**
- **FR-010**: System MUST provide dedicated Wigs page separate from accessories with wig-specific management
- **FR-011**: System MUST allow users to create, read, update, and delete wig entries within their team
- **FR-012**: System MUST track wig metadata: wig name, color, length (short/medium/long/extra-long), fiber type (synthetic/human-hair/blend), base wig brand/model, purchase cost, status (planned/ordered/received/in-progress/completed/needs-restyling/damaged) with free transition between any statuses
- **FR-013**: System MUST support optional character linking for wigs (one wig can link to multiple characters if reusable)
- **FR-014**: System MUST allow users to track wig styling tasks with title, description, due date, status (pending/in-progress/completed)
- **FR-015**: System MUST allow users to list material requirements for wigs (weft packs, dye, styling products, tools) with quantities and purchase status
- **FR-016**: System MUST calculate total wig cost: base wig cost + material costs
- **FR-017**: System MUST allow users to upload 1-10 progress photos per wig to Cloudflare R2 storage
- **FR-018**: System MUST track wig completion date and time spent when status changes to "Completed" using hybrid approach: automatic calculation from status change timestamps (elapsed time) with optional manual override field for users to enter actual hours worked
- **FR-019**: System MUST allow users to add styling notes and techniques to wig entries for future reference
- **FR-020**: System MUST display wig tasks on wig detail page with deadline countdown and overdue warnings

**Resource-to-Character Linking:**
- **FR-021**: System MUST allow linking costumes/outfits to characters (one costume to one character)
- **FR-022**: System MUST allow linking wigs to characters (one wig to multiple characters for reusable wigs)
- **FR-023**: System MUST allow linking props to characters (one prop to multiple characters for reusable props)
- **FR-024**: System MUST allow linking accessories to characters (one accessory to multiple characters)
- **FR-025**: System MUST display all linked resources on character detail page organized by type (Outfits, Wigs, Props, Accessories)
- **FR-026**: System MUST allow creating new resources directly from character detail page with character association pre-filled
- **FR-027**: System MUST allow filtering all resource views by linked character
- **FR-028**: System MUST show character name/thumbnail on resource cards throughout the application
- **FR-029**: System MUST allow unlinking resources from characters without deleting the resource
- **FR-030**: System MUST support resource reuse across multiple characters where appropriate (wigs, props, accessories)

**Enhanced Outfit/Costume Tracking:**
- **FR-031**: System MUST add version/variation field to outfit entries: text field specifying which adaptation or variation (e.g., "Fate/stay night Anime Episode 1", "Fate/Grand Order Summer Event", "Personal Redesign")
- **FR-032**: System MUST require version field when outfit is linked to a character (to prevent ambiguity)
- **FR-033**: System MUST allow version field to be optional when outfit is not character-linked (original designs)
- **FR-034**: System MUST allow users to upload pattern files (PDF, JPG, PNG up to 10MB) to outfit entries using Cloudflare R2 storage
- **FR-035**: System MUST track pattern metadata per outfit: pattern name, brand, pattern number, size used, purchase date, cost
- **FR-036**: System MUST allow users to add alteration notes to patterns (per pattern or general outfit alterations)
- **FR-037**: System MUST allow users to track outfit construction tasks with title, description, due date, status (pending/in-progress/completed)
- **FR-038**: System MUST display outfit tasks on outfit detail page with progress tracking
- **FR-039**: System MUST allow users to add general crafting notes to outfit entries (techniques used, fabric sources, lessons learned)
- **FR-040**: System MUST track outfit completion date and construction time when status changes to "Completed" using same hybrid approach as wigs: automatic calculation with optional manual override
- **FR-041**: System MUST display complete construction record on outfit detail page: patterns, alterations, tasks, notes, time, cost

**Cross-Resource Requirements:**
- **FR-042**: All new/modified resources (characters, wigs) MUST be scoped to teams
- **FR-043**: System MUST maintain consistent UI patterns across character, wig, and enhanced outfit pages
- **FR-044**: System MUST support real-time search across characters, wigs, and outfits with 300ms debouncing
- **FR-045**: System MUST enforce team permissions (only team members can view/edit team resources)
- **FR-046**: System MUST track creation date, last modified date, and created by user for characters and wigs
- **FR-047**: System MUST support exporting characters and wigs to CSV for backup/reporting
- **FR-048**: System MUST soft-delete characters and wigs (retain for 6 months, then permanently delete)
- **FR-049**: System MUST provide archive view for deleted characters and wigs within 6-month retention period
- **FR-050**: System MUST migrate existing wig records from accessories category to new wigs category during implementation

### Key Entities

- **Character**: Central organizational entity representing a character to cosplay. Contains character name, series, source medium, appearance description, personality notes, aliases, reference images (R2 URLs). Acts as hub for linking all related resources (costumes, wigs, props, accessories). Tracks completion percentage based on linked resources.

- **Wig**: Dedicated resource category for wig management (separated from accessories). Contains wig name, color, length, fiber type, base wig brand, character links (many-to-many), status, tasks, material requirements, costs, styling notes, progress photos (R2 URLs). Tracks completion and time spent.

- **Outfit/Costume (Enhanced)**: Existing costume entity with added fields: version/variation (required if character-linked), pattern files (R2 URLs), pattern metadata, alteration notes, construction tasks, crafting notes, completion tracking.

- **Character-Resource Link**: Junction entities linking characters to resources:
  - Character-Outfit: One-to-one (one outfit to one character)
  - Character-Wig: Many-to-many (wigs can be reused across characters)
  - Character-Prop: Many-to-many (props can be reused)
  - Character-Accessory: Many-to-many (accessories can be reused)

- **Wig Task**: Represents styling tasks for wigs with title, description, due date, status. Linked to specific wig.

- **Wig Material Requirement**: Represents materials needed for wig with name, quantity, cost, purchase status. Linked to specific wig.

- **Outfit Task**: Represents construction tasks for outfits with title, description, due date, status. Linked to specific outfit.

## Clarifications

### Session 2025-10-24

- Q: When user deletes a character with linked resources, should system prevent deletion or allow with automatic unlinking? → A: Allow deletion with automatic unlinking (resources kept, character link removed automatically)
- Q: How should character completion percentage be calculated from linked resources? → A: Simple count (percentage of total linked resources marked complete, regardless of resource type)
- Q: How should time spent on wigs be tracked? → A: Hybrid: optional manual entry with automatic fallback (system calculates elapsed time from creation/status changes, users can manually override with actual hours worked)
- Q: How should users add and manage character aliases/alternate names? → A: Comma-separated text field (single text field where users enter aliases separated by commas, e.g., "Saber, Artoria Pendragon, Altria Pendragon")
- Q: Should wig status transitions be restricted or allow free changes between any statuses? → A: Free transition (users can change to any status at any time without restrictions)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a character entry with series, name, and reference images in under 1 minute
- **SC-002**: Users can link an existing costume, wig, and prop to a character in under 30 seconds total
- **SC-003**: Users can create a wig entry with tasks and material requirements in under 2 minutes
- **SC-004**: Character detail page loads with all linked resources (10+ items) in under 2 seconds
- **SC-005**: 90% of users successfully navigate from character to linked resources and back on first attempt
- **SC-006**: Character completion percentage calculation is accurate within 1% and updates within 500ms of resource status change
- **SC-007**: Users can add outfit version and pattern files in under 1 minute
- **SC-008**: Wig task deadlines display accurate countdown and overdue warnings with zero errors
- **SC-009**: Search across characters, wigs, and outfits returns relevant results in under 500ms for collections with 100+ total items
- **SC-010**: Users report that character-centric organization reduces time to find resources by at least 40% compared to flat resource lists
- **SC-011**: Material cost tracking for wigs calculates total cost with zero calculation errors
- **SC-012**: Pattern file uploads (up to 5MB) complete in under 10 seconds
- **SC-013**: Character aliases/alternate names support finds characters 95%+ of the time when users search by any known name
- **SC-014**: Resource unlinking from characters completes without data loss in 100% of cases

## Assumptions

- Characters typically have 1-5 linked outfits, 1-3 wigs, 2-10 props, 3-15 accessories
- Most wigs are character-specific (80%), some are reusable across characters (20%)
- Users understand character version/variation context (which anime season, game, etc.)
- Wig styling tasks range from simple (3-5 tasks) to complex (15-20 tasks)
- Material requirements for wigs typically include 2-10 items
- Pattern files are primarily PDF (70%), with images (30%)
- Users manage 5-30 characters in brainstorming/planning state at any time
- Character reference images follow same constraints as other images (5MB limit, auto-compression)
- Character-to-resource linking is intuitive to cosplay community (common mental model)
- Most outfits have 1-5 pattern files

## Dependencies

- Team management system must be functional (all resources are team-scoped)
- User authentication and authorization must be working
- Cloudflare R2 storage integration for character reference images, wig progress photos, pattern files
- Database must support many-to-many relationships (character-wig, character-prop, character-accessory)
- Database must support one-to-one relationships (character-outfit)
- Database must support JSONB for character details, wig notes, outfit alterations
- Database must store R2 file URLs/paths for all images and pattern files
- Existing resource management UI patterns established in spec 045
- Migration scripts to move wig data from accessories to wigs table
- Search functionality requires full-text search capability across multiple entities
- File upload system with R2 backend (from spec 047)
- Task tracking system for wigs and outfits
- Cost calculation logic for wigs (base + materials)

## Out of Scope

- Automatic character recognition from uploaded reference images
- Character personality or appearance analysis/tagging (users manually enter descriptions)
- Wig styling tutorials or technique library (only personal notes)
- Pattern generation or automatic sizing calculations
- Integration with character databases (MyAnimeList, AniList) for character data import
- Social features (character wishlists, collaboration on characters)
- Calendar integration for wig/outfit task deadlines
- Automated material shopping lists with vendor links for wigs
- Version control for outfit patterns or alteration notes
- Cross-team character sharing or public character database
- Mobile app-specific features (photo capture from app for character references)
- Wig condition tracking over time (wear and tear, cleaning history)
- Outfit wear history (which events costume was worn to)
- Character popularity or trending suggestions

## Integration Notes

### 🔄 Consolidation Notice

**This specification supersedes and consolidates specs 045, 046, and 047 into a single, comprehensive resource management system.**

### What This Spec Consolidates

#### From Spec 045 (Resource Management System):
✅ **Retained & Enhanced:**
- Costumes/Outfits (enhanced with version, patterns, tasks, character linking)
- Props catalog (enhanced with character linking)
- Equipment inventory (maintained as-is)
- Crew directory (maintained as-is)
- Location library (maintained as-is)
- Lifecycle tracking for all resources (maintained as-is)

✅ **Refactored:**
- Accessories (maintained as separate category, enhanced with character linking)
- Wigs (separated from accessories into dedicated category with task/cost tracking)

#### From Spec 046 (Costume Accessories):
✅ **Fully Integrated:**
- Dedicated accessories management page (now with character linking)
- Makeup-specific tracking (expiration dates, usage levels, skin tone matching)
- Accessory-to-costume linking (now character-to-accessory linking)
- Maintenance schedules for accessories (integrated into new model)
- Usage history tracking (integrated into new model)

#### From Spec 047 (Resource Expansion):
✅ **Retained:**
- Standalone task management (general tasks page)
- Craft supplies and materials management (maintained as separate feature)
- Pattern storage (integrated into enhanced outfit entity)

✅ **Already Implemented (Retrospective Documentation):**
- Series autocomplete with external APIs (AniList, RAWG, TMDB, Google Books)
- Character autocomplete with autofill
- Source medium field (replacing costume type)
- Component linking (inline dropdowns for wigs/makeup/props/equipment)
- Photo uploads on costume detail pages
- Task checklists within costume pages
- Delete confirmation dialogs

### Key Architectural Changes

**From**: Flat resource lists (costumes, props, accessories managed separately)  
**To**: Character-centric model (character as organizational hub, resources link to characters)

**Before (Specs 045/046/047):**
```
Resources:
├── Costumes (flat list)
├── Props (flat list)
├── Accessories (flat list, includes wigs)
├── Makeup (flat list)
├── Equipment (flat list)
└── Locations (flat list)
```

**After (Spec 048):**
```
Characters (central hub):
└── Links to:
    ├── Outfits (1:1, with version/patterns/tasks)
    ├── Wigs (M:N, dedicated category with tasks/materials/cost)
    ├── Props (M:N, character-linkable)
    ├── Accessories (M:N, character-linkable)
    └── Makeup (M:N, character-linkable)

Standalone Resources (not character-specific):
├── Equipment
├── Locations
├── Crew
├── Tasks (general)
└── Craft Supplies
```

### Data Model Changes

**New Tables:**
- `characters` - Central organizational entity
- `wigs` - Dedicated wig category (migrated from accessories)
- `wig_tasks` - Task tracking for wigs
- `wig_materials` - Material requirements for wigs
- `outfit_tasks` - Construction tasks for outfits (if not already exists)
- `character_wigs` - Junction table (many-to-many)
- `character_props` - Junction table (many-to-many)
- `character_accessories` - Junction table (many-to-many)
- `character_costumes` - Junction table (one-to-one, but using junction for consistency)

**Enhanced Tables:**
- `costumes` → Add: `version`, `pattern_files_r2_urls`, `alteration_notes`, `crafting_notes`, `character_id` (nullable)
- `props` → Add: `character_id` (nullable, via junction)
- `accessories` → Add: `character_id` (nullable, via junction)

**Maintained Tables (from 045/047):**
- `equipment` (no changes)
- `locations` (no changes)
- `crew` (no changes)
- `tasks` (standalone tasks from 047)
- `craft_supplies` (from 047)

### Migration Strategy

**Phase 1: Data Model Setup**
1. Create `characters` table
2. Create `wigs` table with enhanced fields
3. Create junction tables for character-resource linking
4. Add version/pattern fields to `costumes` table

**Phase 2: Data Migration**
1. Identify existing accessories marked as "wig" type
2. Migrate wig records to new `wigs` table
3. Update references in other tables
4. Preserve all existing data (zero data loss)

**Phase 3: UI Updates**
1. Create Characters page (list and detail views)
2. Create Wigs page (separate from accessories)
3. Update Costumes page with version/pattern fields
4. Add character linking UI to all compatible resources
5. Maintain backward compatibility (resource pages work without character context)

**Phase 4: Feature Enhancements**
1. Implement character-centric navigation
2. Add character completion percentage calculation
3. Implement wig task tracking
4. Implement outfit task tracking
5. Add pattern file upload with R2 storage

**Phase 5: Integration & Polish**
1. Ensure all resource types can link to characters
2. Test character deletion with unlinking
3. Verify search and filtering across new model
4. Update documentation and help text
5. Performance optimization for character detail pages

### Backward Compatibility

- Direct resource access maintained (costume/prop/accessory pages still work independently)
- Character linking is optional (resources can exist without character association)
- Existing resources continue to function (no breaking changes)
- Users can gradually adopt character-centric workflow
