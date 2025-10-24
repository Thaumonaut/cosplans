# Implementation Plan: Comprehensive Resource Management System (Character-Centric Model)

**Branch**: `048-character-resource-model` | **Date**: October 24, 2025 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/048-character-resource-model/spec.md`

**Note**: This plan covers the comprehensive resource management system consolidating specs 045, 046, and 047 into a unified character-centric model with 12 resource types and 180 functional requirements (148 data/business logic + 32 UI/UX).

## Summary

This feature implements a comprehensive, character-centric resource management system for cosplay planning. Characters act as organizational hubs linking to 11 resource types: Outfits (with patterns/tasks), Wigs (with styling/maintenance), Accessories (style items), Props (functional items), Materials (consumable supplies with shopping list→inventory workflow), Tools (non-consumable creation equipment), Equipment (photography gear), Crew (team members), Locations (shoot venues), Vendors (purchase tracking), and Events (conventions/photoshoots).

**Key innovations**:
- **Dual-mode budgeting**: Personal (cost limits) vs Commission (billable hours + markup)
- **Per-project material allocation**: Track which character used which materials with cost attribution
- **Universal receipt system**: All purchases link to vendor with PDF/JPG receipt uploads
- **Post-event care reminders**: Automated prompts to wash/maintain wigs and outfits after events
- **Weather integration**: Forecast display + warnings for outdoor shoots with dismissible alerts
- **Reusable resources**: Many-to-many linking allows wigs/props/accessories across multiple characters

**Technical approach**: SvelteKit frontend with Supabase PostgreSQL backend, Cloudflare R2 for photos/receipts/patterns, junction tables for many-to-many relationships, material-resource allocation tracking, and weather API integration.

## Technical Context

**Language/Version**: TypeScript 5.x with SvelteKit 2.x (Svelte 5 with runes syntax)  
**Primary Dependencies**: 
- SvelteKit (framework)
- Supabase Client SDK (database + auth)
- Lucide Svelte (icons)
- Cloudflare R2 SDK (file storage)
- Weather API client (OpenWeatherMap or Weather.gov)

**Storage**: 
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Files**: Cloudflare R2 (photos, receipts, pattern PDFs)
- **Total tables**: ~25 (12 resource tables + junction tables + support tables)

**Testing**: 
- Vitest (unit tests for services, stores, utilities)
- Playwright (E2E tests for critical user flows)
- Component tests for complex UI (CharacterAutocomplete, MaterialAllocation)

**Target Platform**: Web (responsive, mobile-first), PWA-capable  
**Project Type**: Full-stack web application (existing SvelteKit monorepo)  

**Performance Goals**:
- Character detail page load < 2s with 10+ linked resources
- Material search/filter < 500ms for 100+ items
- Photo uploads (5MB) complete < 10s
- Shopping list PDF export < 5s

**Constraints**:
- Soft limits: 500 characters, 200 wigs, 1000 total resources per team
- R2 upload retry: 3 attempts with exponential backoff (1s, 2s, 4s)
- Concurrent edit handling: Last-write-wins with timestamp notification
- Weather API rate limits: Cache forecasts for 1 hour

**Scale/Scope**: 
- 12 resource types with consistent CRUD patterns
- 180 functional requirements across 8 major feature areas (including 32 UI/UX FRs)
- 5 junction tables for many-to-many relationships
- Universal systems: Receipts, Post-Event Care, Material Allocation

**UI/UX Requirements (FR-149 to FR-180)**:
- Mobile-first responsive design (44px touch targets, swipe gestures, bottom nav)
- Component library: Cards, forms, modals, badges, progress indicators
- Interaction patterns: Quick actions, drag-drop, command palette (Cmd+K), filters
- Animations: Page transitions, micro-interactions, celebrations (confetti on 100%)
- Accessibility: Keyboard nav, screen readers, WCAG AA contrast, readable text
- Performance: Skeleton screens, lazy load, virtualized lists, optimistic updates
- **Theme Integration**: All UI MUST use existing CSS custom properties (`--theme-*`) for colors, NOT hardcoded values
- **Design Document**: See `ui-design.md` for comprehensive visual system and component specifications

**Existing Theme System**:
- **Technology**: CSS custom properties (CSS variables) for dynamic theming
- **Built-in Themes**: 8 theme variants (light-default, light-green, light-warm, light-cool, dark-default, dark-cozy, dark-cosmic, dark-fantasy)
- **Custom Theme Support**: Users can create custom themes via theme builder
- **CSS Variables**: ~40 properties covering backgrounds, borders, sidebar, header, status colors, interactions
- **Key Variables**: `--theme-primary`, `--theme-accent`, `--theme-background`, `--theme-foreground`, `--theme-sidebar-*`, `--theme-card-bg`, `--theme-success/error/warning/info`
- **Integration Requirement**: New UI components MUST reference theme variables, not hardcoded hex colors

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Web-First with Mobile-Responsive Architecture
- **Status**: PASS
- **Evidence**: SvelteKit responsive web app, mobile-first design, touch-friendly UI patterns
- **Action**: Ensure all resource detail pages are mobile-optimized with collapsible sections

### ✅ I.5. Reduce Overwhelm via Prioritization  
- **Status**: PASS
- **Evidence**: Character-centric organization reduces overwhelm; resources grouped by character; collapsible navigation sections (per spec 041 addendum)
- **Action**: Implement progress indicators and "next actions" prominently on character detail pages

### ✅ VI.7. Spec-Driven Development Workflow
- **Status**: PASS
- **Evidence**: Spec 048 follows spec-driven workflow (specify → plan → tasks → implement)
- **Action**: Break plan into dependency-ordered tasks before implementation

### ✅ VII.5. Dependency-First Development
- **Status**: PASS with CONDITIONS
- **Dependencies identified**:
  1. **Materials entity** MUST be implemented before material-resource allocation
  2. **Vendors entity** MUST be implemented before vendor linking in other resources
  3. **Events entity** MUST be implemented before post-event care reminders
  4. **Weather API integration** MUST be functional before location weather warnings
  5. **Notification system (spec 031)** MUST exist for reminders and alerts
- **Action**: Task ordering MUST follow dependency graph

### ✅ VIII.5. Solo Developer Efficiency & Cost Optimization
- **Status**: PASS
- **Evidence**: Leverages existing patterns (Supabase RLS, SvelteKit server routes), reuses resource_photos table, universal receipts table reduces duplication
- **Concerns**: 
  - 12 resource types = significant implementation surface area
  - Material allocation tracking adds complexity
  - Weather API integration is new dependency
- **Mitigation**: Phased rollout (see tasks), code generation for repetitive CRUD, shared UI components

### ⚠️ II.7. Community Trust & Accountability (Reputation System)
- **Status**: NOT APPLICABLE for this spec
- **Rationale**: Resource management is internal team functionality; reputation system applies to public marketplace/collaboration features (future specs)

### ✅ III.5. Flexible & Fair Monetization
- **Status**: PASS
- **Evidence**: Dual-mode budgeting supports both personal cosplayers (free tier) and commissioners (revenue generation); soft scalability limits per team encourage Growth tier upgrades
- **Action**: Track resource counts per team for limit enforcement

## Project Structure

### Documentation (this feature)

```text
specs/048-character-resource-model/
├── spec.md              # Feature specification (180 FRs: 148 business + 32 UI/UX)
├── plan.md              # This file (implementation plan)
├── ui-design.md         # UI/UX design document (comprehensive visual system)
├── research.md          # Phase 0 output (technical research + theme integration)
├── data-model.md        # Phase 1 output (database schema)
├── quickstart.md        # Phase 1 output (developer guide)
├── theme-integration-guide.md  # Phase 1 output (component styling with theme variables)
├── contracts/           # Phase 1 output (API contracts)
│   └── openapi.yaml     # REST API spec for resources
├── tasks.md             # Phase 2 output (task breakdown - NOT YET CREATED)
└── checklists/
    └── requirements.md  # Feature completion checklist
