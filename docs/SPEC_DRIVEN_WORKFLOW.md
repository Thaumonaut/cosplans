# Spec-Driven Development Workflow

**Constitutional Requirement**: Principle VI.7 mandates GitHub Spec Kit workflow for ALL feature development.

## Overview

All feature development MUST follow the four-phase Spec Kit workflow with human validation at each checkpoint. This ensures features are thoroughly planned, dependencies are identified, and implementation matches requirements.

**No implementation without an approved spec.**

---

## The Four-Phase Workflow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  1. SPECIFY │ ───> │   2. PLAN   │ ───> │   3. TASK   │ ───> │ 4. IMPLEMENT│
│   (spec.md) │      │  (plan.md)  │      │ (tasks.md)  │      │    (code)   │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
      ↓                     ↓                     ↓                     ↓
  [CHECKPOINT]         [CHECKPOINT]         [CHECKPOINT]         [CHECKPOINT]
   Human Review         Human Review         Human Review          Testing
```

---

## Phase 1: SPECIFY

**Goal**: Define WHAT we're building and WHY.

**Command**: `/speckit.specify` or manually create `specs/[number]-[feature-name]/spec.md`

### What to Include:

1. **Problem Statement**: What user problem does this solve?
2. **User Stories**: Who needs this and what do they need to do?
3. **Acceptance Criteria**: How do we know it's done?
4. **Scope**: What's included and explicitly excluded?
5. **Dependencies**: What other features/systems does this depend on?
6. **Constitutional Alignment**: Which principles does this support?
7. **Monetization Impact**: Does this affect free/premium tiers?
8. **Cost Impact**: Infrastructure/API costs introduced?

### Template Location:
`.specify/templates/spec-template.md`

### Checkpoint Questions:
- [ ] Does this solve a real user problem?
- [ ] Are acceptance criteria testable?
- [ ] Are dependencies identified?
- [ ] Does this align with constitutional principles?
- [ ] Is the scope clear and bounded?
- [ ] Have we considered cost implications?

### Output:
`specs/[number]-[feature-name]/spec.md`

---

## Phase 2: PLAN

**Goal**: Define HOW we'll build it (architecture, data model, UI flow).

**Command**: `/speckit.plan` or manually create `specs/[number]-[feature-name]/plan.md`

### What to Include:

1. **Architecture Decisions**: Components, services, database schema
2. **Data Model**: Tables, columns, relationships, RLS policies
3. **UI/UX Flow**: User journey, screens, interactions
4. **API Design**: Endpoints, request/response formats
5. **Integration Points**: External APIs, services
6. **Security Considerations**: Auth, permissions, data protection
7. **Performance Requirements**: Load times, query optimization
8. **Dependency Analysis**: Build order, what must exist first
9. **Cost Optimization**: Cloudflare vs Supabase decisions

### Template Location:
`.specify/templates/plan-template.md`

### Checkpoint Questions:
- [ ] Is the data model normalized and efficient?
- [ ] Are RLS policies defined for all tables?
- [ ] Have we identified all API integrations?
- [ ] Is the dependency order clear?
- [ ] Have we chosen cost-optimized infrastructure?
- [ ] Are performance requirements specified?
- [ ] Is the plan implementable by the team?

### Output:
`specs/[number]-[feature-name]/plan.md`

---

## Phase 3: TASK

**Goal**: Break the plan into actionable, ordered tasks.

**Command**: `/speckit.tasks` or manually create `specs/[number]-[feature-name]/tasks.md`

### What to Include:

1. **Dependency-Ordered Tasks**: Build foundational pieces first
2. **Database Migrations**: Schema changes with rollback plans
3. **Backend Services**: API routes, business logic
4. **Frontend Components**: UI components, pages, forms
5. **Testing Tasks**: Unit tests, integration tests, E2E tests
6. **Documentation Tasks**: API docs, user guides
7. **Deployment Tasks**: Migration scripts, config changes

### Task Format:
```markdown
## Task [number]: [Title]
**Type**: [Database/Backend/Frontend/Testing/Documentation]
**Depends On**: [Task numbers]
**Estimated Time**: [hours]

### Description
[What needs to be done]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

