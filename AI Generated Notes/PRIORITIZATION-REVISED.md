# Cosplans MVP Prioritization - Revised

**Strategy**: Build the foundational app experience first, then add AI as enhancement layers.

---

## **TIER 1: CORE APP INFRASTRUCTURE (Weeks 1-6)**

### 1. **018-dashboard-views** ⭐ START HERE
- **Why First**: Central hub where users land on login
- **Drives**: Awareness of upcoming shoots, tasks, progress
- **Enables**: All other features have a place to be discovered
- **Effort**: Medium
- **User Stories to Focus On**:
  - Main Dashboard Overview (P1)
  - Progress Tracker Dashboard (P1)
  - Skip advanced views initially (Timeline/Budget/Character) - add in later iteration

### 2. **004-shot-by-shot** ⭐ CORE FEATURE
- **Why Second**: Shoot planning is the central workflow
- **Drives**: Everything else (editing, references, checklists attach to shots)
- **Enables**: Team can actually plan what they're shooting
- **Effort**: Medium-High
- **User Stories to Focus On**:
  - Create Basic Shot List (P1)
  - Add Director Notes & Camera Details (P2)
  - Attach Reference Images (P3) - but reference can be simple URLs initially
  - Skip timing/scheduling initially

### 3. **019-costume-management-page** ⭐ CORE FEATURE
- **Why Third**: Cosplayers need to manage what they're building
- **Drives**: Shoot planning (what costumes are ready?), progress tracking
- **Enables**: Lifecycle states for all resource types
- **Effort**: Medium
- **User Stories to Focus On**:
  - Costume Lifecycle Management (P1)
  - Prop Lifecycle Management (P1)
  - Skip advanced resource types initially

### 4. **011-team-communication**
- **Why Here**: Teams need to coordinate around shots/costumes/planning
- **Drives**: Coordination without external tools
- **Enables**: Team chat, mentions, file sharing in context
- **Effort**: Medium
- **User Stories to Focus On**:
  - Shoot-Level Chat Threads (P1)
  - @Mentions & Notifications (P2)
  - File & Link Sharing (P3)
  - Skip activity feed initially

### 5. **006-budget-tracking**
- **Why Here**: Financial coordination needed early to prevent disputes
- **Drives**: Teams can see spending in real-time
- **Enables**: Receipt uploads, expense tracking, shared budgets
- **Effort**: Low-Medium
- **User Stories to Focus On**:
  - Set Shoot Budget (P1)
  - Add & Categorize Expenses (P2)
  - Skip splits/advanced features initially

### 6. **007-gear-checklist**
- **Why Here**: Practical tool that prevents shoot failures
- **Drives**: Team knows what to bring
- **Enables**: Templates for repeated shoots
- **Effort**: Low
- **User Stories to Focus On**:
  - Create Gear Checklists (P1)
  - Categorize Items by Type (P2)
  - Skip templates initially

---

## **TIER 2: PROFESSIONAL WORKFLOWS (Weeks 7-10)**

### 7. **001-shoot-transfer**
- **Why Now**: Multi-team scenarios only happen after team management is working
- **Drives**: Organizational flexibility
- **Enables**: Teams sharing resources, cross-team shoots
- **Effort**: Medium-High
- **Focus**: Basic transfer (P1) - skip selective resource transfer (P4)

### 8. **013-model-release-forms**
- **Why Now**: Required before sharing photos commercially
- **Drives**: Legal protection for photographers
- **Enables**: Safe photo publishing, portfolio building
- **Effort**: Medium
- **Focus**: Send & e-sign (P1-P2) - skip custom templates initially

### 9. **010-reference-pose-library**
- **Why Now**: Foundation for shot planning and AI features
- **Drives**: Reference-driven creative process
- **Enables**: Save references, organize by tags, quick-attach to shots
- **Effort**: Medium
- **Focus**: Save References (P1), Tag & Organize (P2) - skip community sharing (P4)

### 10. **017-contact-directory**
- **Why Now**: Teams need to manage resources (people, gear, availability)
- **Drives**: Scheduling efficiency, knowing who has what
- **Enables**: Team member management, availability calendar
- **Effort**: Medium
- **Focus**: Team Contact Management (P1), Availability Calendars (P2)

---

## **TIER 3: AI & CREATIVE FEATURES (Weeks 11-14)**

### 11. **002-ai-references** 
- **Why Here**: Now that reference library exists, AI can generate poses
- **Drives**: Faster reference collection, creative inspiration
- **Enables**: Generate poses, face swap, reuse history
- **Effort**: High (requires AI service integration)
- **Dependencies**: Reference library (010) must exist first
- **Focus**: Generate Character Reference Poses (P1), Face Swap (P2)

### 12. **003-generate-backdrop-or**
- **Why Here**: Complements AI pose generation
- **Drives**: Location and backdrop planning
- **Enables**: DIY backdrop ideas, real location discovery
- **Effort**: High (requires AI + Google Maps)
- **Dependencies**: AI infrastructure from (002)
- **Focus**: AI Backdrop Suggestions (P1), Location Discovery (P2)

### 13. **005-trending-audio**
- **Why Here**: Self-contained feature for content creators
- **Drives**: Music-driven planning and reel creation
- **Enables**: Trending audio discovery, beat marking
- **Effort**: Medium (requires Instagram/TikTok API integration)
- **Focus**: Browse & Save Trending Audio (P1), Attach to Shoots (P2)

