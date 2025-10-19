# Feature Specification: Convention & Event Integration

**Feature Branch**: `012-012-convention-event`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: Link shoots to conventions, track convention schedules, photoshoot meetups, venue maps, badge/ticket integration

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Link Shoots to Conventions (Priority: P1)

As a convention-goer planning shoots, I want to link my shoots to specific conventions (e.g., "Anime Expo 2025") so that I can see all my convention shoots grouped together and manage them alongside the event schedule.

**Why this priority**: Core convention context - helps organize shoots that happen at events vs standalone locations.

**Independent Test**: User can create/select convention, link shoots to it, view convention dashboard with all linked shoots.

**Acceptance Scenarios**:

1. **Given** I'm planning shoot at Anime Expo, **When** I create shoot and link to "Anime Expo 2025 - July 4-7", **Then** shoot displays convention badge and links to event
2. **Given** I have 5 shoots at same convention, **When** I view convention dashboard, **Then** all 5 shoots display with dates/times in event context
3. **Given** convention has location, **When** I link shoot to convention, **Then** convention venue auto-suggests as shoot location option
4. **Given** I'm browsing my shoots, **When** I filter "Convention shoots only", **Then** only shoots linked to conventions display

---

### User Story 2 - Import Convention Schedule (Priority: P2)

As a convention attendee, I want to import or manually add convention event schedule (panels, contests, meetups) so that I can plan shoots around my other convention activities and avoid conflicts.

**Why this priority**: Prevents scheduling conflicts. Builds on P1 convention linking with schedule awareness.

**Independent Test**: User can add convention events, system warns about shoot/event time conflicts.

**Acceptance Scenarios**:

1. **Given** convention is July 5-7, **When** I add event "Cosplay Contest - July 6, 2pm-4pm", **Then** event appears in convention schedule
2. **Given** I plan shoot at 3pm July 6, **When** I have contest at 2pm-4pm, **Then** system warns "Conflicts with Cosplay Contest"
3. **Given** convention publishes schedule, **When** I import via URL or file, **Then** all events populate automatically
4. **Given** I'm viewing convention day, **When** I see timeline, **Then** shoots and events display together showing full day schedule

---

### User Story 3 - Photoshoot Meetup Discovery (Priority: P3)

As a cosplayer looking for groups, I want to discover and join public photoshoot meetups at conventions (e.g., "Genshin Impact group shoot, Sat 10am, East Garden") so that I can participate in community shoots.

**Why this priority**: Community feature that adds social value. Builds on P1-P2 with public shoot visibility.

**Independent Test**: User can mark shoot as "Public Meetup", others can discover and RSVP, organizer sees attendee list.

**Acceptance Scenarios**:

1. **Given** I'm organizing group shoot, **When** I toggle "Public Meetup" and add details, **Then** shoot appears in convention's public meetup list
2. **Given** I'm attending convention, **When** I browse meetups and filter "Genshin Impact", **Then** I see all public Genshin shoots with time/location
3. **Given** I find interesting meetup, **When** I click "RSVP", **Then** I'm added to attendee list and organizer notified
4. **Given** I organized meetup, **When** viewing shoot, **Then** I see "12 attendees" with names/characters/roles

---

### User Story 4 - Venue Maps & Navigation (Priority: P4)

As a convention photographer, I want to see venue map with marked photo locations and navigate between meetup spots so that I don't waste time finding shooting locations in large convention centers.

**Why this priority**: Convenience feature for large venues. Nice-to-have but shoots work without maps.

**Independent Test**: User can view convention venue map, pin shoot locations, get directions between pins.

**Acceptance Scenarios**:

1. **Given** convention has uploaded venue map, **When** I view convention, **Then** map displays with labeled halls/gardens/photo spots
2. **Given** I'm planning shoot at "East Garden", **When** I select location, **Then** map shows pin with location name
3. **Given** I have 3 shoots at different spots, **When** I view day schedule, **Then** map shows all 3 pins with numbered route
4. **Given** I'm at convention, **When** I need directions to next shoot, **Then** map highlights walking path from current location

---