### Implementation Notes
[Technical details, gotchas, references]
```

### Template Location:
`.specify/templates/tasks-template.md`

### Checkpoint Questions:
- [ ] Are tasks ordered by dependencies?
- [ ] Is each task small enough (< 4 hours)?
- [ ] Do tasks have clear acceptance criteria?
- [ ] Are testing tasks included for each feature?
- [ ] Are database migrations reversible?
- [ ] Is the task list complete?

### Output:
`specs/[number]-[feature-name]/tasks.md`

---

## Phase 4: IMPLEMENT

**Goal**: Execute tasks, write tests, verify acceptance criteria.

**Command**: `/speckit.implement` or manually execute tasks in order

### Implementation Rules:

1. **Test-First**: Write tests before implementation (TDD)
2. **Task-by-Task**: Complete one task fully before starting next
3. **Commit Frequently**: Commit after each task completion
4. **Update Status**: Mark tasks as complete in `tasks.md`
5. **Document Changes**: Update API docs, README as you go
6. **Verify Acceptance**: Check spec acceptance criteria

### Commit Message Format:
```
feat(feature-name): implement task [number] - [title]

- Acceptance criterion 1 ✓
- Acceptance criterion 2 ✓

Refs: specs/[number]-[feature-name]/tasks.md#task-[number]
```

### Checkpoint Questions:
- [ ] Do all tests pass?
- [ ] Are acceptance criteria met?
- [ ] Is code reviewed?
- [ ] Is documentation updated?
- [ ] Are migrations tested?
- [ ] Does implementation match the plan?

### Output:
- Working code in `src/`
- Tests in `tests/`
- Updated documentation
- Database migrations in `supabase/migrations/`

---

## Workflow Commands

### Using GitHub Spec Kit:

```bash
# Phase 1: Create spec from feature description
/speckit.specify "Add reputation system with tier-based accountability"

# Phase 2: Generate implementation plan
/speckit.plan

# Phase 3: Break into tasks
/speckit.tasks

# Phase 4: Execute implementation
/speckit.implement
```

### Manual Workflow:

```bash
# Create new spec directory
mkdir -p specs/[number]-[feature-name]

# Copy templates
cp .specify/templates/spec-template.md specs/[number]-[feature-name]/spec.md
cp .specify/templates/plan-template.md specs/[number]-[feature-name]/plan.md
cp .specify/templates/tasks-template.md specs/[number]-[feature-name]/tasks.md

# Edit each file following the templates
# Get human review at each checkpoint
# Execute tasks in dependency order
```

---

## Checkpoint Validation Process

### Spec Review Checklist:
Use `.specify/templates/checklist-template.md` for each phase review.

### Who Reviews:
- **Solo Developer**: Self-review with 24-hour cooling period
- **Team**: Peer review via PR comments
- **Stakeholder**: Product owner approval for scope changes

### Review Criteria:

**Specify Phase**:
- Problem is clearly defined
- User stories are complete
- Acceptance criteria are testable
- Dependencies are identified
- Constitutional alignment verified

**Plan Phase**:
- Architecture is sound
- Data model is normalized
- Security is addressed
- Performance requirements specified
- Cost optimization considered

**Task Phase**:
- Tasks are dependency-ordered
- Each task is < 4 hours
- Testing tasks included
- Acceptance criteria clear

**Implement Phase**:
- All tests pass
- Code is reviewed
- Documentation updated
- Acceptance criteria met

---

## Enforcement Mechanisms

### 1. PR Template Validation

All PRs MUST include:
```markdown
## Spec Reference
- [ ] Spec: `specs/[number]-[feature-name]/spec.md`
- [ ] Plan: `specs/[number]-[feature-name]/plan.md`
- [ ] Tasks: `specs/[number]-[feature-name]/tasks.md`

## Checkpoint Verification
- [ ] Spec approved by [reviewer]
- [ ] Plan approved by [reviewer]
- [ ] Tasks approved by [reviewer]
- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] Documentation updated

## Constitutional Compliance
- [ ] Aligns with Principle: [principle number]
- [ ] Cost impact assessed: [none/low/medium/high]
- [ ] Dependency order followed: [yes/no]
```

### 2. Automated Checks

```bash
# Pre-commit hook: Verify spec exists for changed files
.git/hooks/pre-commit

# CI/CD: Verify spec reference in PR description
.github/workflows/spec-validation.yml
```

### 3. Spec Audit Process

**Monthly**: Review all specs for completeness and accuracy
**Quarterly**: Update outdated specs to match implementation
**Annually**: Archive obsolete specs

---

## Common Pitfalls & Solutions

### ❌ Pitfall: "I'll write the spec after I prototype"
**Solution**: Prototypes are fine, but spec MUST be written before production code. Prototype in a separate branch, then write spec based on learnings.

### ❌ Pitfall: "The spec is too detailed, it's slowing me down"
**Solution**: Detailed specs prevent rework. Time spent planning saves 3-5x time in implementation and debugging.

### ❌ Pitfall: "The implementation deviated from the plan"
**Solution**: Update the plan BEFORE deviating. Document why the change was necessary. Get checkpoint approval.

### ❌ Pitfall: "We don't have time for checkpoints"
**Solution**: Checkpoints prevent building the wrong thing. 15 minutes of review saves hours of rework.

### ❌ Pitfall: "Specs get outdated quickly"
**Solution**: Update specs when implementation changes. Treat specs as living documentation, not one-time artifacts.

---

## Spec Numbering Convention

```
001-099: Core Platform Features
100-199: User Management & Auth
200-299: Team & Collaboration
300-399: Content & Media
400-499: Integrations & APIs
500-599: Monetization & Payments
600-699: Analytics & Reporting
700-799: Admin & Moderation
800-899: Performance & Optimization
900-999: Developer Tools
```

Current highest number: 044 (UI Flowbite Migration)

---

## Example: Reputation System Spec-Driven Flow

### Phase 1: Specify
```markdown
# Spec: Reputation System

