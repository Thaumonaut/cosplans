# Team Architecture Changes - Proposal

## Current Architecture (As Built)

### Team as Context
- Team switcher changes "current team" context globally
- All data views are scoped to the current team
- Switching teams changes what you see everywhere in the app
- Dashboard shows only shoots from the current team

### Constitution Statement (Principle II.5)
> "All core features (shoots, costumes, props, schedules) exist within a team context."

This implies team-scoped views and team-switching behavior.

---

## Proposed Architecture (User Request)

### Team as Organizational Unit
- **Dashboard shows shoots from ALL teams** the user is a member of
- Team dropdown acts as a **filter**, not a context switch
- When creating a shoot, user **selects which team** it belongs to
- User can view/manage content across all their teams simultaneously

### Key Behavioral Changes

1. **Dashboard Behavior**
   - **Current**: Shows only current team's shoots
   - **Proposed**: Shows all shoots from all teams, with team badges/indicators

2. **Team Dropdown**
   - **Current**: Switches global context (like switching workspaces)
   - **Proposed**: Filters the current view (like a search filter)

3. **Shoot Creation**
   - **Current**: Shoot automatically belongs to current team
   - **Proposed**: User selects team from dropdown when creating shoot

4. **Navigation**
   - **Current**: Team context persists across all pages
   - **Proposed**: Each page decides if it's cross-team or team-specific

---

## Required Constitution Changes

### Principle II.5 Update

**OLD TEXT:**
> "All core features (shoots, costumes, props, schedules) exist within a team context."

**NEW TEXT:**
> "All core features (shoots, costumes, props, schedules) are **owned by a team**, but users can view and manage content **across all their teams** simultaneously. The dashboard provides a unified view of all shoots from all teams, with filtering options to focus on specific teams when needed."

### New Section: Cross-Team Data Access

**Add to Principle II.5:**

**Cross-Team Visibility**: Users MUST be able to view and manage shoots, costumes, props, and schedules from all teams they are members of in a unified dashboard view. The system MUST provide filtering options to narrow views to specific teams when desired. Team ownership determines permissions (who can edit/delete), but visibility spans all user memberships.

**Team Selection on Creation**: When creating new shoots, costumes, or props, users MUST explicitly select which team the item belongs to. The system SHOULD remember the last-selected team as a default for convenience, but MUST allow changing the team selection for each new item.

**Rationale**: Users often participate in multiple cosplay projects simultaneously across different teams. Requiring context-switching between teams creates friction and prevents holistic planning. A unified cross-team view enables users to see their full workload, identify scheduling conflicts, and coordinate resources across projects while maintaining clear team ownership for permissions and collaboration.

---

## Required Spec Changes

### Spec 021 (Shoots & Teams Creation)

**Current User Story:**
- US5: "View Team and Shoot Hierarchy" - implies team-scoped view

**Needs Update To:**
- US5: "View All Shoots Across Teams with Filtering"
  - Dashboard shows shoots from all teams
  - Team filter dropdown to narrow view
  - Team badges on each shoot card
  - Sort/filter by team, date, status

**New User Story:**
- US7: "Select Team When Creating Shoot"
  - Team dropdown in shoot creation form
  - Remember last-selected team
  - Validate user has permission in selected team

### Navigation Store Changes

**Current:**
- `currentTeam` - global context
- `switchTeam()` - changes context everywhere

**Proposed:**
- `selectedTeamFilter` - optional filter (null = show all)
- `filterByTeam(teamId | null)` - filter current view only
- Each page decides if it respects the filter

---

## Implementation Impact

### Files Requiring Changes

1. **TeamSwitcher.svelte**
   - Change from "switch context" to "filter view"
   - Update UI to show "All Teams" option
   - Update behavior to set filter, not change context

2. **Dashboard (+page.server.ts)**
   - Fetch shoots from all user's teams
   - Apply team filter if set
   - Show team badges on shoot cards

3. **Shoot Creation Form**
   - Add team selection dropdown
   - Validate user permissions for selected team
   - Store last-selected team in localStorage

4. **Navigation Store (navigation.ts)**
   - Remove `currentTeam` concept
   - Add `teamFilter` (optional)
   - Update methods to filter, not switch

5. **Team Details Page**
   - Keep as team-specific view
   - Shows only that team's data
   - Not affected by global filter

### Database Schema
- **No changes needed** - shoots already have `team_id`
- RLS policies already enforce team membership
- Just need to query across all user's teams

---

## Migration Strategy

### Phase 1: Update Constitution & Specs
1. Update Principle II.5 with new cross-team language
2. Update spec 021 user stories
3. Document new navigation patterns

### Phase 2: Implement Cross-Team Dashboard
1. Update dashboard to fetch from all teams
2. Add team badges to shoot cards
3. Add "All Teams" option to dropdown

### Phase 3: Convert Team Switcher to Filter
1. Rename to "Team Filter"
2. Add "All Teams" option
3. Update behavior to filter, not switch
4. Update navigation store

### Phase 4: Add Team Selection to Creation
1. Add team dropdown to shoot creation
2. Add team dropdown to costume/prop creation
3. Store last-selected team preference

---

## Questions for Discussion

1. **Messages/Chat**: Should messages be:
   - Team-scoped (like Slack channels)?
   - Cross-team DMs (like email)?
   - Both (team channels + DMs)?

2. **Costumes/Props**: Should they also be:
   - Viewable across all teams?
   - Or remain team-scoped?

3. **Calendar View**: Should it show:
   - All teams' shoots by default?
   - Or respect team filter?

4. **Team Page**: Should clicking a team in the dropdown:
   - Navigate to team details page?
   - Or just filter the current view?

---

## Recommendation

✅ **Proceed with proposed architecture** - it's more flexible and user-friendly

**Benefits:**
- Reduces context-switching friction
- Enables holistic planning across projects
- Maintains clear team ownership for permissions
- Aligns with how users actually work (multiple projects simultaneously)

**Risks:**
- More complex UI (need team indicators everywhere)
- Potential performance impact (querying multiple teams)
- Need clear visual distinction between team-specific and cross-team views

**Mitigation:**
- Use team badges/colors consistently
- Implement efficient database queries with proper indexes
- Clear UI patterns for filtered vs unfiltered views
