# Research: Resource Management System

**Feature**: 045-resource-management  
**Date**: October 21, 2025  
**Phase**: 0 - Research & Technology Decisions

## Overview

This document consolidates research findings and technology decisions for the Resource Management System. All technical unknowns from the plan have been resolved through best practices research and constitutional requirements.

---

## Research Areas

### 1. Photo Upload & Compression Strategy

**Decision**: Use Supabase Storage with client-side compression before upload

**Rationale**:
- Supabase Storage provides secure, scalable file storage with RLS policies
- Client-side compression reduces bandwidth and storage costs
- Browser-native Canvas API can compress images before upload
- Maintains quality while reducing file size by 60-80%
- No server-side processing required (reduces complexity)

**Implementation Approach**:
- Use `browser-image-compression` library (lightweight, well-maintained)
- Compress to max 1920px width, 85% quality, convert to WebP format
- Generate thumbnails (400px width) for list views
- Store original filename and metadata in database
- Supabase Storage path: `{teamId}/resources/{resourceType}/{resourceId}/{photoId}.webp`

**Alternatives Considered**:
- Server-side compression with Sharp: Rejected due to added server complexity and cost
- No compression: Rejected due to storage costs and slow load times on 3G
- Third-party CDN (Cloudinary): Rejected due to cost for MVP, can migrate later

---

### 2. Real-Time Search Implementation

**Decision**: PostgreSQL full-text search with debounced client-side queries

**Rationale**:
- PostgreSQL `tsvector` and `ts_rank` provide fast full-text search
- No additional dependencies (built into Supabase/PostgreSQL)
- 300ms debounce prevents excessive queries while typing
- Can index multiple columns (name, description, character, series)
- Scales to thousands of records without performance issues

**Implementation Approach**:
- Create `tsvector` column combining searchable fields
- Create GIN index on tsvector column for fast lookups
- Use `websearch_to_tsquery` for natural language queries
- Client-side: Svelte store with debounced search function
- Return top 50 results ranked by relevance

**SQL Example**:
```sql
ALTER TABLE costumes ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(character_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(series, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(notes, '')), 'C')
  ) STORED;

CREATE INDEX idx_costumes_search ON costumes USING GIN(search_vector);
```

**Alternatives Considered**:
- Algolia/Meilisearch: Rejected due to cost and complexity for MVP
- Client-side filtering: Rejected due to poor performance with 50+ items
- LIKE queries: Rejected due to poor performance and no ranking

---

### 3. Lifecycle State Validation & Transitions

**Decision**: Finite state machine with allowed transitions map

**Rationale**:
- Prevents invalid state transitions (e.g., Sold → In Progress)
- Clear, testable transition rules
- Easy to extend with new states
- Supports override confirmation for corrections
- Aligns with constitutional requirement for lifecycle tracking

**Implementation Approach**:
- Define allowed transitions in `lifecycle-states.ts`
- Validate transitions server-side before saving
- Return allowed next states to client for UI
- Show confirmation dialog for unusual transitions
- Track state history with timestamps in JSONB column

**Transition Map Example**:
```typescript
const ALLOWED_TRANSITIONS = {
  planned: ['acquiring', 'in-progress', 'cancelled'],
  acquiring: ['in-progress', 'planned'],
  'in-progress': ['ready', 'acquiring', 'paused'],
  ready: ['owned', 'in-progress'],
  owned: ['sold', 'damaged', 'loaned', 'stored', 'lost'],
  sold: [], // Terminal state (with override)
  damaged: ['owned', 'lost'], // Can repair or write off
  loaned: ['owned'], // Return from loan
  stored: ['owned'], // Retrieve from storage
  lost: [], // Terminal state
  rented: ['owned'] // Return rental
};
```

**Alternatives Considered**:
- No validation: Rejected due to data integrity concerns
- Strict validation without override: Rejected due to inflexibility for corrections
- Workflow engine (Temporal, etc.): Rejected as over-engineering for MVP

---

### 4. Soft Delete Implementation

