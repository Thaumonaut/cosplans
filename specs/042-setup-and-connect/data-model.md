# Data Model — Backend Service Reliability & Error Transparency

## 1. Service Connection Profile
- **Purpose**: Stores configuration and status for each external service/environment combination.
- **Key Fields**:
  - `id` (UUID, primary key)
  - `team_id` (UUID, references `teams.id`)
  - `service_type` (enum: `supabase`, `google_calendar`, `google_maps`, `email`, etc.)
  - `environment` (enum: `development`, `staging`, `production`)
  - `supabase_project_ref` (text, nullable — project identifier when service_type=`supabase`)
  - `status` (enum: `inactive`, `pending_verification`, `active`, `error`)
  - `last_verified_at` (timestamptz, nullable)
  - `connection_metadata` (jsonb — host, region, other descriptive fields)
  - `created_at` / `updated_at` (timestamptz)
- **Relationships**:
  - 1:N with Diagnostic Test Runs (`service_connection_id`)
  - 1:N with Error Events (`service_connection_id`)
- **Validation Rules**:
  - `team_id`, `service_type`, and `environment` required.
  - Unique index across (`team_id`, `service_type`, `environment`).
  - `status=active` requires `last_verified_at` within past 30 minutes.
- **State Transitions**:
  - `inactive` → `pending_verification` (configuration saved)
  - `pending_verification` → `active` (successful test)
  - Any state → `error` (health check failure)
  - `error` → `active` (successful retest)

## 2. Diagnostic Test Run
- **Purpose**: Records results of automated diagnostics suites.
- **Key Fields**:
  - `id` (UUID, primary key)
  - `service_connection_id` (UUID, references Service Connection Profile)
  - `scenario` (enum: `latency_spike`, `timeout`, `malformed_payload`, `permission_denied`, `upstream_outage`, `other`)
  - `status` (enum: `pass`, `fail`, `blocked`)
  - `executed_by` (UUID, references `users.id` when manual, nullable for scheduled runs)
  - `started_at` / `completed_at` (timestamptz)
  - `duration_ms` (integer)
  - `evidence_url` (text, nullable — points to Supabase storage artifact)
  - `notes` (text, nullable)
- **Relationships**:
  - Belongs to Service Connection Profile
  - Optional link to Error Events generated during run
- **Validation Rules**:
  - `status=pass` requires `duration_ms` present and non-negative.
  - `status=fail` must include `notes` or `evidence_url`.
  - `completed_at` must be ≥ `started_at`.
- **State Transitions**:
  - Created with `status=pass|fail|blocked`; immutable after record inserted (new run for retry).

## 3. Error Event
- **Purpose**: Captures backend failures with user-facing and operator details.
- **Key Fields**:
  - `id` (UUID, primary key)
  - `service_connection_id` (UUID, references Service Connection Profile)
  - `correlation_id` (UUID/text, required)
  - `severity` (enum: `info`, `warning`, `error`, `critical`)
  - `error_code` (text — maps to `CosplansError.code`)
  - `user_message` (text)
  - `operator_context` (jsonb — stack trace hashes, Supabase response payload excerpts)
  - `occured_at` (timestamptz)
  - `acknowledged_at` (timestamptz, nullable)
  - `acknowledged_by` (UUID, references `users.id`, nullable)
- **Relationships**:
  - Belongs to Service Connection Profile
  - May connect to diagnostics via correlation id (soft link)
- **Validation Rules**:
  - `severity=critical` triggers alert pipeline and requires `operator_context`.
  - `user_message` limited to 280 characters.
  - `acknowledged_at` must accompany `acknowledged_by`.
- **Lifecycle**:
  - Created on incident detection.
  - Moves to “acknowledged” when operator confirms receipt.
  - Archived after 90 days per retention policy.

## 4. Health Snapshot (Materialized View)
- **Purpose**: Aggregated view powering dashboards and alerts.
- **Definition**:
  - Columns: `service_connection_id`, `current_status`, `uptime_percent_24h`, `recent_failures` (int), `last_heartbeat_at`, `last_error_event_id`.
  - Backed by nightly refresh + immediate refresh on heartbeat job completion.
- **Usage**:
  - Drives configuration UI, alert thresholds, and reporting APIs.
- **Notes**:
  - Not user-editable; derived from Service Connection Profiles and Error Events.