### 14. **016-costume-progress-photos**
- **Why Here**: Cosplayers document their builds alongside shoot planning
- **Drives**: Portfolio building, progress sharing
- **Enables**: Before/after comparisons, progress tracking
- **Effort**: Low-Medium
- **Focus**: Progress Timeline (P1), Before/After Comparisons (P2)

---

## **TIER 4: SPECIALIZED FEATURES (Weeks 15-18)**

### 15. **009-editing-task**
- **Why Here**: Post-production workflow after shoots complete
- **Drives**: Photo editing coordination
- **Enables**: Task assignment, status tracking, version history
- **Effort**: Medium
- **Focus**: Assign Photos to Editors (P1), Track Editing Status (P2)

### 16. **008-weather-integration**
- **Why Here**: Risk mitigation for outdoor shoots (nice to have)
- **Drives**: Better planning, contingency awareness
- **Enables**: Forecasts, alerts, alternative date suggestions
- **Effort**: Medium (requires weather API)
- **Focus**: View Location Weather Forecast (P1), Receive Alerts (P2)

### 17. **012-convention-event**
- **Why Here**: Specialized use case for convention-goers
- **Drives**: Convention-specific organization
- **Enables**: Convention linking, schedule import, meetup discovery
- **Effort**: Medium
- **Focus**: Link Shoots to Conventions (P1), Convention Schedule (P2)

### 18. **014-social-media-scheduling**
- **Why Here**: Content distribution and automation
- **Drives**: Automated social sharing
- **Enables**: Post scheduling, platform previews, analytics
- **Effort**: High (requires multiple platform APIs)
- **Focus**: Schedule Posts to Queue (P1), Caption Templates (P2)

---

## **TIER 5: ANALYTICS & ADVANCED VIEWS (Weeks 19+)**

### 19. **015-portfolio-gallery**
- **Why Last**: Showcasing work after you've completed shoots
- **Drives**: Client delivery, public facing work
- **Enables**: Public portfolios, access codes, branding
- **Effort**: Medium
- **Dependencies**: Editing tasks (009), social scheduling (014)
- **Focus**: Public Portfolio Pages (P1), Client Access with Codes (P2)

---

## **IMPLEMENTATION SEQUENCING**

### **MVP Phase 1: Core App (6 weeks)**
```
Week 1-2: Dashboard + Shot Planning (018, 004)
Week 3-4: Costume Management + Communication (019, 011)
Week 5-6: Budget + Checklists (006, 007)
```
**Launch MVP with these 6 features** ✅

### **MVP Phase 1.5: Professional Tools (4 weeks)**
```
Week 7:   Shoot Transfer (001)
Week 8:   Model Release Forms (013)
Week 9:   Reference Library (010)
Week 10:  Contact Directory (017)
```

### **MVP Phase 2: AI & Creative (4 weeks)**
```
Week 11:  AI Pose Generation (002)
Week 12:  AI Backdrop Generation (003)
Week 13:  Trending Audio (005)
Week 14:  Costume Progress Photos (016)
```

### **MVP Phase 2.5: Advanced Features (4 weeks)**
```
Week 15:  Editing Task Management (009)
Week 16:  Weather Integration (008)
Week 17:  Convention Events (012)
Week 18:  Social Media Scheduling (014)
```

### **MVP Phase 3: Analytics & Delivery (2 weeks)**
```
Week 19:  Portfolio Gallery (015)
```

---

## **KEY DEPENDENCIES MAPPED**

```
Dashboard (018)
  ↓
  ├─→ Shot Planning (004)
  │     ├─→ Reference Library (010)
  │     │     └─→ AI Pose Generation (002)
  │     │     └─→ AI Backdrop Generation (003)
  │     └─→ Editing Tasks (009)
  │           └─→ Portfolio Gallery (015)
  │
  ├─→ Costume Management (019)
  │     └─→ Costume Progress Photos (016)
  │
  ├─→ Communication (011)
  │
  ├─→ Budget Tracking (006)
  │     └─→ Team Budget Overview (in 018)
  │
  ├─→ Gear Checklist (007)
  │
  └─→ Progress Tracker (part of 018)

Separate Workflows:
├─→ Shoot Transfer (001)
├─→ Model Releases (013)
├─→ Contact Directory (017)
├─→ Trending Audio (005)
├─→ Weather Integration (008)
├─→ Convention Events (012)
└─→ Social Media Scheduling (014)
```

---

## **MVP LAUNCH CRITERIA**

Users can:
- [ ] See dashboard on login with upcoming shoots and progress
- [ ] Create and edit shots with notes, references, and timing
- [ ] Manage costume/prop lifecycle (planned → owned → sold/damaged)
- [ ] Communicate with team in shoot-level chat
- [ ] Track shoot budget and expenses
- [ ] Have gear checklists to pack

**Everything else is enhancement.**

---

## **WHY THIS ORDER WORKS**

1. **Dashboard first** - Users see the app before anything else
2. **Shots core** - Entire app revolves around planning what to shoot
3. **Costumes & props** - Cosplayers can't shoot without costumes
4. **Communication** - Team coordination prevents failures
5. **Budget & checklists** - Practical tools that prevent disasters
6. **Professional workflows** - Needed for serious photographers
7. **AI as enhancement** - Nice to have after basics work
8. **Specialized features** - Conventions, weather, social media
9. **Analytics & portfolio** - After you have work to showcase

**Result**: A complete, functional app by Week 6 that teams can actually use for real shoots. Everything after is polish and specialization.
