# Feature Specification: Budget Tracking & Expenses

**Feature Branch**: `006-006-budget-tracking`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: Set budgets per shoot, track expenses by category, shared expense splitting, receipt uploads

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Set Shoot Budget (Priority: P1)

As a shoot organizer, I want to set an overall budget for a shoot so that the team knows spending limits and can track costs against the target.

**Why this priority**: Foundation for all budget tracking - defines the financial constraint everyone works within.

**Independent Test**: User can create/edit a shoot budget with total amount and optional category breakdowns (costumes, props, location fees, equipment rental, travel, other).

**Acceptance Scenarios**:

1. **Given** I'm creating a new shoot, **When** I set budget to "$500", **Then** shoot displays budget target and $0 spent with progress bar
2. **Given** I have an existing shoot, **When** I edit budget from "$500" to "$750", **Then** all team members see updated budget and recalculated remaining amount
3. **Given** I'm setting a budget, **When** I allocate $200 costumes, $150 props, $100 location, $50 other, **Then** category budget totals $500 and displays per-category tracking
4. **Given** budget is set, **When** expenses exceed budget, **Then** shoot displays "Over budget by $50" warning in red

---

### User Story 2 - Add & Categorize Expenses (Priority: P2)

As a team member, I want to log expenses with amount, category, description, and date so that all spending is tracked accurately.

**Why this priority**: Core expense tracking that works with P1 budget. Essential for monitoring actual spending.

**Independent Test**: Any team member can add expense entries, all members see updated spending totals in real-time.

**Acceptance Scenarios**:

1. **Given** I purchased fabric for $45, **When** I add expense "Fabric for cape" amount $45 category "Costumes" date "Oct 10", **Then** expense appears in log and costume budget shows $45/$200 spent
2. **Given** I'm adding an expense, **When** I select category from dropdown (Costumes/Props/Location/Equipment/Travel/Other), **Then** expense categorizes correctly for budget tracking
3. **Given** multiple team members add expenses simultaneously, **When** I'm viewing budget page, **Then** all expenses appear in real-time and totals update (< 2 sec propagation)
4. **Given** I added expense incorrectly, **When** I click edit and change amount from $45 to $54, **Then** budget totals recalculate immediately

---

### User Story 3 - Upload Receipt Photos (Priority: P3)

As a budget tracker, I want to attach receipt photos to expenses so that we have proof of purchase and can reference details later.

**Why this priority**: Adds documentation capability to existing expense tracking. Important for accountability but not essential for basic tracking.

**Independent Test**: User can upload/capture receipt images, view them attached to expenses, and access them in expense history.

**Acceptance Scenarios**:

1. **Given** I'm adding an expense, **When** I click "Add receipt" and upload JPG photo from my phone, **Then** receipt attaches and displays thumbnail with expense
2. **Given** I'm on mobile, **When** I tap "Capture receipt" and take photo with camera, **Then** receipt photo attaches directly without leaving app
3. **Given** expense has receipt attached, **When** I click thumbnail, **Then** full-size receipt image opens with zoom capability
4. **Given** I need to verify past purchases, **When** I view expense log, **Then** expenses with receipts show camera icon and thumbnail preview

---

### User Story 4 - Split Shared Expenses (Priority: P4)

As a team member who fronted money, I want to mark an expense as "shared" and specify who owes what so that we can track who needs to reimburse whom.

**Why this priority**: Solves reimbursement coordination problem. Valuable but shoot can function without automated split tracking.

**Independent Test**: User can mark expense as shared, assign portions to team members, see "You owe" and "Owed to you" summaries.

**Acceptance Scenarios**:

1. **Given** I paid $60 for group lunch, **When** I add expense and enable "Split between 3 people", **Then** system calculates $20 per person and marks who owes me
2. **Given** shared expense exists, **When** each person views their budget page, **Then** they see "$20 owed to [name]" in their personal summary
3. **Given** someone reimburses me $20, **When** I mark their portion as "Paid", **Then** their debt clears and my "owed to you" total updates
4. **Given** I'm the shoot organizer, **When** I view reimbursement summary, **Then** I see matrix of who owes whom with totals per person

---

### Edge Cases

