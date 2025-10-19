# Quickstart Guide: Dashboard & Specialized Views

## Overview

This feature implements the core dashboard and specialized views system for Cosplans, providing real-time collaboration interfaces for cosplay teams. The implementation uses SvelteKit with server-sent events for real-time updates, event sourcing for data consistency, and a mobile-responsive design.

## Prerequisites

- Bun 1.0+ (replaces Node.js for faster performance)
- SvelteKit project setup
- Supabase project configured
- Required dependencies installed (see Installation)

## Installation

Install the recommended technology stack packages using Bun:

```bash
# Install all dependencies at once with Bun
bun install

# Or install individual packages:
# Core framework and UI
bun add @sveltejs/kit tailwindcss @tailwindcss/typography
bun add shadcn-svelte lucide-svelte

# Form handling and validation  
bun add sveltekit-superforms zod

# Real-time sync and conflict resolution
bun add yjs y-protocols y-websocket

# Authorization and permissions
bun add @casl/ability

# Database and backend
bun add @supabase/supabase-js sharp date-fns

# Testing
bun add -d vitest @playwright/test @testing-library/svelte msw

# Development tools
bun add -d @typescript-eslint/eslint-plugin @typescript-eslint/parser
bun add -d prettier prettier-plugin-svelte
```

## Project Structure

Create the following directory structure in your SvelteKit project:

```bash
mkdir -p src/lib/components/{dashboard,timeline,progress,portfolio,budget}
mkdir -p src/lib/{stores,services,utils}
mkdir -p src/routes/{dashboard,timeline,progress,portfolio,budget}
mkdir -p tests/{unit,integration,e2e}
mkdir -p src/routes/api/{dashboard,timeline,progress,portfolio,budget,events}
```

## Database Schema Setup

Run the following SQL in your Supabase SQL editor to create the required tables:

