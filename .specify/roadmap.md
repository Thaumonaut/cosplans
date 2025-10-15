# Cosplans Feature Roadmap

**Purpose**: Track planned features and their priority for the Cosplans cosplay photoshoot management application.

**Last Updated**: 2025-10-15

**Strategy**: MVP focused on **user acquisition through public sharing** and **core creative planning**. Budget features demoted in favor of viral growth mechanisms.

---

## Phase 0: Foundation (Build First) ✅ SPECS COMPLETE

These are the absolute essentials - without them, no other features can function.

| ID | Feature | Status | Branch | Why Critical |
|----|---------|--------|--------|--------------|
| 023 | **User Authentication & Teams** | ✅ Spec Complete | `023-user-authentication-teams` | Users need accounts, teams for collaboration |
| 024 | **Dashboard & Shoot List** | ✅ Spec Complete | `024-dashboard-shoot-list` | Primary navigation hub, first page after login |
| 022 | **Shoot Details Page (Central Hub)** | ✅ Spec Complete | `022-details-page-for` | Most important page - all planning happens here |

**Value After Phase 0**: Users can create accounts, form teams, view shoots in dashboard, and create/edit detailed shoot plans with reference organization.

**Timeline**: Weeks 1-6

---

## Phase 1: MVP Core Features (Launch Blockers) ✅ SPECS COMPLETE

Features required for MVP launch. Focus on **creative planning** and **user acquisition**.

### Core Planning Features

| ID | Feature | Status | Branch | Why MVP |
|----|---------|--------|--------|---------|
| 004 | **Shot-by-Shot Planning** | ✅ Spec Complete | `004-shot-by-shot` | Core differentiator. Organized shoots. Integrates with spec 022. |
| 011 | **Reference Pose Library** | ✅ Spec Complete | `010-reference-pose-library` | Better than camera roll. Essential for creative planning. Complements spec 022 references. |
| 007 | **Gear Checklist Management** | ✅ Spec Complete | `007-gear-checklist` | Prevents forgetting critical items. Common pain point. |
| 021 | **Team Notes (P1 only)** | ✅ Spec Complete | `021-team-notes-notion` | Team communication baseline. Notion sync is Phase 2. |

### Growth & Acquisition Features

| ID | Feature | Status | Branch | Why MVP |
|----|---------|--------|--------|---------|
| 020 | **Public Shoot Detail Page** | ✅ Spec Complete | `020-create-a-specification` | **CRITICAL FOR GROWTH**. Viral sharing mechanism. Recruit collaborators. Drive signups. |

**MVP Value Proposition**:
> "Plan and share your cosplay photoshoots: organize references and shot lists, share public previews to recruit collaborators, and coordinate with your team—all in one visual hub."

**Timeline**: Weeks 7-12

**Total MVP Timeline**: **12 weeks** (Phase 0 + Phase 1)

---

## Phase 2: Enhanced Features (Post-MVP v1.1)

Features that enhance the core experience but aren't required for launch.

### AI & Automation

| ID | Feature | Status | Branch | Why Post-MVP |
|----|---------|--------|--------|--------------|
| 002 | **AI-Generated Reference Poses** | ✅ Spec Complete | `002-ai-references` | Enhances reference library (011) but manual works for MVP |
| 003 | **AI Backdrop/Location Suggestions** | ✅ Spec Complete | `003-generate-backdrop-or` | Nice enhancement but users can manually find locations |
| 005 | **Trending Audio Integration** | ✅ Spec Complete | `005-trending-audio` | Important for viral content but can be added post-launch |

### Professional Tools

| ID | Feature | Status | Branch | Why Post-MVP |
|----|---------|--------|--------|--------------|
| 006 | **Budget Tracking & Expenses** | ✅ Spec Complete | `006-budget-tracking` | **Demoted from Phase 1**. Valuable but not launch-critical. Users can use spreadsheets initially. |
| 008 | **Weather Integration** | ✅ Spec Complete | `008-weather-integration` | Prevents wasted trips but users check weather apps |

**Timeline**: +6-8 weeks after MVP launch

---

## Phase 3: Team Collaboration (v1.2-1.3)

Features that improve multi-user workflows and team coordination.

| ID | Feature | Status | Branch | Why Later |
|----|---------|--------|--------|-----------|
| 001 | **Shoot Transfer Between Teams** | ✅ Spec Complete | `001-shoot-transfer` | Edge case for team changes, not common workflow |
| 009 | **Editing Task Assignment** | ✅ Spec Complete | `009-editing-task` | Important for post-shoot but planning features more critical |
| 012 | **Team Communication/Chat** | ⏳ Not Yet Spec'd | - | Real-time chat is nice but notes (021) cover basics |
| 021 | **Notion Integration (P2)** | ✅ Spec Complete | `021-team-notes-notion` | Enhances notes but not required for core functionality |
| 013 | **Model/Photographer Release Forms** | ✅ Spec Complete | `013-model-release-forms` | Legal protection for professionals, hobbyists don't need |

**Timeline**: +3-6 weeks after Phase 2

---

## Phase 4: Professional Features (v2.0+)

Features for serious/professional cosplayers and content creators.

| ID | Feature | Status | Branch | Target Users |
|----|---------|--------|--------|--------------|
| 012 | **Convention/Event Integration** | ✅ Spec Complete | `012-convention-event` | Users attending cons regularly |
| 014 | **Social Media Post Scheduling** | ✅ Spec Complete | `014-social-media-scheduling` | Content creators posting regularly |
| 015 | **Portfolio/Gallery View** | ✅ Spec Complete | `015-portfolio-gallery` | Photographers showcasing work |
| 016 | **Costume Progress Photos** | ✅ Spec Complete | `016-costume-progress-photos` | Costume builders documenting process |
| 017 | **Contact Directory** | ✅ Spec Complete | `017-contact-directory` | Frequent collaborators managing network |

