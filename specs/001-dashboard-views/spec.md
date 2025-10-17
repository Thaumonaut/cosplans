# Feature Specification: Dashboard & Specialized Views

**Feature Branch**: `018-dashboard-views`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: User description: "018-dashboard-views"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Main Dashboard Overview (Priority: P1)

Team members see a comprehensive dashboard on login showing upcoming shoots (next 30 days), shoot ideas awaiting planning, active tasks across all shoots, budget health, weather alerts, and checklist completion progress in one glanceable view.

**Why this priority**: Central hub that eliminates navigation friction and provides instant situational awareness.

**Independent Test**: Can be fully tested by viewing dashboard with multiple shoots in various states (ideas, planned, in-progress), verifying all widgets display correct real-time data.

**Acceptance Scenarios**:

1. **Given** user has 3 upcoming shoots and 5 shoot ideas, **When** user opens dashboard, **Then** "Upcoming Shoots" widget shows 3 shoots with dates/status and "Ideas to Plan" widget shows 5 shoot cards with character/series
2. **Given** team has shoots with combined 85% checklist completion, **When** dashboard loads, **Then** progress ring displays 85% with color-coded segments per shoot and "3 items need attention" alert
3. **Given** a shoot has budget overrun and weather alert, **When** user views dashboard, **Then** alerts panel highlights both issues with red badges and click-to-view-details links
4. **Given** user is on mobile, **When** dashboard loads on 3G, **Then** all widgets render in under 2 seconds with responsive card layout (1 column)

---

### User Story 2 - Timeline/Gantt View (Priority: P2)

Users can visualize all shoots and costume builds across time in timeline view, seeing overlapping schedules, build timelines vs shoot dates, dependencies between tasks, and critical path highlighting for shoots with tight deadlines.

**Why this priority**: Essential for big-picture scheduling and identifying conflicts, builds on P1's shoot awareness.

**Independent Test**: Can be fully tested by viewing timeline with multiple shoots spanning months, dragging to reschedule, and verifying dependency lines update correctly.

**Acceptance Scenarios**:

1. **Given** 5 shoots over 3 months with costume builds, **When** user opens timeline view, **Then** shoots display as horizontal bars with costume build phases shown below in different colors (planning/building/complete)
2. **Given** shoot A depends on costume from shoot B, **When** user views timeline, **Then** dependency arrow connects shoot B completion to shoot A start with critical path highlighted in red if timing is tight
3. **Given** user drags shoot bar to new date, **When** drop completes, **Then** dependent shoots auto-adjust dates, team is notified of reschedule, and calendar sync updates within 2 seconds
4. **Given** timeline spans 6 months with 20+ shoots, **When** user zooms to month view, **Then** timeline condenses to monthly overview with shoot count per day, expandable on click

---

### User Story 3 - Progress Tracker Dashboard (Priority: P1)

Each shoot displays unified progress dashboard showing completion percentages for costume builds, props acquisition, location confirmation, team assignments, checklists, and editing status with visual progress rings and outstanding task alerts.

**Why this priority**: Reduces navigation by consolidating multi-faceted shoot status into single view.

**Independent Test**: Can be fully tested by viewing progress for shoot with partial completion across categories, updating a task, and verifying progress ring updates in real-time.

**Acceptance Scenarios**:

1. **Given** shoot with costume 70% complete, props 100%, location confirmed, **When** user views progress tracker, **Then** circular progress rings show percentages with color coding (red < 50%, yellow 50-80%, green > 80%)
2. **Given** shoot checklist has 3 unchecked items, **When** team member checks item, **Then** progress ring updates within 2 seconds and "Outstanding Tasks" count decrements from 3 to 2
3. **Given** shoot across multiple categories, **When** user clicks progress ring, **Then** detail modal opens showing task breakdown per category with clickable links to specific sections (costume builder, checklist, etc.)

---

### User Story 4 - Character/Series Portfolio View (Priority: P2)

Users can browse all shoots grouped by character or series, seeing costume inventory status (owned/sold/rented), previously completed photoshoots with galleries, and series completion tracking to identify characters not yet cosplayed.

