# Feature Specification: Props Management

**Feature Branch**: `050-props`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: Props management for weapons, tools, accessories, and other objects used in cosplay.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Prop Inventory (Priority: P1)

As a prop maker, I want to catalog my props so that I can track what I own and easily find items for specific characters.

**Why this priority**: Core inventory functionality - essential for prop management and character planning.

**Independent Test**: User can create prop entries with photos, descriptions, and categorization.

**Acceptance Scenarios**:

1. **Given** I'm on the props page, **When** I click "Add Prop" and upload a photo of my sword, **Then** prop is created with photo and basic details
2. **Given** I'm adding a prop, **When** I select "Weapon" category and add description "Steel sword, 36 inches", **Then** prop is properly categorized and searchable
3. **Given** I'm adding a prop, **When** I set condition to "Excellent" and add notes "Perfect for medieval characters", **Then** prop shows proper condition and usage notes
4. **Given** I'm on mobile, **When** I add a prop, **Then** photo upload works smoothly and form is mobile-optimized

---

### User Story 2 - Categorize Props by Type (Priority: P2)

As a team organizer, I want to categorize props by type (Weapons, Tools, Accessories, Decorative, Other) so that team members can quickly find what they need.

**Why this priority**: Adds organization and helps with inventory management and character planning.

**Independent Test**: User can assign categories, filter by type, and see category-specific inventory.

**Acceptance Scenarios**:

1. **Given** I'm adding props, **When** I select "Weapon" for a sword, **Then** it appears in the Weapon category
2. **Given** I have props in multiple categories, **When** I filter by "Tools", **Then** only tools are displayed
3. **Given** I'm planning a character, **When** I search for "medieval weapons", **Then** I see all medieval weapon props
4. **Given** I'm viewing inventory, **When** I see category summary, **Then** it shows "Weapons: 8, Tools: 5, Accessories: 12" etc.

---

### User Story 3 - Link Props to Characters (Priority: P3)

As a character planner, I want to link props to specific characters so that I can see what items are needed for each cosplay and avoid conflicts.

**Why this priority**: Provides character planning context and helps with costume coordination.

**Independent Test**: User can link props to characters, view character-specific props, and manage conflicts.

**Acceptance Scenarios**:

1. **Given** I'm planning a character, **When** I link "Steel Sword" to "Aragorn" character, **Then** sword appears in Aragorn's prop list
2. **Given** I'm viewing a character, **When** I check props, **Then** I see all linked props with photos and details
3. **Given** I try to link a prop already used by another character, **When** I attempt the link, **Then** system warns about potential conflict
4. **Given** I'm planning multiple characters, **When** I view prop conflicts, **Then** I see which items are double-booked

---

### User Story 4 - Track Prop Construction and Maintenance (Priority: P4)

As a prop maker, I want to track the construction process and maintenance needs of my props so that they stay in good condition for future use.

**Why this priority**: Asset management feature - helps maintain valuable props and plan repairs.

**Independent Test**: User can track construction progress, schedule maintenance, and monitor prop condition.

**Acceptance Scenarios**:

1. **Given** I'm building a prop, **When** I update construction status to "Painting", **Then** prop shows current construction phase
2. **Given** I'm scheduling maintenance, **When** I set "Clean and oil" reminder for next month, **Then** reminder appears in my task list
3. **Given** I'm viewing props, **When** I filter by "Needs Repair", **Then** I see all props requiring attention
4. **Given** I'm tracking construction, **When** I view a prop, **Then** I see construction timeline and techniques used

---

### Edge Cases

- What happens when a prop is damaged or broken? (Mark as damaged with incident details, remove from character links)
- How to handle props that are part of a set? (Support for prop sets and individual items)
- What if a prop needs to be shared between characters? (Support for temporary character assignments)
- How to handle props that are being repaired or modified? (Support for status tracking and temporary unavailability)
- What if a prop has multiple photos from different angles? (Support for photo galleries and 360-degree views)
- How to handle props that are custom-made or one-of-a-kind? (Support for custom item tracking and value estimation)
- What if a prop needs to be insured or appraised? (Support for insurance and appraisal tracking)
- How to handle props that are seasonal or event-specific? (Support for seasonal availability and event tagging)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating prop entries with photos, name, description, and category
- **FR-002**: System MUST support prop categories: Weapons, Tools, Accessories, Decorative, Other
- **FR-003**: System MUST allow uploading multiple photos per prop with different angles
- **FR-004**: System MUST support prop condition tracking: Excellent, Good, Fair, Poor, Needs Repair
- **FR-005**: System MUST allow linking props to specific characters
- **FR-006**: System MUST provide prop search by name, description, category, and character
- **FR-007**: System MUST support prop filtering by category, condition, and availability
- **FR-008**: System MUST allow prop editing and condition updates with history tracking
- **FR-009**: System MUST support prop sets and individual item management
- **FR-010**: System MUST provide conflict detection when props are double-booked
- **FR-011**: System MUST support prop construction tracking and progress updates
- **FR-012**: System MUST allow prop maintenance scheduling and reminders
- **FR-013**: System MUST support prop value tracking and insurance information
- **FR-014**: System MUST support prop availability status (Available, In Use, Being Repaired, Lost)
- **FR-015**: System MUST provide prop usage history and character associations
- **FR-016**: System MUST support prop tags for custom categorization
- **FR-017**: System MUST allow bulk prop operations: update condition, assign to character, archive
- **FR-018**: System MUST provide prop inventory summary and statistics
- **FR-019**: System MUST support mobile-optimized prop management
- **FR-020**: System MUST allow prop export for backup and sharing