```

### Source Code (repository root)

**Existing structure** (SvelteKit monorepo):

```text
src/
├── lib/
│   ├── components/
│   │   ├── characters/          # NEW: CharacterCard, CharacterDetail, CharacterAutocomplete
│   │   ├── wigs/                # NEW: WigCard, WigDetail, WigMaintenance
│   │   ├── accessories/         # NEW: AccessoryCard, AccessoryDetail, AccessoryTasks
│   │   ├── props/               # EXISTS: Upgrade with tasks, materials, character FK
│   │   ├── materials/           # NEW: MaterialCard, ShoppingList, InventoryTable, AllocationForm
│   │   ├── tools/               # NEW: ToolCard, ToolDetail, SuppliesDisplay
│   │   ├── equipment/           # EXISTS: Upgrade with photos, vendor, receipts
│   │   ├── crew/                # EXISTS: Upgrade with photos, rate history
│   │   ├── locations/           # EXISTS: Upgrade with photos, costs, weather
│   │   ├── costumes/            # EXISTS: Rename to outfits/, upgrade with tasks, patterns
│   │   ├── vendors/             # NEW: VendorCard, VendorDetail, PurchaseHistory
│   │   ├── events/              # NEW: EventCard, EventDashboard, EventReadiness
│   │   ├── shared/
│   │   │   ├── ReceiptUpload.svelte          # NEW: Universal receipt upload
│   │   │   ├── MaterialAllocation.svelte     # NEW: Link materials to resources
│   │   │   ├── CharacterLinkPicker.svelte    # NEW: Many-to-many character linking
│   │   │   ├── TaskList.svelte               # NEW: Shared task component
│   │   │   ├── PhotoGallery.svelte           # ENHANCE: Support 1-10 photos
│   │   │   └── PostEventCareReminder.svelte  # NEW: Wash/clean reminders
│   │   └── ui/                   # Existing themed components (ALL use CSS custom properties)
│   ├── server/
│   │   └── resources/
│   │       ├── character-service.ts        # NEW: Character CRUD + completion calc
│   │       ├── wig-service.ts              # NEW: Wig CRUD + maintenance
│   │       ├── accessory-service.ts        # NEW: Accessory CRUD + tasks
│   │       ├── prop-service.ts             # ENHANCE: Add tasks, materials, character FK
│   │       ├── material-service.ts         # NEW: Shopping list + inventory + allocation
│   │       ├── tool-service.ts             # NEW: Tool CRUD + supplies display
│   │       ├── equipment-service.ts        # ENHANCE: Add vendor, receipts, photos
│   │       ├── crew-service.ts             # ENHANCE: Add photos, rate history
│   │       ├── location-service.ts         # ENHANCE: Add photos, costs, weather
│   │       ├── costume-service.ts          # ENHANCE: Rename to outfit-service, add tasks/patterns
│   │       ├── vendor-service.ts           # NEW: Vendor CRUD + purchase history
│   │       ├── event-service.ts            # NEW: Event CRUD + readiness calc
│   │       ├── receipt-service.ts          # NEW: Universal receipt management
│   │       └── allocation-service.ts       # NEW: Material-resource allocation tracking
│   ├── types/
│   │   └── resources.ts          # ENHANCE: Add types for all 12 resources + junction tables
│   └── utils/
│       ├── weather-api.ts        # NEW: Weather forecast fetching + caching
│       ├── cost-aggregation.ts   # NEW: Character budget calculation
│       └── pdf-export.ts         # NEW: Shopping list PDF generation
└── routes/
    └── (auth)/
        ├── characters/           # NEW: /characters, /characters/[id]
        ├── wigs/                 # NEW: /wigs, /wigs/[id]
        ├── accessories/          # NEW: /accessories, /accessories/[id]
        ├── props/                # EXISTS: Enhance with tasks, materials
        ├── materials/            # NEW: /materials (shopping list + inventory tabs)
        ├── tools/                # NEW: /tools, /tools/[id]
        ├── equipment/            # EXISTS: Enhance with photos, vendor
        ├── crew/                 # EXISTS: Enhance with photos, rates
        ├── locations/            # EXISTS: Enhance with photos, costs, weather
        ├── costumes/             # EXISTS: Rename route or alias to /outfits
        ├── vendors/              # NEW: /vendors, /vendors/[id]
        └── events/               # NEW: /events, /events/[id]

