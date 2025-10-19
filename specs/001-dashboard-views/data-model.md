# Data Model: Dashboard & Specialized Views

## Core Entities

### DashboardWidget
Configurable widget component for dashboard customization

**Attributes:**
- `id`: UUID - Unique widget identifier
- `type`: Enum - Widget type (upcoming_shoots, ideas, alerts, budget, weather, progress)
- `user_id`: UUID - Widget owner reference
- `template`: String - Dashboard template name ('compact', 'detailed', 'timeline-focus')
- `position`: Integer - Display order within template
- `visible`: Boolean - Widget visibility toggle
- `settings`: JSONB - Widget-specific configuration
- `created_at`: Timestamp - Creation date
- `updated_at`: Timestamp - Last modification

**Relationships:**
- Belongs to User (user_id)
- No direct entity relationships (widgets aggregate data from other entities)

**Validation Rules:**
- Type must be valid enum value
- Position must be unique within user template
- Settings schema varies by widget type
- Template must exist in predefined templates

**State Transitions:**
- visible: true ↔ false (user toggles)
- position: reordered when user drags widgets
- settings: updated when user configures widget

---

### TimelineView
Timeline configuration and state management

**Attributes:**
- `id`: UUID - Unique timeline view identifier  
- `user_id`: UUID - Timeline view owner
- `team_id`: UUID - Team scope for timeline
- `zoom_level`: Enum - Display granularity (day, week, month, quarter, year)
- `date_range_start`: Date - Timeline start boundary
- `date_range_end`: Date - Timeline end boundary
- `visible_shoots`: UUID[] - Filtered shoot IDs
- `filter_settings`: JSONB - Applied filters (member, status, character, tags)
- `milestone_markers`: JSONB - Custom timeline markers
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Relationships:**
- Belongs to User (user_id)  
- Belongs to Team (team_id)
- References multiple Shoots (visible_shoots)

**Validation Rules:**
- Date range start must be before end
- Zoom level appropriate for date range span
- Visible shoots must belong to team
- Filter settings must match available filter types

**State Transitions:**
- zoom_level: adjusted based on date range or user selection
- visible_shoots: updated when filters change
- milestone_markers: added/removed by user actions

---

### ProgressTracker  
Aggregated progress data per shoot with real-time calculations

**Attributes:**
- `shoot_id`: UUID - Primary key, shoot reference
- `costume_progress`: Integer - Percentage (0-100)
- `props_progress`: Integer - Percentage (0-100)
- `location_progress`: Integer - Percentage (0-100)
- `team_progress`: Integer - Percentage (0-100)
- `checklist_progress`: Integer - Percentage (0-100)
- `editing_progress`: Integer - Percentage (0-100)
- `overall_progress`: Integer - Calculated average percentage
- `outstanding_tasks`: JSONB - Array of incomplete task references
- `calculation_timestamp`: Timestamp - Last update time
- `updated_at`: Timestamp

**Relationships:**
- Belongs to Shoot (shoot_id) - One-to-one
- Aggregates data from multiple related entities (costumes, props, checklists, etc.)

**Validation Rules:**
- All progress values must be 0-100
- Overall progress calculated from category averages
- Outstanding tasks must reference valid entities
- Calculation timestamp updated on any progress change

**State Transitions:**
- progress values: automatically updated when related entities change
- outstanding_tasks: recalculated when tasks completed/added
- overall_progress: derived from category progress changes

---

### CharacterProfile
Character information with costume history and series association

**Attributes:**
- `id`: UUID - Unique character identifier
- `name`: String - Character name
- `series`: String - Source series/franchise
- `cosplayer_id`: UUID - Team member who cosplays this character  
- `costume_inventory_status`: Enum - Current costume state
- `shoot_history`: UUID[] - Associated shoot IDs
- `photo_galleries`: JSONB - Gallery references and metadata
- `external_character_id`: String - MyAnimeList or custom character ID
- `character_source`: Enum - Data source (mal_api, user_custom, community)
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Relationships:**
- Belongs to User (cosplayer_id)
- Has many CostumeInventoryItems
- Has many Shoots (via shoot_history)
- Belongs to SeriesCompletion

**Validation Rules:**
- Name and series required
- Cosplayer must be team member
- Shoot history must reference valid shoots
- External character ID must be valid for source type

**State Transitions:**
- costume_inventory_status: updated when costume state changes
- shoot_history: appended when character used in new shoot
- photo_galleries: updated when new shoot photos added

---

### CostumeInventoryItem
Individual costume/prop lifecycle tracking with state management

**Attributes:**
- `id`: UUID - Unique inventory item identifier
- `character_id`: UUID - Associated character reference
- `item_type`: Enum - Item category (costume, prop, accessory, makeup)
- `name`: String - Item description
- `status`: Enum - Current lifecycle state (planned, acquiring, in_progress, ready, owned, sold, damaged, rented, lost, stored, loaned)
- `purchase_date`: Date - Acquisition date
- `purchase_price`: Decimal - Original cost
- `current_value`: Decimal - Current estimated value
- `sale_date`: Date - Sale date (if sold)
- `sale_price`: Decimal - Sale amount (if sold)
- `rental_period`: JSONB - Rental details (start, end, cost, renter)
- `storage_location`: String - Physical storage location
- `condition_notes`: Text - Current condition description
- `damage_details`: JSONB - Damage incident information
- `insurance_docs`: String[] - Insurance document references
- `state_history`: JSONB - Historical state changes with timestamps
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Relationships:**
- Belongs to CharacterProfile (character_id)
- Referenced by multiple Shoots (when costume used)

