# Feature Specification: Makeup Management

**Feature Branch**: `047-makeup`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: Makeup management for references, styles, products, techniques, and looks used in cosplay.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Makeup References (Priority: P1)

As a cosplayer, I want to save makeup references and inspiration images so that I can recreate specific looks for my characters.

**Why this priority**: Core reference functionality - essential for makeup planning and character accuracy.

**Independent Test**: User can upload reference images, add descriptions, and organize by character or style.

**Acceptance Scenarios**:

1. **Given** I'm on the makeup page, **When** I upload a reference image of a character's eye makeup, **Then** reference is saved with image and basic details
2. **Given** I'm adding a reference, **When** I tag it as "Gothic" style and link to "Raven" character, **Then** reference is properly categorized and searchable
3. **Given** I'm adding a reference, **When** I add notes "Focus on winged eyeliner and dark lipstick", **Then** reference includes detailed styling notes
4. **Given** I'm on mobile, **When** I add a reference, **Then** image upload works smoothly and form is mobile-optimized

---

### User Story 2 - Manage Makeup Products (Priority: P2)

As a makeup artist, I want to catalog my makeup products and supplies so that I can track what I own and plan purchases for specific looks.

**Why this priority**: Inventory management for makeup supplies - essential for planning and budgeting.

**Independent Test**: User can add products with details, track quantities, and organize by category.

**Acceptance Scenarios**:

1. **Given** I'm adding a product, **When** I enter "Urban Decay Naked Palette" with category "Eyeshadow", **Then** product is cataloged with proper categorization
2. **Given** I'm tracking inventory, **When** I set quantity to "2" and add expiration date, **Then** product shows current stock and shelf life
3. **Given** I'm viewing products, **When** I filter by "Lipstick" category, **Then** only lipstick products are displayed
4. **Given** I'm planning a look, **When** I search for "red lipstick", **Then** I see all red lipstick products in my inventory

---

### User Story 3 - Create Makeup Looks and Styles (Priority: P3)

As a makeup artist, I want to create detailed makeup looks with step-by-step instructions so that I can recreate them consistently for shoots.

**Why this priority**: Look creation and documentation - helps with consistency and sharing techniques.

**Independent Test**: User can create looks with steps, products, and photos.

**Acceptance Scenarios**:

1. **Given** I'm creating a look, **When** I add "Gothic Princess" with 5 steps, **Then** look is saved with step-by-step instructions
2. **Given** I'm documenting a look, **When** I add products used and application notes, **Then** look includes complete product list and techniques
3. **Given** I'm sharing a look, **When** I mark it as "Team Shared", **Then** other team members can view and use the look
4. **Given** I'm viewing a look, **When** I see the steps, **Then** each step has photos and detailed instructions

---

### User Story 4 - Link Makeup to Characters and Shoots (Priority: P4)

As a character planner, I want to link makeup looks to specific characters and shoots so that I can see what makeup is needed for each project.

**Why this priority**: Project integration - helps with character planning and shoot preparation.

**Independent Test**: User can link looks to characters, view character-specific makeup, and plan shoot makeup.

**Acceptance Scenarios**:

1. **Given** I'm planning a character, **When** I link "Gothic Princess" look to "Raven" character, **Then** look appears in Raven's makeup section
2. **Given** I'm preparing for a shoot, **When** I check the makeup plan, **Then** I see all required looks and products
3. **Given** I'm viewing a character, **When** I check makeup history, **Then** I see all looks used for that character
4. **Given** I'm planning multiple characters, **When** I view makeup conflicts, **Then** I see which products are needed for multiple looks

---

### Edge Cases

- What happens when a makeup product is discontinued or out of stock? (Mark as unavailable, suggest alternatives)
- How to handle makeup looks that require special effects or prosthetics? (Support for SFX makeup and special techniques)
- What if a makeup look needs to be modified for different skin tones? (Support for skin tone variations and adaptations)
- How to handle makeup looks that are seasonal or event-specific? (Support for seasonal looks and event tagging)
- What if a makeup look requires professional application? (Support for skill level requirements and professional notes)
- How to handle makeup looks that are inspired by but not exact copies? (Support for inspiration vs. recreation tracking)
- What if a makeup look needs to be adapted for photography vs. convention wear? (Support for different application contexts)
- How to handle makeup looks that require specific tools or brushes? (Support for tool requirements and equipment lists)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating makeup references with images, descriptions, and tags
- **FR-002**: System MUST support reference categories: Character, Style, Technique, Inspiration
- **FR-003**: System MUST allow uploading multiple reference images per entry
- **FR-004**: System MUST support makeup product cataloging with brand, name, category, and details
- **FR-005**: System MUST support product categories: Foundation, Eyeshadow, Eyeliner, Mascara, Lipstick, Blush, Highlighter, Other
- **FR-006**: System MUST allow tracking product quantities, expiration dates, and purchase information
- **FR-007**: System MUST support creating makeup looks with step-by-step instructions
- **FR-008**: System MUST allow linking products to specific looks and steps
- **FR-009**: System MUST support look sharing within teams and privacy controls
- **FR-010**: System MUST allow linking looks to characters and shoots
- **FR-011**: System MUST provide makeup search by reference, product, look, or character
- **FR-012**: System MUST support makeup filtering by category, style, skill level, and availability
- **FR-013**: System MUST allow makeup look editing and version control
- **FR-014**: System MUST support makeup inspiration boards and collections
- **FR-015**: System MUST allow makeup look rating and review system
- **FR-016**: System MUST support makeup tool and brush requirements
- **FR-017**: System MUST allow makeup look duplication and modification
- **FR-018**: System MUST provide mobile-optimized makeup management
- **FR-019**: System MUST allow makeup export for sharing and backup
- **FR-020**: System MUST provide makeup dashboard with recent looks and product alerts

