# Feature Specification: Costume Accessories

> ⚠️ **SUPERSEDED BY SPEC 048 (Character-Centric Resource Model)**  
> This specification has been consolidated into [spec 048-character-resource-model](../048-character-resource-model/spec.md).  
> All accessories and makeup features from this spec have been integrated with character linking, and wigs have been promoted to a dedicated top-level category.  
> **This spec is retained for historical reference only.**  
> See [spec 048 Integration Notes](../048-character-resource-model/spec.md#integration-notes) for details.

**Feature Branch**: `046-costume-accessories`
**Created**: October 23, 2025
**Status**: ~~Draft~~ **SUPERSEDED** (Consolidated into Spec 048)
**Input**: Add accessories and makeup resource management for tracking small costume-related items like colored contacts, jewelry, makeup, wigs, and other accessories that enhance costumes but are managed separately

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Manage Accessories Inventory (Priority: P2)

As a cosplayer, I want to track my costume accessories (jewelry, colored contacts, makeup, wigs) with their condition, usage, and storage location so that I can find the right accessories for each costume and track what needs maintenance or replacement.

**Why this priority**: Accessories are essential costume components that get used across multiple costumes and need separate tracking from full costumes. They represent significant investment and are often shared between different looks.

**Independent Test**: User can add accessories with photos, condition, storage location, and usage tracking, search/filter accessories, and track accessory lifecycle independently of costume management.

**Acceptance Scenarios**:

1. **Given** I'm managing accessories, **When** I navigate to Accessories page and click "Add Accessory", **Then** I see a form for accessory name, type (jewelry, contacts, makeup, wig), color/style, condition, storage location, and photos
2. **Given** I have colored contacts, **When** I add them with prescription details and usage notes, **Then** accessory displays with eye icon and prescription badge
3. **Given** I have multiple jewelry pieces, **When** I filter by type "Jewelry" or color "Silver", **Then** matching accessories display
4. **Given** accessory needs cleaning, **When** I change status to "Needs Cleaning" and add cleaning notes, **Then** accessory shows as unavailable with cleaning reminder
5. **Given** I'm planning a costume, **When** I view accessories list, **Then** I can quickly see which accessories are available vs in-use or damaged

---

### User Story 2 - Track Makeup Inventory (Priority: P2)

As a makeup artist, I want to manage my makeup collection (foundations, eyeshadows, lipsticks) with expiration dates, usage frequency, and color matching so that I know what products I have available and what needs replacement.

**Why this priority**: Makeup has limited shelf life and represents significant investment. Separate tracking from costumes/props allows for better organization and prevents expired product usage.

**Independent Test**: User can add makeup items with brand, shade, expiration dates, usage tracking, and color categorization, search makeup by color or brand, and get expiration warnings independently.

**Acceptance Scenarios**:

1. **Given** I'm managing makeup, **When** I add foundation with brand, shade, and expiration date, **Then** system shows expiration countdown and warns when approaching expiry
2. **Given** I have eyeshadow palette, **When** I add multiple shades with color codes, **Then** I can search by color family or specific shade
3. **Given** makeup is running low, **When** I mark usage as "Low" and add reorder info, **Then** item shows reorder badge and is marked for replacement
4. **Given** I have 50 makeup items, **When** I filter by "Expiring Soon", **Then** only items expiring within 3 months display
5. **Given** I'm doing makeup for a shoot, **When** I view makeup inventory, **Then** I can filter by skin tone match or product type

---

### User Story 3 - Accessory-Costume Linking (Priority: P3)

As a cosplayer, I want to link accessories to specific costumes so that I can see what accessories work well together and avoid forgetting essential pieces for each character look.

**Why this priority**: Accessories are often character-specific and costume coordination requires knowing which accessories enhance which costumes. This builds on basic accessory management.

**Independent Test**: User can link accessories to costumes, view accessory suggestions for costumes, and see costume requirements when planning looks independently.

**Acceptance Scenarios**:

1. **Given** I have a costume and accessories, **When** I link colored contacts to a character costume, **Then** costume details show required accessories
2. **Given** I'm viewing a costume, **When** I see accessory suggestions, **Then** system shows accessories that match the character or have been used together before
3. **Given** accessory is costume-specific, **When** I mark it as "Character-Specific", **Then** it only appears in searches for that character
4. **Given** I'm planning multiple costumes, **When** I view accessory inventory, **Then** I can see which costumes each accessory has been used with
5. **Given** costume needs specific accessories, **When** I create accessory checklist for costume, **Then** I can check off accessories as gathered

---

### User Story 4 - Accessory Usage Tracking (Priority: P3)

As a cosplayer, I want to track how often accessories are used, their condition over time, and maintenance schedules so that I can plan for replacements and maintain my accessory collection.

**Why this priority**: Accessories wear out with use and need regular maintenance (cleaning, repair). Usage tracking helps with budgeting and prevents last-minute discoveries of damaged items.

**Independent Test**: User can track usage frequency, set maintenance reminders, view usage history, and get replacement suggestions based on wear independently.

**Acceptance Scenarios**:

1. **Given** I use jewelry frequently, **When** I log usage after each shoot, **Then** system tracks total uses and suggests cleaning intervals
2. **Given** wig needs styling, **When** I set maintenance reminder for "Restyling", **Then** system notifies me when maintenance is due
3. **Given** accessory shows wear, **When** I update condition with photos and notes, **Then** system tracks condition history and suggests replacement timing
4. **Given** I have many accessories, **When** I view usage statistics, **Then** I see most/least used items and can identify over/under-utilized pieces
5. **Given** contacts are daily wear, **When** I track usage, **Then** system warns when approaching recommended replacement timeframe

### Edge Cases

- What happens when an accessory is shared between multiple costumes? (Allow multiple costume links, track usage per costume)
- How does system handle makeup with multiple shades in one product? (Track individual shades or treat as single product with shade notes)
- What happens when accessory is lost but was linked to costumes? (Remove links, show as missing in costume requirements)
- How does system handle expired makeup products? (Auto-mark as expired, prevent from showing in available inventory)
- What happens when wig needs restyling between uses? (Track restyling status, show as unavailable during styling)
- How does system handle prescription contacts vs cosmetic contacts? (Different tracking for prescription requirements and replacement schedules)
- What happens when jewelry needs repair? (Track repair status, cost, and timeline separately from condition)

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

**Accessory Management:**
- **FR-001**: System MUST allow users to create, read, update, and delete accessory entries within their team
- **FR-002**: System MUST support accessory types: jewelry, contacts, makeup, wig, other
- **FR-003**: System MUST track accessory metadata: name, type, color/style, brand, size, prescription info (for contacts), condition, storage location, purchase cost, purchase date
- **FR-004**: System MUST support accessory lifecycle states: available, in-use, needs-cleaning, needs-repair, damaged, lost, expired (makeup)
- **FR-005**: System MUST allow users to upload 1-5 photos per accessory (minimum 1, maximum 5)
- **FR-006**: System MUST allow users to filter accessories by type, color, condition, availability, or character association
- **FR-007**: System MUST track accessory usage history and frequency
- **FR-008**: System MUST support maintenance reminders for accessories (cleaning, repair, restyling schedules)
- **FR-009**: System MUST allow linking accessories to specific costumes for coordination planning

**Makeup Management:**
- **FR-010**: System MUST allow users to create, read, update, and delete makeup entries within their team
- **FR-011**: System MUST support makeup types: foundation, concealer, eyeshadow, eyeliner, mascara, lipstick, blush, contour, setting spray, other
- **FR-012**: System MUST track makeup metadata: brand, product name, shade, color family, skin tone match, expiration date, usage level, purchase cost, purchase date
- **FR-013**: System MUST support makeup-specific states: available, low, expired, discontinued, needs-replacement
- **FR-014**: System MUST provide expiration date warnings and auto-mark products as expired
- **FR-015**: System MUST allow users to filter makeup by color family, brand, skin tone match, or expiration status
- **FR-016**: System MUST track makeup usage level (new, half-full, low, empty) with visual indicators

**Cross-Accessory Requirements:**
- **FR-017**: System MUST support searching across accessories and makeup with color-based filtering
- **FR-018**: System MUST allow bulk operations for accessories (bulk status changes, bulk maintenance scheduling)
- **FR-019**: System MUST track creation date, last modified date, and created by user for all accessories
- **FR-020**: System MUST enforce team permissions (only team members can view/edit team accessories)
- **FR-021**: System MUST compress uploaded images to optimize storage and bandwidth
- **FR-022**: System MUST support soft-delete for accessories (mark as deleted, retain for 3 months)
- **FR-023**: System MUST provide accessory usage statistics (total accessories, most used items, upcoming maintenance)

### Key Entities *(include if feature involves data)*

- **Accessory**: Represents costume accessories and makeup items with type, color, condition, usage tracking, and maintenance schedules. Links to costumes for coordination planning.
- **Makeup Product**: Represents makeup items with brand, shade, expiration dates, usage levels, and skin tone matching. Specialized tracking for consumable beauty products.
- **Accessory Type**: Categorizes accessories (jewelry, contacts, makeup, wig) with specific metadata fields and validation rules for each type.
- **Accessory Usage History**: Tracks when and how accessories are used, including which costumes they were paired with and condition changes over time.
- **Maintenance Schedule**: Represents scheduled maintenance tasks for accessories (cleaning, repair, restyling) with due dates and completion tracking.
- **Costume-Accessory Link**: Junction entity linking accessories to costumes with usage notes and character-specific associations.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Users can add a new accessory with photos and details in under 90 seconds
- **SC-002**: Users can find a specific accessory by color or type in under 5 seconds using search/filter
- **SC-003**: 90% of users successfully create their first accessory entry on first attempt without help documentation
- **SC-004**: System displays accessory lists with 100+ items without performance degradation (page load under 2 seconds)
- **SC-005**: Users receive expiration warnings for makeup products at least 1 month before expiry
- **SC-006**: Accessory photos load and display within 1 second on mobile connections (compressed thumbnails)
- **SC-007**: 80% of users report that accessory management reduces costume preparation time by at least 20%
- **SC-008**: Users can link accessories to costumes and view coordinated looks in under 30 seconds
- **SC-009**: Maintenance reminders are delivered accurately and result in 90% task completion rate
- **SC-010**: Zero data loss incidents for accessory photos and metadata

