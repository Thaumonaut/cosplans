# Cosplans v2.1.0 Feature Overview & Architecture

**Document**: Feature Architecture & Integration Map  
**Version**: 1.0  
**Date**: October 16, 2025  
**For**: Team Understanding & Implementation Planning

---

## High-Level Feature Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COSPLANS ECOSYSTEM v2.1.0                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────┐                    ┌─────────────────────┐     │
│  │  TEAM INTERFACE     │                    │ CREATOR INTERFACE   │     │
│  │  ─────────────────  │                    │ ─────────────────   │     │
│  │ • Shoots            │                    │ • Creator Profile   │     │
│  │ • Costumes          │◄──────────────────►│ • Availability      │     │
│  │ • Props             │   Crew Bookings    │ • Rates/Roles       │     │
│  │ • Team Members      │   & Invitations    │ • Portfolio         │     │
│  │ • Budget            │                    │ • Earnings          │     │
│  │ • Crew List         │                    │ • Reviews           │     │
│  │ • Social Calendar   │                    │ • Showcase          │     │
│  └─────────────────────┘                    └─────────────────────┘     │
│           △                                           △                  │
│           │                                           │                  │
│           │ ┌─────────────────────────────────────┐ │                  │
│           │ │  CREATOR MARKETPLACE (Phase 1.5)    │ │                  │
│           └─┤ ─────────────────────────────────────┤─┘                  │
│             │ • Discovery Search                   │                    │
│             │ • Verification Badges                │                    │
│             │ • Booking Invitations (Email)        │                    │
│             │ • Payment Processing (Stripe)        │                    │
│             │ • Reviews & Ratings                  │                    │
│             │ • Moderation & Reports               │                    │
│             │ • Community Showcase                 │                    │
│             │ • Creator Analytics                  │                    │
│             └─────────────────────────────────────┘                    │
│                                                                           │
│                      ┌──────────────────────┐                            │
│                      │  CORE FEATURES       │                            │
│                      │  ──────────────────  │                            │
│                      │ • Image Optimization │                            │
│                      │ • Email Reminders    │                            │
│                      │ • Real-Time Sync (OT)│                            │
│                      │ • Analytics          │                            │
│                      │ • Crew Management    │                            │
│                      │ • Team Permissions   │                            │
│                      │ • Google Integration │                            │
│                      │ • Instagram Planning │                            │
│                      └──────────────────────┘                            │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Revenue Flow Architecture

```
TEAM WORKFLOW                      CREATOR WORKFLOW
─────────────────────────────────────────────────────

Team adds crew to shoot    
        │
        ▼
Free Tier: Pays 5% commission
Paid Tier: Pays 0% commission
        │
        ▼
Creator receives invitation via email
        │
        ▼
Creator accepts (added to shoot_crew)
        │
        ▼
Shoot marked "complete" by team
        │
        ▼
Payment authorization:
Free: 5% to Cosplans, 95% to creator
Paid: 100% to creator, Cosplans absorbs fee
        │
        ▼
Stripe processes payment (via Stripe Connect)
        │
        ▼
Creator receives funds in bank account
        │
        ▼
Review exchange (team → creator, creator → team)
        │
        ▼
Creator profile updated:
- Average rating recalculated
- Verification badge status checked
- Earnings total incremented
- Completed bookings count incremented
```

---

## Data Flow: Crew Assignment & Booking

