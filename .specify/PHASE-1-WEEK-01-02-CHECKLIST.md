# Phase 1 MVP Implementation: Week 1-2 Checklist

**Timeline**: Week 1-2 (10 working days)  
**Focus**: Database schema, API scaffold, authentication foundations  
**Deliverable**: GitHub PR with database migrations + CRUD API endpoints  
**Team**: [Assignment: assign developer(s) here]

---

## 🎯 Acceptance Criteria

### Database & Schema
- [ ] **Supabase Project Created**
  - Region: EU (GDPR compliance - Principle VII: Security)
  - Project name: `cosplans-phase-1`
  - Database initialized with schema migrations

- [ ] **12 Core Tables Created** (with migrations)
  ```
  - users (id, email, username, real_name, auth_metadata, created_at)
  - teams (id, name, owner_id, created_at, updated_at)
  - team_members (id, team_id, user_id, role, invited_at, accepted_at)
  - shoots (id, team_id, title, description, scheduled_date, location, status, created_at)
  - shoot_crew (id, shoot_id, crew_id, role, assigned_by, created_at)
  - crew (id, name, email, phone, team_id, work_history, created_at)
  - costumes (id, team_id, name, description, status, acquired_date, value_usd, created_at)
  - props (id, team_id, name, description, status, created_at)
  - images (id, team_id, shoot_id, costume_id, url, storage_path, created_at)
  - permissions (id, team_id, user_id, role, created_at)
  - analytics_events (id, user_id, event_type, metadata, created_at)
  - sync_queue (id, user_id, action, data, created_at, synced_at)
  ```

- [ ] **Indexes Created** (for performance <500ms API p95)
  - shoots(team_id, scheduled_date)
  - costumes(team_id, status)
  - crew(team_id)
  - images(shoot_id, costume_id)
  - team_members(team_id, user_id)

- [ ] **Migrations Tested**
  - Up migration runs without errors
  - Down migration rolls back cleanly
  - Data integrity maintained after rollback

### Authentication & Security
- [ ] **Row-Level Security (RLS) Policies**
  - All tables have RLS enabled
  - team_id policy: users can only access own team data
  - owner_id policy: only owner can delete teams
  - Test: viewer role cannot modify data (read-only)
  - Test: admin role can modify team data
  - Test: member role follows team permissions

- [ ] **JWT Token Encoding**
  - User ID encoded in JWT
  - Team IDs array encoded in JWT (users can be in multiple teams)
  - Role encoded in JWT (owner/admin/member/viewer)
  - Expiration: 30 days inactivity timeout

- [ ] **User Authentication Flow**
  - OAuth (Google) login scaffolding (not fully implemented yet)
  - Email/Passkey signup scaffolding
  - Session management (SvelteKit load hook)
  - Logout functionality

