# Social Media Workflow Integration Specification

**Date**: October 16, 2025  
**Constitution Version**: 2.0.0  
**Scope**: Phase 1 (Instagram), Phase 2+ (TikTok)

---

## Overview

Cosplans integrates social media planning directly into shoot workflow, enabling teams to:
1. Plan content alongside shoot logistics
2. Schedule posts aligned with shoot timelines
3. Manage captions and hashtags systematically
4. Track engagement and growth metrics
5. Enable team collaboration on content (drafts → approval → posting)

This prevents context-switching between Cosplans, Instagram Creator Studio, and external scheduling tools.

---

## Phase 1: Instagram Integration

### 1. Instagram Account Connection

**Feature**: OAuth-based Instagram Business Account linking

**Requirements**:
- Teams can connect one or more Instagram Business Accounts (one per team admin/owner)
- OAuth flow requests `instagram_business_account`, `instagram_graph_api` permissions
- Store Instagram account ID, access token (encrypted), expiration, and refresh token
- Display connected accounts in team settings with last sync timestamp
- Allow team members to view which Instagram account is connected
- Only owner/admin can disconnect or re-authenticate accounts

**Data Storage**:
```sql
CREATE TABLE instagram_accounts (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  instagram_business_account_id TEXT UNIQUE NOT NULL,
  access_token TEXT ENCRYPTED NOT NULL,
  refresh_token TEXT ENCRYPTED,
  token_expires_at TIMESTAMP,
  account_username TEXT,
  account_name TEXT,
  profile_picture_url TEXT,
  connected_by_id UUID REFERENCES users(id),
  connected_at TIMESTAMP,
  last_sync_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 2. Content Calendar

**Feature**: Visual calendar synchronized with shoot schedule

**Requirements**:
- Display shoots and planned Instagram posts on same timeline
- View shoots in "Planning" state and link to Instagram draft posts
- Color-code content pillars (BTS, finished costume, WIP, convention coverage)
- Show scheduled posts with posting time, caption preview, engagement stats
- Drag-to-reschedule posts or shoots
- Batch view: see 7-day, 30-day posting plan

**UI Components**:
- Calendar view (week/month)
- Timeline view (chronological list)
- Grid view (by content pillar)
- Detail view: shoot + planned posts

**Example Calendar Entry**:
```
Mon Oct 23: SHOOT (Pink Wig Convention)
├── BTS: "Getting ready" (scheduled 3pm)
├── BTS: "On the way" (scheduled 5pm)
└── FINISHED: "The full look" (scheduled 8pm)

