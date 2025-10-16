# Cosplans Constitution v2.1.0 - Complete Documentation Index

**Date**: October 16, 2025  
**Project**: Cosplans - Collaborative Shoot Planning, Social Media Integration & Creator Marketplace  
**Status**: Phase 1 Complete, Phase 1.5 (Creator Marketplace) Ready for Implementation

---

## 📋 Core Documents

### 1. Constitution (v2.1.0)
**File**: `.specify/memory/constitution.md`

**Contents**:
- 8 Core Principles (Web-first architecture, real-time collab, external integrations, workflows, visual content, TDD, team roles/crew, **NEW: Creator Marketplace**)
- Principle V.5 - Social Media Workflow Integration (Instagram Phase 1)
- **Principle VIII - Creator Community & Discovery Marketplace** (NEW, Phase 1.5)
- Platform Requirements (web, Android, iOS)
- Development Workflow & Testing
- Security & Privacy Architecture (GDPR, OAuth, encryption)
- User Analytics & Ethical Data Collection
- **Sustainability Model & Feature Paywalls** (Commission-based revenue model)
- Technical Architecture & Implementation Standards
- Governance & Amendment Process

**Key Decisions**:
- Added: Creator Marketplace (Phase 1.5) - connects teams with professional creators
- Updated: Revenue model based on transaction commissions (5% free tier, 0% paid tier)
- Updated: Authentication with public usernames for creator discoverability
- Added: Creator privacy controls and verification badge system
- Deferred: Stripe payment processing (now integrated for creator marketplace payments)
- Deferred: SMS reminders as paid option (Phase 2+)
- Maintained: Instagram social media planning (Phase 1.5)
- Owner role added for future governance expansion

---

## 🏗️ Technical Planning Documents

### 2. Phase 0 Research (Research & Unknowns)
**File**: `.specify/plans/phase-0-research.md`

**Covers**:
- Image optimization pipeline (WebP + Sharp.js + Supabase Storage)
- Email integration (SendGrid + Supabase Functions with retry queue)
- Conflict resolution (Operational Transform algorithm)
- Analytics framework (custom PostgreSQL, no third-party vendor)

---

### 3. Data Model v2 (Database Schema)
**File**: `.specify/plans/data-model-v2.md`

**Includes**:
- 12 core tables (users, teams, shoots, costumes, props, crew, images, permissions, analytics)
- **NEW**: Crew management tables (crew, shoot_crew)
- **NEW**: Instagram integration tables (coming in next update)
- Relationships, validation rules, indexes
- Access control matrix (owner, admin, member, viewer roles)
- Migration strategy and example queries

---

### 4. Social Media Integration Spec (Phase 1 Instagram)
**File**: `.specify/plans/social-media-integration-v2.md`

**Details**:
- Instagram content calendar (shoots + posts timeline)
- Draft creation & editing (feed, Stories, Carousel)
- Caption & hashtag templates (by content pillar)
- Post scheduling & publishing (with approval workflow)
- Analytics tracking (engagement, reach, hashtag performance)
- Team collaboration (drafts, comments, approvals)
- API endpoints (~20 new)
- Data models for Instagram integration
- Phase 2+ roadmap (TikTok, Reels, auto-scheduling)
- Testing scenarios and security considerations

---

### 5. Crew Management Spec (Per-Shoot Personnel)
**File**: `.specify/plans/crew-management-spec.md`

**Covers**:
- Crew as persistent personnel records (with work history)
- Per-shoot crew role assignments (photographer, cosplayer, makeup artist, etc.)
- Dual crew management interfaces (dedicated page + shoot inline)
- Contact information access control (all members can view; admins manage)
- Crew visibility in team member interface

---

### 6. Permission Model Update (v1.9 → v2.0)
**File**: `.specify/plans/permission-model-update-v1-9.md`

**Changes**:
- Added Owner role (full control, positioned for future expansion)
- Updated crew contact visibility (all members can view)
- Clarified team-level permissions vs. crew roles (informational)
- Access control matrix with owner/admin/member/viewer

---

### 7. Quickstart Guide (Developer Onboarding)
**File**: `.specify/plans/quickstart.md`

**Includes**:
- Local development setup (PostgreSQL, migrations, seeds)
- Project structure and code patterns
- Real-time sync setup (Supabase Realtime)
- Image upload + optimization code examples
- Conflict resolution UI component
- Permission checking middleware
- Testing setup (Vitest + Playwright)
- Deployment checklist

---

## 🔧 API Specifications

### Contracts
**Directory**: `.specify/plans/contracts/`

**Files** (planned):
- `shoots-api.openapi.yaml` - Shoots CRUD with conflict resolution
- `crew-api.openapi.yaml` - Crew management endpoints
- `images-api.openapi.yaml` - Image upload & optimization
- `instagram-api.openapi.yaml` - Social media integration (Phase 1)

---

## 📚 Supporting Documents

