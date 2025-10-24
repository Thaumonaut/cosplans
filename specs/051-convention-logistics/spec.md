# Feature Specification: Convention Logistics & Event Planning

**Feature Branch**: `051-convention-logistics`  
**Created**: October 24, 2025  
**Status**: Draft - Ideas Phase  
**Input**: User description: "Convention packing list, transportation planning for props/outfits, weather conditions and alternative locations for shoots, tracking where items come from (manufacturer vs commission) for future planning."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Convention Packing Checklist (Priority: P1)

As a cosplayer attending a convention, I want a generated packing checklist based on which characters I'm bringing so that I don't forget critical costume pieces, props, or repair supplies.

**Why this priority**: Core logistics feature - forgetting costume pieces ruins the experience. This is the foundation for convention planning.

**Independent Test**: User selects characters/outfits for event, system generates packing checklist; user can check off items, add custom items.

**Acceptance Scenarios**:

1. **Given** I'm attending Anime Expo with 3 characters, **When** I link those characters to the event, **Then** system generates packing list with all costume components, wigs, props from those characters
2. **Given** I have packing list, **When** I review it, **Then** I see "Saber Armor - chest piece, gauntlets, boots; Wig #3; Sword Prop"
3. **Given** packing list is generated, **When** I check off items as packed, **Then** progress shows "18 of 25 items packed"
4. **Given** I'm packing, **When** I realize I need hotel room items, **Then** I can add custom items like "Wig spray, safety pins, fabric glue, phone charger"
5. **Given** event is over, **When** I check items as repacked, **Then** I ensure nothing left behind at hotel

---

### User Story 2 - Transportation Planning (Priority: P1)

As a cosplayer with large props, I want to track transportation notes per item (carry-on, checked bag, ship ahead, disassemble) so that I can plan packing and avoid damaged or lost items.

**Why this priority**: Prevents disaster - broken props or items that don't fit in luggage. Essential for travel logistics.

**Independent Test**: User can set transportation method per prop/outfit, see warnings for oversized items, generate packing strategy.

**Acceptance Scenarios**:

1. **Given** I have 6-foot sword prop, **When** I view packing list, **Then** system warns "Oversized - cannot carry on, recommend disassembly or ship ahead"
2. **Given** I'm planning packing, **When** I tag items by bag (carry-on A, checked bag B, ship ahead), **Then** I see "Carry-on A: wig, makeup bag, armor chest (disassembled). Checked bag B: boots, fabric pieces"
3. **Given** prop has notes "disassembles into 3 pieces", **When** I view transportation plan, **Then** I remember to bring assembly tools
4. **Given** I've traveled with outfit before, **When** I view notes, **Then** I see previous trip notes like "chest piece got crushed in suitcase - use bubble wrap next time"

---

### User Story 3 - Weather & Backup Location Planning for Shoots (Priority: P2)

As a photographer planning outdoor shoots, I want to track weather conditions and alternative locations so that I have backup plans when weather doesn't cooperate.

**Why this priority**: Real pain point (user mentioned rain ruining shoot plans). Builds on location management to add weather contingencies.

**Independent Test**: User can set primary and backup locations for shoot, view weather forecast, automatically get notifications for bad weather.

**Acceptance Scenarios**:

1. **Given** I plan outdoor shoot for Oct 30, **When** I create shoot at "Griffith Observatory", **Then** system shows 10-day weather forecast for that location
2. **Given** primary location is outdoors, **When** I add backup location "Downtown parking garage (covered)", **Then** team knows where to go if rain
3. **Given** shoot is in 3 days, **When** forecast shows 80% rain, **Then** I receive notification "Weather alert: Consider backup location for Griffith shoot"
4. **Given** shoot day has bad weather, **When** I switch to backup location, **Then** team is notified of location change with new address/directions
5. **Given** I'm planning future shoots, **When** I view location history, **Then** I see "Griffith Observatory - rained out Oct 2024, use spring/summer instead"

