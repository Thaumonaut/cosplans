# Implementation Plan: Resource Management System

**Branch**: `045-resource-management` | **Date**: October 21, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/045-resource-management/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement comprehensive resource management system for cosplay teams to track costumes, crew members, equipment, props, and locations. System provides CRUD operations, photo uploads with compression, lifecycle state tracking, real-time search, and team-scoped permissions. This is foundational infrastructure required before implementing shoot management features.

**Primary Requirements**:
- 5 resource types: Costumes (P1), Crew (P1), Equipment (P2), Props (P2), Locations (P3)
- Complete lifecycle tracking for costumes/props (constitutional requirement)
- 1-10 photos per resource with automatic compression
- Real-time search with 300ms debouncing
- Soft delete with 6-month retention
- Team-scoped with RLS permissions

**Technical Approach**:
- SvelteKit pages with server-side loaders for each resource type
- Supabase database tables with JSONB for lifecycle metadata
- Supabase Storage for photo uploads with automatic compression
- PostgreSQL full-text search for real-time filtering
- Flowbite Svelte components with theme CSS variables
- Shared resource management patterns across all 5 types

## Technical Context

**Language/Version**: TypeScript 5.x with SvelteKit 2.x  
**Primary Dependencies**: 
- SvelteKit 2.x (web framework)
- Supabase JS Client (database & storage)
- Flowbite Svelte (UI components)
- Lucide Svelte (icons)
- Zod (validation)

**Storage**: 
- PostgreSQL (Supabase) for resource metadata
- Supabase Storage for photo uploads
- JSONB columns for lifecycle state metadata

**Testing**: 
- Vitest (unit tests)
- Playwright (E2E tests)
- Testing Library (component tests)

**Target Platform**: Web (mobile-responsive), Chrome/Firefox/Safari latest 2 versions  
**Project Type**: Web application (SvelteKit)  
**Runtime**: Bun (constitutional requirement)

**Performance Goals**:
- Page load <2 seconds with 50+ resources (SC-004)
- Photo thumbnails load <1 second on 3G (SC-006)
- Real-time search responds <300ms (debounced)
- Resource creation <2 minutes (SC-001)
- Search/filter results <10 seconds (SC-002)

**Constraints**:
- Team-scoped data (no cross-team sharing in MVP)
- 1-10 photos per resource (5MB max per photo)
- Soft delete with 6-month retention
- RLS policies enforce team permissions
- Theme CSS variables for all styling (no hardcoded colors)

**Scale/Scope**:
- 5 resource types (Costumes, Crew, Equipment, Props, Locations)
- 11 lifecycle states for costumes/props
- 50+ resources per team without performance degradation
- Support for bulk operations (multi-select)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Web-First with Mobile-Responsive Architecture
- **Status**: PASS
- **Evidence**: SvelteKit web application with mobile-responsive design, touch-friendly interfaces
- **Action**: Ensure all resource pages are mobile-responsive with touch-optimized controls

### ✅ IV. Customizable Workflow States  
- **Status**: PASS
- **Evidence**: FR-002 implements 11 lifecycle states for costumes/props as required by constitution Section IV
- **Constitutional Requirement**: "Costume/Prop Lifecycle Stages: The system MUST support comprehensive lifecycle tracking for costumes and props beyond simple acquisition/in-progress/ready states"
- **Implementation**: planned, acquiring, in-progress, ready, owned, sold, damaged, rented, lost, stored, loaned
- **Action**: Implement state-specific metadata (sale price, damage cost, borrower info) and lifecycle history

### ✅ VI. Test-Driven Development
- **Status**: PASS
- **Evidence**: Testing stack defined (Vitest, Playwright, Testing Library)
- **Action**: Write tests before implementation for all resource CRUD operations

### ✅ VI.5. Test Observability & Developer Experience
- **Status**: PASS
- **Evidence**: Tests will be executable through development testing dashboard (spec 043)
- **Action**: Ensure resource components have visual test stories for all states

### ✅ VII. Team Roles & Permissions vs. Crew Management
- **Status**: PASS
- **Evidence**: FR-013a implements crew member linking to Cosplans accounts (constitutional "External Crew Member Roles")
- **Constitutional Requirement**: "External Crew Member Roles: Crew members with Cosplans accounts MAY be linked to a shoot as 'viewer' or 'member' without requiring them to join the team itself"
- **Implementation**: Manual linking with email-based suggestions, crew directory separate from team members
- **Action**: Implement crew member account linking with confirmation dialog

### ✅ IX. Bun Runtime Requirement
- **Status**: PASS
- **Evidence**: Runtime specified as Bun in Technical Context
- **Action**: Use `bun run dev`, `bun add`, `bun run build` for all operations

### ⚠️ II. Real-Time Collaboration
- **Status**: DEFERRED (Out of Scope for MVP)
- **Constitutional Requirement**: "Changes to shoots, costumes, props, and schedules MUST be synchronized across all team members immediately"
- **MVP Scope**: Real-time collaboration deferred to future enhancement (see spec Out of Scope section)
- **Justification**: MVP focuses on foundational CRUD operations; real-time sync adds significant complexity
- **Future Work**: Add real-time subscriptions in Phase 2 after MVP validation