### Key Entities

- **Prop**: Main prop entity. Attributes: id, name, description, category, condition, availability_status, photos, value, insurance_info, construction_notes, created_at, updated_at, team_id
- **PropPhoto**: Photo management. Attributes: id, prop_id, photo_url, caption, is_primary, created_at
- **PropCharacterLink**: Character associations. Attributes: id, prop_id, character_id, assigned_date, notes, created_at
- **PropConstruction**: Construction tracking. Attributes: id, prop_id, construction_phase, progress_percentage, notes, completed_date, created_at
- **PropMaintenance**: Maintenance tracking. Attributes: id, prop_id, maintenance_type, scheduled_date, completed_date, notes, cost, created_at
- **PropConditionHistory**: Condition tracking. Attributes: id, prop_id, old_condition, new_condition, changed_by, changed_at, notes

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a prop with photo in under 2 minutes
- **SC-002**: Prop search returns results within 1 second
- **SC-003**: Character linking completes within 5 seconds
- **SC-004**: Mobile prop management supports one-handed operation
- **SC-005**: 95% of props have photos and proper categorization
- **SC-006**: Prop conflict detection prevents 90% of double-booking issues
- **SC-007**: Maintenance reminders are delivered 7 days before due date
- **SC-008**: Prop inventory loads within 3 seconds for 500+ items
- **SC-009**: Photo upload completes within 10 seconds on 3G connection
- **SC-010**: Prop export includes all photos and metadata

---

## Data Model

### Prop
```typescript
interface Prop {
  id: string;
  name: string;
  description?: string;
  category: 'weapons' | 'tools' | 'accessories' | 'decorative' | 'other';
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs_repair';
  availability_status: 'available' | 'in_use' | 'being_repaired' | 'lost';
  photos: PropPhoto[];
  value?: number;
  insurance_info?: {
    policy_number?: string;
    coverage_amount?: number;
    provider?: string;
  };
  construction_notes?: string;
  tags: string[];
  team_id: string;
  created_at: string;
  updated_at: string;
}
```

### PropPhoto
```typescript
interface PropPhoto {
  id: string;
  prop_id: string;
  photo_url: string;
  caption?: string;
  is_primary: boolean;
  created_at: string;
}
```

### PropCharacterLink
```typescript
interface PropCharacterLink {
  id: string;
  prop_id: string;
  character_id: string;
  assigned_date: string;
  notes?: string;
  created_at: string;
}
```

### PropConstruction
```typescript
interface PropConstruction {
  id: string;
  prop_id: string;
  construction_phase: string;
  progress_percentage: number;
  notes?: string;
  completed_date?: string;
  created_at: string;
}
```

---

## Technology Stack

- **Frontend**: SvelteKit, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage for photos
- **Real-time**: Supabase Realtime for live updates
- **State Management**: Svelte stores
- **Icons**: Lucide Icons
- **Image Processing**: Sharp for photo optimization
- **Validation**: Zod

---

## Dependencies

**Depends On**:
- 020-user-management-and-access (user context and permissions)
- 021-shoots-teams-creation (team context and character linking)
- 033-file-asset-management (photo storage and management)

**Required By**:
- Character planning and prop coordination
- Inventory management and asset tracking
- Construction tracking and maintenance

---

## Implementation Notes

- Use Supabase Storage for photo uploads with automatic optimization
- Implement RLS for prop access control based on team membership
- Support multiple photo uploads with drag-and-drop interface
- Create conflict detection system for double-booked props
- Implement construction tracking with progress milestones
- Support prop sets for grouped items (e.g., matching sword and shield)
- Provide mobile-optimized interface for on-the-go prop management
- Implement condition history tracking for asset management
- Support prop export with photos and metadata
- Create prop dashboard with maintenance alerts and recent additions