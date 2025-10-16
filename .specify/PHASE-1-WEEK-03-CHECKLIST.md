# Phase 1 MVP Implementation: Week 3 Checklist

**Timeline**: Week 3 (5 working days)  
**Focus**: Authentication system (Google OAuth, Email/Passkey, 2FA, Sessions)  
**Deliverable**: GitHub PR with auth flow complete, all login methods tested  
**Dependency**: Week 1-2 (database + API) must be merged first

---

## 🎯 Acceptance Criteria

### OAuth (Google) Authentication
- [ ] **Google OAuth Configuration**
  - Google Cloud Console project created
  - OAuth 2.0 credentials (client ID, client secret)
  - Redirect URI configured: `http://localhost:5173/auth/callback`
  - `.env.local` updated with credentials

- [ ] **OAuth Login Flow**
  - "Sign in with Google" button on login page
  - User clicks → redirected to Google consent screen
  - After approval → JWT created and stored in httpOnly cookie
  - User redirected to dashboard
  - Test: multiple sign-ins work correctly

- [ ] **OAuth Token Handling**
  - Google ID token verified server-side
  - User created in `users` table if first sign-in
  - Existing user fetched and logged in
  - JWT (with team IDs, role) created

### Email + Passkey Authentication
- [ ] **Email Signup with Passkey**
  - User enters email → sent confirmation link
  - Link expires in 24 hours
  - User clicks link → passkey creation prompt
  - Passkey created and registered
  - User can log in with passkey

- [ ] **Passkey Login**
  - "Sign in with Passkey" on login page
  - Browser passkey selection dialog shown
  - Passkey verified server-side
  - JWT created, user logged in

- [ ] **Fallback: Email/Password** (temporary, 30-day grace period)
  - If passkey not enrolled, allow email + password
  - After 30 days → force passkey enrollment
  - Password must meet: 12+ chars, mixed case, numbers, symbols
  - Password reset via email link (15-minute expiration)

### Two-Factor Authentication (2FA)
- [ ] **2FA Optional for All Users**
  - Settings page: "Enable 2FA" toggle
  - User clicks → generates TOTP secret
  - QR code displayed for authenticator app
  - User scans with authenticator (Google Authenticator, Authy, etc.)
  - User enters test code to verify setup

- [ ] **2FA on Login**
  - After email/password auth → prompt for 2FA code
  - User enters code from authenticator app
  - Code validated (must be current or within ±1 window)
  - JWT created, user logged in
  - Test: expired codes rejected

- [ ] **Backup Codes**
  - 10 backup codes generated during 2FA setup
  - Codes displayed once (save them!)
  - Each code is single-use
  - If user loses authenticator, can use backup code
  - Test: backup codes work, consumed after use

### Session Management
- [ ] **SvelteKit Load Hook** (`src/hooks.server.ts`)
  - Check for JWT in httpOnly cookie
  - Decode JWT: extract user ID, team IDs, role
  - Attach to `locals.user` and `locals.teams`
  - Available in all +page.server.ts and API routes

- [ ] **Session Expiration**
  - Web session expires after 30 days inactivity
  - Mobile sessions (future) expire after 90 days
  - On logout, JWT cookie cleared
  - Test: expired token returns 401 on API calls

- [ ] **Multi-Team Support**
  - User can be member of multiple teams
  - JWT includes array of team IDs
  - SvelteKit load hook makes team list available
  - Dashboard shows all teams user belongs to
  - User can switch between teams

### Account Recovery
- [ ] **Forgot Password** (for email/password users)
  - "Forgot password?" link on login page
  - User enters email
  - Confirmation email sent with reset link
  - Link expires after 24 hours
  - User clicks link → password reset form
  - New password validated (12+ chars, mixed case, numbers)

- [ ] **Account Deletion**
  - Settings page: "Delete Account" button
  - Requires password confirmation
  - Email sent: "Are you sure? Click here to confirm deletion within 7 days"
  - After 7-day grace period → all user data deleted (GDPR compliance)
  - Test: deleted user cannot log in

