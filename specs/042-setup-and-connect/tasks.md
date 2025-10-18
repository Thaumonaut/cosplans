# Tasks: Backend Service Reliability & Error Transparency

**Input**: Design documents from `/specs/042-setup-and-connect/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per constitution principle VI (Test-Driven Development), tests MUST be written before implementation. Test tasks precede corresponding implementation tasks for each user story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure local environments and shared configuration can interact with Supabase safely.

- [x] T001 Validate Bun toolchain and Supabase CLI availability (`bun --version`, `supabase --version`)
- [x] T002 Create `.env.development`, `.env.staging`, `.env.production` from `.env.example` with Supabase placeholders
- [x] T003 Register `DIAGNOSTICS_BUCKET` storage bucket name in environment configs (`.env.*`)
- [x] T004 Confirm existing Bun scripts include `supabase` aliases in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend artifacts and helpers required by all stories.

- [x] T005 Scaffold Supabase SQL migrations for `service_connection_profiles`, `diagnostic_test_runs`, `error_events`, and `service_health_snapshots` in `database/migrations`
- [x] T006 Define shared TypeScript types for `ServiceConnectionProfile`, `DiagnosticRun`, `ErrorEvent`, `HealthSnapshot` in `src/lib/types/service-connections.ts`
- [x] T007 Implement `CosplansError` translator and logger wrapper in `src/lib/utils/errors.ts`
- [x] T008 Create Supabase admin client factory with environment-aware credentials in `src/lib/server/supabase/admin-client.ts`
- [x] T009 Add configuration schema and safe loader for integration settings in `src/lib/server/config/service-connections.ts`

**Checkpoint**: Foundational layer complete — user stories may now proceed in parallel.

---

## Phase 3: User Story 1 — Configure & Validate Service Connections (Priority: P1) 🎯 MVP

**Goal**: Operations lead can configure a service connection, run verification, and activate it only on success.

**Independent Test**: From Settings → Integrations → Service Connections, provide credentials and run "Test Connection"; success updates last checked timestamp and enables activation, failure blocks activation with remediation guidance.

### Tests (write before implementation)

- [x] T010 [P] [US1] Add Vitest unit suite for connection config validation rules in `tests/unit/service-connections/config.test.ts`
- [x] T011 [P] [US1] Add Playwright flow covering successful and failed connection tests in `tests/e2e/service-connections/configuration.spec.ts`

### Implementation

- [x] T012 [P] [US1] Create SvelteKit form actions and load functions in `src/routes/(auth)/settings/service-connections/+page.server.ts`
- [x] T013 [P] [US1] Design UI components for connection list, form, and status badges in `src/lib/components/service-connections/ConnectionList.svelte`
- [x] T014 [US1] Implement Supabase mutation to upsert `service_connection_profiles` and queue verification job in `src/lib/server/service-connections/mutations.ts`
- [x] T015 [US1] Implement connection verification worker (Supabase edge function mock or Bun job) in `src/lib/server/service-connections/verify.ts`
- [x] T016 [US1] Persist verification results and update `last_verified_at` in repository layer `src/lib/server/service-connections/repository.ts`
- [x] T017 [US1] Ensure UI surfaces precise failure reasons using `CosplansError` translator in `src/lib/components/service-connections/ConnectionForm.svelte`

**Checkpoint**: User Story 1 independently testable (configuration + verification loop).

---

## Phase 4: User Story 2 — Automated Edge-Case Diagnostics (Priority: P1)

**Goal**: QA specialist triggers diagnostics covering defined scenarios with persisted evidence and auditing.

**Independent Test**: Run diagnostics via UI or CLI, confirm each scenario status stored with timestamps and evidence links, and blocking failures halt release.

### Tests

- [x] T018 [P] [US2] Add Vitest suite simulating diagnostics harness against MSW failure mocks in `tests/unit/service-connections/diagnostics.test.ts`
- [x] T019 [P] [US2] Add Playwright flow to trigger diagnostics run and review results in `tests/e2e/service-connections/diagnostics.spec.ts`

### Implementation

- [x] T020 [P] [US2] Create diagnostics runner script leveraging Bun test executor in `src/lib/server/service-connections/diagnostics-runner.ts`
- [x] T021 [US2] Implement API endpoint `/api/diagnostics/runs` per OpenAPI contract in `src/routes/api/diagnostics/runs/+server.ts`
- [x] T022 [US2] Implement diagnostics result page components in `src/lib/components/service-connections/DiagnosticsPanel.svelte`
- [x] T023 [US2] Persist diagnostic outcomes and evidence uploads to Supabase Storage in `src/lib/server/service-connections/diagnostics.repository.ts`
- [x] T024 [US2] Wire notifications/alerts on failure outcomes via existing notification service at `src/lib/server/notifications/dispatch.ts`

**Checkpoint**: User Story 2 independently testable (diagnostics run + evidence capture).

---

## Phase 5: User Story 3 — Friendly Frontend Errors with Operator Detail (Priority: P2)

**Goal**: Users receive actionable messages while operators access full diagnostics using correlation IDs.

**Independent Test**: Force simulated API failure; UI shows friendly guidance while logs contain operator context and correlation ID link.

### Tests

- [x] T025 [P] [US3] Add Vitest unit tests for `translateError` mapping to user/operator payloads in `tests/unit/service-connections/errors.test.ts`
- [x] T026 [P] [US3] Add Playwright scenario validating user-facing error messaging in `tests/e2e/service-connections/errors.spec.ts`

### Implementation

- [x] T027 [US3] Instrument API handlers to emit `CosplansError` objects with correlation IDs in `src/routes/api/**/*`
- [x] T028 [US3] Update UI loaders and forms to display translated messages and support retry/contact options in `src/lib/components/common/ErrorToast.svelte`
- [x] T029 [US3] Persist operator context into `error_events` table within `src/lib/server/service-connections/errors.repository.ts`
- [x] T030 [US3] Expose operator diagnostics viewer (guarded route) consuming correlation IDs in `src/routes/(auth)/operations/errors/+page.svelte`

---

## Phase 6: User Story 4 — Service Health Monitoring (Priority: P3)

**Goal**: Operations analyst views live health indicators and receives alerts on recurring failures.

**Independent Test**: Heartbeat job populates snapshots; dashboard shows uptime and incidents; alerts fire after two failed heartbeats.

### Tests

- [x] T031 [P] [US4] Add Vitest suite for heartbeat scheduler and snapshot calculation in `tests/unit/service-connections/heartbeat.test.ts`
- [x] T032 [P] [US4] Add Playwright coverage for health dashboard interactions in `tests/e2e/service-connections/health.spec.ts`

### Implementation

- [x] T033 [US4] Implement Bun-based heartbeat runner `runServiceConnectionHeartbeats` and expose API trigger at `/api/service-connections/heartbeat`
- [x] T034 [US4] Provide Bun scheduling script `scripts/supabase/schedule-heartbeat.ts` (watch/cron friendly)
- [x] T035 [US4] Build health overview UI consuming `service_health_snapshots` view in `src/lib/components/service-connections/HealthOverview.svelte`
- [x] T036 [US4] Implement alerting thresholds and operator acknowledgment flow in `src/lib/server/service-connections/alerts.ts`
- [x] T037 [US4] Expose acknowledgement action endpoint in `src/routes/api/service-connections/incidents/+server.ts`

**Checkpoint**: User Story 4 independently testable (heartbeat monitoring + alert acknowledgment).

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finalize documentation, resilience, and performance.

- [ ] T038 [P] Document Supabase setup and diagnostics workflow updates in `docs/runbook/service-connections.md`
- [ ] T039 Harden RLS policies and verify least-privilege access for new tables in `database/policies/service-connections.sql`
- [ ] T040 Add analytics instrumentation for connection success/failure rates in `src/lib/server/analytics/service-connections.ts`
- [ ] T041 [P] Perform performance tuning for diagnostics and heartbeat jobs; document metrics in `docs/performance/service-connections.md`
- [ ] T042 Conduct final QA pass using quickstart checklist and record results in `test-results/service-connections.md`

---

## Dependencies & Execution Order

1. **Setup (Phase 1)** → prerequisite for foundational work.
2. **Foundational (Phase 2)** → must complete before any user story begins.
3. **User Stories** → follow priority order P1 → P1 → P2 → P3, but after Phase 2 they can run in parallel if teams are split.
4. **Polish (Phase 7)** → only after targeted user stories are complete.

### Story-Level Dependencies
- US1 unlocks base CRUD and verification patterns reused by later stories.
- US2 depends on repositories and configuration patterns from US1.
- US3 builds upon error model established in foundational tasks and US1 API endpoints.
- US4 leverages tables and diagnostics results from earlier stories but can run once repository + error infrastructure exists.

## Parallel Opportunities
- Setup tasks T001–T004 may be split across contributors (environment prep vs packages).
- Foundational tasks T006–T009 touch distinct modules and can run in parallel after migrations defined (T005).
- For each story, tasks tagged `[P]` (tests, UI vs service code) can run concurrently.
- Different user stories can progress in parallel once Phase 2 completes, provided integration points are respected.

## Implementation Strategy
- **MVP**: Complete Phases 1–3 to ship configuration + verification loop early.
- **Incremental Delivery**: Layer diagnostics (Phase 4), error experience (Phase 5), then monitoring (Phase 6).
- **Continuous Validation**: After each story, run associated unit + E2E tests before proceeding.
