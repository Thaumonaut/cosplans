# Phase 0 Research — Backend Service Reliability & Error Transparency

## Supabase Environment Configuration & Connection Testing
- **Decision**: Use dedicated service role keys per environment stored in Bun-compatible `.env` files, run `supabase db remote commit` migrations from CI, and expose environment metadata via `SupabaseClient.from('service_connections')` health view.
- **Rationale**: Aligns with Supabase security guidance—service role keys stay server-side, RLS remains active, and environment switching simply swaps env vars. CI-driven migrations keep schemas in sync so connection tests reflect real production shape.
- **Alternatives Considered**:
  - Single global service role key across environments — rejected: cross-environment blast radius and violates principle of least privilege.
  - User-supplied anonymous keys for diagnostics — rejected: lacks elevated permissions needed for health probes.

## Automated Diagnostics Coverage Strategy
- **Decision**: Implement diagnostics as Bun test suites invoking Supabase edge function mocks plus MSW-powered failure simulations (timeouts, malformed payloads, RLS denials) with results persisted to a `diagnostic_runs` table.
- **Rationale**: Bun test runner keeps execution fast; MSW allows deterministic failure injection without hitting real services. Persisted results meet requirement for 90-day evidence retention.
- **Alternatives Considered**:
  - Live-fire diagnostics against production Supabase — rejected: risky and slow, conflicts with requirement to avoid corrupting data.
  - Custom Node-based harness — rejected: violates Bun runtime mandate and duplicates tooling.

## Error Translation & Monitoring Signals
- **Decision**: Standardize backend errors into a `CosplansError` shape containing `code`, `severity`, `userMessage`, and `operatorContext`, log with structured Bun logger, and publish health metrics via Supabase Functions plus 5-minute cron.
- **Rationale**: Provides consistent mapping for frontend messaging, keeps operator detail out of UI, and leverages Supabase edge functions for scheduled health updates without additional infrastructure.
- **Alternatives Considered**:
  - Exposing raw Supabase errors to frontend — rejected: confusing for users, leaks internal codes.
  - External monitoring SaaS — rejected: adds cost/complexity; Supabase functions suffice for heartbeat metrics.
