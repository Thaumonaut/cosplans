# Security Checklist: Teams Creation

**Feature**: Teams Creation (021-shoots-teams-creation)  
**Date**: October 20, 2025

---

## Authentication & Authorization

- [ ] All team endpoints require authentication
- [ ] User identity verified via Supabase auth token
- [ ] Session tokens validated on every request
- [ ] Expired sessions redirect to login
- [ ] CSRF protection enabled on all forms
- [ ] Rate limiting applied to team creation
- [ ] Rate limiting applied to invitation sending

## Row Level Security (RLS)

### Teams Table

- [ ] Users can only SELECT teams they're members of
- [ ] Users can only INSERT teams (auto-assigned as owner)
- [ ] Only owners can UPDATE their teams
- [ ] Only owners can DELETE (soft delete) their teams
- [ ] RLS policies tested with multiple user accounts
- [ ] RLS policies prevent cross-team data leaks

### Team Members Table

- [ ] Users can only SELECT members of their teams
- [ ] Only owners/admins can INSERT new members
- [ ] Only owners/admins can UPDATE member roles
- [ ] Only owners/admins can DELETE members
- [ ] Users cannot modify their own owner role
- [ ] RLS policies enforce role hierarchy

### Team Invitations Table

- [ ] Users can only SELECT invitations for their teams
- [ ] Only owners/admins can INSERT invitations
- [ ] Only owners/admins can UPDATE invitation status
- [ ] Only owners/admins can DELETE invitations
- [ ] Invitation tokens are not exposed in SELECT queries
- [ ] RLS policies prevent invitation enumeration

## Input Validation

### Team Creation

- [ ] Team name sanitized against XSS
- [ ] Team name length validated (1-100 chars)
- [ ] Team description sanitized against XSS
- [ ] Team description length validated (0-500 chars)
- [ ] Special characters properly escaped
- [ ] Unicode characters handled correctly
- [ ] SQL injection attempts blocked

### Invitation Creation

- [ ] Email format validated
- [ ] Email sanitized against injection
- [ ] Role validated against allowed values
- [ ] Duplicate invitations handled safely
- [ ] Self-invitation prevented
- [ ] Invalid team IDs rejected

### Member Management

- [ ] Role changes validated against allowed values
- [ ] User IDs validated before operations
- [ ] Team IDs validated before operations
- [ ] Owner role cannot be removed
- [ ] Last owner cannot be removed

## Token Security

- [ ] Invitation tokens use crypto.randomUUID()
- [ ] Tokens are at least 128 bits of entropy
- [ ] Tokens stored securely in database
- [ ] Tokens expire after 7 days
- [ ] Expired tokens cannot be used
- [ ] Used tokens cannot be reused
- [ ] Token validation prevents timing attacks
- [ ] Tokens transmitted only over HTTPS

## Data Privacy

- [ ] User emails not exposed to non-team members
- [ ] Team member data only visible to team members
- [ ] Pending invitations only visible to team admins
- [ ] Deleted teams data properly archived
- [ ] Personal data deletion complies with GDPR
- [ ] Audit logs track sensitive operations

## API Security

- [ ] All endpoints use HTTPS only
- [ ] API responses don't leak sensitive data
- [ ] Error messages don't reveal system details
- [ ] Stack traces disabled in production
- [ ] Database connection strings not exposed
- [ ] Environment variables properly secured
- [ ] No hardcoded secrets in code

## Constitutional Compliance

- [ ] Every user MUST own at least one team (Principle II.5)
- [ ] Last owned team cannot be deleted
- [ ] Database constraint enforces team ownership
- [ ] Onboarding blocks until team created
- [ ] Team ownership validated on all operations

## Vulnerability Prevention

- [ ] No direct object references (use UUIDs)
- [ ] Mass assignment vulnerabilities prevented
- [ ] File upload vulnerabilities N/A (no uploads yet)
- [ ] Clickjacking protection enabled
- [ ] Content Security Policy configured
- [ ] Secure headers set (X-Frame-Options, etc.)
- [ ] Dependencies scanned for vulnerabilities

## Audit & Monitoring

- [ ] Failed authentication attempts logged
- [ ] Unauthorized access attempts logged
- [ ] Team creation events logged
- [ ] Member changes logged with actor
- [ ] Invitation acceptance logged
- [ ] Suspicious activity alerts configured
- [ ] Security logs retained per policy
