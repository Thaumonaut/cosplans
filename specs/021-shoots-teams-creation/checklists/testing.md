# Testing Checklist: Teams Creation

**Feature**: Teams Creation (021-shoots-teams-creation)  
**Date**: October 20, 2025

---

## Unit Tests (Vitest)

### TeamService Tests

- [ ] `createTeam()` creates team with correct data
- [ ] `createTeam()` sets creator as owner automatically
- [ ] `createTeam()` validates team name length (1-100 chars)
- [ ] `createTeam()` validates description length (0-500 chars)
- [ ] `getUserTeams()` returns only user's teams
- [ ] `getUserTeams()` excludes archived teams by default
- [ ] `getTeamById()` returns team with member data
- [ ] `getTeamById()` returns null for non-existent team
- [ ] `canDeleteTeam()` prevents deletion of last owned team
- [ ] `canDeleteTeam()` allows deletion when user owns other teams

### InvitationService Tests

- [ ] `createInvitation()` generates secure random token
- [ ] `createInvitation()` sets expiration to 7 days
- [ ] `createInvitation()` prevents self-invitation
- [ ] `createInvitation()` allows duplicate emails (different teams)
- [ ] `acceptInvitation()` validates token exists
- [ ] `acceptInvitation()` validates token not expired
- [ ] `acceptInvitation()` validates token not already accepted
- [ ] `acceptInvitation()` adds user to team_members
- [ ] `acceptInvitation()` marks invitation as accepted
- [ ] `acceptInvitation()` handles non-existent user emails

### Permission Tests

- [ ] `canManageMembers()` returns true for owners
- [ ] `canManageMembers()` returns true for admins
- [ ] `canManageMembers()` returns false for regular members
- [ ] `canDeleteTeam()` returns true for owners only
- [ ] `canTransferOwnership()` returns true for owners only

## Integration Tests

### Team Creation Flow

- [ ] User creates team → team appears in database
- [ ] User creates team → user is added as owner in team_members
- [ ] User creates team → team appears in teams list
- [ ] Multiple users can create teams with same name
- [ ] Team creation fails with invalid data

### Invitation Flow

- [ ] Owner creates invitation → invitation stored in database
- [ ] Invitation email is sent (mock email service)
- [ ] Invitee accepts invitation → added to team_members
- [ ] Invitee accepts invitation → invitation marked accepted
- [ ] Expired invitation cannot be accepted
- [ ] Already accepted invitation cannot be reused
- [ ] Non-existent user invitation creates pending record
- [ ] New user signup auto-accepts pending invitations

### Real-Time Updates

- [ ] Member added → all team members receive update
- [ ] Member removed → all team members receive update
- [ ] Role changed → all team members receive update
- [ ] Update latency is <1 second
- [ ] Reconnection works after network interruption

## E2E Tests (Playwright)

### Onboarding Flow

- [ ] New user completes signup → redirected to onboarding
- [ ] User enters team name → team created successfully
- [ ] User skips onboarding → auto-generated team created
- [ ] User completes onboarding → redirected to dashboard
- [ ] Returning user → not shown onboarding again

### Team Creation

- [ ] User navigates to create team page
- [ ] User fills form with valid data → team created
- [ ] User submits empty name → validation error shown
- [ ] User submits name >100 chars → validation error shown
- [ ] Created team appears in teams list immediately

### Team Navigation

- [ ] User views teams list → all teams displayed
- [ ] User clicks team → team details page loads
- [ ] User searches teams → filtered results shown
- [ ] User with 100+ teams → pagination works

### Invitation Flow

- [ ] Owner clicks invite → form displayed
- [ ] Owner enters email and role → invitation sent
- [ ] Pending invitation appears in settings
- [ ] Invitee clicks email link → acceptance page loads
- [ ] Invitee accepts → added to team successfully
- [ ] Invitee sees team in their teams list

### Member Management

- [ ] Owner views team settings → member list shown
- [ ] Owner changes member role → role updated immediately
- [ ] Owner removes member → member removed from list
- [ ] Removed member cannot access team
- [ ] Owner cancels pending invitation → invitation removed

### Permission Enforcement

- [ ] Regular member cannot access team settings
- [ ] Regular member cannot invite others
- [ ] Regular member cannot change roles
- [ ] Admin can invite and manage members
- [ ] Only owner can delete team

## Performance Tests

- [ ] Team creation completes in <500ms
- [ ] Team list loads in <1s with 100 teams
- [ ] Team details loads in <500ms
- [ ] Invitation acceptance completes in <500ms
- [ ] Real-time updates arrive in <1s
- [ ] Search/filter responds in <100ms

## Security Tests

- [ ] User cannot view teams they're not member of
- [ ] User cannot invite to teams they're not owner/admin of
- [ ] User cannot modify other users' teams
- [ ] RLS policies prevent unauthorized data access
- [ ] Invitation tokens are cryptographically secure
- [ ] Expired invitations cannot be accepted
- [ ] SQL injection attempts are blocked
- [ ] XSS attempts are sanitized

## Edge Cases

- [ ] User creates team with Unicode characters
- [ ] User creates team with special characters
- [ ] User is invited to team they already own
- [ ] User tries to delete their last owned team
- [ ] All team members are removed (empty team)
- [ ] User is member of 1000+ teams
- [ ] Multiple invitations to same email
- [ ] Invitation accepted after team is deleted
- [ ] Network failure during team creation
- [ ] Concurrent role changes by multiple admins
