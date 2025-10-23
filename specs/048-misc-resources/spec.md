# Feature Specification: Miscellaneous Resources Management

**Feature Branch**: `048-misc-resources`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: Miscellaneous resources management for foam, paints, tools, materials, and other supplies used in cosplay construction.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Material Inventory (Priority: P1)

As a cosplay builder, I want to catalog my miscellaneous materials (foam, paints, tools, etc.) so that I can track what I have and plan purchases for upcoming projects.

**Why this priority**: Core inventory functionality - essential for material management and project planning.

**Independent Test**: User can create material entries with photos, quantities, and categorization.

**Acceptance Scenarios**:

1. **Given** I'm on the misc resources page, **When** I add "EVA Foam 6mm" with quantity "5 sheets", **Then** material is cataloged with proper details
2. **Given** I'm adding a material, **When** I select "Foam" category and add notes "Good for armor pieces", **Then** material is properly categorized and searchable
3. **Given** I'm adding a material, **When** I set condition to "New" and add purchase date, **Then** material shows proper condition and acquisition info
4. **Given** I'm on mobile, **When** I add a material, **Then** form is mobile-optimized and easy to complete

---

### User Story 2 - Categorize Materials by Type (Priority: P2)

As a project organizer, I want to categorize materials by type (Foam, Paints, Tools, Hardware, Fabric, Other) so that team members can quickly find what they need.

**Why this priority**: Adds organization and helps with material management and project planning.

**Independent Test**: User can assign categories, filter by type, and see category-specific inventory.

**Acceptance Scenarios**:

1. **Given** I'm adding materials, **When** I select "Paints" for acrylic paint, **Then** it appears in the Paints category
2. **Given** I have materials in multiple categories, **When** I filter by "Tools", **Then** only tools are displayed
3. **Given** I'm planning a project, **When** I search for "foam materials", **Then** I see all foam-related items
4. **Given** I'm viewing inventory, **When** I see category summary, **Then** it shows "Foam: 15 items, Paints: 8 items, Tools: 12 items" etc.

---

### User Story 3 - Track Material Usage and Projects (Priority: P3)

As a project manager, I want to track which materials are used in which projects so that I can monitor consumption and plan future purchases.

**Why this priority**: Project integration and consumption tracking - helps with budgeting and planning.

**Independent Test**: User can link materials to projects, track usage, and monitor consumption.

**Acceptance Scenarios**:

1. **Given** I'm working on a project, **When** I use "EVA Foam 6mm" for armor pieces, **Then** usage is tracked and quantity is updated
2. **Given** I'm viewing a material, **When** I check usage history, **Then** I see which projects used this material and when
3. **Given** I'm planning a new project, **When** I check material availability, **Then** I see current quantities and can plan purchases
4. **Given** I'm viewing project details, **When** I check materials used, **Then** I see complete material list with quantities

---

### User Story 4 - Manage Material Suppliers and Purchasing (Priority: P4)

As a budget-conscious builder, I want to track suppliers, prices, and purchasing history so that I can make informed buying decisions and stay within budget.

**Why this priority**: Cost management and supplier tracking - helps with budgeting and finding best deals.

**Independent Test**: User can add suppliers, track prices, and manage purchasing history.

**Acceptance Scenarios**:

1. **Given** I'm adding a material, **When** I enter supplier "FoamMart" and price "$15.99", **Then** supplier and price info is saved
2. **Given** I'm viewing a material, **When** I check price history, **Then** I see price changes over time and best deals
3. **Given** I'm planning a purchase, **When** I search for "EVA foam", **Then** I see all suppliers and current prices
4. **Given** I'm tracking expenses, **When** I view purchasing summary, **Then** I see total spent by category and supplier

---

### Edge Cases

