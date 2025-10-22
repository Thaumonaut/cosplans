# Quickstart: Teams Creation

**Date**: October 20, 2025  
**Feature**: Teams Creation (MVP)  
**Estimated Time**: 2-3 hours implementation

---

## Overview

This guide walks through implementing team creation and management to unblock user onboarding. After completion, users will be able to create teams, invite members, and satisfy the constitutional requirement that every user must own at least one team.

---

## Prerequisites

✅ **Completed**:
- Auth system (spec 020) with OAuth and email/password
- Supabase client setup with SSR
- Test infrastructure (Vitest + Playwright)

⏳ **Required**:
- Database migration for teams tables
- Onboarding page implementation
- Team management UI components

---

## Implementation Steps

### Step 1: Database Migration (15 minutes)

Create `database/migrations/004_teams_schema.sql`:

```sql
-- Create teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  description TEXT CHECK (length(description) <= 500),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  image_url TEXT,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_active TIMESTAMPTZ,
  custom_permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Create team_invitations table
CREATE TABLE team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  token TEXT NOT NULL UNIQUE,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL CHECK (expires_at > created_at),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_teams_owner_id ON teams(owner_id);
CREATE INDEX idx_teams_archived_at ON teams(archived_at) WHERE archived_at IS NULL;
CREATE UNIQUE INDEX idx_team_members_unique ON team_members(team_id, user_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE UNIQUE INDEX idx_team_invitations_token ON team_invitations(token);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
CREATE POLICY "Users can view their teams" ON teams FOR SELECT
  USING (id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can create teams" ON teams FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their teams" ON teams FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their teams" ON teams FOR DELETE
  USING (owner_id = auth.uid());

-- RLS Policies for team_members
CREATE POLICY "Users can view team members" ON team_members FOR SELECT
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Owners and admins can add members" ON team_members FOR INSERT
  WITH CHECK (team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

CREATE POLICY "Owners and admins can update members" ON team_members FOR UPDATE
  USING (team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

CREATE POLICY "Owners and admins can remove members" ON team_members FOR DELETE
  USING (team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- RLS Policies for team_invitations
CREATE POLICY "Users can view team invitations" ON team_invitations FOR SELECT
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Owners and admins can create invitations" ON team_invitations FOR INSERT
  WITH CHECK (team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

CREATE POLICY "Anyone can accept invitations" ON team_invitations FOR UPDATE
  USING (true) WITH CHECK (accepted_at IS NOT NULL);

CREATE POLICY "Owners and admins can cancel invitations" ON team_invitations FOR DELETE
  USING (team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Run migration**:
```powershell
# Apply to local Supabase
supabase db push

# Or apply to hosted Supabase
psql $DATABASE_URL -f database/migrations/004_teams_schema.sql
```

---

### Step 2: TypeScript Types (10 minutes)

Create `src/lib/types/teams.ts`:

```typescript
export type TeamRole = 'owner' | 'admin' | 'member';
export type InvitationRole = 'admin' | 'member';

export interface Team {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  image_url: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  joined_at: string;
  invited_by: string | null;
  last_active: string | null;
  custom_permissions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  email: string;
  role: InvitationRole;
  token: string;
  invited_by: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

export interface TeamWithMembers extends Team {
  members: TeamMember[];
  memberCount: number;
  userRole: TeamRole;
}
```

---

### Step 3: Team Service (30 minutes)

Create `src/lib/server/teams/team-service.ts`:

```typescript
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Team, TeamMember, TeamRole } from '$lib/types/teams';

export class TeamService {
  constructor(private supabase: SupabaseClient) {}

  async createTeam(userId: string, name: string, description?: string): Promise<Team> {
    // Create team
    const { data: team, error: teamError } = await this.supabase
      .from('teams')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        owner_id: userId
      })
      .select()
      .single();

    if (teamError) throw teamError;

    // Add user as owner
    const { error: memberError } = await this.supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: userId,
        role: 'owner'
      });

    if (memberError) throw memberError;

    return team;
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    const { data, error } = await this.supabase
      .from('teams')
      .select('*')
      .in('id', (
        await this.supabase
          .from('team_members')
          .select('team_id')
          .eq('user_id', userId)
      ).data?.map(m => m.team_id) || [])
      .is('archived_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    const { data, error } = await this.supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .is('archived_at', null)
      .single();

    if (error) return null;
    return data;
  }

  async getUserRole(teamId: string, userId: string): Promise<TeamRole | null> {
    const { data, error } = await this.supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data.role as TeamRole;
  }

  async canDeleteTeam(userId: string, teamId: string): Promise<boolean> {
    // Check if user owns other teams
    const { data } = await this.supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', userId)
      .eq('role', 'owner')
      .neq('team_id', teamId);

    return (data?.length || 0) > 0;
  }

  async deleteTeam(teamId: string): Promise<void> {
    const { error } = await this.supabase
      .from('teams')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', teamId);

    if (error) throw error;
  }
}
```

---

### Step 4: Onboarding Page (45 minutes)

Create `src/routes/onboarding/+page.svelte`:

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  export let data: PageData;

  let teamName = data.defaultTeamName;
  let loading = false;
</script>

<div class="onboarding-container">
  <h1>Welcome to Cosplans!</h1>
  <p>Let's create your first team to get started.</p>

  <form method="POST" use:enhance={() => {
    loading = true;
    return async ({ update }) => {
      await update();
      loading = false;
    };
  }}>
    <label for="teamName">
      Team Name
      <input
        type="text"
        id="teamName"
        name="teamName"
        bind:value={teamName}
        required
        maxlength="100"
        placeholder="Enter your team name"
        disabled={loading}
      />
    </label>

    <button type="submit" disabled={loading}>
      {loading ? 'Creating...' : 'Create Team & Continue'}
    </button>
  </form>
</div>

<style>
  .onboarding-container {
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 2rem;
  }

  label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  input {
    display: block;
    width: 100%;
    padding: 0.75rem;
    margin-top: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.375rem;
    font-size: 1rem;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background: #4285F4;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
  }

  button:hover:not(:disabled) {
    background: #3367D6;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
```

