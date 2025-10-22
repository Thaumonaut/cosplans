# UX Checklist: Teams Creation

**Feature**: Teams Creation (021-shoots-teams-creation)  
**Date**: October 20, 2025

---

## Onboarding Experience

- [ ] User is redirected to onboarding after first signup
- [ ] Team name input is pre-filled with user's name
- [ ] User can customize team name before submission
- [ ] "Skip for now" option creates team with auto-generated name
- [ ] Success message confirms team creation
- [ ] User is redirected to dashboard after completion
- [ ] Onboarding cannot be accessed again after completion

## Team Creation Flow

- [ ] "Create Team" button is prominently displayed
- [ ] Team creation form has clear labels and placeholders
- [ ] Team name field shows character count (max 100)
- [ ] Description field shows character count (max 500)
- [ ] Form validation shows inline error messages
- [ ] Submit button shows loading state during creation
- [ ] Success notification appears after team creation
- [ ] User is redirected to new team page after creation
- [ ] Newly created team appears in teams list immediately

## Team List & Navigation

- [ ] Teams list shows all user's teams with member counts
- [ ] Team cards display name, description preview, and member count
- [ ] User's role badge is visible on each team card
- [ ] Empty state message shown when user has no teams
- [ ] Teams are sorted by most recently created first
- [ ] Search/filter input filters teams in real-time
- [ ] Pagination controls appear for 20+ teams
- [ ] Loading skeleton shown while teams are loading

## Team Details Page

- [ ] Team name and description are prominently displayed
- [ ] Member list shows all team members with roles
- [ ] User's own role is clearly indicated
- [ ] Owner badge is visually distinct from other roles
- [ ] "Invite Members" button visible to owners/admins only
- [ ] "Team Settings" link visible to owners/admins only
- [ ] Empty member list shows helpful message

## Invitation Flow

- [ ] Invite form has email input with validation
- [ ] Role selector shows clear descriptions for each role
- [ ] Submit button shows loading state during invitation
- [ ] Success message confirms invitation sent
- [ ] Pending invitations appear in team settings immediately
- [ ] Invitation email contains clear call-to-action
- [ ] Invitation acceptance page shows team details
- [ ] Acceptance confirmation shows success message
- [ ] User is redirected to team page after acceptance

## Team Settings

- [ ] Settings page clearly organized into sections
- [ ] Member list shows all members with role badges
- [ ] Pending invitations section shows expiration dates
- [ ] Role change dropdown is intuitive and accessible
- [ ] Remove member action requires confirmation
- [ ] Cancel invitation action requires confirmation
- [ ] All actions show loading states
- [ ] Success/error messages are clear and actionable

## Error Handling

- [ ] Network errors show user-friendly messages
- [ ] Validation errors are specific and helpful
- [ ] Permission errors explain why action was denied
- [ ] Expired invitation shows clear message with re-invite option
- [ ] Self-invite attempt shows helpful error message
- [ ] Last team deletion attempt shows constitutional warning
- [ ] All errors include suggested next steps

## Responsive Design

- [ ] All pages work on mobile (320px+)
- [ ] Touch targets are at least 44x44px
- [ ] Forms are easy to fill on mobile keyboards
- [ ] Navigation is accessible on small screens
- [ ] Tables/lists are scrollable on mobile
- [ ] Modals/dialogs fit mobile viewports

## Loading & Performance

- [ ] Initial page load shows skeleton/loading state
- [ ] Optimistic UI updates for instant feedback
- [ ] Real-time updates appear smoothly (no jarring changes)
- [ ] Large team lists load progressively
- [ ] Images lazy load when scrolling
- [ ] No layout shift during content loading

## Accessibility

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible and clear
- [ ] Screen reader announcements for dynamic content
- [ ] Form labels are properly associated
- [ ] Error messages are announced to screen readers
- [ ] Color is not the only indicator of state
- [ ] Sufficient color contrast (WCAG AA minimum)
