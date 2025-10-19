# Research Findings: Dashboard & Specialized Views

## Server-Sent Events Implementation with SvelteKit

**Decision**: Implement SSE using SvelteKit's streaming responses with EventSource client-side
**Rationale**: Native browser support, simpler than WebSockets, excellent SvelteKit integration via streaming
**Alternatives considered**: WebSockets (too complex), polling only (higher latency), push notifications (limited scope)

### Implementation Pattern
```javascript
// src/routes/api/events/+server.js - SSE endpoint
export async function GET({ request, url }) {
    const stream = new ReadableStream({
        start(controller) {
            // Setup Supabase realtime subscription
            // Send events via controller.enqueue()
        }
    });
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache'
        }
    });
}

// Client-side EventSource with fallback
const eventSource = new EventSource('/api/events');
eventSource.onmessage = (event) => {
    // Update stores
};
```

## Event Sourcing for Timeline Data

**Decision**: Use Supabase with event-log table for timeline changes, not full CQRS
**Rationale**: Audit trail needed, simpler than full event store, integrates with existing Supabase setup
**Alternatives considered**: Full event store (overkill), direct updates (no rollback), optimistic locking (insufficient audit)

### Schema Design
```sql
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY,
    shoot_id UUID REFERENCES shoots(id),
    event_type VARCHAR(50), -- 'reschedule', 'dependency_add', etc.
    event_data JSONB,
    user_id UUID REFERENCES users(id),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shoot_timeline_state (
    shoot_id UUID PRIMARY KEY,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    dependencies JSONB,
    last_event_id UUID
);
```

## Yjs Integration for Conflict Resolution

**Decision**: Use Yjs Y.Doc per shoot for collaborative editing, sync via custom provider
**Rationale**: Battle-tested CRDT, handles complex conflicts automatically, integrates well with SvelteKit stores
**Alternatives considered**: Manual OT (complex to implement), last-write-wins (data loss risk), manual conflict resolution (poor UX)

### Integration Pattern
```javascript
import { Doc, Map } from 'yjs';
import { writable } from 'svelte/store';

export function createCollaborativeShoot(shootId) {
    const ydoc = new Doc();
    const ymap = ydoc.getMap('shoot');
    
    // Svelte store that syncs with Y.Map
    const shootStore = writable({});
    
    ymap.observe(() => {
        shootStore.set(ymap.toJSON());
    });
    
    return { ydoc, shootStore };
}
```

## Character Database Integration

**Decision**: Hybrid approach - MyAnimeList API + user-managed custom characters
**Rationale**: Comprehensive anime/manga data from MAL, user control for niche/original characters
**Alternatives considered**: AniList (smaller database), manual only (high maintenance), multiple APIs (complexity)

### API Integration
```javascript
// MyAnimeList API for series data
const searchSeries = async (query) => {
    const response = await fetch(`https://api.myanimelist.net/v2/anime?q=${query}`);
    return response.json();
};

// Supabase for user-managed characters
const addCustomCharacter = async (character) => {
    return supabase.from('custom_characters').insert(character);
};
```

## Dashboard Widget Customization Architecture

**Decision**: Template-based customization with widget show/hide per clarification
**Rationale**: Balances user control with design consistency, prevents layout chaos
**Alternatives considered**: Full drag-and-drop (complex), no customization (inflexible), unlimited templates (decision paralysis)

### Template Structure
```javascript
const dashboardTemplates = {
    'compact': {
        layout: '2-column',
        widgets: ['upcoming-shoots', 'alerts', 'progress-summary'],
        responsive: { mobile: '1-column' }
    },
    'detailed': {
        layout: '3-column',
        widgets: ['upcoming-shoots', 'ideas', 'alerts', 'progress', 'budget', 'weather'],
        responsive: { mobile: '1-column', tablet: '2-column' }
    },
    'timeline-focus': {
        layout: 'timeline-primary',
        widgets: ['timeline', 'upcoming-shoots', 'alerts'],
        responsive: { mobile: 'stacked' }
    }
};
```

## Budget Settlement Tracking

**Decision**: Manual confirmation with receipt upload via Supabase Storage
**Rationale**: Simple, flexible, maintains audit trail without payment processor complexity
**Alternatives considered**: Automated payments (premature), verbal confirmation only (no audit), blockchain (overkill)

### Settlement Schema
```sql
CREATE TABLE expense_settlements (
    id UUID PRIMARY KEY,
    from_user_id UUID REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    amount DECIMAL(10,2),
    status VARCHAR(20), -- 'pending', 'confirmed', 'disputed'
    receipt_url TEXT,
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Performance Optimization Strategies

**Decision**: Lazy loading + virtual scrolling for large datasets, progressive image loading
**Rationale**: Meets <3s load time requirements, scales to 50+ shoots, mobile-friendly
**Alternatives considered**: Pagination only (poor UX), load all data (performance issues), infinite scroll (timeline complexity)

### Implementation Approach
```javascript
// Virtual scrolling for timeline
import { VirtualList } from '@sveltejs/svelte-virtual-list';

// Progressive image loading
import { onMount } from 'svelte';
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Load full resolution
        }
    });
});
```

## Real-Time Update Architecture

**Decision**: Supabase Realtime + SSE with local state reconciliation
**Rationale**: Leverages Supabase capabilities, handles partial connectivity, maintains consistency
**Alternatives considered**: Custom WebSocket server (maintenance overhead), polling only (latency), optimistic updates only (sync complexity)

### Update Flow
1. User action → Optimistic local update
2. API call to Supabase
3. Supabase Realtime → SSE → Other clients
4. Conflict detection via Yjs
5. Reconciliation prompt if needed

## Testing Strategy

**Decision**: Test pyramid with MSW for API mocking, Playwright for E2E critical flows
**Rationale**: Reliable tests without external dependencies, covers real-time features, maintains speed
**Alternatives considered**: Real API tests (flaky), no E2E tests (insufficient coverage), Cypress (heavier than Playwright)

### Test Coverage
- Unit: Component logic, utilities, calculations
- Integration: Store updates, API interactions, real-time sync
- E2E: Dashboard customization, timeline reschedule, progress updates