supabase/
└── migrations/
    └── [timestamp]_character_resource_model.sql  # NEW: All 25+ tables

tests/
├── unit/
│   └── resources/
│       ├── character-service.test.ts
│       ├── material-allocation.test.ts
│       └── cost-aggregation.test.ts
└── e2e/
    └── character-resource/
        ├── character-creation.spec.ts
        ├── material-allocation.spec.ts
        └── post-event-care.spec.ts
```

**Structure Decision**: Maintain existing SvelteKit monorepo structure. New resources follow established patterns (components/, server/resources/, routes/). Material allocation and receipt systems are cross-cutting concerns with dedicated services. Weather API integration is a new utility module.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**⚠️ COMPLEXITY WARNING**: This feature has exceptionally high scope (180 FRs, 12 resource types + comprehensive UI/UX). Justification for constitutional compliance despite complexity:

**VIII.5 Solo Developer Efficiency Concern**:
- **Issue**: 12 resource types + 32 UI/UX requirements = significant implementation surface
- **Justification**: 
  - Consolidates 3 separate specs (045, 046, 047) avoiding future rework
  - Establishes consistent patterns reused across all resources (CRUD, tasks, photos, vendor linking)
  - Universal systems (receipts, material allocation, theme integration) reduce per-resource complexity
  - **UI/UX leverage**: Existing theme system (8 variants) + component library allows rapid UI development
  - All new components use existing CSS custom properties - NO new theming infrastructure needed
  - Phased implementation via dependency ordering spreads work across sprints
- **Mitigation Strategy**:
  - Phase 1: Foundation (Materials, Vendors, Tools - no dependencies)
  - Phase 2: Core Resources (Characters, Wigs, Outfits - high value)
  - Phase 3: Enhanced Resources (Props upgrade, Accessories - builds on Phase 2)
  - Phase 4: Support Resources (Equipment, Crew, Locations - independent)
  - Phase 5: Integration (Events, Post-Event Care, Weather - requires all resources)
- **Acceptable?**: YES - upfront investment prevents technical debt from fragmented resource management

**Dependency-First Validation**:
- Materials → (all resources with material allocation)
- Vendors → (all resources with purchases)
- Events → (post-event care, weather warnings)
- Notification system (spec 031) → (all reminders)
- Weather API → (location warnings)

**Complexity Score**: 9/10 (Very High)  
**Risk Level**: Medium (high scope mitigated by clear patterns, existing theme system, and phasing)  
**UI/UX Impact**: Moderate (leverages existing theme system, no new theming infrastructure required)

## Phase 0: Research

### Research Questions

1. **Weather API Selection**:
   - **Question**: Which weather API provides best accuracy for 7-10 day forecasts with reasonable rate limits?
   - **Options**: OpenWeatherMap (5d/3h forecast, 60 calls/min free), Weather.gov (US only, no rate limit), WeatherAPI (14-day forecast, 1M calls/month free)
   - **Decision criteria**: Coverage (US vs global), rate limits, forecast accuracy, cost at scale
   - **Output**: Selected API + integration pattern + caching strategy

2. **Material Allocation Data Model**:
   - **Question**: Should material allocation use junction table or JSONB column on resources?
   - **Options**: 
     - Junction table `material_resource_allocation` (normalized, queryable)
     - JSONB `material_allocations` column on each resource (denormalized, simpler schema)
   - **Decision criteria**: Query patterns (aggregate costs per character), data integrity, migration ease
   - **Output**: Schema design + cost aggregation query patterns

3. **PDF Generation for Shopping Lists**:
   - **Question**: Server-side PDF generation vs client-side (browser print)?
   - **Options**: 
     - Server: Puppeteer/Playwright (heavyweight), jsPDF (lightweight)
     - Client: window.print() with print stylesheet, jsPDF client-side
   - **Decision criteria**: Offline support, file size, styling control, server load
   - **Output**: Selected library + export format specification

4. **Photo Storage Optimization**:
   - **Question**: All photos store original + thumbnail, or on-demand thumbnail generation?
   - **Options**: 
     - Pre-generate thumbnails on upload (storage cost, fast display)
     - On-demand via Cloudflare Image Resizing (compute cost, slower first load, caching)
   - **Decision criteria**: R2 storage costs, Cloudflare Workers pricing, user experience
   - **Output**: Storage strategy + thumbnail generation pattern

5. **Task Management Pattern**:
   - **Question**: Separate task tables per resource type vs polymorphic tasks table?
   - **Options**:
     - Per-resource: `wig_tasks`, `outfit_tasks`, `accessory_tasks`, `prop_tasks`
     - Polymorphic: Single `resource_tasks` with `resource_type` + `resource_id`
   - **Decision criteria**: Type safety, query simplicity, RLS complexity, data integrity
   - **Output**: Task schema design + RLS policies

6. **Concurrent Edit Resolution**:
   - **Question**: Last-write-wins vs operational transform vs lock-based?
   - **Options**:
     - Last-write-wins with timestamp notification (spec requirement)
     - Optimistic locking with version numbers (prevents overwrites)
     - Operational transform (complex, real-time)
   - **Decision criteria**: User experience, implementation complexity, team size
   - **Output**: Conflict resolution strategy + UI notification pattern

7. **Character Completion Calculation**:
   - **Question**: Real-time calculation vs cached/denormalized percentage?
   - **Options**:
     - Real-time: Query junction tables on page load (accurate, slower)
     - Cached: Denormalized `completion_percentage` column updated via trigger (fast, eventual consistency)
   - **Decision criteria**: Performance (character lists vs detail), data staleness tolerance
   - **Output**: Completion calculation pattern + update triggers if cached

8. **Vendor Marketplace Integration (Future)**:
   - **Question**: Design vendor schema to support future marketplace profiles?
   - **Options**:
     - Simple vendor table now, migrate later (faster MVP)
     - Extensible schema with `is_marketplace_user` flag + profile fields (future-proof)
   - **Decision criteria**: Migration complexity, schema flexibility, current vs future needs
   - **Output**: Vendor schema design + marketplace extension plan

9. **UI Theme System Integration** (NEW):
   - **Question**: How to implement vibrant, youth-oriented UI design (per ui-design.md) while maintaining compatibility with all 8 existing themes?
   - **Requirements**:
     - All components MUST use CSS custom properties (`--theme-*`) NOT hardcoded colors
     - Gradients in ui-design.md (purple-pink, mesh gradients) map to existing `--theme-primary` + `--theme-accent`
     - Glassmorphism effects use `--theme-card-bg` (already has opacity in themes)
     - Status colors map to existing `--theme-success/error/warning/info`
     - New components work in both light and dark mode
   - **Challenge**: ui-design.md specifies specific hex colors (#8B5CF6 purple, #EC4899 pink) - how to make these theme-aware?
   - **Options**:
     - **A**: Extend theme variants with new variables (--theme-gradient-start, --theme-gradient-end) - requires migration
     - **B**: Use existing --theme-primary + --theme-accent everywhere - simpler, works now
     - **C**: Hybrid: Use existing variables, add new variables only for complex gradients (e.g., mesh backgrounds)
   - **Decision criteria**: Backwards compatibility, theme customization flexibility, implementation complexity
   - **Output**: Component styling pattern + theme variable mapping guide + updated theme types if needed

### Research Outputs

**Generated in**: `research.md` (created by this plan execution)

**Format**:
```markdown
# Research: Character-Centric Resource Model

