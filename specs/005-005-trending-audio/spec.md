# Feature Specification: Trending Audio Integration for Reel Planning

**Feature Branch**: `005-005-trending-audio`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: Browse/save trending audio from Instagram/TikTok, attach to shoots, mark audio beats, calculate shot timing

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse & Save Trending Audio (Priority: P1)

As a content creator, I want to browse currently trending audio clips from Instagram Reels and TikTok so that I can plan shoots around popular sounds that will increase engagement.

**Why this priority**: Core discovery functionality that delivers immediate value - users can find trending audio and save it to their library without any additional features.

**Independent Test**: User can view a feed of trending audio with playback, see metadata (title, artist, trending rank, usage count), and save favorites to their library.

**Acceptance Scenarios**:

1. **Given** I'm on the Audio Library page, **When** I select "Trending" tab, **Then** I see top 50 trending audio clips from Instagram/TikTok with play buttons and metadata
2. **Given** I'm browsing trending audio, **When** I click play on audio clip, **Then** 15-30 second preview plays with waveform visualization
3. **Given** I'm listening to trending audio, **When** I click "Save to Library", **Then** audio saves to my collection and shows "Saved ✓" indicator
4. **Given** I'm viewing a trending audio, **When** I see usage stats showing "1.2M uses" and trending rank "#5 this week", **Then** I can assess popularity for planning
5. **Given** trending data is 24+ hours old, **When** I pull to refresh, **Then** system fetches latest trending rankings

---

### User Story 2 - Attach Audio to Shoots (Priority: P2)

As a shoot planner, I want to attach a specific audio clip to a shoot so that the team knows which sound we're choreographing content for.

**Why this priority**: Connects audio discovery to actual shoot planning workflow. Requires P1 library but enables team coordination.

**Independent Test**: User can attach saved audio to a shoot, all team members see the audio and can play it from shoot details.

**Acceptance Scenarios**:

1. **Given** I'm editing a shoot, **When** I click "Add Audio" and select from my saved library, **Then** audio attaches to shoot and displays in shoot header
2. **Given** a shoot has attached audio, **When** any team member views the shoot, **Then** they see audio player with title/artist and can play it
3. **Given** I'm planning multiple shoots, **When** I attach the same trending audio to 3 different shoots, **Then** each shoot references the audio independently
4. **Given** audio is attached to shoot, **When** I create shot list (feature 004), **Then** shots can reference the same audio for timing calculations

---

### User Story 3 - Mark Audio Beats & Timing (Priority: P3)

As a choreographer/editor, I want to mark important beats and transitions in the audio so that I can plan shot transitions and choreography to sync with the music.

**Why this priority**: Adds precision timing tools for professional content creation. Builds on P2 audio attachment with detailed timing markers.

**Independent Test**: User can play audio, tap to mark beats, see waveform with beat markers, and get timestamp references for each beat.

**Acceptance Scenarios**:

1. **Given** I'm viewing attached audio for a shoot, **When** I enter "Mark Beats" mode and tap along with the music, **Then** beat markers appear on waveform at each tap timestamp
2. **Given** I've marked 8 beats, **When** I label beat #3 as "Drop" and beat #6 as "Chorus start", **Then** markers show labels and timestamps (e.g., "Drop - 0:12.5")
3. **Given** audio has marked beats, **When** I export beat sheet, **Then** I get timestamped list suitable for shot planning
4. **Given** I marked beats imperfectly, **When** I drag marker left/right on waveform, **Then** timestamp adjusts with precise control (+/- 0.1s)
5. **Given** I'm on mobile during shoot, **When** I view beat markers, **Then** visual metronome highlights current beat as audio plays

---

### Edge Cases

