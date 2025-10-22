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

## Clarifications

### Session: 2025-10-16

**Q1: Navigation Items Definition**  
**Answer**: Navigation structure organized as follows:
- **Team Switcher** (dropdown at top)
- **Main Section**: Dashboard, Calendar, Gallery, Tasks, Messages, Community Profile
- **Resources Section**: Characters/Costumes, Props, Crew, Locations, Equipment, Budgeting
- **Settings Section** (at bottom): User Account, Team Settings, Other Settings
- **Header Actions** (persistent): Theme Toggle, Quick Options (Sign Out, etc.)

**Impact**: Defines exact navigation hierarchy with 3 main sections (Main, Resources, Settings) plus team switcher and header actions. Total of 12 main navigation items plus settings group.

**Q2: Icon Set Selection**  
**Answer**: Lucide Icons (lucide-svelte package)

**Impact**: Tree-shakeable modern icon library compatible with shadcn/svelte stack. Consistent 2px stroke width, ~1KB per icon. Provides all needed icons: Home, Calendar, Image, CheckSquare, MessageSquare, User, Shirt, Box, Users, MapPin, Wrench, DollarSign, Settings, Sun/Moon, LogOut, etc.

**Q3: Theme Toggle Behavior**  
**Answer**: Dropdown menu with multiple theme style options - different variants of light and dark themes with different color schemes, plus a "Custom Theme" option

**Impact**: Requires theme system with multiple variants (e.g., "Light Default", "Light Warm", "Light Cool", "Dark Default", "Dark Purple", "Dark Blue", etc.). Dropdown in header shows current theme icon/name, expands to show all options with preview swatches. Stores theme preference in localStorage/user profile. Custom theme option will link to theme customization interface (may require separate spec for theme builder/editor feature).

**Q4: Mobile Sidebar Behavior**  
**Answer**: Overlay pattern - sidebar slides over content with dimmed backdrop, closes on backdrop click

**Impact**: Sidebar will use fixed positioning on mobile with z-index above content. Semi-transparent backdrop (rgba black/white ~40% opacity) dims content when sidebar open. Closes via backdrop click, swipe-left gesture, or navigation. Focus trap active when open. No content reflow needed = better performance.

**Q5: Team Switcher Interaction**  
**Answer**: Smart redirect (stay on same route if valid for new team, otherwise redirect to dashboard) + confirmation modal on pages with forms/unsaved changes

**Impact**: Team switch logic must check: 1) Does current route exist/have permissions for new team? If yes, stay and reload data. If no, redirect to dashboard. 2) Before switching, check for unsaved form changes (e.g., on details/edit pages). If found, show confirmation modal: "You have unsaved changes. Switch teams anyway?" with Cancel/Switch buttons. Requires form dirty state tracking across the app.

**Q6: Archive Section (Post-Session Addition)**  
**Answer**: Add "Archive" section in Resources group for accessing previous/completed shoots

**Impact**: Navigation structure updated to include Archive as 7th Resources item. Total navigation items: 18 (Main: 6, Resources: 7, Settings: 3, Header Actions: 2+). Archive page will show historical shoots with filters for date ranges, team members, events.

**Q7: Routing Implementation (Post-Session Addition)**  
**Answer**: Use SvelteKit's built-in file-based router exclusively (no third-party routing libraries)

**Impact**: Navigation will use native SvelteKit APIs: `goto()` for programmatic navigation, `beforeNavigate()` for unsaved changes guard, `afterNavigate()` for active state updates, `$page` store for current route. Ensures optimal performance with zero-overhead routing, automatic code splitting, and built-in preloading. No additional routing dependencies needed.

**Route Structure**: Sidebar navigation supports both authenticated routes (dashboard, calendar, gallery, etc.) and public routes. Public routes (landing page, about, help, contact, features) are accessible without authentication but are NOT included in the sidebar navigation (sidebar only appears for authenticated users). Public pages use separate layout without sidebar.

**Q8: Adaptive Navigation & Layout Presets (2025-10-21)**  
**Answer**: Hybrid approach - Smart/dynamic navigation by default with optional preset override for power users

**Impact**: Navigation adapts automatically to reduce overwhelm while allowing explicit control:

**Phase 1 (MVP) - Smart/Dynamic Navigation:**
- **Personal Team (Solo Mode)**: Simplified navigation focused on individual workflow
  - Main: Dashboard, My Cosplays (Characters & Costumes), Idea Bank, Gallery/Moodboards, Time Tracking, Archive
  - Hides: Team coordination features (Crew, Locations, Equipment, Budgeting, Messages)