```sql
-- Dashboard Widgets
CREATE TABLE dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('upcoming_shoots', 'ideas', 'alerts', 'budget', 'weather', 'progress')),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template VARCHAR(50) NOT NULL CHECK (template IN ('compact', 'detailed', 'timeline-focus')),
    position INTEGER NOT NULL,
    visible BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, template, position)
);

-- Timeline Views
CREATE TABLE timeline_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL, -- References teams table (assume exists)
    zoom_level VARCHAR(20) NOT NULL CHECK (zoom_level IN ('day', 'week', 'month', 'quarter', 'year')),
    date_range_start DATE,
    date_range_end DATE,
    visible_shoots UUID[],
    filter_settings JSONB DEFAULT '{}',
    milestone_markers JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline Events (Event Sourcing)
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shoot_id UUID NOT NULL, -- References shoots table
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('reschedule', 'dependency_add', 'dependency_remove', 'status_change')),
    event_data JSONB NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1
);

-- Progress Tracking
CREATE TABLE progress_trackers (
    shoot_id UUID PRIMARY KEY, -- References shoots table
    costume_progress INTEGER CHECK (costume_progress >= 0 AND costume_progress <= 100) DEFAULT 0,
    props_progress INTEGER CHECK (props_progress >= 0 AND props_progress <= 100) DEFAULT 0,
    location_progress INTEGER CHECK (location_progress >= 0 AND location_progress <= 100) DEFAULT 0,
    team_progress INTEGER CHECK (team_progress >= 0 AND team_progress <= 100) DEFAULT 0,
    checklist_progress INTEGER CHECK (checklist_progress >= 0 AND checklist_progress <= 100) DEFAULT 0,
    editing_progress INTEGER CHECK (editing_progress >= 0 AND editing_progress <= 100) DEFAULT 0,
    overall_progress INTEGER GENERATED ALWAYS AS (
        (costume_progress + props_progress + location_progress + team_progress + checklist_progress + editing_progress) / 6
    ) STORED,
    outstanding_tasks JSONB DEFAULT '[]',
    calculation_timestamp TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Character Profiles
CREATE TABLE character_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    series VARCHAR(255) NOT NULL,
    cosplayer_id UUID NOT NULL REFERENCES auth.users(id),
    costume_inventory_status VARCHAR(50) DEFAULT 'planned' CHECK (costume_inventory_status IN ('planned', 'acquiring', 'in_progress', 'ready', 'owned', 'sold', 'damaged', 'rented', 'lost', 'stored', 'loaned')),
    shoot_history UUID[],
    photo_galleries JSONB DEFAULT '[]',
    external_character_id VARCHAR(255),
    character_source VARCHAR(50) DEFAULT 'user_custom' CHECK (character_source IN ('mal_api', 'user_custom', 'community')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Costume Inventory Items
CREATE TABLE costume_inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES character_profiles(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('costume', 'prop', 'accessory', 'makeup')),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'acquiring', 'in_progress', 'ready', 'owned', 'sold', 'damaged', 'rented', 'lost', 'stored', 'loaned')),
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    current_value DECIMAL(10,2),
    sale_date DATE,
    sale_price DECIMAL(10,2),
    rental_period JSONB,
    storage_location TEXT,
    condition_notes TEXT,
    damage_details JSONB,
    insurance_docs TEXT[],
    state_history JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Series Completion
CREATE TABLE series_completion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_name VARCHAR(255) NOT NULL,
    team_id UUID NOT NULL,
    total_character_count INTEGER DEFAULT 0,
    shot_character_list UUID[],
    unshot_character_list JSONB DEFAULT '[]',
    completion_percentage INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN total_character_count = 0 THEN 0
            ELSE (array_length(shot_character_list, 1) * 100 / total_character_count)
        END
    ) STORED,
    series_source VARCHAR(50) DEFAULT 'user_custom' CHECK (series_source IN ('mal_api', 'user_custom')),
    external_series_id VARCHAR(255),
    series_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, series_name)
);

-- Team Budget Overview
CREATE TABLE team_budgets (
    team_id UUID PRIMARY KEY,
    total_allocated DECIMAL(12,2) DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    remaining_budget DECIMAL(12,2) GENERATED ALWAYS AS (total_allocated - total_spent) STORED,
    percentage_used INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN total_allocated = 0 THEN 0
            ELSE ROUND((total_spent / total_allocated * 100))
        END
    ) STORED,
    category_breakdown JSONB DEFAULT '{}',
    shoot_breakdown JSONB DEFAULT '[]',
    monthly_trends JSONB DEFAULT '[]',
    settlement_calculations JSONB DEFAULT '{}',
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expense Settlements
CREATE TABLE expense_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID NOT NULL REFERENCES auth.users(id),
    to_user_id UUID NOT NULL REFERENCES auth.users(id),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'disputed')),
    receipt_url TEXT,
    confirmation_details JSONB,
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_dashboard_widgets_user_template ON dashboard_widgets(user_id, template);
CREATE INDEX idx_timeline_views_team ON timeline_views(team_id);
CREATE INDEX idx_timeline_events_shoot ON timeline_events(shoot_id);
CREATE INDEX idx_character_profiles_cosplayer ON character_profiles(cosplayer_id);
CREATE INDEX idx_costume_inventory_character ON costume_inventory_items(character_id);
CREATE INDEX idx_series_completion_team ON series_completion(team_id);
CREATE INDEX idx_expense_settlements_users ON expense_settlements(from_user_id, to_user_id, status);

-- Enable RLS (Row Level Security)
ALTER TABLE dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_trackers ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE costume_inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_completion ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_settlements ENABLE ROW LEVEL SECURITY;
```

## Environment Configuration

Create or update your `.env.local` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# External API Keys
VITE_MYANIMELIST_CLIENT_ID=your_mal_client_id
MYANIMELIST_CLIENT_SECRET=your_mal_client_secret

# Feature Flags
VITE_ENABLE_SSE=true
VITE_ENABLE_CHARACTER_API=true
VITE_ENABLE_ANALYTICS=false
```

## Core Implementation Files

### 1. Supabase Client Setup

Create `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

export const supabase = createClient(
    env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_ANON_KEY
);
```

### 2. Real-Time Store Setup

Create `src/lib/stores/realtime.js`:

```javascript
import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase.js';

export const realtimeStore = writable({});

let eventSource = null;

export function connectSSE(teamId) {
    if (eventSource) {
        eventSource.close();
    }
    
    eventSource = new EventSource(`/api/events/stream?team_id=${teamId}`);
    
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        realtimeStore.update(store => ({
            ...store,
            [data.type]: data.payload
        }));
    };
    
    eventSource.onerror = () => {
        // Implement exponential backoff reconnection
        setTimeout(() => connectSSE(teamId), 5000);
    };
    
    return () => eventSource?.close();
}
```

### 3. Dashboard Widget Component

Create `src/lib/components/dashboard/DashboardWidget.svelte`:

```svelte
<script>
    import { createEventDispatcher } from 'svelte';
    import UpcomingShootsWidget from './UpcomingShootsWidget.svelte';
    import ProgressRingWidget from './ProgressRingWidget.svelte';
    import AlertsPanel from './AlertsPanel.svelte';
    
    export let widget;
    export let data = {};
    
    const dispatch = createEventDispatcher();
    
    function handleSettingsChange(settings) {
        dispatch('update', { ...widget, settings });
    }
    
    function handleToggleVisibility() {
        dispatch('update', { ...widget, visible: !widget.visible });
    }
    
    const components = {
        'upcoming_shoots': UpcomingShootsWidget,
        'progress': ProgressRingWidget,
        'alerts': AlertsPanel
    };
