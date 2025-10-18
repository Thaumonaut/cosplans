# GitHub Project Board Template for Cosplans Phase 1

This document describes the GitHub Project Board setup for Phase 1 MVP implementation (12 weeks).

---

## Project Board Automation

### Columns

1. **Backlog**: Tasks not yet started
2. **Ready**: Tasks ready to work on (dependencies met)
3. **In Progress**: Tasks currently being worked on
4. **Review**: Tasks in PR review
5. **Done**: Completed tasks (merged to main)

### Automation Rules (GitHub Actions)

#### Rule 1: Auto-add PRs to "In Progress"

```
When: Pull request opened/reopened
Then: Move card to "In Progress"
```

#### Rule 2: Auto-move to "Review" on PR

```
When: Pull request ready for review
Then: Move card to "Review"
```

#### Rule 3: Auto-move to "Done" on PR merge

```
When: Pull request merged
Then: Move card to "Done"
```

#### Rule 4: Auto-reopen "Done" if PR reverted

```
When: PR reverted
Then: Move card back to "In Progress"
```

---

## Issue Templates

### Story Template (`.github/ISSUE_TEMPLATE/story.md`)

```markdown
## Summary

[2-3 line description of feature]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Notes

[Optional: architecture decisions, known blockers]

## Week

Week X of 12

## Related PRs

[Links to related PRs if any]
```

### Bug Template (`.github/ISSUE_TEMPLATE/bug.md`)

```markdown
## Description

[What is the bug?]

## Steps to Reproduce

1. ...
2. ...
3. ...

## Expected Behavior

[What should happen?]

## Actual Behavior

[What actually happens?]

## Environment

- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Version: [app version]

## Week

Week X of 12
```

---

## Epic: Week 1-2 (Database & API)

### Stories

#### Story: Database Schema Setup

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `database`, `week-1`
- **Acceptance Criteria**:
  - [ ] All 12 tables created with migrations
  - [ ] Indexes added for common queries
  - [ ] RLS policies scaffolded
  - [ ] Migrations tested

#### Story: API Routes - Shoots CRUD

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `api`, `week-1`
- **Acceptance Criteria**:
  - [ ] GET /api/shoots (list)
  - [ ] POST /api/shoots (create)
  - [ ] GET /api/shoots/{id} (detail)
  - [ ] PATCH /api/shoots/{id} (update)
  - [ ] DELETE /api/shoots/{id}
  - [ ] Tests for all endpoints

#### Story: API Routes - Costumes CRUD

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `api`, `week-1`
- **Acceptance Criteria**:
  - [ ] All CRUD endpoints
  - [ ] Tests passing

#### Story: Error Handling & Validation

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `api`, `error-handling`, `week-1`
- **Acceptance Criteria**:
  - [ ] 400/401/403/404/429/500 errors
  - [ ] Validation with Zod

#### Story: API Documentation

- **Assignee**: [Team member]
- **Points**: 2
- **Labels**: `documentation`, `week-1`
- **Acceptance Criteria**:
  - [ ] OpenAPI spec generated
  - [ ] Database schema diagram
  - [ ] Migrations documented

---

## Epic: Week 3 (Authentication)

### Stories

#### Story: Google OAuth Integration

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `auth`, `week-3`, `google`

#### Story: Passkey & Email Signup

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `auth`, `week-3`, `passkey`

#### Story: Two-Factor Authentication (2FA)

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `auth`, `week-3`, `2fa`

#### Story: Session Management & Load Hook

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `auth`, `week-3`, `session`

---

## Epic: Week 4 (Images & Email)

### Stories

#### Story: Image Upload & S3 Storage

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `images`, `week-4`, `s3`

#### Story: Image Optimization (Sharp)

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `images`, `week-4`, `sharp`

#### Story: SendGrid Email Integration

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `email`, `week-4`, `sendgrid`

#### Story: Email Templates & Queue

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `email`, `week-4`

---

## Epic: Week 5-6 (Real-Time Sync)

### Stories

#### Story: Yjs CRDT Setup

- **Assignee**: [Team member]
- **Points**: 8
- **Labels**: `sync`, `week-5`, `yjs`, `crdt`

#### Story: Offline Queue (IndexedDB)

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `sync`, `week-5`, `offline`

#### Story: Real-Time Sync (Supabase Realtime)

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `sync`, `week-5`, `realtime`

#### Story: Conflict Resolution (3-Way Merge)

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `sync`, `week-6`, `conflict`

#### Story: Presence Indicators

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `sync`, `week-6`, `presence`

---

## Epic: Week 7 (Google Integrations)

### Stories

#### Story: Google Maps (Venue Search)

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `integrations`, `week-7`, `google-maps`

#### Story: Google Calendar Sync

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `integrations`, `week-7`, `google-calendar`

#### Story: Google Docs Integration

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `integrations`, `week-7`, `google-docs`

---

## Epic: Week 8 (Permissions)

### Stories

#### Story: @casl/ability Setup

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `permissions`, `week-8`, `casl`

#### Story: RLS Policies on All Tables

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `permissions`, `week-8`, `rls`

#### Story: Crew Management Page

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `permissions`, `week-8`, `ui`

#### Story: Team Member Invites

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `permissions`, `week-8`

---

## Epic: Week 9 (Core UI)

### Stories

#### Story: Dashboard Page

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `ui`, `week-9`, `dashboard`

#### Story: Shoots Management (List + Detail + Create)

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `ui`, `week-9`, `shoots`