```
SCENARIO: Team assigns creator to shoot

┌──────────────────────────────────────────────────────────┐
│ Team clicks "Add Crew" on Shoot Detail                   │
└────────────────────┬─────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   [New Crew]  [Team History]  [Find Creators]
   (Manual)    (Previous)      (NEW - Marketplace)
                              Search algorithm:
                              - Zip code + distance
                              - Role matching
                              - Availability check
                              - Rating filter
                              - Sort: distance, rating
                              
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
        ┌─────────────────────────────────┐
        │ Creator Selected (or Suggested) │
        └─────────────┬───────────────────┘
                      │
                      ▼
         ┌────────────────────────────────┐
         │ Invite Modal Prepopulates:     │
         │ - Shoot date/time/location     │
         │ - Role(s) needed               │
         │ - Pay rate (if set)            │
         └────────────┬───────────────────┘
                      │
              [Send Invitation]
                      │
                      ▼
         ┌────────────────────────────────┐
         │ Email Sent to Creator:         │
         │ - Shoot details                │
         │ - 1-click link (7-day token)   │
         │ - "Accept" or "Decline"        │
         └────────────┬───────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
    [Accept]                    [Decline]
         │                         │
         ▼                         ▼
   shoot_crew entry          Invitation expires
   external_crew=true        Status: declined
   Status: accepted          Creator: idle
   Creator: added to         (Can see shoot_detail
   shoot view                 if desired)
   Real-time notification
   to team members
```

---

## Commission Model Impact

```
USER TYPE          FREE TIER                    PAID TIER ($5/month)
────────────────────────────────────────────────────────────────────

FREE TIER          Booking @$100:              Free to upgrade:
TEAM               Team pays: $105             Team pays: $100
                   Creator gets: $95           Creator gets: $100
                   Cosplans: $5                Cosplans: $0 (fee absorbed)
                   Status: <50 bookings/mo     Status: unlimited bookings
                   Cap: 50 bookings/month

FREE TIER          Booking @$100:              Free to upgrade:
CREATOR            Creator gets: $95           Creator gets: $100
                   Cosplans: $5                Cosplans: $0 (fee absorbed)
                   Status: Takes commission    Status: Keeps 100%

PAID TIER          Booking @$100:              Booking @$100:
TEAM               Team pays: $100             Team pays: $100
                   Creator gets: $100          Creator gets: $100
                   Cosplans: $0 (absorbed)     Cosplans: $0 (absorbed)
                   Status: Incentive to book   Status: No fee, 0% cost

PAID TIER          Booking @$100:              Booking @$100:
CREATOR            Creator gets: $100          Creator gets: $100
                   Cosplans: $0                Cosplans: $0
                   Status: Incentive to       Status: All earnings kept,
                           upgrade to          higher visibility benefit
                           keep 100%


BREAKEVEN MODEL:

Scenario 1: Creator-focused growth
- 200 active creators (100 free, 100 paid tier)
- Free tier: $50/month avg spend × 5% commission = $50/month
- Paid tier: $100 creators × $5/month = $500/month
- Total: $550/month

Scenario 2: Team-focused growth
- 100 active teams (50 free, 50 paid tier)
- Free teams: $20/month avg spend × 5% commission = $50/month
- Paid teams: 50 × $5/month = $250/month
- Total: $300/month

Scenario 3: Balanced growth (RECOMMENDED)
- 100 free teams ($20 avg spend) + 50 creators ($5 paid) + 50 paid teams ($5) + 50 creators free ($10 spend)
- = ($100 + $250 + $250 + $25) = $625/month
- With 3-5x growth → $1,875-3,125/month (profitable)
```

---

## Feature Integration Timeline

