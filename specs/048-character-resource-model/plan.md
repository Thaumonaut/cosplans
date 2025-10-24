# Implementation Plan: Character-Centric Resource Model

**Branch**: `048-character-resource-model` | **Date**: October 24, 2025 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/048-character-resource-model/spec.md`

## Summary

This feature refactors the resource management system from a flat resource-list model to a character-centric organizational model. Character becomes the primary hub entity that all resources (costumes, wigs, props, accessories) link to. Wigs are promoted from accessories subcategory to a dedicated top-level resource with full project management (tasks, materials, cost tracking). Costumes are enhanced with version tracking, pattern files, and construction tasks. This architectural shift aligns with how cosplayers actually organize their work: by character first, then by individual resource components.

**Technical Approach**:
- New `characters` table with alias support (comma-separated), reference images (R2 URLs)
- Migrate existing wig data from `accessories` to new dedicated `wigs` table
- Add junction tables for many-to-many relationships (character-wig, character-prop, character-accessory)
- Add one-to-one relationship for character-costume
- Enhance `costumes` table with version field, pattern file URLs (R2), tasks
- Implement hybrid time tracking (automatic with manual override)
- Character completion calculation: simple count of completed resources / total resources

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+  
**Primary Dependencies**: SvelteKit 2.x, Supabase Client 2.x, Cloudflare R2 SDK  
**Storage**: PostgreSQL 15+ (Supabase), Cloudflare R2 (file storage)  
**Testing**: Vitest (unit tests), Playwright (E2E tests)  
**Target Platform**: Web (SvelteKit SSR), responsive mobile-first design  
**Project Type**: Web application with SvelteKit + Supabase backend  
**Performance Goals**: <2s character detail page load with 10+ resources, <500ms search across 100+ items, <1% accuracy for completion percentage  
**Constraints**: Character-centric navigation must work alongside direct resource access (backward compatibility), migration from accessories to wigs must be zero-downtime  
**Scale/Scope**: 5-30 characters per team average, 1-5 outfits per character, 1-3 wigs per character, 2-10 props per character

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Web-First with Mobile-Responsive Architecture
**Status**: PASS  
**Evidence**: Character detail page designed mobile-first with touch-friendly resource cards, responsive grid layouts for resource lists, optimized for 3-5 second loads on 3G connections

### ✅ Principle I.5: Reduce Overwhelm via Prioritization
**Status**: PASS  
**Evidence**: Character entity acts as brainstorming/Idea Bank for costume planning. Character completion percentage helps prioritize which character projects to focus on. Characters without resources serve as lightweight planning placeholders.

### ✅ Principle II.7: Community Trust & Accountability
**Status**: N/A (This feature does not interact with reputation system)

### ✅ Principle III: Team-Based Collaboration
**Status**: PASS  
**Evidence**: All characters, wigs, and resources are team-scoped. Character-centric organization enables better team coordination when multiple members work on different aspects of same character (one styles wig, another sews costume).

### ✅ Principle III.5: Flexible & Fair Monetization
**Status**: PASS  
**Evidence**: Character management available in free tier (supports 3 active projects limit). Enhanced features like pattern file storage use R2 (cost-optimized). No artificial limits on character brainstorming in Idea Bank.

### ✅ Principle VI.7: Spec-Driven Development Workflow
**Status**: PASS  
**Evidence**: This plan follows spec 048 with approved specification, clarifications documented, and phased implementation approach

### ✅ Principle VII.5: Dependency-First Development
**Status**: PASS  
**Evidence**: Migration order enforced: (1) Create character table, (2) Create wigs table, (3) Migrate wig data, (4) Add junction tables, (5) Update UI. Each phase depends on previous completion.

### ✅ Principle VIII.5: Solo Developer Efficiency & Cost Optimization
**Status**: PASS  
**Evidence**: Cloudflare R2 for all file storage (character references, wig progress photos, outfit patterns) optimizes costs vs Supabase Storage. Hybrid time tracking reduces complexity while maintaining flexibility. Simple count-based completion calculation minimizes computation.

**Overall Assessment**: ✅ **NO VIOLATIONS** - All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```
specs/048-character-resource-model/
├── plan.md              # This file
├── research.md          # R2 storage patterns, migration strategies
├── data-model.md        # Character, Wig entities, junction tables
├── quickstart.md        # Developer guide for character-centric model
└── contracts/           # API contracts for character CRUD, resource linking
    └── character-api.yaml
