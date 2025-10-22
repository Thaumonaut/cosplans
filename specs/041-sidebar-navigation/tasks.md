# Tasks: Sidebar Navigation & App Layout

**Feature**: Sidebar Navigation & App Layout  
**Branch**: `implement/041-sidebar-navigation`  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Summary

Implement adaptive sidebar navigation system with smart/dynamic layouts, auto-hide overflow menu, and preference system.

**Total Tasks**: 89 tasks
- Phase 1 (Setup): 12 tasks
- Phase 2 (Foundational): 15 tasks  
- Phase 3 (Scenario 1 - Team Lead): 12 tasks
- Phase 4 (Scenario 2 - Mobile): 10 tasks
- Phase 5 (Scenario 3 - Discovery): 8 tasks
- Phase 6 (Scenario 4 - Notifications): 8 tasks
- Phase 7 (Scenario 5 - Quick Actions): 6 tasks
- Phase 8 (Adaptive Navigation Q8-Q13): 12 tasks
- Phase 9 (Polish): 6 tasks

**Parallel Opportunities**: 45+ tasks can run in parallel

**MVP Scope**: Scenario 1 (Team Lead Navigation) - Core sidebar with team switcher

---

## Phase 1: Setup & Dependencies

**Goal**: Install dependencies, create database schema, set up foundational types and stores

- [x] T001 Install lucide-svelte via Bun: `bun add lucide-svelte`
- [x] T002 [P] Create navigation types in `src/lib/types/navigation.ts`
- [x] T003 [P] Create theme types in `src/lib/types/theme.ts`
- [x] T004 Create database migration `supabase/migrations/[timestamp]_navigation_preferences.sql` with columns from plan
- [x] T005 Run migration and verify rollback capability (migration ready for hosted Supabase)
- [x] T006 [P] Create navigation store in `src/lib/stores/navigation.ts`
- [x] T007 [P] Create theme store in `src/lib/stores/theme.ts`
- [x] T008 [P] Create forms store in `src/lib/stores/forms.ts`
- [x] T009 Create navigation items config in `src/lib/utils/navigation-items.ts` with showInPersonalTeam/showInSharedTeam flags
- [x] T010 [P] Create theme variants in `src/lib/utils/theme-variants.ts`
- [ ] T011 [P] Write unit tests for navigation store in `tests/unit/stores/navigation.test.ts`
- [ ] T012 [P] Write unit tests for theme store in `tests/unit/stores/theme.test.ts`

---

## Phase 2: Foundational Components

**Goal**: Build core reusable components that all scenarios depend on

- [x] T013 [P] Create Sidebar container in `src/lib/components/layout/Sidebar.svelte`
- [x] T014 [P] Create SidebarSection wrapper in `src/lib/components/layout/SidebarSection.svelte`
- [x] T015 [P] Create NavigationItem component in `src/lib/components/layout/NavigationItem.svelte`
- [x] T016 [P] Create MobileMenuToggle in `src/lib/components/layout/MobileMenuToggle.svelte`
- [x] T017 Create (auth) route group layout in `src/routes/(auth)/+layout.svelte` with Sidebar
- [x] T018 Create (auth) layout loader in `src/routes/(auth)/+layout.ts` for user/team/permissions
- [ ] T019 Create (public) route group layout in `src/routes/(public)/+layout.svelte` without Sidebar (deferred - not critical for MVP)
- [x] T020 Move dashboard to `src/routes/(auth)/dashboard/+page.svelte`
- [x] T021 [P] Create Planning page in `src/routes/(auth)/planning/+page.svelte` (Q9)
- [x] T022 [P] Create Active Projects page in `src/routes/(auth)/active-projects/+page.svelte` (Q10)
- [x] T023 [P] Create Archive page in `src/routes/(auth)/archive/+page.svelte` (Q10)
- [x] T024 [P] Create Characters & Costumes page in `src/routes/(auth)/characters-costumes/+page.svelte` (Q10 - inventory)
- [x] T025 [P] Create Settings Navigation page in `src/routes/(auth)/settings/navigation/+page.svelte` (Q12, Q13)
- [ ] T026 Write component tests for Sidebar in `tests/unit/components/layout/Sidebar.test.ts`
- [ ] T027 Write component tests for NavigationItem in `tests/unit/components/layout/NavigationItem.test.ts`