## Decision 1: Weather API Selection
- **Chosen**: [API name]
- **Rationale**: [why chosen over alternatives]
- **Alternatives Considered**: [what else was evaluated]
- **Integration Pattern**: [code pattern + caching strategy]

[... repeat for all 9 research questions]

## Decision 9: UI Theme System Integration
- **Chosen**: [Option A/B/C]
- **Theme Variable Mapping**:
  - Brand gradient → `var(--theme-primary)` to `var(--theme-accent)`
  - Card backgrounds → `var(--theme-card-bg)`
  - Status colors → `var(--theme-success/error/warning/info)`
  - [... complete mapping]
- **Component Styling Pattern**: [Example Svelte component with theme variables]
- **New Theme Variables**: [If Option A or C chosen]
```

## Phase 1: Design & Contracts

### Data Model

**Entities** (25 total):

**Primary Resources (12)**:
1. `characters` - Hub for all resources
2. `wigs` - Dedicated wig tracking (formerly in accessories)
3. `costumes` - Outfit tracking (rename or alias)
4. `accessories` - Style/appearance items (NEW)
5. `props` - Functional/tool items (ENHANCE)
6. `materials` - Consumable supplies (NEW)
7. `tools` - Non-consumable equipment (NEW)
8. `equipment` - Photography gear (ENHANCE)
9. `crew_members` - Team collaborators (ENHANCE)
10. `locations` - Shoot venues (ENHANCE)
11. `vendors` - Purchase tracking (NEW)
12. `events` - Conventions/shoots (NEW)

**Junction Tables (5)**:
13. `character_outfits` - 1:1 linking
14. `character_wigs` - M:M linking
15. `character_props` - M:M linking
16. `character_accessories` - M:M linking
17. `material_resource_allocations` - Material usage tracking

**Support Tables (8)**:
18. `wig_tasks` - Styling tasks
19. `outfit_tasks` - Construction tasks
20. `accessory_tasks` - Construction tasks
21. `prop_tasks` - Construction tasks
22. `receipts` - Universal purchase receipts
23. `crew_rate_history` - Booking rates
24. `location_costs` - Rental/permit fees
25. `resource_photos` - Universal photo storage (EXISTING)

**Schema highlights**:
- **Characters**: series, name, source_medium, aliases (comma-separated), reference_images (array), budget_mode (personal/commission), budget_limit, completion_percentage (cached or real-time per research)
- **Materials**: dual-mode (shopping_list boolean), category enum, quantity_start, quantity_current, unit_of_measure, cost_per_unit, vendor_id FK, tool_id FK (optional), storage_location, low_stock_warning (< 20%)
- **Material Allocations**: material_id FK, resource_type enum, resource_id, quantity_used, cost_allocated, date_used, notes
- **Receipts**: resource_type enum, resource_id, vendor_id FK, r2_storage_path, file_type, purchase_date, total_cost, order_number
- **Wigs**: condition enum, last_washed_date, maintenance_notes, storage_location, storage_method, source_type enum, base_wig_cost, styling_cost, overall_cost
- **All resources**: Support 1-10 photos (1-5 for Equipment/Tools, 1 for Crew) via `resource_photos` table

**Generated in**: `data-model.md`

### API Contracts

**Endpoints** (grouped by resource):

**Characters (FR-001 to FR-009)**:
- `GET /api/characters` - List with filters (series, source_medium, completion, linked_event)
- `POST /api/characters` - Create with duplicate warning
- `GET /api/characters/[id]` - Detail with all linked resources
- `PUT /api/characters/[id]` - Update
- `DELETE /api/characters/[id]` - Soft delete with resource unlinking
- `GET /api/characters/[id]/budget` - Budget summary (aggregated costs)
- `GET /api/characters/[id]/completion` - Completion percentage calculation
- `POST /api/characters/[id]/link-resource` - Link outfit/wig/prop/accessory

**Materials (FR-073 to FR-087)**:
- `GET /api/materials` - List (filter: shopping_list, in_stock, category, tool_id)
- `POST /api/materials` - Create shopping list or inventory item
- `PUT /api/materials/[id]` - Update quantity, mark as purchased
- `POST /api/materials/[id]/mark-purchased` - Shopping list → inventory workflow
- `DELETE /api/materials/[id]` - Delete
- `GET /api/materials/inventory-value` - Total value calculation
- `POST /api/materials/allocate` - Link material to resource with quantity/cost
- `GET /api/materials/shopping-list/export` - Generate PDF

**Wigs (FR-010 to FR-020e)**:
- `GET /api/wigs` - List with filters (character, condition, source_type)
- `POST /api/wigs` - Create
- `GET /api/wigs/[id]` - Detail
- `PUT /api/wigs/[id]` - Update
- `DELETE /api/wigs/[id]` - Delete
- `POST /api/wigs/[id]/tasks` - Add styling task
- `PUT /api/wigs/[id]/maintenance` - Update condition, last_washed
- `POST /api/wigs/[id]/link-characters` - Many-to-many character linking

**[Similar patterns for Accessories, Props, Tools, Equipment, Crew, Locations, Vendors, Events]**

**Universal (FR-143 to FR-148)**:
- `POST /api/receipts/upload` - Upload receipt to R2, link to resource
- `GET /api/receipts` - List receipts (filter by resource_type, vendor)
- `GET /api/events/[id]/care-reminders` - Post-event care tasks
- `POST /api/events/[id]/dismiss-reminder` - Dismiss care reminder
- `GET /api/locations/[id]/weather` - Forecast for upcoming events
- `POST /api/locations/[id]/dismiss-weather-warning` - Dismiss weather alert

**Generated in**: `contracts/openapi.yaml`

### Quickstart Guide

**Developer onboarding** for this feature:

1. **Prerequisites**: Supabase CLI, Bun, Cloudflare R2 credentials, Weather API key
2. **Database setup**: Run migration `[timestamp]_character_resource_model.sql`
3. **Environment variables**: `WEATHER_API_KEY`, `R2_BUCKET_NAME`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
4. **Dev server**: `bun run dev` (SvelteKit)
5. **Key files to understand**:
   - `src/lib/server/resources/character-service.ts` - Character CRUD + completion calc
   - `src/lib/server/resources/allocation-service.ts` - Material allocation tracking
   - `src/lib/components/shared/MaterialAllocation.svelte` - Material linking UI
   - `supabase/migrations/[timestamp]_character_resource_model.sql` - Full schema

**Generated in**: `quickstart.md`

### UI Theme Integration Guide

**Purpose**: Document how to style new components using the existing theme system

**Contents**:
1. **Theme Variable Reference**: Complete list of available `--theme-*` variables with examples
2. **Component Styling Patterns**: 
   - Card components: Use `var(--theme-card-bg)` for backgrounds
   - Buttons: Use `var(--theme-primary)` and `var(--theme-primary-hover)`
   - Gradients: Combine `var(--theme-primary)` → `var(--theme-accent)`
   - Status indicators: Use `var(--theme-success/error/warning/info)`
3. **Glassmorphism Pattern**: How to use existing `rgba()` backgrounds + backdrop-filter
4. **Dark/Light Mode**: Testing components across all 8 themes
5. **Bad Examples**: What NOT to do (hardcoded hex colors, theme-specific logic)
6. **Good Examples**: Svelte component snippets with proper theme variable usage

**Example snippet**:
```svelte
<!-- ❌ BAD: Hardcoded colors -->
<button style="background: #8B5CF6; color: white;">Save</button>

