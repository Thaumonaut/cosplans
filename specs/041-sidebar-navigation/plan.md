# Implementation Plan: Sidebar Navigation & App Layout

**Branch**: `041-sidebar-navigation` | **Date**: 2025-10-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/041-sidebar-navigation/spec.md`

**Status**: ✅ Clarification Complete (7 questions resolved)

## Summary

Implement persistent sidebar navigation system for the Cosplans application with:
- **18 navigation items** across 3 sections (Main: 6, Resources: 7, Settings: 3) + header actions
- **Team switcher** at top with smart redirect and unsaved changes protection
- **Mobile-responsive** design: overlay on <768px with swipe-to-close
- **Theme system** with multiple light/dark variants + custom theme option
- **Real-time notifications** with badge counts
- **Accessibility** with keyboard navigation and screen reader support
- **SvelteKit file-based routing** for optimal performance (zero overhead)

## Technical Context

**Language/Version**: TypeScript 5.x with SvelteKit 2.x  
**Primary Dependencies**: 
- SvelteKit (web framework + file-based routing)
- Tailwind CSS (styling)
- Shadcn/svelte (UI component library)
- Lucide Icons (lucide-svelte) - NEW DEPENDENCY
- Supabase (auth, real-time, database)
- Yjs (CRDT for real-time sync)
- @casl/ability (permissions)

**Storage**: Supabase PostgreSQL (user preferences, theme settings, form dirty state)  
**Testing**: Vitest (unit), Playwright (E2E), @testing-library/svelte (component)  
**Target Platform**: Web application (mobile-responsive, Phase 1)  
**Project Type**: Web (SvelteKit monorepo with src/)  
**Performance Goals**: 
- Sidebar load/render: <100ms
- Team switch: <500ms
- Mobile overlay animation: 60fps
- Route navigation: <200ms (SvelteKit preloading)

**Constraints**: 
- Mobile overlay must not cause content reflow
- Theme switching must be instantaneous (localStorage + CSS variables)
- Keyboard navigation must work for all items (accessibility)
- Team switch must handle unsaved form changes gracefully

**Scale/Scope**: 
- 18 navigation items (expandable to ~25 with future features)
- 5 main components (Sidebar, TeamSwitcher, ThemeDropdown, UserMenu, NavigationItem)
- 3 new stores (navigation, theme, forms)
- ~15-20 route pages to integrate with sidebar layout

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Principle I (Web-First Mobile-Responsive)**: Sidebar designed mobile-first with overlay pattern, touch-friendly (44px targets), works on 320px+ screens  
✅ **Principle II (Real-Time Collaboration)**: Notification badges update in real-time via WebSocket, team switch syncs data instantly  
✅ **Principle III (External Integration)**: No external integrations needed for sidebar itself  
✅ **Principle V (Visual-First)**: Navigation icons use Lucide for consistent visual language  
✅ **Principle VI (Test-Driven Development)**: Tests required for: navigation state, team switching, mobile overlay, keyboard nav, theme persistence  
✅ **Principle VII (Roles & Permissions)**: Navigation items respect permission-based visibility (admin-only sections hidden)  
✅ **Principle IX (Bun Runtime)**: All commands use Bun (bun install lucide-svelte, bun run dev)  
✅ **Technical Architecture**: Uses SvelteKit file-based router (constitutional mandate), shadcn/svelte + Lucide icons, Tailwind CSS  

**No constitutional violations. Feature fully aligned with all principles.**

## Project Structure

### Documentation (this feature)

```
specs/041-sidebar-navigation/
├── spec.md              # ✅ Complete with 7 clarifications
├── plan.md              # ✅ This file
├── checklists/
│   └── requirements.md  # ✅ Exists (32 requirements)
└── tasks.md             # To be created via /speckit.tasks
```

### Source Code (repository root)

**SvelteKit Web Application Structure** (existing + new files):

```
src/
├── lib/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.svelte                    # NEW - Main sidebar container
│   │   │   ├── SidebarSection.svelte             # NEW - Section wrapper (Main/Resources/Settings)
│   │   │   ├── NavigationItem.svelte             # NEW - Individual nav item
│   │   │   ├── TeamSwitcher.svelte               # NEW - Team dropdown at top
│   │   │   ├── ThemeDropdown.svelte              # NEW - Theme picker in header
│   │   │   ├── UserMenu.svelte                   # NEW - User avatar/settings at bottom
│   │   │   └── MobileMenuToggle.svelte           # NEW - Hamburger button
│   │   └── ui/                                    # Existing shadcn components
│   │       ├── dropdown-menu/                    # (use for TeamSwitcher, ThemeDropdown)
│   │       ├── button/
│   │       ├── badge/                            # (use for notification counts)
│   │       └── dialog/                           # (use for unsaved changes modal)
│   ├── stores/
│   │   ├── navigation.ts                         # NEW - Sidebar state, active item
│   │   ├── theme.ts                              # NEW - Theme variants, persistence
│   │   ├── forms.ts                              # NEW - Form dirty state tracking
│   │   └── realtime.ts                           # UPDATE - Add notification badge counts
│   ├── types/
│   │   ├── navigation.ts                         # NEW - NavigationItem, SidebarState
│   │   └── theme.ts                              # NEW - Theme variant types
│   └── utils/
│       ├── navigation-items.ts                   # NEW - Define 18 nav items structure
│       └── theme-variants.ts                     # NEW - Define theme color schemes
├── routes/
│   ├── (auth)/                                   # NEW GROUP - Authenticated routes with sidebar
│   │   ├── +layout.svelte                        # NEW - Includes Sidebar component
│   │   ├── +layout.ts                            # NEW - Load user, team, permissions
│   │   ├── dashboard/+page.svelte                # MOVE from root
│   │   ├── calendar/+page.svelte                 # NEW or MOVE
│   │   ├── gallery/+page.svelte                  # NEW or MOVE
│   │   ├── tasks/+page.svelte                    # NEW or MOVE
│   │   ├── messages/+page.svelte                 # NEW or MOVE
│   │   ├── community-profile/+page.svelte        # NEW
│   │   ├── characters-costumes/+page.svelte      # NEW
│   │   ├── props/+page.svelte                    # NEW
│   │   ├── crew/+page.svelte                     # NEW
│   │   ├── locations/+page.svelte                # NEW
│   │   ├── equipment/+page.svelte                # NEW
│   │   ├── budgeting/+page.svelte                # NEW
│   │   ├── archive/+page.svelte                  # NEW
│   │   └── settings/                             # NEW folder
│   │       ├── account/+page.svelte              # NEW
│   │       ├── team/+page.svelte                 # NEW
│   │       └── other/+page.svelte                # NEW
│   ├── (public)/                                 # NEW GROUP - Public routes WITHOUT sidebar
│   │   ├── +layout.svelte                        # NEW - Public layout (no sidebar)
│   │   ├── +page.svelte                          # Landing page
│   │   ├── about/+page.svelte                    # NEW or MOVE
│   │   ├── features/+page.svelte                 # NEW or MOVE
│   │   ├── contact/+page.svelte                  # NEW or MOVE
│   │   └── help/+page.svelte                     # NEW
│   └── login/+page.svelte                        # Auth page (no sidebar)
└── app.css                                        # UPDATE - Add theme CSS variables

