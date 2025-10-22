# Performance Checklist: Teams Creation

**Feature**: Teams Creation (021-shoots-teams-creation)  
**Date**: October 20, 2025

---

## Response Time Targets (from spec)

- [ ] Team operations complete in <500ms (SC-008)
- [ ] Real-time updates arrive in <1s (SC-006)
- [ ] Support 1000+ teams per user (SC-007)
- [ ] Team invitation email sent within 10s (SC-002)
- [ ] User can create team in <1 minute (SC-001)

## Database Performance

### Query Optimization

- [ ] All foreign keys have indexes
- [ ] `teams.owner_id` indexed for fast lookups
- [ ] `team_members.user_id` indexed for user queries
- [ ] `team_members.team_id` indexed for team queries
- [ ] Composite index on `team_members(team_id, user_id)`
- [ ] `team_invitations.token` indexed for fast lookups
- [ ] `team_invitations.email` indexed for pending checks
- [ ] Partial index on `teams.archived_at` for active teams

### Query Efficiency

- [ ] N+1 queries eliminated (use joins or batch loading)
- [ ] Team list loads with single query + member counts
- [ ] Team details loads with single query + members
- [ ] Pagination uses cursor-based approach for large lists
- [ ] Real-time subscriptions filtered by RLS
- [ ] Database connection pooling configured
- [ ] Query plans reviewed for slow queries

## API Performance

### Response Times

- [ ] GET /teams responds in <200ms
- [ ] GET /teams/:id responds in <200ms
- [ ] POST /teams responds in <500ms
- [ ] POST /teams/:id/invite responds in <500ms
- [ ] POST /invite/:token/accept responds in <500ms
- [ ] PATCH /teams/:id/members responds in <300ms
- [ ] DELETE /teams/:id/members/:userId responds in <300ms

### Payload Optimization

- [ ] API responses include only necessary fields
- [ ] Large lists paginated (20-50 items per page)
- [ ] Member lists limited to active members by default
- [ ] Image URLs use CDN when available
- [ ] JSON responses compressed (gzip/brotli)
- [ ] Unnecessary data not fetched from database

## Frontend Performance

### Initial Load

- [ ] Teams list page loads in <2s (FCP)
- [ ] Team details page loads in <2s (FCP)
- [ ] Critical CSS inlined for above-fold content
- [ ] JavaScript bundles code-split by route
- [ ] Fonts preloaded to prevent FOIT
- [ ] Images lazy loaded below fold

### Runtime Performance

- [ ] Team list renders 100+ teams without lag
- [ ] Search/filter responds in <100ms
- [ ] Form submissions show immediate feedback
- [ ] Optimistic UI updates for instant feel
- [ ] Real-time updates don't cause layout shift
- [ ] Smooth scrolling on large lists
- [ ] No memory leaks in long-running sessions

### Bundle Size

- [ ] Teams feature bundle <50KB gzipped
- [ ] Shared dependencies deduplicated
- [ ] Unused code tree-shaken
- [ ] Third-party libraries minimized
- [ ] Polyfills loaded conditionally

## Real-Time Performance

- [ ] Supabase Realtime connection established <1s
- [ ] Member updates propagate in <1s
- [ ] Multiple simultaneous updates handled gracefully
- [ ] Reconnection after network loss <2s
- [ ] No duplicate updates received
- [ ] Updates batched when multiple changes occur
- [ ] Real-time subscriptions cleaned up on unmount

## Scalability

### User Scale

- [ ] Support 1000+ teams per user
- [ ] Support 1000+ members per team
- [ ] Pagination works efficiently at scale
- [ ] Search performs well with large datasets
- [ ] No performance degradation with growth

### Concurrent Users

- [ ] Multiple users can create teams simultaneously
- [ ] Concurrent invitations handled correctly
- [ ] Race conditions prevented with database constraints
- [ ] Optimistic locking for concurrent updates
- [ ] Real-time updates scale to 100+ concurrent users per team

## Caching Strategy

- [ ] Team list cached on client (invalidate on changes)
- [ ] Team details cached with stale-while-revalidate
- [ ] Member counts cached and updated incrementally
- [ ] Static assets cached with long TTL
- [ ] API responses cached where appropriate
- [ ] Cache invalidation works correctly

## Resource Usage

### Memory

- [ ] No memory leaks in team list
- [ ] No memory leaks in real-time subscriptions
- [ ] Large lists use virtual scrolling if needed
- [ ] Unused components unmounted properly
- [ ] Event listeners cleaned up on unmount

### Network

- [ ] Minimal API calls on page load
- [ ] Redundant requests eliminated
- [ ] Failed requests retried with exponential backoff
- [ ] Request deduplication for concurrent calls
- [ ] WebSocket connection reused for all real-time

### Database Connections

- [ ] Connection pooling configured (max 20 connections)
- [ ] Connections released after queries
- [ ] No connection leaks
- [ ] Long-running queries optimized or eliminated

## Monitoring & Metrics

- [ ] Response time metrics tracked
- [ ] Error rates monitored
- [ ] Database query performance logged
- [ ] Real-time latency measured
- [ ] User-facing performance metrics (Core Web Vitals)
- [ ] Slow query alerts configured
- [ ] Performance regression tests in CI
