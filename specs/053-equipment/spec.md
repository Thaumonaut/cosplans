# Feature Specification: Equipment Management

**Feature Branch**: `053-equipment`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: Equipment management for cameras, lenses, lighting, audio gear, and other photography equipment.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Equipment Inventory (Priority: P1)

As a photographer, I want to catalog my equipment so that I can track what I own and easily find items for specific shoots.

**Why this priority**: Core inventory functionality - essential for equipment management and shoot planning.

**Independent Test**: User can create equipment entries with photos, specifications, and categorization.

**Acceptance Scenarios**:

1. **Given** I'm on the equipment page, **When** I click "Add Equipment" and enter "Canon EOS R5", **Then** equipment is created with basic details
2. **Given** I'm adding equipment, **When** I select "Camera" category and add specifications, **Then** equipment is properly categorized and searchable
3. **Given** I'm adding equipment, **When** I set condition to "Excellent" and add notes "Perfect for portraits", **Then** equipment shows proper condition and usage notes
4. **Given** I'm on mobile, **When** I add equipment, **Then** form is mobile-optimized and photo upload works smoothly

---

### User Story 2 - Categorize Equipment by Type (Priority: P2)

As a team organizer, I want to categorize equipment by type (Cameras, Lenses, Lighting, Audio, Accessories, Other) so that team members can quickly find what they need.

**Why this priority**: Equipment organization and filtering - essential for efficient equipment selection.

**Independent Test**: User can assign categories, filter by type, and see category-specific inventory.

**Acceptance Scenarios**:

1. **Given** I'm adding equipment, **When** I select "Lens" for a 50mm lens, **Then** it appears in the Lens category
2. **Given** I have equipment in multiple categories, **When** I filter by "Lighting", **Then** only lighting equipment is displayed
3. **Given** I'm planning a shoot, **When** I search for "portrait lens", **Then** I see all portrait lenses
4. **Given** I'm viewing inventory, **When** I see category summary, **Then** it shows "Cameras: 3, Lenses: 8, Lighting: 5" etc.

---

### User Story 3 - Track Equipment Usage and Maintenance (Priority: P3)

As an equipment manager, I want to track equipment usage and maintenance schedules so that I can keep gear in good condition and plan replacements.

**Why this priority**: Asset management and maintenance - helps maintain valuable equipment and plan upgrades.

**Independent Test**: User can track usage, schedule maintenance, and monitor equipment condition.

**Acceptance Scenarios**:

1. **Given** I'm using equipment, **When** I log usage for a camera, **Then** usage is tracked with date and project
2. **Given** I'm scheduling maintenance, **When** I set "Sensor cleaning" reminder for next month, **Then** reminder appears in my task list
3. **Given** I'm viewing equipment, **When** I filter by "Needs Maintenance", **Then** I see all equipment requiring attention
4. **Given** I'm tracking usage, **When** I view equipment history, **Then** I see usage patterns and maintenance needs

---

### User Story 4 - Manage Equipment Availability and Booking (Priority: P4)

As a project coordinator, I want to track equipment availability and manage bookings so that I can schedule shoots without conflicts.

**Why this priority**: Scheduling and conflict management - helps with shoot coordination and resource allocation.

**Independent Test**: User can check availability, manage bookings, and detect conflicts.

**Acceptance Scenarios**:

1. **Given** I'm planning a shoot, **When** I check equipment availability for next Saturday, **Then** I see which equipment is free
2. **Given** I'm booking equipment, **When** I reserve it for a specific date and time, **Then** equipment shows as booked
3. **Given** I'm scheduling multiple shoots, **When** I try to book the same equipment twice, **Then** system warns about conflict
4. **Given** I'm viewing equipment calendar, **When** I see bookings, **Then** I can identify free time slots

---

### Edge Cases

