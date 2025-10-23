# Tasks: Resource Management System Implementation

**Feature**: 045-resource-management
**Generated**: October 22, 2025
**Status**: Ready for Implementation

## Overview

This document defines the complete implementation plan for the Resource Management System. Tasks are organized by user story to enable independent development and testing, with clear dependencies and parallel execution opportunities.

**Total User Stories**: 6 (US1-US6)
**Priority Order**: US1, US2 (P1) → US6, US3, US4 (P2) → US5 (P3)
**Independent Testing**: Each user story can be implemented and tested independently

---

## Phase 1: Setup *(Project Initialization)*

Initialize project structure and dependencies for resource management system.

- [x] T001 Install browser-image-compression for photo uploads
- [x] T002 Install additional Zod validation schemas for resource types
- [x] T003 Create src/lib/types/resources.ts for TypeScript definitions
- [x] T004 Create src/lib/utils/lifecycle-states.ts for state machine validation

---

## Phase 2: Foundational *(Blocking Infrastructure)*

Implement core infrastructure required by all resource types before user story development.

- [x] T005 Create database migration for all 8 resource management tables
- [x] T006 Create Supabase Storage bucket for resource photos with RLS policies
- [x] T007 Create src/lib/components/resources/ResourceCard.svelte base component
- [x] T008 Create src/lib/components/resources/ResourceList.svelte with search/filter
- [x] T009 Create src/lib/components/resources/PhotoUpload.svelte with compression
- [x] T010 Create src/lib/components/resources/LifecycleStateBadge.svelte
- [x] T011 Create src/lib/server/resources/photo-service.ts for upload/compression
- [x] T012 Create src/lib/utils/resource-search.ts for full-text search utilities

---

## Phase 3: US1 - Manage Costume Inventory *(P1 Priority)*

Implement costume management with full lifecycle tracking, photos, and search.

**Goal**: Users can track costumes through complete lifecycle with photos and details  
**Independent Test**: Create costume → add photos → set lifecycle states → search/filter → view details

- [x] T013 [US1] Create src/routes/(auth)/costumes/+page.svelte list view
- [x] T014 [US1] Create src/routes/(auth)/costumes/+page.server.ts with search/filter
- [x] T015 [US1] Create src/routes/(auth)/costumes/new/+page.svelte form
- [x] T016 [US1] Create src/routes/(auth)/costumes/new/+page.server.ts create action
- [x] T017 [US1] Create src/routes/(auth)/costumes/[id]/+page.svelte detail/edit view
- [x] T018 [US1] Create src/routes/(auth)/costumes/[id]/+page.server.ts loader & actions
- [x] T019 [US1] Create src/lib/server/resources/costume-service.ts CRUD operations
- [x] T020 [US1] Create CostumeCard.svelte extending ResourceCard with lifecycle states
- [x] T021 [US1] Implement costume lifecycle state transitions with validation
- [x] T022 [US1] Add costume search with PostgreSQL full-text search
- [ ] T023 [US1] Implement costume photo upload with compression
- [x] T024 [US1] Add costume availability status calculation (available/unavailable)
- [ ] T025 [US1] Create costume bulk operations (multi-select, bulk status changes)

---

## Phase 4: US2 - Manage Crew Directory *(P1 Priority)*

Implement crew member management with contact info, roles, and account linking.

**Goal**: Teams can maintain directory of external collaborators with contact details  
**Independent Test**: Add crew → set roles → search/filter → view contact info → link accounts

- [x] T026 [US2] Create src/routes/(auth)/crew/+page.svelte directory view
- [x] T027 [US2] Create src/routes/(auth)/crew/+page.server.ts with role filtering
- [x] T028 [US2] Create src/routes/(auth)/crew/new/+page.svelte add crew form
- [x] T029 [US2] Create src/routes/(auth)/crew/new/+page.server.ts create action
- [x] T030 [US2] Create src/routes/(auth)/crew/[id]/+page.svelte detail/edit view
- [x] T031 [US2] Create src/routes/(auth)/crew/[id]/+page.server.ts loader & actions
- [x] T032 [US2] Create src/lib/server/resources/crew-service.ts CRUD operations
- [ ] T033 [US2] Create CrewCard.svelte with role badges and contact info
- [x] T034 [US2] Implement crew role filtering (photographer, assistant, etc.)
- [x] T035 [US2] Add click-to-email and click-to-call functionality
- [x] T036 [US2] Implement favorite crew member functionality
- [ ] T037 [US2] Create crew account linking with email-based suggestions
- [ ] T038 [US2] Create crew_account_links table and RLS policies

---

## Phase 5: US6 - Resource Lifecycle Tracking *(P2 - Supports US1/US4)*

Implement comprehensive lifecycle tracking system for costumes and props.

