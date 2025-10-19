# Feature Specification: Real-Time Sync & Offline Support

**Feature Branch**: `024-realtime-sync-offline`  
**Created**: October 16, 2025  
**Status**: Draft  
**Tier**: 0 - Foundation (Critical)  
**Priority**: P0 (Must build early)

## Overview

Real-time synchronization ensures that all team members see updates immediately when data changes (shoots, notes, assignments, etc.). Offline support allows users to work when disconnected and sync when reconnected. This is critical infrastructure for collaborative work and for photographers working on-site where connectivity may be unreliable.

---

## User Scenarios & Testing

### User Story 1 - Real-Time Data Sync (Priority: P1)

When one team member updates shoot details, all other team members see the update immediately.

**Why this priority**: Essential for collaboration. Team members need current information instantly.

**Independent Test**: Data updates propagate to all connected users in real-time independently.

**Acceptance Scenarios**:

1. **Given** two users are viewing same shoot, **When** User A updates shoot time, **Then** User B sees update within 1 second
2. **Given** User A adds a note, **When** note is saved, **Then** all team members see note appear instantly
3. **Given** User A uploads a photo, **When** upload completes, **Then** all team members see new photo in gallery
4. **Given** User A tags a photo, **When** tag saved, **Then** tag appears instantly for all team members
5. **Given** changes happen to unrelated shoot, **When** changes occur, **Then** other shoots not affected (correct data isolation)

---

### User Story 2 - Offline Work Capability (Priority: P2)

Photographer on shoot location with poor connectivity wants to keep working offline.

**Why this priority**: Important for field work but can be MVP without comprehensive offline.

**Independent Test**: Users can continue working offline and sync when connection returns.

**Acceptance Scenarios**:

1. **Given** user is offline, **When** user views cached shoot data, **Then** data available and usable
2. **Given** user is offline, **When** user adds note to shoot, **Then** note saved locally with "pending sync" indicator
3. **Given** user offline and makes 5 changes, **When** internet reconnects, **Then** all 5 changes sync to server
4. **Given** conflict during sync, **When** last-write-wins or merge detected, **Then** conflict handled gracefully
5. **Given** user works offline for 2 hours, **When** connection restored, **Then** sync completes without data loss

---

### User Story 3 - Conflict Resolution (Priority: P2)

If same data is edited offline and online, system resolves conflicts gracefully.

**Why this priority**: Important for reliability but not critical for MVP (conflicts rare if using Yjs/CRDT).

**Independent Test**: Conflicts detected and resolved independently.

**Acceptance Scenarios**:

1. **Given** User A edits note offline, User B edits same note online, **When** A reconnects, **Then** edits merged intelligently
2. **Given** both users edit different parts of same shoot, **When** sync occurs, **Then** both edits preserved
3. **Given** both users edit same field, **When** sync occurs, **Then** system shows merge dialog or uses last-write-wins
4. **Given** conflict resolution completes, **When** both users refresh, **Then** same merged state visible to both

---

### User Story 4 - Sync Status Visibility (Priority: P2)

User wants to know if their changes are synced or pending.

**Why this priority**: Improves UX and prevents data loss confusion.

**Independent Test**: Sync status is visible and accurate independently.

**Acceptance Scenarios**:

1. **Given** user creates note while online, **When** note created, **Then** checkmark shows indicating synced
2. **Given** user creates note while offline, **When** note created, **Then** clock icon shows indicating "pending sync"
3. **Given** offline changes made, **When** internet reconnects, **Then** pending items sync and change to checkmark
4. **Given** sync fails, **When** failure detected, **Then** error indicator shown and retry available
5. **Given** user hovers over sync icon, **When** hover occurs, **Then** tooltip explains sync status

---

### User Story 5 - Selective Sync of Team Data (Priority: P3)

App only syncs data user has permission to access.

**Why this priority**: Security important but MVP can assume single team context.

**Independent Test**: Users only receive data they're authorized to see.

**Acceptance Scenarios**:

1. **Given** user is member of Team A only, **When** Team B data updates, **Then** user doesn't receive Team B updates
2. **Given** user views shoot, **When** user loses shoot access, **Then** shoot disappears after refresh
3. **Given** user is added to new team, **When** new team syncs, **Then** all team data becomes available
4. **Given** user downloads large dataset, **When** sync occurs, **Then** only changed items re-synced (not full refresh)

---

### Edge Cases

