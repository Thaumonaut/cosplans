# Research: Shoots & Teams Creation

**Date**: October 20, 2025  
**Feature**: Teams Creation (MVP - Shoots deferred)

---

## Research Questions

### 1. Supabase Row Level Security (RLS) for Teams

**Decision**: Use RLS policies for team-based access control

**Rationale**:
- Supabase RLS provides database-level security (defense in depth)
- Prevents data leaks even if application logic has bugs
- Supports real-time subscriptions with automatic filtering
- Constitutional requirement for secure multi-team architecture

**Implementation Pattern**:
```sql
-- Teams: Users can only see teams they're members of
CREATE POLICY "Users can view their teams"
  ON teams FOR SELECT
  USING (
    id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
    )
  );

-- Team Members: Users can only see members of their teams
CREATE POLICY "Users can view team members"
  ON team_members FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
    )
  );
```

**Alternatives Considered**:
- Application-level filtering only → Rejected: Less secure, no real-time filtering
- Service-level auth tokens → Rejected: Adds complexity, doesn't leverage Supabase features

---

### 2. Team Invitation Token Generation

**Decision**: Use cryptographically secure random tokens with expiration

**Rationale**:
- Prevents invitation link guessing attacks
- Tokens expire after 7 days (per spec FR-005)
- One-time use (marked as accepted after use)
- Supabase can generate secure tokens server-side

**Implementation Pattern**:
```typescript
// Generate secure token
const token = crypto.randomUUID(); // Built-in, cryptographically secure

// Store with expiration
const invitation = {
  team_id,
  email,
  role,
  token,
  expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  created_at: new Date()
};
```

**Alternatives Considered**:
- JWT tokens → Rejected: Overkill for simple invitation, can't revoke easily
- Sequential IDs → Rejected: Guessable, security risk
- Email-based magic links → Rejected: Requires email service integration

---

### 3. Real-Time Team Updates

**Decision**: Use Supabase Realtime channels per team

**Rationale**:
- Constitutional requirement (Principle II): Real-time collaboration
- Supabase Realtime built-in, no additional infrastructure
- Automatic filtering via RLS policies
- Target: <1s latency (per spec SC-006)

**Implementation Pattern**:
```typescript
// Subscribe to team changes
const channel = supabase
  .channel(`team:${teamId}`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'team_members',
      filter: `team_id=eq.${teamId}`
    },
    (payload) => {
      // Update UI with new member data
      updateTeamMembers(payload.new);
    }
  )
  .subscribe();
```

**Alternatives Considered**:
- Polling → Rejected: Higher latency, more server load
- WebSockets from scratch → Rejected: Reinventing wheel, Supabase provides this
- Server-Sent Events → Rejected: Less feature-rich than Supabase Realtime

---

### 4. Team Ownership Transfer

**Decision**: Implement ownership transfer with validation

**Rationale**:
- Constitutional requirement: Users must own at least one team
- Prevents edge case: owner leaves team with no replacement
- Allows team continuity when owner changes

**Implementation Pattern**:
```typescript
async function transferOwnership(teamId: string, newOwnerId: string) {
  // Validate: new owner is team member
  // Validate: current user is owner
  // Update: old owner → admin role
  // Update: new owner → owner role
  // Atomic transaction to prevent race conditions
}
```

**Alternatives Considered**:
- Auto-transfer to oldest member → Rejected: Unpredictable, may not want ownership
- Prevent owner from leaving → Rejected: Too restrictive
- Delete team when owner leaves → Rejected: Loses team data

---

### 5. Onboarding Flow Integration

**Decision**: Auto-create team during onboarding, prompt for customization

**Rationale**:
- Constitutional requirement: Users must own at least one team
- Clarification decision: Auto-create with user's name + allow customization
- Blocks onboarding completion until team is created
- Seamless UX: user doesn't realize team creation is mandatory

**Implementation Pattern**:
```typescript
// After successful signup/OAuth
async function completeOnboarding(user: User) {
  // 1. Auto-create team with user's name
  const defaultTeamName = `${user.firstName}'s Team`;
  const team = await createTeam(user.id, defaultTeamName);
  
  // 2. Show onboarding page with team name input (pre-filled)
  // 3. User can customize or accept default
  // 4. Mark onboarding complete
  // 5. Redirect to dashboard
}
```

**Alternatives Considered**:
- Prompt before auto-create → Rejected: Adds friction, user might skip
- Silent background creation → Rejected: User unaware of team existence
- Force manual team creation → Rejected: Confusing UX, blocks onboarding

---

### 6. Permission Model (Owner/Admin/Member)

**Decision**: Three-tier role-based permissions

**Rationale**:
- Clarification decision: Owner, Admin, Member
- Owner: Full control (delete team, transfer ownership, all admin powers)
- Admin: Manage members, manage shoots, but can't delete team
- Member: View team, create shoots, participate

**Permission Matrix**:

| Action | Owner | Admin | Member |
|--------|-------|-------|--------|
| View team | ✅ | ✅ | ✅ |
| Create shoot | ✅ | ✅ | ✅ |
| Invite members | ✅ | ✅ | ❌ |
| Remove members | ✅ | ✅ | ❌ |
| Change member roles | ✅ | ✅ | ❌ |
| Edit team settings | ✅ | ✅ | ❌ |
| Delete team | ✅ | ❌ | ❌ |
| Transfer ownership | ✅ | ❌ | ❌ |

**Implementation Pattern**:
```typescript
// Permission check helper
function canManageMembers(userRole: TeamRole): boolean {
  return userRole === 'owner' || userRole === 'admin';
}