**Overall Gate Status**: ✅ **PASS** - All critical constitutional requirements met, one deferred with justification

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── routes/(auth)/
│   ├── costumes/
│   │   ├── +page.svelte                    # Costume list view
│   │   ├── +page.server.ts                 # Server loader for costumes
│   │   ├── [id]/
│   │   │   ├── +page.svelte                # Costume detail/edit view
│   │   │   └── +page.server.ts             # Server loader & actions
│   │   └── new/
│   │       ├── +page.svelte                # Create costume form
│   │       └── +page.server.ts             # Create action
│   ├── crew/
│   │   ├── +page.svelte                    # Crew directory view
│   │   ├── +page.server.ts                 # Server loader for crew
│   │   ├── [id]/+page.svelte               # Crew member detail/edit
│   │   └── new/+page.svelte                # Add crew member form
│   ├── equipment/
│   │   ├── +page.svelte                    # Equipment inventory view
│   │   ├── +page.server.ts                 # Server loader for equipment
│   │   ├── [id]/+page.svelte               # Equipment detail/edit
│   │   └── new/+page.svelte                # Add equipment form
│   ├── props/
│   │   ├── +page.svelte                    # Props catalog view
│   │   ├── +page.server.ts                 # Server loader for props
│   │   ├── [id]/+page.svelte               # Prop detail/edit
│   │   └── new/+page.svelte                # Add prop form
│   └── locations/
│       ├── +page.svelte                    # Location library view
│       ├── +page.server.ts                 # Server loader for locations
│       ├── [id]/+page.svelte               # Location detail/edit
│       └── new/+page.svelte                # Add location form
│
├── lib/
│   ├── components/
│   │   └── resources/
│   │       ├── ResourceCard.svelte         # Shared resource card component
│   │       ├── ResourceList.svelte         # Shared list with search/filter
│   │       ├── PhotoUpload.svelte          # Photo upload with compression
│   │       ├── LifecycleStateBadge.svelte  # State badge component
│   │       └── ResourceDeleteDialog.svelte # Soft delete confirmation
│   ├── server/
│   │   └── resources/
│   │       ├── costume-service.ts          # Costume CRUD operations
│   │       ├── crew-service.ts             # Crew CRUD operations
│   │       ├── equipment-service.ts        # Equipment CRUD operations
│   │       ├── prop-service.ts             # Prop CRUD operations
│   │       ├── location-service.ts         # Location CRUD operations
│   │       └── photo-service.ts            # Photo upload/compression
│   ├── types/
│   │   └── resources.ts                    # Resource type definitions
│   └── utils/
│       ├── lifecycle-states.ts             # Lifecycle state definitions & validation
│       └── resource-search.ts              # Search/filter utilities
│
supabase/
└── migrations/
    └── [timestamp]_resource_management.sql # Database schema for all resources

tests/
├── unit/
│   ├── services/
│   │   ├── costume-service.test.ts
│   │   ├── crew-service.test.ts
│   │   └── photo-service.test.ts
│   └── utils/
│       └── lifecycle-states.test.ts
├── integration/
│   └── resources/
│       ├── costume-crud.test.ts
│       └── photo-upload.test.ts
└── e2e/
    ├── costume-management.spec.ts
    ├── crew-management.spec.ts
    └── resource-search.spec.ts
```

**Structure Decision**: SvelteKit web application with file-based routing. All resource types follow consistent patterns:
- `(auth)` route group for authenticated pages
- Separate routes for each resource type (costumes, crew, equipment, props, locations)
- Shared components in `lib/components/resources/`
- Server-side services in `lib/server/resources/`
- Database migrations in `supabase/migrations/`
- Comprehensive test coverage (unit, integration, E2E)

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Real-time collaboration deferred | MVP focuses on foundational CRUD; real-time adds significant complexity (WebSocket subscriptions, conflict resolution, optimistic updates) | Immediate sync not critical for resource management; users can refresh to see updates. Will add in Phase 2 after validating core functionality. |

**Justification**: Deferring real-time collaboration allows faster MVP delivery while still meeting all other constitutional requirements. Resource management is primarily individual/async work (adding costumes, updating inventory) rather than simultaneous collaborative editing.

---

## UI Refactoring (October 23, 2025)

### Current State
All 5 resource list pages have been improved with:
- ✅ Stats cards at top (4 per page)
- ✅ ThemedCard sections
- ✅ Better empty states
- ✅ Info boxes at bottom
- ✅ Theme-compliant styling

### Identified Improvements

**1. Shared Layout Component**
- Created `ResourceListLayout.svelte` - provides consistent structure for all resource pages
- Created `StatCard.svelte` - reusable stat card component
- Benefits: Reduces code duplication, ensures consistency, easier maintenance

**2. Help Icon Instead of Info Box**
- Replace bottom info card with (?) icon next to title
- Shows tooltip on hover with same information
- Cleaner, less cluttered UI

**3. Enhanced Filtering**
- Add filter components to all pages (currently only Costumes and Crew have filters)
- Equipment: Filter by type, condition, ownership
- Props: Filter by type, status, character/series  
- Locations: Filter by type, favorites

**4. Actionable Stats**
- Make stat cards clickable to filter by that metric
- Add trend indicators (up/down)
- Customize metrics per resource type for more relevance

### Migration Plan

**Phase 1: Shared Components** ✅
- [x] Create ResourceListLayout.svelte
- [x] Create StatCard.svelte

**Phase 2: Refactor Pages**
- [ ] Refactor one page as example (Equipment)
- [ ] Apply to remaining pages (Costumes, Crew, Props, Locations)
- [ ] Remove info boxes, add help icons

**Phase 3: Add Filters**
- [ ] Create FilterBar component
- [ ] Add to Equipment, Props, Locations
- [ ] Wire up server-side filtering

**Phase 4: Enhance Stats**
- [ ] Make stats clickable
- [ ] Add trend indicators
- [ ] Improve relevance per resource type