- What happens when Instagram/TikTok API changes or rate limits are hit? (Cached trending data, graceful degradation with last known results, user notification)
- How to handle audio that becomes unavailable/removed from platform? (Keep saved reference with "Audio unavailable" status, retain beat markers and metadata)
- What if user saves 500+ audio clips to library? (Search/filter by date saved, trending rank, or custom tags; pagination)
- How does beat marking work for audio with irregular tempo or ambient sounds? (Manual tap marking works for any rhythm; optional auto-detect for clear beats with user verification)
- What happens if two users mark beats differently for the same audio? (Per-shoot beat markers, not global; each shoot has independent beat configuration)
- Should audio files be stored locally or streamed? (Stream from platform APIs when available, cache preview for offline viewing with user-configurable limits, respect platform terms of service)
- How to handle copyright concerns? (Clear indication audio is for reference only, links to official platform sources, respect platform API usage terms)
- What if beat markers are created on one device and viewed on another? (Sync beat markers with shoot data across all devices)
- How to handle very long audio clips (5+ minutes)? (Support full length but optimize waveform rendering and playback controls)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST integrate with Instagram and TikTok APIs to fetch trending audio data (title, artist, preview URL, usage count, trending rank)
- **FR-002**: System MUST refresh trending audio feed at minimum every 24 hours with pull-to-refresh capability
- **FR-003**: System MUST display top 50 trending audio clips with play/pause controls and 15-30 second preview playback
- **FR-004**: System MUST show audio metadata: title, artist, usage count (e.g., "1.2M uses"), trending rank, and duration
- **FR-005**: System MUST provide waveform visualization during audio playback
- **FR-006**: System MUST allow users to save audio clips to personal library with "Save" button and visual confirmation
- **FR-007**: System MUST persist saved audio library per user account and sync across all user devices
- **FR-008**: System MUST handle API rate limits gracefully by caching trending data and displaying last successful fetch timestamp
- **FR-009**: System MUST handle unavailable/removed audio by retaining metadata with "Audio no longer available" status
- **FR-010**: System MUST allow attaching one audio clip to a shoot from user's saved library
- **FR-011**: System MUST display attached audio in shoot details with inline player accessible to all team members
- **FR-012**: System MUST allow removing/replacing attached audio from shoot
- **FR-013**: System MUST support same audio clip being attached to multiple shoots independently
- **FR-014**: System MUST provide "Mark Beats" mode with tap-to-mark beat timing on waveform
- **FR-015**: System MUST display beat markers on waveform with timestamps (to 0.1s precision)
- **FR-016**: System MUST allow adding text labels to beat markers (e.g., "Drop", "Chorus start", "Transition")
- **FR-017**: System MUST support drag-to-adjust beat marker positions on waveform
- **FR-018**: System MUST provide visual metronome during playback highlighting current beat marker
- **FR-019**: System MUST store beat markers per-shoot (not globally) so different shoots can have different beat configurations for same audio
- **FR-020**: System MUST provide search/filter in audio library by date saved, title/artist, or trending rank
- **FR-021**: System MUST respect platform API terms of service and clearly indicate audio is for reference/planning only
- **FR-022**: System MUST cache audio previews for offline playback with user-configurable cache settings (number of audios, storage size, expiration days)

### Key Entities

- **TrendingAudio**: Represents audio clip from Instagram/TikTok. Attributes: platform (Instagram/TikTok), external audio ID, title, artist, preview URL, duration, usage count, trending rank, last fetched timestamp, availability status
- **SavedAudio**: User's saved audio library entry. Attributes: user ID, trending audio reference, date saved, custom tags/notes
- **ShootAudio**: Link between shoot and audio. Attributes: shoot ID, saved audio ID, attached date
- **BeatMarker**: Timing marker on audio track. Attributes: shoot audio ID, timestamp (milliseconds), label (optional), sequence order
- **Shoot**: Parent entity (already exists). Extended with: attached audio reference (optional)
- **Shot**: From feature 004. Can reference same audio via parent shoot for timing calculations

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Trending audio feed loads within 2 seconds on 3G connection
- **SC-002**: Audio preview plays within 1 second of clicking play button
- **SC-003**: Users can save audio to library with single click and immediate visual feedback (< 500ms)
- **SC-004**: Beat marking interface allows tap-to-mark with < 50ms latency for rhythm accuracy
- **SC-005**: System successfully handles Instagram/TikTok API rate limits with < 5 minute cache refresh
- **SC-006**: 95% of saved audio remains playable after 30 days (accounting for platform removals)
- **SC-007**: Mobile waveform and beat marker interface operates smoothly at 60fps
- **SC-008**: 80% of users who attach audio also create beat markers (indicates feature adoption)
- **SC-009**: Shoots with attached audio and beat markers have 30% higher completion rate (indicates planning effectiveness)
- **SC-010**: Audio library syncs across devices within 5 seconds of save action

