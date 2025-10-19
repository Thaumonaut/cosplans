-- Migration: Service health monitoring enhancements
-- Created: 2025-10-18
-- Description: Introduce heartbeat tracking table, health status enums, and refreshed health snapshot view.

-- Enumerated types for heartbeat outcomes and health status
create type if not exists public.service_connection_heartbeat_status as enum ('pass', 'fail');
create type if not exists public.service_health_status as enum ('active', 'degraded', 'error');

-- Heartbeat events table
create table if not exists public.service_connection_heartbeats (
  id uuid primary key default uuid_generate_v4(),
  service_connection_id uuid not null references public.service_connection_profiles(id) on delete cascade,
  status public.service_connection_heartbeat_status not null,
  latency_ms integer,
  error_code text,
  error_event_id uuid references public.error_events(id) on delete set null,
  occurred_at timestamptz not null default now(),
  consecutive_failures integer not null default 0,
  created_at timestamptz not null default now(),
  constraint service_connection_heartbeats_latency_nonnegative
    check (latency_ms is null or latency_ms >= 0),
  constraint service_connection_heartbeats_failures_nonnegative
    check (consecutive_failures >= 0)
);

create index if not exists service_connection_heartbeats_connection_idx
  on public.service_connection_heartbeats (service_connection_id, occurred_at desc);

-- Refresh materialized view definition with new metrics

drop materialized view if exists public.service_health_snapshots;

do $$ begin
  -- ensure dependent index is removed before recreation
  if exists (select 1 from pg_class where relname = 'service_health_snapshots_connection_idx') then
    execute 'drop index if exists service_health_snapshots_connection_idx';
  end if;
end $$;

create materialized view public.service_health_snapshots as
with latest as (
  select
    h.service_connection_id,
    h.status,
    h.latency_ms,
    h.error_code,
    h.error_event_id,
    h.consecutive_failures,
    h.occurred_at,
    row_number() over (partition by h.service_connection_id order by h.occurred_at desc) as row_num
  from public.service_connection_heartbeats h
),
window_24h as (
  select
    h.service_connection_id,
    count(*) filter (where h.occurred_at >= now() - interval '24 hours') as total_events,
    count(*) filter (where h.status = 'pass' and h.occurred_at >= now() - interval '24 hours') as successful_events,
    count(*) filter (where h.status = 'fail' and h.occurred_at >= now() - interval '24 hours') as failed_events
  from public.service_connection_heartbeats h
  where h.occurred_at >= now() - interval '24 hours'
  group by h.service_connection_id
)
select
  sc.id as service_connection_id,
  coalesce(
    (
      select case
        when l.status = 'fail' and l.consecutive_failures >= 2 then 'error'
        when l.status = 'fail' then 'degraded'
        else 'active'
      end::public.service_health_status
      from latest l
      where l.service_connection_id = sc.id
      and l.row_num = 1
    ),
    'active'::public.service_health_status
  ) as current_status,
  case
    when w.total_events is null or w.total_events = 0 then 100
    else greatest(0, least(100, (w.successful_events::numeric / w.total_events::numeric) * 100))
  end as uptime_percent_24h,
  coalesce(w.failed_events, 0) as recent_failures,
  (
    select l.occurred_at
    from latest l
    where l.service_connection_id = sc.id
    and l.row_num = 1
  ) as last_heartbeat_at,
  (
    select l.error_event_id
    from latest l
    where l.service_connection_id = sc.id
    and l.row_num = 1
  ) as last_error_event_id,
  (
    select l.latency_ms
    from latest l
    where l.service_connection_id = sc.id
    and l.row_num = 1
  ) as last_latency_ms,
  (
    select l.consecutive_failures
    from latest l
    where l.service_connection_id = sc.id
    and l.row_num = 1
  ) as consecutive_failures,
  (
    select l.error_code
    from latest l
    where l.service_connection_id = sc.id
    and l.row_num = 1
  ) as last_error_code
from public.service_connection_profiles sc
left join window_24h w on w.service_connection_id = sc.id;

create unique index if not exists service_health_snapshots_connection_idx
  on public.service_health_snapshots (service_connection_id);

comment on materialized view public.service_health_snapshots is
  'Aggregated health signals for service connections, refreshed by the heartbeat job.';

-- Helper function to refresh snapshot view
create or replace function public.refresh_service_health_snapshots()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  refresh materialized view public.service_health_snapshots;
end;
$$;