Tue Oct 24: [no shoot]
└── WIP: "Armor painting time-lapse" (scheduled 7pm)
```

### 3. Draft Post Creation & Editing

**Feature**: Create Instagram posts (feed, Reels, Stories) with templates

**Requirements**:
- Draft posts directly within Cosplans (no context-switching to Instagram)
- Support feed posts, Reels, Stories, Carousel posts
- Attach images from shoot library (reference images, progress photos)
- Write custom captions or select from templates
- Add location tags (linked to shoot location)
- Add hashtags from saved sets or custom
- Preview post appearance (feed, Reels, Stories mockups)
- Save drafts (not yet scheduled)
- Share draft with team for feedback (Reels only for Phase 2)

**Draft Post Data Model**:
```sql
CREATE TABLE instagram_drafts (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  instagram_account_id UUID REFERENCES instagram_accounts(id),
  shoot_id UUID REFERENCES shoots(id), -- Optional: linked shoot
  
  post_type TEXT NOT NULL, -- 'feed', 'reel', 'story', 'carousel'
  
  -- Content
  caption TEXT,
  image_ids UUID[] DEFAULT ARRAY[]::UUID[], -- Linked images from Cosplans
  carousel_order INT[], -- Order of images in carousel
  
  -- Metadata
  content_pillar TEXT, -- 'bts', 'finished', 'wip', 'convention', 'custom'
  location_tag TEXT, -- Optional location name
  hashtags TEXT[], -- Array of hashtags
  
  -- Scheduling
  scheduled_for TIMESTAMP,
  posted_at TIMESTAMP,
  instagram_post_id TEXT, -- Set after posting
  
  -- Collaboration
  created_by_id UUID REFERENCES users(id),
  approved_by_id UUID REFERENCES users(id), -- Admin/owner approval for team posting
  
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'posted', 'failed'
  error_message TEXT,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 4. Caption & Hashtag Templates

**Feature**: Reusable templates for consistent branding

**Requirements**:
- Teams can create caption templates with placeholders
- Placeholder variables: `{shoot_name}`, `{character}`, `{location}`, `{date}`, `{hashtags}`
- Templates organized by content pillar (BTS, finished, WIP, convention)
- Built-in templates provided (cosplay, photography, convention coverage)
- Team members can suggest templates; owner/admin approves
- One-click apply template to draft post

**Template Example**:
```
Caption Template (BTS):
"Behind the scenes! 📸 Getting ready for {character} at {location}. 
Costume by @[tag team members]. 
#cosplay #cosplayer {hashtags}"

Hashtag Set (Convention):
[#cosplay, #cosplayer, #costume, #makeup, #convention2025, #photooftheday, ...]
```

**Data Model**:
```sql
CREATE TABLE instagram_templates (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  
  template_type TEXT NOT NULL, -- 'caption', 'hashtag_set'
  content_pillar TEXT, -- 'bts', 'finished', 'wip', 'convention'
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- For captions
  template_text TEXT, -- Text with {placeholders}
  
  -- For hashtag sets
  hashtags TEXT[],
  
  created_by_id UUID REFERENCES users(id),
  usage_count INT DEFAULT 0, -- Track most popular templates
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 5. Post Scheduling & Publishing

**Feature**: Schedule posts for specific dates/times, with approval workflow

**Requirements**:
- Schedule posts for specific date/time (respect Instagram best times)
- For free tier: manual scheduling (user must post within Cosplans at scheduled time)
- For paid tier: automatic scheduling (Phase 1.5+) via Instagram Graph API
- Admin/owner approval required before team members can publish (optional per team)
- Batch schedule: select multiple drafts and schedule as series
- Post to main feed or Stories (Reels in Phase 2)
- Cancel scheduled posts
- Track posting success/failure with error logging

**Approval Workflow** (optional, configurable per team):
```
Draft Created → Team feedback → Submitted for approval → 
Admin reviews → Approved → Scheduled for posting → Auto-published
```

### 6. Analytics & Engagement Tracking

**Feature**: View post performance directly in Cosplans

**Requirements**:
- Sync engagement metrics hourly: likes, comments, saves, shares, reach, impressions
- Display per-post analytics: engagement rate, save rate, reach
- Trending hashtags: show which hashtags drove most reach
- Content pillar analytics: see which content types perform best
- Time-of-day analytics: when do followers engage most
- Follower growth tracking: daily follower count graph
- Monthly analytics report (free tier: limited, paid tier: detailed)

**Analytics Data Model**:
```sql
CREATE TABLE instagram_post_analytics (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  instagram_account_id UUID REFERENCES instagram_accounts(id),
  instagram_post_id TEXT NOT NULL,
  cosplans_draft_id UUID REFERENCES instagram_drafts(id),
  
  -- Engagement metrics
  likes_count INT,
  comments_count INT,
  saves_count INT,
  shares_count INT,
  reach INT,
  impressions INT,
  engagement_rate DECIMAL,
  
  -- Hashtag performance
  top_hashtags TEXT[], -- Top 5 performing hashtags
  
  -- Time data
  synced_at TIMESTAMP,
  
  -- Historical tracking (daily snapshots)
  UNIQUE(instagram_post_id, synced_at)
);

CREATE TABLE instagram_account_metrics (
  id UUID PRIMARY KEY,
  instagram_account_id UUID REFERENCES instagram_accounts(id),
  follower_count INT,
  following_count INT,
  synced_at TIMESTAMP,
  UNIQUE(instagram_account_id, DATE(synced_at))
);
```

### 7. Team Collaboration on Content

**Feature**: Multiple team members draft posts, owner/admin reviews

**Requirements**:
- Team members can see who created each draft
- Comments/feedback on drafts (thread of discussion)
- @mention team members to request feedback
- Draft history: show previous versions
- Admin/owner can edit team member drafts before approval
- Approval required flag: drafts awaiting approval show up in team notifications
- Audit trail: log who approved/posted each content

---

## Phase 2+: TikTok Integration

**Planned Features** (not Phase 1):
- TikTok Business Account connection
- Cross-post from Instagram to TikTok (different editing for vertical format)
- TikTok-specific analytics (watch time, completion rate)
- TikTok Trending Sounds integration
- Collaborative video editing (trimming, effects, captions in-app)

---

## API Endpoints (Instagram)

### Account Management

```
GET /api/v1/teams/{teamId}/instagram/accounts
  → List connected Instagram accounts

POST /api/v1/teams/{teamId}/instagram/accounts/auth
  → Start OAuth flow for Instagram Business Account

GET /api/v1/instagram/oauth/callback?code={code}
  → Handle OAuth callback, store access token

DELETE /api/v1/teams/{teamId}/instagram/accounts/{accountId}
  → Disconnect Instagram account (owner/admin only)
```

### Content Calendar & Drafts

```
GET /api/v1/teams/{teamId}/instagram/calendar?start_date=&end_date=
  → Get calendar view (shoots + scheduled posts)

GET /api/v1/teams/{teamId}/instagram/drafts
  → List all drafts (filter by status, content_pillar, date)

POST /api/v1/teams/{teamId}/instagram/drafts
  → Create new draft
  → Body: {caption, image_ids, content_pillar, hashtags, scheduled_for}

PATCH /api/v1/teams/{teamId}/instagram/drafts/{draftId}
  → Edit draft (before approval)

POST /api/v1/teams/{teamId}/instagram/drafts/{draftId}/schedule
  → Schedule draft for posting (approvals checked)

POST /api/v1/teams/{teamId}/instagram/drafts/{draftId}/publish
  → Immediately publish draft to Instagram

DELETE /api/v1/teams/{teamId}/instagram/drafts/{draftId}
  → Delete draft

GET /api/v1/teams/{teamId}/instagram/drafts/{draftId}/preview
  → Preview how post will look on Instagram
```

### Templates

```
GET /api/v1/teams/{teamId}/instagram/templates
  → List caption/hashtag templates

POST /api/v1/teams/{teamId}/instagram/templates
  → Create new template (owner/admin only)

PATCH /api/v1/teams/{teamId}/instagram/templates/{templateId}
  → Edit template

DELETE /api/v1/teams/{teamId}/instagram/templates/{templateId}
  → Delete template
```

### Analytics

```
GET /api/v1/teams/{teamId}/instagram/analytics
  → Dashboard: engagement summary, trending content, follower growth

GET /api/v1/teams/{teamId}/instagram/posts/{postId}/analytics
  → Single post analytics detail

GET /api/v1/teams/{teamId}/instagram/analytics/hashtags
  → Trending hashtags for this team
```

---

## Permission Model

| Action | Owner | Admin | Member | Viewer |
|--------|-------|-------|--------|--------|
| Connect Instagram account | ✅ | ✅ | ❌ | ❌ |
| View connected accounts | ✅ | ✅ | ✅ | ❌ |
| Create draft | ✅ | ✅ | ✅ | ❌ |
| Edit own draft | ✅ | ✅ | ✅ | ❌ |
| Edit team member's draft | ✅ | ✅ | ❌ | ❌ |
| Approve draft for posting | ✅ | ✅ | ❌ | ❌ |
| Publish/schedule post | ✅ | ✅ | ✅* | ❌ |
| View analytics | ✅ | ✅ | ✅ | ❌ |
| Manage templates | ✅ | ✅ | ❌ | ❌ |

*Members can publish own drafts; owner/admin can publish any draft

---

## Error Handling & Resilience

### Instagram API Failures

| Error | Behavior |
|-------|----------|
| **Token expired** | Auto-refresh token; if refresh fails, prompt re-auth |
| **Rate limited** | Queue request with exponential backoff; notify user |
| **Post failed** | Store error message; move to "failed" status; suggest retry |
| **Scheduling unavailable** | Fall back to manual scheduling for free tier |
| **Account disconnected** | Alert team; prevent new posts until reconnected |

### Data Consistency

- Instagram posts scheduled via Cosplans remain in Cosplans even if deleted from Instagram
- Analytics sync: hourly automatic sync; manual sync available
- Draft-to-Instagram linkage: if post deleted on Instagram, mark as orphaned in Cosplans
- Audit trail: all posts, edits, approvals logged with timestamps and user IDs

---

## Testing Scenarios

### Scenario 1: Team Plans Convention Coverage
1. Owner schedules shoot: "Anime Expo 2025 - Saturday"
2. Team drafts posts: "Getting ready" (BTS), "The look" (finished), "Time-lapse" (WIP)
3. Member creates draft, tags as BTS, uses BTS caption template
4. Admin reviews draft, suggests hashtag change
5. Draft scheduled for 3 days post-convention
6. ✅ Post publishes automatically (if paid tier) or team member publishes manually
7. ✅ Analytics visible: 500 likes, 45 saves, 2.5K reach

### Scenario 2: Cross-Team Collaboration
1. Two teams (Team A, Team B) collaborate on a shoot
2. Both teams connected to same Instagram account
3. Team A member creates draft
4. Team B owner approves and publishes (approval required)
5. ✅ Post published to shared Instagram account
6. ✅ Both teams see post in their analytics

### Scenario 3: Scheduling Workflow (Free Tier)
1. Member creates draft, sets scheduled time
2. Admin approves
3. Scheduled time arrives
4. ✅ Team member gets in-app notification: "Ready to post 'The Look' to Instagram"
5. Member clicks "Post Now" button in Cosplans
6. ✅ Post published immediately via Instagram API
7. Member sees "Posted 2 minutes ago" in draft list

---

## Security & Privacy

- Instagram tokens encrypted at rest in Supabase
- Tokens stored in secure field with field-level encryption
- Token refresh: automatic with no user intervention
- Audit logging: all API calls, posts, edits logged
- Rate limiting: respect Instagram API limits; prevent abuse
- Draft visibility: only team members can see drafts (no public access)
- Approved drafts: immutable once posted (prevents accidental edit post-publication)

---

## Phase 1 Implementation Priority

1. ✅ Instagram Business Account OAuth connection
2. ✅ Draft creation & editing UI (feed, Stories)
3. ✅ Caption & hashtag template system
4. ✅ Manual scheduling (free tier)
5. ✅ Basic analytics display (hourly sync)
6. ✅ Content calendar visualization
7. ✅ Team approval workflow
8. 🔄 Auto-scheduling via Graph API (Phase 1.5 if time permits)
9. 🔄 Advanced analytics (Phase 2)

**Not Phase 1**:
- Reels (complex, requires video processing)
- Stories (requires frame-by-frame image handling)
- Auto-editing (AI-powered effects, transitions)
- TikTok cross-posting (separate integration)

---

## Migration Path (Future Multi-Account)

Currently supports one Instagram account per team. Future expansion:
- Multiple Instagram accounts per team (e.g., main account + brand account)
- Account switching UI
- Cross-post to multiple accounts simultaneously
- Separate analytics per account