---

## Phase 3: Scenario 1 - Team Lead Navigation (P1)

**Story Goal**: Team leads can quickly navigate between features with team context awareness

**Independent Test**: 
- Sidebar visible on page load with team name
- Current page highlighted
- Team switcher loads other teams
- Navigation items have icons

**Acceptance Criteria**:
1. ✅ Sidebar immediately visible with team name and member avatars
2. ✅ Can navigate to Dashboard, Planning, Active Projects, Gallery without scrolling
3. ✅ Active page is highlighted
4. ✅ Can switch teams via dropdown without full page navigation

- [x] T028 [S1] Create TeamSwitcher component in `src/lib/components/layout/TeamSwitcher.svelte`
- [ ] T029 [S1] Connect TeamSwitcher to team store for loading teams
- [ ] T030 [S1] Implement team switch handler with smart redirect logic
- [ ] T031 [S1] Add team member avatars to TeamSwitcher dropdown
- [ ] T032 [P] [S1] Create UserMenu component in `src/lib/components/layout/UserMenu.svelte`
- [ ] T033 [S1] Add user profile link and sign-out action to UserMenu
- [ ] T034 [S1] Implement active page highlighting in NavigationItem based on current route
- [ ] T035 [S1] Wire navigation store to track active item
- [ ] T036 [S1] Add sticky positioning (250-280px width) to Sidebar for desktop
- [ ] T037 [S1] Add Lucide icons to all navigation items
- [ ] T038 [P] [S1] Write E2E test for team switching in `tests/e2e/team-switching.spec.ts`
- [ ] T039 [P] [S1] Write E2E test for navigation highlighting in `tests/e2e/navigation.spec.ts`

---

## Phase 4: Scenario 2 - Mobile User Navigation (P1)

**Story Goal**: Mobile users can navigate efficiently without sacrificing screen space

**Independent Test**:
- Sidebar collapses on mobile breakpoint
- Hamburger menu toggles sidebar
- Content reflows properly
- Touch targets are 44px minimum

**Acceptance Criteria**:
1. ✅ Sidebar collapses to icon-only on mobile (<768px)
2. ✅ Hamburger menu available to expand sidebar
3. ✅ Easy one-handed navigation
4. ✅ Quick access to critical features

- [ ] T040 [S2] Implement mobile overlay pattern in Sidebar (fixed position, backdrop)
- [ ] T041 [S2] Add hamburger menu toggle functionality to MobileMenuToggle
- [ ] T042 [S2] Implement swipe-to-close gesture for mobile sidebar
- [ ] T043 [S2] Add focus trap when mobile sidebar is open
- [ ] T044 [S2] Implement backdrop click to close sidebar
- [ ] T045 [S2] Ensure touch targets are minimum 44x44px
- [ ] T046 [S2] Add mobile-specific styles for navigation items
- [ ] T047 [S2] Test content reflow when sidebar opens/closes
- [ ] T048 [P] [S2] Write E2E test for mobile overlay in `tests/e2e/mobile-overlay.spec.ts`
- [ ] T049 [P] [S2] Write E2E test for swipe gesture in `tests/e2e/mobile-gestures.spec.ts`

---

## Phase 5: Scenario 3 - Feature Discovery (P2)

**Story Goal**: New users can easily discover and understand available features

**Independent Test**:
- All main features listed in sidebar
- Logical grouping visible
- Icons are consistent
- Tooltips appear on hover

**Acceptance Criteria**:
1. ✅ All available features visible in sidebar
2. ✅ Features grouped logically (Main, Resources, Settings)
3. ✅ Icons help identify features
4. ✅ Tooltips explain feature purpose