</script>

<div class="dashboard-widget" class:hidden={!widget.visible}>
    <div class="widget-header">
        <h3>{widget.type.replace('_', ' ').toUpperCase()}</h3>
        <button on:click={handleToggleVisibility}>
            {widget.visible ? 'Hide' : 'Show'}
        </button>
    </div>
    
    <div class="widget-content">
        <svelte:component 
            this={components[widget.type]} 
            {data} 
            settings={widget.settings}
            on:settings={e => handleSettingsChange(e.detail)}
        />
    </div>
</div>

<style>
    .dashboard-widget {
        @apply bg-white rounded-lg shadow-sm border p-4 mb-4;
    }
    
    .widget-header {
        @apply flex justify-between items-center mb-3 border-b pb-2;
    }
    
    .widget-content {
        @apply min-h-[200px];
    }
    
    .hidden {
        @apply opacity-50;
    }
</style>
```

### 4. Server-Sent Events API Route

Create `src/routes/api/events/stream/+server.js`:

```javascript
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

export async function GET({ url, locals }) {
    const teamId = url.searchParams.get('team_id');
    
    if (!teamId || !locals.user) {
        return new Response('Unauthorized', { status: 401 });
    }
    
    const stream = new ReadableStream({
        start(controller) {
            // Setup Supabase realtime subscriptions
            const channel = supabase
                .channel(`team-${teamId}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'progress_trackers'
                }, (payload) => {
                    controller.enqueue(`data: ${JSON.stringify({
                        type: 'progress_update',
                        payload
                    })}\n\n`);
                })
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'timeline_events'
                }, (payload) => {
                    controller.enqueue(`data: ${JSON.stringify({
                        type: 'timeline_event',
                        payload
                    })}\n\n`);
                })
                .subscribe();
            
            // Cleanup on connection close
            return () => {
                channel.unsubscribe();
            };
        }
    });
    
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
}
```

### 5. Dashboard Page

Create `src/routes/dashboard/+page.svelte`:

```svelte
<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import DashboardWidget from '$lib/components/dashboard/DashboardWidget.svelte';
    import { connectSSE } from '$lib/stores/realtime.js';
    
    export let data;
    
    let widgets = data.widgets || [];
    let template = data.template || 'detailed';
    let disconnectSSE;
    
    onMount(() => {
        if (data.teamId) {
            disconnectSSE = connectSSE(data.teamId);
        }
        
        return () => disconnectSSE?.();
    });
    
    async function updateWidget(updatedWidget) {
        const response = await fetch(`/api/dashboard/widgets/${updatedWidget.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedWidget)
        });
        
        if (response.ok) {
            widgets = widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w);
        }
    }
    
    async function changeTemplate(newTemplate) {
        const response = await fetch('/api/dashboard/template', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ template: newTemplate })
        });
        
        if (response.ok) {
            template = newTemplate;
            location.reload(); // Refresh to get new template layout
        }
    }
</script>

<svelte:head>
    <title>Dashboard - Cosplans</title>
</svelte:head>

