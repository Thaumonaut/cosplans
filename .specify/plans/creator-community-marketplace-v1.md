# Creator Community & Discovery Marketplace - Phase 1.5 Specification

**Document Version**: 1.0  
**Phase**: 1.5 (Post-web-validation, pre-mobile)  
**Status**: Specification (Ready for Implementation)  
**Last Updated**: 2025-10-16

---

## Executive Summary

The Creator Community Marketplace transforms Cosplans from a team collaboration tool into a community platform where cosplay professionals (photographers, makeup artists, prop modelers, cosplayers, hair stylists) can build public portfolios and be discovered by teams seeking specific skills. This feature enables:

- **Teams**: Find, vet, and book external collaborators using merit-based discovery (not pay-to-play)
- **Creators**: Build reputation, manage bookings, earn money for specialized skills
- **Platform**: Generate sustainable revenue through commission-based model (5% free tier, 0% paid tier)
- **Community**: Support creator economy within cosplay space; prevent brain-drain to external platforms

### Key Design Principles

1. **Opt-in Privacy**: Creators choose to participate; default is private (non-marketplace members)
2. **Merit-Based Discovery**: Sorted by rating and relevance; no featured listings or pay-to-play
3. **Creator Autonomy**: Full control over location visibility, travel distance, rates, profile info
4. **Transparent Transactions**: Teams and creators see payments, invoices, booking status clearly
5. **Community Moderation**: User reports + admin review; prevent fake profiles and harassment
6. **Phase 1.5 Timing**: Marketplace launches after core web features (shoots, costumes, calendar) proven stable

---

## Feature Categories

### 1. Creator Profiles & Discovery

#### 1.1 Creator Profile Setup

