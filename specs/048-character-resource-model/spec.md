# Feature Specification: Comprehensive Resource Management System (Character-Centric Model)

> ✅ **SINGLE SOURCE OF TRUTH FOR RESOURCE MANAGEMENT**  
> This specification consolidates and supersedes specs 045, 046, and 047.  
> It provides a unified, character-centric approach to managing all cosplay resources (characters, outfits, wigs, props, accessories, makeup, equipment, locations, crew, tasks, and craft supplies).  
> **All future resource management development should reference THIS spec.**

**Feature Branch**: `048-character-resource-model`  
**Created**: October 24, 2025  
**Status**: **Active** (Consolidated from specs 045, 046, 047)  
**Consolidation Date**: October 24, 2025  
**Original Input**: User description: "I want to update the spec to clarify that wigs will be their own category. Wigs, as well as accessories and props and outfit, can be linked to a character. I also want a specific character section useful for when brainstorming ideas for new cosplay. Wigs will be able to track tasks for completion, due date, material requirements, and cost. Character will track the series and character name and relevant details about the character. The outfit (costume) section will be update to be what version of the character (video game, manga, anime, movie, tv show, etc.) as well as saving patterns, alteration notes, tasks, and other details for crafting a cosplay outfit"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Character Brainstorming Hub (Priority: P1)

As a cosplayer planning future projects, I want a dedicated character section where I can collect and organize character ideas with their series, appearance details, and reference notes so that I can evaluate which characters to cosplay and use them as a central hub for all related resources.

**Why this priority**: Character is the fundamental organizing principle for cosplay. Before creating outfits, wigs, or props, cosplayers research characters and gather references. This entity becomes the hub that all resources (outfits, wigs, props, accessories) link to, enabling character-centric planning and organization.

**Independent Test**: User can create character entries with series, character name, appearance details, and notes, browse character collection, and use characters as reference without creating any outfits/wigs yet.

**Acceptance Scenarios**:

1. **Given** I'm researching cosplay ideas, **When** I navigate to Characters page and click "Add Character", **Then** I see a form for character name, aliases (comma-separated), series, source medium, appearance details, personality notes, and reference images
2. **Given** I want to cosplay Saber from Fate/stay night, **When** I create character entry with series "Fate/stay night", name "Saber (Artoria Pendragon)", and appearance notes "blonde hair, green eyes, armor with blue and silver", **Then** character displays in my collection with all details
3. **Given** I have 15 character ideas, **When** I filter by series "Fate" or source medium "Anime", **Then** matching characters display
4. **Given** I'm planning which character to cosplay next, **When** I view character detail page, **Then** I see linked resources (outfits, wigs, props) and can add new ones from this central hub
5. **Given** I'm gathering inspiration, **When** I upload reference images to character entry, **Then** images display in character gallery for future reference

---

### User Story 2 - Wigs as Independent Resource Category (Priority: P1)

As a cosplayer who creates and styles wigs, I want wigs to be a separate resource category (not under accessories) with task tracking, material requirements, due dates, and cost tracking so that I can manage wig projects with the same detail as outfits and props.

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

As a cosplayer managing multiple character cosplays, I want to link outfits, wigs, props, and accessories to their associated characters so that I can see all resources for a character in one place and understand which characters have incomplete resource sets.

**Why this priority**: Cosplayers often juggle multiple characters with varying completion states. Character-centric organization (all Saber resources in one view) is more intuitive than resource-centric organization (all outfits listed separately, then all wigs). This enables better planning, prevents duplicate resources, and shows completion status per character.

**Independent Test**: User can link existing or new resources (outfits, wigs, props, accessories) to characters, view all resources for a character on character detail page, and see resource completion status per character.

**Acceptance Scenarios**:

1. **Given** I have a character "Saber" and existing outfit, **When** I open Saber's detail page and click "Link Outfit", **Then** I see list of my outfits with option to link existing or create new
2. **Given** I'm viewing Saber character page, **When** I link outfit "Saber Armor", wig "Saber Blonde Wig", and prop "Excalibur Sword", **Then** all resources display under Saber with status badges (completed/in-progress/planned)
3. **Given** I'm planning a new character, **When** I create character and immediately add resources, **Then** resources are created with character association automatically set
4. **Given** I have props/accessories for multiple characters, **When** I link prop "Generic Katana" to both "Character A" and "Character B", **Then** prop shows on both character pages (reusable resources)
5. **Given** I'm reviewing character completion, **When** I view character list, **Then** each character shows completion percentage calculated as (completed resources / total resources) × 100 (e.g., "Saber: 75% (3 of 4 complete)")
6. **Given** I want to see all resources for a shoot, **When** I filter resources by character "Saber", **Then** all linked outfits, wigs, props, accessories display together

---

### User Story 4 - Enhanced Outfit Tracking with Version/Variation (Priority: P2)

As a cosplayer who creates multiple versions of the same character, I want outfit entries to specify which version/adaptation (video game, manga, anime, movie, TV show, stage, original) and track patterns, alteration notes, and crafting tasks so that I can distinguish between versions and maintain detailed construction records.

**Why this priority**: Many characters have multiple canon appearances (Saber has 10+ outfit variations across Fate series). Specifying version prevents confusion ("Which Saber outfit?") and enables better organization. Enhanced tracking (patterns, alterations, tasks) supports the sewing/crafting workflow central to outfit creation.

**Independent Test**: User can create outfit entries with version specification, upload/link patterns, add alteration notes, track crafting tasks with due dates, and view construction history independently.

**Acceptance Scenarios**:

1. **Given** I'm creating an outfit for Saber, **When** I click "Add Outfit" from Saber character page, **Then** I see form with character pre-filled, plus version field (Fate/stay night anime, Fate/Zero, Fate/Grand Order, etc.)
2. **Given** I have multiple Saber outfits, **When** I view Saber character page, **Then** outfits display with version labels: "Armor (Fate/stay night anime)", "Casual Outfit (Fate/Grand Order)"
3. **Given** I'm sewing an outfit, **When** I upload pattern file "Simplicity 8234.pdf" to outfit with notes "Lengthen bodice 2 inches, widen hips 1 inch", **Then** pattern and alterations display on outfit detail page
4. **Given** outfit requires construction work, **When** I add tasks "Cut fabric", "Sew bodice", "Attach armor plates" with due dates, **Then** tasks show with progress tracking
5. **Given** I made alterations during construction, **When** I add alteration notes "Added back zipper instead of lacing for easier wear", **Then** notes save for future reference
6. **Given** outfit is complete, **When** I review outfit detail page, **Then** I see complete construction record: patterns used, alterations made, time spent, total cost

---

### User Story 5 - Consolidated Resource Management (Priority: P2)

As a developer maintaining the system, I want this specification to supersede and consolidate character-related requirements from specs 045 and 047, establishing Character as the primary organizational entity with clear relationships to all resource types.