```
PHASE 1 (12-16 weeks)
│
├─ Week 1-3: Foundation
│  ├─ Image optimization (Sharp.js, WebP, resize)
│  ├─ Email system (SendGrid)
│  └─ Supabase setup (migrations, seeds)
│
├─ Week 4-6: Core CRUD
│  ├─ Shoot creation/editing
│  ├─ Costume & prop management
│  ├─ Conflict resolution engine (OT)
│  └─ Real-time sync
│
├─ Week 7-9: Team Features
│  ├─ Team permissions (owner/admin/member/viewer)
│  ├─ Crew management (manual)
│  ├─ Activity feed
│  └─ Analytics collection
│
├─ Week 10-13: Integrations
│  ├─ Google Maps integration
│  ├─ Google Calendar sync
│  ├─ Google Docs export
│  └─ Instagram content calendar
│
├─ Week 14-16: Refinement
│  ├─ Performance optimization
│  ├─ Security audit
│  ├─ User testing
│  └─ Launch preparation
│
└─ PHASE 1 VALIDATION (4 weeks)
   └─ Beta testing, feedback collection, stabilization


PHASE 1.5 (8 weeks)
│
├─ Week 1-2: Creator Infrastructure
│  ├─ Creator profile creation UI
│  ├─ Database tables (creator_profiles, creator_roles, etc.)
│  ├─ Search algorithm & filters
│  └─ Verification badge logic
│
├─ Week 3-4: Bookings & Invitations
│  ├─ Invitation generation (email)
│  ├─ External crew onboarding
│  ├─ External crew access control (RLS)
│  └─ Availability calendar
│
├─ Week 5-6: Payments & Transactions
│  ├─ Stripe Connect setup
│  ├─ Payment calculation (commission logic)
│  ├─ Team budget management
│  ├─ Creator earnings dashboard
│  └─ Payout management
│
├─ Week 7-8: Moderation & Community
│  ├─ Review & rating system
│  ├─ Report submission & admin actions
│  ├─ Community showcase
│  ├─ Creator analytics
│  └─ Verification badge automation
│
└─ PHASE 1.5 LAUNCH
   └─ Beta marketplace (100-200 creators, gather feedback)


PHASE 2 (12-16 weeks)
│
├─ Mobile Applications
│  ├─ Flutter Android app (Phase 2a)
│  └─ Flutter iOS app (Phase 2b, shared codebase)
│
├─ Advanced Features
│  ├─ TikTok integration
│  ├─ Instagram Reels support
│  ├─ Auto-scheduling
│  ├─ SMS reminders (paid tier)
│  └─ Video editing
│
└─ Creator Economy Expansion
   ├─ Advanced analytics
   ├─ Influencer partnerships
   └─ Convention integrations
```

---

## User Journey: Team Booking a Creator