**Data Model**:
```sql
-- New table: creator_profiles
CREATE TABLE creator_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  public_username VARCHAR(50) NOT NULL UNIQUE,
  real_name_visibility BOOLEAN DEFAULT false, -- false = only show username
  bio TEXT,
  profile_photo_url VARCHAR(255),
  roles_offered VARCHAR[] NOT NULL, -- e.g., ['photographer', 'makeup_artist']
  
  -- Location & Travel
  zip_code VARCHAR(10),
  travel_distance_miles INT DEFAULT 25, -- min willing to travel
  show_outside_range BOOLEAN DEFAULT false, -- allow bookings outside range?
  
  -- Rates & Availability
  rates_visible BOOLEAN DEFAULT false, -- show rates publicly?
  
  -- Verification & Status
  verification_badge BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false, -- hidden from marketplace search
  is_suspended BOOLEAN DEFAULT false,
  paused_until TIMESTAMP,
  
  -- Portfolio
  portfolio_links VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW()
);

-- New table: creator_roles (per-role rates)
CREATE TABLE creator_roles (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id),
  role VARCHAR(50) NOT NULL, -- photographer, makeup_artist, etc.
  rate_dollars DECIMAL(10, 2), -- optional per-role pricing
  rate_currency VARCHAR(3) DEFAULT 'USD',
  rate_note VARCHAR(255), -- e.g., "Contact for rates"
  created_at TIMESTAMP DEFAULT NOW()
);

-- New table: creator_availability
CREATE TABLE creator_availability (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id),
  date DATE NOT NULL,
  status VARCHAR(20), -- 'available', 'booked', 'unavailable'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Profile Fields**:
- **Public Username**: Required, unique, used in profile URLs (e.g., @jane_photography)
- **Real Name Visibility**: Toggle (checkbox) to show/hide real name
- **Bio/About**: Optional text (max 500 chars) describing experience, specialties
- **Profile Photo**: Required, max 2MB (auto-resize to 200x200 for display)
- **Roles Offered**: Multi-select from predefined list: photographer, cosplayer, makeup artist, prop modeler, hair stylist, assistant, other (custom)
- **Zip Code**: Required (not exact address); displayed as "Within X miles of [Zip]"
- **Travel Distance**: Numeric input (miles), default 25, range 1-500
- **Allow Out-of-Range**: Toggle; if enabled, "Available outside normal range" badge shown in search results
- **Rate per Role**: Optional per-role pricing (photographer $150/day, makeup artist $75/hour, etc.)
- **Portfolio Links**: Up to 5 external links (Instagram, website, ArtStation, etc.)
- **Verification Badge**: Display only (earned automatically, not editable)

**UI Flow - Profile Setup**:
1. User clicks "Set Up Creator Profile" (only visible after account created)
2. Modal/page with sections: Basic Info, Roles, Rates, Location, Privacy
3. Public preview on right side showing how profile will appear in marketplace
4. "Save & Publish" to make profile public; "Save as Draft" to complete later
5. Email confirmation: "Your creator profile is now public! Start getting booked."

#### 1.2 Verification Badge Criteria

**Automatically Awarded** when creator meets ALL criteria:
- Account age: 90+ days
- Community rating: 4.5+ stars average across all bookings
- Bookings per month: 5+ completed, paid bookings in last 30 days
- Reliability: <5% cancellation rate

**Automatically Revoked** if creator falls below ANY criteria:
- Rating drops below 4.0 stars
- Multiple substantiated complaints (5+ reports in 30 days)
- Fails to respond to 3+ booking invitations
- Becomes inactive (no login) for 90+ days

**Badge Display**: 
- Creator profile: Gold badge with checkmark + tooltip ("Verified creator - 90+ days, 4.5+ rating, active bookings")
- Search results: Verification badge displayed next to name
- Booking invite: Badge shown to teams considering invite

#### 1.3 Search & Discovery

**Search Interface**:
- **Location**: Map or zip code input; defaults to user's current location
- **Distance Radius**: Slider (5-500 miles); default 25
- **Roles**: Multi-select checkboxes (photographer, makeup artist, etc.)
- **Availability**: Date range picker (from/to dates)
- **Minimum Rating**: Dropdown (all, 4+, 4.5+)
- **Verified Only**: Toggle (show only creators with verification badge)

**Search Results Display**:
- Grid layout (3 columns desktop, 1 mobile) with cards per creator
- Card shows: Profile photo, name/username, primary role, distance, rating (e.g., "4.8 ★ 23 reviews"), verification badge
- Expandable detail: Bio, all roles, rates, availability, portfolio links
- "View Profile" button → full public profile page
- "Invite to Shoot" button → creates invitation (see section 2.3)

**Results Sorting** (default by relevance):
1. Distance (closest first)
2. Availability match (available on requested dates)
3. Rating (highest rated)
4. Verification badge (verified first)

**Search Results Pagination**: 20 results per page

**Saved Searches** (Paid Tier Only):
- "Save This Search" button → saves search parameters (location, roles, date range)
- Saved searches shown in sidebar with "Run Again" button
- Quick access to frequently-used searches (e.g., "Photographers near me", "Available this weekend")

#### 1.4 Creator Public Profile Page

**Profile Page Components**:

```
[Profile Header]
- Profile photo (large, 400x400)
- Name / @username (hide name if toggled private)
- Verification badge (if earned)
- "Available" or "Unavailable" status
- Rating: "4.8 ★ 23 verified bookings"
- Distance from current location: "12 miles away" or "Outside my normal 25-mile range"

[About & Roles]
- Bio text
- Roles: "📷 Photographer, 🎨 Makeup Artist"
- Years experience (optional)

[Rates]
- Per-role pricing table (if rates_visible)
  - Photographer: $150/day
  - Makeup Artist: $75/hour
  - [Contact for rates] (if some roles hidden)

[Portfolio]
- Up to 5 external portfolio links with preview thumbnails (if available)
- Instagram link with embedded recent 3 posts preview

[Availability]
- Calendar showing available/booked/unavailable dates for next 60 days
- Tooltip on hover: "Available" or "Booked" or reason unavailable

[Reviews & Ratings]
- Average rating (e.g., "4.8 stars")
- Review breakdown: 5⭐ 20, 4⭐ 3, 3⭐ 0, 2⭐ 0, 1⭐ 0
- Recent reviews (newest first, max 10 displayed)
  - Review text (max 500 chars)
  - Rating (1-5 stars)
  - Team name (anonymized if private)
  - Date of shoot
  - [+3 more reviews] load more link

[Location]
- "Based in [Zip Code]"
- "Willing to travel up to 25 miles"
- "Available for shoots outside normal range"