- What if user has 10,000 pending changes while offline? (Batch and optimize, prevent memory issues)
- What if sync fails repeatedly? (Exponential backoff, notify user, don't hang UI)
- What if connection is on/off rapidly (2G)? (Detect and disable sync temporarily, show warning)
- What if user loses app data while offline? (Attempt to recover from local storage)
- What if server data changed while offline, then user makes conflicting edit? (CRDT or last-write-wins)
- What if push notification service is down? (Fallback to polling every 5-10 seconds)

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST propagate data changes to all connected users in real-time (< 1 second latency)
- **FR-002**: System MUST maintain local cache of user data for offline access
- **FR-003**: System MUST queue changes made offline and sync when connection restored
- **FR-004**: System MUST detect network connectivity changes and handle reconnection gracefully
- **FR-005**: System MUST use WebSocket or similar persistent connection for real-time updates
- **FR-006**: System MUST fall back to polling if WebSocket unavailable
- **FR-007**: System MUST implement conflict resolution strategy (CRDT or last-write-wins)
- **FR-008**: System MUST show sync status to user (synced, pending, error)
- **FR-009**: System MUST retry failed syncs with exponential backoff
- **FR-010**: System MUST not send data user not authorized to receive
- **FR-011**: System MUST compress sync payloads to minimize bandwidth
- **FR-012**: System MUST batch multiple changes into single sync message
- **FR-013**: System MUST handle partial sync failures gracefully
- **FR-014**: System MUST maintain data consistency across all clients
- **FR-015**: System MUST clear offline cache when user logs out
- **FR-016**: System MUST notify user if local data becomes stale (server updated while offline)
- **FR-017**: System MUST support selective sync (user only gets authorized data)
- **FR-018**: System MUST not block UI during sync operations
- **FR-019**: System MUST limit local cache size (prevent memory issues on mobile)
- **FR-020**: System MUST support sync for: shoots, notes, photos, comments, tags, assignments

### Sync Architecture

- **Real-Time Protocol**: [NEEDS CLARIFICATION: WebSocket, Server-Sent Events (SSE), or Yjs/y-websocket?]
- **Conflict Resolution**: [NEEDS CLARIFICATION: Last-write-wins, CRDT-based merge, or user-prompted?]
- **Local Storage**: [NEEDS CLARIFICATION: IndexedDB, SQLite, or simple JSON in localStorage?]
- **Sync Frequency when offline**: [NEEDS CLARIFICATION: Batch on reconnect, or continuous polling?]

### Recommended Implementation (Suggested)

Based on tech stack, recommend:
- **Real-Time**: Supabase Realtime (WebSocket) with fallback to polling
- **Conflict Resolution**: Yjs CRDT library (already in package.json v13.6.0)
- **Local Storage**: Supabase Storage + IndexedDB for offline access
- **Sync Library**: y-websocket for CRDT synchronization

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Real-time updates appear on other users' screens within 1 second
- **SC-002**: Offline changes sync to server within 5 seconds of reconnection
- **SC-003**: Sync completes for 1000 changes in under 10 seconds
- **SC-004**: Sync bandwidth optimized to < 10% of raw data size (through compression and batching)
- **SC-005**: Offline mode persists 1000+ changes without memory issues
- **SC-006**: 99.9% of syncs complete without data loss or conflicts
- **SC-007**: Conflict detection and resolution happens transparently (no user intervention needed 99% of time)
- **SC-008**: Sync status updates visible within 500ms of change
- **SC-009**: App UI remains responsive during sync (no blocking operations)
- **SC-010**: System handles 100+ concurrent users with < 2 second update latency

---

### Key Entities

- **SyncQueue**: Offline changes waiting to sync
  - Attributes: id, user_id, entity_type (shoot/note/photo/etc), entity_id, operation (create/update/delete), data (JSON), created_at, synced_at
  - Relationships: belongs_to User

- **SyncLog**: Audit trail of all syncs
  - Attributes: id, user_id, timestamp, changes_count, bytes_transferred, status (success/failed)
  - Relationships: belongs_to User

- **ConflictLog**: Record of detected conflicts
  - Attributes: id, entity_type, entity_id, user_a_id, user_b_id, conflict_data (JSON), resolution, resolved_at
  - Relationships: belongs_to User (both users)

- **CacheMetadata**: Local cache info
  - Attributes: user_id, entity_type, last_sync, version, data_hash
  - Relationships: belongs_to User

---

## Assumptions

- Users have periodic internet connectivity (not permanently offline)
- Sync conflicts are rare (most work on different objects)
- Users accept "eventual consistency" (not strict real-time for all cases)
- Local cache is disposable (can be cleared without data loss)
- Server is always source of truth (server state overrides on conflict)
- Bandwidth conservation is important (photos sync by reference, not full download)
- Mobile clients need offline support; web clients optional
- Average sync payload < 1MB

---

## Dependencies

- **Depends on**: Authentication (identify user), Permissions (control sync access), Database (store data)
- **Blocks**: Team collaboration, Dashboard real-time updates, Live notifications
- **Related to**: Photo storage (large files need special sync handling)
- **Tech Requirements**: WebSocket or long-polling capability, CRDT library (Yjs), local storage (IndexedDB)

---

## Out of Scope (For Future Phases)

- Peer-to-peer sync between mobile devices
- Mesh networking for offline multi-user collaboration
- Blockchain-based conflict resolution
- Complete offline app (no server required)
- Delta compression beyond standard compression
- Distributed sync (multiple servers)
- Video sync (only static data)
- Full data replication to clients
