# Tasks: UI Library Migration to Flowbite Svelte

**Feature**: UI Library Migration to Flowbite Svelte  
**Branch**: `044-ui-flowbite-migration`  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Summary

Total tasks to complete the UI library migration from shadcn-svelte to Flowbite Svelte with reusable themed components.

**Task Count**: 24 tasks
- Phase 1 (Setup): 3 tasks ✅ COMPLETE
- Phase 2 (Foundational): 6 tasks ✅ COMPLETE  
- Phase 3 (US1 - Themed Components): 0 tasks ✅ COMPLETE
- Phase 4 (US2 - Flowbite Migration): 0 tasks ✅ COMPLETE
- Phase 5 (US3 - Page Refactoring): 10 tasks (🔄 2 complete, 8 remaining)
- Phase 6 (Polish): 5 tasks

**Parallel Opportunities**: 8 tasks can run in parallel during page refactoring phase

**MVP Scope**: User Story 1 (Themed Components) - ✅ COMPLETE

## Implementation Strategy

This migration follows an incremental delivery approach:
1. ✅ **Setup & Infrastructure** (Phase 1-2) - Foundation complete
2. ✅ **Core Components** (US1) - All themed components created
3. ✅ **Library Integration** (US2) - Flowbite Svelte installed and configured
4. 🔄 **Page Migration** (US3) - Refactor pages incrementally, test each
5. ⏳ **Polish** (Final) - Tests, documentation, cleanup

Each user story delivers independently testable value and can be deployed separately using feature flags.

---

## Phase 1: Setup ✅ COMPLETE

**Goal**: Install Flowbite Svelte and configure Tailwind CSS v3

**Status**: All setup tasks complete

- [x] T001 Install Flowbite Svelte v1.18.0 and flowbite v3.1.2 via `bun add -D flowbite-svelte flowbite`
- [x] T002 Configure Tailwind CSS v3 with Flowbite plugin in `tailwind.config.js`
- [x] T003 Update `components.json` to remove shadcn config references

---

## Phase 2: Foundational ✅ COMPLETE

**Goal**: Create reusable themed component system

**Status**: All foundational components created

**Independent Test**: Import and render any themed component - it should display with correct theme variables in both light and dark modes

### Core Themed Components

- [x] T004 [P] Create ThemedCard component in `src/lib/components/ui/ThemedCard.svelte`
- [x] T005 [P] Create ThemedInput component in `src/lib/components/ui/ThemedInput.svelte`
- [x] T006 [P] Create ThemedTextarea component in `src/lib/components/ui/ThemedTextarea.svelte`
- [x] T007 [P] Create ThemedButton component in `src/lib/components/ui/ThemedButton.svelte`
- [x] T008 [P] Create ThemedSelect component in `src/lib/components/ui/ThemedSelect.svelte`
- [x] T009 [P] Create ThemedAlert component in `src/lib/components/ui/ThemedAlert.svelte`

---

## Phase 3: User Story 1 - Create Reusable Themed Components (P1) ✅ COMPLETE

**Story Goal**: Developers have reusable UI components that automatically use theme variables

**Priority**: P1 (Critical - Foundation for all other work)

**Status**: ✅ COMPLETE

**Independent Test**: 
- Create a test page using ThemedCard, ThemedInput, and ThemedButton
- Verify components render with theme background, border, and text colors
- Switch between light and dark modes - all components should adapt automatically
- All standard HTML events (click, input, change) should work

**Acceptance Criteria**:
1. ✅ ThemedCard renders with theme background, border, and text colors
2. ✅ ThemedInput renders with theme colors and supports all standard HTML input events
3. ✅ ThemedButton renders with theme accent color and supports click events

**Tasks**: All complete (T004-T009 in Phase 2)

---

## Phase 4: User Story 2 - Migrate Flowbite Svelte Library (P1) ✅ COMPLETE

**Story Goal**: Developers can use Flowbite Svelte components for complex UI patterns

**Priority**: P1 (Critical - Replaces incompatible shadcn-svelte)

**Status**: ✅ COMPLETE

**Independent Test**:
- Import `{ Modal } from 'flowbite-svelte'` in a test component
- Import should succeed without errors
- Flowbite components should render with correct Flowbite styles

**Acceptance Criteria**:
1. ✅ Flowbite Svelte installed and imports work
2. ✅ Tailwind configured with Flowbite plugin
3. ✅ Flowbite components render correctly

**Tasks**: All complete (T001-T003 in Phase 1)

---

## Phase 5: User Story 3 - Refactor Existing Pages (P2) 🔄 IN PROGRESS

**Story Goal**: Existing pages use new reusable components to reduce code duplication

**Priority**: P2 (Delivers code reduction benefits)

**Status**: 🔄 20% Complete (Team Information section done)

**Independent Test**:
- Navigate to refactored team settings page
- All forms should submit successfully
- All buttons should respond to clicks
- All inputs should accept text and validate correctly
- Page should render identically to before refactoring
- Theme switching should work instantly with no visual bugs

**Acceptance Criteria**:
1. 🔄 Team settings page uses ThemedCard (partially done)
2. 🔄 Forms use ThemedInput/ThemedTextarea (partially done)
3. ⏳ Buttons use ThemedButton (partially done)
4. ⏳ All functionality works identically to before

### Team Settings Page Refactoring