```

### Source Code (repository root)

```
src/
├── lib/
│   ├── components/
│   │   ├── characters/           # NEW: Character components
│   │   │   ├── CharacterCard.svelte
│   │   │   ├── CharacterDetail.svelte
│   │   │   ├── CharacterForm.svelte
│   │   │   ├── CharacterList.svelte
│   │   │   ├── CharacterAliasInput.svelte
│   │   │   └── CharacterCompletionBadge.svelte
│   │   ├── wigs/                 # NEW: Wig components (separated from accessories)
│   │   │   ├── WigCard.svelte
│   │   │   ├── WigDetail.svelte
│   │   │   ├── WigForm.svelte
│   │   │   ├── WigTaskList.svelte
│   │   │   ├── WigMaterialList.svelte
│   │   │   └── WigTimeTracker.svelte
│   │   ├── costumes/             # ENHANCED: Outfit version, patterns
│   │   │   ├── OutfitVersionInput.svelte
│   │   │   ├── PatternUploader.svelte
│   │   │   ├── OutfitTaskList.svelte
│   │   │   └── (existing costume components)
│   │   └── resource-linking/     # NEW: Cross-resource linking
│   │       ├── ResourcePicker.svelte
│   │       ├── CharacterResourceHub.svelte
│   │       └── LinkedResourceCard.svelte
│   ├── server/
│   │   ├── resources/
│   │   │   ├── character-service.ts      # NEW: Character CRUD
│   │   │   ├── wig-service.ts            # NEW: Wig CRUD
│   │   │   ├── costume-service.ts        # ENHANCED: Version, patterns
│   │   │   └── resource-linking-service.ts # NEW: Link management
│   │   └── migrations/
│   │       ├── create-characters-table.ts
│   │       ├── create-wigs-table.ts
│   │       ├── migrate-wigs-from-accessories.ts
│   │       ├── create-junction-tables.ts
│   │       └── enhance-costumes-table.ts
│   ├── stores/
│   │   ├── character.ts          # NEW: Character store
│   │   └── wig.ts                # NEW: Wig store
│   └── types/
│       ├── character.ts          # NEW: Character types
│       ├── wig.ts                # NEW: Wig types
│       └── resource-link.ts      # NEW: Linking types
└── routes/
    └── (auth)/
        ├── characters/           # NEW: Character pages
        │   ├── +page.svelte     # Character list
        │   ├── +page.server.ts
        │   ├── [id]/
        │   │   ├── +page.svelte # Character detail (hub)
        │   │   └── +page.server.ts
        │   └── new/
        │       ├── +page.svelte
        │       └── +page.server.ts
        ├── wigs/                 # NEW: Wig pages (separated)
        │   ├── +page.svelte
        │   ├── +page.server.ts
        │   └── [id]/
        │       ├── +page.svelte
        │       └── +page.server.ts
        └── costumes/             # ENHANCED: Version, patterns
            └── [id]/
                ├── +page.svelte  # Enhanced with version/patterns
                └── +page.server.ts

supabase/migrations/
├── [timestamp]_create_characters_table.sql
├── [timestamp]_create_wigs_table.sql
├── [timestamp]_migrate_wigs_from_accessories.sql
├── [timestamp]_create_character_junction_tables.sql
└── [timestamp]_enhance_costumes_table.sql

database/
└── migrations/
    └── 008_character_resource_model.sql  # Consolidated migration
