# Constitution Update Summary v3.0.0

## Version Change: 2.5.0 → 3.0.0 (MAJOR)

This is a MAJOR version bump because we're adding fundamental new core principles that change the application's governance, business model, and development workflow.

## New Core Principles Added

### 1. **Principle I.5: Reduce Overwhelm via Prioritization**
- **Max 3 Active Projects** for free tier users
- Unlimited **Idea Bank** for future concepts
- Primary conversion hook for free-to-paid upgrade
- Addresses core problem: project overload and stress

### 2. **Principle II.7: Community Trust & Accountability (Reputation System)**
- **Tier-based reputation** (Building → Exemplary)
- Based on last 12 months of event attendance data
- Event restrictions by tier (Flaky/Unreliable get limited access)
- **Reputation Grace**: 2 tokens per 12 months for emergencies
- Transparent, non-punitive progression system

### 3. **Principle II.8: Temp/Event Teams**
- Short-lived teams for specific photoshoots/events
- Auto-archive 7 days after event date
- Public discovery board for finding collaborators
- Free to create for all tiers
- Optional conversion to permanent team

### 4. **Principle III.5: Flexible & Fair Monetization**
- **$5/month Growth Premium** as primary tier
- **0% commission** on marketplace transactions for free tier
- Aggressive competitive advantage against industry (5-20% standard)
- Commission-based revenue model for sustainability
- Paid tier gets 0% commission (customer acquisition strategy)

### 5. **Principle V.5: AI is Assistive, Not Creative (Updated)**
- AI features **strictly opt-in**
- Restricted to planning/brainstorming/organizational tasks only
- **[AI-Assisted] tag** required on publicly displayed AI-generated content
- Governed by **AI Credit System** (cost-based, rollover allowed)
- Free tier: 20 AI requests/month, Premium: 500/month

### 6. **Principle VI.7: Spec-Driven Development Workflow**
- **GitHub Spec Kit** four-phase workflow MANDATORY
- Human validation at every checkpoint
- AI agents for task breakdown and code drafting
- Prevents scope creep and ensures quality
- All features must have spec before implementation

### 7. **Principle VII.5: Dependency-First Development**
- Features with high dependencies (Reputation, Stripe) built FIRST
- Prevents rework and architectural debt
- Clear dependency roadmap in Build Strategy
- Example: Reputation → Event Restrictions → Reviews

### 8. **Principle VIII.5: Solo Developer Efficiency & Cost Optimization**
- **Cloudflare R2** for media storage (cheaper than Supabase)
- **Cloudflare Workers** for high-cost logic (3M/month free)
- **XMP Metadata Export** instead of expensive LR/C1 plugins
- Target: $0/month during Soft Launch phase
- Supabase Free Tier compliance mandatory until P3

## New Sections Added

### Reputation System Details
- 6 tiers: Exemplary, Reliable, Consistent, Building, Flaky, Unreliable
- Metrics: events attended, on-time rate, no-shows, ratings
- Custom leave-by dates per event
- Cancellation severity levels (Lenient → Critical)
- Post-event mutual ratings (1-5 stars + categories)

### Temp Team System
- Discovery by fandom, location, date, skill level
- Safety features: account age, past ratings, report system
- Post-event: photo gallery, easy re-invite
- Prevents permanent team bloat for one-off collaborations

### Monetization Tiers

**Free Forever:**
- 1 personal team
- 3 active projects (Idea Bank unlimited)
- Join 1 permanent team + unlimited temp teams
- 5GB storage
- 20 AI requests/month
- 5% marketplace commission

**Premium Monthly ($12/mo or $120/year):**
- Unlimited active projects
- Create 3 permanent teams, join 5
- 50GB storage
- 500 AI requests/month
- 0% marketplace commission
- All integrations (Google Docs, Pinterest, Notion, Instagram, TikTok)

**Team Premium ($35/mo or $350/year):**
- Purchase for specific team (up to 15 members benefit)
- 200GB shared storage
- 2000 AI requests/month (shared)
- Team analytics

**Lifetime ($399, early adopter $299):**
- One-time payment
- 500 AI requests/month (capped)
- 100GB storage (capped)
- Upgrade pricing for existing subscribers (50-90% credit)

### Phased Release Strategy

**Phase 1 - Beta Launch (P1 Core):**
- Auth, Personal Team, Basic Project Management
- FREE FOREVER to test retention
- Must remain on Supabase Free Tier

**Phase 2 - Soft Launch (P2 Accountability):**
- Temp Teams, Reputation System, Event Ratings
- Enforce 3 Active Project Limit
- Goal: 200 active users

**Phase 3 - V1.0 Launch (P3 Monetization):**
- Commission Marketplace, Stripe Connect
- Growth Premium ($5/mo) launch
- 0% commission fee live
- Goal: $500/month recurring OR $1,000 GMV

**Phase 4 - P4/P5 Growth:**
- AI Features (gated), XMP Sync, Social Scheduling
- Pro Premium tier for professionals
- Goal: Sustainable revenue exceeding costs