**Why this priority**: This spec refactors the resource management model from flat resource lists to character-centric organization. Clear specification prevents conflicting implementations and ensures consistent data model. Essential for technical clarity and future development.

**Independent Test**: Developer can review spec and understand complete data model (Character entity, relationships to all resources, enhanced wig/outfit schemas) without referencing other specs.

**Acceptance Scenarios**:

1. **Given** this spec is approved, **When** implementing character entity, **Then** all resource types (outfit, wig, prop, accessory, equipment, location, crew) can optionally link to character
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
- How does system handle outfits worn with different wigs? (Outfit and wig are independently linked to character; outfit detail shows "typically worn with [wig name]" as suggestion, not requirement)
- What happens when character has no linked resources yet? (Show empty state with prompts to add outfit, wig, props; character acts as planning placeholder)
- How does system handle series with many characters (e.g., Fate series with 50+ characters)? (Support series-based filtering; character search across series names)
- What happens when file upload to R2 fails during character/wig/outfit creation? (System attempts 3 retries with exponential backoff; if all fail, save resource as draft without images/files and notify user with retry option)
- How does system handle partial upload failures (e.g., 3 of 5 images succeed)? (Successfully uploaded files are kept; failed files can be retried individually without re-uploading successful ones)
- What happens when two team members edit the same character/wig/outfit simultaneously? (Last save wins; user who saves second sees notification: "Your changes saved (overwrote changes by [User] from X minutes ago)")

## Requirements *(mandatory)*

### Functional Requirements

**Character Management:**
- **FR-001**: System MUST allow users to create, read, update, and delete character entries within their team
- **FR-001a**: System MUST warn users when creating a character with duplicate series+name combination and require explicit confirmation to proceed (prevents accidental duplicates while allowing intentional versions)
- **FR-002**: System MUST track character metadata: character name, series name, source medium (anime/manga/game/movie/TV/book/comic/stage/original), appearance description, personality notes, reference images (1-10 images)
- **FR-003**: System MUST support character aliases/alternate names via comma-separated text field for flexible searching (users enter aliases as "Saber, Artoria Pendragon, Altria Pendragon"; search finds character by any alias)
- **FR-004**: System MUST allow users to upload 1-10 reference images per character to Cloudflare R2 storage
- **FR-004a**: System MUST allow users to add reference links with structured metadata: link type (Tutorial, Pattern Source, Inspiration, Commission Example), URL, title, and notes; support unlimited reference links per character
- **FR-005**: System MUST display character detail page as hub showing all linked resources (outfits, wigs, props, accessories) with status indicators
- **FR-005a**: System MUST support dual-mode budget tracking per character: "Personal" mode (set budget limit, track estimated vs actual costs, warn at 80% and 100%) and "Commission" mode (track billable hours, material costs, markup percentage for generating client quotes)
- **FR-005b**: System MUST automatically aggregate costs from all linked resources (outfits, wigs, props, accessories, materials) and display total actual cost vs budget/estimate
- **FR-006**: System MUST calculate character completion percentage as: (number of completed resources / total linked resources) × 100, where completed means resource status is "Completed" or "Owned" or equivalent terminal state
- **FR-007**: System MUST allow users to filter characters by series, source medium, or completion status
- **FR-008**: System MUST support character search across name, series, and aliases with real-time filtering
- **FR-009**: System MUST allow character deletion with automatic resource unlinking (all linked resources kept with character association removed, no data loss)

**Wig Management (Separate from Accessories):**
- **FR-010**: System MUST provide dedicated Wigs page separate from accessories with wig-specific management
- **FR-011**: System MUST allow users to create, read, update, and delete wig entries within their team
- **FR-012**: System MUST track wig metadata: wig name, color, length (short/medium/long/extra-long), fiber type (synthetic/human-hair/blend), base wig brand/model, status (planned/ordered/received/in-progress/completed/needs-restyling/damaged) with free transition between any statuses
- **FR-013**: System MUST support many-to-many character linking for wigs: one wig can link to multiple characters if reusable (e.g., "Long silver wig" used for Saber, Weiss, Altria)
- **FR-014**: System MUST allow users to track wig styling tasks with title, description, due date, status (pending/in-progress/completed)
- **FR-015**: System MUST allow linking materials to wigs for styling supplies (wefts, dye, styling products) with quantities and costs via material-resource allocation table (FR-079)
- **FR-016**: System MUST calculate total wig cost: base wig cost + allocated material costs (from FR-079)
- **FR-017**: System MUST allow users to upload 1-10 progress photos per wig to Cloudflare R2 storage
- **FR-018**: System MUST track wig completion date and time spent using hybrid approach: automatic calculation from status change timestamps with optional manual override
- **FR-019**: System MUST allow users to add styling notes and techniques to wig entries for future reference
- **FR-020**: System MUST display wig tasks on wig detail page with deadline countdown and overdue warnings
- **FR-020a**: System MUST track wig condition: dropdown (Pristine, Good, Needs Care, Damaged) for maintenance awareness
- **FR-020b**: System MUST track wig maintenance: last washed date (optional), maintenance notes (free text), repair history (notes field)
- **FR-020c**: System MUST track wig storage: storage location (text field), storage method (text field) for organization
- **FR-020d**: System MUST track wig source and commissioning: source type dropdown (Retailer, Commission, Marketplace, Self-Styled), vendor/creator link, base wig cost, styling cost, overall cost (single field), styling credits (text)
- **FR-020e**: System MUST support post-event care reminders: after event ends, remind user to wash/maintain wigs linked to that event with optional link to wig care tutorial

**Resource-to-Character Linking:**
- **FR-021**: System MUST allow linking outfits to characters (one outfit to one character)
- **FR-022**: System MUST allow linking wigs to characters (one wig to multiple characters for reusable wigs)
- **FR-023**: System MUST allow linking props to characters (one prop to multiple characters for reusable props)
- **FR-024**: System MUST allow linking accessories to characters (one accessory to multiple characters)
- **FR-025**: System MUST display all linked resources on character detail page organized by type (Outfits, Wigs, Props, Accessories)
- **FR-026**: System MUST allow creating new resources directly from character detail page with character association pre-filled
- **FR-027**: System MUST allow filtering all resource views by linked character
- **FR-028**: System MUST show character name/thumbnail on resource cards throughout the application
- **FR-029**: System MUST allow unlinking resources from characters without deleting the resource
- **FR-030**: System MUST support resource reuse across multiple characters where appropriate (wigs, props, accessories)