### Testing (70% coverage minimum)
- [ ] **Unit Tests** (Vitest)
  - JWT encode/decode
  - Token expiration logic
  - Passkey verification
  - 2FA code validation (current + ±1 window)
  - Backup code consumption
  - **Target**: 15+ unit tests

- [ ] **Integration Tests**
  - Google OAuth flow (with mocked Google endpoint)
  - Email passkey signup + login
  - 2FA setup + login with code
  - 2FA backup codes
  - Session expiration
  - Multi-team user can access both teams
  - **Target**: 15+ integration tests

- [ ] **E2E Tests** (Playwright)
  - Complete Google OAuth flow (or mock)
  - Complete email/passkey flow
  - 2FA setup and login
  - Account deletion with 7-day grace
  - **Target**: 6+ E2E tests

- [ ] **Coverage Report**
  - Minimum 70% overall
  - Generate: `npm run test:coverage`

### Documentation
- [ ] **Auth Flow Diagram** (OAuth, Passkey, 2FA)
  - Sequence diagram showing all three flows
  - File: `.specify/auth-flow.md`

- [ ] **Environment Variables**
  - Document all auth-related vars
  - File: Updated `.env.example`

- [ ] **API Documentation Update**
  - New endpoints: POST /api/auth/login, /logout, /verify-2fa
  - Updated OpenAPI spec

---

## 🔗 Constitution References

**Principle VII (Security & Privacy)**: Auth is foundation
- [ ] No passwords stored in plaintext (hashed with bcrypt)
- [ ] 2FA optional but strongly recommended for admins (future: required in Phase 2)
- [ ] JWT tokens include team IDs for multi-team support
- [ ] httpOnly cookies prevent XSS attacks

**Technology Stack (Constitution v2.2.0)**
- [ ] Supabase Auth (with OAuth support)
- [ ] WebAuthn/Passkeys for passwordless auth
- [ ] TOTP for 2FA
- [ ] SvelteKit load hooks for session management

---

## 📦 Deliverables

### Code
- [ ] `src/routes/auth/login/+page.svelte` (UI: Google, Passkey, Email/Password options)
- [ ] `src/routes/auth/callback/+server.ts` (OAuth callback handler)
- [ ] `src/routes/api/auth/signup/+server.ts` (Email signup)
- [ ] `src/routes/api/auth/verify-passkey/+server.ts` (Passkey verification)
- [ ] `src/routes/api/auth/setup-2fa/+server.ts` (2FA setup)
- [ ] `src/routes/api/auth/verify-2fa/+server.ts` (2FA code validation)
- [ ] `src/routes/api/auth/logout/+server.ts`
- [ ] `src/hooks.server.ts` (JWT validation in load hook)
- [ ] Supabase Auth policies configured

### Tests
- [ ] Unit tests: 15+
- [ ] Integration tests: 15+
- [ ] E2E tests: 6+
- [ ] Coverage: 70%+

### Documentation
- [ ] Auth flow diagram
- [ ] Updated API spec with auth endpoints
- [ ] Security considerations documented

---

## ⚠️ Known Blockers / Decisions Needed

| Blocker | Impact | Resolution |
|---------|--------|-----------|
| **Google OAuth Secret** | Cannot test full OAuth without creds | Use mock endpoint for testing; real creds added in staging |
| **Passkey Support** | Not all browsers support WebAuthn equally | Provide email/password fallback for 30 days |
| **2FA Backup Codes** | Storing securely without encryption | Encrypt with master key from key management service (deferred to ops) |

---

## ✅ Sign-Off Criteria

**Week 3 COMPLETE when**:
1. ✅ All three auth methods working (OAuth, Passkey, Email/Password)
2. ✅ 2FA setup + login working
3. ✅ Session management in load hook
4. ✅ 70%+ test coverage
5. ✅ PR approved and merged

---

**Timeline**: Week 3 of 12  
**Dependency**: Week 1-2 merged  
**Next**: Week 4 (Image Optimization)