## Problem Statement
Users need accountability for event attendance to build trust in the community.

## User Stories
- As an event organizer, I want to see a user's reputation tier before accepting them
- As a participant, I want to build my reputation through reliable attendance
- As a platform, I want to restrict unreliable users from public events

## Acceptance Criteria
- [ ] Users have visible reputation tiers (Exemplary → Unreliable)
- [ ] Tier calculated from last 12 months of attendance data
- [ ] Event restrictions enforced based on tier
- [ ] Reputation grace tokens available (2 per 12 months)

## Dependencies
- Event attendance tracking system
- Cloudflare Worker for calculation engine
- User profiles with reputation display

## Constitutional Alignment
- Principle II.7: Community Trust & Accountability
- Principle VIII.5: Cost Optimization (Cloudflare Worker)
```

### Phase 2: Plan
```markdown
# Plan: Reputation System

## Data Model
```sql
CREATE TABLE user_reputation (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  tier TEXT NOT NULL CHECK (tier IN ('exemplary', 'reliable', 'consistent', 'building', 'flaky', 'unreliable')),
  grace_tokens INT DEFAULT 2,
  last_calculated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reputation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id),
  impact INT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

## Architecture
- Cloudflare Worker: `reputation-calculator`
- Supabase Function: `calculate_user_reputation(user_id)`
- Frontend Component: `ReputationBadge.svelte`

## API Endpoints
- GET `/api/reputation/:userId` - Get user reputation
- POST `/api/reputation/calculate` - Trigger recalculation
```

### Phase 3: Tasks
```markdown
# Tasks: Reputation System

## Task 1: Create Database Schema
**Type**: Database
**Depends On**: None
**Estimated Time**: 2 hours

### Acceptance Criteria
- [ ] user_reputation table created
- [ ] reputation_events table created
- [ ] RLS policies defined
- [ ] Migration tested with rollback

## Task 2: Build Cloudflare Worker
**Type**: Backend
**Depends On**: Task 1
**Estimated Time**: 4 hours

### Acceptance Criteria
- [ ] Worker calculates tier from events
- [ ] Handles grace tokens
- [ ] Returns tier + metadata
- [ ] Unit tests pass
```

### Phase 4: Implement
```bash
# Execute tasks in order
git checkout -b feat/reputation-system

# Task 1
supabase migration new reputation_system
# ... implement migration
bun run test:unit
git commit -m "feat(reputation): implement task 1 - database schema"

# Task 2
# ... implement Cloudflare Worker
bun run test:unit
git commit -m "feat(reputation): implement task 2 - calculation engine"

# Continue for all tasks...
```

---

## Quick Reference

### Before Starting Any Feature:
1. ✅ Spec exists and is approved
2. ✅ Plan exists and is approved
3. ✅ Tasks exist and are approved
4. ✅ Dependencies are built
5. ✅ Cost impact assessed

### During Implementation:
1. ✅ Follow tasks in order
2. ✅ Write tests first (TDD)
3. ✅ Commit after each task
4. ✅ Update task status
5. ✅ Verify acceptance criteria

### After Implementation:
1. ✅ All tests pass
2. ✅ Code reviewed
3. ✅ Documentation updated
4. ✅ Spec acceptance criteria met
5. ✅ PR includes spec reference

---

## Resources

- **Templates**: `.specify/templates/`
- **Existing Specs**: `specs/`
- **Constitution**: `.specify/memory/constitution.md`
- **Audit Report**: `PLAN/CONSTITUTIONAL_COMPLIANCE_AUDIT.md`

---

## Questions?

If you're unsure whether a feature needs a spec:
- **YES** if it adds new functionality
- **YES** if it changes user-facing behavior
- **YES** if it modifies database schema
- **YES** if it adds dependencies
- **NO** if it's a bug fix (use issue tracker)
- **NO** if it's a typo/docs correction

**When in doubt, write a spec.** It's faster to skip unnecessary specs than to fix unplanned implementations.