- What happens when expenses are added in different currencies? (Support single currency per shoot, or multi-currency with conversion rates?)
- How to handle partial reimbursements? (Track payment history with dates, support multiple partial payments)
- What if someone deletes an expense that others were marked as splitting? (Soft delete, or notify split participants before deletion)
- Should budget categories be customizable? (Start with defaults, allow adding custom categories per shoot)
- How to handle receipts with multiple items for different categories? (Support multiple categories per expense with amount breakdown, or require separate expense entries)
- What happens when receipt photo upload fails? (Retry mechanism, save expense without receipt, allow attaching later)
- Should there be expense approval workflow? (Optional in future, start with all expenses immediately visible to team)
- How to handle budget adjustments mid-shoot? (Allow editing, show audit log of budget changes with timestamps and who changed it)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow setting total shoot budget as monetary amount with currency selection
- **FR-002**: System MUST support budget categories: Costumes, Props, Location, Equipment Rental, Travel, Other, with custom category creation
- **FR-003**: System MUST allow allocating budget amounts to each category (optional, can leave unallocated)
- **FR-004**: System MUST display budget progress bar showing total spent vs. total budget
- **FR-005**: System MUST warn when total expenses exceed budget with clear "Over budget by $X" message
- **FR-006**: System MUST allow any team member to add expenses with: amount, category, description, date, payer name
- **FR-007**: System MUST validate expense amounts as positive numbers with 2 decimal precision
- **FR-008**: System MUST display expense log with all entries sorted by date (most recent first)
- **FR-009**: System MUST show per-category spending vs. category budget allocations
- **FR-010**: System MUST support editing and soft-deleting expenses with audit trail
- **FR-011**: System MUST propagate expense changes to all team members in real-time (< 2 seconds)
- **FR-012**: System MUST allow uploading receipt photos (JPG/PNG, max 5MB) per expense
- **FR-013**: System MUST support mobile camera capture for receipts directly in app
- **FR-014**: System MUST display receipt thumbnails with expenses and full-size view on click
- **FR-015**: System MUST store receipt images securely and retain them with expense history
- **FR-016**: System MUST allow marking expense as "Shared" with split configuration
- **FR-017**: System MUST support equal split (amount divided by N people) or custom split (specify amount per person)
- **FR-018**: System MUST display "You owe" and "Owed to you" summary per user
- **FR-019**: System MUST allow marking split portions as "Paid" with payment date tracking
- **FR-020**: System MUST provide reimbursement summary showing who owes whom across all expenses
- **FR-021**: System MUST support currency selection per shoot with consistent display throughout
- **FR-022**: System MUST handle budget edits with audit log showing previous values, change timestamp, and user who made change
- **FR-023**: System MUST calculate and display remaining budget (budget - spent) with color coding (green > 20% remaining, yellow 10-20%, red < 10%)

### Key Entities

- **ShootBudget**: Budget configuration for a shoot. Attributes: shoot ID, total amount, currency, category allocations (JSON/map), created date, last modified date
- **Expense**: Individual expense entry. Attributes: shoot ID, amount, currency, category, description, expense date, payer user ID, receipt image path(s), created timestamp, last modified timestamp, deleted flag
- **ExpenseSplit**: Split configuration for shared expenses. Attributes: expense ID, split type (equal/custom), participant user IDs, amount per participant, paid status per participant, payment dates
- **BudgetAuditLog**: Track budget changes. Attributes: shoot ID, previous total, new total, previous allocations, new allocations, changed by user ID, change timestamp
- **Shoot**: Parent entity (already exists). Extended with: budget reference

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can set shoot budget with category allocations in under 2 minutes
- **SC-002**: Expense entries sync to all team members within 2 seconds
- **SC-003**: Budget progress bar updates immediately (< 500ms) after expense added
- **SC-004**: Receipt photo upload completes within 5 seconds on 3G connection
- **SC-005**: Mobile camera capture to receipt attachment works in < 3 seconds
- **SC-006**: 90% of uploaded receipts remain readable/accessible after 90 days
- **SC-007**: Split expense calculations display correctly for all participants (zero math errors)
- **SC-008**: 75% of shoots with budgets stay within ±10% of target (indicates realistic planning)
- **SC-009**: Users report expense tracking reduces payment confusion (measured via survey, target: 80% agree)
- **SC-010**: Budget warning displays immediately when expenses exceed allocated amount (< 500ms)