- **Shared Team (Team Mode)**: Full navigation with all coordination tools
  - All current navigation items visible
  - Team-focused features prominent
- **Auto-hide unused sections**: After 30 days of non-use, sections can be collapsed by default

**Phase 2 (Enhancement) - Optional Preset Override:**
- Settings → "Navigation Layout" preference
- Options: "Auto (Recommended)", "Minimal", "Full", "Photographer Focus", "Coordinator Focus"
- Most users never need to touch this - smart defaults work
- Power users can customize to their exact workflow

**Benefits:**
- Aligns with Constitution Principle #1: "Reduce Overwhelm"
- Zero configuration for new users - works immediately
- Adapts to actual usage patterns automatically
- Serves both solo hobbyists and team coordinators equally well
- Progressive disclosure - features revealed as needed
- Optional explicit control for power users

**Implementation Notes:**
- Navigation items stored in configuration with `showInPersonalTeam` and `showInSharedTeam` flags
- User preference stored in profile: `navigation_layout: 'auto' | 'minimal' | 'full' | 'photographer' | 'coordinator'`
- Default is 'auto' which uses team context to determine layout
- Usage analytics track which features are accessed to inform auto-hide behavior

**Q9: Idea Bank / Pre-Production Feature (2025-10-21)**  
**Answer**: The "Idea Bank" is a comprehensive Pre-Production/Planning workspace for cosplays not yet in active development.

**Navigation Placement**: Main Section, position 2 (right after Dashboard)
```
Main Section:
├─ Dashboard
├─ Planning (or "Ideas") ← NEW
├─ Active Projects (Characters & Costumes)
├─ Gallery
├─ Calendar
└─ Archive
```

**Route**: `/planning` or `/ideas`

**Content**: Each planning item contains:
- Character name + series/source
- Mood board (reference images)
- Notes, estimated costs, interest level, difficulty, tags
- Pattern storage, tutorial links
- Required items (props, wigs, etc.)
- Location ideas, intended use (con/shoot)

**Promotion Flow**:
- Unlimited planning items (no limit)
- "Start Project" → checks active project count
- If at 3 active: prompt to pause one or cancel
- On promotion: moves to Active Projects, removed from Planning

**Impact**: New route, new nav item, `projects` table with status field (`planning | active | paused | completed | archived`)

**Q10: Navigation Naming & Project Lifecycle (2025-10-21)**  
**Answer**: Three distinct sections for the cosplay lifecycle:

**Navigation Structure**:
```
Main Section:
├─ Dashboard
├─ Planning (ideas/pre-production, unlimited)
├─ Active Projects (in progress, max 3)
├─ Gallery
├─ Calendar
├─ Archive (completed projects)

Resources Section:
├─ Characters & Costumes (physical costume inventory)
├─ Props
├─ Locations
└─ etc.
```

**Purpose & Flow**:
- **Planning**: Pre-production workspace for future cosplays
- **Active Projects**: Current WIP cosplays (max 3 limit enforced)
- **Archive**: Completed projects (moved automatically on completion)
- **Characters & Costumes**: Physical costume inventory management (separate from projects)

**Project Lifecycle**:
```
Planning → [Promote] → Active Projects → [Complete] → Archive
                                              ↓
                            (Physical costume added to inventory)
                                              ↓
                                   Characters & Costumes
```

**Impact**: Clarifies that Characters & Costumes is for inventory, not project tracking. Archive is for completed project history.

**Q11: Time Tracking Feature Scope (2025-10-21)**  
**Answer**: Time tracking is for project management and estimation - tracking how long different tasks take and predicting when an overall project will be complete.

**Purpose**:
- **Task Duration Tracking**: Record actual time spent on individual tasks
- **Estimate vs Actual**: Compare estimated time with actual time spent
- **Project Completion Prediction**: Calculate when project will be complete based on remaining tasks, historical data, available hours per week
- **Workload Management**: For teams, see who's overloaded and balance assignments

**Key Features**:
1. **Task-Level Tracking**: Start/stop timer, manual time entry, estimates vs actuals
2. **Project-Level Analytics**: Completion percentage, estimated completion date, "Can I finish before [con]?" calculator
3. **Team Features** (optional): Time tracking per member, workload balancing, productivity metrics

