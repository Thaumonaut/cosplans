# Phase 1 MVP Implementation: Week 5-6 Checklist

**Timeline**: Week 5-6 (10 working days)  
**Focus**: Real-Time Sync Architecture (Yjs CRDT + Supabase Realtime)  
**Deliverable**: GitHub PR with offline sync + real-time collaboration working  
**Dependency**: Week 1-4 (database + API + auth + images) must be merged first

---

## 🎯 Acceptance Criteria

### Yjs CRDT Setup

- [ ] **Yjs Document Structure**
  - Root Y.Map for shared state
  - Nested Y.Map for each resource type (shoots, costumes, props, crew)
  - Y.Array for collections (shoot photos, costume variants)
  - Y.Text for rich-text fields (descriptions, notes)
  - Example: `ydoc.getMap("shoots").set("shoot-123", new Y.Map())`

- [ ] **State Encoding**
  - Yjs generates CRDT updates as binary Uint8Array
  - Updates stored in `sync_queue` table (incrementally)
  - Full document snapshot stored in `state_snapshots` table (every 50 updates)
  - Compression: gzip for storage efficiency

- [ ] **Provider Architecture**
  - `y-websocket` provider connects to Supabase Realtime
  - SvelteKit server acts as sync hub (not direct Y.js)
  - Clients don't peer-to-peer; all sync through server
  - Provider auto-reconnects on network loss

### Offline Queue (Client-Side)

- [ ] **Offline Detection**
  - Navigator API: `navigator.onLine`
  - Supabase connection status listener
  - When offline → display "Offline Mode" indicator in UI

- [ ] **Offline Write Queue**
  - Table: `local_changes` (in IndexedDB, not server)
  - Schema: `id, resource_type, resource_id, operation (create/update/delete), payload, timestamp, synced`
  - Writes go to local queue first (instant UI update)
  - Queue persisted in IndexedDB
  - Max 500 pending changes

- [ ] **Optimistic UI Updates**
  - User creates costume → immediately added to UI with `pending` badge
  - User edits shoot → immediately visible in UI
  - If sync fails → red error badge appears, can retry
  - No data loss; all changes queued locally

- [ ] **Change Tracking**
  - Each resource: `created_at, updated_at, updated_by` (user ID)
  - Vector clock added: `version_vector: { user_id: clock }`
  - Allows detecting concurrent edits

### Real-Time Sync from Supabase

- [ ] **Realtime Subscriptions**
  - Subscribe to changes on all tables: shoots, costumes, props, crew
  - Changes broadcast via Supabase Realtime (PostgreSQL LISTEN/NOTIFY)
  - Clients receive updates in real-time (<100ms on LAN)

- [ ] **Update Propagation**
  1. User A edits shoot name
  2. API call → database updated
  3. PostgreSQL trigger fires → emits change to Realtime
  4. Supabase broadcasts to all subscribed clients
  5. User B receives update → local Yjs doc updated
  6. User B sees change in real-time