**Why this priority**: Portfolio organization and costume lifecycle management, useful for planning future shoots.

**Independent Test**: Can be fully tested by viewing character groupings, marking costume as sold, and verifying it shows as "needs acquisition" for future shoot planning.

**Acceptance Scenarios**:

1. **Given** user has cosplayed 3 different Spiderman variants, **When** user views "Spiderman" character page, **Then** all 3 shoots display with costume status badges (owned/sold), photo galleries, and dates
2. **Given** costume marked as "Sold" for previous shoot, **When** user plans new shoot with same character, **Then** character view shows "Costume Status: Sold - New costume required" alert with link to costume builder
3. **Given** user has shot 5/10 MHA characters, **When** user views "My Hero Academia" series page, **Then** completion ring shows 50% with grid of shot characters (color) and unshot characters (greyscale) with "Cosplay Ideas" button
4. **Given** multiple cosplayers in team, **When** user filters character view by cosplayer, **Then** only characters cosplayed by selected person display with their costume inventory status

---

### User Story 5 - Team Budget Overview (Priority: P3)

Teams with shared finances can view consolidated budget dashboard showing total allocated/spent across all shoots, spending breakdown by category and shoot, monthly burn rate trends, and per-member expense tracking with "You owe" settlement calculations.

**Why this priority**: Financial transparency for teams sharing costs, builds on individual shoot budgets (spec 006).

**Independent Test**: Can be fully tested by viewing team budget with multiple shoots and expenses, adding new expense to one shoot, and verifying team totals update in real-time.

**Acceptance Scenarios**:

1. **Given** team with 3 active shoots totaling $2000 budget and $1500 spent, **When** user views team budget overview, **Then** summary card shows $2000 allocated, $1500 spent (75%), $500 remaining with color-coded progress bar
2. **Given** expenses across shoots by category (Costumes $800, Props $400, Location $300), **When** user views spending breakdown, **Then** donut chart displays category distribution with percentages and click-to-filter by category
3. **Given** team member A owes $150 to B and $50 to C, **When** user views settlement tracker, **Then** "You owe" section shows $200 total with breakdown by person and "Mark as Paid" buttons
4. **Given** 6 months of expense data, **When** user views trend graph, **Then** monthly spending line chart displays with convention peaks highlighted and average burn rate annotation

---

### User Story 6 - Costume Inventory Lifecycle Dashboard (Priority: P1)

Users can view and manage the lifecycle of costumes and props directly from the dashboard, with explicit integration of constitutional Principle IV requirements for inventory tracking and state management.

**Why this priority**: Ensures compliance with inventory lifecycle standards and provides a centralized view for managing costume and prop states.

**Independent Test**: Can be fully tested by updating costume/prop states and verifying historical preservation, metadata accuracy, and compliance with Principle IV.

**Acceptance Scenarios**:

1. **Given** a costume is marked as "Planned", **When** user updates its state to "In-Progress", **Then** the dashboard logs the change with a timestamp, user attribution, and historical preservation.
2. **Given** a prop is marked as "Owned", **When** user updates its state to "Rented", **Then** the dashboard reflects the new state with required metadata (rental period, renter details) and updates inventory value tracking.
3. **Given** a costume is marked as "Stored", **When** user updates its state to "Damaged", **Then** the dashboard prompts for insurance documentation and logs the change with rationale.
4. **Given** multiple costumes in various states, **When** user views the lifecycle dashboard, **Then** all items display with their current state, historical changes, and compliance indicators for Principle IV.

---

### Edge Cases