#### Story: Costumes Management (Gallery)

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `ui`, `week-9`, `costumes`

#### Story: Props Management

- **Assignee**: [Team member]
- **Points**: 2
- **Labels**: `ui`, `week-9`, `props`

#### Story: Navigation & Responsive Layout

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `ui`, `week-9`, `nav`

#### Story: Form Validation & Shadcn Components

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `ui`, `week-9`, `forms`

---

## Epic: Week 10 (Instagram Integration)

### Stories

#### Story: Instagram Account Connection (OAuth)

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `instagram`, `week-10`, `oauth`

#### Story: Content Calendar View

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `instagram`, `week-10`, `calendar`

#### Story: Draft Creation & Editing

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `instagram`, `week-10`, `drafts`

#### Story: Schedule & Auto-Publish

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `instagram`, `week-10`, `scheduling`

#### Story: Instagram Analytics

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `instagram`, `week-10`, `analytics`

---

## Epic: Week 11 (Testing & Optimization)

### Stories

#### Story: Increase Test Coverage to 70%

- **Assignee**: [Team member]
- **Points**: 8
- **Labels**: `testing`, `week-11`, `coverage`

#### Story: Accessibility (WCAG 2.1 AA)

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `testing`, `week-11`, `a11y`

#### Story: Performance Optimization

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `testing`, `week-11`, `performance`

#### Story: Documentation (Testing, A11y, Performance Guides)

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `documentation`, `week-11`

---

## Epic: Week 12 (Deployment)

### Stories

#### Story: CI/CD Pipeline (GitHub Actions)

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `devops`, `week-12`, `ci-cd`

#### Story: Staging Environment

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `devops`, `week-12`, `staging`

#### Story: Production Deployment

- **Assignee**: [Team member]
- **Points**: 5
- **Labels**: `devops`, `week-12`, `production`

#### Story: Domain & DNS Setup

- **Assignee**: [Team member]
- **Points**: 2
- **Labels**: `devops`, `week-12`, `domain`

#### Story: Deployment & Runbook Documentation

- **Assignee**: [Team member]
- **Points**: 3
- **Labels**: `documentation`, `week-12`

---

## PR Review Template (`.github/PULL_REQUEST_TEMPLATE.md`)

```markdown
## Description

[What does this PR do?]

## Related Issue

Closes #[issue number]

## Type of Change

- [ ] New feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation
- [ ] Performance improvement

## Changes

- [ ] Change 1
- [ ] Change 2

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated (if applicable)
- [ ] Test coverage maintained/improved

## Checklist

- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] 70%+ test coverage
- [ ] Accessibility checked (if UI change)
- [ ] Performance impact assessed (if applicable)

## Screenshots (if applicable)

[Add screenshots of UI changes]

## Reviewers

@[primary-reviewer] @[secondary-reviewer]

---

## Constitution Alignment

- [ ] Aligns with Constitution v2.2.0
- [ ] Addresses one or more principles (list them)
```

---

## Project Board Labels

```
week-1, week-2, week-3, ... week-12  # Which week this task belongs to
database, api, ui, testing, devops   # Component
auth, images, sync, integrations     # Feature area
bug, documentation, refactor          # Issue type
blocked, in-review, ready             # Status (optional)
critical, high, medium, low           # Priority (optional)
a11y, performance, security           # Cross-cutting concerns
```

---

## Project Board Usage

### Daily Standup

- Open project board
- Check "In Progress" column
- Any blockers? Move to "Backlog" and add comment
- Any completions? PRs in "Review" should be reviewed

### Weekly Planning

- At start of week: move stories from "Backlog" to "Ready"
- Assign to team members
- Update points estimate if needed

### Weekly Review

- Check "Done" column for completed stories
- Verify acceptance criteria met
- Plan next week's stories

### Release

- All stories in "Done"
- All tests passing
- Deploy to production
- Close week milestone

---

## Example: Week 1 Board State

| Backlog                | Ready                       | In Progress                              | Review                   | Done     |
| ---------------------- | --------------------------- | ---------------------------------------- | ------------------------ | -------- |
| Week 2 stories (stubs) | API Routes - Shoots (5 pts) | Database Setup (in progress, 3 pts done) | Error Handling (PR #123) | None yet |
|                        | Error Handling (3 pts)      | API Routes - Costumes (1 pt done)        |                          |          |
|                        |                             |                                          |                          |          |

**Monday, End of Day**: Database and 1 of 2 API routes in progress
**Tuesday, End of Day**: Database done, API routes in review
**Friday, End of Day**: All Week 1 stories in "Done" ✅

---

## GitHub Actions Workflow

Create file: `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Check types
        run: npm run check

      - name: Run tests
        run: npm run test:coverage

      - name: Check coverage
        run: npm run test:coverage -- --reporter=text --reporter=text-summary | grep -E "Lines|Branches|Functions|Statements"

      - name: Build
        run: npm run build

  deploy-staging:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Deploy to staging
        run: |
          npm ci
          npm run build
          # Deploy to staging environment
          # (e.g., vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }})
```

---

## Conclusion

This GitHub Project Board template provides:

- ✅ 40+ stories pre-populated (12 weeks)
- ✅ Clear acceptance criteria for each story
- ✅ Automatic workflow management
- ✅ Structured PR reviews
- ✅ Weekly planning framework

Use this template to track Phase 1 MVP progress, assign work, and ensure quality standards.
