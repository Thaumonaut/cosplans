# Checklist: 041-Sidebar Navigation & App Layout

## Requirements Completion

### Navigation Structure
- [ ] REQ-001: Sidebar displays 8-10 main navigation sections
- [ ] REQ-002: Navigation items organized into groups (Planning, Content, Team, Settings, Admin)
- [ ] REQ-003: Consistent icons for each section (16-24px)
- [ ] REQ-004: Current page visually distinguished (highlight/background)
- [ ] REQ-005: Sidebar persistent across page navigation
- [ ] REQ-006: Sidebar width 250-280px desktop, 64px collapsed mobile

### Team Context & Switcher
- [ ] REQ-007: Team name and logo displayed at sidebar top
- [ ] REQ-008: Team switcher dropdown shows all user's teams
- [ ] REQ-009: Team switching updates content without reload
- [ ] REQ-010: User avatar and name displayed in sidebar footer
- [ ] REQ-011: Clicking avatar opens profile/settings menu

### Responsiveness
- [ ] REQ-012: Sidebar collapses to icon-only on <768px screens
- [ ] REQ-013: Mobile hamburger menu toggles sidebar visibility
- [ ] REQ-014: Main content adjusts when sidebar toggled on mobile
- [ ] REQ-015: Sidebar doesn't overlap critical content
- [ ] REQ-016: Touch targets 44x44px minimum on mobile

### Visual Design
- [ ] REQ-017: Consistent color scheme throughout sidebar
- [ ] REQ-018: Navigation items have hover effects
- [ ] REQ-019: Active state uses distinct color
- [ ] REQ-020: Light and dark theme support

### Notifications & Status
- [ ] REQ-021: Notification badge appears on relevant items
- [ ] REQ-022: Badge shows count of unread items
- [ ] REQ-023: Connection status indicator visible
- [ ] REQ-024: Typing indicators and status update in real-time

### Performance
- [ ] REQ-025: Sidebar loads/renders within 100ms
- [ ] REQ-026: Team switching completes in <500ms
- [ ] REQ-027: Navigation state changes don't re-render main content
- [ ] REQ-028: Team avatars lazy loaded

### Accessibility
- [ ] REQ-029: Sidebar keyboard navigable (Tab, Arrow, Enter)
- [ ] REQ-030: Screen readers announce navigation and current page
- [ ] REQ-031: Focus indicators visible on interactive elements
- [ ] REQ-032: Keyboard focus not trapped when collapsed

---

## Success Criteria Testing

- [ ] All main features (Dashboard, Shoots, Team, Gallery, Calendar) accessible from sidebar within 2 clicks
- [ ] Current page immediately distinguishable (≥30pt contrast or background color)
- [ ] Sidebar adapts to all screen sizes without horizontal scroll
- [ ] Team name, avatar, and user info visible top and bottom of sidebar
- [ ] Notification badges update within 1 second
- [ ] All sidebar items keyboard navigable
- [ ] Initial load <100ms, team switch <500ms
- [ ] Unread count badges on Messages, Notifications, Tasks

---

## Components to Create

- [ ] `src/lib/components/layout/Sidebar.svelte` - Main sidebar component
- [ ] `src/lib/components/layout/SidebarItem.svelte` - Individual nav item
- [ ] `src/lib/components/layout/TeamSwitcher.svelte` - Team dropdown
- [ ] `src/lib/components/layout/UserMenu.svelte` - User profile menu
- [ ] `src/lib/components/layout/NotificationBadge.svelte` - Badge component

---

## Stores to Create

- [ ] `src/lib/stores/navigation.ts` - Sidebar state, active item, notifications
- [ ] Update `src/lib/stores/realtime.ts` - Connection status for sidebar

---

## Types to Create

- [ ] `src/lib/types/navigation.ts` - NavigationItem, SidebarState interfaces

---

## Layout Changes

- [ ] Update `src/routes/+layout.svelte` to include Sidebar component
- [ ] Add layout wrapper with sidebar + main content area
- [ ] Implement responsive grid/flex for desktop/mobile

---

## Testing

### Unit Tests
- [ ] Sidebar renders with correct navigation items
- [ ] Active item highlighting works
- [ ] Sidebar collapse/expand toggles state correctly
- [ ] Team switcher updates team context

### Integration Tests
- [ ] Navigation to page updates sidebar highlight
- [ ] Team switch updates all context-dependent content
- [ ] Notification badges update on real-time events
- [ ] Mobile hamburger menu works correctly

### E2E Tests
- [ ] Full user flow: Login → View sidebar → Navigate → Highlight updates
- [ ] Team switch flow: Switch teams → Content updates → Sidebar updates
- [ ] Mobile flow: Tap hamburger → Sidebar expands → Tap item → Navigate

### Accessibility Tests
- [ ] Screen reader announces navigation structure
- [ ] All items keyboard navigable
- [ ] Focus visible on all interactive elements
- [ ] No focus traps

---

## Design System Integration

- [ ] Define sidebar colors (background, text, hover, active)
- [ ] Define sidebar fonts and sizing
- [ ] Create icon set (8-12 consistent icons)
- [ ] Define animation timing (collapse/expand)
- [ ] Document hover/active states
- [ ] Create design system documentation

---

## Status

**Overall Progress**: 0%

**Blocked By**: None (foundation already in place)

**Blocking**: All main app features