**Enhanced Outfit Tracking:**
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
- **FR-041a**: System MUST track detailed outfit cost breakdown: base outfit cost (if purchased), material costs (fabric, notions, zippers), pattern costs, commission fees (if applicable), and total cost; costs aggregated into character budget (FR-005b) for insurance documentation and historical cost tracking over time

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
- **FR-051**: System MUST handle Cloudflare R2 upload failures with retry strategy: attempt 3 retries with exponential backoff (1s, 2s, 4s); if all fail, save resource as draft without uploaded files and display user-friendly error with option to retry upload later
- **FR-052**: System MUST use last-write-wins strategy for concurrent edits; when saving changes, system MUST check if resource was modified since user loaded it and display toast notification showing who made the previous change and when (e.g., "Your changes saved (overwrote changes by Alice from 2 minutes ago)")
- **FR-053**: System MUST enforce soft scalability limits per team: 500 characters maximum, 200 wigs maximum, 1000 total resources maximum; display warning when approaching limits (90%) and prevent creation at limits with user-friendly message

**Event/Convention Management:**
- **FR-054**: System MUST allow users to create, read, update, and delete event entries (conventions, photoshoots, competitions) within their team
- **FR-055**: System MUST track event metadata: event name, type (convention/photoshoot/competition/other), start date, end date, location, notes, and event URL
- **FR-056**: System MUST allow linking multiple characters to an event (many-to-many relationship)
- **FR-057**: System MUST display event dashboard showing all linked characters with their completion status and days remaining until event
- **FR-058**: System MUST calculate event readiness: percentage of linked characters that are complete/ready
- **FR-059**: System MUST show countdown to event on character detail pages when character is linked to upcoming events
- **FR-060**: System MUST allow filtering characters by linked event to see "all characters for Anime Expo 2026"
- **Note**: Advanced event logistics (packing checklists, weather forecasts, backup locations, transportation planning) are covered in spec 051 (Convention Logistics)

**Vendor/Shop Management:**
- **FR-061**: System MUST allow users to create, read, update, and delete vendor/shop entries within their team
- **FR-062**: System MUST track vendor metadata: vendor name, website URL, contact email, phone, category (fabric/foam/wig/prop/pattern/general), rating (1-5 stars), and notes
- **FR-063**: System MUST allow linking resources (outfits, wigs, props, accessories, craft supplies) to vendors when purchased
- **FR-064**: System MUST track purchase details per resource-vendor link: purchase date, order number, cost, and purchase-specific notes
- **FR-065**: System MUST display vendor detail page showing all purchases from that vendor with total spent and average rating-per-purchase
- **FR-066**: System MUST allow users to rate individual purchases from a vendor (separate from overall vendor rating)
- **FR-067**: System MUST allow filtering resources by vendor to see "everything I bought from Arda Wigs"

**Difficulty/Skill Assessment:**
- **FR-068**: System MUST calculate suggested difficulty (1-5) for characters based on objective factors: number of linked resources, total task count, presence of complex materials (worbla/thermoplastics), wig styling complexity
- **FR-069**: System MUST allow users to override suggested difficulty with their own rating (1-5) based on personal skill level
- **FR-070**: System MUST support optional skill challenge tags per character: "Complex Sewing", "Advanced Foam Work", "Intricate Wig Styling", "Armor Crafting", "Electronics/LEDs", "Painting/Weathering", "Pattern Drafting", "Custom"
- **FR-071**: System MUST display both system-suggested and user-set difficulty ratings to help users learn which types of projects they find challenging
- **FR-072**: System MUST allow filtering characters by difficulty rating and skill tags to find appropriate next projects

**Materials / Craft Supplies Management:**
- **FR-073**: System MUST support dual-mode material management: "Shopping List" (planning phase) and "Inventory" (owned materials)
- **FR-074**: System MUST allow users to create shopping list entries for materials needed with: material name, category, quantity needed, unit of measure, estimated cost, priority (high/medium/low), and notes
- **FR-075**: System MUST provide "Mark as Purchased" action on shopping list items that moves item to inventory with actual purchase details: actual cost, purchase date, vendor link, quantity purchased
- **FR-076**: System MUST allow users to create inventory entries directly (for materials already owned or donated)
- **FR-077**: System MUST categorize materials by type dropdown: Fabrics, Foam, Paints & Finishes, Adhesives, Hardware (zippers/snaps/velcro/elastic), Wig Supplies, Thermoplastics (Worbla/Thibra), Electronics (LEDs/batteries/wiring), 3D Printing Filament, Other
- **FR-078**: System MUST track material consumption with: starting quantity, current quantity, unit of measure (yards, meters, sheets, bottles, pieces, kg, etc.), and manual deduction support
- **FR-079**: System MUST support per-project material allocation: link materials to characters/outfits with quantity used and cost allocated (e.g., "Saber outfit used 2 yards of black satin = $10 allocated")
- **FR-080**: System MUST track material metadata: material name, category, color/variant, brand, purchase cost, cost per unit (auto-calculated: total cost / quantity), vendor link, purchase date, storage location (optional text field), and notes
- **FR-081**: System MUST aggregate material costs per character: sum all allocated material costs from linked resources to show total materials spent on that character
- **FR-082**: System MUST support linking materials to tools (optional): materials can specify which tool they're supplies for (e.g., "Thread Spool #3 → Brother Sewing Machine", "Glue sticks → Glue Gun #2")
- **FR-083**: System MUST allow uploading 1-5 reference photos per material entry to Cloudflare R2 (for visual identification, color matching, texture reference)
- **FR-084**: System MUST warn users when material inventory is low: display "Low Stock" badge when current quantity < 20% of starting quantity
- **FR-085**: System MUST support filtering materials by: category, in-stock vs out-of-stock, linked character, linked tool, vendor, and storage location
- **FR-086**: System MUST calculate total inventory value: sum of all materials' current quantity × cost per unit
- **FR-087**: System MUST support bulk actions on shopping list: mark multiple items as purchased, delete multiple items, export to PDF for store visit

**Tools Management (Cosplay Creation Tools):**
- **FR-088**: System MUST allow users to create, read, update, and delete tool entries within their team (separate from Equipment which is for photography gear)
- **FR-089**: System MUST track tool metadata: tool name, tool type dropdown (Sewing Machine, Heat Gun, Dremel/Rotary Tool, Airbrush, 3D Printer, Cutting Mat, Iron/Heat Press, Mannequin/Dress Form, Other), brand, model, serial number
- **FR-090**: System MUST track tool condition: dropdown (Excellent, Good, Fair, Poor, Needs Repair) with visual indicators
- **FR-091**: System MUST track tool ownership status: dropdown (Owned, Rented, Borrowed, Loaned Out) with optional "borrowed from" or "loaned to" text field
- **FR-092**: System MUST track tool purchase details: purchase date, purchase cost, vendor link (to Vendors table), receipt upload (to R2), warranty expiration date
- **FR-093**: System MUST support uploading 1-5 reference photos per tool to Cloudflare R2 (for identification, documentation, insurance)
- **FR-094**: System MUST track tool storage location (optional text field): "Workshop shelf A", "Closet bin 3", "Stored at friend's studio"
- **FR-095**: System MUST support maintenance tracking Phase 1 (MVP): maintenance notes (free text), last serviced date, next service due date
- **FR-096**: System MUST display linked supplies on tool detail page: show all materials linked to this tool (from FR-082) with current stock levels (e.g., "Thread: 5 spools, Glue sticks: 30, Bobbins: 12")
- **FR-097**: System MUST warn when tool-linked supplies are low: if material linked to tool is below 20% stock, show warning on tool detail page "Low on thread - restock soon"
- **FR-098**: System MUST support tool notes: free text for usage tips, settings, troubleshooting, project history
- **FR-099**: System MUST allow filtering tools by: type, condition, ownership status, vendor, and has linked supplies
- **FR-100**: System MUST calculate total tool inventory value: sum of all owned tools' purchase costs