### 8. Copilot Context (AI Assistant Guidance)
**File**: `.github/copilot-context.md`

**Provides**:
- Project overview and tech stack
- Architecture patterns (real-time sync, image optimization, conflict resolution)
- File structure reference
- Common Copilot tasks and code patterns
- Testing standards and compliance checklist

---

### 9. Constitution v2.0 Summary
**File**: `.specify/plans/constitution-v2-0-summary.md`

**Summary of**:
- What changed in v2.0 (social media added, payments/SMS deferred)
- Instagram integration scope and data models
- Phase 1 implementation priorities
- Security considerations
- Testing scenarios
- Future roadmap

---

## 🚀 Implementation Roadmap

### Phase 0: Research ✅ COMPLETE
- [x] Image optimization pipeline (Sharp.js + WebP)
- [x] Email integration (SendGrid + retry queue)
- [x] Conflict resolution (OT algorithm)
- [x] Analytics framework (custom PostgreSQL)

### Phase 1: Core Web Application ✅ COMPLETE & SPECIFICATION FINALIZED
**Implementation Priority Order**:
1. Image optimization (Sharp.js resize, upload)
2. Email reminders (SendGrid integration)
3. Conflict resolution (OT engine + 3-way merge UI)
4. Analytics collection (custom event capture)
5. Core CRUD (shoots, costumes, props)
6. Real-time sync (Supabase Realtime)
7. Crew management (personnel tracking)
8. Team permissions (role-based access)
9. Google Integrations (Maps, Calendar, Docs)
10. Instagram Integration (content calendar, drafts, scheduling, analytics)

**Phase 1 Status**: Specification complete (Constitution + Data Model + API specs) ✅ Ready for development

### Phase 1.5: Creator Community Marketplace & Instagram Enhancements 🎯 READY FOR IMPLEMENTATION
**NEW: Creator Marketplace Features**:
- Creator public profiles (photographers, makeup artists, prop modelers, etc.)
- Geographic discovery (search nearby creators by role)
- Verification badges (90+ days, 4.5+ rating, 5+ monthly bookings)
- One-click crew invitations via email
- Booking management & payment processing (Stripe integration)
- Review & rating system (5-star reviews, community moderation)
- Commission-based revenue (5% free tier, 0% paid tier)
- Creator earnings dashboard & payout management
- Community showcase gallery for verified creators

**Instagram Enhancements**:
- Auto-scheduling via Instagram Graph API
- Reels support (video editing in-app)
- Stories publishing
- Advanced analytics (trending hashtags, follower insights)

**Phase 1.5 Timeline**: 8 weeks post-Phase-1-validation
**Specification**: See `creator-community-marketplace-v1.md` (8,000+ lines)

### Phase 2: Mobile Apps & TikTok 🚀 PLANNED
- Flutter Android app (native performance, offline, camera integration)
- Flutter iOS app (shared codebase with Android)
- TikTok integration & creator features
- SMS reminders (as optional paid add-on)
- Video editing (trim, effects, transitions)
- Advanced creator analytics

### Phase 3: Advanced Features & Scaling
- Influencer partnerships & sponsorship tools
- Convention event integrations
- B2B team onboarding & consulting
- Advanced trend forecasting & AI recommendations

---

## 📊 Key Metrics & Targets

### Performance
- Page load: <3s on 3G network
- API response: <500ms (p95)
- Real-time sync: <2s propagation
- Image load: <1s for optimized sizes

### Testing
- Code coverage: 70% minimum
- End-to-end tests: All critical workflows
- Accessibility: WCAG 2.1 AA compliance

### Sustainability & Growth
- **Free Tier**: 2GB storage, unlimited team members, 1,000 API calls/day, 5% commission on creator bookings
- **Paid Tier**: $5/month (20GB storage, 0% commission, advanced features)
- **Creator Free Tier**: 5% commission on earnings, basic bookings
- **Creator Paid Tier**: $5/month (0% commission, advanced analytics)
- **Break-even Target**: ~200 active creators OR 100 teams + 50 creators in paid tier (Year 1)
- **Infrastructure Cost**: Scaled model based on commission revenue (not fixed team cost)

---

## 🔐 Security & Compliance

✅ GDPR compliance (EU data residency, 30-day deletion)  
✅ OAuth (Google, GitHub, Apple Sign-In)  
✅ Passkeys/WebAuthn support  
✅ 2FA optional for all users  
✅ Field-level encryption for sensitive data  
✅ No PII in analytics  
✅ No data selling or licensing  
✅ Incident response procedures  
✅ Backup & disaster recovery (4-hour RTO, 1-hour RPO)  

---

## 🛠️ Technology Stack