**Navigation Placement**: 
- **Not a dedicated nav item** - integrated into project/task views
- Timer widget on task cards
- Dashboard shows time summary
- Analytics page shows historical data

**Impact**: No new nav item needed. Feature integrated into existing Dashboard, Active Projects, and Tasks pages.

**Q12: Auto-hide Behavior & User Control (2025-10-21)**  
**Answer**: Combination of overflow menu + manual pin/unpin control

**How it works**:
- **"Unused" definition**: Zero clicks/visits to section in last 30 days
- After 30 days, section moves to "More..." overflow menu
- Users can manually pin sections to prevent auto-hide
- Users can manually move sections to/from overflow

**Navigation Structure Example**:
```
Main Section:
├─ Dashboard (always visible)
├─ Planning (pinned by user)
├─ Active Projects (pinned by user)
├─ Gallery (auto-visible, frequently used)
└─ More... (collapsible overflow)
    ├─ Tasks (hidden, not used in 30 days)
    ├─ Messages (hidden, not used in 30 days)
    └─ Archive (hidden, not used in 30 days)
```

**User Control**:
- Pin/unpin sections (pin icon next to name)
- "Customize Navigation" settings page
- Disable auto-hide entirely (power user option)
- Hidden sections still searchable via command palette

**Visual Design**:
- "More..." button with count badge (e.g., "More... (4)")
- Click to reveal hidden sections
- Hidden sections with notifications show badge on "More..." button

**Implementation**:
- `hidden_nav_sections: string[]` in user profile
- `pinned_nav_sections: string[]` in user profile
- `last_accessed_sections: { [sectionId]: timestamp }` for tracking

**Impact**: Reduces nav clutter while maintaining full access. First-time users see all sections (no auto-hide for first 30 days).

**Q13: Navigation Layout Preference Storage & Sync (2025-10-21)**  
**Answer**: Hybrid approach - global default + per-team overrides

**Preference Hierarchy**:
1. **Global Default**: User sets preferred layout in Settings (applies to all teams)
2. **Per-Team Override**: User can override global default for specific teams
3. **Auto Mode**: Smart/dynamic navigation based on team type

**Storage Structure**:
```typescript
// User Profile (global default)
user_profiles {
  navigation_layout: 'auto' | 'minimal' | 'full' | 'photographer' | 'coordinator'
  // Default: 'auto'
}

// Team Members (per-team overrides)
team_members {
  navigation_layout_override: 'auto' | 'minimal' | 'full' | 'photographer' | 'coordinator' | null
  // null = use global default
}
```

**Resolution Logic**:
1. Check for per-team override in `team_members` table
2. If null, fall back to global default in `user_profiles`
3. If 'auto', apply smart/dynamic navigation based on team type

**User Experience**:
- **Settings Page**: "Default Layout" applies to all teams
- **Team Settings**: "Navigation Layout for this team" overrides global default
- **Cross-device sync**: YES - stored in Supabase, syncs across devices
- **Real-time**: Changes apply immediately across all tabs/devices

**Team Admin Control**:
- Admins CANNOT force layouts on members
- Admins CAN set "recommended" layout (shows as suggestion)
- Members can always ignore recommendation

**Impact**: Flexible preference system that balances simplicity (global default) with flexibility (per-team overrides). Requires two database columns: `user_profiles.navigation_layout` and `team_members.navigation_layout_override`.

---

## Requirements

### Navigation Structure
- **REQ-001**: Sidebar must display navigation menu with 12 main items across 3 sections: Main (6 items), Resources (6 items), Settings (3 items)
- **REQ-002**: Navigation items must be organized into logical groups: Team Switcher (top), Main Section, Resources Section, Settings Section (bottom), Header Actions (persistent)
- **REQ-003**: Each navigation section must have a consistent icon (16-24px)
- **REQ-004**: Current page must be visually distinguished (highlight/background color)
- **REQ-005**: Navigation must remain persistent across page navigation (sticky/fixed position)
- **REQ-006**: Sidebar width must be 250-280px on desktop, collapsible to 64px icon-only on smaller screens

### Team Context & Switcher
- **REQ-007**: Team name and logo must be displayed at top of sidebar
- **REQ-008**: Team switcher dropdown must show all teams user is member of
- **REQ-009**: Switching teams must use smart redirect: stay on current route if it exists/is permitted for new team, otherwise redirect to dashboard
- **REQ-009a**: If current page has unsaved form changes, show confirmation modal before team switch
- **REQ-010**: Switching teams must update all context-dependent content without full page reload (except when redirecting)
- **REQ-011**: User avatar and name must be displayed in sidebar footer
- **REQ-012**: Clicking user avatar must open profile/settings menu