**Tool Maintenance (Phase 2 - Future Enhancement):**
- **FR-101**: System SHOULD support full maintenance log table (defer to Phase 2): structured history with maintenance date, type (cleaning/repair/calibration), cost, performed by, notes
- **FR-102**: System SHOULD send maintenance reminders (defer to Phase 2): notify user when next service due date approaches (7 days before, 1 day before)

**Accessories Management (Style/Appearance Items):**
- **FR-103**: System MUST allow users to create, read, update, and delete accessory entries within their team
- **FR-104**: System MUST track accessory metadata: accessory name, category dropdown (Jewelry, Belts & Sashes, Bags & Pouches, Footwear, Headpieces, Gloves, Small Armor, Scarves & Capes, Eyewear, Other), description
- **FR-105**: System MUST support many-to-many character linking for accessories: one accessory can link to multiple characters if reusable
- **FR-106**: System MUST allow tracking accessory construction tasks with title, description, due date, status (pending/in-progress/completed) for made accessories
- **FR-107**: System MUST allow linking materials to accessories for crafting (foam, paint, fabric) with quantities and costs via material-resource allocation table (FR-079)
- **FR-108**: System MUST allow uploading 1-10 progress photos per accessory to Cloudflare R2 storage
- **FR-109**: System MUST support construction notes: free text for techniques, weathering, lessons learned
- **FR-110**: System MUST track accessory status: dropdown (Idea, Planning, In Progress, On Hold, Needs Repair, Ready for Use, Retired) with free status transitions
- **FR-111**: System MUST track accessory cost breakdown: total cost, allocated material costs (from FR-079), purchase/commission cost
- **FR-112**: System MUST track accessory ownership status: dropdown (Owned, Need to Buy, Borrowed, On Loan) with optional "from/to" text field for tracking who
- **FR-113**: System MUST track accessory origin: source type dropdown (Self-Made, Purchased-Retailer, Commissioned, Marketplace, Borrowed), vendor/creator link, purchase details
- **FR-114**: System MUST support uploading receipts for purchased accessories to Cloudflare R2
- **FR-115**: System MUST calculate accessory completion date and construction time using hybrid approach (automatic + manual override)

**Enhanced Props Management (Functional/Tool Items):**
- **FR-116**: System MUST migrate props from text character_series field to character FK (many-to-many relationship) for consistency with other resources
- **FR-117**: System MUST allow linking materials to props for construction with quantities and costs via material-resource allocation table (FR-079)
- **FR-118**: System MUST allow tracking prop construction tasks with title, description, due date, status (parallel to accessories)
- **FR-119**: System MUST allow uploading 1-10 progress photos per prop to Cloudflare R2 storage (leverage existing resource_photos table)
- **FR-120**: System MUST track prop ownership status: dropdown (Owned, Need to Buy, Borrowed, On Loan) parallel to accessories
- **FR-121**: System MUST track prop origin: source type dropdown (Self-Made, Purchased-Retailer, Commissioned, Marketplace, Borrowed), vendor/creator link
- **FR-122**: System MUST support uploading receipts for purchased props to Cloudflare R2
- **FR-123**: System MUST track prop cost breakdown: total cost, allocated material costs, purchase/commission cost
- **FR-124**: System MUST support prop construction notes for techniques and lessons learned

**Enhanced Equipment Management (Photography Gear):**
- **FR-125**: System MUST allow uploading 1-5 reference photos per equipment item to Cloudflare R2 (for identification, insurance documentation)
- **FR-126**: System MUST support linking equipment to vendors via vendor_id FK for purchase tracking
- **FR-127**: System MUST support uploading equipment purchase receipts to Cloudflare R2
- **FR-128**: System MUST track equipment maintenance: Phase 1 MVP uses maintenance notes (free text), last serviced date; Phase 2 adds full maintenance log
- **FR-129**: System MUST track equipment warranty: warranty expiration date field for tracking coverage
- **FR-130**: Equipment detail page MUST display purchase history, maintenance notes, and vendor information

**Enhanced Crew Management:**
- **FR-131**: System MUST allow uploading 1 profile photo per crew member to Cloudflare R2 (for identification, roster visualization)
- **FR-132**: System MUST track crew rate history: table linking crew member to events with rate paid, rate type (hourly/daily/project/flat), booking source (text), booking URL, event date, notes
- **FR-133**: System MUST display rate history on crew detail page showing previous bookings and rates for budget planning
- **FR-134**: Crew-to-Vendor linking and marketplace availability DEFERRED to future marketplace feature (separate spec)

**Enhanced Locations Management:**
- **FR-135**: System MUST allow uploading 1-10 reference photos per location to Cloudflare R2 (for location scouting, reference, previous shoots)
- **FR-136**: System MUST track location costs: table linking location to cost types (rental_hourly, rental_daily, permit, deposit) with amount, currency, minimum duration, website URL, notes
- **FR-137**: System MUST display cost information on location detail page with links to booking/permit websites
- **FR-138**: System MUST track location restrictions: free text notes field for rules, hours, prohibitions, requirements
- **FR-139**: System MUST integrate with weather forecasting (from spec 051): display weather forecast for upcoming events at this location, send warnings if bad weather predicted
- **FR-140**: System MUST allow dismissing weather warnings: user can acknowledge and proceed despite warning if weather is desired or acceptable

**Enhanced Vendor Management:**
- **FR-141**: System MUST support uploading receipts/invoices per purchase to Cloudflare R2: link receipt to resource-vendor purchase record (FR-064)
- **FR-142**: Vendor detail page MUST display all receipts uploaded for purchases from that vendor with download capability

**Universal Receipt/Invoice Management:**
- **FR-143**: System MUST provide universal Receipts table linking to all resource types (outfits, wigs, accessories, props, equipment, tools, materials) with: resource type, resource ID, vendor ID, R2 storage path, file type (pdf/jpg/png), purchase date, total cost, order number, notes
- **FR-144**: All resource detail pages with purchases MUST display associated receipts with download/view capability
- **FR-145**: Receipt uploads MUST support PDF, JPG, PNG formats up to 10MB per file

