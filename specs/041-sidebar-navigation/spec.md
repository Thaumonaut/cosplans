# Specification 041: Sidebar Navigation & App Layout

**Feature**: Persistent sidebar navigation for main application with collapsible menu, team switcher, and visual hierarchy.

**Status**: 📋 SPECIFICATION (Not yet implemented)

---

## Overview

The Cosplans application needs a professional sidebar navigation system that provides persistent access to key features, team context, and user information. This navigation should support the growing feature set while maintaining clear information hierarchy and mobile responsiveness.

---

## User Scenarios & Testing

### Scenario 1: Team Lead Navigation
**User**: Alex (team lead planning a cosplay shoot)
**When**: Alex logs in to start planning for the weekend convention
**Then**: 
- Sidebar is immediately visible with team name and member avatars
- Can quickly navigate to Dashboard, Shoots, Team, Gear without scrolling
- Active page is highlighted to show current location
- Can switch teams via dropdown without full page navigation

**Why**: Team leads need quick context awareness and fast navigation between frequently used features

**Testing**:
- [ ] Sidebar visible on page load
- [ ] Current page highlighted
- [ ] Team switcher loads other teams instantly
- [ ] Navigation items have appropriate icons

---

### Scenario 2: Mobile User Navigation
**User**: Jordan (photographer taking photos at a shoot)
**When**: Jordan is on mobile checking shoot status during the event
**Then**:
- Sidebar collapses to icon-only on mobile
- Hamburger menu available to expand sidebar
- Easy one-handed navigation in portrait mode
- Quick access to critical features (Shoots, Gallery, Messages)

**Why**: Mobile users need functional navigation without sacrificing screen space for content

**Testing**:
- [ ] Sidebar collapses on mobile breakpoint
- [ ] Hamburger menu toggles sidebar visibility
- [ ] Content reflows properly when sidebar visible
- [ ] Touch targets are adequate (44px minimum)

---

### Scenario 3: Feature Discovery
**User**: Sam (new team member)
**When**: Sam explores the application for the first time
**Then**:
- All available features are visible in sidebar
- Features are grouped logically (Planning, Content, Team, Settings)
- Icons help identify features quickly
- Tooltips on hover explain feature purpose

**Why**: New users need easy feature discovery without searching or training

**Testing**:
- [ ] All main features listed in sidebar
- [ ] Logical grouping/sections visible
- [ ] Icons are consistent and meaningful
- [ ] Tooltips appear on hover

---

### Scenario 4: Real-time Notifications
**User**: Casey (team member)
**When**: A new message arrives or action item is assigned
**Then**:
- Notification badge appears on Messages/Notifications sidebar item
- Unread count is displayed
- Clicking badge navigates to that feature with unread items highlighted
- Badge disappears when all items are read

**Why**: Users need awareness of important updates without leaving current page

**Testing**:
- [ ] Badge appears on notification trigger
- [ ] Count updates in real-time
- [ ] Badge clears when items read
- [ ] Navigation works correctly

---

### Scenario 5: Quick Actions from Sidebar
**User**: Morgan (shoot director)
**When**: Morgan needs to create a new shoot quickly
**Then**:
- Sidebar has a prominent "+ New Shoot" button
- Clicking opens a modal to start the shoot creation flow
- Can cancel and return to sidebar without navigation
- Quick action completes without full page navigation

**Why**: Users should be able to perform common actions from anywhere in the app

**Testing**:
- [ ] Quick action buttons visible and accessible
- [ ] Modal opens/closes correctly
- [ ] Actions complete without navigation disruption

---

## Requirements

### Navigation Structure
- **REQ-001**: Sidebar must display primary navigation menu with at least 8-10 main sections
- **REQ-002**: Navigation items must be organized into logical groups (Planning, Content, Team, Settings, Admin)
- **REQ-003**: Each navigation section must have a consistent icon (16-24px)
- **REQ-004**: Current page must be visually distinguished (highlight/background color)
- **REQ-005**: Navigation must remain persistent across page navigation (sticky/fixed position)
- **REQ-006**: Sidebar width must be 250-280px on desktop, collapsible to 64px icon-only on smaller screens

### Team Context & Switcher
- **REQ-007**: Team name and logo must be displayed at top of sidebar
- **REQ-008**: Team switcher dropdown must show all teams user is member of
- **REQ-009**: Switching teams must update all context-dependent content without full reload
- **REQ-010**: User avatar and name must be displayed in sidebar footer
- **REQ-011**: Clicking user avatar must open profile/settings menu

### Responsiveness
- **REQ-012**: On screens <768px, sidebar should collapse to icon-only view
- **REQ-013**: Mobile view should show hamburger menu to toggle sidebar visibility
- **REQ-014**: When sidebar is toggled on mobile, main content area should adjust
- **REQ-015**: Sidebar must not overlap critical content on any breakpoint
- **REQ-016**: Touch targets must be minimum 44x44px for mobile accessibility

### Visual Design
- **REQ-017**: Sidebar must use consistent color scheme (background, text, hover states)
- **REQ-018**: Navigation items must have hover effects for visual feedback
- **REQ-019**: Active state must use distinct color (different from hover)
- **REQ-020**: Sidebar must support light and dark themes

### Notifications & Status
- **REQ-021**: Notification badge must appear on relevant navigation items
- **REQ-022**: Badge must show count of unread/pending items
- **REQ-023**: Status indicator for connection (online/offline) must be visible
- **REQ-024**: Typing indicators or real-time status must update without page refresh