- [ ] **Conflict Resolution (3-Way Merge)**
  - When two users edit same field concurrently:
    - **Remote**: server version (user A's edit)
    - **Local**: client version (user B's edit)
    - **Base**: original version before edits
  - Merge strategy:
    - If edits non-overlapping → both applied
    - If overlapping → remote wins (user A was first)
    - UI shows: "This field was updated by {User A}. [Accept] [Keep Mine]"

- [ ] **Sync Completion**
  - After offline changes synced → `synced=true` in local queue
  - UI badge changes from `pending` to `✓ synced`
  - Local queue entries deleted after 24 hours (archive to `sync_history`)

### Offline Queue Server Processing

- [ ] **Queue Processor** (SvelteKit endpoint)
  - Endpoint: `POST /api/sync/process-offline-queue`
  - Accepts: array of offline changes
  - For each change:
    - Check permissions (user can edit this resource)
    - Apply change to database
    - Return: `{ id, success, error?, resultingState }`
  - Rollback if validation fails

- [ ] **Conflict Detection During Sync**
  - Check: is resource locked by another user?
  - Check: has resource been modified by someone else since base version?
  - If conflict → return: `{ success: false, conflict: true, remoteVersion, localVersion, base }`
  - Client handles merge UI

- [ ] **Sync Status Tracking**
  - Table: `sync_status`
  - Columns: `user_id, last_sync_at, pending_changes_count, last_error, retry_count`
  - Updated after each sync attempt
  - Admin dashboard shows sync health

### Real-Time Collaboration UI

- [ ] **Presence Indicators**
  - Show which users are viewing same resource
  - Badge: "3 people editing this"
  - Color-coded cursors if supported (deferred to Phase 2)
  - Store presence in `presence` table (with heartbeat expiration)

- [ ] **Change Attribution**
  - In resource detail view, show change history
  - Example: "Name changed by Alice at 2:15 PM"
  - Endpoint: `GET /api/resources/{id}/history`
  - Returns: array of `{ timestamp, user, field, oldValue, newValue }`

- [ ] **Live Notifications**
  - When another user edits resource you're viewing → toast: "Alice updated this"
  - Subscription: Supabase Realtime on specific resource
  - Toast includes: user name, timestamp, action

- [ ] **Lock Mechanism** (Optimistic, not pessimistic)
  - When user starts editing → set `locked_by: user_id, locked_at: now`
  - After 5 minutes inactivity → unlock automatically
  - Other users see: "Locked by Alice (since 5 min ago)" [Force Unlock] [Go to next]
  - Not blocking; just advisory

### Testing (70% coverage minimum)

- [ ] **Unit Tests** (Vitest)
  - Yjs update encoding/decoding
  - CRDT conflict resolution (3-way merge logic)
  - Offline queue serialization
  - Vector clock comparison
  - **Target**: 15+ unit tests

- [ ] **Integration Tests**
  - Offline write → queue stored in IndexedDB
  - Online sync → queue processed and cleared
  - Concurrent edits → conflict detected, 3-way merge shown
  - Presence tracking → users added/removed from presence
  - Realtime broadcast → other clients receive update <100ms
  - **Target**: 15+ integration tests

- [ ] **E2E Tests** (Playwright)
  - Two browsers: User A and User B
  - A edits shoot name → B sees update in real-time
  - Both offline, both edit same field → reconnect → conflict dialog shown
  - User A resolves conflict → both see resolved state
  - **Target**: 6+ E2E tests

- [ ] **Coverage Report**
  - Minimum 70% overall
  - Generate: `npm run test:coverage`

### Documentation

- [ ] **CRDT Architecture** (`.specify/crdt-architecture.md`)
  - Yjs document structure diagram
  - State encoding explanation
  - Provider architecture (no peer-to-peer)

- [ ] **Offline Sync Flow** (`.specify/offline-sync.md`)
  - Offline detection
  - Local queue structure (IndexedDB)
  - Optimistic UI updates
  - Sync process on reconnect

- [ ] **Real-Time Sync Flow** (`.specify/realtime-sync.md`)
  - Supabase Realtime subscriptions
  - Conflict resolution (3-way merge UI)
  - Presence tracking

- [ ] **API Documentation Update**
  - `POST /api/sync/process-offline-queue` (offline sync)
  - `GET /api/resources/{id}/history` (change history)
  - WebSocket upgrade docs (for Realtime)

---

## 🔗 Constitution References

**Principle II (Real-Time Collaboration)**

- [ ] Offline queue ensures no data loss
- [ ] Real-time sync <100ms on LAN
- [ ] CRDT (Yjs) automatically resolves conflicts
- [ ] Presence indicators show who's editing

**Principle VI (TDD)**

- [ ] 70% test coverage includes conflict resolution scenarios
- [ ] Integration tests verify offline → online → conflict flow
- [ ] E2E tests with multiple users

**Principle VII (Security & Privacy)**

- [ ] Permissions checked before applying synced changes
- [ ] Users can only sync their own offline queue
- [ ] RLS policies enforced on Supabase tables

**Technology Stack (Constitution v2.2.0)**

- [ ] Yjs for CRDT conflict resolution
- [ ] y-protocols for wire protocol
- [ ] y-websocket for WebSocket transport
- [ ] Supabase Realtime for broadcast
- [ ] Vitest + Playwright for testing

---

## 📦 Deliverables

### Code

- [ ] `src/lib/services/yjs.ts` (Yjs document setup)
- [ ] `src/lib/providers/WebsocketProvider.ts` (Supabase Realtime connection)
- [ ] `src/lib/services/offlineQueue.ts` (IndexedDB queue management)
- [ ] `src/lib/services/conflictResolution.ts` (3-way merge logic)
- [ ] `src/routes/api/sync/process-offline-queue/+server.ts` (queue processor)
- [ ] `src/routes/api/resources/[id]/history/+server.ts` (change history)
- [ ] `src/components/ConflictResolver.svelte` (3-way merge UI)
- [ ] `src/components/PresenceIndicator.svelte` (users editing badge)
- [ ] Database migrations: `sync_queue`, `state_snapshots`, `sync_status`, `presence`, `change_history` tables

### Tests

- [ ] Unit tests: 15+
- [ ] Integration tests: 15+
- [ ] E2E tests: 6+ (with multiple browser instances)
- [ ] Coverage: 70%+

### Documentation

- [ ] CRDT architecture diagram
- [ ] Offline sync flow diagram
- [ ] Real-time sync flow diagram
- [ ] 3-way merge conflict resolution example
- [ ] Updated API spec with sync endpoints

---

## ⚠️ Known Blockers / Decisions Needed

| Blocker               | Impact                                 | Resolution                                                 |
| --------------------- | -------------------------------------- | ---------------------------------------------------------- |
| **Peer-to-Peer Sync** | Not implementing (too complex for MVP) | All sync through server (SvelteKit hub model)              |
| **Offline Limit**     | Max 500 pending changes                | If exceeded, force sync or show warning                    |
| **Conflict UI**       | 3-way merge UI complex                 | Build minimal version: show remote + local, user picks one |
| **Vector Clocks**     | Complex to implement perfectly         | Use wall-clock timestamps (simpler, 99% accurate)          |

---

## 📋 Daily Breakdown

**Days 1-2**: Yjs setup + document structure

- Initialize Yjs doc
- Create nested Y.Map/Y.Array structures
- Test state encoding/decoding

**Days 3-4**: Offline queue infrastructure

- IndexedDB setup
- Offline detection
- Queue storage + serialization
- Optimistic UI updates

**Days 5-6**: Real-time sync from Supabase

- Supabase Realtime subscriptions
- Broadcast to clients
- Update local Yjs doc

**Days 7-8**: Conflict resolution

- 3-way merge logic
- Conflict detection during offline sync
- Merge UI component

**Days 9-10**: Testing + documentation

- Unit + integration tests (CRDT, queue, merge)
- E2E tests with multiple browsers
- Diagram + flow documentation

---

## ✅ Sign-Off Criteria

**Week 5-6 COMPLETE when**:

1. ✅ Yjs CRDT setup working
2. ✅ Offline queue storing changes in IndexedDB
3. ✅ Optimistic UI updates working (pending badge)
4. ✅ Real-time sync from Supabase working (<100ms)
5. ✅ Conflict resolution (3-way merge) working
6. ✅ Presence indicators showing online users
7. ✅ 70%+ test coverage
8. ✅ PR approved and merged

---

**Timeline**: Week 5-6 of 12  
**Dependency**: Week 1-4 merged  
**Next**: Week 7 (Google Integrations)