- [x] T010 [US3] Refactor Team Information section in `src/routes/(auth)/teams/[teamId]/+page.svelte` to use ThemedCard, ThemedInput, ThemedTextarea, ThemedButton
- [x] T011 [US3] Refactor success/error messages in Team Information section to use ThemedAlert

- [x] T012 [US3] Refactor Team Management section (Create Team form) in `src/routes/(auth)/teams/[teamId]/+page.svelte` to use ThemedCard, ThemedInput, ThemedTextarea, ThemedButton
- [x] T013 [US3] Refactor Join Team section in `src/routes/(auth)/teams/[teamId]/+page.svelte` to use ThemedInput, ThemedButton
- [x] T014 [US3] Refactor Invite Members section in `src/routes/(auth)/teams/[teamId]/+page.svelte` to use ThemedCard, ThemedInput, ThemedSelect, ThemedButton
- [x] T015 [US3] Refactor success/error messages in all team settings sections to use ThemedAlert
- [ ] T016 [US3] Test team settings page: verify all forms submit, buttons click, theme switching works

### Onboarding Page Refactoring

- [ ] T017 [P] [US3] Refactor onboarding page in `src/routes/onboarding/+page.svelte` to use ThemedCard, ThemedInput, ThemedTextarea, ThemedButton
- [ ] T018 [P] [US3] Refactor success/error messages in onboarding page to use ThemedAlert
- [ ] T019 [P] [US3] Test onboarding page: verify team creation works, validation works, theme switching works

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Add tests, update documentation, clean up

### Testing

- [ ] T020 [P] Create component tests for ThemedCard in `tests/components/ThemedCard.test.ts`
- [ ] T021 [P] Create component tests for ThemedInput in `tests/components/ThemedInput.test.ts`
- [ ] T022 [P] Create component tests for ThemedButton in `tests/components/ThemedButton.test.ts`

### Documentation & Cleanup

- [ ] T023 Remove old `.specify/specs/ui-library-migration-flowbite.md` (duplicate spec file)
- [ ] T024 Update memory system to document all themed components with usage examples

---

## Dependencies

### User Story Completion Order

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational - Themed Components)
    ↓
Phase 3 (US1) ← ✅ COMPLETE
    ↓
Phase 4 (US2) ← ✅ COMPLETE
    ↓
Phase 5 (US3) ← 🔄 IN PROGRESS
    ↓
Phase 6 (Polish)
```

**Key Dependencies**:
- US1 and US2 are independent (both P1) - ✅ Both complete
- US3 depends on US1 (needs themed components) - 🔄 In progress
- Polish phase depends on all user stories being complete

### Parallel Execution Opportunities

**Within Phase 5 (Page Refactoring)**:
- T012-T015 (Team settings sections) can be done sequentially (same file)
- T017-T019 (Onboarding page) can run in parallel with T012-T015 (different file)

**Within Phase 6 (Polish)**:
- T020-T022 (Component tests) can all run in parallel (different files)
- T023-T024 (Documentation) can run in parallel with tests

**Parallel Groups**:
```
Group 1 (Team Settings):
  T012 → T013 → T014 → T015 → T016

Group 2 (Onboarding - can run parallel to Group 1):
  T017 → T018 → T019

Group 3 (Tests - can run parallel):
  T020, T021, T022

Group 4 (Docs - can run parallel with tests):
  T023, T024
```

---

## Task Execution Guide

### Current Status (Phase 5 - Page Refactoring)

**Next Tasks** (in priority order):
1. **T012**: Refactor Team Management section (Create Team form)
2. **T013**: Refactor Join Team section  
3. **T014**: Refactor Invite Members section
4. **T015**: Refactor all success/error messages to ThemedAlert
5. **T016**: Test complete team settings page

**Parallel Option**: Start T017-T019 (onboarding page) while working on T012-T016

### Testing Each Task

After each refactoring task:
1. ✅ Visual check: Page renders identically
2. ✅ Functional check: All forms submit successfully
3. ✅ Interaction check: All buttons/inputs work
4. ✅ Theme check: Switch light/dark mode - no visual bugs
5. ✅ Validation check: Form validation works identically

### Completion Criteria

**Before marking Phase 5 complete**:
- All team settings sections refactored
- All onboarding page sections refactored
- All forms tested and working
- Theme switching works on all pages
- No hardcoded colors remain in refactored sections

**Before marking entire migration complete**:
- All 24 tasks complete
- Component tests passing
- Documentation updated
- Memory system updated
- Constitution check Gate 5 (TDD) satisfied

---

## Notes

**Already Complete**:
- ✅ All themed components created (ThemedCard, ThemedInput, ThemedTextarea, ThemedButton, ThemedSelect, ThemedAlert)
- ✅ Backward compatibility wrappers created (Button, Badge, Card, CardHeader, CardTitle, CardContent)
- ✅ Flowbite Svelte installed and configured
- ✅ Tailwind CSS v3 configured with Flowbite plugin
- ✅ Constitution and memory system updated
- ✅ Team Information section refactored

**Remaining Work**:
- ⏳ Complete team settings page refactoring (4 sections + testing)
- ⏳ Refactor onboarding page
- ⏳ Add component tests
- ⏳ Clean up documentation

**Estimated Time**:
- Phase 5 (Page Refactoring): 4-6 hours
- Phase 6 (Polish): 2-3 hours
- **Total remaining**: 6-9 hours

**Deployment Strategy**:
Per spec clarification, use feature flags for gradual rollout with 1-2 weeks staging validation before production.