**Decision**: `deleted_at` timestamp column with 6-month retention policy

**Rationale**:
- Preserves data for recovery and historical records
- Simple to implement (single column, filter in queries)
- Supports insurance claims and tax records
- Automatic cleanup with scheduled job
- No breaking changes to existing queries (add WHERE filter)

**Implementation Approach**:
- Add `deleted_at TIMESTAMPTZ` column to all resource tables
- Default queries filter `WHERE deleted_at IS NULL`
- Archive view queries `WHERE deleted_at IS NOT NULL`
- Scheduled job (Supabase Edge Function) runs daily to permanently delete records where `deleted_at < NOW() - INTERVAL '6 months'`
- Restore action sets `deleted_at = NULL`

**Database Migration**:
```sql
ALTER TABLE costumes ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;
CREATE INDEX idx_costumes_deleted ON costumes(deleted_at) WHERE deleted_at IS NOT NULL;
```

**Alternatives Considered**:
- Separate archive tables: Rejected due to schema duplication and complexity
- Hard delete only: Rejected due to data loss risk
- Infinite retention: Rejected due to storage costs and GDPR concerns

---

### 5. Crew Member Account Linking

**Decision**: Email-based suggestion with manual confirmation

**Rationale**:
- Prevents unwanted automatic connections
- Privacy-respecting (requires explicit consent)
- Helps discover existing accounts without forcing linkage
- Supports constitutional "External Crew Member Roles" requirement
- Simple UX: "Jane Smith (jane@example.com) has a Cosplans account - Link?"

**Implementation Approach**:
- When adding crew member, query `auth.users` by email
- If match found, show suggestion banner with user profile
- User clicks "Link Account" → creates `crew_account_links` record
- Linked crew members can be invited to shoots without joining team
- Unlinked crew members remain as contact directory entries

**Database Schema**:
```sql
CREATE TABLE crew_account_links (
  crew_member_id UUID REFERENCES crew_members(id),
  user_id UUID REFERENCES auth.users(id),
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (crew_member_id, user_id)
);
```

**Alternatives Considered**:
- Automatic linking: Rejected due to privacy concerns
- No linking in MVP: Rejected as it blocks shoot assignment features
- Require Cosplans account: Rejected as too restrictive for external collaborators

---

### 6. Bulk Operations Strategy

**Decision**: Client-side multi-select with server-side batch processing

**Rationale**:
- Improves UX for managing large inventories
- Reduces round trips (single API call for batch)
- Maintains transaction integrity (all or nothing)
- Simple implementation with PostgreSQL transactions

**Implementation Approach**:
- Client: Checkbox selection with "Select All" option
- Bulk actions: Delete, Change Status, Export CSV
- Server: Single endpoint `/api/resources/{type}/bulk` accepting array of IDs
- Use PostgreSQL transaction to ensure atomicity
- Return success/failure count and error details

**API Example**:
```typescript
POST /api/resources/costumes/bulk
{
  "action": "update_status",
  "ids": ["uuid1", "uuid2", "uuid3"],
  "data": { "status": "stored" }
}

Response:
{
  "success": 3,
  "failed": 0,
  "errors": []
}
```

**Alternatives Considered**:
- Individual requests: Rejected due to poor UX and performance
- Background jobs: Rejected as over-engineering for MVP (< 100 items typically)

---

### 7. Theme CSS Variables Integration

**Decision**: Use existing theme system with inline styles for all resource components

**Rationale**:
- Constitutional requirement: No hardcoded colors
- Existing theme system already implemented (sidebar navigation feature)
- Supports light/dark mode switching
- Consistent design across application
- Flowbite components can be styled with CSS variables

**Implementation Approach**:
- Use `var(--theme-background)`, `var(--theme-foreground)`, etc.
- Apply inline `style` attributes for theme colors
- Use Tailwind only for layout/spacing
- Lifecycle state badges use semantic colors: `var(--theme-success)`, `var(--theme-error)`, `var(--theme-warning)`
- Test all components in both light and dark modes

