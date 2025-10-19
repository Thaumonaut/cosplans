# Feature Specification: Gear Checklist Management

**Feature Branch**: `007-007-gear-checklist`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: Photography gear checklists, costume piece tracking, prop inventory with packed status, ownership tracking

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Gear Checklists (Priority: P1)

As a photographer/team member, I want to create checklists of gear needed for a shoot (camera equipment, costume pieces, props) so that I don't forget anything on shoot day.

**Why this priority**: Core checklist functionality prevents forgotten items - the primary value of the feature.

**Independent Test**: User can create checklist with items, check them off as packed, view checklist on mobile during prep.

**Acceptance Scenarios**:

1. **Given** I'm planning a shoot, **When** I create gear checklist and add items "Camera body", "50mm lens", "Memory cards", **Then** checklist displays with unchecked boxes
2. **Given** I'm packing for shoot, **When** I check off "Camera body" and "50mm lens", **Then** items show checkmarks and progress shows "2 of 3 packed"
3. **Given** I have a checklist, **When** teammate views same shoot, **Then** they see real-time updates as I check items off
4. **Given** I'm on location, **When** I open checklist on mobile, **Then** I can quickly verify all items are packed (mobile-optimized view)

---

### User Story 2 - Categorize Items by Type (Priority: P2)

As a team organizer, I want to categorize checklist items as Photography Gear, Costume Pieces, Props, or Other so that different team members know what they're responsible for bringing.

**Why this priority**: Adds organization and accountability to P1 checklists. Enables clear responsibility assignment.

**Independent Test**: User can assign categories to items, filter checklist by category, see category-specific progress.

**Acceptance Scenarios**:

1. **Given** I'm creating items, **When** I add "Camera body" category "Photography Gear" and "Wig" category "Costume", **Then** items group by category in checklist view
2. **Given** I have multi-category checklist, **When** I select "Show Photography Gear only" filter, **Then** only camera equipment displays
3. **Given** I'm the photographer, **When** I view checklist, **Then** I see "Photography Gear: 3 of 5 packed" progress separately from other categories
4. **Given** team has specialized roles, **When** each person views checklist, **Then** they can focus on their category's items

---

### User Story 3 - Track Item Ownership (Priority: P3)

As a team coordinator, I want to assign ownership to each item (who owns/brings it) so that everyone knows their responsibilities and we avoid duplicate effort.

**Why this priority**: Prevents coordination failures (two people bringing same item, or no one bringing needed item). Builds on P2 categories.

**Independent Test**: User can assign team members as owners, filter "my items", see what others are responsible for.

**Acceptance Scenarios**:

1. **Given** I'm editing checklist, **When** I assign "Camera body" to "@photographer_jane" and "Cape prop" to "@cosplayer_mike", **Then** ownership displays with each item
2. **Given** I'm @photographer_jane, **When** I view checklist, **Then** "My Items" view shows only items assigned to me (3 items)
3. **Given** item has no owner, **When** displayed in checklist, **Then** shows "⚠️ Unassigned" warning to prompt assignment
4. **Given** shoot is tomorrow, **When** I view owner summary, **Then** I see "@jane: 3/5 packed, @mike: 2/2 packed, @sarah: 0/1 packed" accountability view

---

### User Story 4 - Reusable Gear Templates (Priority: P4)

As a frequent shooter, I want to save common gear lists as templates (e.g., "Outdoor Portrait Setup", "Studio Cosplay Kit") so that I don't recreate the same checklist for every shoot.

**Why this priority**: Efficiency feature for repeat users. Valuable time-saver but shoots can function without templates.

**Independent Test**: User can save current checklist as template, create new shoot from template, manage template library.

**Acceptance Scenarios**:

1. **Given** I have complete checklist with 12 items, **When** I click "Save as template" and name it "Outdoor Portrait Setup", **Then** template saves to my library
2. **Given** I'm creating new shoot, **When** I select "Use template" and choose "Outdoor Portrait Setup", **Then** all 12 items copy to new shoot's checklist
3. **Given** I have 5 saved templates, **When** I edit template "Studio Cosplay Kit" to add new item, **Then** future shoots using this template include new item (existing shoots unchanged)
4. **Given** I use template for shoot, **When** I add shoot-specific items, **Then** template remains unchanged and shoot has custom additions

