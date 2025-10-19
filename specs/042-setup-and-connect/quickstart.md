# Quickstart — Backend Service Reliability & Error Transparency

This guide connects Cosplans to Supabase-backed services, enables automated diagnostics, and surfaces friendly error reporting.

## 1. Prerequisites
- Bun ≥ 1.3 installed (`bun --version`)
- Supabase CLI ≥ 1.185 (`supabase --version`)
- Access to the Cosplans repository with `042-setup-and-connect` branch checked out
- Supabase project(s) for each environment (development, staging, production)
- Service role key and anon key for each Supabase project

## 2. Environment Configuration
Create environment-specific files (Bun uses `.env`) in the repo root:

```
cp .env.example .env.development
cp .env.example .env.staging
cp .env.example .env.production
```

Populate the following variables per environment:
- `SUPABASE_URL=https://<project>.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=<service-role-key>`
- `SUPABASE_ANON_KEY=<anon-key>`
- `COSPLANS_ENVIRONMENT=development|staging|production`
- `DIAGNOSTICS_BUCKET=diagnostics-artifacts`

Store `.env.*` files in your secret manager (1Password, Vault) and never commit them.

## 3. Database Setup
Run migrations against each Supabase project to provision new tables (`service_connection_profiles`, `diagnostic_test_runs`, `error_events`) and materialized view (`service_health_snapshots`).

```bash
bun supabase db push --env development
bun supabase db push --env staging
bun supabase db push --env production
```

> `bun supabase` aliases the Supabase CLI via Bun scripts; update `package.json` if missing.

## 4. Storage Bucket for Evidence
Create a private Storage bucket for diagnostic artifacts:

```bash
supabase storage create-bucket diagnostics-artifacts --public false
```

Grant the Cosplans service role access by adding a storage policy allowing inserts and reads for service role:

```sql
create policy "Service diagnostics"
on storage.objects
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
```

## 5. Run Connection Test Locally
Start the development server with Bun:

```bash
bun --bun run dev
```

Navigate to **Settings → Integrations → Service Connections** and enter Supabase credentials. Click **Test Connection** to verify the operation; success will display last-checked timestamp.

## 6. Execute Diagnostics Suite
Trigger automated diagnostics before each release:

```bash
COSPLANS_ENVIRONMENT=staging bun test diagnostics/service-connections.test.ts
```

Results are stored in `diagnostic_test_runs` and artifacts uploaded to `diagnostics-artifacts` bucket.

## 7. Monitoring Jobs
Run the Bun heartbeat runner on a 5-minute cadence (cron or long-lived worker):

```bash
SERVICE_HEARTBEAT_WATCH=1 bun run scripts/supabase/schedule-heartbeat.ts
```

Alternatively, wire an external scheduler to POST `/api/service-connections/heartbeat` with `Authorization: Bearer <SERVICE_HEARTBEAT_TOKEN>`.

The runner should:
1. Ping target services (Supabase PostgREST, Realtime, Storage, External APIs).
2. Write status rows to `service_connection_heartbeats` and refresh the `service_health_snapshots` view.
3. Emit alerts when heartbeat fails twice consecutively via `evaluateHeartbeatAlerts`.

## 8. Frontend Error Messaging
Ensure the SvelteKit error boundary imports the `CosplansError` translator:

```ts
import { translateError } from '$lib/services/errors';

const result = await someApiCall();
if (result.error) {
  const message = translateError(result.error);
  showToast(message.userMessage);
}
```

Operator details are logged server-side with correlation IDs for follow-up using Supabase Log Drains.

## 9. Test Coverage
- `bun test` — unit tests covering CosplansError mapping and heartbeat schedulers
- `bun run playwright test` — end-to-end flows for configuration UI and error surfacing
- Ensure Playwright runs against a seeded Supabase project with mock failure scenarios.

## 10. Deployment Checklist
- All environments have updated `.env` variables and migrations applied
- Diagnostics suite passing with no `fail` or `blocked` outcomes
- Heartbeat runner deployed (script or API scheduling) and reporting data
- Monitoring alerts verified by inducing a controlled failure in staging
- Documentation updated in team runbook referencing this quickstart
