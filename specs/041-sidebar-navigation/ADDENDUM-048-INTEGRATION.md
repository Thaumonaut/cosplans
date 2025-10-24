# Addendum: Sidebar Navigation Updates for Spec 048 Integration

**Date**: October 24, 2025  
**Related Specs**: 
- Spec 041 (Sidebar Navigation)
- Spec 048 (Character-Centric Resource Model)

**Status**: Draft - Updates Required Before Spec 048 Implementation

---

## Overview

Spec 048 introduces significant new navigation items that would expand the sidebar from **16 items** to **22-24 items**, creating visual clutter. This addendum defines:

1. **Collapsible navigation sections** (mentioned in spec 041 but not detailed)
2. **New navigation structure** to accommodate spec 048 resources
3. **Updated requirements** for scalable sidebar design

---

## Updated Navigation Structure

### Current Structure (16 items)
```
Main (6 items)
  - Dashboard
  - Planning
  - In Progress
  - Archived
  - Messages
  - Community Profile

Details (5 items)
  - Calendar
  - Gallery
  - Tasks
  - Timeline
  - Budget

Resources (5 items)
  - Outfits (at /costumes)
  - Props
  - Crew
  - Locations
  - Equipment
```

### Proposed Structure with Spec 048 (23 items with collapsible sections)

```
📋 Main (6 items - always expanded, non-collapsible)
  - Dashboard
  - Planning
  - In Progress
  - Archived
  - Messages
  - Community Profile

🎭 Cosplay ▼ (5 items - collapsible, default: EXPANDED)
  - Characters        [NEW from spec 048]
  - Outfits          (renamed from "Costumes")
  - Wigs             [NEW from spec 048]
  - Accessories      [NEW from spec 048]
  - Props            (moved from Resources)

📦 Resources ▼ (3 items - collapsible, default: COLLAPSED)
  - Materials        [NEW from spec 048]
  - Equipment        (kept from current)
  - Vendors          [NEW from spec 048]

📍 Production ▼ (3 items - collapsible, default: COLLAPSED)
  - Crew             (moved from Resources)
  - Locations        (moved from Resources)
  - Events           [NEW from spec 048]

📅 Details ▼ (6 items - collapsible, default: COLLAPSED)
  - Calendar
  - Gallery
  - Tasks
  - Timeline
  - Budget
  - Reports          [FUTURE - analytics/insights]
```

**Default Visible Items**: 6 (Main) + 5 (Cosplay) = **11 items**  
**Total Items When All Expanded**: **23 items**

---

## New Functional Requirements

### Collapsible Section Behavior

- **FR-ADDON-001**: System MUST support collapsible navigation sections with expand/collapse toggle icons
- **FR-ADDON-002**: System MUST persist section collapsed/expanded state in localStorage per user
- **FR-ADDON-003**: System MUST animate section expand/collapse transitions (200ms duration)
- **FR-ADDON-004**: Main section MUST NOT be collapsible (always visible for core navigation)
- **FR-ADDON-005**: Section headers MUST display chevron icon indicating collapsed (▶) or expanded (▼) state
- **FR-ADDON-006**: Clicking section header MUST toggle expand/collapse for that section
- **FR-ADDON-007**: Section expand/collapse MUST be keyboard accessible (Enter/Space on header)
- **FR-ADDON-008**: When sidebar is in narrow/icon-only mode, section collapsing MUST be disabled (all items shown)

### Default Section States

- **FR-ADDON-009**: "Main" section MUST always be expanded (non-collapsible)
- **FR-ADDON-010**: "Cosplay" section MUST default to expanded on first visit
- **FR-ADDON-011**: "Resources" section MUST default to collapsed on first visit
- **FR-ADDON-012**: "Production" section MUST default to collapsed on first visit
- **FR-ADDON-013**: "Details" section MUST default to collapsed on first visit
- **FR-ADDON-014**: User's expand/collapse preferences MUST persist across sessions