function canDeleteTeam(userRole: TeamRole): boolean {
  return userRole === 'owner';
}
```

**Alternatives Considered**:
- Five roles (owner/admin/coordinator/member/viewer) → Deferred: Too complex for MVP
- Two roles (owner/member) → Rejected: Not enough granularity for delegation
- Custom permissions per user → Rejected: Over-engineering for MVP

---

### 7. Team Member Metadata Tracking

**Decision**: Full metadata (role, timestamps, invited_by, last_active, custom_permissions)

**Rationale**:
- Clarification decision: Track comprehensive member data
- Enables future features: activity analytics, invitation chain, custom permissions
- Minimal storage cost, high future value
- Supports team engagement metrics

**Schema**:
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id),
  last_active TIMESTAMPTZ,
  custom_permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);
```

**Alternatives Considered**:
- Minimal (team_id, user_id, role) → Rejected: Loses valuable data
- Separate analytics table → Rejected: Adds complexity, data duplication
- No custom_permissions field → Rejected: Limits future extensibility

---

### 8. Invitation Email Handling

**Decision**: Use Supabase Auth email templates for invitations

**Rationale**:
- Supabase Auth already handles email delivery (per spec assumptions)
- Consistent with password reset emails (spec 020)
- No additional email service needed
- Customizable templates in Supabase dashboard

**Implementation Pattern**:
```typescript
// Send invitation email via Supabase
async function sendInvitation(email: string, teamName: string, token: string) {
  const inviteLink = `${APP_URL}/invite/${token}`;
  
  // Supabase handles email delivery
  // Template configured in Supabase dashboard
  // Variables: {{ .TeamName }}, {{ .InviteLink }}
}
```

**Alternatives Considered**:
- SendGrid/Mailgun → Rejected: Adds dependency, cost, complexity
- Manual SMTP → Rejected: Reliability issues, spam filtering
- No email, just in-app notifications → Rejected: Spec requires email (FR-004)

---

## Technology Stack Summary

**Frontend**:
- SvelteKit (SSR + client-side)
- TypeScript 5.x
- Existing UI components from spec 020

**Backend**:
- SvelteKit server routes (+page.server.ts)
- Supabase PostgreSQL
- Supabase Auth (existing from spec 020)
- Supabase Realtime

**Testing**:
- Vitest (unit tests)
- Playwright (E2E tests)
- Existing test infrastructure from spec 020

**Deployment**:
- Bun runtime
- Supabase hosted database
- Existing deployment pipeline

---

## Best Practices Applied

1. **Security First**: RLS policies for all team data
2. **Real-Time by Default**: Supabase Realtime for collaboration
3. **Type Safety**: TypeScript for all code
4. **Test-Driven**: Unit tests before implementation (constitutional requirement)
5. **Atomic Operations**: Database transactions for critical operations
6. **Idempotency**: Invitation acceptance can be retried safely
7. **Validation**: Server-side validation for all inputs
8. **Error Handling**: User-friendly error messages
9. **Performance**: Indexed queries, efficient RLS policies
10. **Scalability**: Supports 1000+ teams per user (per spec SC-007)

---

## Dependencies

**Existing Infrastructure** (from spec 020):
- ✅ Auth system (OAuth + email/password)
- ✅ Supabase client setup
- ✅ Session management
- ✅ Test infrastructure
- ✅ UI component library

**New Dependencies** (none):
- All required functionality provided by existing stack

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| RLS policy bugs leak data | High | Comprehensive unit tests, manual security review |
| Invitation token collisions | Low | Use crypto.randomUUID() (128-bit entropy) |
| Real-time subscription limits | Medium | Monitor Supabase usage, implement pagination |
| Onboarding flow confusion | Medium | Clear UI, tooltips, skip option with defaults |
| Team deletion edge cases | High | Validate ownership requirement, prevent last team deletion |

---

## Next Steps (Phase 1)

1. Generate data-model.md (database schema)
2. Generate API contracts (SvelteKit routes)
3. Generate quickstart.md (developer guide)
4. Update agent context with new technology decisions