---

### Edge Cases

- What happens when item is marked packed but then needs to be unpacked? (Allow unchecking, track check/uncheck history?)
- How to handle items that need quantity tracking? (Support quantity field: "Memory cards x3", track "2 of 3 packed")
- What if template items need customization per shoot? (Template is starting point, full edit freedom after applying)
- Should there be item suggestions based on shoot type? (Future enhancement: AI/pattern-based suggestions)
- How to handle shared team gear vs personal gear? (Ownership field indicates who brings it, notes can specify "team gear locker")
- What happens when assigned owner leaves team? (Reassignment prompt, or revert to unassigned)
- Should checklist items link to inventory database? (Not in MVP, but potential future integration)
- How to handle items forgotten and noticed on location? (Add items on mobile, mark with "⚠️ Forgotten" status to adjust for next time)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating gear checklist per shoot with item name and checkbox
- **FR-002**: System MUST support checking/unchecking items with real-time sync (< 2 seconds) to all team members
- **FR-003**: System MUST display progress indicator "X of Y items packed"
- **FR-004**: System MUST provide mobile-optimized checklist view for on-the-go access
- **FR-005**: System MUST support item categories: Photography Gear, Costume Pieces, Props, Other
- **FR-006**: System MUST allow assigning category to each checklist item
- **FR-007**: System MUST provide category filter view showing only selected category items
- **FR-008**: System MUST display per-category progress "Photography Gear: 3 of 5 packed"
- **FR-009**: System MUST allow assigning team member as owner/responsible party for each item
- **FR-010**: System MUST provide "My Items" filtered view showing only items assigned to current user
- **FR-011**: System MUST highlight unassigned items with warning indicator
- **FR-012**: System MUST provide owner accountability summary showing packed status per person
- **FR-013**: System MUST support optional quantity field per item (e.g., "x3") with "N of M packed" tracking
- **FR-014**: System MUST allow saving current checklist as named template
- **FR-015**: System MUST provide template library view listing all saved templates per user/team
- **FR-016**: System MUST allow creating new shoot checklist from existing template (copy operation)
- **FR-017**: System MUST support editing templates with changes affecting only future uses
- **FR-018**: System MUST allow adding notes/description to checklist items (max 500 characters)
- **FR-019**: System MUST persist checkbox state per item with timestamp of last change
- **FR-020**: System MUST support drag-and-drop reordering of checklist items
- **FR-021**: System MUST support bulk actions: check all, uncheck all, delete selected items

### Key Entities

- **GearChecklist**: Container for checklist items per shoot. Attributes: shoot ID, created date, last modified date
- **ChecklistItem**: Individual item in checklist. Attributes: checklist ID, name, category (Photography Gear/Costume/Props/Other), checked status, owner user ID, quantity, notes, sequence order, last checked timestamp, last checked by user ID
- **ChecklistTemplate**: Reusable checklist pattern. Attributes: template name, created by user ID, is team shared (boolean), created date, last modified date
- **TemplateItem**: Item within template. Attributes: template ID, name, category, default quantity, notes, sequence order
- **Shoot**: Parent entity (already exists). Extended with: gear checklist reference

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create 10-item checklist in under 2 minutes
- **SC-002**: Checkbox state syncs to all team members within 2 seconds
- **SC-003**: Mobile checklist view loads in under 1 second on 3G connection
- **SC-004**: Category filter switches instantaneously (< 200ms)
- **SC-005**: 80% of shoots using checklists report fewer forgotten items (measured via post-shoot survey)
- **SC-006**: Users creating multiple shoots reuse templates 60% of the time (indicates template value)
- **SC-007**: Shoots with assigned ownership have 25% higher item pack completion rate
- **SC-008**: Mobile checklist interface supports one-handed operation (items large enough to tap, checkbox toggle < 50ms)
- **SC-009**: System handles checklists with 100+ items without performance degradation
- **SC-010**: Drag-and-drop reordering works smoothly on mobile with no dropped items or UI jank