<div class="dashboard-container">
    <header class="dashboard-header">
        <h1>Team Dashboard</h1>
        
        <div class="template-selector">
            <label for="template">Layout:</label>
            <select bind:value={template} on:change={e => changeTemplate(e.target.value)}>
                <option value="compact">Compact</option>
                <option value="detailed">Detailed</option>
                <option value="timeline-focus">Timeline Focus</option>
            </select>
        </div>
    </header>
    
    <main class="dashboard-grid" class:compact={template === 'compact'} class:timeline-focus={template === 'timeline-focus'}>
        {#each widgets.filter(w => w.visible || template === 'detailed') as widget (widget.id)}
            <DashboardWidget 
                {widget} 
                data={data.widgetData[widget.type]} 
                on:update={e => updateWidget(e.detail)}
            />
        {/each}
    </main>
</div>

<style>
    .dashboard-container {
        @apply container mx-auto px-4 py-6;
    }
    
    .dashboard-header {
        @apply flex justify-between items-center mb-6 border-b pb-4;
    }
    
    .dashboard-grid {
        @apply grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
    }
    
    .dashboard-grid.compact {
        @apply grid-cols-1 md:grid-cols-2;
    }
    
    .dashboard-grid.timeline-focus {
        @apply grid-cols-1;
    }
    
    .template-selector {
        @apply flex items-center gap-2;
    }
    
    select {
        @apply border rounded px-3 py-2;
    }
</style>
```

## Testing Setup

### Unit Test Example

Create `tests/unit/progress-calc.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { calculateOverallProgress } from '$lib/utils/progress-calc.js';

describe('Progress Calculations', () => {
    it('calculates overall progress correctly', () => {
        const categories = {
            costume_progress: 75,
            props_progress: 50,
            location_progress: 100,
            team_progress: 80,
            checklist_progress: 90,
            editing_progress: 0
        };
        
        const result = calculateOverallProgress(categories);
        expect(result).toBe(66); // Average of all categories rounded
    });
});
```

### Integration Test Example

Create `tests/integration/dashboard-sync.test.js`:

```javascript
import { describe, it, expect, beforeAll } from 'vitest';
import { createSupabaseClient } from '$lib/test-helpers.js';

describe('Dashboard Real-time Sync', () => {
    let supabase;
    
    beforeAll(() => {
        supabase = createSupabaseClient();
    });
    
    it('updates progress tracker when shoot progress changes', async () => {
        // Test real-time updates via Supabase
        const { data: shoot } = await supabase
            .from('shoots')
            .insert({ title: 'Test Shoot' })
            .select()
            .single();
        
        const { data: progress } = await supabase
            .from('progress_trackers')
            .insert({ 
                shoot_id: shoot.id, 
                costume_progress: 50 
            })
            .select()
            .single();
        
        expect(progress.overall_progress).toBeGreaterThan(0);
    });
});
```

### E2E Test Example  

Create `tests/e2e/dashboard-customization.spec.js`:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Dashboard Customization', () => {
    test('user can toggle widget visibility', async ({ page }) => {
        await page.goto('/dashboard');
        
        // Find upcoming shoots widget
        const widget = page.locator('[data-testid="upcoming-shoots-widget"]');
        await expect(widget).toBeVisible();
        
        // Click hide button
        await widget.locator('button:has-text("Hide")').click();
        
        // Widget should be hidden
        await expect(widget).toHaveClass(/hidden/);
        
        // Click show button to restore
        await widget.locator('button:has-text("Show")').click();
        await expect(widget).not.toHaveClass(/hidden/);
    });
    
    test('template switching changes layout', async ({ page }) => {
        await page.goto('/dashboard');
        
        // Switch to compact template
        await page.selectOption('select[name="template"]', 'compact');
        
        // Verify layout change
        const grid = page.locator('.dashboard-grid');
        await expect(grid).toHaveClass(/compact/);
    });
});
```

## Running the Application

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Run tests:**
   ```bash
   # Unit tests
   npm run test:unit
   
   # Integration tests  
   npm run test:integration
   
   # E2E tests
   npm run test:e2e
   ```

3. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

## Key Implementation Notes

### Real-Time Updates
- Server-Sent Events provide one-way real-time updates from server to clients
- Supabase Realtime subscriptions trigger SSE events
- Client-side stores automatically update UI when events received
- Fallback polling implemented for browsers without SSE support

### Conflict Resolution
- Yjs CRDT library handles concurrent edits automatically
- Event sourcing for timeline operations enables rollback
- Manual confirmation required for financial settlement disputes
- Optimistic UI updates with server reconciliation

### Performance Optimization
- Progressive image loading with low-resolution previews
- Virtual scrolling for large timeline datasets
- Debounced progress calculations to prevent excessive updates
- Client-side caching with stale-while-revalidate pattern

### Mobile Responsiveness
- Tailwind CSS responsive utilities throughout
- Touch-friendly interface elements (44px minimum targets)
- Progressive Web App capabilities via SvelteKit
- Offline support with sync-on-reconnect

### Security & Permissions
- Row Level Security (RLS) enabled on all tables
- @casl/ability for frontend permission checks
- JWT-based authentication via Supabase Auth
- Team-scoped data access controls

### Testing Strategy
- Unit tests for business logic and utilities
- Integration tests for API interactions and real-time sync
- E2E tests for critical user workflows
- MSW for reliable API mocking without external dependencies

## Next Steps

1. **Implement remaining view components** (Timeline, Progress, Portfolio, Budget)
2. **Add comprehensive error handling** and user feedback
3. **Integrate with external APIs** (MyAnimeList, Google Calendar)  
4. **Optimize performance** with code splitting and lazy loading
5. **Add analytics collection** following ethical guidelines
6. **Deploy to production** with monitoring and alerting

This quickstart provides the foundation for the dashboard and specialized views feature with real-time collaboration, mobile-responsive design, and comprehensive testing coverage.