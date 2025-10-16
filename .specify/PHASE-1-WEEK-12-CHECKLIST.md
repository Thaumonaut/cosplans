# Phase 1 MVP Implementation: Week 12 Checklist

**Timeline**: Week 12 (5 working days)  
**Focus**: Deployment - CI/CD Pipeline, Staging, Production Launch  
**Deliverable**: Live product running on production infrastructure  
**Dependency**: Week 1-11 must be merged first

---

## 🎯 Acceptance Criteria

### CI/CD Pipeline Setup (GitHub Actions)

- [ ] **Build Pipeline**
  - Trigger: on every push to `main` branch
  - Steps:
    1. Install dependencies: `npm ci`
    2. Lint code: `npm run lint` (ESLint)
    3. Check types: `npm run check` (TypeScript)
    4. Run tests: `npm run test`
    5. Build app: `npm run build`
  - Pass/Fail: show status on PR

- [ ] **Test Coverage Gate**
  - Require: 70%+ coverage before merge
  - Fail build if coverage drops
  - Exception: manual override for urgent fixes (with comment)

- [ ] **Deployment Pipeline**
  - Trigger: on merge to `main` + on manual trigger
  - Stages:
    1. Build Docker image (if using containers)
    2. Deploy to staging
    3. Run smoke tests (automated)
    4. Await manual approval for production
    5. Deploy to production