### Responsiveness
- **REQ-012**: On screens <768px, sidebar should be hidden by default (not icon-only)
- **REQ-013**: Mobile view should show hamburger menu to toggle sidebar visibility
- **REQ-014**: When sidebar is toggled on mobile, it overlays content with dimmed backdrop (no content reflow)
- **REQ-015**: Sidebar overlay must be dismissible via backdrop click, swipe-left gesture, or navigation
- **REQ-016**: Touch targets must be minimum 44x44px for mobile accessibility
- **REQ-017**: Focus must be trapped within sidebar when open on mobile, restored to trigger on close

### Visual Design
- **REQ-017**: Sidebar must use consistent color scheme (background, text, hover states)
- **REQ-018**: Navigation items must have hover effects for visual feedback
- **REQ-019**: Active state must use distinct color (different from hover)
- **REQ-020**: Sidebar must support multiple theme variants (light and dark with different color options)
- **REQ-020a**: Header must include theme dropdown menu showing all available theme options with visual previews

### Notifications & Status
- **REQ-021**: Notification badge must appear on relevant navigation items
- **REQ-022**: Badge must show count of unread/pending items
- **REQ-023**: Connection status indicator must reflect server and database health with distinct states: "Online" when both are reachable, "Degraded" when the server responds but database checks fail, and "Offline" when neither endpoint is available; indicator remains visible in the dashboard header/sidebar.
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
  group: 'main' | 'resources' | 'settings' | 'header-actions';
  badge?: {
    count: number;
    type: 'error' | 'warning' | 'info';
  };
  requiresPermission?: string;
  isCollapsible?: boolean;
  children?: NavigationItem[];
}

// Specific navigation items (12 main + 3 settings + 2+ header actions):
// Main: Dashboard, Calendar, Gallery, Tasks, Messages, Community Profile
// Resources: Characters/Costumes, Props, Crew, Locations, Equipment, Budgeting, Archive
// Settings: User Account, Team Settings, Other Settings
// Header Actions: Theme Toggle, Sign Out
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
- **Routing**: SvelteKit file-based router (built-in, no third-party libraries)
- **Navigation APIs**: `goto()`, `beforeNavigate()`, `afterNavigate()`, `$page` store
- **State Management**: Svelte stores (sidebar state, notifications)
- **Real-time**: WebSocket for notification updates
- **Icons**: Lucide Icons (lucide-svelte) - tree-shakeable, 2px stroke, ~1KB per icon
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

- Use sticky positioning for sidebar on desktop (easier than fixed for content reflow)
- Use fixed positioning with overlay on mobile (<768px breakpoint)
- Use Svelte stores for sidebar state to allow updates from any component
- Navigation sections: Main (6 items), Resources (7 items including Archive), Settings (3 items)
- Lazy load team avatars using IntersectionObserver
- Use keyboard event listeners for arrow key navigation
- Install lucide-svelte package for icons (tree-shakeable)
- Implement theme dropdown with multiple light/dark variants + custom theme option
- Track form dirty state globally for team switch confirmation
- Team switch: check route permissions → stay if valid → dashboard if not → confirm if unsaved changes
- Mobile: overlay with backdrop, swipe-left to close, focus trap when open
- Use SvelteKit's native routing APIs exclusively: `goto()` for navigation, `beforeNavigate()` for guards, `$page` for active route
- No third-party routing libraries needed - file-based routing provides optimal performance

---

## Related Files

- `src/lib/components/layout/Sidebar.svelte` (to be created)
- `src/lib/components/layout/TeamSwitcher.svelte` (to be created)
- `src/lib/components/layout/ThemeDropdown.svelte` (to be created)
- `src/lib/components/layout/UserMenu.svelte` (to be created)
- `src/lib/stores/navigation.ts` (to be created - sidebar state, active item)
- `src/lib/stores/theme.ts` (to be created - theme variants, custom themes)
- `src/lib/stores/forms.ts` (to be created - track dirty state for unsaved changes)
- `src/lib/types/navigation.ts` (to be created)
- `src/routes/+layout.svelte` (to be updated to include sidebar)
- `tailwind.config.js` (add theme variants)
- `package.json` (add lucide-svelte dependency)