## Technical Implementation Directives

### Storage & Cost Control
- **Cloudflare R2** for all media uploads
- **Cloudflare Workers** for Reputation logic (not Supabase Edge Functions)
- Cold storage for archived teams (10x cheaper)
- Aggressive image optimization (WebP, responsive sizes)

### Monetization Core
- **Stripe Connect** setup prioritized for P3
- 0% commission enforced via payment logic
- Escrow model for creator payments
- Weekly or on-demand payouts

### Image Delivery Sync
- **XMP Metadata Export/Import** for P4
- Client-side culling data → XMP sidecar files
- Import to Capture One/Lightroom desktop
- Near-zero cost vs dedicated plugins (deferred to P7+)

### AI Credit System
- Cost-based credits (simple task = 1, image gen = 10)
- Rollover unused credits (up to 2x monthly limit)
- Add-on packs: $5 for 100 extra requests
- Free features (templates, checklists) don't count

## Compliance & Governance Updates

### Spec-Driven Workflow Mandate
- ALL development must follow Spec Kit phases:
  1. Specify (write spec.md)
  2. Plan (generate plan.md)
  3. Task (break into tasks.md)
  4. Implement (execute tasks)
- Human validation required at each checkpoint
- No implementation without approved spec

### Dependency-First Ordering
- Build order must respect dependencies:
  1. Attendance Tracking → Reputation Engine → Tier Display
  2. Stripe Connect → Commission Payments → Service Booking
  3. Client Proofing → XMP Export/Import
  4. Reputation → Two-Way Reviews → Provider Profiles
  5. AI Credit System → Core AI Integrations

### Cost Optimization Requirements
- Monthly infrastructure cost must stay <$50 per team during beta
- If costs exceed 50% of revenue, pricing adjustments required
- 90-day notice for major pricing changes
- If unsustainable: 180-day export window + MIT license open-source

## Templates Requiring Updates

### ⚠ spec-template.md
- Add reputation system requirements section
- Add monetization tier considerations
- Add cost optimization checkpoints

### ⚠ plan-template.md
- Add dependency analysis section
- Add cost impact assessment
- Add spec-driven workflow checkpoints

### ⚠ tasks-template.md
- Add dependency-first task ordering
- Add cost optimization tasks category
- Add reputation system tasks

### ⚠ quickstart.md
- Document spec-driven workflow
- Add reputation system overview
- Add temp team creation guide

## Follow-Up Implementation TODOs

1. **Reputation System:**
   - [ ] Build reputation calculation engine (Cloudflare Worker)
   - [ ] Create tier badge UI components
   - [ ] Implement event attendance tracking
   - [ ] Build post-event rating system
   - [ ] Add reputation grace token management

2. **Temp Teams:**
   - [ ] Create temp team creation flow
   - [ ] Build discovery/search interface
   - [ ] Implement auto-archive system (7 days post-event)
   - [ ] Add conversion to permanent team option

3. **Monetization:**
   - [ ] Set up Stripe Connect integration
   - [ ] Implement 0% commission logic for free tier
   - [ ] Build subscription management UI
   - [ ] Create marketplace payment flow
   - [ ] Implement max 3 active projects limit

4. **Cost Optimization:**
   - [ ] Migrate to Cloudflare R2 for media storage
   - [ ] Deploy reputation logic to Cloudflare Workers
   - [ ] Implement cold storage for archived teams
   - [ ] Set up cost monitoring dashboard

5. **AI System:**
   - [ ] Build AI credit tracking system
   - [ ] Implement credit rollover logic
   - [ ] Create AI request quota enforcement
   - [ ] Add [AI-Assisted] tagging system

6. **Spec-Driven Workflow:**
   - [ ] Update all templates with new requirements
   - [ ] Create spec-driven workflow documentation
   - [ ] Train on GitHub Spec Kit usage
   - [ ] Establish checkpoint review process

## Commit Message

```
docs: amend constitution to v3.0.0 (major governance update)

BREAKING CHANGES:
- Add 7 new core principles (prioritization, reputation, monetization, spec-driven, dependency-first, cost optimization)
- Mandate GitHub Spec Kit workflow for all development
- Introduce reputation system with tier-based accountability
- Define monetization strategy (0% commission, $5 Growth Premium)
- Require Cloudflare R2/Workers for cost optimization
- Add temp/event teams for short-lived collaboration
- Update AI principles to strict opt-in with credit system

This is a major version bump as it fundamentally changes:
- Development workflow (spec-driven mandatory)
- Business model (0% commission competitive advantage)
- User experience (max 3 projects, reputation tiers)
- Technical architecture (Cloudflare over Supabase for cost)

Refs: PLAN/Build Strategy, PLAN/Release Strategy, PLAN/cosplay_app_spec.md
```

## Next Steps

1. Review this summary for accuracy and completeness
2. Selectively update constitution sections with new principles
3. Update affected templates (spec, plan, tasks, quickstart)
4. Create implementation specs for reputation system (highest priority)
5. Begin P1 Beta Launch development following spec-driven workflow