- [ ] **Secrets Management**
  - GitHub Secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DATABASE_PASSWORD`, `SENDGRID_API_KEY`, etc.
  - Never commit secrets to git
  - Rotate secrets monthly (or on employee departure)

### Staging Environment

- [ ] **Staging Infrastructure**
  - Database: separate Supabase project (staging)
  - API: deployed to staging domain: `staging-api.cosplans.app`
  - Frontend: deployed to: `staging.cosplans.app`
  - Environment: mirrors production (but smaller capacity)

- [ ] **Staging Data**
  - Anonymized copy of production data (for testing)
  - Or: seeded with test data (shoots, costumes, crew)
  - Reset daily (or on demand) to clean state

- [ ] **Smoke Tests in Staging**
  - Automated tests: login, create shoot, view costumes, etc.
  - Run: after deployment, before production
  - Fail fast: if tests fail, don't deploy to production

- [ ] **Manual Testing Checklist**
  - QA manual tests:
    - Create shoot (full flow)
    - Upload costume image + verify optimization
    - Schedule Instagram post
    - Test on mobile (iOS + Android)
  - Sign-off: required before production deployment

### Production Environment

- [ ] **Production Infrastructure**
  - Hosting: Vercel or Netlify (recommended for SvelteKit)
    - Or: Self-hosted on AWS/GCP/Azure (more complex)
  - Domain: `cosplans.app`
  - API: `api.cosplans.app`
  - Database: Supabase (production region: EU for GDPR)
  - CDN: auto-configured by Vercel/Netlify

- [ ] **SSL/TLS Certificate**
  - HTTPS enabled on all domains
  - Certificate auto-renewed (Vercel/Netlify handles)
  - Enforce HTTPS: redirect HTTP → HTTPS

- [ ] **Database Backups**
  - Supabase automatic backups (daily)
  - Backup retention: 30 days
  - Test: restore from backup (monthly)
  - Document: backup location, restore process

- [ ] **Database Migrations**
  - Apply migrations on deployment
  - Migrations idempotent (safe to run multiple times)
  - Rollback plan: keep previous schema version
  - Verify: migrations work in staging first

- [ ] **Environment Variables**
  - Production secrets loaded from GitHub Secrets
  - Do NOT commit `.env.production` to git
  - Document: which env vars required (see `env.example`)
  - Log rotation: ensure logs don't contain secrets

- [ ] **Error Tracking** (Stretch Goal)
  - Sentry integration (for Phase 2)
  - For MVP: log errors to console, notify via email

- [ ] **Monitoring & Alerting** (Stretch Goal)
  - Uptime monitoring (Pingdom, UptimeRobot)
  - Error rate alerts
  - Performance alerts (page load time, API latency)
  - For MVP: manual checks or basic monitoring

### Deployment Process

- [ ] **Pre-Deployment Checklist**
  - [ ] All tests passing locally
  - [ ] Code reviewed and approved (2+ reviewers)
  - [ ] Changelog updated
  - [ ] Database migrations tested in staging
  - [ ] Performance benchmarks reviewed (no degradation)
  - [ ] Accessibility audit passed

- [ ] **Deployment Steps**
  1. Merge PR to `main`
  2. GitHub Actions runs CI/CD pipeline
  3. Build succeeds, coverage >70%
  4. Deploy to staging
  5. Run smoke tests in staging
  6. Manual QA sign-off
  7. Manual trigger: deploy to production
  8. Run production health checks
  9. Monitor for errors (1 hour after deploy)

- [ ] **Post-Deployment Verification**
  - [ ] Website loads (< 3s page load)
  - [ ] Login works (test account)
  - [ ] Create shoot works end-to-end
  - [ ] API endpoints responding (<500ms)
  - [ ] Database connections healthy
  - [ ] No errors in production logs
  - [ ] Error rate <0.1%

- [ ] **Rollback Plan**
  - If production broken: revert to last known-good version
  - GitHub Actions: manual trigger for rollback
  - Rollback time target: <5 minutes

### Domain & DNS Setup

- [ ] **Domain Registration**
  - `cosplans.app` registered (using Namecheap, GoDaddy, etc.)
  - Registrar: set nameservers to hosting provider (Vercel, Netlify, etc.)

- [ ] **DNS Records**
  - A record: `cosplans.app` → hosting provider
  - CNAME: `www.cosplans.app` → `cosplans.app`
  - CNAME: `api.cosplans.app` → API server
  - MX records: email routing (for transactional emails)
  - TXT: SPF, DKIM for email deliverability

- [ ] **Email Configuration** (SendGrid)
  - SPF record: `v=spf1 sendgrid.net ~all`
  - DKIM: add SendGrid-provided DKIM records
  - Verify domain in SendGrid dashboard

### Documentation for Deployment

- [ ] **Deployment Guide** (`.specify/deployment-guide.md`)
  - How to deploy to staging
  - How to deploy to production
  - Rollback procedure
  - Monitoring & alerts
  - Troubleshooting common issues

- [ ] **Environment Setup** (`.env.example`)
  - Document all required env variables
  - Example values (but no real secrets)

- [ ] **Runbook** (`.specify/runbook.md`)
  - What to do if production is down
  - Who to contact
  - Escalation procedure
  - Common issues & solutions

- [ ] **Monitoring Dashboard** (if applicable)
  - Link to Uptime Robot, Sentry, etc.
  - Key metrics to watch
  - Alert thresholds

### Launch Announcements

- [ ] **Pre-Launch**
  - Create launch date
  - Prepare announcement (blog post, social media)
  - Invite beta testers (if applicable)

- [ ] **Launch Day**
  - Deploy to production
  - Announce on social media: "Cosplans is live! Join the creator community"
  - Email announcement to waitlist (if any)
  - Monitor closely for issues

- [ ] **Post-Launch**
  - Monitor error rates (first 24 hours)
  - Collect user feedback
  - Plan Phase 1.5 (Creator Marketplace) based on usage

### Testing (Final Verification)

- [ ] **Production Smoke Tests**
  - API health check: `GET /api/health` returns `{ status: "ok" }`
  - Login endpoint responds
  - Create resource works
  - Database reachable

- [ ] **E2E Tests in Production**
  - Run Playwright tests against production URL
  - Tests should pass (or fail with clear error)
  - Example: create test shoot, verify in UI, delete

- [ ] **Load Testing in Staging** (Optional)
  - Simulate 100 concurrent users
  - Measure: response time, error rate
  - Target: <2% error rate, <1s p95 response time

---

## 🔗 Constitution References

**Principle II (Real-Time, Mobile-Responsive)**
- [ ] Production supports real-time sync (Supabase Realtime)
- [ ] Mobile responsive (tested on iOS + Android)

**Principle VII (Security & Privacy)**
- [ ] HTTPS enforced
- [ ] Database backups secure
- [ ] Secrets not exposed in logs

**Technology Stack (Constitution v2.2.0)**
- [ ] Vercel/Netlify deployment (SvelteKit optimized)
- [ ] Supabase production region (EU)
- [ ] GitHub Actions for CI/CD
- [ ] SendGrid for email

---

## 📦 Deliverables

### Configuration
- [ ] `.github/workflows/deploy.yml` (GitHub Actions workflow)
- [ ] `.env.example` (environment variables template)
- [ ] `vercel.json` or `netlify.toml` (deployment config)
- [ ] `supabase/migrations/` (all database migrations)

### Documentation
- [ ] Deployment guide
- [ ] Environment setup
- [ ] Runbook (incident response)
- [ ] Monitoring dashboard links

### Infrastructure
- [ ] Domain registered and DNS configured
- [ ] Staging environment live
- [ ] Production environment live
- [ ] SSL/TLS certificates active
- [ ] Database backups configured

### Monitoring
- [ ] Production health check endpoint
- [ ] Error logging (console for MVP, Sentry for Phase 2)
- [ ] Uptime monitoring (if using service)

---

## 📋 Daily Breakdown

**Days 1-2**: CI/CD Pipeline + GitHub Actions
- Create GitHub Actions workflow
- Test locally: `npm run lint`, `npm run test`, `npm run build`
- Verify pipeline runs on PR

**Days 2-3**: Staging Environment
- Deploy to staging
- Run smoke tests
- Manual QA testing

**Days 3-4**: Production Deployment
- Deploy to production
- Run health checks
- Monitor for errors

**Days 4-5**: Documentation + Launch
- Write deployment guide
- Write runbook
- Prepare launch announcement
- Deploy to production (if all clear)
- Launch! 🚀

---

## ⚠️ Known Considerations

| Item | Impact | Resolution |
|------|--------|-----------|
| **Downtime** | MVP cannot be down during deployment | Use blue-green deployment or canary deployment (advanced) |
| **Data Migration** | If schema changes, need migration strategy | Supabase migrations handle this; test thoroughly in staging |
| **Secrets Rotation** | Security best practice | Automate using GitHub Actions (quarterly) |

---

## ✅ Sign-Off Criteria

**Week 12 COMPLETE when**:
1. ✅ CI/CD pipeline working (tests pass → deploy to staging)
2. ✅ Staging environment live and tested
3. ✅ Production environment live and healthy
4. ✅ HTTPS working (no warnings)
5. ✅ Database backups configured
6. ✅ Smoke tests passing in production
7. ✅ Domain configured (cosplans.app)
8. ✅ Deployment guide documented
9. ✅ Runbook documented
10. ✅ Product launched! 🚀

---

**Timeline**: Week 12 of 12  
**Dependency**: Week 1-11 merged  
**Next**: Phase 1.5 (Creator Community Marketplace) or maintenance/iteration based on user feedback

---

## 🎉 Phase 1 MVP Complete!

Congratulations! By completing all 12 weeks, you've built:
- ✅ Multi-team project management (Shoots, Costumes, Props)
- ✅ Real-time collaboration (Yjs CRDT + Supabase)
- ✅ Authentication (OAuth, Passkeys, 2FA)
- ✅ Image optimization (Sharp pipeline)
- ✅ Instagram integration (Content calendar + scheduling)
- ✅ Permissions system (@casl/ability + RLS)
- ✅ Google integrations (Maps, Calendar, Docs)
- ✅ 70%+ test coverage + WCAG 2.1 AA compliance
- ✅ Production-ready deployment

**Next Steps**:
1. Gather user feedback during first week of launch
2. Plan Phase 1.5: Creator Community Marketplace
3. Consider Phase 2 features: Advanced analytics, AI captions, commission system

**Thank you for building Cosplans!** 🎬👗✨