- What happens when dashboard has 50+ upcoming shoots? System MUST paginate upcoming shoots widget (10 per page), show "View All Shoots" link, and prioritize shoots with alerts/upcoming deadlines at top
- How are shoot ideas prioritized on dashboard? System MUST sort by last updated date (most recent first), allow user to pin favorites to top, and show idea count badge with "Add New Idea" quick action button
- What if timeline view spans multiple years? System MUST provide zoom controls (day/week/month/quarter/year views), auto-calculate appropriate zoom level based on date range, and cache rendered timeline for smooth scrolling
- How are dependencies handled when parent shoot is deleted? System MUST detect broken dependencies, show warning before deletion, offer to remove dependency links or block deletion until links are manually removed
- What happens when costume status changes affect multiple shoots? System MUST identify all shoots using that costume, show "Costume Status Changed" notification with affected shoot list, and allow bulk status update or per-shoot decisions
- How is team budget view handled when member leaves team? System MUST archive member's expense history (preserve totals), show "Member Left Team" badge on their entries, and allow organizer to transfer unsettled balances to remaining members
- What if progress tracker shows 100% but shoot isn't marked complete? System MUST detect 100% completion across all categories, show "Ready to mark complete?" prompt, and allow one-click status change to "Complete" with confirmation
- How are real-time updates handled with 20+ team members? System MUST batch updates (queue changes for 500ms), show "Syncing..." indicator during updates, and prevent race conditions with optimistic UI updates + rollback on conflict

## Requirements *(mandatory)*

### Functional Requirements

#### Main Dashboard (FR-001 to FR-007)

- **FR-001**: System MUST display main dashboard on login showing configurable widgets: Upcoming Shoots (next 30 days), Shoot Ideas, Active Tasks, Weather Alerts, Budget Health, Checklist Progress
- **FR-002**: System MUST show "Upcoming Shoots" widget with shoot cards displaying date, title, character/series, status badge, and days until shoot with color coding (< 7 days = red, 7-14 = yellow, > 14 = green)
- **FR-003**: System MUST show "Ideas to Plan" widget with shoot idea cards displaying character, series, thumbnail (if uploaded), last updated date, and "Start Planning" quick action button
- **FR-004**: System MUST display alerts panel highlighting urgent items: weather warnings, budget overruns, incomplete checklists (< 48hrs before shoot), pending editing tasks, unsettled expenses
- **FR-005**: System MUST update all dashboard widgets in real-time (< 2 seconds) when team members make changes (add expense, complete checklist item, reschedule shoot)
- **FR-006**: System MUST allow users to customize dashboard layout by showing/hiding widgets, reordering via drag-and-drop, and saving preferences per user
- **FR-007**: System MUST load dashboard in under 2 seconds on 3G connection with progressive rendering (critical widgets first, secondary widgets lazy load)

#### Timeline/Gantt View (FR-008 to FR-014)

- **FR-008**: System MUST display timeline view showing all shoots as horizontal bars across time axis with configurable zoom levels (day/week/month/quarter)
- **FR-009**: System MUST show costume build phases within shoot bars using color-coded sub-bars (planning/building/complete) with start/end dates visible on hover
- **FR-010**: System MUST display dependency arrows between shoots showing which shoots depend on others (costume sharing, sequential planning) with critical path highlighting (red) if timing is tight (< 3 days buffer)
- **FR-011**: System MUST allow users to drag shoot bars to reschedule with automatic dependent shoot date adjustment, team notification, and Google Calendar sync within 2 seconds
- **FR-012**: System MUST support milestone markers on timeline (convention dates, costume deadlines, location bookings) with vertical lines and labels
- **FR-013**: System MUST collapse timeline to overview mode when date range > 6 months, showing shoot count per day with expandable drill-down on click
- **FR-014**: System MUST allow filtering timeline by team member, shoot status, character/series, and custom tags with real-time filter application (< 500ms)

#### Progress Tracker Dashboard (FR-015 to FR-019)

- **FR-015**: System MUST display unified progress dashboard per shoot showing circular progress rings for: Costume Builds, Props, Location, Team, Checklists, Editing
- **FR-016**: System MUST calculate progress percentages by aggregating completion status across sub-tasks (costume pieces, checklist items, assigned photos) with color coding (red < 50%, yellow 50-80%, green > 80%)
- **FR-017**: System MUST update progress rings in real-time (< 2 seconds) when team members complete tasks with smooth animation transition
- **FR-018**: System MUST show "Outstanding Tasks" alert below progress rings listing incomplete items with direct links to specific sections (e.g., "3 checklist items", "5 photos awaiting review")
- **FR-019**: System MUST allow clicking progress ring to open detail modal showing task breakdown per category with completion checkboxes and assignee avatars