**Post-Event Care Reminders:**
- **FR-146**: After event ends, system MUST remind users to wash/clean resources used in event: wigs, outfits, accessories linked to event with care tutorial links
- **FR-147**: Post-event reminders MUST be dismissible: user can mark as done or snooze for later
- **FR-148**: System MUST track last cleaned/maintained date per resource for future care scheduling

**UI/UX Requirements (Information Architecture & Layout):**
- **FR-149**: System MUST implement mobile-first responsive design for all resource pages: touch-friendly targets (44px minimum), collapsible sections, bottom navigation, swipe gestures
- **FR-150**: Character detail page MUST use FULL-PAGE hub layout (exception to flyout pattern): character summary card at top, linked resources grouped by type below (Outfits, Wigs, Props, Accessories), progress indicators prominent, budget summary visible. Rationale: Characters serve as dashboards with too much content for flyout
- **FR-151**: All resource overview pages MUST use card-based layouts with consistent information density: primary image/photo, title, status badge, key metadata (cost, linked character, completion %), action buttons. Click card opens flyout panel
- **FR-152**: All resource detail pages (Wigs, Props, Equipment, Outfits, Crew, Locations, Accessories) MUST use FLYOUT PANEL pattern: slides from right (600px width), overview remains visible with blurred backdrop, expandable to fullscreen via toggle button, dismissible via ESC/click-outside/close button
- **FR-152a**: Flyout panel MUST contain: header (resource name + status + expand/share/menu buttons), metadata section (status, due date, assignee, tags, budget in 2×2 grid), description section (inline-editable textarea), attachments section (photo grid with upload), tabbed content (Tasks, Comments, Linked Resources, Activity History)
- **FR-152b**: Flyout expand mode MUST fill entire content area (minus sidebar): wider content for deep work, larger photo previews, expanded task list, more breathing room. Toggle button switches between collapsed (600px) and expanded (fullscreen) states with smooth 250ms animation
- **FR-153**: Material allocation UI MUST use inline modal pattern: click "Add Material" → centered modal (max 600px) with search + quantity input + cost calculation → preview before save → update character budget in real-time. Modal appears over flyout panel
- **FR-154**: Budget display MUST adapt to mode: Personal mode shows progress bar (spent vs limit with 80%/100% warnings), Commission mode shows cost breakdown table (materials + labor + markup = quote)
- **FR-155**: Photo galleries MUST support 1-10 photos with: primary photo display, thumbnail strip, lightbox view, drag-to-reorder, upload progress indicators, compression warnings (>5MB)
- **FR-156**: Task lists MUST use checkbox pattern with: drag-to-reorder, due date badges (overdue in red, due soon in yellow), progress bar (X of Y complete), quick-add input at bottom
- **FR-157**: Search/filter controls MUST use faceted search pattern: search input with debounce (300ms), filter chips (dismissible), saved filter presets, result count display, clear all action
- **FR-158**: Data tables (materials inventory, purchase history, rate history) MUST be responsive: card layout on mobile (<768px), table on desktop, sortable columns, pagination (25/50/100 per page)

**UI/UX Requirements (Progressive Disclosure & Visual Hierarchy):**
- **FR-159**: System MUST use progressive disclosure to reduce overwhelm: summary cards show 3-5 key fields, "Show More" expands to full details, advanced features hidden behind "Advanced" section
- **FR-160**: Character detail MUST prioritize by user goal: completion percentage and next actions at top, detailed resource lists below fold, budget/events in sidebar (desktop) or tabs (mobile)
- **FR-161**: Resource creation flows MUST use smart defaults: pre-fill character link from context, default status to "Planned", optional fields collapsed initially, "Quick Create" vs "Full Form" options
- **FR-162**: Complex forms (outfit with patterns, wig with styling) MUST use stepped progression: Basic Info → Photos → Tasks → Materials → Review, save draft at any step, progress indicator
- **FR-163**: Linked resource pickers (character linking, material allocation) MUST show contextual previews: thumbnail + name + key stat (e.g., "Black Satin - 3 yards available"), recent items first
- **FR-164**: Empty states MUST guide action: illustration + descriptive text + primary action button (e.g., "No wigs yet → Get started with your first wig"), tutorial links for complex features
- **FR-165**: Status indicators MUST use consistent color system: success (green), warning (yellow), error (red), info (blue), neutral (gray), with icons for accessibility

**UI/UX Requirements (Mobile & Touch Patterns):**
- **FR-166**: Navigation MUST adapt to screen size: desktop uses sidebar (collapsible sections per spec 041), mobile uses bottom tab bar (5 primary tabs) + hamburger menu (secondary items)
- **FR-167**: Swipe gestures MUST be supported on mobile: swipe card left for quick actions (edit, delete), swipe right to mark complete, swipe down to refresh lists, pinch to zoom photos, swipe right on flyout to dismiss
- **FR-168**: Touch targets MUST meet accessibility standards: 44×44px minimum, 8px spacing between targets, visual feedback on touch (ripple or scale), error tolerance for fat fingers
- **FR-169**: Long-press MUST trigger contextual actions: long-press card for quick menu (edit, duplicate, delete, share), long-press photo for download/delete, long-press text for copy
- **FR-170**: Flyout panels MUST be mobile-optimized: always fullscreen on mobile (<768px), slide up animation from bottom, swipe-down to dismiss (with threshold), back button top-left returns to overview, tabs sticky at bottom with swipe-up to expand, body scroll locked when flyout open
- **FR-170a**: Inline modals MUST be mobile-friendly: full-screen on mobile (<768px), slide up animation, swipe-down to dismiss, close button top-right, actions bottom (fixed bar), appear over flyout panels when necessary

**UI/UX Requirements (Performance & Feedback):**
- **FR-171**: Loading states MUST provide feedback: skeleton screens for lists (shimmer effect), progress bars for uploads, spinner for mutations, optimistic updates where safe (task checkbox)
- **FR-172**: Error states MUST be actionable: error message with explanation, retry button, fallback action (e.g., "Upload failed → Save draft and retry later"), error log for debugging
- **FR-173**: Success feedback MUST be subtle: toast notifications (3s auto-dismiss), success checkmark animation, updated data reflects immediately, undo option for destructive actions (5s window)
- **FR-174**: Offline support MUST degrade gracefully: cached data displays with "Offline" badge, mutations queue for sync, critical features work offline (view, task checkbox), sync indicator
- **FR-175**: Performance MUST be optimized for mobile: lazy load images below fold, virtualize long lists (100+ items), debounce search/filter, compress photos before upload