---

### User Story 4 - Item Source Tracking (Manufacturer vs Commission) (Priority: P2)

As a cosplayer planning budgets, I want to track whether items were purchased from manufacturers, commissioned from creators, or self-made so that I can make informed decisions for future projects.

**Why this priority**: Budget optimization and vendor reliability. Helps users learn what to DIY vs buy vs commission. Builds on vendor tracking (spec 048).

**Independent Test**: User can tag each resource with source type and details, filter resources by source, see cost comparisons.

**Acceptance Scenarios**:

1. **Given** I'm adding wig to character, **When** I select source, **Then** I choose "Manufacturer: Arda Wigs" or "Commissioner: @WigsByKaren" or "Self-Made"
2. **Given** I bought wig from Arda, **When** I save details, **Then** I record product name, cost, quality rating, delivery time
3. **Given** I commissioned armor from creator, **When** I save details, **Then** I record creator name, turnaround time, cost, satisfaction rating
4. **Given** I'm planning new character, **When** I need armor, **Then** I can filter "show all armor I've commissioned" to find reliable creators
5. **Given** I want to optimize budget, **When** I compare costs, **Then** I see "Manufacturer wigs avg $45, commissioned wigs avg $120, self-made avg $30 materials"

---

### User Story 5 - Con Survival Kit Customization (Priority: P3)

As an experienced con-goer, I want to save my standard "con survival kit" checklist so that I don't have to recreate it for every event.

**Why this priority**: Quality of life improvement. Builds on P1 packing lists with template/preset functionality.

**Independent Test**: User can create reusable packing list template, apply to any event, customize per event.

**Acceptance Scenarios**:

1. **Given** I attend cons regularly, **When** I create "Con Survival Kit" template, **Then** I save standard items like "safety pins, double-sided tape, phone battery, water bottle, snacks, business cards"
2. **Given** I'm packing for new con, **When** I apply template, **Then** all standard items appear in packing list
3. **Given** this con is different, **When** I customize list, **Then** I can add event-specific items without modifying template
4. **Given** I want to improve template, **When** event ends, **Then** I can update template based on "forgot X" or "didn't need Y"

---

### Edge Cases

- What if weather forecast changes last-minute? (Real-time notifications 24hrs and 2hrs before shoot)
- How to handle multi-day events with different costumes per day? (Separate packing lists per day, with overlap detection)
- What if prop breaks during travel? (Link to repair notes, nearby craft stores at destination)
- Should system remind about hotel confirmation, badge pickup, parking? (Yes, event checklist beyond just packing)
- How to share packing lists with roommates to avoid duplicate items? (Collaborative packing list with "who's bringing" assignments)
- What about international travel (customs, voltage converters)? (Flag international events, add customs-friendly item notes)
- Can users export packing list to print? (Yes, PDF export for offline reference)

## Requirements *(mandatory)*

### Functional Requirements

**Packing List Generation:**
- **FR-001**: System MUST auto-generate packing list based on characters/outfits linked to event
- **FR-002**: System MUST include all components (outfit pieces, wigs, props, makeup, equipment) for selected characters
- **FR-003**: System MUST allow users to check off items as packed/unpacked
- **FR-004**: System MUST support adding custom items to generated packing list
- **FR-005**: System MUST show packing progress (X of Y items packed)
- **FR-006**: System MUST allow saving packing list templates ("Con Survival Kit") for reuse

**Transportation Planning:**
- **FR-007**: System MUST allow tagging items by transportation method (carry-on, checked bag, ship ahead, drive)
- **FR-008**: System MUST warn when prop dimensions exceed airline carry-on limits
- **FR-009**: System MUST support grouping items by bag/container
- **FR-010**: System MUST preserve transportation notes from previous events ("wrap in bubble wrap")
- **FR-011**: System MUST flag items requiring disassembly with assembly/tool reminders