### Smart Auto-Collapse (Enhancement - Phase 2)

- **FR-ADDON-015**: System SHOULD track navigation item usage per section (click count, last accessed date)
- **FR-ADDON-016**: After 30 days of non-use, section SHOULD auto-collapse with user notification "We noticed you haven't used [Section] recently. It's now collapsed to keep things tidy."
- **FR-ADDON-017**: User MUST be able to disable auto-collapse in settings ("Keep all sections expanded")
- **FR-ADDON-018**: Sections with unread notifications MUST remain expanded regardless of usage

### Mobile Behavior

- **FR-ADDON-019**: On mobile (< 768px), collapsible sections MUST still function when sidebar is open
- **FR-ADDON-020**: Mobile hamburger menu MUST respect section collapsed/expanded states
- **FR-ADDON-021**: Mobile users SHOULD see same default states as desktop (Cosplay expanded, others collapsed)

---

## Updated Navigation Items from Spec 048

### New Items to Add

**Cosplay Section:**
- **Characters** (`/characters`, icon: `User`, requiresPermission: `characters.read`)
  - Hub for character planning and brainstorming
  - Links to all outfits, wigs, props, accessories for that character
- **Wigs** (`/wigs`, icon: `Sparkles`, requiresPermission: `wigs.read`)
  - Dedicated wig management (promoted from costume component)
  - Styling tasks, material tracking, character linking
- **Accessories** (`/accessories`, icon: `Gem`, requiresPermission: `accessories.read`)
  - Jewelry, belts, headpieces, gloves, boots
  - Reusable across multiple characters

**Resources Section:**
- **Materials** (`/materials`, icon: `Layers`, requiresPermission: `materials.read`)
  - Craft supplies inventory (fabrics, foam, paint, etc.)
  - Reusable resources with quantity tracking
- **Vendors** (`/vendors`, icon: `Store`, requiresPermission: `vendors.read`)
  - Vendor/shop management
  - Purchase history and ratings

**Production Section:**
- **Events** (`/events`, icon: `Calendar`, requiresPermission: `events.read`)
  - Conventions, photoshoots, competitions
  - Character linking and readiness tracking

### Items to Move

- **Props**: Move from Resources → Cosplay (better fit with outfits/characters)
- **Crew**: Move from Resources → Production (production team focus)
- **Locations**: Move from Resources → Production (shoot/event locations)

### Items to Rename

- **Outfits**: Update label from "Outfits" but keep route `/costumes` for backward compatibility

---

## Implementation Notes

### Phase 1: Core Collapsible Sections (Implement First)
1. Update `NavigationSection` type to include `collapsible: boolean` and `defaultExpanded: boolean`
2. Create `CollapsibleSectionHeader.svelte` component with chevron toggle
3. Update `SidebarSection.svelte` to support collapse/expand state
4. Add localStorage persistence for section states
5. Update `navigation-items.ts` with new 4-section structure

### Phase 2: New Navigation Items (After Spec 048 Database)
1. Add new navigation items to `navigation-items.ts`
2. Create placeholder routes for new items (`/characters`, `/wigs`, `/accessories`, `/materials`, `/vendors`, `/events`)
3. Update permissions checks for new items
4. Test navigation with all items visible

### Phase 3: Smart Auto-Collapse (Enhancement - Optional)
1. Track usage analytics per navigation item
2. Implement 30-day auto-collapse logic
3. Add user notification system for auto-collapsed sections
4. Add settings toggle to disable auto-collapse

---

## Updated Navigation Config Example