[Contact & Booking]
- "Invite to Shoot" button (for logged-in teams)
- Public email (optional, shown on profile)
```

#### 1.5 Private vs. Public Profile

**Private Profile** (default):
- Not indexed in marketplace search
- Only team members who invited creator to specific shoot can see profile
- Creator still visible in team's crew history (if they worked on a shoot)
- Can be toggled to public at any time

**Public Profile** (marketplace participant):
- Indexed in search and visible to all users
- Appears in marketplace search results
- Can be toggled to private at any time
- "Pause Profile" option: private without deletion (re-enable later)

---

### 2. Crew Assignment & Booking Integration

#### 2.1 Crew Assignment Workflow

**When Adding Crew to Shoot** (existing feature enhanced):

Current flow:
1. Click "Add Crew" on shoot detail page
2. Option A: Create new crew member manually
3. Option B: Search previous crew from team history

**Enhanced flow (Phase 1.5)**:
1. Click "Add Crew" on shoot detail page
2. Option A: Create new crew member manually
3. Option B: Search previous crew from team history
4. **Option C: Find Creators** (new) → opens marketplace search
   - Pre-populates with shoot date/location
   - Can filter by role (photographer, makeup artist, etc.)

#### 2.2 Auto-Suggest Creators

**Suggestion Algorithm**:
When team opens "Add Crew" dialog:
1. Extract shoot date, location (zip code)
2. Query creators who:
   - Match role needed (role multi-select on shoot)
   - Are within travel_distance_miles of shoot location
   - Have availability marked for shoot date
   - Are verified or highly-rated (4.5+)
3. Sort by: distance (closest), rating (highest), then availability match
4. Display top 5-10 suggestions

**UI Display**:
```
[Add Crew Dialog]

Search for crew members

[Tab: New Crew Member]
Form to manually create crew member

[Tab: Team Crew History]
Previous crew members with search/filter

[Tab: Find Creators] ← NEW
Pre-populated suggestions based on shoot details

[Suggested Creators]
"Suggestions for your shoot: 8/22/2025, Portland OR"
- Jane Photography (4.9 ★, 8 miles, available)
  📷 Photographer
  "Available outside normal 25-mile range"
  [Invite] button
  
- Mike Styles (4.7 ★, 12 miles, available)
  💄 Makeup Artist
  $75/hr
  [Invite] button
  
- Sarah Cosplay (4.5 ★, 22 miles, available)
  👗 Cosplayer, Assistant
  [Invite] button
```

#### 2.3 Invitation System

**One-Click Invite**:
1. Team member clicks "Invite" on suggested creator
2. Invitation details auto-populated:
   - Shoot date/time
   - Shoot location
   - Role(s) needed (photographer, makeup artist, etc.)
   - Pay rate (if team set rate for role)
3. Modal shows:
   - Creator profile preview
   - Proposed rate
   - "Send Invitation" button (no further editing required)
4. Email sent to creator with:
   - From: "[Team Name]"
   - Subject: "Invited to Shoot: [Shoot Name] on [Date]"
   - Email body includes:
     - Shoot date, time, location
     - Role(s) needed
     - Pay rate (if applicable)
     - Team contact (email, phone if provided)
     - One-click link: "View Shoot & Respond" → takes creator to shoot detail page
   - Link expires in 7 days

**External Crew Member Onboarding** (Creator Accepts):
1. Creator clicks email link or logs into Cosplans
2. Sees invitation in "Pending Invitations" section
3. Can view shoot detail page (public view):
   - Shoot date, time, location
   - Visual references
   - Shoot description
   - Team member contact info
   - Role description
   - Pay rate
   - No access to team's other shoots or private team data
4. Buttons: "Accept" or "Decline"
5. If accepted:
   - Invitation status changes to "Accepted"
   - Creator appears in shoot crew list with "✓ Accepted" badge
   - Team members notified in real-time: "[Creator Name] accepted your invitation"
   - Creator added to shoot_crew table with external_crew flag

#### 2.4 External Crew Access Control

**External Crew Can**:
- View public shoot detail page (dates, location, visual references, description)
- View team contact information (email, phone if provided)
- See other external crew members assigned to same shoot
- View their own booking status and pay information
- Submit/update their availability calendar
- Upload completion notes after shoot (optional)

**External Crew Cannot**:
- View other team shoots (only their assigned shoot)
- Modify shoot details (dates, location, references)
- Access team member list beyond those on this shoot
- View team budget or financial data
- Access team settings or integrations

**Data Access Layer** (RLS):
```sql
-- External crew can view shoots they're invited to
CREATE POLICY external_crew_view_shoots ON shoots
  USING (
    id IN (
      SELECT shoot_id FROM shoot_crew 
      WHERE crew_id IN (SELECT id FROM crew WHERE user_id = auth.uid())
    )
  );