**Goal**: Track complete resource lifecycle with state transitions and history  
**Independent Test**: Transition through all states → view history → override transitions

- [ ] T039 [US6] Create src/lib/utils/lifecycle-states.ts with transition rules
- [ ] T040 [US6] Create lifecycle_history table and triggers
- [ ] T041 [US6] Implement state transition validation in costume-service
- [ ] T042 [US6] Add lifecycle state override confirmation dialogs
- [ ] T043 [US6] Create lifecycle timeline component for resource detail views
- [ ] T044 [US6] Implement state-specific metadata tracking (sale price, damage cost, etc.)
- [ ] T045 [US6] Add lifecycle history view to costume and prop detail pages

---

## Phase 6: US3 - Manage Equipment Inventory *(P2 Priority)*

Implement equipment tracking with condition, ownership, and checklists.

**Goal**: Track photography gear with condition, ownership, and availability  
**Independent Test**: Add equipment → set condition/ownership → create checklists → track availability

- [ ] T046 [US3] Create src/routes/(auth)/equipment/+page.svelte inventory view
- [ ] T047 [US3] Create src/routes/(auth)/equipment/+page.server.ts with condition filtering
- [ ] T048 [US3] Create src/routes/(auth)/equipment/new/+page.svelte add equipment form
- [ ] T049 [US3] Create src/routes/(auth)/equipment/new/+page.server.ts create action
- [ ] T050 [US3] Create src/routes/(auth)/equipment/[id]/+page.svelte detail/edit view
- [ ] T051 [US3] Create src/routes/(auth)/equipment/[id]/+page.server.ts loader & actions
- [ ] T052 [US3] Create src/lib/server/resources/equipment-service.ts CRUD operations
- [ ] T053 [US3] Create EquipmentCard.svelte with condition and ownership badges
- [ ] T054 [US3] Implement equipment condition tracking (excellent, good, needs repair)
- [ ] T055 [US3] Add ownership status filtering (owned, rented, borrowed)
- [ ] T056 [US3] Create equipment checklist functionality for shoots
- [ ] T057 [US3] Implement equipment availability calculation

---

## Phase 7: US4 - Manage Props Catalog *(P2 Priority)*

Implement props tracking with lifecycle states and storage locations.

**Goal**: Track costume accessories with lifecycle and storage management  
**Independent Test**: Add props → set lifecycle states → track storage → search by character

- [ ] T058 [US4] Create src/routes/(auth)/props/+page.svelte catalog view
- [ ] T059 [US4] Create src/routes/(auth)/props/+page.server.ts with lifecycle filtering
- [ ] T060 [US4] Create src/routes/(auth)/props/new/+page.svelte add prop form
- [ ] T061 [US4] Create src/routes/(auth)/props/new/+page.server.ts create action
- [ ] T062 [US4] Create src/routes/(auth)/props/[id]/+page.svelte detail/edit view
- [ ] T063 [US4] Create src/routes/(auth)/props/[id]/+page.server.ts loader & actions
- [ ] T064 [US4] Create src/lib/server/resources/prop-service.ts CRUD operations
- [ ] T065 [US4] Create PropCard.svelte with lifecycle and storage badges
- [ ] T066 [US4] Implement prop lifecycle state tracking (shared with costumes)
- [ ] T067 [US4] Add character/series filtering for props
- [ ] T068 [US4] Implement storage location tracking for props
- [ ] T069 [US4] Add prop availability calculation based on lifecycle state

---

## Phase 8: US5 - Manage Location Library *(P3 Priority)*

Implement location tracking with photos, addresses, and accessibility notes.

**Goal**: Maintain library of shoot locations with photos and details  
**Independent Test**: Add locations → upload photos → filter by type → view accessibility info

- [ ] T070 [US5] Create src/routes/(auth)/locations/+page.svelte library view
- [ ] T071 [US5] Create src/routes/(auth)/locations/+page.server.ts with type filtering
- [ ] T072 [US5] Create src/routes/(auth)/locations/new/+page.svelte add location form
- [ ] T073 [US5] Create src/routes/(auth)/locations/new/+page.server.ts create action
- [ ] T074 [US5] Create src/routes/(auth)/locations/[id]/+page.svelte detail/edit view
- [ ] T075 [US5] Create src/routes/(auth)/locations/[id]/+page.server.ts loader & actions
- [ ] T076 [US5] Create src/lib/server/resources/location-service.ts CRUD operations
- [ ] T077 [US5] Create LocationCard.svelte with photos and accessibility notes
- [ ] T078 [US5] Implement location type filtering (studio, outdoor, convention)
- [ ] T079 [US5] Add favorite location functionality
- [ ] T080 [US5] Implement address validation and map preview
- [ ] T081 [US5] Add parking and accessibility notes display

---

## Phase 9: Integration & Polish *(Cross-Cutting Concerns)*