```
TEAM MEMBER JOURNEY:

1. Create Shoot
   ├─ Fill form: date, location, title, description
   ├─ Add visual references (upload images)
   ├─ Set payment budget
   └─ Save shoot

2. Plan Crew
   ├─ Click "Add Crew" on shoot detail
   ├─ Options presented:
   │  ├─ Create new crew (manual entry)
   │  ├─ Search team history (previous crew)
   │  └─ Find Creators in Marketplace (NEW Phase 1.5)
   ├─ Select marketplace search
   ├─ Map shows auto-suggestions near shoot location
   ├─ Filter by role, availability, rating
   └─ Results displayed sorted by relevance

3. Send Invitation
   ├─ Click "Invite" on creator suggestion
   ├─ Modal shows: creator profile preview, rate
   ├─ Click "Send Invitation"
   ├─ Email sent to creator with:
   │  ├─ Shoot details (date, location, role)
   │  ├─ Pay rate
   │  ├─ 1-click link ("View & Respond")
   │  └─ 7-day expiry
   └─ Real-time notification: "Invitation sent"

4. Track Responses
   ├─ Crew list shows: "pending" for invited creator
   ├─ Real-time update when creator accepts
   ├─ Creator moves to "accepted" status
   ├─ Team members notified
   └─ Creator appears on shoot detail

5. Pay Creator
   ├─ After shoot is marked "complete"
   ├─ Payment section shows: creator name, rate, commission
   ├─ For free tier: rate $100 + $5 commission = $105 total
   ├─ For paid tier: rate $100 (no commission)
   ├─ Click "Approve & Pay"
   ├─ Stripe processes payment
   ├─ Creator notified: "Payment sent"
   └─ Payment appears in team history

6. Review Creator
   ├─ After payment complete
   ├─ Prompt: "Rate your experience"
   ├─ 5-star form + optional comment
   ├─ Click "Submit Review"
   ├─ Review appears on creator profile
   └─ Creator profile updated:
      ├─ Average rating recalculated
      ├─ Verified badge status re-checked
      └─ Completed bookings count +1


CREATOR JOURNEY:

1. Set Up Creator Profile (One-time)
   ├─ Click "Set Up Creator Profile"
   ├─ Fill profile:
   │  ├─ Username: @jane_photography
   │  ├─ Real name visibility: OFF (private)
   │  ├─ Bio: "Experienced cosplay photographer..."
   │  ├─ Profile photo (upload)
   │  ├─ Roles offered: "photographer"
   │  ├─ Zip code: 97210 (Portland, OR)
   │  ├─ Travel distance: 25 miles
   │  ├─ Rate: $150/day
   │  └─ Portfolio links: Instagram, website, ArtStation
   ├─ Public preview shows on right
   ├─ Click "Publish Profile"
   └─ Profile now visible in marketplace search

2. Manage Availability
   ├─ Click "Edit Availability" on profile
   ├─ Calendar view: next 90 days
   ├─ Mark dates: available, booked, unavailable
   ├─ Add notes (optional): "Available outside 25-mile range"
   └─ Save changes

3. Receive & Accept Invitations
   ├─ Email arrives: "Invited to Shoot: Summer Cosplay on 8/22/2025"
   ├─ Click 1-click link in email
   ├─ Taken to Cosplans (authenticated via token)
   ├─ Shoot detail page shows:
   │  ├─ Team contact info
   │  ├─ Shoot date, location, roles
   │  ├─ Pay rate: $150
   │  ├─ Visual references
   │  └─ Team members involved
   ├─ Click "Accept" or "Decline"
   ├─ If accepted: added to shoot crew, real-time notification to team
   └─ Invitation status updated

4. Track Earnings
   ├─ After shoot marked complete + payment sent
   ├─ Creator dashboard → Earnings section
   ├─ Shows transaction:
   │  ├─ Shoot: "Summer Cosplay"
   │  ├─ Date: 8/22/2025
   │  ├─ Role: Photography
   │  ├─ Rate: $150
   │  ├─ Commission: -$7.50 (5% if free tier)
   │  ├─ Received: $142.50
   │  └─ Status: ✓ Paid
   ├─ Total earned: $1,234.50 (all-time)
   ├─ Pending payouts: $0
   └─ Last payout: $142.50

5. Submit Review
   ├─ After payment received
   ├─ Prompt: "Rate your experience with [Team Name]"
   ├─ 5-star form + optional comment
   ├─ Click "Submit"
   ├─ Review appears on team profile (if team has one)
   └─ Both have profiles visible to each other

6. Build Reputation
   ├─ Over time with multiple bookings:
   │  ├─ Average rating increases
   │  ├─ Completed bookings count increases
   │  ├─ Earnings accumulate
   │  └─ If 90+ days + 4.5+ stars + 5+ bookings/month → Verification badge
   ├─ Badge displayed on profile
   ├─ Profile appears higher in search results
   ├─ More booking invitations received
   └─ Consider upgrading to paid tier ($5/month) to keep 100% of earnings
```

---

## Database Schema Highlights

