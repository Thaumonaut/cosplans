# Implementation Plan: User Authentication & Account Management

**Branch**: `020-user-authentication` | **Date**: October 16, 2025 | **Spec**: [020-user-authentication/spec.md](../spec.md)

**Input**: Feature specification from `/specs/020-user-authentication/spec.md`

## Summary

User authentication and account management is the foundational system enabling all other Cosplans features. This implementation provides secure user registration, login/logout, password reset, profile management, and session handling via email/password credentials. Infrastructure supports future OAuth2 integration without requiring code changes to core auth logic.

**Technical Approach**: Use Supabase Auth (PostgreSQL-backed authentication with built-in RLS) for backend, SvelteKit form actions for server-side validation, and Zod for schema validation. Authentication flow is server-first (no client-side token management) to prevent XSS attacks. Sessions use HTTP-only cookies with CSRF protection.

---

## Technical Context

**Language/Version**: TypeScript, Node.js 20+ (SvelteKit runtime)  
**Primary Dependencies**: 
- SvelteKit (web framework with API routes)
- Supabase Auth (managed authentication, PostgreSQL database)
- Zod (runtime schema validation)
- sveltekit-superforms (form state management + server-side validation)

**Storage**: PostgreSQL (via Supabase) for users, sessions, password reset tokens, audit logs  
**Testing**: Vitest (unit tests), Playwright (E2E tests), MSW (API mocking)  
**Target Platform**: Web (responsive design, mobile-friendly forms); foundation for Flutter mobile in Phase 2  
**Project Type**: Web application (SvelteKit + backend)  
**Performance Goals**: 
- Signup validation: < 100ms response time
- Login: < 500ms including session creation
- Session token validation: < 50ms per request
- Email delivery: 99.9% within 60 seconds

**Constraints**: 
- All passwords must be hashed (bcrypt/argon2), never stored plaintext
- All auth operations must use HTTPS only
- Session tokens must be HTTP-only cookies (no JavaScript access)
- Failed login attempts must be rate-limited (5 attempts before 15-min lockout)

**Scale/Scope**: 
- Support 10k+ concurrent users
- 1000 signups/day during launch period
- Session validation on every request (must be sub-50ms)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| **I. Web-First Responsive** | Auth UI must be mobile-responsive, touch-friendly | ✅ PASS | Forms designed for 320px+ screens, 44px+ touch targets |
| **II. Real-Time Collab** | Auth doesn't directly enable real-time, but enables user identification | ✅ PASS | User context required for all real-time features |
| **III. External Integration Integrity** | Auth enables OAuth2 for Google/Instagram future integration | ✅ PASS | Architecture supports OAuth2 without core changes |
| **IV. Customizable Workflows** | Not applicable to auth | ✅ N/A | Auth is generic, not workflow-specific |
| **V. Visual-First Content** | Auth doesn't involve content management | ✅ N/A | Auth is metadata-only (user profile) |
| **VI. Test-Driven Development** | All features must have tests before implementation | ✅ PASS | Auth tests must cover signup, login, reset flows |
| **VII. Team Roles & Permissions** | Auth identifies users; permissions implemented separately | ✅ PASS | User identity is prerequisite for permission checks |
| **VIII. Creator Community** | Public creator profiles built on auth foundation | ✅ PASS | Creator signup handled in this spec |
| **Security & Privacy** | HTTPS, password hashing, GDPR deletion, audit logs | ✅ PASS | All required; covered in implementation |
| **Analytics & Ethical Data** | Auth events logged for analytics, PII not tracked | ✅ PASS | Heuristics: login success/failure rates, signup completion rates |

**GATE STATUS**: ✅ **PASS** - No principle violations. Authentication is foundational, generic, and enables all downstream features.

---

## Project Structure

### Documentation (this feature)

```
specs/020-user-authentication/
├── spec.md                      # Feature specification
├── plan.md                      # This file (Phase 1 planning output)
├── research.md                  # Phase 0 output (technology decisions, password hashing, email service selection)
├── data-model.md                # Phase 1 output (schema, entities, relationships)
├── quickstart.md                # Phase 1 output (local setup, running tests, deployment steps)
├── contracts/                   # Phase 1 output (API contracts)
│   ├── auth-api.openapi.json   # OpenAPI spec for auth endpoints
│   └── database-schema.sql      # PostgreSQL schema (users, sessions, password_reset, audit_logs)
└── tasks.md                     # Phase 2 output (detailed implementation tasks, point estimates)
```

