# Feature Specification: Accessories Management

**Feature Branch**: `046-accessories`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: Accessories management for rings, earrings, necklaces, bracelets, watches, and other wearable accessories used in cosplay.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Accessory Inventory (Priority: P1)

As a cosplayer, I want to catalog my accessories (rings, earrings, necklaces, etc.) so that I can track what I own and easily find items for specific characters.

**Why this priority**: Core inventory functionality - essential for accessory management and character planning.

**Independent Test**: User can create accessory entries with photos, descriptions, and categorization.

**Acceptance Scenarios**:

1. **Given** I'm on the accessories page, **When** I click "Add Accessory" and upload a photo of my gold ring, **Then** accessory is created with photo and basic details
2. **Given** I'm adding an accessory, **When** I select "Ring" category and add description "Gold wedding band, size 7", **Then** accessory is properly categorized and searchable
3. **Given** I'm adding an accessory, **When** I set condition to "Excellent" and add notes "Perfect for medieval characters", **Then** accessory shows proper condition and usage notes
4. **Given** I'm on mobile, **When** I add an accessory, **Then** photo upload works smoothly and form is mobile-optimized

---

### User Story 2 - Categorize Accessories by Type (Priority: P2)

As a team organizer, I want to categorize accessories by type (Rings, Earrings, Necklaces, Bracelets, Watches, Other) so that team members can quickly find what they need.

**Why this priority**: Adds organization and helps with inventory management and character planning.

**Independent Test**: User can assign categories, filter by type, and see category-specific inventory.

**Acceptance Scenarios**:

1. **Given** I'm adding accessories, **When** I select "Earrings" for a pair of studs, **Then** they appear in the Earrings category
2. **Given** I have accessories in multiple categories, **When** I filter by "Necklaces", **Then** only necklaces are displayed
3. **Given** I'm planning a character, **When** I search for "gold accessories", **Then** I see all gold items across categories
4. **Given** I'm viewing inventory, **When** I see category summary, **Then** it shows "Rings: 5, Earrings: 12, Necklaces: 3" etc.

---

### User Story 3 - Link Accessories to Characters (Priority: P3)

As a character planner, I want to link accessories to specific characters so that I can see what items are needed for each cosplay and avoid conflicts.

**Why this priority**: Provides character planning context and helps with costume coordination.

**Independent Test**: User can link accessories to characters, view character-specific accessories, and manage conflicts.

**Acceptance Scenarios**:

1. **Given** I'm planning a character, **When** I link "Gold ring" to "Aragorn" character, **Then** ring appears in Aragorn's accessory list
2. **Given** I'm viewing a character, **When** I check accessories, **Then** I see all linked accessories with photos and details
3. **Given** I try to link an accessory already used by another character, **When** I attempt the link, **Then** system warns about potential conflict
4. **Given** I'm planning multiple characters, **When** I view accessory conflicts, **Then** I see which items are double-booked

---

### User Story 4 - Track Accessory Condition and Maintenance (Priority: P4)

As a careful cosplayer, I want to track the condition of my accessories and schedule maintenance so that they stay in good shape for future use.

**Why this priority**: Asset management feature - helps maintain valuable accessories and plan replacements.

**Independent Test**: User can update condition, schedule maintenance, and track accessory lifecycle.

**Acceptance Scenarios**:

1. **Given** I'm updating an accessory, **When** I change condition from "Good" to "Needs Repair", **Then** accessory shows updated condition with timestamp
2. **Given** I'm scheduling maintenance, **When** I set "Clean jewelry" reminder for next month, **Then** reminder appears in my task list
3. **Given** I'm viewing accessories, **When** I filter by "Needs Repair", **Then** I see all items requiring attention
4. **Given** I'm tracking condition history, **When** I view an accessory, **Then** I see condition changes over time

---

### Edge Cases

