```prompt
---
description: Generate a comprehensive project overview by scanning all specs and their task files.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Scan Specs Directory**:
   - Find all spec directories in `specs/` (format: `NNN-feature-name/`)
   - For each spec, check for existence of:
     - `spec.md` (feature specification)
     - `tasks.md` (task breakdown)
     - `checklists/requirements.md` (requirement validation)
     - `plan.md` (implementation plan)

2. **Parse Task Files**:
   - For each `tasks.md` found:
     - Extract feature name and spec number
     - Count total tasks (lines starting with `- [ ]` or `- [x]`)
     - Count completed tasks (lines starting with `- [x]`)
     - Calculate completion percentage
     - Extract phase information (Phase 0, Phase 1, etc.)
     - Identify current phase (first phase with incomplete tasks)
     - Extract any blocked/paused status from task descriptions

3. **Parse Requirement Checklists**:
   - For each `checklists/requirements.md` found:
     - Count total requirements
     - Count completed requirements (checked boxes)
     - Extract any outstanding gaps or blockers

4. **Analyze Dependencies**:
   - Check each spec.md for "Dependencies" or "Depends On" sections
   - Build dependency graph (which specs block others)
   - Identify specs that are ready to implement (all dependencies met)
   - Identify specs that are blocked (waiting on dependencies)

5. **Generate Overview Report**:
   Create a comprehensive markdown report with:

   **A. Executive Summary**:
   - Total specs in project
   - Total specs with tasks.md (implementation started)
   - Total specs completed (100% tasks done)
   - Total specs in progress (>0% but <100%)
   - Total specs not started (0% or no tasks.md)
   - Overall project completion percentage

   **B. Completion Matrix**:
   Table with columns:
   - Spec # | Feature Name | Tasks Done/Total | % Complete | Current Phase | Status | Blockers

   **C. Priority Breakdown**:
   - Foundation specs (020-024: auth, teams, permissions, storage, realtime)
   - Core features (001-019: dashboard, shoots, gallery, etc.)
   - Professional tools (025-040: advanced features)
   - Infrastructure (041+: navigation, theme, notifications)

   **D. Dependency Graph**:
   - Visual representation showing which specs block others
   - List of specs ready to implement next (dependencies met)
   - List of specs blocked (waiting on other specs)

   **E. Recent Activity**:
   - Last 5 specs worked on (check git commits or task completion dates)
   - Specs with recent progress

   **F. Recommended Next Steps**:
   - Based on dependencies and priorities, suggest 3-5 specs to work on next
   - Explain why each is recommended (dependencies met, high priority, etc.)

6. **Output Format**:
   - Display the report directly to the user
   - Optionally save to `.specify/project-overview.md` if requested
   - Include timestamp of when overview was generated

## Analysis Rules

**Task Parsing**:
- Checkbox format: `- [ ]` = incomplete, `- [x]` = complete
- Ignore nested tasks (more than one level of indentation)
- Task IDs follow format: `T001`, `T002`, etc.
- Phase headers: `## Phase N: Description`

**Status Determination**:
- `Not Started`: No tasks.md OR 0% complete
- `In Progress`: >0% and <100% complete
- `Paused`: Contains "(Paused)" in task description or phase header
- `Blocked`: Dependencies not met OR contains "Blocked by" in tasks.md
- `Completed`: 100% tasks complete AND requirements checklist 100%
- `Ready`: Dependencies met, 0% complete, has tasks.md

**Priority Classification**:
- Foundation (P0): Specs 020-024 (must complete first)
- Core MVP (P1): Specs with "P1" priority in spec.md
- Enhancement (P2): Specs with "P2" priority in spec.md
- Future (P3): Specs with "P3" priority in spec.md

**Constitution Compliance**:
- Flag any specs using Node.js/npm instead of Bun
- Flag any specs missing test coverage requirements
- Flag any specs without proper error handling

## Example Output

```markdown
# Project Overview: Cosplans
**Generated**: 2025-10-18 14:30:00
**Runtime**: Bun 1.3.x | Framework: SvelteKit 2.x

## Executive Summary
- **Total Specs**: 42
- **Completed**: 2 (5%)
- **In Progress**: 2 (5%)
- **Not Started**: 38 (90%)
- **Overall Progress**: 8%

## Completion Matrix

| Spec | Feature | Tasks | % | Phase | Status | Blockers |
|------|---------|-------|---|-------|--------|----------|
| 001 | Dashboard Views | 45/45 | 100% | Complete | ✅ Done | None |
| 041 | Sidebar Navigation | 32/65 | 49% | Phase 2 | 🔄 Paused | None |
| 042 | Supabase Setup | 0/25 | 0% | - | 📋 Ready | None |
| 020 | User Auth | 0/30 | 0% | - | ⏳ Not Started | None |

## Priority Breakdown

### Foundation (P0) - 0/5 complete
Critical infrastructure that blocks other features:
- [ ] 020-user-authentication (0%)
- [ ] 021-shoots-teams-creation (0%)
- [ ] 022-permissions-access-control (0%)
- [ ] 023-photo-management-storage (0%)
- [ ] 024-realtime-sync-offline (0%)

### Core MVP (P1) - 1/10 complete
Essential user-facing features:
- [x] 001-dashboard-views (100%)
- [ ] 002-shot-by-shot (0%) - Blocked by: 020, 021, 023
- [ ] 004-team-communication (0%) - Blocked by: 020, 021, 024

### Infrastructure (Ongoing) - 1/5 in progress
Cross-cutting systems:
- [x] 041-sidebar-navigation (49% - Paused at Phase 2)

## Dependency Graph

**Ready to Implement** (dependencies met):
1. 020-user-authentication (foundation - no dependencies)
2. 042-supabase-setup (infrastructure - no dependencies)

**Blocked Specs** (waiting on foundation):
- 002, 004, 006, 007, 009, 010, 011, 012, 013, 014, 015, 016, 017 → All blocked by 020, 021, 022

## Recent Activity
1. ✅ 001-dashboard-views - Merged to main (Oct 16, 2025)
2. 🔄 041-sidebar-navigation - Phase 2 paused (Oct 18, 2025)

## Recommended Next Steps

**1. Complete Foundation Layer** (Critical Path):
   - Start with 020-user-authentication
   - Then 021-shoots-teams-creation
   - Then 022-permissions-access-control
   - *Why*: These block 90% of other features

**2. Finish Sidebar Navigation** (Quick Win):
   - Resume 041-sidebar-navigation Phase 2
   - Only 33 tasks remaining (51%)
   - *Why*: No blockers, provides navigation for all features

**3. Setup Database** (Parallel Work):
   - Implement 042-supabase-setup
   - Can work in parallel with 041
   - *Why*: Required for 020-024 foundation specs

**Estimated Timeline**:
- Foundation Layer (020-024): ~3-4 weeks
- After foundation: ~30 specs unblocked for parallel development
```

## Usage Examples

```bash
# Generate overview
/speckit.overview

# Generate overview with focus on specific priority
/speckit.overview priority=P1

# Generate overview and save to file
/speckit.overview --save

# Show only blocked specs
/speckit.overview filter=blocked

# Show only ready-to-implement specs
/speckit.overview filter=ready
```

## Notes

- Overview is generated from current state of files (not git history)
- Completion percentages are based on task checkboxes only
- Dependency information comes from spec.md "Dependencies" sections
- Use this command frequently to track project health and make prioritization decisions
- Report format follows markdown for easy viewing in VS Code or GitHub
```