<!-- ✅ GOOD: Theme variables -->
<button style="background: var(--theme-primary); color: var(--theme-foreground);">Save</button>

<!-- ✅ GREAT: Gradient using theme variables -->
<button style="background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent));">Save</button>
```

**Generated in**: `theme-integration-guide.md`

### Agent Context Update

**Command**: `.specify/scripts/powershell/update-agent-context.ps1 -AgentType cursor-agent`

**New technologies to add**:
- Weather API client (library TBD from research)
- PDF generation library (jsPDF or Puppeteer per research)
- Cloudflare R2 SDK for file uploads

**Preserve manual additions**: Yes (agent context has manual sections marked)

## Next Steps

1. ✅ **Phase 0 complete**: Research questions answered in `research.md`
2. ✅ **Phase 1 complete**: Data model, contracts, quickstart generated
3. ⏭️ **Phase 2**: Run `/speckit.tasks` to break into dependency-ordered implementation tasks
4. ⏭️ **Implementation**: Follow task list with TDD approach (write tests first)

## Stop Here

This plan document is complete. The next command is `/speckit.tasks` to generate the task breakdown.

**Files generated**:
- ✅ `spec.md` (180 functional requirements)
- ✅ `plan.md` (this file - updated with theme integration)
- ✅ `ui-design.md` (comprehensive visual system + component library)
- ⏭️ `research.md` (awaiting research execution - includes theme integration decision)
- ⏭️ `data-model.md` (awaiting design)
- ⏭️ `theme-integration-guide.md` (awaiting design - component styling patterns)
- ⏭️ `contracts/openapi.yaml` (awaiting design)
- ⏭️ `quickstart.md` (awaiting design)