**UI/UX Requirements (Accessibility & Inclusive Design):**
- **FR-176**: Keyboard navigation MUST be fully supported: tab order logical, focus indicators visible, shortcuts documented (e.g., Ctrl+K for search), escape closes modals, arrow keys navigate lists
- **FR-177**: Screen reader support MUST be comprehensive: semantic HTML (nav, main, article), ARIA labels for icons, live regions for notifications, form labels explicit, error associations
- **FR-178**: Color contrast MUST meet WCAG AA: 4.5:1 for normal text, 3:1 for large text, status not conveyed by color alone (icons + text), theme switcher supports high contrast mode
- **FR-179**: Text MUST be readable: 16px minimum body text, 1.5 line height, max 75 characters per line, resizable up to 200% without horizontal scroll, dyslexia-friendly font option
- **FR-180**: Interactions MUST have alternatives: keyboard shortcuts have button equivalents, gestures have button fallbacks, required fields clearly marked, error prevention (confirmation dialogs)

### Key Entities

- **Character**: Central organizational entity representing a character to cosplay. Contains character name, series, source medium, appearance description, personality notes, aliases, reference images (R2 URLs). Acts as hub for linking all related resources (outfits, wigs, props, accessories). Tracks completion percentage based on linked resources.

- **Wig**: Dedicated resource category separated from accessories. Contains wig name, color, length, fiber type, base wig brand/model, character links (many-to-many for reusable wigs), status, styling tasks, material links (via allocation table), base/styling/total costs, progress photos (1-10 R2 URLs), styling notes, condition (Pristine/Good/Needs Care/Damaged), maintenance tracking (last washed, notes, repairs), storage (location, method), source type (Retailer/Commission/Marketplace/Self-Styled), vendor link, styling credits, completion/time tracking. Supports post-event care reminders.

- **Outfit** (formerly "Costume"): Enhanced entity with version/variation field (required if character-linked), pattern files (PDF/JPG/PNG to R2), pattern metadata (name/brand/number/size/cost), alteration notes, construction tasks, material links (via allocation table), cost breakdown (base/materials/patterns/commission), crafting notes, time tracking (automatic + manual override), completion tracking. Links to one character (one-to-one).

- **Accessory**: Style/appearance items worn on body. Contains accessory name, category (Jewelry/Belts/Bags/Footwear/Headpieces/Gloves/SmallArmor/Scarves/Eyewear), character links (many-to-many), construction tasks, material links (via allocation table), progress photos (1-10 R2 URLs), construction notes, status (Idea/Planning/InProgress/OnHold/NeedsRepair/Ready/Retired), cost breakdown (total/materials/purchase/commission), ownership status (Owned/NeedToBuy/Borrowed/OnLoan with from/to tracking), source type (SelfMade/Purchased/Commissioned/Marketplace/Borrowed), vendor link, receipt uploads, completion/time tracking.

- **Prop**: Functional/tool items used by character (weapons, shields, magical artifacts). Enhanced to match Accessories with: character links (many-to-many via FK migration), construction tasks, material links, progress photos (1-10 R2 URLs), construction notes, ownership status, source type, vendor link, receipt uploads, cost breakdown, completion/time tracking. Distinct from Accessories by function (tool/protection/narrative vs style/appearance).

- **Equipment**: Photography gear (cameras/lenses/lighting/audio/tripods). Enhanced with: reference photos (1-5 R2 URLs), vendor linking, receipt uploads, maintenance tracking (Phase 1: notes + dates, Phase 2: full log), warranty expiration, purchase history display.

- **Crew Member**: Team collaborators (photographers/makeup artists/commissioners). Enhanced with: profile photo (1 R2 URL), rate history tracking (per event), contact info, portfolio links, previous roles, favorites. Marketplace linking deferred to future spec.

- **Location**: Shoot locations (studio/outdoor/convention/private). Enhanced with: reference photos (1-10 R2 URLs), cost tracking (rental/permit/deposit), restrictions notes, booking links, weather integration (forecast + warnings with dismiss capability).

- **Character-Resource Links**: Junction entities linking characters to resources:
  - Character-Outfit: One-to-one (one outfit to one character)
  - Character-Wig: Many-to-many (wigs reusable across characters)
  - Character-Prop: Many-to-many (props reusable across characters)
  - Character-Accessory: Many-to-many (accessories reusable across characters)

- **Resource Tasks**: Represents construction/styling tasks for resources (wigs, outfits, accessories, props) with title, description, due date, status (pending/in-progress/completed). Separate task tables per resource type for data integrity.

- **Event/Convention**: Represents conventions, photoshoots, competitions with name, type, dates, location, notes. Links to multiple characters for event-based planning. Tracks event readiness based on character completion status.

- **Vendor/Shop**: Represents vendors and shops with name, URL, contact info, category, rating, notes. Links to resources via purchases. Tracks purchase history with dates, order numbers, costs, and per-purchase ratings for informed reordering decisions.

- **Purchase Record**: Junction entity linking resources to vendors with purchase-specific details: purchase date, order number, cost, rating, and notes. Enables purchase history tracking per vendor.

- **Difficulty Assessment**: Hybrid difficulty tracking with system-suggested rating (1-5 based on resource count, task complexity, material types) and user-override rating. Includes optional skill challenge tags to identify which techniques user finds difficult for personal growth tracking.

- **Material / Craft Supply**: Consumable crafting resource tracked in dual modes (Shopping List → Inventory). Contains material name, category (Fabrics/Foam/Paints/Adhesives/Hardware/Wig Supplies/Thermoplastics/Electronics/3D Filament), color/variant, brand, quantity tracking (starting, current, unit of measure), cost tracking (purchase cost, cost per unit), vendor link, purchase date, optional tool link (for supplies), storage location (text), reference photos (1-5 R2 URLs), and notes. Supports per-project allocation (link to character/outfit with quantity used and cost allocated). Displays low stock warnings at < 20% remaining.

- **Material-Resource Allocation**: Junction entity linking materials to resources (characters, outfits, wigs, accessories, props) with usage tracking: quantity used, cost allocated, date used, and allocation notes. Enables per-project cost breakdowns and total materials cost aggregation per character.

- **Tool**: Non-consumable cosplay creation tool (distinct from Equipment which is photography gear). Contains tool name, type (Sewing Machine/Heat Gun/Dremel/Airbrush/3D Printer/Cutting Mat/Iron/Mannequin), brand, model, serial number, condition (Excellent/Good/Fair/Poor/Needs Repair), ownership status (Owned/Rented/Borrowed/Loaned Out), purchase details (date, cost, vendor link, receipt R2 URL, warranty expiration), storage location (text), maintenance tracking (notes, last serviced, next due), reference photos (1-5 R2 URLs), usage notes. Tool detail page displays linked supplies (materials with tool_id FK) with stock levels and low stock warnings. Phase 2 adds full maintenance log.

- **Receipt/Invoice**: Universal entity linking to all purchasable resources (outfits, wigs, accessories, props, equipment, tools, materials). Contains resource type, resource ID, vendor ID, R2 storage path (PDF/JPG/PNG up to 10MB), file type, purchase date, total cost, order number, notes, uploaded timestamp, uploaded by user. Enables return/warranty lookups, insurance documentation, and vendor purchase history.

