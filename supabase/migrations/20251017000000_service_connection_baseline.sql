-- Migration: Backend Service Reliability & Error Transparency (042-setup-and-connect)
-- Created: 2025-10-17
-- Description: Establish core tables, types, and materialized view for service connection monitoring.

create extension if not exists "uuid-ossp";

-- Enumerated types
create type public.service_connection_service_type as enum (
  'supabase',
  'google_calendar',
  'google_maps',
  'email',
  'external_api'
);

create type public.service_connection_environment as enum (
  'development',
  'staging',
  'production'
);

create type public.service_connection_status as enum (
  'inactive',
  'pending_verification',
  'active',
  'error'
);

create type public.diagnostic_scenario as enum (
  'latency_spike',
  'timeout',
  'malformed_payload',
  'permission_denied',
  'upstream_outage',
  'other'
);

create type public.diagnostic_run_status as enum (
  'pass',
  'fail',
  'blocked'
);

create type public.diagnostic_trigger_type as enum (
  'manual',
  'scheduled'
);

create type public.error_event_severity as enum (
  'info',
  'warning',
  'error',
  'critical'
);

-- Service connection profiles
create table if not exists public.service_connection_profiles (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null,
  service_type public.service_connection_service_type not null,
  environment public.service_connection_environment not null,
  supabase_project_ref text,
  status public.service_connection_status not null default 'inactive',
  last_verified_at timestamptz,
  connection_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_connection_profiles_unique_team_service_environment
    unique (team_id, service_type, environment)
);

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create index if not exists service_connection_profiles_team_status_idx
  on public.service_connection_profiles (team_id, status);

create trigger service_connection_profiles_set_updated_at
  before update on public.service_connection_profiles
  for each row execute function public.update_updated_at_column();

-- Diagnostic test runs
create table if not exists public.diagnostic_test_runs (
  id uuid primary key default uuid_generate_v4(),
  service_connection_id uuid not null references public.service_connection_profiles(id) on delete cascade,
  scenario public.diagnostic_scenario not null,
  status public.diagnostic_run_status not null,
  trigger_source public.diagnostic_trigger_type not null default 'manual',
  executed_by uuid,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_ms integer,
  evidence_url text,
  notes text,
  created_at timestamptz not null default now(),
  constraint diagnostic_test_runs_completed_after_start
    check (completed_at is null or completed_at >= started_at),
  constraint diagnostic_test_runs_duration_nonnegative
    check (duration_ms is null or duration_ms >= 0),
  constraint diagnostic_test_runs_pass_requires_duration
    check (status <> 'pass' or duration_ms is not null),
  constraint diagnostic_test_runs_fail_requires_detail
    check (status <> 'fail' or coalesce(notes, '') <> '' or evidence_url is not null)
);

create index if not exists diagnostic_test_runs_connection_idx
  on public.diagnostic_test_runs (service_connection_id);

create index if not exists diagnostic_test_runs_started_at_idx
  on public.diagnostic_test_runs (started_at desc);

-- Error events
create table if not exists public.error_events (
  id uuid primary key default uuid_generate_v4(),
  service_connection_id uuid not null references public.service_connection_profiles(id) on delete cascade,
  correlation_id uuid not null,
  severity public.error_event_severity not null default 'error',
  error_code text not null,
  user_message text not null,
  operator_context jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  acknowledged_by uuid,
  created_at timestamptz not null default now(),
  constraint error_events_user_message_length
    check (char_length(user_message) <= 280),
  constraint error_events_acknowledged_pair
    check ((acknowledged_at is null) = (acknowledged_by is null))
);

create index if not exists error_events_connection_idx
  on public.error_events (service_connection_id);

create index if not exists error_events_occurred_at_idx
  on public.error_events (occurred_at desc);

create index if not exists error_events_correlation_idx
  on public.error_events (correlation_id);

-- Materialized view snapshot
create materialized view if not exists public.service_health_snapshots as
select
  sc.id                                       as service_connection_id,
  sc.status                                   as current_status,
  100.0::numeric                              as uptime_percent_24h,
  coalesce(recent.recent_failure_count, 0)    as recent_failures,
  null::timestamptz                           as last_heartbeat_at,
  recent.last_error_event_id                  as last_error_event_id
from public.service_connection_profiles sc
left join lateral (
  select
    count(*) filter (where ee.occurred_at >= now() - interval '24 hours') as recent_failure_count,
    (
      select ee2.id
      from public.error_events ee2
      where ee2.service_connection_id = sc.id
      order by ee2.occurred_at desc
      limit 1
    ) as last_error_event_id
  from public.error_events ee
  where ee.service_connection_id = sc.id
) recent on true;

create unique index if not exists service_health_snapshots_connection_idx
  on public.service_health_snapshots (service_connection_id);

comment on materialized view public.service_health_snapshots is
  'Aggregated health signals for service connections. Refresh via diagnostics heartbeat job.';