### Key Entities

- **MakeupReference**: Reference images and inspiration. Attributes: id, title, description, category, tags, images, character_id (optional), style, skill_level, created_at, updated_at, team_id
- **MakeupProduct**: Product inventory. Attributes: id, brand, name, category, color, quantity, expiration_date, purchase_date, cost, notes, created_at, updated_at, team_id
- **MakeupLook**: Complete makeup looks. Attributes: id, name, description, steps, products_used, skill_level, duration, character_id (optional), is_shared, created_by, created_at, updated_at, team_id
- **MakeupStep**: Individual look steps. Attributes: id, look_id, step_number, title, description, products, tools, duration, photos, created_at
- **MakeupProductUsage**: Product usage tracking. Attributes: id, product_id, look_id, step_id, amount_used, notes, created_at
- **MakeupTool**: Required tools and brushes. Attributes: id, name, category, description, required_for_looks, created_at, updated_at

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a makeup reference in under 2 minutes
- **SC-002**: Makeup look creation completes within 5 minutes
- **SC-003**: Product search returns results within 1 second
- **SC-004**: Mobile makeup management supports one-handed operation
- **SC-005**: 90% of makeup looks have step-by-step instructions
- **SC-006**: Product inventory tracking prevents 95% of out-of-stock issues
- **SC-007**: Makeup look sharing increases team collaboration by 50%
- **SC-008**: Makeup dashboard loads within 3 seconds for 200+ items
- **SC-009**: Image upload completes within 15 seconds on 3G connection
- **SC-010**: Makeup export includes all images and detailed instructions

---

## Data Model

### MakeupReference
```typescript
interface MakeupReference {
  id: string;
  title: string;
  description?: string;
  category: 'character' | 'style' | 'technique' | 'inspiration';
  tags: string[];
  images: MakeupImage[];
  character_id?: string;
  style: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  team_id: string;
  created_at: string;
  updated_at: string;
}
```

### MakeupProduct
```typescript
interface MakeupProduct {
  id: string;
  brand: string;
  name: string;
  category: 'foundation' | 'eyeshadow' | 'eyeliner' | 'mascara' | 'lipstick' | 'blush' | 'highlighter' | 'other';
  color?: string;
  quantity: number;
  expiration_date?: string;
  purchase_date?: string;
  cost?: number;
  notes?: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}
```

### MakeupLook
```typescript
interface MakeupLook {
  id: string;
  name: string;
  description?: string;
  steps: MakeupStep[];
  products_used: MakeupProductUsage[];
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  duration: number; // in minutes
  character_id?: string;
  is_shared: boolean;
  created_by: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}
```

### MakeupStep
```typescript
interface MakeupStep {
  id: string;
  look_id: string;
  step_number: number;
  title: string;
  description: string;
  products: string[]; // product IDs
  tools: string[]; // tool IDs
  duration: number; // in minutes
  photos: MakeupImage[];
  created_at: string;
}
```

### MakeupImage
```typescript
interface MakeupImage {
  id: string;
  url: string;
  caption?: string;
  is_primary: boolean;
  created_at: string;
}
```

---

## Technology Stack

- **Frontend**: SvelteKit, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage for images
- **Real-time**: Supabase Realtime for live updates
- **State Management**: Svelte stores
- **Icons**: Lucide Icons
- **Image Processing**: Sharp for image optimization
- **Validation**: Zod

---

## Dependencies

**Depends On**:
- 020-user-management-and-access (user context and permissions)
- 021-shoots-teams-creation (team context and character linking)
- 033-file-asset-management (image storage and management)

**Required By**:
- Character planning and makeup coordination
- Product inventory and supply management
- Look sharing and technique documentation

---

## Implementation Notes

- Use Supabase Storage for image uploads with automatic optimization
- Implement RLS for makeup access control based on team membership
- Support multiple image uploads with drag-and-drop interface
- Create step-by-step look creation with photo support
- Implement product inventory tracking with expiration alerts
- Support makeup look sharing and collaboration features
- Provide mobile-optimized interface for on-the-go makeup management
- Implement skill level requirements and difficulty ratings
- Support makeup inspiration boards and collections
- Create makeup dashboard with recent looks and product alerts