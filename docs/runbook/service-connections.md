# Service Connections Runbook

_Last updated: 2025-10-18_

## 📌 Purpose

This runbook captures the operational procedures for configuring service connections, running diagnostics, and maintaining heartbeat monitoring within Cosplans. Use it when onboarding new environments, rotating credentials, or responding to service health incidents.

---

## 1. Platform Overview

- **Runtime:** Bun 1.3.x (mandated) with SvelteKit 2.x.
- **Primary datastore:** Supabase (PostgreSQL + Storage + Edge Functions).
- **Key tables/views:**
  - `service_connection_profiles`
  - `diagnostic_test_runs`
  - `error_events`
  - `service_connection_heartbeats`
  - `service_health_snapshots` (materialized view refreshed via RPC)
- **Heartbeat runner:** `runServiceConnectionHeartbeats` (Bun module exposed via `/api/service-connections/heartbeat`).
- **Scheduled job:** Bun script `scripts/supabase/schedule-heartbeat.ts` (cron-friendly, optional watch mode).

---

## 2. Prerequisites

1. **Tooling**
   - Bun (`bun --version` ≥ 1.3.0).
   - Supabase CLI (`supabase --version` ≥ 1.171).
2. **Environment Files**
   - `.env.development`, `.env.staging`, `.env.production` exist with populated Supabase credentials.
   - Ensure the following variables are present per environment:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `DIAGNOSTICS_BUCKET`
     - `COSPLANS_ENVIRONMENT`
3. **Network Access**
   - Supabase project allows inbound requests from diagnostic endpoints and heartbeat edge function.

---

## 3. Local Setup & Verification

1. **Install dependencies**
   ```bash
   bun install
   ```
2. **Apply database migrations** (requires Supabase CLI authenticated against the target project):
   ```bash
   bun --bun supabase db push
   ```
3. **Seed service connections (optional)**
   - In dev/test, the application can operate with the in-memory fake repository by setting `COSPLANS_USE_FAKE_SUPABASE=1`.
   - Navigate to `/settings/service-connections?seedHealth=1` during development to populate sample heartbeats.
4. **Run the app locally**

   ```bash
   bun --bun run dev
   ```

   - Access the dashboard at http://127.0.0.1:5173 (default Vite port unless overridden).

5. **Execute automated suites**
   ```bash
   bun run test:integration   # Playwright flows (service config, diagnostics, health)
   bun test                   # Vitest suites (repositories, diagnostics logic, heartbeat calculations)
   ```

---

## 4. Diagnostics Workflow

### 4.1 Purpose

Diagnostics validate an integration’s ability to execute Cosplans-required scenarios (auth, storage, evidence upload, etc.). Failures block activation and raise operator notifications.

### 4.2 Flow Summary

1. **Trigger** – Operations/QA initiates a run from `/settings/service-connections` or automated job.
2. **Execution** – `src/lib/server/service-connections/diagnostics-runner.ts` orchestrates scenarios, logging latency and notes.
3. **Persistence** – Results stored in `diagnostic_test_runs`; evidence optionally uploaded to `DIAGNOSTICS_BUCKET`.
4. **Notifications** – `dispatchNotification` issues in-app alerts for failures (critical or warning severity).
5. **Operator Review** – The Diagnostics Panel (`DiagnosticsPanel.svelte`) surfaces scenario-specific statuses and messages.

### 4.3 Runbook Actions

- **Manual Run** – Trigger via UI and monitor status bar for success/failure.
- **Review History** – Use diagnostics table or query `diagnostic_test_runs` in Supabase.
- **Escalation** – If repeated failures occur, capture correlation IDs from `error_events` and escalate to the owning service team.

---

## 5. Service Health Monitoring

### 5.1 Heartbeat Runner

- Source: `src/lib/server/service-connections/heartbeat-runner.ts` (invoked from API route `/api/service-connections/heartbeat`).
- Inputs:
  - Active service connections pulled via Supabase admin client using service-role credentials.
- Behavior:
  - Performs lightweight health probes (`pass`/`fail`) with optional latency capture.
  - Persists heartbeats through `recordHeartbeatOutcome` (writes to `service_connection_heartbeats` and refreshes snapshots).
  - Triggers alerting helpers (`evaluateHeartbeatAlerts`) to open or resolve incidents when consecutive failures increase.

### 5.2 Scheduling

- Script: `scripts/supabase/schedule-heartbeat.ts`.
- Run once:
  ```bash
  bun run scripts/supabase/schedule-heartbeat.ts
  ```
- Continuous watch mode (every 5 minutes by default):
  ```bash
  SERVICE_HEARTBEAT_WATCH=1 bun run scripts/supabase/schedule-heartbeat.ts
  ```
- Customize interval via `SERVICE_HEARTBEAT_INTERVAL_SECONDS` or pass `--watch` for long-running cron workers.

### 5.3 Dashboard Expectations

- `/settings/service-connections` → **Service health** table displays:
  - Current status (`Healthy`, `Degraded`, `Incident`).
  - 24h uptime percentage.
  - Consecutive failure streak.
  - Acknowledge button when incidents remain open.
- API endpoint for acknowledgement: `/api/service-connections/incidents`.

### 5.4 Incident Response Playbook

1. Staff member acknowledges incident via UI (records `acknowledged_at/by`).
2. Investigate recent heartbeat failures + `error_events` context.
3. Once the integration recovers, heartbeat status automatically flips to **Healthy** and dispatches a recovery notification.

---

## 6. Credential & Security Guidance

- Store Supabase keys in project secrets. Never commit real keys.
- RLS policies (see `database/policies/service-connections.sql`) restrict access by team.
- Error events and diagnostics runs contain operator context; treat as sensitive PII-equivalent data.
- Rotate service role keys on schedule; update the runbook when key rotation procedures change.

---

## 7. Troubleshooting

| Symptom                                   | Checks                                                                              | Resolution                                                           |
| ----------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Heartbeat status never updates            | Confirm cron schedule, inspect `service_connection_heartbeats` table                | Reapply schedule script; redeploy edge function                      |
| Diagnostics fail with storage errors      | Validate `DIAGNOSTICS_BUCKET` exists and service role key has storage access        | Create bucket, adjust storage policies                               |
| UI shows “Unable to acknowledge incident” | Check `/api/service-connections/incidents` logs for 404 (incident already resolved) | Refresh health snapshots; ensure heartbeat refresh ran               |
| Playwright health spec flakey locally     | Use `?seedHealth=1` query param; ensure hydration flag is set                       | Run `bun run test:integration -- --grep "Service connection health"` |

---

## 8. Change Management

- Update this runbook whenever Supabase schema, diagnostic scenarios, or alerting thresholds change.
- Capture major updates in `WHATS-NEW-DASHBOARD-NAV.md` if they impact UI.
- For production incidents, log postmortems linked to correlation IDs from `error_events`.

---

## 9. Quick Reference

- Apply migrations: `bun --bun supabase db push`
- Seed health snapshots (local): open `/settings/service-connections?seedHealth=1`
- Run heartbeat sweep: `bun run scripts/supabase/schedule-heartbeat.ts`
- Run diagnostics suite: `bun run test:integration -- --grep "Service connection"`
- Notify operators: via `dispatchNotification` (in-app channel)

---

**Contact:** Operations Engineering (Slack #ops-infra) for escalations and updates.