### Source Code (repository root)

```
cosplans/
├── src/
│   ├── routes/
│   │   ├── auth/
│   │   │   ├── signup/
│   │   │   │   ├── +page.svelte       # Signup form (UI)
│   │   │   │   └── +page.server.ts    # Signup action (server-side validation)
│   │   │   ├── login/
│   │   │   │   ├── +page.svelte       # Login form (UI)
│   │   │   │   └── +page.server.ts    # Login action (server-side validation)
│   │   │   ├── forgot-password/
│   │   │   │   ├── +page.svelte       # Password reset form
│   │   │   │   └── +page.server.ts    # Reset token generation
│   │   │   ├── reset-password/
│   │   │   │   ├── +page.svelte       # New password form
│   │   │   │   └── +page.server.ts    # Password update
│   │   │   ├── logout/
│   │   │   │   └── +server.ts         # Logout endpoint
│   │   │   └── verify-email/
│   │   │       └── +server.ts         # Email verification endpoint
│   │   ├── account/
│   │   │   ├── profile/
│   │   │   │   ├── +page.svelte       # Profile view/edit
│   │   │   │   └── +page.server.ts    # Profile update action
│   │   │   ├── settings/
│   │   │   │   ├── +page.svelte       # Settings page
│   │   │   │   └── +page.server.ts    # Settings updates
│   │   │   └── delete/
│   │   │       ├── +page.svelte       # Account deletion confirmation
│   │   │       └── +page.server.ts    # Deletion action
│   │   └── +layout.server.ts          # Load user context on every route
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── supabase.ts            # Supabase client configuration
│   │   │   ├── passwords.ts           # Password hashing utilities (wrapper around Supabase)
│   │   │   ├── sessions.ts            # Session creation/validation
│   │   │   ├── email.ts               # Email sending (verification, reset)
│   │   │   └── audit.ts               # Audit logging for auth events
│   │   ├── validators/
│   │   │   └── auth.ts                # Zod schemas for signup/login/reset validation
│   │   ├── db/
│   │   │   ├── schema.ts              # TypeScript interfaces matching DB schema
│   │   │   └── queries/
│   │   │       └── auth.ts            # Database queries (find user, create user, etc.)
│   │   └── components/
│   │       └── auth/
│   │           ├── LoginForm.svelte   # Reusable login form component
│   │           ├── SignupForm.svelte  # Reusable signup form component
│   │           └── AuthGuard.svelte   # Redirect to login if not authenticated
│   └── hooks.server.ts                # SvelteKit server hooks for session validation
├── tests/
│   ├── unit/
│   │   └── auth/
│   │       ├── password-validation.test.ts      # Test password hashing
│   │       ├── email-validation.test.ts         # Test email format validation
│   │       └── session-management.test.ts       # Test session creation/expiry
│   ├── integration/
│   │   └── auth/
│   │       ├── signup.test.ts                   # Test full signup flow
│   │       ├── login.test.ts                    # Test full login flow
│   │       ├── password-reset.test.ts           # Test password reset flow
│   │       ├── session-validation.test.ts       # Test session on protected routes
│   │       └── rate-limiting.test.ts            # Test login attempt rate limiting
│   └── e2e/
│       └── auth/
│           ├── signup-flow.spec.ts              # E2E: User signup → email verification → login
│           ├── login-flow.spec.ts               # E2E: User login → dashboard access
│           ├── password-reset.spec.ts           # E2E: Forgot password → reset → login
│           └── permission-check.spec.ts         # E2E: Unauthorized user redirected to login
├── migrations/
│   └── 001_auth_schema.sql             # Database schema (users, sessions, password_reset, audit_logs)
├── .env.example                        # Example environment variables (SUPABASE_URL, SENDGRID_API_KEY)
└── package.json                        # Dependencies (sveltekit, zod, supabase-js, etc.)
```

**Structure Decision**: Single SvelteKit project with server-side auth routes and centralized auth utilities. Supabase Auth manages password hashing and session tokens; application layer handles form validation (Zod), API contracts, and audit logging. Database schema includes user profiles, sessions, password reset tokens, and audit logs. All auth operations are server-side (no client-side JWT manipulation) to prevent XSS attacks.