Implement shared functionality and polish all resource types together.

- [ ] T082 Create src/lib/components/resources/ResourceDeleteDialog.svelte for soft delete
- [ ] T083 Implement bulk operations for all resource types (multi-select, bulk actions)
- [ ] T084 Create unified search across all resource types with 300ms debounce
- [ ] T085 Add soft delete functionality with 6-month retention to all services
- [ ] T086 Create archive view for deleted resources within retention period
- [ ] T087 Implement CSV export functionality for all resource types
- [ ] T088 Add resource usage statistics dashboard
- [ ] T089 Create responsive mobile-first design for all resource pages
- [ ] T090 Implement theme CSS variables for all resource components
- [ ] T091 Add keyboard navigation and accessibility features
- [ ] T092 Create comprehensive loading states and error handling

---

## Phase 10: Testing *(Optional - TDD Approach)*

Write tests for all implemented functionality.

- [ ] T093 [P] Create unit tests for costume-service.ts lifecycle validation
- [ ] T094 [P] Create unit tests for crew-service.ts CRUD operations
- [ ] T095 [P] Create unit tests for photo-service.ts compression and upload
- [ ] T096 [P] Create unit tests for lifecycle-states.ts transition rules
- [ ] T097 [P] Create integration tests for resource search functionality
- [ ] T098 [P] Create E2E tests for costume creation and lifecycle transitions
- [ ] T099 [P] Create E2E tests for crew member management and linking
- [ ] T100 [P] Create component tests for ResourceCard and ResourceList

---

## Dependencies

**Sequential Dependencies** (must complete in order):
```
Setup → Foundational → US1 (Costumes) → US6 (Lifecycle)
                                      → US2 (Crew)
                                      → US3 (Equipment) → US4 (Props)
                                      → US5 (Locations)
                                      → Integration & Polish
```

**Parallel Opportunities** (can run simultaneously):
- [P] Multiple resource types can be developed in parallel after foundational phase
- [P] Test tasks can run parallel to implementation
- [P] Component development for different resource types
- [P] Database migrations and service layer development

**Independent User Stories** (can be developed/tested separately):
- ✅ US1 (Costumes): Fully independent MVP
- ✅ US2 (Crew): Independent crew management
- ✅ US3 (Equipment): Independent equipment tracking
- ✅ US4 (Props): Independent prop catalog
- ✅ US5 (Locations): Independent location library
- ✅ US6 (Lifecycle): Supports US1 and US4 but independent

---

## Implementation Strategy

**MVP Scope**: Implement US1 (Costume Management) first as complete, independent feature

**Development Order**:
1. **Phase 1-2**: Setup and foundational infrastructure (blocking)
2. **Phase 3-4**: US1 and US2 (P1 priorities - costume and crew management)
3. **Phase 5**: US6 (Lifecycle - supports costumes and props)
4. **Phase 6-7**: US3 and US4 (P2 priorities - equipment and props)
5. **Phase 8**: US5 (P3 priority - locations)
6. **Phase 9-10**: Integration, polish, and testing

**File Structure**: Follow plan.md project structure with shared components in `src/lib/components/resources/` and services in `src/lib/server/resources/`

**Testing Approach**: Each user story is independently testable. Implement US1 first as complete MVP, then add other stories incrementally.

**Quality Gates**:
- Each phase must pass before proceeding to next phase
- Each user story must be independently testable
- All tasks in a story must complete before marking story complete
- Integration phase validates all stories work together

---

## Success Criteria

**Per User Story**:
- [ ] US1: Users can manage costumes through complete lifecycle with photos
- [ ] US2: Teams can maintain crew directory with contact info and roles
- [ ] US3: Users can track equipment with condition and availability
- [ ] US4: Users can catalog props with lifecycle and storage tracking
- [ ] US5: Users can maintain location library with photos and accessibility
- [ ] US6: Complete lifecycle tracking with history and state validation

**System-Wide**:
- [ ] All 5 resource types fully functional with shared UI patterns
- [ ] Real-time search works across all resource types
- [ ] Photo upload with compression functional for all types
- [ ] Mobile-responsive design with touch-optimized controls
- [ ] Theme system integration (no hardcoded colors)
- [ ] Soft delete and bulk operations working
- [ ] CSV export functionality
- [ ] Performance meets requirements (2s page load, 1s photo load, 300ms search)

---

## Next Steps

1. **Start with Phase 1-2**: Complete setup and foundational infrastructure
2. **Implement US1 first**: Costume management as independent MVP
3. **Add US2**: Crew management for shoot planning foundation
4. **Continue with remaining stories**: US6, US3, US4, US5 in priority order
5. **Integration & testing**: Ensure all stories work together seamlessly

**Ready for Implementation**: ✅ All dependencies clear, tasks specific, file paths defined