- **Crew Rate History**: Tracks previous rates paid per crew member. Contains crew member ID, optional event ID, rate amount, rate type (hourly/daily/project/flat), booking source (text), booking URL, event date, notes, created timestamp. Enables budget planning and rate comparison for future bookings.

- **Location Cost**: Tracks location rental/permit fees. Contains location ID, cost type (rental_hourly/rental_daily/permit/deposit), amount, currency, minimum duration (minutes), website URL, notes, updated timestamp. Enables budget planning for location bookings.

## Clarifications

### Session 2025-10-24

- Q: When user deletes a character with linked resources, should system prevent deletion or allow with automatic unlinking? → A: Allow deletion with automatic unlinking (resources kept, character link removed automatically)
- Q: How should character completion percentage be calculated from linked resources? → A: Simple count (percentage of total linked resources marked complete, regardless of resource type)
- Q: How should time spent on wigs be tracked? → A: Hybrid: optional manual entry with automatic fallback (system calculates elapsed time from creation/status changes, users can manually override with actual hours worked)
- Q: How should users add and manage character aliases/alternate names? → A: Comma-separated text field (single text field where users enter aliases separated by commas, e.g., "Saber, Artoria Pendragon, Altria Pendragon")
- Q: Should wig status transitions be restricted or allow free changes between any statuses? → A: Free transition (users can change to any status at any time without restrictions)
- Q: How should the system prevent duplicate characters (same series + name)? → A: Series + Name uniqueness with manual confirmation (warn user when creating character with same series+name combination, require explicit confirmation to proceed)
- Q: How should the system handle file upload failures to Cloudflare R2 (character images, wig photos, pattern files)? → A: Retry with fallback to draft state (attempt 3 retries with exponential backoff; if all fail, save resource as draft without uploaded files and allow user to re-upload later)
- Q: How should the system handle concurrent edits to the same character/wig/outfit by multiple team members? → A: Last-write-wins with timestamp notification (always allow save; show toast notification like "Your changes saved (overwrote changes by [User] from 2 minutes ago)" to maintain awareness)
- Q: Should the spec use "Costume" or "Outfit" terminology consistently? → A: Standardize on "Outfit" throughout (aligns with functional requirements FR-031 to FR-041 and better reflects version tracking capability)
- Q: What are the upper scalability limits for characters, wigs, and total resources per team? → A: 500 characters, 200 wigs, 1000 total resources per team (soft limits; start here and adjust based on real-world usage patterns)
- Q: How should character reference links be managed beyond uploaded images? → A: Structured reference types with metadata (links categorized by type: Tutorial, Pattern Source, Inspiration, Commission Example; with notes field per link; supports both URLs and file uploads)
- Q: How should character budget tracking work for both personal cosplayers and commissioners? → A: Dual-mode budget tracking (toggle between "Personal" mode with budget limits and cost tracking, and "Commission" mode with billable hours tracking, material costs, and markup percentage for client quotes)
- Q: How should conventions/events be integrated into planning? → A: Event entity with character associations (standalone Events/Conventions with dates; link multiple characters to events; view event-level progress dashboard showing all characters for that convention)
- Q: How should vendor/shop information be tracked for budgeting and future planning? → A: Dedicated vendor entity (standalone Vendors/Shops with name, URL, contact info, rating, category, notes; link resources to vendors; view purchase history per vendor for informed reordering decisions)
- Q: How should project difficulty/skill level be tracked given it varies by person? → A: Hybrid difficulty assessment (system suggests difficulty 1-5 based on objective factors like resource count, task complexity, material types; user can override with their own rating 1-5 and add skill tags like "complex sewing", "advanced foam work", "intricate wig styling" to explain personal challenges)
- Q: How should materials/craft supplies be managed for both planning and inventory tracking? → A: Dual-mode workflow (Shopping List for planning "I need 3 yards fabric" → Mark as Purchased → moves to Inventory with actual cost/quantity; supports manual depletion "used 2 yards on Saber"; per-project allocation tracks which character/outfit used what materials for cost breakdowns)
- Q: What material categories are needed for cosplay crafting? → A: 9 core categories cover most use cases: Fabrics, Foam (EVA/craft), Paints & Finishes, Adhesives, Hardware (zippers/snaps/velcro), Wig Supplies (wefts/dye/products), Thermoplastics (Worbla/Thibra), Electronics (LEDs/batteries/wiring/Arduino), 3D Printing Filament; "Other" for edge cases
- Q: Should tools (sewing machines, heat guns) be tracked as materials or separate entity? → A: Separate Tools entity (non-consumable, tracked for ownership/maintenance); Materials can optionally link to Tools for supply tracking (e.g., "Thread → Sewing Machine", "Glue sticks → Glue Gun")
- Q: How should material costs be allocated to projects for commission quotes and budgeting? → A: Per-project allocation junction table (material links to character/outfit with quantity used and cost allocated; character budget auto-aggregates all allocated material costs; supports commission cost breakdowns)
- Q: Should cosplay creation tools (sewing machines, heat guns) be separate from photography equipment? → A: Separate Tools entity (distinct from Equipment which is photography gear; Tools are for cosplay creation, Equipment is for photoshoot production; similar tracking but different contexts and workflows)
- Q: How should tool supplies (thread for sewing machines, glue for glue guns) be tracked? → A: Materials link to Tools optionally (materials table has optional tool_id FK; tool detail page shows all linked supplies with stock levels; warns when supplies are low; no separate tool supplies table needed)
- Q: How should wigs track maintenance and care for longevity? → A: Condition dropdown (Pristine/Good/Needs Care/Damaged), last washed date, maintenance notes, repair history notes; post-event reminders to wash/clean wigs after conventions with care tutorial links
- Q: Should one wig be usable for multiple characters? → A: Yes via many-to-many character linking (one wig can link to multiple characters if style is reusable across characters like "long silver wig" for Saber, Weiss, Altria)
- Q: How should commissioned vs self-styled wigs be tracked? → A: Source type dropdown (Retailer/Commission/Marketplace/Self-Styled) with vendor link, base wig cost + styling cost tracked separately but overall cost as single field, styling credits text for attribution
- Q: What's the difference between Accessories and Props? → A: Accessories are style/appearance items worn on body (jewelry, bags, belts, boots, headpieces); Props are functional/tool items used by character (swords, shields, staffs, magical artifacts); dividing line is function (style vs tool/narrative)
- Q: Should Accessories have full tracking like Props? → A: Yes - both need tasks, materials, photos, cost breakdown, ownership status, source tracking for consistency and to support made accessories (crowns, armor pieces, weathered jewelry)
- Q: Should Props be upgraded to match Accessories? → A: Yes - migrate character_series text to character FK (many-to-many), add materials linking, tasks, ownership status, source tracking, receipt uploads for consistency across resources
- Q: Should Equipment (photography gear) and Tools (cosplay creation) be separate? → A: Yes separate entities - Equipment is photography gear for shoots (cameras, lenses), Tools are cosplay creation tools (sewing machines, heat guns); different contexts and workflows
- Q: Should all resources support photos for identification? → A: Yes - all resources should support 1-10 reference photos (1-5 for Equipment/Tools, 1 for Crew, 1-10 for others) for visual identification, insurance documentation, and quick visual scanning
- Q: Should all purchased resources support receipt uploads? → A: Yes - universal Receipts table links to all resource types for returns, warranties, insurance claims, and vendor purchase history
- Q: How should Crew rates be tracked for budget planning? → A: Crew Rate History table tracks previous rates paid with rate type (hourly/daily/project), booking source/URL, event link for historical comparison and future budget estimates
- Q: How should Location costs (rental, permits) be tracked? → A: Location Cost table tracks cost types (rental_hourly/daily/permit/deposit) with amounts, duration, website links for booking/budgeting
- Q: Should weather forecasting integrate with Locations for outdoor shoots? → A: Yes from spec 051 - display forecast for upcoming events at location, send warnings if bad weather predicted, allow user to dismiss if weather is desired/acceptable
- Q: Should post-event care be tracked for wigs and outfits? → A: Yes - after event ends, remind users to wash wigs and clean outfits linked to that event with care tutorial links, track last cleaned date per resource

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a character entry with series, name, and reference images in under 1 minute
- **SC-002**: Users can link an existing outfit, wig, and prop to a character in under 30 seconds total
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
- **SC-015**: Users can create shopping list with 10 materials in under 3 minutes
- **SC-016**: Users can mark shopping list item as purchased and move to inventory in under 15 seconds per item
- **SC-017**: Users can link material to character/outfit with quantity used in under 30 seconds
- **SC-018**: Character detail page displays aggregated material costs with zero calculation errors
- **SC-019**: Low stock warnings appear when material quantity drops below 20% of starting amount
- **SC-020**: Shopping list exports to PDF in under 5 seconds for offline store visit
- **SC-021**: Users can create tool entry with photos and purchase details in under 2 minutes
- **SC-022**: Tool detail page displays linked supplies with accurate stock levels and warnings
- **SC-023**: Users can add maintenance notes and service dates in under 30 seconds
- **SC-024**: Users can create accessory entry with tasks, materials, and photos in under 3 minutes
- **SC-025**: Users can upload receipt for purchase in under 15 seconds with auto-link to vendor
- **SC-026**: Prop detail page displays linked materials with accurate cost allocation
- **SC-027**: Equipment detail page shows vendor info, warranty status, and receipts correctly
- **SC-028**: Crew rate history displays previous bookings with rates for budget comparison
- **SC-029**: Location detail page shows costs, restrictions, and weather forecast for upcoming events
- **SC-030**: Post-event care reminders appear within 24 hours of event end
- **SC-031**: Users can dismiss weather warnings and proceed with booking despite forecast
- **SC-032**: Universal receipts display correctly on all resource types that support purchases
- **SC-033**: Tool detail page shows linked supplies with accurate stock warnings
- **SC-034**: Wig condition tracking helps 80%+ users maintain wigs longer (via survey)