```

---

### 3. Creator Marketplace Transactions & Payments

#### 3.1 Payment Model

**Commission Structure**:
- **Free Tier Creators**: Cosplans charges 5% commission on booking payments
  - Creator receives: 95% of agreed rate
  - Example: $100 rate → creator gets $95, Cosplans keeps $5
  
- **Paid Tier Creators** ($5/month): 0% commission (Cosplans absorbs fee)
  - Creator receives: 100% of agreed rate
  - Business model: Subscription revenue offsets lost commissions

- **Free Tier Teams**: Cosplans charges 5% commission on creator payments
  - Team pays: rate + 5% commission to Cosplans
  - Example: $100 rate → team pays $105 total ($100 to creator, $5 to Cosplans)

- **Paid Tier Teams** ($5/month): 0% commission
  - Team pays: exact agreed rate (no platform fee)

**Free Tier Transaction Cap**:
- Free tier users capped at 50 transactions per month
- If user exceeds 50 transactions, prompted to upgrade to paid tier
- Cap prevents free tier abuse by commercial operations

#### 3.2 Team Budget & Payment Management

**Team Bank Account** (New Feature):
- Shared pool of funds managed by team owner/admins
- Team members can contribute funds (personal → team bank)
- When paying creators, funds deducted from team bank
- Balance visible to all team members (transparency)

**Data Model**:
```sql
-- Team bank account
CREATE TABLE team_budgets (
  id UUID PRIMARY KEY,
  team_id UUID NOT NULL UNIQUE REFERENCES teams(id),
  balance_dollars DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Budget transactions (deposits/withdrawals)
CREATE TABLE budget_transactions (
  id UUID PRIMARY KEY,
  team_budget_id UUID NOT NULL REFERENCES team_budgets(id),
  type VARCHAR(20), -- 'deposit', 'payment', 'refund'
  amount_dollars DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  created_by UUID NOT NULL REFERENCES users(id),
  related_booking_id UUID REFERENCES shoot_crew(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Creator payments
CREATE TABLE creator_payments (
  id UUID PRIMARY KEY,
  shoot_crew_id UUID NOT NULL REFERENCES shoot_crew(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id),
  rate_dollars DECIMAL(10, 2) NOT NULL,
  commission_dollars DECIMAL(10, 2) DEFAULT 0, -- 5% or $0
  total_paid_dollars DECIMAL(10, 2) NOT NULL, -- rate + commission
  payment_status VARCHAR(20), -- 'pending', 'approved', 'sent', 'complete'
  payment_method VARCHAR(20), -- 'stripe_connect', 'ach', 'paypal'
  stripe_payout_id VARCHAR(100),
  shoot_complete_date DATE,
  paid_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Workflow**:
1. Team adds creator to shoot with rate (e.g., $150 for photographer)
2. Shoot marked "complete" by team
3. Creator notified: "Shoot marked complete. Your $150 payment will be processed within 48 hours"
4. Team sees payment in "Pending Payouts" section:
   - Creator name, rate, commission, total due
   - Options: [Approve & Pay] [Decline] [Edit Rate]
5. Team clicks "Approve & Pay":
   - Payment status → "processing"
   - Escrow holds funds temporarily
   - Stripe transfer initiated to creator's bank account (via Stripe Connect)
6. Creator receives email: "Payment received: $150 for [Shoot Name]"
7. Creator can view payment in "Earnings" section

#### 3.3 Creator Earnings & Payout Management

**Creator Dashboard - Earnings Section** (New):
- **Total Earned (All Time)**: $2,450.00
- **This Month**: $380.00 (3 bookings)
- **Pending Payouts**: $150.00 (1 approved, awaiting transfer)
- **Last Payout**: $230.00 on Oct 10, 2025

**Earnings Table**:
| Date | Shoot | Role | Rate | Commission | Total | Status |
|------|-------|------|------|-----------|-------|--------|
| 10/15 | Summer Cosplay | Photography | $150 | -$7.50 | $142.50 | ✓ Paid |
| 10/08 | Con Pre-Shoot | Makeup | $100 | -$5.00 | $95.00 | ✓ Paid |
| 10/01 | Portfolio | Assist | $50 | -$2.50 | $47.50 | ✓ Paid |

**Payout Options** (Paid Tier Only):
- Weekly automatic payouts (every Monday)
- On-demand payout (withdraw whenever)
- Minimum payout threshold: $20
- Payout methods: Stripe Connect (fastest), ACH transfer, PayPal

**Tax Reporting** (Phase 2):
- Annual 1099 generation if earnings > $20k
- CSV export of all transactions for tax prep
- Quarterly tax estimate calculator

---

### 4. Reviews & Community Moderation

#### 4.1 Review System

**When Reviews Are Created**:
- After shoot status → "complete"
- After payment marked "paid" (escrow released)
- Both team and creator can review each other

**Review Prompts**:
- "Rate your experience with [Creator Name]" (for teams reviewing creators)
- "Rate your experience with [Team Name]" (for creators reviewing teams)

**Review Form**:
```
Rating (required):
[1⭐] [2⭐] [3⭐] [4⭐] [5⭐]

Comments (optional, max 500 chars):
[Text input]
[Aspect tags - select up to 3]:
- Professional
- Reliable
- Creative
- Communicative
- Flexible
- Punctual

[Submit Review] [Cancel]
```

**Public Review Display**:
- Shown on creator profile and team profile (if applicable)
- Anonymous by default (shows only rating + comment, not reviewer name)
- Newest reviews first
- Ability to report inappropriate reviews

**Handling Dispute**:
- If creator disputes review (within 7 days), both parties can add context comment
- Admin review for inappropriate content (harassment, slurs, misinformation)
- Reviews can be flagged for removal by admins

#### 4.2 Report System

**What Can Be Reported**:
- Fake profile (not a real creator)
- Harassment or discriminatory language in profile or messages
- Quality issues (paid for photography, got blurry shots)
- Safety concerns (inappropriate behavior)
- Spam or commercial content
- Other (free-text description)

**Report Flow**:
1. User clicks [Report] on creator profile or in review
2. Modal opens with options (listed above)
3. User provides evidence (screenshot, message excerpt, context)
4. Submits report
5. Confirmation: "Report received. We'll review within 48 hours."

**Admin Review Process**:
1. Reports go to admin queue with creator name, report reason, evidence
2. Admin assesses: validated vs. invalid
3. Actions if validated:
   - **Warning**: First offense; creator notified, tracked
   - **Suspension**: 7-30 days (temp removal from marketplace)
   - **Termination**: Permanent removal (serious violations)
4. Notification sent to all parties:
   - Reported creator: "Your profile was reviewed. Reason: [summary]"
   - Reporter: "Review complete. Action taken: [summary, no details]"

**Verification Badge Revocation**:
- Substantiated report with pattern of violations → badge removed
- Creator notified: "Your verification badge has been removed due to [reason]"
- Can be re-earned after 60 days clean

#### 4.3 Community Showcase

**Purpose**: Celebrate verified creators and recent projects; inspire community

**How It Works**:
- Verified creators (or their teams) can submit recent project highlights
- Submission includes: Instagram post link, photo, project name, brief description
- Displayed in chronological order (newest first, no algorithmic ranking)
- Gallery view: Grid layout with cards, each showing project photo + creator name + link

**Submission Flow** (for Creators):
1. Creator clicks "Submit to Community Showcase"
2. Modal with form:
   - Project name (required)
   - Photo upload or Instagram post URL (required)
   - Short description (optional, max 200 chars)
   - Tags: BTS, Finished Cosplay, WIP, Convention, Other
3. Submits for manual review
4. Admin approves/rejects within 24 hours
5. If approved, added to showcase gallery

**Community Showcase Page**:
```
[Community Showcase]
"Recent cosplay work from verified creators"

[Grid of projects - 4 columns desktop, 1 mobile]
Each card shows:
- Project photo (400x300)
- Creator name + @username
- Project name
- BTS / Finished / WIP tag
- [View Profile] link
- [View on Instagram] link (if applicable)

[Load More] button at bottom

Can be filtered by:
- Creator name (search)
- Project type (BTS, Finished, WIP, Convention)
- Date range (newest, this month, this week)
```

---

### 5. Creator Profiles & Privacy

#### 5.1 Privacy Controls

**Creator Profile Settings**:
- **Make Profile Private**: Toggle (removes from marketplace search, visible only to invited crews)
- **Hide Real Name**: Toggle (show only username)
- **Hide Exact Location**: Option to show only region or state (vs. zip code)
- **Minimum Travel Distance**: Numeric input (don't show in searches outside this range)
- **Allow Out-of-Range**: Toggle (enable bookings outside normal travel distance)
- **Pause Profile**: Temporary hide without deletion (re-enable anytime)
- **Show Rates**: Toggle (public vs. "contact for rates")

**What's Always Private**:
- Personal notes
- Message history (encrypted)
- Bank account details
- Tax information

#### 5.2 Data Retention & Deletion

**Account Deletion**:
- If creator deletes account:
  - Profile removed from marketplace search
  - Reviews remain (anonymized)
  - Historical bookings preserved for team reference
  - Earnings data archived for 7 years (tax requirements)

**Leaving Marketplace** (without deleting account):
- "Pause Profile" button → profile hidden, can resume anytime
- Data preserved; re-enable at any point

---

### 6. Creator Performance Analytics

**Creator Dashboard - Analytics Section** (Paid Tier Only):
- **Profile Views**: 245 views this month
- **Booking Requests**: 12 invitations received
- **Conversion Rate**: 75% (9 accepted / 12 invited)
- **Average Rating**: 4.8 ⭐
- **Search Impressions**: Appeared in X search results

**Charts** (30-day, 90-day, all-time views):
- Profile views over time (line chart)
- Booking conversion funnel (invites → accepted → completed)
- Revenue trend (total earned, commission paid)
- Repeat client rate (% of teams booking 2+ times)

**Notifications**:
- Alert when rating drops below 4.5
- Alert when 7+ days without responding to invitations
- Weekly digest: "You had 5 profile views this week"

---

## Data Model Additions

### New Tables

```sql
-- Creator profiles (primary marketplace entity)
CREATE TABLE creator_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  public_username VARCHAR(50) NOT NULL UNIQUE,
  real_name_visibility BOOLEAN DEFAULT false,
  bio TEXT,
  profile_photo_url VARCHAR(255),
  roles_offered VARCHAR[] NOT NULL,
  
  -- Location & Travel
  zip_code VARCHAR(10) NOT NULL,
  travel_distance_miles INT DEFAULT 25,
  show_outside_range BOOLEAN DEFAULT false,
  
  -- Rates & Availability
  rates_visible BOOLEAN DEFAULT false,
  
  -- Verification & Status
  verification_badge BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  is_suspended BOOLEAN DEFAULT false,
  paused_until TIMESTAMP,
  
  -- Portfolio
  portfolio_links VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
  
  -- Community Activity
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  completed_bookings INT DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_travel_distance CHECK (travel_distance_miles >= 1 AND travel_distance_miles <= 500),
  CONSTRAINT valid_rating CHECK (average_rating >= 0 AND average_rating <= 5)
);

-- Per-role rates
CREATE TABLE creator_roles (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  rate_dollars DECIMAL(10, 2),
  rate_currency VARCHAR(3) DEFAULT 'USD',
  rate_note VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_creator_role UNIQUE(creator_id, role)
);

-- Availability calendar
CREATE TABLE creator_availability (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'available', 'booked', 'unavailable'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_creator_date UNIQUE(creator_id, date)
);

-- Creator reviews (from teams)
CREATE TABLE creator_reviews (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  shoot_crew_id UUID NOT NULL REFERENCES shoot_crew(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id),
  rating INT NOT NULL, -- 1-5
  comment TEXT,
  aspects VARCHAR[] DEFAULT ARRAY[]::VARCHAR[], -- ['professional', 'reliable', etc.]
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_shoot_review UNIQUE(shoot_crew_id),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- Team reviews (from creators)
CREATE TABLE team_reviews (
  id UUID PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  shoot_crew_id UUID NOT NULL REFERENCES shoot_crew(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id),
  rating INT NOT NULL, -- 1-5
  comment TEXT,
  aspects VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- Community reports
CREATE TABLE community_reports (
  id UUID PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES users(id),
  reported_creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL, -- 'fake_profile', 'harassment', 'quality', 'safety', 'spam', 'other'
  description TEXT NOT NULL,
  evidence_url VARCHAR(255),
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'dismissed'
  admin_note TEXT,
  action_taken VARCHAR(50), -- 'none', 'warning', 'suspension', 'termination'
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Community showcase submissions
CREATE TABLE showcase_submissions (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  project_name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  description TEXT,
  tags VARCHAR[] DEFAULT ARRAY[]::VARCHAR[], -- ['bts', 'finished', 'wip', 'convention']
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP
);

-- Team budget
CREATE TABLE team_budgets (
  id UUID PRIMARY KEY,
  team_id UUID NOT NULL UNIQUE REFERENCES teams(id) ON DELETE CASCADE,
  balance_dollars DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Budget transactions
CREATE TABLE budget_transactions (
  id UUID PRIMARY KEY,
  team_budget_id UUID NOT NULL REFERENCES team_budgets(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'deposit', 'payment', 'refund'
  amount_dollars DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  created_by UUID NOT NULL REFERENCES users(id),
  related_booking_id UUID REFERENCES shoot_crew(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Creator payments
CREATE TABLE creator_payments (
  id UUID PRIMARY KEY,
  shoot_crew_id UUID NOT NULL REFERENCES shoot_crew(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id),
  rate_dollars DECIMAL(10, 2) NOT NULL,
  commission_dollars DECIMAL(10, 2) DEFAULT 0,
  total_paid_dollars DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'sent', 'complete'
  payment_method VARCHAR(20),
  stripe_payout_id VARCHAR(100),
  shoot_complete_date DATE,
  paid_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Saved creator searches (paid tier only)
CREATE TABLE saved_creator_searches (
  id UUID PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  search_name VARCHAR(100) NOT NULL,
  zip_code VARCHAR(10),
  distance_miles INT,
  roles_filter VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
  min_rating DECIMAL(3, 2),
  verified_only BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  last_run_at TIMESTAMP
);

-- Creator marketplace invitations
CREATE TABLE marketplace_invitations (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  shoot_crew_id UUID REFERENCES shoot_crew(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id),
  role VARCHAR(50) NOT NULL,
  shoot_date DATE NOT NULL,
  shoot_location VARCHAR(255),
  rate_dollars DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  token VARCHAR(100) UNIQUE NOT NULL, -- For email link auth
  token_expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP
);
```

### Updated Tables

**shoot_crew** (existing, add fields):
```sql
ALTER TABLE shoot_crew ADD COLUMN external_crew BOOLEAN DEFAULT false;
ALTER TABLE shoot_crew ADD COLUMN creator_id UUID REFERENCES creator_profiles(id);
ALTER TABLE shoot_crew ADD COLUMN invite_email VARCHAR(100);
ALTER TABLE shoot_crew ADD COLUMN invite_accepted_at TIMESTAMP;
```

**users** (existing, add fields):
```sql
-- Support public usernames
ALTER TABLE users ADD COLUMN public_username VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN is_creator BOOLEAN DEFAULT false;
```

---

## API Endpoints

### Creator Profile Management

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /api/v1/creator/profile | Create creator profile | User |
| GET | /api/v1/creator/profile | Get own creator profile | Creator |
| PUT | /api/v1/creator/profile | Update creator profile | Creator |
| DELETE | /api/v1/creator/profile | Delete creator profile | Creator |
| GET | /api/v1/creators/:id | Get public creator profile | Public |
| POST | /api/v1/creator/profile/pause | Pause profile (temp hide) | Creator |
| POST | /api/v1/creator/profile/resume | Resume paused profile | Creator |

### Creator Search & Discovery

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | /api/v1/creators/search | Search creators | Public |
| GET | /api/v1/creators/suggest?shootId=X | Auto-suggest creators for shoot | Team |
| POST | /api/v1/creator/searches/save | Save creator search | Paid Team |
| GET | /api/v1/creator/searches/saved | Get saved searches | Paid Team |

### Invitations & Bookings

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /api/v1/creator/invitations | Send marketplace invitation | Team |
| GET | /api/v1/creator/invitations | Get pending invitations | Creator |
| POST | /api/v1/creator/invitations/:id/accept | Accept invitation | Creator |
| POST | /api/v1/creator/invitations/:id/decline | Decline invitation | Creator |
| GET | /api/v1/crew/:id/invitation | Get invitation details (via email token) | Public |

### Reviews & Ratings

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /api/v1/creator/:id/reviews | Submit review of creator | Team |
| GET | /api/v1/creator/:id/reviews | Get reviews for creator | Public |
| POST | /api/v1/team/:id/reviews | Submit review of team | Creator |
| GET | /api/v1/team/:id/reviews | Get reviews for team | Public |

### Payments & Earnings

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /api/v1/bookings/:id/complete | Mark shoot complete, enable payments | Team |
| POST | /api/v1/payments | Process payment to creator | Team |
| GET | /api/v1/creator/earnings | Get creator earnings summary | Creator |
| GET | /api/v1/creator/earnings/history | Get detailed earnings history | Creator |
| GET | /api/v1/team/payments | Get team payment history | Team |

### Moderation & Reports

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /api/v1/reports | Submit community report | User |
| GET | /api/v1/admin/reports | Get all reports | Admin |
| PUT | /api/v1/admin/reports/:id | Review & action report | Admin |

### Community Showcase

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | /api/v1/showcase | Get showcase gallery | Public |
| POST | /api/v1/showcase/submit | Submit project to showcase | Verified Creator |
| GET | /api/v1/admin/showcase | Get pending submissions | Admin |

---

## Testing Strategy

### Unit Tests
- Creator profile validation (username uniqueness, zip code format, distance range)
- Commission calculation (5% vs. 0%)
- Verification badge criteria evaluation
- Search algorithm (distance, rating, availability matching)

### Integration Tests
- End-to-end invitation flow (team invites → email sent → creator accepts)
- Payment flow (booking → completion → payment processing)
- Review submission and rating recalculation
- Report submission and admin action workflow

### E2E Tests (Playwright)
**Scenario 1: Creator Marketplace Discovery**
1. Team member searches for photographers within 25 miles
2. Filters by date availability and 4.5+ rating
3. Saves search as favorite
4. Re-runs saved search next week

**Scenario 2: Booking & Payment**
1. Team creates shoot
2. Auto-suggests nearby makeup artists
3. Sends one-click invitation to creator
4. Creator accepts via email link
5. Shoot marked complete
6. Payment processed to creator's bank account
7. Creator reviews team; team reviews creator

**Scenario 3: Verification Badge**
1. Creator account aged 90+ days
2. Has 5+ completed bookings
3. Rating 4.5+ stars
4. Badge appears on profile

**Scenario 4: Report & Moderation**
1. Team reports creator for quality issues
2. Admin receives report
3. Admin contacts creator with warning
4. Report marked resolved

---

## Rollout Plan

### Phase 1.5a (Week 1-2)
- Deploy creator profile creation UI
- Basic search functionality (roles, location)
- Database migrations

### Phase 1.5b (Week 3-4)
- Invitation system (email, external crew links)
- Creator availability calendar
- External crew access control

### Phase 1.5c (Week 5-6)
- Payment processing (Stripe integration)
- Review system
- Earnings dashboard

### Phase 1.5d (Week 7-8)
- Report & moderation system
- Community showcase
- Creator analytics (paid tier)

### Phase 1.5e (Ongoing)
- Saved searches (paid tier)
- Performance monitoring
- Community feedback integration

---

## Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Creator profiles created | 50+ verified creators | End of Phase 1.5 |
| Successful bookings | 20+ paid bookings | End of Phase 1.5 |
| Creator retention (30-day) | 70%+ of creators remain active | Month 2 after launch |
| Average creator rating | 4.5+ stars | Ongoing |
| Commission revenue | $500+/month | Month 2 after launch |
| User NPS (creator question) | 40+ | Month 3 after launch |
| Report/moderation case resolution | <48 hours average | Ongoing |

---

## Future Enhancements (Phase 2+)

- **Creator mentorship program**: Veteran creators mentor new creators
- **Team team collaborations**: Teams host workshop events; creators apply
- **Influencer partnerships**: Featured creator spotlights in newsletter
- **Referral rewards**: Earn commission for referring new creators/teams
- **Advanced analytics**: Trend forecasting, seasonality analysis
- **Creator portfolios with verification**: Showcase past work with verifiable client references
- **Subscription analytics service**: Advanced insights for paid creators
- **B2B team onboarding**: Consulting service for large cosplay organizations

---

**Document Status**: Ready for implementation  
**Next Review**: After Phase 1.5a completion  
**Maintained By**: [Development Team]