### Performance
- **REQ-025**: Sidebar must load and render within 100ms
- **REQ-026**: Team switching must complete in <500ms
- **REQ-027**: Navigation state changes must not cause main content to re-render
- **REQ-028**: Sidebar must use lazy loading for team avatars

### Accessibility
- **REQ-029**: Sidebar must be keyboard navigable (Tab, Arrow keys, Enter)
- **REQ-030**: Screen readers must announce navigation structure and current page
- **REQ-031**: Focus indicators must be visible on all interactive elements
- **REQ-032**: Sidebar must not trap keyboard focus when collapsed

---

## Success Criteria

1. **Navigation Completeness**: All main app features (Dashboard, Shoots, Team, Gallery, Calendar, etc.) are accessible from sidebar within 2 clicks
2. **Visual Hierarchy**: Current page is immediately distinguishable from inactive pages (≥30 point difference in contrast or background color)
3. **Mobile Responsiveness**: Sidebar adapts to all screen sizes without horizontal scroll or content overlap
4. **Team Context**: Team name, avatar, and user info are visible at top and bottom of sidebar respectively
5. **Real-time Updates**: Notification badges update within 1 second of event trigger
6. **Keyboard Navigation**: All sidebar items are accessible and navigable using keyboard only
7. **Performance**: Initial load time <100ms, team switch <500ms
8. **Notifications**: Unread count badges appear on: Messages, Notifications, Tasks (context-dependent)

---

## Key Entities

### NavigationItem
```typescript
interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string; // icon name or SVG path
  group: 'planning' | 'content' | 'team' | 'settings' | 'admin';
  badge?: {
    count: number;
    type: 'error' | 'warning' | 'info';
  };
  requiresPermission?: string;
  isCollapsible?: boolean;
  children?: NavigationItem[];
}
```

### SidebarState
```typescript
interface SidebarState {
  isCollapsed: boolean;
  isOpen: boolean; // mobile toggle
  activeItem: string; // current page id
  team: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  notifications: Record<string, number>; // item id -> unread count
}
```

---

## Edge Cases

1. **Very Long Team Names**: Names >30 chars should truncate with ellipsis and full text in tooltip
2. **Many Teams**: If user is in 50+ teams, team switcher should paginate or search
3. **Deep Navigation**: If navigation item has children (3+ levels), only show 2 levels and link to parent page
4. **Permission Restrictions**: Navigation items should be hidden (not disabled) if user lacks permission
5. **Network Offline**: Sidebar must remain accessible; navigation items that require network should show disabled state
6. **Very Small Screens**: On screens <320px (phones in landscape), sidebar may need further optimization

---

## Acceptance Scenarios

### Given: User is logged in and on Dashboard page
**When**: User clicks "Team Settings" in sidebar
**Then**:
- Page navigates to Team Settings
- "Team Settings" item in sidebar becomes highlighted
- URL changes to /team/settings
- Breadcrumb updates (if applicable)

### Given: User has 3 unread messages
**When**: User clicks on any page (not Messages page)
**Then**:
- "Messages" sidebar item shows badge with count "3"
- Badge is red/urgent color
- Clicking Messages navigates to Messages page
- Badge disappears after all messages are marked read

### Given: User is on mobile device
**When**: Page loads
**Then**:
- Sidebar is collapsed to icon-only view
- Hamburger menu icon is visible
- Clicking hamburger expands sidebar as overlay
- Clicking outside sidebar or on a link closes it

### Given: User has permission to access Admin Dashboard
**When**: User views sidebar
**Then**:
- "Admin" section is visible at bottom of sidebar
- Admin items are only visible to users with admin_access permission

### Given: User switches teams
**When**: User opens team switcher and selects different team
**Then**:
- Team name/logo at top of sidebar updates
- Dashboard data refreshes to show new team's content
- Navigation items adjust based on new team's features
- No full page refresh occurs

---

## Dependencies

**Depends On**:
- 020-user-authentication (user context required)
- 021-shoots-teams-creation (team context required)
- 022-permissions-access-control (permission-based visibility)
- 031-notification-system (notification badges)

**Required By**:
- All main app features (001-001-039) - navigation is foundational

---

## Technology Stack

- **Frontend**: SvelteKit, Tailwind CSS
- **State Management**: Svelte stores (sidebar state, notifications)
- **Real-time**: WebSocket for notification updates
- **Icons**: Heroicons or similar consistent icon set
- **Animation**: CSS transitions (smooth collapse/expand)

---

## Assumptions & Constraints

1. User is already authenticated (handled by spec 020)
2. Team context is established before rendering sidebar
3. Navigation structure is relatively stable (not adding items dynamically often)
4. Notification system is implemented (spec 031)
5. Permissions system is in place (spec 022)
6. Maximum of 8-12 top-level navigation items (more would require reorganization)

---

## Implementation Notes

- Use sticky positioning for sidebar (easier than fixed for content reflow)
- Implement responsive breakpoint at 768px for mobile adaptation
- Use Svelte stores for sidebar state to allow updates from any component
- Consider collapsible sections (Planning, Content, etc.) if navigation grows beyond 12 items
- Lazy load team avatars using IntersectionObserver
- Use keyboard event listeners for arrow key navigation

---

## Related Files

- `src/lib/components/layout/Sidebar.svelte` (to be created)
- `src/lib/stores/navigation.ts` (to be created)
- `src/lib/types/navigation.ts` (to be created)
- `src/routes/+layout.svelte` (to be updated to include sidebar)
- `tailwind.config.js` (custom breakpoints if needed)