tests/
├── unit/
│   ├── stores/
│   │   ├── navigation.test.ts                    # NEW - Test sidebar state logic
│   │   ├── theme.test.ts                         # NEW - Test theme persistence
│   │   └── forms.test.ts                         # NEW - Test dirty tracking
│   └── utils/
│       └── navigation-items.test.ts              # NEW - Test nav structure
└── e2e/
    ├── navigation.spec.ts                        # NEW - Test sidebar navigation
    ├── team-switching.spec.ts                    # NEW - Test smart redirect + confirmation
    ├── mobile-overlay.spec.ts                    # NEW - Test mobile behavior
    └── theme-switching.spec.ts                   # NEW - Test theme persistence

package.json                                       # UPDATE - Add lucide-svelte dependency
tailwind.config.js                                 # UPDATE - Add theme variants
```

**Structure Decision**: SvelteKit web application with route groups for layout separation. Uses `(auth)` group for authenticated routes with sidebar, `(public)` group for marketing pages without sidebar. All navigation components live in `src/lib/components/layout/`. Stores manage global state (navigation, theme, forms). Route structure follows SvelteKit file-based routing with nested layouts.

## Implementation Phases

### Phase 0: Foundation & Dependencies (1-2 days)

**Goal**: Install dependencies, create base stores, define navigation structure

**Tasks**:
1. Install `lucide-svelte` via Bun: `bun add lucide-svelte`
2. Create `src/lib/types/navigation.ts` with NavigationItem, SidebarState interfaces
3. Create `src/lib/types/theme.ts` with ThemeVariant, ThemeConfig types
4. Create `src/lib/stores/navigation.ts` - sidebar state management
5. Create `src/lib/stores/theme.ts` - theme persistence with localStorage
6. Create `src/lib/stores/forms.ts` - form dirty state tracking
7. Create `src/lib/utils/navigation-items.ts` - define 18 navigation items
8. Create `src/lib/utils/theme-variants.ts` - define light/dark theme variants
9. Write unit tests for stores (navigation, theme, forms)

**Success Criteria**:
- ✅ lucide-svelte installed and importable
- ✅ All type definitions created
- ✅ Stores compile without errors
- ✅ Navigation items structure matches spec (18 items, 3 sections)
- ✅ Unit tests pass (70%+ coverage)

---

### Phase 1: Core Sidebar Components (3-4 days)

**Goal**: Build Sidebar, NavigationItem, and basic layout integration

**Tasks**:
1. Create `Sidebar.svelte` - main container with sticky positioning
2. Create `SidebarSection.svelte` - section wrapper with optional heading
3. Create `NavigationItem.svelte` - individual nav item with icon, label, badge, active state
4. Create `MobileMenuToggle.svelte` - hamburger button
5. Implement desktop layout (250-280px width, sticky position)
6. Implement mobile layout (fixed overlay with backdrop)
7. Add swipe-to-close gesture for mobile
8. Add focus trap when sidebar open on mobile
9. Create `(auth)` route group with `+layout.svelte` including Sidebar
10. Update existing dashboard route to use (auth) group
11. Wire up navigation store to manage sidebar state
12. Add keyboard navigation (Tab, Arrow keys, Enter, Escape)
13. Write component tests for Sidebar, NavigationItem
14. Write E2E test for basic navigation flow

**Success Criteria**:
- ✅ Sidebar renders on desktop (250-280px, sticky)
- ✅ Sidebar overlays on mobile (<768px) with backdrop
- ✅ Navigation items show icons, labels, active state
- ✅ Keyboard navigation works (Tab through items, Enter to activate)
- ✅ Mobile swipe-left closes sidebar
- ✅ Component tests pass
- ✅ E2E test navigates between pages successfully

---

### Phase 2: Team Switcher & User Menu (2-3 days)

**Goal**: Implement team context switching with smart redirect and user profile menu

**Tasks**:
1. Create `TeamSwitcher.svelte` - dropdown at top of sidebar
2. Integrate with existing team store (from spec 021)
3. Implement team switch logic:
   - Check current route permissions for new team
   - Stay on route if valid, redirect to dashboard if not
   - Show confirmation modal if unsaved form changes detected
4. Create `UserMenu.svelte` - avatar and settings dropdown at bottom
5. Add user profile link, sign out action
6. Use shadcn dropdown-menu for both components
7. Update realtime store to trigger sidebar badge updates
8. Add `beforeNavigate` hook for unsaved changes detection
9. Write unit tests for team switch logic
10. Write E2E test for team switching scenarios
11. Write E2E test for unsaved changes confirmation

**Success Criteria**:
- ✅ Team switcher shows all user's teams
- ✅ Switching teams reloads data without full page refresh
- ✅ Smart redirect works (stay on valid routes, redirect to dashboard on invalid)
- ✅ Confirmation modal appears when form has unsaved changes
- ✅ User menu shows avatar, name, settings link, sign out
- ✅ Unit tests pass for team switch logic
- ✅ E2E tests pass for all scenarios

---

### Phase 3: Theme System (2-3 days)

**Goal**: Implement multi-variant theme system with persistence

**Tasks**:
1. Create `ThemeDropdown.svelte` - dropdown in header area
2. Define theme variants in `theme-variants.ts`:
   - Light variants: Default, Warm, Cool
   - Dark variants: Default, Purple, Blue
   - Custom option (placeholder for future spec)
3. Implement theme switching:
   - Update CSS variables on document root
   - Persist selection in localStorage
   - Apply theme immediately on page load (prevent flash)
4. Update `app.css` with theme CSS variable definitions
5. Update Tailwind config for theme variant support
6. Add theme preview swatches in dropdown
7. Add "Custom Theme" option with link to settings (future)
8. Write unit tests for theme persistence
9. Write E2E test for theme switching

**Success Criteria**:
- ✅ Theme dropdown shows 6+ variants + custom option
- ✅ Clicking theme applies immediately (no page reload)
- ✅ Theme persists across page reloads
- ✅ No flash of unstyled content on initial load
- ✅ Sidebar colors update to match theme
- ✅ Unit tests pass
- ✅ E2E test verifies theme persistence

---

### Phase 4: Notifications & Real-time Updates (1-2 days)

**Goal**: Display notification badges on sidebar items with real-time updates

**Tasks**:
1. Update `NavigationItem.svelte` to show badge component
2. Use shadcn badge component for notification count
3. Update `realtime.ts` store to track unread counts per nav item:
   - Messages → unread message count
   - Tasks → pending task count
   - Notifications → unread notification count (future)
4. Wire up WebSocket subscriptions for badge updates
5. Add badge clear logic when user visits page
6. Style badges (red for errors, blue for info)
7. Write E2E test for real-time badge updates

**Success Criteria**:
- ✅ Badges appear on Messages, Tasks navigation items
- ✅ Counts update in real-time (<1 second) when new items arrive
- ✅ Badges clear when user visits respective page
- ✅ Badge styling matches design (red for urgent, blue for info)
- ✅ E2E test verifies real-time updates work

---

### Phase 5: Route Integration & Polish (2-3 days)

**Goal**: Create/move all 18 route pages, add accessibility, finalize styling

**Tasks**:
1. Create route group structure: `(auth)` and `(public)`
2. Move existing routes into `(auth)` group (dashboard, etc.)
3. Create placeholder pages for missing routes:
   - calendar, gallery, tasks, messages, community-profile
   - characters-costumes, props, crew, locations, equipment, budgeting, archive
   - settings/account, settings/team, settings/other
4. Create public route group with separate layout (no sidebar):
   - landing, about, features, contact, help
5. Add permission checks to hide admin-only navigation items
6. Implement collapsed icon-only state for desktop (optional enhancement)
7. Add tooltips for navigation items on hover
8. Add aria-labels for screen readers
9. Test keyboard navigation thoroughly (Tab, Arrow keys, Enter)
10. Test mobile touch targets (44px minimum)
11. Run accessibility audit (Lighthouse, axe)
12. Write E2E tests for all route navigations
13. Write accessibility E2E tests (keyboard nav, screen reader)

**Success Criteria**:
- ✅ All 18 navigation items link to valid routes
- ✅ Public routes render without sidebar
- ✅ Admin sections hidden for non-admin users
- ✅ Keyboard navigation works for all items
- ✅ Touch targets are 44px+ on mobile
- ✅ Lighthouse accessibility score ≥90
- ✅ All E2E tests pass
- ✅ Screen reader announces navigation structure correctly

---

### Phase 6: Performance & Testing (1-2 days)

**Goal**: Optimize performance, complete test coverage, documentation

**Tasks**:
1. Measure sidebar load time (target: <100ms)
2. Measure team switch time (target: <500ms)
3. Optimize mobile overlay animation for 60fps
4. Lazy load team avatars in TeamSwitcher
5. Add route preloading on sidebar item hover
6. Complete unit test coverage (target: 70%+)
7. Complete E2E test coverage for all scenarios
8. Update README with sidebar usage instructions
9. Document theme customization process
10. Document navigation item addition process
11. Update requirements checklist (specs/041-sidebar-navigation/checklists/requirements.md)
12. Create PR with comprehensive description

**Success Criteria**:
- ✅ Sidebar loads in <100ms
- ✅ Team switch completes in <500ms
- ✅ Mobile animation runs at 60fps
- ✅ Unit test coverage ≥70%
- ✅ All E2E tests pass
- ✅ Documentation complete
- ✅ Requirements checklist updated
- ✅ PR ready for review

---

## Estimated Timeline

**Total**: 12-19 working days (~2.5-4 weeks)

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 0: Foundation | 1-2 days | None |
| Phase 1: Core Sidebar | 3-4 days | Phase 0 complete |
| Phase 2: Team Switcher | 2-3 days | Phase 1 complete |
| Phase 3: Theme System | 2-3 days | Phase 1 complete (parallel with Phase 2) |
| Phase 4: Notifications | 1-2 days | Phase 1 complete, realtime store exists |
| Phase 5: Route Integration | 2-3 days | Phases 1-3 complete |
| Phase 6: Performance & Testing | 1-2 days | All phases complete |

**Critical Path**: Phase 0 → Phase 1 → Phase 2 → Phase 5 → Phase 6  
**Parallel Work**: Phase 3 (Theme) can run parallel with Phase 2 (Team Switcher)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Route group migration breaks existing routes | Medium | High | Test each route after migration, keep dashboard working first |
| Theme flash on page load | Medium | Medium | Implement theme script in `<head>` before hydration |
| Mobile overlay causes content reflow | Low | Medium | Use fixed positioning, test on real devices |
| Team switch conflicts with realtime updates | Low | High | Test concurrent team switches, implement optimistic updates |
| Keyboard navigation accessibility issues | Medium | High | Test with actual screen readers (NVDA, VoiceOver) |
| Performance regression on mobile | Low | Medium | Profile with Chrome DevTools, optimize animations |

---

## Complexity Tracking

*No constitutional violations. This section intentionally left empty.*