- What happens when a material is discontinued or no longer available? (Mark as discontinued, suggest alternatives)
- How to handle materials that are shared between multiple projects? (Support for material sharing and conflict detection)
- What if a material needs to be stored in specific conditions? (Support for storage requirements and environmental notes)
- How to handle materials that are hazardous or require special handling? (Support for safety information and handling instructions)
- What if a material needs to be ordered in bulk or has minimum quantities? (Support for bulk ordering and quantity requirements)
- How to handle materials that are custom-made or one-of-a-kind? (Support for custom material tracking and specifications)
- What if a material needs to be returned or exchanged? (Support for return tracking and exchange management)
- How to handle materials that are seasonal or event-specific? (Support for seasonal availability and event tagging)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating material entries with name, description, category, and quantity
- **FR-002**: System MUST support material categories: Foam, Paints, Tools, Hardware, Fabric, Other
- **FR-003**: System MUST allow uploading photos of materials for visual reference
- **FR-004**: System MUST support material condition tracking: New, Good, Used, Damaged, Expired
- **FR-005**: System MUST allow tracking material usage in projects with quantities consumed
- **FR-006**: System MUST support supplier management with contact information and pricing
- **FR-007**: System MUST allow price tracking and purchase history for materials
- **FR-008**: System MUST support material search by name, category, supplier, and project
- **FR-009**: System MUST provide material filtering by category, condition, and availability
- **FR-010**: System MUST allow material editing and quantity updates with history tracking
- **FR-011**: System MUST support material sharing between team members and projects
- **FR-012**: System MUST provide low stock alerts and reorder suggestions
- **FR-013**: System MUST support material tags for custom categorization
- **FR-014**: System MUST allow bulk material operations: update quantities, assign to projects, archive
- **FR-015**: System MUST support material specifications and technical details
- **FR-016**: System MUST provide material usage analytics and consumption reports
- **FR-017**: System MUST support material storage location tracking
- **FR-018**: System MUST allow mobile-optimized material management
- **FR-019**: System MUST allow material export for backup and sharing
- **FR-020**: System MUST provide material dashboard with alerts and recent activity

### Key Entities

- **MiscResource**: Main material entity. Attributes: id, name, description, category, quantity, condition, photos, supplier_id, cost, storage_location, specifications, created_at, updated_at, team_id
- **MaterialSupplier**: Supplier information. Attributes: id, name, contact_info, website, notes, created_at, updated_at, team_id
- **MaterialUsage**: Usage tracking. Attributes: id, material_id, project_id, quantity_used, usage_date, notes, created_at
- **MaterialPurchase**: Purchase history. Attributes: id, material_id, supplier_id, quantity, cost, purchase_date, notes, created_at
- **MaterialSpecification**: Technical details. Attributes: id, material_id, spec_name, spec_value, unit, created_at
- **MaterialStorage**: Storage information. Attributes: id, material_id, location, conditions, notes, created_at, updated_at

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a material in under 2 minutes
- **SC-002**: Material search returns results within 1 second
- **SC-003**: Usage tracking updates within 5 seconds
- **SC-004**: Mobile material management supports one-handed operation
- **SC-005**: 90% of materials have photos and proper categorization
- **SC-006**: Low stock alerts prevent 95% of material shortages
- **SC-007**: Price tracking helps reduce material costs by 15%
- **SC-008**: Material inventory loads within 3 seconds for 1000+ items
- **SC-009**: Photo upload completes within 10 seconds on 3G connection
- **SC-010**: Material export includes all photos and detailed specifications

---

## Data Model

### MiscResource
```typescript
interface MiscResource {
  id: string;
  name: string;
  description?: string;
  category: 'foam' | 'paints' | 'tools' | 'hardware' | 'fabric' | 'other';
  quantity: number;
  condition: 'new' | 'good' | 'used' | 'damaged' | 'expired';
  photos: MaterialPhoto[];
  supplier_id?: string;
  cost?: number;
  storage_location?: string;
  specifications: MaterialSpecification[];
  tags: string[];
  team_id: string;
  created_at: string;
  updated_at: string;
}
```

### MaterialSupplier
```typescript
interface MaterialSupplier {
  id: string;
  name: string;
  contact_info: {
    email?: string;
    phone?: string;
    address?: string;
  };
  website?: string;
  notes?: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}
```

### MaterialUsage
```typescript
interface MaterialUsage {
  id: string;
  material_id: string;
  project_id: string;
  quantity_used: number;
  usage_date: string;
  notes?: string;
  created_at: string;
}
```

### MaterialPurchase
```typescript
interface MaterialPurchase {
  id: string;
  material_id: string;
  supplier_id: string;
  quantity: number;
  cost: number;
  purchase_date: string;
  notes?: string;
  created_at: string;
}
```

### MaterialSpecification
```typescript
interface MaterialSpecification {
  id: string;
  material_id: string;
  spec_name: string;
  spec_value: string;
  unit?: string;
  created_at: string;
}
```

### MaterialPhoto
```typescript
interface MaterialPhoto {
  id: string;
  material_id: string;
  photo_url: string;
  caption?: string;
  is_primary: boolean;
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
- 021-shoots-teams-creation (team context and project linking)
- 033-file-asset-management (photo storage and management)

**Required By**:
- Project planning and material coordination
- Inventory management and supply tracking
- Cost management and budgeting

---

## Implementation Notes

- Use Supabase Storage for photo uploads with automatic optimization
- Implement RLS for material access control based on team membership
- Support multiple photo uploads with drag-and-drop interface
- Create usage tracking system for project integration
- Implement supplier management with pricing history
- Support material sharing between team members and projects
- Provide mobile-optimized interface for on-the-go material management
- Implement low stock alerts and reorder suggestions
- Support material specifications and technical details
- Create material dashboard with alerts and recent activity