### API Endpoints (REST)
- [ ] **Shoots CRUD** (`/api/shoots`)
  - GET /api/shoots (list team's shoots, paginated)
  - POST /api/shoots (create new shoot, Zod validation)
  - GET /api/shoots/[id] (fetch shoot detail)
  - PATCH /api/shoots/[id] (update shoot)
  - DELETE /api/shoots/[id] (soft delete, owner only)

- [ ] **Costumes CRUD** (`/api/costumes`)
  - GET /api/costumes (list team's costumes, with status filter)
  - POST /api/costumes (create, Zod validation)
  - PATCH /api/costumes/[id] (update status, value, etc.)
  - DELETE /api/costumes/[id] (soft delete)

- [ ] **Props CRUD** (`/api/props`)
  - GET /api/props (list team's props)
  - POST /api/props (create)
  - PATCH /api/props/[id] (update)
  - DELETE /api/props/[id] (soft delete)

- [ ] **Crew CRUD** (`/api/crew`)
  - GET /api/crew (list team's crew with work history)
  - POST /api/crew (add new crew member)
  - PATCH /api/crew/[id] (update contact info)
  - DELETE /api/crew/[id] (archive)

- [ ] **Team Members** (`/api/teams/[team_id]/members`)
  - GET (list team members with roles)
  - POST (invite new member)
  - PATCH /[member_id] (update role: owner/admin/member/viewer)

- [ ] **Error Handling**
  - 400 Bad Request (validation errors, Zod parsing failed)
  - 401 Unauthorized (missing/invalid JWT)
  - 403 Forbidden (RLS policy violated)
  - 404 Not Found (resource doesn't exist)
  - 429 Too Many Requests (rate limit hit - 1000/day free tier)
  - 500 Internal Server Error (unexpected)
  - All errors include: status, error_code, message, timestamp

- [ ] **Validation** (Zod schemas)
  - Shoot: title (1-100 chars), date (future), location (optional)
  - Costume: name (1-100), status (enum), value (numeric)
  - Crew: name, email (valid), phone (optional)
  - Team: name (1-50), owner_id (valid user)

### Testing (70% coverage minimum - Principle VI: TDD)
- [ ] **Unit Tests** (Vitest)
  - Database models: test CRUD operations
  - Zod schemas: test valid/invalid inputs
  - Permission logic: test all role combinations
  - **Target**: 25+ unit tests

- [ ] **Integration Tests**
  - API endpoints: test request/response/status codes
  - RLS policies: test team isolation (user X cannot see user Y's data)
  - Error handling: test 400/401/403/404/429 responses
  - **Target**: 20+ integration tests

- [ ] **API Contract Tests**
  - Request/response shapes match OpenAPI spec
  - Pagination works (limit, offset)
  - Filter parameters work (status=active, date_range, etc.)
  - **Target**: 10+ contract tests

- [ ] **Coverage Report**
  - Generate with `npm run test:coverage`
  - Minimum 70% overall
  - Flag any modules <60%
  - Commit HTML report to `.coverage/week-1-2.html`

### Documentation
- [ ] **OpenAPI/Swagger Spec** (auto-generated from SvelteKit routes)
  - All endpoints documented
  - Request/response schemas defined
  - Error responses documented
  - File: `.specify/api/v1.openapi.yaml`

- [ ] **Database Schema Diagram**
  - Visual showing all 12 tables + relationships
  - Include PK/FK constraints
  - File: `.specify/database-schema.md` (text diagram or PNG)

- [ ] **Migration Documentation**
  - How to run migrations: `npm run db:migrate`
  - How to rollback: `npm run db:rollback`
  - File: `.specify/database-migrations.md`

- [ ] **Environment Variables**
  - Document all required variables
  - Supabase URL, anon key, service role key
  - File: `.env.example` (no secrets)

### Deployment & Performance
- [ ] **Performance Benchmarks**
  - API list endpoint: <200ms (p95) on local Supabase
  - API create endpoint: <300ms (p95)
  - Database query: <100ms (p95)
  - Document in PR description with timings

- [ ] **Database Backups**
  - Enable automated daily backups in Supabase
  - Test restoration procedure (at least once)
  - Document in `.specify/deployment.md`

- [ ] **Staging Deployment**
  - Migrations run cleanly on staging database
  - API endpoints tested in staging environment
  - No console.log() or debugger statements in code

---

## 🔗 Constitution References

**Principle I (Web-First)**: Mobile-responsive from Day 1
- [ ] API responses include metadata for pagination (supports small screens)
- [ ] All timestamps ISO format for timezone consistency

**Principle II (Real-Time Collaboration)**: Foundation for sync later
- [ ] sync_queue table created (will store offline edits in Week 5-6)
- [ ] API designed to support optimistic updates (each response includes latest state)

**Principle VI (Test-Driven Development)**
- [ ] Tests written BEFORE implementation (not after)
- [ ] 70% coverage minimum enforced
- [ ] All acceptance criteria have corresponding tests

**Principle VII (Team Roles & Permissions)**
- [ ] RLS policies enforce team isolation
- [ ] Role-based access control in JWT (encoded in token)
- [ ] All CRUD operations respect user's role

**Technology Stack (Constitution v2.2.0)**
- [ ] Supabase for database + RLS (PostgreSQL)
- [ ] SvelteKit for API routes
- [ ] Zod for request validation
- [ ] Vitest for testing
- [ ] TypeScript strict mode enabled

---

## 📦 Deliverables

### Code
- [ ] `src/routes/api/shoots/+server.ts` (GET, POST with Zod validation)
- [ ] `src/routes/api/shoots/[id]/+server.ts` (GET, PATCH, DELETE with RLS)
- [ ] Similar endpoints for costumes, props, crew, team members
- [ ] Database migrations in `supabase/migrations/`
- [ ] Zod schemas in `src/lib/types/schemas.ts`

### Tests
- [ ] Unit tests in `tests/unit/`
- [ ] Integration tests in `tests/integration/`
- [ ] Coverage report: `npm run test:coverage` produces 70%+

### Documentation
- [ ] OpenAPI spec in `.specify/api/v1.openapi.yaml`
- [ ] Database schema in `.specify/database-schema.md`
- [ ] Migration guide in `.specify/database-migrations.md`

### Pull Request
- **Description includes**:
  - What was built (feature list)
  - Why (design decisions)
  - How to test (manual testing steps + how to run tests)
  - Performance metrics (API latency, coverage %)
  - Screenshots (optional but helpful)
- **Status checks pass**:
  - All tests passing
  - Coverage >= 70%
  - No TypeScript errors
  - No ESLint warnings

---

## ⚠️ Known Blockers / Decisions Needed

| Blocker | Impact | Resolution |
|---------|--------|-----------|
| **RLS Policy Complexity** | Unclear how to handle team owner changing | Decide: soft delete old owner policy or maintain history? |
| **Offline Sync Design** | sync_queue table exists but logic not implemented | Defer to Week 5-6 (Yjs integration) |
| **OAuth Configuration** | Google OAuth secrets not available | Create mock OAuth for testing; Supabase OAuth added in Week 3 |

---

## 📋 Week 1-2 Daily Tasks

### Day 1-2: Setup & Database
- [ ] SvelteKit project initialized with TypeScript strict
- [ ] Supabase project created (EU region)
- [ ] Database schema SQL written
- [ ] Migrations tested (up/down)

### Day 3-4: API Endpoints
- [ ] Shoots CRUD endpoints scaffolded
- [ ] Zod validation schemas written
- [ ] Basic error handling implemented

### Day 5-6: Remaining CRUD
- [ ] Costumes, Props, Crew, Team Members endpoints
- [ ] RLS policies applied to all tables
- [ ] Manual testing in Postman/REST client

### Day 7-8: Testing
- [ ] Unit tests written (25+)
- [ ] Integration tests written (20+)
- [ ] Coverage report generated (70%+)

### Day 9-10: Documentation & PR
- [ ] OpenAPI spec generated
- [ ] Database schema diagram created
- [ ] PR submitted with all deliverables
- [ ] Ready for code review

---

## ✅ Sign-Off Criteria

**I will consider Week 1-2 COMPLETE when**:
1. ✅ All acceptance criteria above are checked
2. ✅ PR submitted with full test coverage (70%+)
3. ✅ Code reviewed and approved
4. ✅ Merged to main branch
5. ✅ Staging deployment successful

**For you to APPROVE Week 1-2**:
1. Review PR description (what changed, why)
2. Review code changes (database schema, API endpoints)
3. Review test coverage report (70%+ minimum)
4. Run tests locally: `npm test`
5. Spot-check OpenAPI spec matches actual endpoints

---

## 🚀 Next: Week 3 (Authentication)

After Week 1-2 is approved, we move to:
- [ ] OAuth (Google) implementation
- [ ] Email/Passkey signup
- [ ] 2FA setup
- [ ] Session management in SvelteKit load hooks

---

**Created**: October 16, 2025  
**Week**: 1-2 of 12  
**Status**: Ready to execute  
**Next Review**: End of Week 2