- What happens when equipment is damaged or needs repair? (Mark as damaged, remove from availability, schedule repair)
- How to handle equipment that is being upgraded or replaced? (Support for equipment lifecycle management)
- What if equipment needs to be shared between multiple team members? (Support for equipment sharing and conflict resolution)
- How to handle equipment that requires special training or certification? (Support for training requirements and certification tracking)
- What if equipment has different rates for different uses or team members? (Support for dynamic pricing and rate management)
- How to handle equipment that is seasonal or weather-dependent? (Support for seasonal availability and weather considerations)
- What if equipment requires special storage or handling? (Support for storage requirements and handling instructions)
- How to handle equipment that is insured or under warranty? (Support for insurance and warranty tracking)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating equipment profiles with name, specifications, and photos
- **FR-002**: System MUST support equipment categories: Cameras, Lenses, Lighting, Audio, Accessories, Other
- **FR-003**: System MUST allow uploading multiple photos per equipment with different angles
- **FR-004**: System MUST support equipment specifications and technical details
- **FR-005**: System MUST allow tracking equipment condition and maintenance status
- **FR-006**: System MUST provide equipment search by name, specifications, and category
- **FR-007**: System MUST support equipment filtering by category, condition, and availability
- **FR-008**: System MUST allow equipment editing and profile updates with history tracking
- **FR-009**: System MUST support equipment usage tracking and project associations
- **FR-010**: System MUST provide conflict detection for equipment bookings
- **FR-011**: System MUST support equipment maintenance scheduling and reminders
- **FR-012**: System MUST allow equipment sharing within teams and privacy controls
- **FR-013**: System MUST support equipment recommendations based on shoot requirements
- **FR-014**: System MUST provide equipment analytics and usage reports
- **FR-015**: System MUST support equipment tags for custom categorization
- **FR-016**: System MUST allow bulk equipment operations: update status, assign to shoots, archive
- **FR-017**: System MUST provide equipment dashboard with recent activity and alerts
- **FR-018**: System MUST support mobile-optimized equipment management
- **FR-019**: System MUST allow equipment export for backup and sharing
- **FR-020**: System MUST provide equipment directory with specifications and availability

### Key Entities

- **Equipment**: Main equipment entity. Attributes: id, name, category, specifications, photos, condition, availability, maintenance_schedule, created_at, updated_at, team_id
- **EquipmentPhoto**: Photo management. Attributes: id, equipment_id, photo_url, caption, is_primary, created_at
- **EquipmentSpecification**: Technical details. Attributes: id, equipment_id, spec_name, spec_value, unit, created_at
- **EquipmentUsage**: Usage tracking. Attributes: id, equipment_id, shoot_id, start_date, end_date, notes, created_at
- **EquipmentMaintenance**: Maintenance tracking. Attributes: id, equipment_id, maintenance_type, scheduled_date, completed_date, notes, cost, created_at
- **EquipmentBooking**: Booking management. Attributes: id, equipment_id, shoot_id, start_date, end_date, status, notes, created_at

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add equipment in under 3 minutes
- **SC-002**: Equipment search returns results within 1 second
- **SC-003**: Availability checking completes within 2 seconds
- **SC-004**: Mobile equipment management supports one-handed operation
- **SC-005**: 90% of equipment has photos and detailed specifications
- **SC-006**: Equipment conflict detection prevents 95% of double-booking issues
- **SC-007**: Maintenance reminders are delivered 7 days before due date
- **SC-008**: Equipment dashboard loads within 3 seconds for 200+ items
- **SC-009**: Photo upload completes within 10 seconds on 3G connection
- **SC-010**: Equipment export includes all photos and detailed specifications

---

## Data Model

### Equipment
```typescript
interface Equipment {
  id: string;
  name: string;
  category: 'cameras' | 'lenses' | 'lighting' | 'audio' | 'accessories' | 'other';
  specifications: EquipmentSpecification[];
  photos: EquipmentPhoto[];
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs_repair';
  availability: 'available' | 'in_use' | 'being_repaired' | 'lost';
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

### EquipmentPhoto
```typescript
interface EquipmentPhoto {
  id: string;
  equipment_id: string;
  photo_url: string;
  caption?: string;
  is_primary: boolean;
  created_at: string;
}
```

### EquipmentSpecification
```typescript
interface EquipmentSpecification {
  id: string;
  equipment_id: string;
  spec_name: string;
  spec_value: string;
  unit?: string;
  created_at: string;
}
```

### EquipmentUsage
```typescript
interface EquipmentUsage {
  id: string;
  equipment_id: string;
  shoot_id: string;
  start_date: string;
  end_date: string;
  notes?: string;
  created_at: string;
}
```

### EquipmentMaintenance
```typescript
interface EquipmentMaintenance {
  id: string;
  equipment_id: string;
  maintenance_type: 'cleaning' | 'repair' | 'calibration' | 'other';
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
- 021-shoots-teams-creation (team context and shoot linking)
- 033-file-asset-management (photo storage and management)
- 032-calendar-system (availability and scheduling)

**Required By**:
- Shoot planning and equipment coordination
- Equipment booking and conflict management
- Maintenance scheduling and asset tracking

---

## Implementation Notes

- Use Supabase Storage for photo uploads with automatic optimization
- Implement RLS for equipment access control based on team membership
- Support multiple photo uploads with drag-and-drop interface
- Create equipment recommendation system based on shoot requirements
- Implement availability management with calendar integration
- Support equipment sharing and collaboration features
- Provide mobile-optimized interface for on-the-go equipment management
- Implement conflict detection for equipment bookings
- Support maintenance scheduling with automatic reminders
- Create equipment dashboard with analytics and usage reports