### Edge Cases

- What happens when convention dates change? (Update all linked shoots, notify users of date changes)
- How to handle multi-day conventions with shoots on different days? (Group by date, show daily sub-schedules)
- What if user RSVPs to meetup then can't attend? (Allow canceling RSVP, notify organizer)
- Should there be convention database vs user-created? (Both: verified convention list + custom events)
- How to handle private shoots at conventions? (Default private, opt-in to public meetup listing)
- What about badge/ticket verification? (Link to external ticketing, don't replicate badge systems)
- Should meetups have capacity limits? (Optional max attendees, waitlist when full)
- How to prevent spam/inappropriate meetups? (Report system, organizer reputation, moderation)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating convention entries with name, dates, location/venue, website URL
- **FR-002**: System MUST support linking shoots to conventions with optional visibility (private/public meetup)
- **FR-003**: System MUST display convention dashboard showing all linked shoots grouped by date
- **FR-004**: System MUST provide "Convention shoots" filter in main shoots list
- **FR-005**: System MUST allow adding convention schedule events (name, date/time, location, type: panel/contest/meetup/other)
- **FR-006**: System MUST detect and warn about time conflicts between shoots and convention events
- **FR-007**: System MUST support importing convention schedule from URL or file (iCal, CSV)
- **FR-008**: System MUST display unified timeline showing shoots and convention events together
- **FR-009**: System MUST allow marking shoot as "Public Meetup" visible in convention's public meetup list
- **FR-010**: System MUST provide meetup discovery interface with search/filter by series, character, time
- **FR-011**: System MUST support RSVP to public meetups with attendee list visible to organizer
- **FR-012**: System MUST notify meetup organizer when someone RSVPs
- **FR-013**: System MUST allow canceling RSVP with organizer notification
- **FR-014**: System MUST support optional max attendee capacity with waitlist
- **FR-015**: System MUST display attendee list with character/role info for meetup planning
- **FR-016**: System MUST support uploading or linking to convention venue maps (image or interactive)
- **FR-017**: System MUST allow pinning shoot locations on venue map
- **FR-018**: System MUST display route between multiple pinned locations on map
- **FR-019**: System MUST provide verified convention database (major cons) plus custom convention creation
- **FR-020**: System MUST support reporting inappropriate public meetups with moderation queue
- **FR-021**: System MUST notify users when linked convention dates change

### Key Entities

- **Convention**: Event hosting shoots. Attributes: name, start date, end date, location, venue name, website URL, venue map image/URL, is verified (official vs user-created), created by user ID
- **ConventionEvent**: Scheduled event at convention. Attributes: convention ID, event name, event date/time, location within venue, event type (panel/contest/meetup/other), duration
- **ShootConventionLink**: Links shoot to convention. Attributes: shoot ID, convention ID, is public meetup, RSVP count, max capacity (optional)
- **MeetupRSVP**: RSVP to public meetup. Attributes: shoot ID, user ID, character name, role (photographer/cosplayer/assistant), RSVP timestamp, status (attending/waitlist/canceled)
- **VenueMapPin**: Location marker on map. Attributes: convention ID, shoot ID (optional), pin name, coordinates (x, y or lat/long), description
- **MeetupReport**: Report inappropriate meetup. Attributes: shoot ID, reporter user ID, reason, report timestamp, resolution status

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can link shoot to convention in under 30 seconds
- **SC-002**: Convention dashboard loads all linked shoots in under 2 seconds
- **SC-003**: Schedule conflict detection triggers within 1 second of date/time change
- **SC-004**: iCal/CSV schedule import processes 50+ events in under 5 seconds
- **SC-005**: Public meetup listing loads with filters in under 1 second on 3G
- **SC-006**: RSVP notification delivers to organizer within 30 seconds
- **SC-007**: Venue map with 10 pins renders in under 2 seconds
- **SC-008**: 60% of convention-goers use convention linking feature (indicates value)
- **SC-009**: Public meetups average 5+ RSVPs (indicates community engagement)
- **SC-010**: Reported meetups resolved within 24 hours (moderation responsiveness)