---

## Complexity Tracking

| Consideration | Decision | Rationale |
|---|---|---|
| **Password Hashing** | Use Supabase Auth (abstracts bcrypt) | Supabase handles password hashing; we never see plaintext passwords. Avoids custom crypto implementation bugs. |
| **Session Management** | HTTP-only cookies + server-side validation | Prevents XSS token theft. SvelteKit's session handling is built-in. |
| **Email Delivery** | Supabase Auth built-in + SendGrid fallback | Supabase provides free email tier; SendGrid available for high volume. Decouples auth from email service. |
| **CSRF Protection** | SvelteKit form actions (built-in) | SvelteKit automatically includes CSRF tokens in form submissions. No custom implementation needed. |
| **Rate Limiting** | Database check + Redis cache (optional Phase 2) | Simple implementation: query failed_login_attempts, increment, check 5-attempt threshold. Redis optional for sub-10ms response. |
| **Audit Logging** | Separate audit_logs table | Audit events (login success, failed attempt, password reset) logged for security review. |

---

## Implementation Approach

### Phase 0: Research (Complete by Day 3)

**Research Tasks**:
1. Evaluate Supabase Auth vs. custom implementation vs. Auth0 (DECISION: Supabase Auth)
2. Password hashing algorithm selection: bcrypt vs. Argon2 (DECISION: Supabase default bcrypt)
3. Email service options: Supabase, SendGrid, AWS SES (DECISION: Supabase primary, SendGrid fallback)
4. Session storage: HTTP-only cookies vs. database (DECISION: HTTP-only cookies + Supabase session table)
5. Rate limiting implementation: database vs. Redis vs. in-memory (DECISION: database for MVP, Redis in Phase 2)
6. CSRF protection in SvelteKit (DECISION: use built-in form action protection)

**Output**: `research.md` with technology decisions and rationale

### Phase 1: Design & Data Model (Complete by Day 8)

**1. Data Model**:
- User table: id, email, password_hash, first_name, last_name, avatar_url, bio, created_at, updated_at, deactivated_at, verified_at
- AuthSession table: id, user_id, token, created_at, expires_at, last_activity_at, ip_address, user_agent
- PasswordReset table: id, user_id, token, created_at, expires_at, used_at
- AuditLog table: id, user_id, event_type, ip_address, user_agent, created_at
- Indexes: ON users(email), ON auth_session(user_id), ON password_reset(token), ON audit_log(user_id, created_at)

**Output**: `data-model.md` with schema, relationships, and validation rules

**2. API Contracts**:
- POST /auth/signup - Create new account
- POST /auth/login - User login, create session
- POST /auth/logout - Terminate session
- POST /auth/forgot-password - Generate password reset token
- POST /auth/reset-password - Update password with token
- GET /auth/verify-email - Verify email with token
- GET /account/profile - Get current user profile
- PUT /account/profile - Update profile
- DELETE /account - Request account deletion

**Output**: `contracts/auth-api.openapi.json` with OpenAPI spec

**3. Agent Context Update**:
- Run `.specify/scripts/bash/update-agent-context.sh copilot`
- Add auth tech stack to agent context (Supabase Auth, SvelteKit, Zod)

**Output**: Updated agent context file with auth dependencies

**4. Quick Start Guide**:
- Local development setup (Supabase local)
- Running tests (Vitest + Playwright)
- Manual testing checklist
- Deployment steps

**Output**: `quickstart.md`

---

## Key Implementation Details

### 1. Password Requirements & Validation

- Minimum 8 characters
- Must contain uppercase letter, lowercase letter, number
- Optional special characters allowed
- Validate on both client (form feedback) and server (security)
- Use Zod schema for consistent validation:

```typescript
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .refine(p => /[A-Z]/.test(p), "Password must contain uppercase letter")
  .refine(p => /[a-z]/.test(p), "Password must contain lowercase letter")
  .refine(p => /\d/.test(p), "Password must contain number");
```

### 2. Session Management

- Session tokens stored in HTTP-only cookies
- Cookie expires after 30 days OR when browser closes (session cookie with expiry date)
- Session extended on each user action (sliding expiry)
- Idle timeout: if no activity for 1 hour, require re-authentication
- Multiple sessions allowed per user (multi-device support)