Create `src/routes/onboarding/+page.server.ts`:

```typescript
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { TeamService } from '$lib/server/teams/team-service';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    throw redirect(303, '/login');
  }

  // Check if onboarding already complete
  const { data: profile } = await locals.supabase
    .from('user_profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single();

  if (profile?.onboarding_completed) {
    throw redirect(303, '/dashboard');
  }

  const defaultTeamName = `${user.user_metadata.firstName || 'My'}'s Team`;

  return {
    user,
    defaultTeamName
  };
};

export const actions = {
  default: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    const teamName = formData.get('teamName') as string;

    // Validate
    if (!teamName || teamName.trim().length === 0) {
      return fail(400, { error: 'Team name is required' });
    }

    if (teamName.length > 100) {
      return fail(400, { error: 'Team name must be 100 characters or less' });
    }

    try {
      // Create team
      const teamService = new TeamService(locals.supabase);
      await teamService.createTeam(user.id, teamName);

      // Mark onboarding complete
      await locals.supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          onboarding_completed: true
        });

      throw redirect(303, '/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      return fail(500, { error: 'Failed to create team' });
    }
  }
} satisfies Actions;
```

---

### Step 5: Update Auth Callback (10 minutes)

Update `src/routes/auth/callback/+server.ts` to redirect to onboarding:

```typescript
// After successful OAuth/signup
// Check if onboarding complete
const { data: profile } = await supabase
  .from('user_profiles')
  .select('onboarding_completed')
  .eq('id', user.id)
  .single();

if (!profile?.onboarding_completed) {
  throw redirect(302, '/onboarding');
}

throw redirect(302, '/dashboard');
```

---

### Step 6: Testing (30 minutes)

Create `tests/unit/teams/team-service.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { TeamService } from '$lib/server/teams/team-service';
import { createClient } from '@supabase/supabase-js';

describe('TeamService', () => {
  let teamService: TeamService;
  let supabase: any;

  beforeEach(() => {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    );
    teamService = new TeamService(supabase);
  });

  it('should create a team with owner', async () => {
    const userId = 'test-user-id';
    const teamName = 'Test Team';

    const team = await teamService.createTeam(userId, teamName);

    expect(team.name).toBe(teamName);
    expect(team.owner_id).toBe(userId);
  });

  it('should prevent deletion of last owned team', async () => {
    const userId = 'test-user-id';
    const teamId = 'test-team-id';

    const canDelete = await teamService.canDeleteTeam(userId, teamId);

    expect(canDelete).toBe(false);
  });
});
```

---

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] User can complete onboarding and create team
- [ ] Team appears in user's team list
- [ ] User is set as team owner
- [ ] Onboarding redirects to dashboard after completion
- [ ] Cannot access onboarding after completion
- [ ] RLS policies prevent unauthorized access
- [ ] Unit tests pass for team service

---

## Next Steps

After teams MVP is complete:

1. **Team Invitations**: Implement invitation flow
2. **Team Settings**: Add team management UI
3. **Member Management**: Add/remove members, change roles
4. **Shoots Feature**: Add shoot creation (deferred from this phase)

---

## Troubleshooting

**Issue**: Migration fails with "relation already exists"
- **Solution**: Drop tables and re-run migration

**Issue**: RLS policies block legitimate access
- **Solution**: Check `auth.uid()` returns correct user ID

**Issue**: Onboarding loops back to itself
- **Solution**: Verify `onboarding_completed` flag is set

**Issue**: Team creation fails silently
- **Solution**: Check Supabase logs for RLS policy violations

---

## Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [SvelteKit Form Actions](https://kit.svelte.dev/docs/form-actions)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
