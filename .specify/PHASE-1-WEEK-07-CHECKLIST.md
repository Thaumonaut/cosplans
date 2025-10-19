# Phase 1 MVP Implementation: Week 7 Checklist

**Timeline**: Week 7 (5 working days)  
**Focus**: Google Integrations (Maps, Calendar, Docs)  
**Deliverable**: GitHub PR with Google OAuth integration + Calendar sync + Docs embedding  
**Dependency**: Week 1-6 must be merged first

---

## 🎯 Acceptance Criteria

### Google Maps Integration

- [ ] **Venue Search**
  - User clicks "Search for venue" in shoot creation
  - Text input: "Austin, TX" or "Zilker Park, Austin"
  - Autocomplete suggestions from Google Places API
  - User selects venue → latitude, longitude, address stored

- [ ] **Venue Display**
  - Shoot detail page shows embedded Google Map
  - Marker at venue location
  - Zoom level: 15 (street level)
  - Map responsive on mobile (full width)

- [ ] **Distance Calculation**
  - API endpoint: `GET /api/shoots/{id}/nearby-crew`
  - Calculates distance from venue to each crew member's home
  - Returns: crew sorted by distance, ETA (Google Maps Directions API)
  - Used for crew notifications: "You're 5 min away from this shoot"

- [ ] **Google Maps API Setup**
  - API key generated (Maps + Places + Directions)
  - `.env.local`: `VITE_GOOGLE_MAPS_API_KEY=<key>`
  - Key restricted to domain + Maps/Places/Directions APIs

### Google Calendar Integration

- [ ] **Bidirectional Calendar Sync**
  - User authorizes Cosplans to access their Google Calendar
  - Cosplans creates calendar event for each shoot
  - Event title: "Cosplay Shoot: {ShootName}"
  - Event time: `start_time` to `end_time` from Cosplans
  - Event description: Shoot details + link to Cosplans

- [ ] **Calendar Event Creation**
  - When shoot is created/updated → Google Calendar updated
  - Endpoint: `POST /api/integrations/google-calendar/sync`
  - Payload: `{ shoot_id, user_id }`
  - Returns: `{ google_event_id, ics_url }`

- [ ] **Two-Way Sync**
  - User modifies shoot time in Cosplans → Google Calendar updated
  - User modifies event in Google Calendar → Cosplans updated (via webhook, deferred to Phase 2)
  - For now (MVP): one-way (Cosplans → Google Calendar)

- [ ] **Calendar Event Deletion**
  - When shoot deleted in Cosplans → Google Calendar event deleted
  - Soft delete in Cosplans → soft delete in Google Calendar (archive)

### Google Docs Integration

- [ ] **Mood Board / Production Notes in Google Docs**
  - In shoot detail page, button: "Open Production Notes in Google Docs"
  - Creates shared Google Doc: "Cosplay Shoot - {ShootName}"
  - Document shared with all team members
  - Link stored in `shoots.google_doc_url`

- [ ] **Google Docs Embedding**
  - Embed Google Docs preview in Cosplans (iframe)
  - Users can collaborate on doc without leaving Cosplans
  - Edits in Google Docs reflected in embedded view (real-time)

- [ ] **Document Management**
  - User can delete associated Google Doc
  - Endpoint: `DELETE /api/integrations/google-docs/{shoot_id}`
  - Deletes document and clears `google_doc_url` from shoot

### Google OAuth Scopes

- [ ] **Required Scopes**
  - `calendar`: https://www.googleapis.com/auth/calendar
  - `drive`: https://www.googleapis.com/auth/drive.file (for Docs creation)
  - Scope consent shown to user during first integration setup

- [ ] **Incremental Authorization**
  - On first shoot creation, user asked to authorize Calendar
  - On first Docs creation, user asked to authorize Drive
  - Avoid requesting all permissions at once

### Error Handling

- [ ] **Google API Failures**
  - If Google Maps down → show cached map or address only
  - If Google Calendar API fails → queue sync for retry (every 5 min)
  - If Google Docs creation fails → show error, allow retry

- [ ] **Rate Limiting**
  - Google APIs rate-limited → implement backoff
  - Cache: venue searches cached for 24 hours
  - Cache: calendar availability checked only once per sync

### Testing (70% coverage minimum)

- [ ] **Unit Tests**
  - Venue search address parsing
  - Distance calculation (lat/long)
  - Calendar event payload generation
  - Google Docs URL creation
  - **Target**: 10+ unit tests

- [ ] **Integration Tests**
  - Venue search (mock Google Places API)
  - Calendar event created (mock Google Calendar API)
  - Calendar event deleted
  - Google Docs creation (mock Google Drive API)
  - **Target**: 10+ integration tests

- [ ] **E2E Tests** (Playwright)
  - Create shoot with venue (mock Google Maps)
  - Verify calendar event created (mock)
  - **Target**: 3+ E2E tests

- [ ] **Coverage**: 70%+ minimum

### Documentation

- [ ] **Google APIs Setup** (`.specify/google-apis-setup.md`)
  - How to create Google Cloud project
  - Which APIs to enable
  - OAuth scopes needed
  - Key restrictions

- [ ] **Integration Flows** (`.specify/google-integrations.md`)
  - Maps venue search flow
  - Calendar sync flow
  - Docs creation flow

- [ ] **API Documentation Update**
  - `GET /api/integrations/google-maps/search` (venue search)
  - `POST /api/integrations/google-calendar/sync` (calendar sync)
  - `POST /api/integrations/google-docs/create` (docs creation)

---

## 🔗 Constitution References

**Principle III (External Integrations)**

- [ ] Google Maps for venue discovery
- [ ] Google Calendar for team scheduling
- [ ] Google Docs for collaborative production notes

**Technology Stack (Constitution v2.2.0)**

- [ ] Google APIs (Maps, Calendar, Drive)
- [ ] OAuth 2.0 for authentication
- [ ] Vitest + Playwright for testing

---

## 📦 Deliverables

### Code

- [ ] `src/lib/services/googleMaps.ts` (venue search)
- [ ] `src/lib/services/googleCalendar.ts` (calendar sync)
- [ ] `src/lib/services/googleDocs.ts` (docs creation)
- [ ] `src/routes/api/integrations/google-maps/search/+server.ts`
- [ ] `src/routes/api/integrations/google-calendar/sync/+server.ts`
- [ ] `src/routes/api/integrations/google-docs/create/+server.ts`
- [ ] `src/components/VenueSearch.svelte` (autocomplete)
- [ ] `src/components/GoogleMap.svelte` (embedded map)
- [ ] `src/components/GoogleDocsEmbed.svelte` (embedded Docs)

### Tests

- [ ] Unit tests: 10+
- [ ] Integration tests: 10+
- [ ] E2E tests: 3+
- [ ] Coverage: 70%+

### Documentation

- [ ] Google APIs setup guide
- [ ] Integration flows
- [ ] Updated API spec

---

## ✅ Sign-Off Criteria

**Week 7 COMPLETE when**:

1. ✅ Venue search working (Google Maps Places)
2. ✅ Calendar events created/deleted
3. ✅ Google Docs creation + embedding
4. ✅ OAuth scopes properly requested
5. ✅ 70%+ test coverage
6. ✅ PR approved and merged

---

**Timeline**: Week 7 of 12  
**Dependency**: Week 1-6 merged  
**Next**: Week 8 (Permissions & Crew Management)