```typescript
// src/lib/utils/navigation-items.ts

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    id: "main",
    label: "Main",
    items: MAIN_NAV_ITEMS,
    collapsible: false, // Always visible
    defaultExpanded: true,
    icon: null
  },
  {
    id: "cosplay",
    label: "Cosplay",
    items: COSPLAY_NAV_ITEMS,
    collapsible: true,
    defaultExpanded: true, // Expanded by default
    icon: "Shirt"
  },
  {
    id: "resources",
    label: "Resources",
    items: RESOURCE_NAV_ITEMS,
    collapsible: true,
    defaultExpanded: false, // Collapsed by default
    icon: "Package"
  },
  {
    id: "production",
    label: "Production",
    items: PRODUCTION_NAV_ITEMS,
    collapsible: true,
    defaultExpanded: false, // Collapsed by default
    icon: "Users"
  },
  {
    id: "details",
    label: "Details",
    items: DETAILS_NAV_ITEMS,
    collapsible: true,
    defaultExpanded: false, // Collapsed by default
    icon: "BarChart"
  },
];

export const COSPLAY_NAV_ITEMS: NavigationItem[] = [
  {
    id: "characters",
    label: "Characters",
    href: "/characters",
    icon: "User",
    group: "cosplay",
    requiresPermission: "characters.read",
  },
  {
    id: "outfits",
    label: "Outfits",
    href: "/costumes", // Keep old route for compatibility
    icon: "Shirt",
    group: "cosplay",
  },
  {
    id: "wigs",
    label: "Wigs",
    href: "/wigs",
    icon: "Sparkles",
    group: "cosplay",
    requiresPermission: "wigs.read",
  },
  {
    id: "accessories",
    label: "Accessories",
    href: "/accessories",
    icon: "Gem",
    group: "cosplay",
    requiresPermission: "accessories.read",
  },
  {
    id: "props",
    label: "Props",
    href: "/props",
    icon: "Package",
    group: "cosplay",
  },
];

// ... similar for RESOURCE_NAV_ITEMS, PRODUCTION_NAV_ITEMS, DETAILS_NAV_ITEMS
```

---

## Migration Strategy

### Backward Compatibility
- Keep `/costumes` route active, rename label to "Outfits" in UI only
- Redirect old `/crew`, `/locations`, `/equipment` routes to maintain bookmarks
- No database changes required (navigation is UI-only)

### User Communication
- Show one-time tooltip on first login after update: "Navigation updated! Sections now collapse to keep things tidy. Click section headers to expand/collapse."
- Update help docs with screenshot of new navigation structure

### Testing Checklist
- [ ] All 23 navigation items render correctly
- [ ] Section collapse/expand animations work smoothly
- [ ] LocalStorage persists section states across sessions
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Mobile sidebar respects collapsed sections
- [ ] Narrow sidebar mode shows all items (ignores collapse state)
- [ ] Active route highlighting works in all sections
- [ ] Permissions hide items correctly

---

## Dependencies

- **Spec 048** (database tables for characters, wigs, accessories, materials, vendors, events)
- **Lucide Icons** (already installed)
- **LocalStorage API** (browser built-in)

---

## Out of Scope

- Drag-and-drop reordering of navigation items (future enhancement)
- Custom navigation item creation (admin-only feature)
- Navigation search/filter (not needed with collapsible sections)
- Section pinning/favorites (too complex for MVP)

---

## Next Steps

1. **Review and approve** this navigation structure
2. **Answer spec 048 clarifications** (materials, wigs, accessories edge cases)
3. **Decide**: Implement collapsible sections before or during spec 048?
   - **Option A**: Implement collapsible sections first (quick win, improves current nav)
   - **Option B**: Implement as part of spec 048 (all changes at once)
4. **Update spec 041 tasks** to include collapsible section implementation
5. **Proceed with spec 048 tasks** once navigation structure is finalized

---

## Recommendation

**Implement collapsible sections BEFORE spec 048** because:
- Improves current navigation immediately (current 16 items → cleaner with collapse)
- De-risks spec 048 implementation (navigation ready when new items added)
- Small, focused change (easier to test and deploy)
- Users get accustomed to collapsible UI before big resource model changes

**Estimated Effort**: 4-6 hours for collapsible sections (Phase 1 only)

