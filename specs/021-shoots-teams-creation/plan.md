# Implementation Plan: Shoots & Teams Creation

**Branch**: `021-shoots-teams-creation` | **Date**: October 20, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/021-shoots-teams-creation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement team creation and management to unblock user onboarding flow. Per constitutional requirement (Principle II.5), every user MUST own at least one team. This feature provides the foundational team infrastructure required for auth onboarding completion. Scope limited to teams only (shoots deferred to next phase) to accelerate delivery.

**Key Decisions from Clarification**:
- Auto-create team during onboarding with user's name + prompt for customization
- Three-tier permissions: Owner, Admin, Member
- Pending invitations with auto-join on signup (any auth method)
- Full metadata tracking (role, timestamps, invited_by, last_active, custom_permissions)
- Teams only for MVP (shoots deferred)

## Technical Context

**Language/Version**: TypeScript 5.x with SvelteKit (latest)  
**Runtime**: Bun (latest stable)  
**Primary Dependencies**: 
- `@sveltejs/kit` - Full-stack framework
- `@supabase/ssr` - Supabase SSR client for auth & database
- `@supabase/supabase-js` - Supabase client types
- Existing auth infrastructure from spec 020

**Storage**: Supabase PostgreSQL (hosted)  
**Testing**: Vitest (unit), Playwright (E2E)  
**Target Platform**: Web application (desktop + mobile responsive)  
**Project Type**: Web (SvelteKit SSR + client-side)  
**Performance Goals**: 
- Team operations <500ms (per spec SC-008)
- Real-time updates <1s (per spec SC-006)
- Support 1000+ teams per user (per spec SC-007)

**Constraints**: 
- Must integrate with existing auth system (spec 020)
- Must satisfy constitutional team ownership requirement
- Must use Supabase RLS for security
- Must support real-time collaboration (constitution Principle II)

**Scale/Scope**: 
- MVP: 3-5 pages (onboarding, team create, team settings, team list, invite flow)
- Database: 3 tables (teams, team_members, team_invitations)
- ~1000-1500 LOC estimated

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle II.5 - User Team Ownership Requirement

**Requirement**: Every user MUST be part of at least one team they own at all times.

**Compliance**:
- ✅ Auto-create team during onboarding (user becomes owner)
- ✅ Prevent deletion of user's last owned team
- ✅ Database constraint to enforce ownership
- ✅ Onboarding blocks completion until team is created

**Implementation**: Team creation integrated into auth onboarding flow (spec 020).

### ✅ Principle II - Real-Time Collaboration

**Requirement**: Team members MUST view and edit shared data in real-time.

**Compliance**:
- ✅ Supabase real-time subscriptions for team updates
- ✅ Member changes propagate immediately
- ✅ Target: <1s update latency (per spec SC-006)

**Implementation**: Supabase real-time channels per team.

### ✅ Principle VI - Test-Driven Development

**Requirement**: Unit tests MUST be written before implementation.

**Compliance**:
- ✅ Unit tests for team creation logic
- ✅ Integration tests for invitation flow
- ✅ E2E tests for onboarding + team creation

**Implementation**: Vitest (unit) + Playwright (E2E) per existing test infrastructure.

### ✅ Principle VI.5 - OAuth Primary Authentication

**Requirement**: OAuth MUST be primary authentication mechanism.

**Compliance**:
- ✅ Team creation works with all auth methods (OAuth + email/password)
- ✅ Invitation auto-join works regardless of signup method
- ✅ Leverages existing auth from spec 020

**Implementation**: No auth changes needed - uses existing auth infrastructure.

**GATE STATUS**: ✅ **PASS** - All constitutional requirements satisfied

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

```
src/
├── lib/
│   ├── components/
│   │   └── teams/
│   │       ├── TeamCreateForm.svelte      # Team creation UI
│   │       ├── TeamMemberList.svelte      # Display team members
│   │       ├── TeamInviteForm.svelte      # Invite members UI
│   │       └── TeamSwitcher.svelte        # Switch between teams (existing)
│   ├── stores/
│   │   └── team.ts                        # Team state management (existing)
│   ├── server/
│   │   └── teams/
│   │       ├── team-service.ts            # Team business logic
│   │       ├── invitation-service.ts      # Invitation handling
│   │       └── permissions.ts             # Team permission checks
│   └── types/
│       └── teams.ts                       # TypeScript types for teams
│
├── routes/
│   ├── onboarding/
│   │   ├── +page.svelte                   # Onboarding UI (NEW)
│   │   └── +page.server.ts                # Team creation on onboarding (NEW)
│   ├── teams/
│   │   ├── +page.svelte                   # Team list view (NEW)
│   │   ├── +page.server.ts                # Load user's teams (NEW)
│   │   ├── create/
│   │   │   ├── +page.svelte               # Create team form (NEW)
│   │   │   └── +page.server.ts            # Handle team creation (NEW)
│   │   └── [teamId]/
│   │       ├── +page.svelte               # Team details (NEW)
│   │       ├── +page.server.ts            # Load team data (NEW)
│   │       └── settings/
│   │           ├── +page.svelte           # Team settings UI (NEW)
│   │           └── +page.server.ts        # Update team, manage members (NEW)
│   └── invite/
│       └── [token]/
│           ├── +page.svelte               # Accept invitation UI (NEW)
│           └── +page.server.ts            # Process invitation (NEW)
│
database/
└── migrations/
    └── 004_teams_schema.sql               # Teams, members, invitations tables (NEW)

tests/
├── unit/
│   └── teams/
│       ├── team-service.test.ts           # Team business logic tests (NEW)
│       └── invitation-service.test.ts     # Invitation logic tests (NEW)
├── integration/
│   └── teams/
│       └── team-creation-flow.test.ts     # Full team creation flow (NEW)
└── e2e/
    └── teams/
        ├── onboarding-team-creation.spec.ts   # E2E onboarding (NEW)
        └── team-invitation-flow.spec.ts       # E2E invitation (NEW)
```

**Structure Decision**: SvelteKit full-stack web application. Teams feature integrates with existing auth infrastructure (spec 020). Uses SvelteKit's file-based routing for pages and server-side logic. Supabase handles database and real-time updates.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