**Weather & Location:**
- **FR-012**: System MUST display weather forecast for shoot locations (integration with weather API)
- **FR-013**: System MUST support adding backup/alternative locations per shoot
- **FR-014**: System MUST send weather alert notifications when forecast shows poor conditions
- **FR-015**: System MUST allow switching active location and notifying team of change
- **FR-016**: System MUST track location history with weather outcomes (for future planning)

**Item Source Tracking:**
- **FR-017**: System MUST allow tagging resources with source type (Manufacturer, Commissioner, Self-Made)
- **FR-018**: System MUST track manufacturer/commissioner details (vendor, product name, creator name)
- **FR-019**: System MUST record cost, quality rating, turnaround time per sourced item
- **FR-020**: System MUST support filtering resources by source type
- **FR-021**: System MUST calculate average costs per source type for budget planning
- **FR-022**: System MUST link commissioned items to vendor/creator profiles (from spec 048)

**Event Checklist:**
- **FR-023**: System MUST support non-costume checklist items (hotel confirmation, badge, parking pass)
- **FR-024**: System MUST allow collaborative packing lists with assignment ("Alice brings wig spray, Bob brings repair kit")
- **FR-025**: System MUST flag international events with customs/travel reminders
- **FR-026**: System MUST support exporting packing list as PDF

### Key Entities

- **PackingList**: Generated checklist for event. Attributes: event ID, generated date, total items, packed count
- **PackingItem**: Individual item in packing list. Attributes: resource ID (or custom text), is packed (boolean), transportation method, bag/container assignment, notes
- **PackingTemplate**: Reusable packing list. Attributes: template name, default items, reuse count
- **Location** (extends spec 048): Add weather tracking attributes: last weather check, forecast data, historical weather notes
- **ShootLocation**: Primary and backup locations for shoot. Attributes: shoot ID, location ID, is primary (boolean), weather alert sent
- **ItemSource**: Track origin of purchased/commissioned items. Attributes: resource ID, source type (enum), vendor ID, cost, quality rating, turnaround days, creator name

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Packing list generates in under 2 seconds for events with up to 5 characters
- **SC-002**: 90% of users report fewer forgotten items when using packing lists (measured via post-event survey)
- **SC-003**: Weather alerts sent at least 24 hours before shoot with 95% uptime
- **SC-004**: Users with backup locations report 50% fewer cancelled shoots due to weather (measured via survey)
- **SC-005**: Item source tracking helps 70% of users make better budget decisions (measured via survey)
- **SC-006**: Packing list PDF exports successfully in under 5 seconds

## Assumptions

- Users plan events at least 1 week in advance
- Most events are within same country (limited international travel)
- Weather forecasts are reasonably accurate 7-10 days out
- Users willing to rate vendors/commissioners for source tracking
- Packing lists contain 20-100 items on average

## Dependencies

- **Spec 048** (Character-Centric Resource Model) - characters, outfits, wigs, props, vendors
- **Spec 048** Event/Convention entity - events to link packing lists to
- Weather API (OpenWeatherMap, Weather.gov) - for forecast data
- Location entity (spec 048) - for primary/backup location tracking
- Notification system (spec 031) - for weather alerts and location changes

## Out of Scope

- Flight/hotel booking integration
- Badge purchase / ticket sales
- Convention schedule/panel planning
- Meetup coordination
- Con photography appointment scheduling
- Travel insurance
- Customs declaration automation

## Notes

- User specifically mentioned: "I think the notes section on the props will work well for transportation planning but it could be a feature to keep an eye on for the future." → Start with notes, potentially upgrade to dedicated fields if users need more structure.
- User specifically mentioned weather/backup locations as pain point during recent shoot planning.
- Constitution (principle VI.4) emphasizes practical tools over social features - focus on logistics/planning, not social discovery.

---

**Status**: Ready for refinement. Higher priority than spec 050 (health/fitness). Should be addressed after spec 048 core implementation.

