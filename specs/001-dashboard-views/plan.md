# Implementation Plan: Dashboard & Specialized Views

**Branch**: `001-dashboard-views` | **Date**: 2025-10-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dashboard-views/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implements comprehensive dashboard and specialized views system providing real-time team collaboration interfaces. Primary requirements include main dashboard with configurable widgets, timeline/Gantt view with dependency management, progress tracking dashboard, character/series portfolio management, team budget overview, and costume inventory lifecycle tracking. Technical approach uses SvelteKit with Server-Sent Events for real-time updates, event sourcing for timeline data persistence, and hybrid external API + community database for character data.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript/JavaScript with SvelteKit  
**Primary Dependencies**: SvelteKit, Tailwind CSS, Shadcn/svelte, Yjs, @casl/ability, Supabase  
**Storage**: PostgreSQL via Supabase, image storage via Supabase Storage  
**Testing**: Vitest, @playwright/test, @testing-library/svelte, MSW  
**Target Platform**: Web-responsive (Phase 1), Flutter Android/iOS (Phase 2-3)  
**Project Type**: Web application with mobile-responsive design  
**Performance Goals**: <3s initial load on 3G, <2s real-time update propagation, <500ms UI interactions  
**Constraints**: Mobile-responsive 320px-4K, WCAG 2.1 AA compliance, offline-capable with sync-on-reconnect  
**Scale/Scope**: 50+ shoots timeline, 20+ team members, complex dependency chains, real-time collaboration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Principle I (Web-First Mobile-Responsive)**: Dashboard views designed mobile-first with SvelteKit, responsive 320px-4K, touch-friendly interfaces, progressive widget rendering  
✅ **Principle II (Real-Time Collaboration)**: Server-Sent Events with polling fallback, <2s update propagation, offline sync with conflict resolution via Yjs CRDT  
✅ **Principle III (External Integration Integrity)**: Google Calendar sync for timeline, external character APIs with community contributions, data consistency maintained  
✅ **Principle IV (Customizable Workflow States)**: Costume inventory lifecycle tracking, predefined dashboard templates with widget customization  
✅ **Principle V (Visual-First Content)**: Progress rings, timeline visualization, character galleries, inline viewing capabilities  
✅ **Principle VI (Test-Driven Development)**: Unit tests via Vitest, E2E tests via Playwright, component tests via Testing Library  
✅ **Principle VII (Team Roles & Permissions)**: @casl/ability for permission enforcement, crew management integration, role-based data access  
⚠️ **Principle VIII (Creator Community)**: Dashboard integrates with crew search but marketplace features are Phase 1.5+  
✅ **Analytics Compliance**: Event tracking for workflow optimization, no PII collection, optional analytics opt-out  
✅ **Tech Stack Compliance**: Uses recommended SvelteKit + Tailwind + Shadcn/svelte + Yjs + @casl/ability stack

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
src/
├── lib/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardWidget.svelte
│   │   │   ├── UpcomingShootsWidget.svelte
│   │   │   ├── ProgressRingWidget.svelte
│   │   │   └── AlertsPanel.svelte
│   │   ├── timeline/
│   │   │   ├── TimelineView.svelte
│   │   │   ├── ShootBar.svelte
│   │   │   └── DependencyArrow.svelte
│   │   ├── progress/
│   │   │   ├── ProgressTracker.svelte
│   │   │   └── CategoryRing.svelte
│   │   ├── portfolio/
│   │   │   ├── CharacterView.svelte
│   │   │   ├── SeriesView.svelte
│   │   │   └── CostumeInventory.svelte
│   │   └── budget/
│   │       ├── TeamBudgetOverview.svelte
│   │       ├── SpendingBreakdown.svelte
│   │       └── SettlementTracker.svelte
│   ├── stores/
│   │   ├── dashboard.js
│   │   ├── timeline.js
│   │   ├── realtime.js
│   │   └── permissions.js
│   ├── services/
│   │   ├── dashboard-api.js
│   │   ├── timeline-events.js
│   │   ├── character-db.js
│   │   └── sse-client.js
│   └── utils/
│       ├── date-helpers.js
│       ├── progress-calc.js
│       └── budget-math.js
├── routes/
│   ├── dashboard/
│   │   └── +page.svelte
│   ├── timeline/
│   │   └── +page.svelte
│   ├── progress/
│   │   └── [shootId]/+page.svelte
│   ├── portfolio/
│   │   ├── characters/
│   │   └── series/
│   └── budget/
│       └── team/+page.svelte
└── app.d.ts

tests/
├── unit/
│   ├── components/
│   ├── services/
│   └── utils/
├── integration/
│   ├── dashboard-workflow.test.js
│   ├── timeline-sync.test.js
│   └── realtime-updates.test.js
└── e2e/
    ├── dashboard-customization.spec.js
    ├── timeline-reschedule.spec.js
    └── progress-tracking.spec.js
```

**Structure Decision**: SvelteKit web application structure with feature-based component organization. Dashboard components grouped by functionality (dashboard/, timeline/, progress/, portfolio/, budget/). Real-time sync and permissions handled via dedicated stores and services. Route structure mirrors feature organization for clear navigation patterns.

## Post-Design Constitution Check ✅

Re-evaluated after Phase 1 design completion:

✅ **All constitutional principles satisfied**  
✅ **Recommended tech stack fully adopted** (SvelteKit + Tailwind + Shadcn/svelte + Yjs + @casl/ability + Supabase)  
✅ **Mobile-responsive design patterns implemented**  
✅ **Real-time collaboration via SSE + Yjs CRDT**  
✅ **Test-driven development approach with comprehensive test coverage**  
✅ **External API integration with data consistency safeguards**  
✅ **Role-based permissions via @casl/ability**  
✅ **Performance requirements addressable with proposed architecture**  

**No constitutional violations detected** - implementation plan fully compliant.

## Complexity Tracking

*No violations requiring justification.*