- [ ] T050 [S3] Organize navigation items into sections (Main, Resources, Settings) in navigation-items.ts
- [ ] T051 [S3] Add section headers to SidebarSection component
- [ ] T052 [S3] Implement tooltips on NavigationItem hover
- [ ] T053 [S3] Add aria-label attributes to all navigation items
- [ ] T054 [S3] Ensure consistent icon sizing (20-22px)
- [ ] T055 [S3] Add descriptive text to tooltips for each feature
- [ ] T056 [P] [S3] Write accessibility test for tooltips in `tests/e2e/accessibility.spec.ts`
- [ ] T057 [P] [S3] Run Lighthouse accessibility audit and address issues

---

## Phase 6: Scenario 4 - Real-time Notifications (P2)

**Story Goal**: Users see important updates without leaving current page

**Independent Test**:
- Badge appears on notification trigger
- Count updates in real-time
- Badge clears when items read
- Navigation works correctly

**Acceptance Criteria**:
1. ✅ Notification badge appears on Messages/Notifications item
2. ✅ Unread count is displayed
3. ✅ Clicking navigates to feature with unread items highlighted
4. ✅ Badge disappears when all items read

- [ ] T058 [S4] Add badge prop to NavigationItem component
- [ ] T059 [S4] Update NavigationItem to display badge count
- [ ] T060 [S4] Update realtime store in `src/lib/stores/realtime.ts` to track unread counts
- [ ] T061 [S4] Wire WebSocket subscriptions for Messages unread count
- [ ] T062 [S4] Wire WebSocket subscriptions for Tasks unread count
- [ ] T063 [S4] Implement badge clear logic when visiting page
- [ ] T064 [P] [S4] Write E2E test for notification badges in `tests/e2e/notifications.spec.ts`
- [ ] T065 [P] [S4] Write unit test for realtime store badge logic in `tests/unit/stores/realtime.test.ts`

---

## Phase 7: Scenario 5 - Quick Actions (P2)

**Story Goal**: Users can create new items quickly from sidebar

**Independent Test**:
- "+ New" button visible in sidebar
- Clicking opens modal
- Can cancel without navigation
- Quick action completes without full page navigation

**Acceptance Criteria**:
1. ✅ Sidebar has prominent "+ New Shoot" button
2. ✅ Clicking opens modal
3. ✅ Can cancel and return to sidebar
4. ✅ Quick action completes without navigation

- [ ] T066 [S5] Add quick action button to Sidebar header
- [ ] T067 [S5] Create QuickActionModal component in `src/lib/components/layout/QuickActionModal.svelte`
- [ ] T068 [S5] Implement modal open/close logic
- [ ] T069 [S5] Add "New Shoot" action to modal
- [ ] T070 [S5] Implement form submission without page navigation
- [ ] T071 [P] [S5] Write E2E test for quick actions in `tests/e2e/quick-actions.spec.ts`

---

## Phase 8: Adaptive Navigation (Q8-Q13) (P1)

**Story Goal**: Navigation adapts to user context and preferences

**Independent Test**:
- Personal team shows simplified nav
- Shared team shows full nav
- Unused sections move to "More..." after 30 days
- Users can pin/unpin sections
- Preferences sync across devices

**Acceptance Criteria**:
1. ✅ Personal team: simplified navigation (hides team features)
2. ✅ Shared team: full navigation
3. ✅ Auto-hide unused sections after 30 days
4. ✅ "More..." overflow menu for hidden sections
5. ✅ Manual pin/unpin control
6. ✅ Global + per-team preference overrides

- [ ] T072 [S8] Implement adaptive navigation logic in navigation store based on team.is_personal
- [ ] T073 [S8] Add showInPersonalTeam/showInSharedTeam filtering to navigation-items.ts
- [ ] T074 [S8] Create OverflowMenu component in `src/lib/components/layout/OverflowMenu.svelte` for "More..."
- [ ] T075 [S8] Implement auto-hide logic based on last_accessed_sections (30 days)
- [ ] T076 [S8] Add pin/unpin functionality to NavigationItem
- [ ] T077 [S8] Create navigation preferences service in `src/lib/server/navigation/preferences-service.ts`
- [ ] T078 [S8] Implement preference resolution (per-team override → global default → auto)
- [ ] T079 [S8] Add navigation layout selector to Settings Navigation page
- [ ] T080 [S8] Implement preset layouts (Auto, Minimal, Full, Photographer, Coordinator)
- [ ] T081 [S8] Add "Customize Navigation" button to overflow menu
- [ ] T082 [P] [S8] Write unit tests for adaptive navigation logic in `tests/unit/utils/adaptive-navigation.test.ts`
- [ ] T083 [P] [S8] Write E2E test for adaptive navigation in `tests/e2e/adaptive-navigation.spec.ts`