### 3. Email Verification

- Send verification email with 24-hour expiring link
- Link contains signed token (includes email, expiry, signature)
- Verification optional for MVP (can skip to enable faster signup)
- Account can send/receive before verification (security trade-off for UX)

### 4. Password Reset

- "Forgot Password" generates 24-hour expiring reset token
- Reset token is single-use (marked used_at after consumption)
- User must enter new password, old password not required
- On password reset, all existing sessions are invalidated (security measure)
- User sent email confirmation of password change

### 5. Account Deactivation

- "Delete Account" requests deletion with 30-day grace period
- User can cancel deletion within 30 days (restore account + data)
- After 30 days, data is permanently deleted (GDPR compliance)
- Audit log records deletion request and user who deleted account

### 6. Rate Limiting

- Track failed login attempts per email + IP address
- After 5 failed attempts, lock account for 15 minutes
- Lock stored in temporary in-memory cache (or database for MVP)
- Email user of suspicious activity if 5+ failed attempts

### 7. Audit Logging

- Log all authentication events: signup, login success/fail, logout, password reset, account deletion
- Include: user_id, event_type, ip_address, user_agent, timestamp
- Retention: 90 days (default), configurable per compliance requirements
- Accessible via admin dashboard for security review

---

## Dependencies & Blockers

### External Dependencies
- Supabase project (free tier: 500MB database, 2GB file storage)
- Email service (Supabase Auth built-in or SendGrid API key)
- Domain for email verification links (e.g., cosplans.com)

### Internal Dependencies
- **Blocks**: All other features (Teams, Shoots, Permissions, etc.) depend on this
- **Depends on**: Infrastructure setup (Supabase project, database)
- **Blocks Permission System**: Permissions spec must reference User ID from this spec

### Known Unknowns (Resolved in Phase 0)
- [ ] Supabase Auth vs. custom implementation (decision: Supabase Auth)
- [ ] Email service selection (decision: Supabase primary, SendGrid fallback)
- [ ] Rate limiting approach (decision: database for MVP)
- [ ] Session storage mechanism (decision: HTTP-only cookies)
- [ ] OAuth2 architecture (placeholder, not implemented)

---

## Success Metrics (Phase 1 Definition)

| Metric | Target | How to Verify |
|--------|--------|---------------|
| New user signup completion time | < 5 minutes | Manual test + analytics |
| Password reset recovery time | < 3 minutes | Manual test |
| Session validation latency | < 50ms | Performance test |
| Email delivery reliability | 99.9% | Log delivery confirmation |
| Password breach risk | 0 instances | Code review + hashing library audit |
| Login success rate | 98%+ | Heuristics tracking (exclude brute force) |
| Test coverage | 70%+ | Code coverage report |

---

## Timeline Estimate

| Phase | Task | Duration | Notes |
|-------|------|----------|-------|
| Phase 0 | Research (tech decisions, email service, rate limiting) | 3 days | Parallel research tasks |
| Phase 1 | Design data model, API contracts, implement basic routes | 5 days | Core implementation |
| Phase 1 | Form validation (Zod schemas), session management | 3 days | Dependency on Supabase setup |
| Phase 1 | Email verification, password reset flows | 3 days | Email service integration |
| Phase 1 | Rate limiting, account deletion, audit logging | 2 days | Business logic layer |
| Phase 1 | Tests (unit + integration + E2E) | 4 days | Test-first development |
| Phase 1 | Documentation, deployment, manual QA | 2 days | Final validation |
| **TOTAL** | **Full Auth MVP** | **~22 days** | Can be parallelized to 10-12 days with 2-3 devs |

---

## Post-Phase 1 (Phase 2+)

**Not included in Phase 1**:
- Two-factor authentication (2FA)
- OAuth2 social login (Google, Instagram, X/Twitter)
- WebAuthn/passkey support
- Magic link authentication
- Single sign-on (SSO)
- Session analytics dashboard

**Future auth roadmap**: OAuth2 integration starts in Phase 1.5 (after core features validated), leverages Supabase Auth built-in OAuth support.

---

**Status**: ✅ **READY FOR PHASE 0 RESEARCH** - Constitution checks pass, technical context defined, research tasks identified.