**Timeline**: v2.0+ (6+ months post-launch)

---

## Phase 5: Future Considerations

Ideas to explore after core product-market fit is established.

- **Team Analytics**: Track shoot completion rates, time estimates vs actual, budget accuracy
- **Marketplace Integration**: Connect with costume commissioners, prop makers, photographers for hire
- **Event Discovery**: Find local cosplay meetups, photoshoots, conventions
- **Skill Sharing**: Tutorial library, technique guides, community Q&A
- **Costume Pattern Library**: Store and share sewing patterns, 3D print files
- **Sponsorship Tools**: Track brand partnerships, sponsored content requirements

---

## Key Strategic Decisions

### ✅ What Changed in This Roadmap

| Feature | Before | After | Rationale |
|---------|--------|-------|-----------|
| **Reference Pose Library (011)** | Medium Priority | **Phase 1 MVP** | Core to creative planning. Without it, reference management in 022 is basic file storage. |
| **Public Shoot Pages (020)** | Phase 3 Collaboration | **Phase 1 MVP** | **Main user acquisition channel**. Organic growth through viral sharing. |
| **Budget Tracking (006)** | Phase 1 MVP | **Phase 2 Enhanced** | Nice-to-have but doesn't drive signups. Spreadsheets work initially. |
| **Team Communication (012)** | High Priority | **Phase 3** | Team notes (021 P1) cover basics. Full chat can wait. |

### 🎯 User Acquisition Strategy

**Viral Loop with Public Sharing**:
```
1. User creates shoot with cool references
   ↓
2. Generates public link (Spec 020)
   ↓
3. Shares on Reddit: "Looking for photographer for this Genshin shoot!"
   ↓
4. Non-users click link → see beautiful shoot preview
   ↓
5. "I want to plan shoots like this" → Sign up
   ↓
6. New user creates their own shoot → shares publicly
   ↓
7. Loop repeats (exponential growth)
```

**Without public sharing**: Users plan privately → no discovery → linear growth via ads only  
**With public sharing**: Every shoot is a marketing asset → exponential organic growth

---

## Feature Prioritization Criteria

When evaluating new features, consider:

1. **Constitutional Alignment**: Does it support mobile-first, real-time collaboration, visual-first content?
2. **User Acquisition Impact**: Does this help new users discover and join Cosplans?
3. **User Pain Point Severity**: How much does this problem hurt users daily?
4. **Differentiation**: Does this set us apart from generic project management tools?
5. **Development Complexity**: Can we ship value quickly?
6. **Network Effects**: Does this feature become more valuable as more users join?

---

## MVP Development Phases (12 Week Timeline)

### **Phase 0.1: Foundation (Weeks 1-3)**
1. Spec 023: Authentication (signup, login, OAuth)
2. Spec 023: Team management (create teams, invite members)
3. Spec 024: Basic dashboard (view shoots, filters)

### **Phase 0.2: Core Shoot Management (Weeks 4-6)**
4. Spec 022: Shoot CRUD (create, view, edit)
5. Spec 022: References section (manual upload, organize)
6. Spec 024: Dashboard search and advanced filters

### **Phase 1.1: Planning Features (Weeks 7-9)**
7. Spec 011: Reference Pose Library (save, tag, organize references)
8. Spec 004: Shot-by-Shot Planning (integrate into 022)
9. Spec 021: Team Notes (basic P1 features)
10. Spec 007: Gear Checklist Management

### **Phase 1.2: Growth & Launch Prep (Weeks 10-12)**
11. **Spec 020: Public Shoot Detail Page** (shareable links, privacy controls, RSVP)
12. Spec 022: Auto-save, real-time sync
13. Spec 024: Performance optimization (< 3s load time)
14. Public sharing OpenGraph tags (social media previews)
15. Testing, bug fixes, analytics setup

**🚀 Launch Ready**: Week 12

---

## Success Metrics by Phase

### Phase 0 Success
- ✅ Users can create accounts in under 2 minutes
- ✅ 95% of new users successfully create first shoot
- ✅ Dashboard loads in under 2 seconds

### Phase 1 (MVP) Success
- ✅ 30% of shoots enable public sharing within first month
- ✅ 20% increase in signups from public shoot link referrals
- ✅ Average 10+ reference images per shoot
- ✅ 70% of shoots create shot lists

### Phase 2+ Success
- ✅ 40% of users utilize AI reference generation
- ✅ Budget tracking used by 50% of professional users
- ✅ Notion integration adopted by 20% of teams

---

## Next Steps

1. ✅ **Phase 0 Specs Complete** - Authentication, Dashboard, Shoot Details
2. ✅ **Phase 1 Specs Complete** - Shot Planning, Reference Library, Public Sharing, Notes, Gear
3. 🔄 **Start Development** - Begin with Spec 023 (authentication)
4. 📋 **Technical Planning** - Use `/speckit.plan` on each spec to break down implementation
5. 🎨 **Design System** - Create UI component library in SvelteKit
6. 🧪 **Testing Strategy** - Set up Playwright for E2E tests (per constitution)

---

## Specification Status

| Phase | Specs Complete | Specs Pending | Ready to Build |
|-------|----------------|---------------|----------------|
| **Phase 0** | 3/3 (100%) | 0 | ✅ YES |
| **Phase 1** | 5/5 (100%) | 0 | ✅ YES |
| **Phase 2** | 5/5 (100%) | 0 | ✅ YES |
| **Phase 3** | 4/5 (80%) | Team Chat | ⏳ Mostly |
| **Phase 4+** | 5/5 (100%) | 0 | ⏳ Post-Launch |

**Total Specifications**: 22 complete, 1 pending (Team Chat)