---

## Phase 9: Polish & Cross-Cutting Concerns

**Goal**: Performance optimization, documentation, final testing

- [ ] T084 [P] Measure and optimize sidebar load time (target: <100ms)
- [ ] T085 [P] Measure and optimize team switch time (target: <500ms)
- [ ] T086 [P] Add route preloading on navigation item hover
- [ ] T087 Complete unit test coverage to 70%+ target
- [ ] T088 Update README.md with sidebar navigation documentation
- [ ] T089 Create Pull Request with comprehensive description

---

## Dependencies

### Scenario Completion Order

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
┌───────────────┬──────────────────┬────────────────┐
│  Scenario 1   │   Scenario 2     │   Scenario 8   │
│  (Team Lead)  │   (Mobile)       │   (Adaptive)   │
│  P1 - Core    │   P1 - Mobile    │   P1 - Smart   │
└───────┬───────┴────────┬─────────┴────────┬───────┘
        │                │                  │
        └────────────────┴──────────────────┘
                         ↓
        ┌────────────────┴──────────────────┐
        │                                   │
   Scenario 3                          Scenario 4
   (Discovery)                         (Notifications)
   P2 - Enhancement                    P2 - Real-time
        │                                   │
        └────────────────┬──────────────────┘
                         ↓
                    Scenario 5
                  (Quick Actions)
                  P2 - Productivity
                         ↓
                    Phase 9
                    (Polish)
```

**Key Dependencies**:
- Scenario 1, 2, 8 are independent (all P1) - can run in parallel after Phase 2
- Scenario 3, 4 depend on Scenario 1 (need core navigation)
- Scenario 5 depends on Scenarios 1, 3, 4 (needs full navigation + modals)
- Phase 9 depends on all scenarios being complete

### Parallel Execution Opportunities

**Within Phase 1 (Setup)**:
- T002-T003, T006-T008, T010-T012 can all run in parallel (different files)

**Within Phase 2 (Foundational)**:
- T013-T016 can run in parallel (different components)
- T021-T025 can run in parallel (different route pages)

**Within Scenario 1**:
- T032, T038-T039 can run in parallel with other tasks

**Within Scenario 2**:
- T048-T049 can run in parallel with implementation

**Cross-Scenario Parallelism**:
- Scenarios 1, 2, 8 can be developed simultaneously by different developers

---

## Implementation Strategy

This feature follows an **incremental delivery** approach:

1. **Phase 1-2**: Foundation (Setup + Foundational) - MUST complete first
2. **MVP**: Scenario 1 (Team Lead Navigation) - Core sidebar with team switcher
3. **Mobile Support**: Scenario 2 (Mobile Navigation) - Can deploy after Scenario 1
4. **Adaptive System**: Scenario 8 (Adaptive Navigation) - Major enhancement, can deploy independently
5. **Enhancements**: Scenarios 3-5 - Progressive feature additions
6. **Polish**: Phase 9 - Final optimization and documentation

Each scenario delivers independently testable value and can be deployed separately using feature flags if needed.

---

## Notes

**Status**: Phase 1 partially complete (T001-T003, T006-T010 done)

**Next Tasks** (in priority order):
1. T004-T005: Database migration for navigation preferences
2. T011-T012: Unit tests for stores
3. T017-T020: Route group setup
4. T021-T025: New route pages (Planning, Active Projects, Archive, etc.)

**Testing Strategy**:
- Unit tests for stores and utilities
- Component tests for all layout components
- E2E tests for each user scenario
- Accessibility testing with Lighthouse
- Performance testing for load times

**Deployment Strategy**:
Per spec clarification, use feature flags for gradual rollout with staging validation before production.