#### Character/Series Portfolio View (FR-020 to FR-026)

- **FR-020**: System MUST provide character/series browse interface with tabs: "All Characters", "By Series", "By Cosplayer", and search bar with autocomplete
- **FR-021**: System MUST display character pages showing all shoots for that character with costume status badges (owned/sold/rented/damaged), photo galleries with thumbnails, and shoot dates
- **FR-022**: System MUST track costume inventory status per character with fields: status (owned/sold/rented/damaged/lost), purchase date, sale date, storage location, condition notes
- **FR-023**: System MUST show "Costume Status: Sold" alert when planning new shoot with previously sold costume, offering "Build New Costume" or "Rent Costume" quick action buttons
- **FR-024**: System MUST display series pages showing completion tracking with grid view: shot characters (color photos) vs unshot characters (greyscale placeholders from series database)
- **FR-025**: System MUST calculate series completion percentage by comparing shot characters to total character count from series database (e.g., "5/10 MHA characters = 50% complete")
- **FR-026**: System MUST allow filtering character view by cosplayer, series, costume status, and date range with saved filter presets

#### Team Budget Overview (FR-027 to FR-032)

- **FR-027**: System MUST display team budget overview dashboard aggregating all shoot budgets with total allocated, total spent, remaining budget, and percentage used with color-coded progress bar
- **FR-028**: System MUST show spending breakdown by category with donut chart displaying percentage distribution (Costumes, Props, Location, Equipment, Travel, Other) and click-to-filter functionality
- **FR-029**: System MUST display spending breakdown by shoot with bar chart showing per-shoot expenses sorted by amount (highest first) and budget status (under/over budget)
- **FR-030**: System MUST track per-member expense contributions with "You owe" / "Owed to you" settlement calculations showing who owes whom with amount breakdown and "Mark as Paid" buttons
- **FR-031**: System MUST generate monthly spending trend graph (line chart) showing burn rate over 6-12 months with convention dates highlighted and average monthly spend annotation
- **FR-032**: System MUST allow exporting team budget report as PDF including all charts, shoot breakdowns, settlement status, and expense line items with date range selector

### Key Entities

- **DashboardWidget**: Configurable widget with type (upcoming shoots/ideas/alerts/budget/weather), position, visibility, user preferences
- **TimelineView**: Timeline configuration with zoom level, date range, visible shoots, filter settings, milestone markers
- **ProgressTracker**: Aggregated progress data for shoot with category percentages, outstanding task list, calculation timestamp
- **CharacterProfile**: Character entry with name, series, cosplayer, costume inventory status, shoot history, photo galleries
- **CostumeInventoryItem**: Costume record with status (owned/sold/rented/damaged), dates, location, condition, associated character/shoots
- **SeriesCompletion**: Series tracking with total character count, shot character list, completion percentage, unshot character suggestions
- **TeamBudget**: Aggregated budget data with total allocated/spent, category breakdown, per-member contributions, settlement calculations

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dashboard loads all widgets in under 2 seconds on 3G connection with progressive rendering
- **SC-002**: Real-time updates propagate to dashboard within 2 seconds when team members make changes
- **SC-003**: Timeline view renders 50 shoots across 6 months in under 3 seconds with smooth 60fps scrolling
- **SC-004**: Drag-and-drop reschedule in timeline completes with auto-adjust and notifications in under 2 seconds
- **SC-005**: Progress tracker rings update with smooth animation (< 500ms transition) when tasks complete
- **SC-006**: Character/series view loads with photo galleries (20 shoots) in under 2 seconds using lazy loading
- **SC-007**: Costume status changes reflect across all affected shoots within 2 seconds with notification delivery
- **SC-008**: Team budget overview calculates aggregations for 10 shoots with 100+ expenses in under 1 second
- **SC-009**: 90% of users successfully customize dashboard widget layout on first attempt within 5 minutes
- **SC-010**: Mobile dashboard displays responsively on all screen sizes (320px-1920px) with single-column widget stacking

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]  
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]
