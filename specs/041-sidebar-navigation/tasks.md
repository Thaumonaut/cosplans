# Task Breakdown: Sidebar Navigation & App Layout

**Feature**: 041-sidebar-navigation
**Source Plan**: [plan.md](./plan.md)

This task list is generated from the implementation plan. Check items off as they are completed.

---

## Phase 0: Foundation & Dependencies (1-2 days)

- [x] **Dependency**: Install `lucide-svelte` via Bun (`bun add lucide-svelte`).
- [x] **Types**: Create `src/lib/types/navigation.ts` with `NavigationItem` and `SidebarState` interfaces.
- [x] **Types**: Create `src/lib/types/theme.ts` with `ThemeVariant` and `ThemeConfig` types.
- [x] **Store**: Create `src/lib/stores/navigation.ts` for sidebar state management (isCollapsed, isOpen, activeItem).
- [x] **Store**: Create `src/lib/stores/theme.ts` for theme persistence using `localStorage`.
- [x] **Store**: Create `src/lib/stores/forms.ts` for global form dirty state tracking.
- [x] **Utils**: Create `src/lib/utils/navigation-items.ts` to define the 18-item navigation structure.
- [x] **Utils**: Create `src/lib/utils/theme-variants.ts` to define light and dark theme color schemes.
- [x] **Unit Test**: Write tests for the `navigation` store.
- [x] **Unit Test**: Write tests for the `theme` store, including `localStorage` mocking.
- [x] **Unit Test**: Write tests for the `forms` store.

---

## Phase 1: Core Sidebar Components (3-4 days)

- [x] **Component**: Create `src/lib/components/layout/Sidebar.svelte` as the main container.
- [x] **Component**: Create `src/lib/components/layout/SidebarSection.svelte` for grouping nav items.
- [x] **Component**: Create `src/lib/components/layout/NavigationItem.svelte` for individual links.
- [x] **Component**: Create `src/lib/components/layout/MobileMenuToggle.svelte` (hamburger button).
- [x] **Layout (Desktop)**: Implement sticky positioning, 250-280px width.
- [x] **Layout (Mobile)**: Implement fixed overlay with a backdrop for screens <768px.
- [x] **UX (Mobile)**: Add a swipe-to-close gesture for the mobile sidebar.
- [x] **Accessibility**: Implement a focus trap when the mobile sidebar is open.
- [x] **Routing**: Create the `(auth)` route group with a new `+layout.svelte` that includes the `Sidebar`.
- [x] **Routing**: Move the existing dashboard route into the `(auth)` group.
- [x] **State**: Wire up the `navigation.ts` store to manage the sidebar's open/closed state.
- [x] **Accessibility**: Add keyboard navigation (Tab, Arrow keys, Enter, Escape).
- [x] **Component Test**: Write tests for `Sidebar.svelte` and `NavigationItem.svelte`.
- [x] **E2E Test**: Write a basic test to verify navigation between two pages works.

---

## Phase 2: Team Switcher & User Menu (2-3 days)

- [ ] **Component**: Create `src/lib/components/layout/TeamSwitcher.svelte` using `shadcn/svelte`'s dropdown.
- [ ] **Integration**: Connect the `TeamSwitcher` to the existing team store.
- [ ] **Logic**: Implement the "smart redirect" team switching logic.
- [ ] **Logic**: Implement the unsaved changes confirmation modal using the `forms.ts` store and `beforeNavigate`.
- [ ] **Component**: Create `src/lib/components/layout/UserMenu.svelte` at the bottom of the sidebar.
- [ ] **UX**: Add user profile link and sign-out action to the `UserMenu`.
- [ ] **Unit Test**: Write tests for the team switch logic (smart redirect and permission checks).
- [ ] **E2E Test**: Write a test for the team switching success path.
- [ ] **E2E Test**: Write a test for the unsaved changes confirmation modal.

---

## Phase 3: Theme System (2-3 days)

- [ ] **Component**: Create `src/lib/components/layout/ThemeDropdown.svelte`.
- [ ] **Logic**: Implement theme switching logic that updates CSS variables on the document root.
- [ ] **Styling**: Update `app.css` with the CSS variable definitions for all themes.
- [ ] **Styling**: Update `tailwind.config.js` to support the new theme color variants.
- [ ] **UX**: Add theme preview swatches to the dropdown menu.
- [ ] **UX**: Add the "Custom Theme" option that links to a future settings page.
- [ ] **Unit Test**: Write tests for theme persistence in `localStorage`.
- [ ] **E2E Test**: Write a test to verify that the selected theme persists across page reloads.

---

## Phase 4: Notifications & Real-time Updates (1-2 days)

- [ ] **Component**: Update `NavigationItem.svelte` to display a badge.
- [ ] **Integration**: Use `shadcn/svelte`'s badge component for the notification count.
- [ ] **Store**: Update the `realtime.ts` store to track unread counts for Messages and Tasks.
- [ ] **Integration**: Wire up WebSocket subscriptions to update badge counts in real-time.
- [ ] **Logic**: Implement logic to clear a badge when the user visits the corresponding page.
- [ ] **E2E Test**: Write a test to verify that notification badges appear and disappear in real-time.

---

## Phase 5: Route Integration & Polish (2-3 days)

- [ ] **Routing**: Create the `(public)` route group with a separate layout that has no sidebar.
- [ ] **Routing**: Create placeholder pages for all 18 navigation items within the `(auth)` group.
- [ ] **Routing**: Move any existing public-facing pages into the `(public)` group.
- [ ] **Permissions**: Add logic to hide admin-only navigation items based on user roles.
- [ ] **UX**: Add tooltips to navigation items on hover, especially for the icon-only collapsed view.
- [ ] **Accessibility**: Add `aria-label` attributes to all interactive elements.
- [ ] **Testing**: Manually test keyboard navigation thoroughly.
- [ ] **Testing**: Manually test mobile touch targets to ensure they are at least 44x44px.
- [ ] **Testing**: Run a Lighthouse accessibility audit and address any reported issues.
- [ ] **E2E Test**: Write tests to verify all 18 routes are reachable.
- [ ] **E2E Test**: Write an accessibility test for keyboard navigation.

---

## Phase 6: Performance & Testing (1-2 days)

- [ ] **Performance**: Measure and optimize sidebar load time (target: <100ms).
- [ ] **Performance**: Measure and optimize team switch time (target: <500ms).
- [ ] **Performance**: Lazy load team avatars in the `TeamSwitcher`.
- [ ] **Performance**: Add route preloading on sidebar item hover for faster navigation.
- [ ] **Testing**: Complete unit test coverage to meet the 70%+ target.
- [ ] **Testing**: Complete E2E test coverage for all critical user flows.
- [ ] **Documentation**: Update the project `README.md` with instructions on the new sidebar.
- [ ] **Documentation**: Document the theme customization process for future developers.
- [ ] **Documentation**: Update the `requirements.md` checklist in the feature spec folder.
- [ ] **CI/CD**: Create a Pull Request with a comprehensive description linking back to the spec and plan.
