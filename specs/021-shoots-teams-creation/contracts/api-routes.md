# API Routes: Teams Creation

**Date**: October 20, 2025  
**Framework**: SvelteKit (file-based routing)  
**Pattern**: Server-side routes (+page.server.ts) with form actions

---

## Route Overview

| Route | Method | Purpose | Auth Required |
|-------|--------|---------|---------------|
| `/onboarding` | GET, POST | Complete onboarding with team creation | ✅ |
| `/teams` | GET | List user's teams | ✅ |
| `/teams/create` | GET, POST | Create new team | ✅ |
| `/teams/[teamId]` | GET | View team details | ✅ (member) |
| `/teams/[teamId]/settings` | GET, POST | Manage team settings and members | ✅ (owner/admin) |
| `/invite/[token]` | GET, POST | Accept team invitation | ✅ |

---

## 1. Onboarding Route

### `GET /onboarding`

**Purpose**: Display onboarding page with team creation form

**Auth**: Required (user must be logged in)

**Load Function** (`+page.server.ts`):
```typescript
export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    throw redirect(303, '/login');
  }
  
  // Check if user already completed onboarding
  const { data: profile } = await locals.supabase
    .from('user_profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single();
  
  if (profile?.onboarding_completed) {
    throw redirect(303, '/dashboard');
  }
  
  // Generate default team name
  const defaultTeamName = `${user.user_metadata.firstName || 'My'}'s Team`;
  
  return {
    user,
    defaultTeamName
  };
};
```

**Response**:
```typescript
{
  user: {
    id: string;
    email: string;
    user_metadata: {
      firstName?: string;
      lastName?: string;
    };
  };
  defaultTeamName: string; // e.g., "Jane's Team"
}
```

---

### `POST /onboarding`

**Purpose**: Create team and complete onboarding

**Form Action**:
```typescript
export const actions = {
  default: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    
    if (!user) {
      return fail(401, { error: 'Unauthorized' });
    }
    
    const formData = await request.formData();
    const teamName = formData.get('teamName') as string;
    
    // Validate team name
    if (!teamName || teamName.trim().length === 0) {
      return fail(400, { error: 'Team name is required' });
    }
    
    if (teamName.length > 100) {
      return fail(400, { error: 'Team name must be 100 characters or less' });
    }
    
    // Create team
    const { data: team, error: teamError } = await locals.supabase
      .from('teams')
      .insert({
        name: teamName.trim(),
        owner_id: user.id
      })
      .select()
      .single();
    
    if (teamError) {
      return fail(500, { error: 'Failed to create team' });
    }
    
    // Add user as owner in team_members
    const { error: memberError } = await locals.supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'owner'
      });
    
    if (memberError) {
      return fail(500, { error: 'Failed to add team member' });
    }
    
    // Mark onboarding as complete
    await locals.supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        onboarding_completed: true
      });
    
    throw redirect(303, '/dashboard');
  }
} satisfies Actions;
```

**Request Body**:
```typescript
{
  teamName: string; // 1-100 characters, required
}
```

**Success Response**: Redirect to `/dashboard`

**Error Responses**:
- `400`: Invalid team name
- `401`: Not authenticated
- `500`: Server error

---

## 2. Teams List Route

### `GET /teams`

**Purpose**: Display list of user's teams

**Auth**: Required

**Load Function**:
```typescript
export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    throw redirect(303, '/login');
  }
  
  // Get user's teams with member count
  const { data: teams, error } = await locals.supabase
    .from('teams')
    .select(`
      id,
      name,
      description,
      image_url,
      created_at,
      team_members!inner (
        role,
        user_id
      )
    `)
    .eq('team_members.user_id', user.id)
    .is('archived_at', null)
    .order('created_at', { ascending: false });
  
  if (error) {
    return fail(500, { error: 'Failed to load teams' });
  }
  
  // Get member counts for each team
  const teamsWithCounts = await Promise.all(
    teams.map(async (team) => {
      const { count } = await locals.supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', team.id);
      
      return {
        ...team,
        memberCount: count || 0,
        userRole: team.team_members[0].role
      };
    })
  );
  
  return {
    teams: teamsWithCounts
  };
};
```

**Response**:
```typescript
{
  teams: Array<{
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
    memberCount: number;
    userRole: 'owner' | 'admin' | 'member';
  }>;
}
```

---

## 3. Create Team Route

### `GET /teams/create`

**Purpose**: Display team creation form

**Auth**: Required

**Load Function**:
```typescript
export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    throw redirect(303, '/login');
  }
  
  return { user };
};
```

---

### `POST /teams/create`

**Purpose**: Create a new team

**Form Action**:
```typescript
export const actions = {
  default: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    
    if (!user) {
      return fail(401, { error: 'Unauthorized' });
    }
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    // Validate
    if (!name || name.trim().length === 0) {
      return fail(400, { error: 'Team name is required' });
    }
    
    if (name.length > 100) {
      return fail(400, { error: 'Team name must be 100 characters or less' });
    }
    
    if (description && description.length > 500) {
      return fail(400, { error: 'Description must be 500 characters or less' });
    }
    
    // Create team
    const { data: team, error: teamError } = await locals.supabase
      .from('teams')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        owner_id: user.id
      })
      .select()
      .single();
    
    if (teamError) {
      return fail(500, { error: 'Failed to create team' });
    }
    
    // Add user as owner
    const { error: memberError } = await locals.supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'owner'
      });
    
    if (memberError) {
      return fail(500, { error: 'Failed to add team member' });
    }
    
    throw redirect(303, `/teams/${team.id}`);
  }
} satisfies Actions;
```

**Request Body**:
```typescript
{
  name: string;        // 1-100 characters, required
  description?: string; // 0-500 characters, optional
}
```

**Success Response**: Redirect to `/teams/[teamId]`

**Error Responses**:
- `400`: Validation error
- `401`: Not authenticated
- `500`: Server error

---

## 4. Team Details Route

### `GET /teams/[teamId]`

**Purpose**: Display team details and members

**Auth**: Required (must be team member)

**Load Function**:
```typescript
export const load: PageServerLoad = async ({ params, locals }) => {
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    throw redirect(303, '/login');
  }
  
  const teamId = params.teamId;
  
  // Get team details
  const { data: team, error: teamError } = await locals.supabase
    .from('teams')
    .select('*')
    .eq('id', teamId)
    .is('archived_at', null)
    .single();
  
  if (teamError || !team) {
    throw error(404, 'Team not found');
  }
  
  // Get user's role in team
  const { data: membership } = await locals.supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single();
  
  if (!membership) {
    throw error(403, 'Access denied');
  }
  
  // Get team members
  const { data: members } = await locals.supabase
    .from('team_members')
    .select(`
      id,
      role,
      joined_at,
      last_active,
      user:user_id (
        id,
        email,
        user_metadata
      )
    `)
    .eq('team_id', teamId)
    .order('joined_at', { ascending: true });
  
  return {
    team,
    members,
    userRole: membership.role
  };
};
```

**Response**:
```typescript
{
  team: {
    id: string;
    name: string;
    description: string | null;
    owner_id: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
  };
  members: Array<{
    id: string;
    role: 'owner' | 'admin' | 'member';
    joined_at: string;
    last_active: string | null;
    user: {
      id: string;
      email: string;
      user_metadata: {
        firstName?: string;
        lastName?: string;
      };
    };
  }>;
  userRole: 'owner' | 'admin' | 'member';
}
```

---

## 5. Team Settings Route

### `GET /teams/[teamId]/settings`

**Purpose**: Display team settings and member management

**Auth**: Required (owner or admin)

**Load Function**:
```typescript
export const load: PageServerLoad = async ({ params, locals }) => {
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    throw redirect(303, '/login');
  }
  
  const teamId = params.teamId;
  
  // Check user role
  const { data: membership } = await locals.supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single();
  
  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    throw error(403, 'Access denied');
  }
  
  // Get team, members, and pending invitations
  const [teamResult, membersResult, invitationsResult] = await Promise.all([
    locals.supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single(),
    
    locals.supabase
      .from('team_members')
      .select(`
        id,
        role,
        joined_at,
        user:user_id (id, email, user_metadata)
      `)
      .eq('team_id', teamId),
    
    locals.supabase
      .from('team_invitations')
      .select('*')
      .eq('team_id', teamId)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
  ]);
  
  return {
    team: teamResult.data,
    members: membersResult.data,
    invitations: invitationsResult.data,
    userRole: membership.role
  };
};
```

---

### `POST /teams/[teamId]/settings`

**Purpose**: Update team settings, manage members, send invitations

**Form Actions**:
```typescript
export const actions = {
  updateTeam: async ({ request, params, locals }) => {
    // Update team name/description
    // Only owner can update
  },
  
  inviteMember: async ({ request, params, locals }) => {
    const { user } = await locals.safeGetSession();
    const teamId = params.teamId;
    
    // Check permission (owner or admin)
    const { data: membership } = await locals.supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();
    
    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return fail(403, { error: 'Access denied' });
    }
    
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const role = formData.get('role') as 'admin' | 'member';
    
    // Validate
    if (!email || !role) {
      return fail(400, { error: 'Email and role are required' });
    }
    
    if (!['admin', 'member'].includes(role)) {
      return fail(400, { error: 'Invalid role' });
    }
    
    // Check if user already member
    const { data: existingMember } = await locals.supabase
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', (
        await locals.supabase.auth.admin.getUserByEmail(email)
      ).data?.user?.id || '')
      .single();
    
    if (existingMember) {
      return fail(400, { error: 'User is already a team member' });
    }
    
    // Create invitation
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const { error: inviteError } = await locals.supabase
      .from('team_invitations')
      .insert({
        team_id: teamId,
        email,
        role,
        token,
        invited_by: user.id,
        expires_at: expiresAt.toISOString()
      });
    
    if (inviteError) {
      return fail(500, { error: 'Failed to create invitation' });
    }
    
    // TODO: Send invitation email
    
    return { success: true };
  },
  
  updateMemberRole: async ({ request, params, locals }) => {
    // Update member role (owner or admin only)
  },
  
  removeMember: async ({ request, params, locals }) => {
    // Remove member from team (owner or admin only)
  },
  
  cancelInvitation: async ({ request, params, locals }) => {
    // Cancel pending invitation (owner or admin only)
  },
  
  deleteTeam: async ({ request, params, locals }) => {
    // Delete team (owner only, validate not last owned team)
  }
} satisfies Actions;
```

---

## 6. Invitation Acceptance Route

### `GET /invite/[token]`

**Purpose**: Display invitation details

**Auth**: Required

**Load Function**:
```typescript
export const load: PageServerLoad = async ({ params, locals }) => {
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    throw redirect(303, `/login?redirect=/invite/${params.token}`);
  }
  
  const token = params.token;
  
  // Get invitation
  const { data: invitation, error } = await locals.supabase
    .from('team_invitations')
    .select(`
      id,
      email,
      role,
      expires_at,
      accepted_at,
      team:team_id (
        id,
        name,
        description
      )
    `)
    .eq('token', token)
    .single();
  
  if (error || !invitation) {
    throw error(404, 'Invitation not found');
  }
  
  // Check if expired
  if (new Date(invitation.expires_at) < new Date()) {
    return {
      invitation,
      expired: true
    };
  }
  
  // Check if already accepted
  if (invitation.accepted_at) {
    return {
      invitation,
      alreadyAccepted: true
    };
  }
  
  // Check if email matches
  if (invitation.email !== user.email) {
    return {
      invitation,
      emailMismatch: true
    };
  }
  
  return {
    invitation,
    expired: false,
    alreadyAccepted: false,
    emailMismatch: false
  };
};
```

---

### `POST /invite/[token]`

**Purpose**: Accept invitation and join team

**Form Action**:
```typescript
export const actions = {
  default: async ({ params, locals }) => {
    const { user } = await locals.safeGetSession();
    
    if (!user) {
      return fail(401, { error: 'Unauthorized' });
    }
    
    const token = params.token;
    
    // Get invitation
    const { data: invitation, error: inviteError } = await locals.supabase
      .from('team_invitations')
      .select('*')
      .eq('token', token)
      .single();
    
    if (inviteError || !invitation) {
      return fail(404, { error: 'Invitation not found' });
    }
    
    // Validate
    if (new Date(invitation.expires_at) < new Date()) {
      return fail(400, { error: 'Invitation expired' });
    }
    
    if (invitation.accepted_at) {
      return fail(400, { error: 'Invitation already accepted' });
    }
    
    if (invitation.email !== user.email) {
      return fail(400, { error: 'Email mismatch' });
    }
    
    // Add user to team
    const { error: memberError } = await locals.supabase
      .from('team_members')
      .insert({
        team_id: invitation.team_id,
        user_id: user.id,
        role: invitation.role,
        invited_by: invitation.invited_by
      });
    
    if (memberError) {
      return fail(500, { error: 'Failed to join team' });
    }
    
    // Mark invitation as accepted
    await locals.supabase
      .from('team_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitation.id);
    
    throw redirect(303, `/teams/${invitation.team_id}`);
  }
} satisfies Actions;
```

**Success Response**: Redirect to `/teams/[teamId]`

**Error Responses**:
- `400`: Expired, already accepted, or email mismatch
- `401`: Not authenticated
- `404`: Invitation not found
- `500`: Server error

---

## Error Handling

All routes follow consistent error handling:

```typescript
// 401 Unauthorized
if (!user) {
  throw redirect(303, '/login');
}

// 403 Forbidden
if (!hasPermission) {
  throw error(403, 'Access denied');
}

// 404 Not Found
if (!resource) {
  throw error(404, 'Resource not found');
}

// 500 Server Error
if (dbError) {
  return fail(500, { error: 'Server error' });
}
```

---

## Real-Time Subscriptions

Teams use Supabase Realtime for live updates:

```typescript
// Subscribe to team member changes
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
      invalidate('app:team-members');
    }
  )
  .subscribe();
```

---

## Security

1. **Authentication**: All routes require authenticated user
2. **Authorization**: RLS policies enforce team membership
3. **CSRF Protection**: SvelteKit form actions include CSRF tokens
4. **Input Validation**: Server-side validation for all inputs
5. **SQL Injection**: Supabase client prevents SQL injection
6. **XSS Protection**: SvelteKit auto-escapes HTML

---

## Performance

1. **Caching**: Use SvelteKit's `load` function caching
2. **Pagination**: Implement for teams list (1000+ teams)
3. **Lazy Loading**: Load team members on demand
4. **Optimistic Updates**: Update UI before server confirmation
5. **Debouncing**: Debounce search/filter inputs