**Validation Rules:**
- Status transitions must follow allowed state machine
- Financial fields required for sold/rented states
- Damage details required for damaged state
- Storage location required for stored state
- State history must preserve all transitions

**State Transitions:**
State machine per Constitution Principle IV:
- planned → acquiring → in_progress → ready → owned
- owned → [sold, damaged, rented, stored, loaned]
- damaged → [repaired (→owned), disposed]
- rented → [returned (→owned), damaged]
- stored → [retrieved (→owned), damaged, lost]
- Custom intermediate states allowed

---

### SeriesCompletion
Series-level tracking of cosplay completion progress

**Attributes:**
- `id`: UUID - Unique series identifier
- `series_name`: String - Series/franchise name  
- `team_id`: UUID - Team scope
- `total_character_count`: Integer - Total characters in series
- `shot_character_list`: UUID[] - Completed character profile IDs
- `unshot_character_list`: JSONB - Remaining character data from external API
- `completion_percentage`: Integer - Calculated completion (0-100)
- `series_source`: Enum - Data source (mal_api, user_custom)
- `external_series_id`: String - MyAnimeList or custom series ID
- `series_metadata`: JSONB - Additional series information
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Relationships:**
- Belongs to Team (team_id)
- Has many CharacterProfiles (via shot_character_list)
- Aggregates from external character database

**Validation Rules:**
- Total character count must match external API data
- Shot character list must reference valid character profiles
- Completion percentage = (shot count / total count) * 100
- Series source must match external ID format

**State Transitions:**
- shot_character_list: grows when new characters cosplayed
- completion_percentage: recalculated when character list changes
- unshot_character_list: shrinks as characters completed

---

### TeamBudget
Consolidated team financial tracking across shoots

**Attributes:**
- `team_id`: UUID - Primary key, team reference
- `total_allocated`: Decimal - Sum of all shoot budgets
- `total_spent`: Decimal - Sum of all shoot expenses  
- `remaining_budget`: Decimal - Calculated remaining funds
- `percentage_used`: Integer - Calculated usage percentage
- `category_breakdown`: JSONB - Spending by category (costumes, props, etc.)
- `shoot_breakdown`: JSONB - Spending by shoot with budget status
- `monthly_trends`: JSONB - Historical monthly spending data
- `settlement_calculations`: JSONB - Per-member debt/credit tracking
- `last_updated`: Timestamp - Last aggregation update
- `created_at`: Timestamp

**Relationships:**
- Belongs to Team (team_id) - One-to-one
- Aggregates from multiple Shoots and Expenses
- References ExpenseSettlements for member balances

**Validation Rules:**
- Financial calculations must be accurate
- Category breakdown must sum to total spent
- Settlement calculations must balance (debts = credits)
- Monthly trends must preserve historical data

**State Transitions:**
- All financial fields: recalculated when shoot expenses change
- settlement_calculations: updated when payments marked as settled
- monthly_trends: appended monthly, never modified retroactively

## Supporting Entities

### TimelineEvent (Event Sourcing)
**Attributes:**
- `id`: UUID - Event identifier
- `shoot_id`: UUID - Affected shoot
- `event_type`: Enum - Action type (reschedule, dependency_add, dependency_remove, status_change)
- `event_data`: JSONB - Type-specific event payload
- `user_id`: UUID - User who triggered event
- `timestamp`: Timestamp - Event occurrence time
- `version`: Integer - Event sequence for shoot

### ExpenseSettlement  
**Attributes:**
- `id`: UUID - Settlement identifier
- `from_user_id`: UUID - Person who owes money
- `to_user_id`: UUID - Person owed money  
- `amount`: Decimal - Settlement amount
- `status`: Enum - Settlement state (pending, confirmed, disputed)
- `receipt_url`: String - Optional receipt upload
- `confirmation_details`: JSONB - Settlement confirmation metadata
- `confirmed_at`: Timestamp - Settlement completion time

## Data Consistency Rules

### Real-Time Synchronization
- ProgressTracker updates trigger SSE events to all team members
- Timeline events create audit log entries before state changes
- Budget aggregations recalculated on expense changes
- Character inventory status changes propagate to affected shoots

### Conflict Resolution (via Yjs)
- Multiple users editing same shoot: CRDT handles automatic merging
- Timeline reschedule conflicts: event sourcing provides rollback capability
- Budget settlement disputes: manual resolution with admin override
- Widget customization conflicts: per-user, no conflicts possible

### Data Integrity Constraints
- Shoot progress percentages must derive from actual completion data
- Timeline dependencies must not create cycles
- Budget calculations must be mathematically consistent
- Character series completion must sync with external API changes

### Performance Considerations
- ProgressTracker recalculations debounced to prevent excessive updates
- Timeline events batch-processed for bulk operations
- Budget aggregations cached with TTL, invalidated on relevant changes
- Character API data cached locally, refreshed weekly