**Component Example**:
```svelte
<div 
  class="rounded-lg p-4"
  style="background: var(--theme-background); border: 1px solid var(--theme-border);"
>
  <h3 style="color: var(--theme-foreground);">Costume Name</h3>
  <span 
    class="px-2 py-1 rounded text-sm"
    style="background: var(--theme-success); color: white;"
  >
    Owned
  </span>
</div>
```

**Alternatives Considered**:
- Hardcoded Tailwind colors: Rejected due to constitutional violation
- CSS modules: Rejected due to added complexity and build configuration
- Styled components: Rejected as not idiomatic for Svelte

---

### 8. Mobile Responsiveness Strategy

**Decision**: Mobile-first responsive design with touch-optimized controls

**Rationale**:
- Constitutional requirement: Web-first with mobile-responsive architecture
- Most users will access on mobile during shoots/events
- Touch-friendly targets (min 44px) prevent mis-taps
- Responsive grid layouts adapt to screen size
- Progressive enhancement (desktop gets additional features)

**Implementation Approach**:
- Design for 375px mobile width first
- Use Tailwind responsive classes (`sm:`, `md:`, `lg:`)
- Touch targets minimum 44x44px (iOS/Android guidelines)
- Swipe gestures for photo galleries
- Bottom sheet modals on mobile, centered modals on desktop
- Sticky headers for long lists

**Breakpoints**:
- Mobile: < 768px (default)
- Tablet: 768px - 1024px (`md:`)
- Desktop: > 1024px (`lg:`)

**Alternatives Considered**:
- Desktop-first: Rejected as most usage is mobile
- Separate mobile app: Deferred to Phase 2 (Flutter)
- Native mobile web components: Rejected due to browser compatibility

---

## Technology Stack Summary

| Category | Technology | Justification |
|----------|-----------|---------------|
| **Framework** | SvelteKit 2.x | Constitutional requirement, SSR, file-based routing |
| **Language** | TypeScript 5.x | Type safety, better DX, industry standard |
| **Database** | PostgreSQL (Supabase) | Full-text search, JSONB, RLS policies |
| **Storage** | Supabase Storage | Secure file storage, RLS integration |
| **UI Components** | Flowbite Svelte | Pre-built components, theme-able, accessible |
| **Icons** | Lucide Svelte | Lightweight, tree-shakeable, consistent style |
| **Validation** | Zod | Runtime type checking, form validation |
| **Image Compression** | browser-image-compression | Client-side, lightweight, WebP support |
| **Testing** | Vitest + Playwright + Testing Library | Fast unit tests, reliable E2E, component testing |
| **Runtime** | Bun | Constitutional requirement, 3x faster installs |

---

## Open Questions Resolved

1. **Q: How to handle photo storage costs?**
   - A: Client-side compression reduces storage by 60-80%, WebP format, 10 photo limit per resource

2. **Q: How to prevent invalid lifecycle transitions?**
   - A: Finite state machine with allowed transitions map, server-side validation, override confirmation

3. **Q: How to implement real-time search without performance issues?**
   - A: PostgreSQL full-text search with GIN indexes, 300ms debounce, top 50 results

4. **Q: How to handle soft delete cleanup?**
   - A: Scheduled Edge Function runs daily, deletes records older than 6 months

5. **Q: How to link crew members to Cosplans accounts?**
   - A: Email-based suggestion with manual confirmation, separate `crew_account_links` table

6. **Q: How to ensure mobile responsiveness?**
   - A: Mobile-first design, touch-optimized controls (44px min), responsive Tailwind classes

---

## Next Steps

✅ **Phase 0 Complete** - All research questions resolved

**Proceed to Phase 1**:
1. Generate `data-model.md` with database schema for all 5 resource types
2. Create API contracts in `contracts/` directory
3. Generate `quickstart.md` with setup instructions
4. Update agent context with new technologies

**Key Deliverables for Phase 1**:
- Complete database schema with migrations
- OpenAPI/TypeScript contracts for all endpoints
- Developer quickstart guide
- Updated `.cascade/` context (if using Cascade AI)