- What happens when an accessory is lost or stolen? (Mark as lost with incident details, remove from character links)
- How to handle accessories that are part of a set? (Support for accessory sets and individual items)
- What if an accessory needs to be shared between characters? (Support for temporary character assignments)
- How to handle accessories that are being repaired or modified? (Support for status tracking and temporary unavailability)
- What if an accessory has multiple photos from different angles? (Support for photo galleries and 360-degree views)
- How to handle accessories that are custom-made or one-of-a-kind? (Support for custom item tracking and value estimation)
- What if an accessory needs to be insured or appraised? (Support for insurance and appraisal tracking)
- How to handle accessories that are seasonal or event-specific? (Support for seasonal availability and event tagging)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating accessory entries with photos, name, description, and category
- **FR-002**: System MUST support accessory categories: Rings, Earrings, Necklaces, Bracelets, Watches, Other
- **FR-003**: System MUST allow uploading multiple photos per accessory with different angles
- **FR-004**: System MUST support accessory condition tracking: Excellent, Good, Fair, Poor, Needs Repair
- **FR-005**: System MUST allow linking accessories to specific characters
- **FR-006**: System MUST provide accessory search by name, description, category, and character
- **FR-007**: System MUST support accessory filtering by category, condition, and availability
- **FR-008**: System MUST allow accessory editing and condition updates with history tracking
- **FR-009**: System MUST support accessory sets and individual item management
- **FR-010**: System MUST provide conflict detection when accessories are double-booked
- **FR-011**: System MUST support accessory maintenance scheduling and reminders
- **FR-012**: System MUST allow accessory value tracking and insurance information
- **FR-013**: System MUST support accessory availability status (Available, In Use, Being Repaired, Lost)
- **FR-014**: System MUST provide accessory usage history and character associations
- **FR-015**: System MUST support accessory tags for custom categorization
- **FR-016**: System MUST allow bulk accessory operations: update condition, assign to character, archive
- **FR-017**: System MUST provide accessory inventory summary and statistics
- **FR-018**: System MUST support mobile-optimized accessory management
- **FR-019**: System MUST allow accessory export for backup and sharing
- **FR-020**: System MUST provide accessory dashboard with recent additions and maintenance alerts

### Key Entities

- **Accessory**: Main accessory entity. Attributes: id, name, description, category, condition, availability_status, photos, value, insurance_info, maintenance_schedule, created_at, updated_at, team_id
- **AccessoryPhoto**: Photo management. Attributes: id, accessory_id, photo_url, caption, is_primary, created_at
- **AccessoryCharacterLink**: Character associations. Attributes: id, accessory_id, character_id, assigned_date, notes, created_at
- **AccessoryMaintenance**: Maintenance tracking. Attributes: id, accessory_id, maintenance_type, scheduled_date, completed_date, notes, cost, created_at
- **AccessoryConditionHistory**: Condition tracking. Attributes: id, accessory_id, old_condition, new_condition, changed_by, changed_at, notes
- **AccessorySet**: Set management. Attributes: id, name, description, accessories, created_at, updated_at

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add an accessory with photo in under 2 minutes
- **SC-002**: Accessory search returns results within 1 second
- **SC-003**: Character linking completes within 5 seconds
- **SC-004**: Mobile accessory management supports one-handed operation
- **SC-005**: 95% of accessories have photos and proper categorization
- **SC-006**: Accessory conflict detection prevents 90% of double-booking issues
- **SC-007**: Maintenance reminders are delivered 7 days before due date
- **SC-008**: Accessory inventory loads within 3 seconds for 500+ items
- **SC-009**: Photo upload completes within 10 seconds on 3G connection
- **SC-010**: Accessory export includes all photos and metadata

---

## Data Model

### Accessory
```typescript
interface Accessory {
  id: string;
  name: string;
  description?: string;
  category: 'rings' | 'earrings' | 'necklaces' | 'bracelets' | 'watches' | 'other';
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs_repair';
  availability_status: 'available' | 'in_use' | 'being_repaired' | 'lost';
  photos: AccessoryPhoto[];
  value?: number;
  insurance_info?: {
    policy_number?: string;
    coverage_amount?: number;
    provider?: string;
  };
  maintenance_schedule?: {
    next_maintenance: string;
    frequency: 'monthly' | 'quarterly' | 'annually';
  };
  tags: string[];
  team_id: string;
  created_at: string;
  updated_at: string;
}
```

### AccessoryPhoto
```typescript
interface AccessoryPhoto {
  id: string;
  accessory_id: string;
  photo_url: string;
  caption?: string;
  is_primary: boolean;
  created_at: string;
}
```

### AccessoryCharacterLink
```typescript
interface AccessoryCharacterLink {
  id: string;
  accessory_id: string;
  character_id: string;
  assigned_date: string;
  notes?: string;
  created_at: string;
}
```

### AccessoryMaintenance
```typescript
interface AccessoryMaintenance {
  id: string;
  accessory_id: string;
  maintenance_type: 'cleaning' | 'repair' | 'appraisal' | 'other';
  scheduled_date: string;
  completed_date?: string;
  notes?: string;
  cost?: number;
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
- Character planning and costume coordination
- Inventory management and asset tracking
- Maintenance scheduling and reminders

---

## Implementation Notes

- Use Supabase Storage for photo uploads with automatic optimization
- Implement RLS for accessory access control based on team membership
- Support multiple photo uploads with drag-and-drop interface
- Create conflict detection system for double-booked accessories
- Implement maintenance scheduling with automatic reminders
- Support accessory sets for grouped items (e.g., matching earrings and necklace)
- Provide mobile-optimized interface for on-the-go accessory management
- Implement condition history tracking for asset management
- Support accessory export with photos and metadata
- Create accessory dashboard with maintenance alerts and recent additions