```
CORE ENTITIES:

users
├─ id (UUID)
├─ email
├─ public_username ← NEW (for creators)
├─ real_name
├─ is_creator ← NEW
└─ [auth fields]

creator_profiles ← NEW
├─ id (UUID)
├─ user_id (FK users)
├─ public_username (UNIQUE)
├─ real_name_visibility
├─ bio, profile_photo_url
├─ roles_offered (ARRAY)
├─ zip_code, travel_distance_miles
├─ rates_visible
├─ verification_badge
├─ is_private
├─ total_earnings, completed_bookings
├─ average_rating
└─ [timestamps]

creator_roles ← NEW (per-role rates)
├─ id
├─ creator_id (FK creator_profiles)
├─ role (photographer, makeup_artist, etc.)
├─ rate_dollars
└─ [timestamps]

creator_availability ← NEW
├─ id
├─ creator_id (FK creator_profiles)
├─ date
├─ status (available, booked, unavailable)
└─ notes

teams
├─ id
├─ name
├─ team_owner_id (FK users)
└─ [timestamps]

shoots
├─ id
├─ team_id (FK teams)
├─ title, description
├─ shoot_date, location
├─ status
├─ version ← for conflict detection
└─ [timestamps]

shoot_crew ← UPDATED (new fields)
├─ id
├─ shoot_id (FK shoots)
├─ crew_id (FK crew)
├─ creator_id (FK creator_profiles) ← NEW
├─ roles (ARRAY)
├─ external_crew ← NEW (boolean flag)
├─ invite_accepted_at ← NEW
└─ [timestamps]

creator_payments ← NEW
├─ id
├─ shoot_crew_id (FK shoot_crew)
├─ creator_id (FK creator_profiles)
├─ rate_dollars
├─ commission_dollars
├─ total_paid_dollars
├─ payment_status
├─ payment_method
├─ stripe_payout_id
├─ paid_date
└─ [timestamps]

creator_reviews ← NEW
├─ id
├─ creator_id (FK creator_profiles)
├─ shoot_crew_id (FK shoot_crew)
├─ team_id (FK teams)
├─ rating (1-5)
├─ comment
├─ aspects (ARRAY)
└─ [timestamps]

team_budgets ← NEW
├─ id
├─ team_id (FK teams, UNIQUE)
├─ balance_dollars
├─ currency
└─ [timestamps]

creator_reviews (teams review creators)
creator_reviews (creators review teams)
community_reports ← NEW
showcase_submissions ← NEW
marketplace_invitations ← NEW
```

---

## API Contract Summary

### Key Creator Endpoints

```
POST   /api/v1/creator/profile
       Create creator profile
       Request: { username, bio, roles, zip_code, rates }
       Response: { id, profile_url, ... }

GET    /api/v1/creators/search?role=photographer&zip=97210&distance=25
       Search creators by role/location
       Response: [ { id, name, role, distance, rating, verified } ]

POST   /api/v1/creator/invitations
       Send crew invitation via email
       Request: { creator_id, shoot_id, role, rate_dollars }
       Response: { id, token, email_sent, expires_at }

POST   /api/v1/payments
       Process payment to creator (team)
       Request: { shoot_crew_id, rate_dollars }
       Response: { id, payment_status, stripe_id }

GET    /api/v1/creator/earnings
       Get creator earnings summary
       Response: { total_earned, this_month, pending, last_payout }

POST   /api/v1/creator/:id/reviews
       Submit review (team → creator)
       Request: { rating, comment, aspects }
       Response: { id, published_at }
```

---

## Success Metrics Dashboard

```
TEAM METRICS (Phase 1 Launch):
├─ Shoots created: ___
├─ Team members: ___
├─ Costumes tracked: ___
├─ Average session time: ___
├─ Retention (30-day): ____%
└─ NPS score: ___

CREATOR MARKETPLACE METRICS (Phase 1.5 Launch):
├─ Creator profiles: ___
├─ Verified creators: ___
├─ Completed bookings: ___
├─ Average creator rating: ___._ ⭐
├─ Creator retention (30-day): ____%
├─ Commission revenue: $___/month
└─ Creator NPS: ___

FINANCIAL METRICS (Year 1):
├─ Monthly commission revenue: $___
├─ Paid tier teams: ___
├─ Paid tier creators: ___
├─ Platform break-even: (Month __)
└─ Projected Year 2 revenue: $___k
```

---

**Document Purpose**: Provide visual understanding of marketplace architecture  
**For**: All team members (product, engineering, design, marketing)  
**Next Step**: Share with team for feedback before Phase 1 implementation kick-off