| Component | Technology | Notes |
|-----------|-----------|-------|
| Frontend | SvelteKit | Responsive web, Phase 1 focus |
| Backend | Supabase PostgreSQL | EU region for GDPR |
| Real-time | Supabase Realtime | Conflict resolution with OT |
| Images | Sharp.js + Supabase Storage | WebP optimization |
| Email | SendGrid | Reliable delivery, retry logic |
| Auth | OAuth + Passkeys | No passwords stored |
| State | SvelteKit load functions | Built-in, no external library |
| Testing | Vitest + Playwright | Unit + E2E tests |
| Mobile | Flutter (Phase 2+) | Android + iOS shared code |

---

## 📖 How to Use This Documentation

**For New Developers**:
1. Start with Constitution v2.0 (understanding)
2. Read Quickstart guide (setup)
3. Review Data Model (schema)
4. Read API specs (contracts)
5. Reference Copilot context (patterns)

**For Feature Implementation**:
1. Find your feature in Constitution
2. Check Social Media Spec (if Instagram-related)
3. Check Data Model for affected tables
4. Check API specs for endpoints
5. Write tests first (TDD)

**For Debugging/Questions**:
1. Check Copilot context for architecture patterns
2. Check Quickstart for common tasks
3. Check relevant spec doc (data model, API, social media)
4. Check Constitution for principles alignment

---

## 📝 Document Versions

| Document | Version | Last Updated | Status |
|----------|---------|--------------|--------|
| Constitution | 2.1.0 | 2025-10-16 | ✅ Finalized |
| Constitution Summary (v2.1) | 1.0 | 2025-10-16 | ✅ New |
| Data Model | v2 | 2025-10-16 | ✅ Ready |
| Social Media Spec | v2 | 2025-10-16 | ✅ Complete |
| Creator Marketplace Spec | v1.0 | 2025-10-16 | ✅ New & Ready |
| Crew Management | v2 | 2025-10-16 | ✅ Ready |
| Permission Model | 1.9 | 2025-10-16 | ✅ Complete |
| Quickstart | Phase 1 | 2025-10-16 | ✅ Ready |
| Copilot Context | Complete | 2025-10-16 | ✅ Ready |
| README | 2.1 | 2025-10-16 | ✅ Updated |
| Phase 0 Research | Complete | 2025-10-16 | ✅ Archived |

---

## 🎯 Next Actions

### Immediate (This Week)
- [ ] Review Constitution v2.0 with stakeholders
- [ ] Confirm social media scope and timeline
- [ ] Allocate development resources

### Short-term (This Sprint)
- [ ] Set up Supabase project with migrations
- [ ] Create GitHub project board for Phase 1 tasks
- [ ] Implement image optimization pipeline
- [ ] Set up SendGrid integration
- [ ] Begin conflict resolution testing

### Medium-term (Next Sprint)
- [ ] Complete core CRUD (shoots, costumes, props)
- [ ] Implement crew management
- [ ] Set up real-time sync
- [ ] Begin Instagram integration
- [ ] User testing of Phase 1 features

---

## 📞 Key Decisions Made

✅ **Tech Stack**: SvelteKit + Supabase + Flutter (decided)  
✅ **Conflict Resolution**: Operational Transform (decided)  
✅ **Real-time Sync**: Supabase Realtime (decided)  
✅ **Image Optimization**: Sharp.js + WebP (decided)  
✅ **Analytics**: Custom PostgreSQL (decided, no third-party)  
✅ **Email**: SendGrid (decided)  
✅ **Auth**: OAuth + Passkeys + 2FA (decided)  
✅ **Social Media**: Instagram Phase 1, TikTok Phase 2+ (decided)  
🔄 **Payment**: Stripe deferred (revisit when paid tier features defined)  
🔄 **SMS**: Deferred as paid tier option (Phase 2+)  

---

## 📞 Questions or Issues?

Refer to:
- Constitution (v2.0.0) for principles & direction
- Data Model (v2) for schema questions
- Social Media Spec for Instagram implementation details
- Copilot context for code patterns and examples
- Quickstart for developer setup issues

---

**Cosplans Constitution v2.1.0 - Complete and Ready for Phase 1 & Phase 1.5 Implementation! 🚀**

**What's New in v2.1.0**:
- ✅ Creator Community & Discovery Marketplace (Phase 1.5 ready)
- ✅ Commission-based revenue model (sustainable without predatory pricing)
- ✅ Comprehensive creator profile system with verification badges
- ✅ One-click marketplace crew invitations integrated with shoots
- ✅ Creator earnings management & payment processing (Stripe integration)
- ✅ Community moderation & review system
- ✅ Public usernames for creator discoverability
- ✅ Full privacy controls for creators (optional public profile, location privacy, travel distance autonomy)

**Ready to Start**:
1. ✅ Phase 1 specification complete → Begin implementation
2. ✅ Phase 1.5 specification complete → Plan after Phase 1 validation
3. ✅ Data model finalized → Ready for Supabase migrations
4. ✅ API contracts defined → Ready for backend development
5. ✅ Security model reviewed → GDPR compliant, ready for deployment
