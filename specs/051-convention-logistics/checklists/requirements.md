# Requirements Checklist: Convention Logistics & Event Planning

**Feature**: Convention Logistics & Event Planning  
**Spec**: 051-convention-logistics  
**Status**: Draft - Ideas Phase

## User Story Completion

- [ ] **US1** - Convention Packing Checklist (P1)
- [ ] **US2** - Transportation Planning (P1)
- [ ] **US3** - Weather & Backup Location Planning (P2)
- [ ] **US4** - Item Source Tracking (Manufacturer vs Commission) (P2)
- [ ] **US5** - Con Survival Kit Customization (P3)

## Functional Requirements

### Packing List Generation
- [ ] **FR-001** - Auto-generate from linked characters/outfits
- [ ] **FR-002** - Include all components (outfit, wig, props, makeup, equipment)
- [ ] **FR-003** - Check off items as packed/unpacked
- [ ] **FR-004** - Add custom items to list
- [ ] **FR-005** - Show packing progress (X of Y packed)
- [ ] **FR-006** - Save reusable templates

### Transportation Planning
- [ ] **FR-007** - Tag items by transport method (carry-on, checked, ship)
- [ ] **FR-008** - Warn for oversized props
- [ ] **FR-009** - Group items by bag/container
- [ ] **FR-010** - Preserve transportation notes from previous events
- [ ] **FR-011** - Flag items requiring disassembly

### Weather & Location
- [ ] **FR-012** - Display weather forecast for shoot locations
- [ ] **FR-013** - Support backup/alternative locations
- [ ] **FR-014** - Send weather alert notifications
- [ ] **FR-015** - Switch active location and notify team
- [ ] **FR-016** - Track location history with weather outcomes

### Item Source Tracking
- [ ] **FR-017** - Tag resources with source type
- [ ] **FR-018** - Track manufacturer/commissioner details
- [ ] **FR-019** - Record cost, quality rating, turnaround time
- [ ] **FR-020** - Filter resources by source type
- [ ] **FR-021** - Calculate average costs per source
- [ ] **FR-022** - Link to vendor/creator profiles (spec 048)

### Event Checklist
- [ ] **FR-023** - Non-costume items (hotel, badge, parking)
- [ ] **FR-024** - Collaborative packing with assignments
- [ ] **FR-025** - Flag international events with customs reminders
- [ ] **FR-026** - Export packing list as PDF

## Success Criteria

- [ ] **SC-001** - Packing list generates in under 2 seconds (5 characters)
- [ ] **SC-002** - 90% report fewer forgotten items
- [ ] **SC-003** - Weather alerts sent 24hrs before with 95% uptime
- [ ] **SC-004** - 50% fewer cancelled shoots with backup locations
- [ ] **SC-005** - 70% make better budget decisions with source tracking
- [ ] **SC-006** - PDF export in under 5 seconds

## Dependencies

- [ ] Spec 048 (Characters, outfits, wigs, props, vendors, events)
- [ ] Weather API integration (OpenWeatherMap or Weather.gov)
- [ ] Notification system (spec 031)
- [ ] PDF export library