## Assumptions

- Characters typically have 1-5 linked outfits, 1-3 wigs, 2-10 props, 3-15 accessories (note: "outfit" is the standard term used throughout this spec, formerly called "costume" in spec 045)
- Most wigs are character-specific (80%), some are reusable across characters (20%)
- Users understand character version/variation context (which anime season, game, etc.)
- Wig styling tasks range from simple (3-5 tasks) to complex (15-20 tasks)
- Material requirements for wigs typically include 2-10 items
- Pattern files are primarily PDF (70%), with images (30%)
- Users manage 5-30 characters in brainstorming/planning state at any time
- Character reference images follow same constraints as other images (5MB limit, auto-compression)
- Character-to-resource linking is intuitive to cosplay community (common mental model)
- Most outfits have 1-5 pattern files
- Most materials are purchased in bulk (5+ yards fabric, 10+ foam sheets) for multiple projects
- Tools are long-term investments (5+ year lifespan) maintained regularly
- Accessories range from simple (purchased items) to complex (10+ tasks for armor pieces, crowns)
- Props construction complexity varies widely (simple staff = 3 tasks, complex sword = 20+ tasks)
- Equipment lifespan is 3-7 years with regular maintenance
- Crew members are booked 2-4 weeks in advance for events
- Locations require 1-4 weeks advance booking depending on type
- Users attend 2-6 events per year (conventions, photoshoots, competitions)
- Most receipts are digital (PDF) rather than scanned physical receipts
- Weather forecasts are checked 7-10 days before outdoor shoots
- Post-event care is often delayed 1-2 weeks after events (hence reminders needed)

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
- Outfit wear history (which events outfit was worn to)
- Character popularity or trending suggestions

## Integration Notes

### 🔄 Consolidation Notice

**This specification supersedes and consolidates specs 045, 046, and 047 into a single, comprehensive resource management system.**

### What This Spec Consolidates

#### From Spec 045 (Resource Management System):
✅ **Retained & Enhanced:**
- Outfits (formerly "Costumes" in spec 045; enhanced with version, patterns, tasks, character linking)
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
- Accessory-to-outfit linking (now character-to-accessory linking)
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
- Source medium field (replacing outfit type from spec 045)
- Component linking (inline dropdowns for wigs/makeup/props/equipment)
- Photo uploads on outfit detail pages
- Task checklists within outfit pages
- Delete confirmation dialogs

### Key Architectural Changes

**From**: Flat resource lists (outfits, props, accessories managed separately)  
**To**: Character-centric model (character as organizational hub, resources link to characters)

**Before (Specs 045/046/047):**
```
Resources:
├── Outfits/Costumes (flat list)
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
- `character_outfits` - Junction table (one-to-one, but using junction for consistency)

**Enhanced Tables:**
- `outfits` (formerly `costumes`) → Add: `version`, `pattern_files_r2_urls`, `alteration_notes`, `crafting_notes`, `character_id` (nullable)
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
4. Add version/pattern fields to `outfits` table

**Phase 2: Data Migration**
1. Identify existing accessories marked as "wig" type
2. Migrate wig records to new `wigs` table
3. Update references in other tables
4. Preserve all existing data (zero data loss)

**Phase 3: UI Updates**
1. Create Characters page (list and detail views)
2. Create Wigs page (separate from accessories)
3. Update Outfits page with version/pattern fields
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

- Direct resource access maintained (outfit/prop/accessory pages still work independently)
- Character linking is optional (resources can exist without character association)
- Existing resources continue to function (no breaking changes)
- Users can gradually adopt character-centric workflow