```

**Structure Decision**: Web application structure using existing SvelteKit project layout. New character and wig functionality integrated into established patterns from spec 045 (Resource Management). Uses same component architecture, service layer, and routing structure for consistency.

## Complexity Tracking

**No constitutional violations to justify** - All checks pass.

## Phase 0: Research & Technical Decisions

See [research.md](./research.md) for detailed research findings covering:

1. **Cloudflare R2 Integration Patterns**
   - Upload workflow for character references, wig photos, pattern files
   - URL generation and access control
   - Migration from existing storage to R2

2. **Many-to-Many Relationship Patterns in PostgreSQL**
   - Junction table design for character-wig, character-prop, character-accessory
   - Query optimization for resource listing by character
   - Cascade delete behavior

3. **Data Migration Strategies**
   - Zero-downtime wig migration from accessories to dedicated table
   - Preserving foreign key relationships during migration
   - Rollback procedures

4. **Hybrid Time Tracking Implementation**
   - Automatic elapsed time calculation from status transitions
   - Manual override field design
   - UI/UX patterns for displaying both values

5. **Character Completion Calculation**
   - Efficient query for counting completed vs total resources
   - Real-time updates when resource status changes
   - Terminal state definitions per resource type

## Phase 1: Data Model & Contracts

### Data Model

See [data-model.md](./data-model.md) for complete entity definitions, including:

**New Entities**:
- `characters` - Main character entity with aliases, reference images
- `wigs` - Dedicated wig resource with tasks, materials, time tracking
- `character_wigs` - Many-to-many junction for character-wig links
- `character_props` - Many-to-many junction for character-prop links
- `character_accessories` - Many-to-many junction for character-accessory links
- `character_costumes` - One-to-one relationship for character-costume
- `wig_tasks` - Tasks for wig styling projects
- `wig_materials` - Material requirements for wigs
- `outfit_tasks` - Construction tasks for outfits

**Enhanced Entities**:
- `costumes` - Add: version (text), pattern_files (jsonb with R2 URLs), alteration_notes (text), time_spent_auto (integer), time_spent_manual (integer nullable)

### API Contracts

See [contracts/character-api.yaml](./contracts/character-api.yaml) for OpenAPI specification covering:

**Character Endpoints**:
- `POST /api/characters` - Create character
- `GET /api/characters` - List characters with completion percentages
- `GET /api/characters/:id` - Get character detail with all linked resources
- `PATCH /api/characters/:id` - Update character (aliases, metadata)
- `DELETE /api/characters/:id` - Delete character (auto-unlinks resources)

**Wig Endpoints**:
- `POST /api/wigs` - Create wig
- `GET /api/wigs` - List wigs with character links
- `GET /api/wigs/:id` - Get wig detail with tasks, materials
- `PATCH /api/wigs/:id` - Update wig (status, time override)
- `DELETE /api/wigs/:id` - Delete wig

**Resource Linking Endpoints**:
- `POST /api/characters/:id/link-costume` - Link costume to character
- `POST /api/characters/:id/link-wig` - Link wig to character (many-to-many)
- `POST /api/characters/:id/link-prop` - Link prop to character (many-to-many)
- `POST /api/characters/:id/link-accessory` - Link accessory to character
- `DELETE /api/characters/:id/unlink/:resourceType/:resourceId` - Unlink resource

**Enhanced Costume Endpoints**:
- `PATCH /api/costumes/:id` - Update with version, pattern files (R2 URLs), time override

### Quickstart Guide

See [quickstart.md](./quickstart.md) for developer onboarding covering:
- Character-centric navigation flow
- How to query characters with linked resources
- Wig creation and task management workflow
- Pattern file upload to R2
- Completion percentage calculation
- Migration procedures

## Migration Strategy

### Phase M1: Database Schema Creation
1. Create `characters` table with indexes on team_id, series, aliases
2. Create `wigs` table with indexes on team_id, status, character links
3. Create junction tables: `character_wigs`, `character_props`, `character_accessories`, `character_costumes`
4. Create `wig_tasks` and `wig_materials` tables
5. Create `outfit_tasks` table
6. Enhance `costumes` table: add version, pattern_files (jsonb), alteration_notes, time_spent_auto, time_spent_manual

### Phase M2: Data Migration
1. Identify wig records in `accessories` table (type = 'wig' or similar tag)
2. Migrate wig data to `wigs` table preserving IDs and relationships
3. Remove migrated wigs from `accessories` table
4. Update any foreign key references to point to `wigs` table

### Phase M3: UI Rollout
1. Deploy character pages (list, detail, form)
2. Deploy wig pages (separated from accessories)
3. Update sidebar navigation: Add "Characters", "Wigs"; remove wigs from "Accessories"
4. Update costume detail page with version field, pattern uploader
5. Add resource linking UI on character detail page

### Phase M4: Backward Compatibility
1. Maintain direct resource access URLs (existing bookmarks still work)
2. Add breadcrumbs showing character context when viewing resources
3. Resource pages show "Part of [Character Name]" when linked
4. Ensure search works across both character-centric and resource-centric views

## Testing Strategy

### Unit Tests
- Character service: CRUD operations, alias search, completion calculation
- Wig service: Task management, material tracking, time calculation
- Resource linking service: Many-to-many associations, unlink behavior
- Completion percentage calculator: Various resource combinations

### Integration Tests
- Character detail page loads with 10+ linked resources in <2 seconds
- Character deletion auto-unlinks all resources without data loss
- Wig status transitions (free transition between any statuses)
- Pattern file upload to R2 and association with costume

### E2E Tests
- Create character → link costume → link wig → verify completion percentage
- Create wig → add tasks → add materials → calculate total cost
- Search characters by alias → find correct character
- Delete character with resources → verify resources retained

## Performance Considerations

1. **Character Detail Page Load**: Optimize query to fetch character + all linked resources in single request using joins
2. **Completion Percentage**: Calculate on-demand but cache result, invalidate cache on resource status change
3. **Search**: Full-text search index on character name + aliases + series for <500ms response
4. **R2 File Access**: Use signed URLs with 1-hour expiration, cache URLs client-side
5. **Junction Table Queries**: Index foreign keys on both sides of many-to-many relationships

## Rollback Plan

If issues arise post-deployment:

1. **Database Rollback**: Migration scripts include `DOWN` procedures to reverse schema changes
2. **Wig Migration Reversal**: Re-insert wigs into accessories table from backup, delete wigs table
3. **UI Rollback**: Revert to previous SvelteKit build via git tag
4. **Data Integrity**: Character deletions are soft-deletes (6-month retention), can be restored

## Success Metrics

- Character detail page loads in <2 seconds with 10 linked resources (SC-004)
- Completion percentage accurate within 1%, updates within 500ms (SC-006)
- Character search returns results in <500ms for 100+ items (SC-009)
- Pattern file uploads complete in <10 seconds for 5MB files (SC-012)
- Zero data loss on character deletion or wig migration (SC-014)
- Users report 40% time reduction finding resources via character hub (SC-010)

## Dependencies

- Cloudflare R2 bucket created and configured with API credentials
- Supabase PostgreSQL database with sufficient storage for new tables
- Migration window for zero-downtime wig migration (estimate: 30 minutes)
- SvelteKit application deployed with R2 SDK installed
- Team management system functional (all resources remain team-scoped)

## Next Steps

After this plan is approved:

1. Run `/speckit.tasks` to break down implementation into actionable tasks
2. Priority order: M1 (schema) → M2 (migration) → Phase 0 (character pages) → Phase 1 (wig pages) → Phase 2 (enhanced costumes) → Phase 3 (resource linking)
3. Each task should be independently testable and < 4 hours
4. Migration tasks executed during low-traffic maintenance window
