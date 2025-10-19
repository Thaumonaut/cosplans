# Phase 1 MVP Implementation: Week 10 Checklist

**Timeline**: Week 10 (5 working days)  
**Focus**: Instagram Integration - Content Calendar, Drafting, Scheduling  
**Deliverable**: GitHub PR with Instagram content management workflow  
**Dependency**: Week 1-9 must be merged first

---

## 🎯 Acceptance Criteria

### Instagram API Setup

- [ ] **Instagram Graph API Configuration**
  - Facebook App created (Developer Dashboard)
  - Instagram Graph API enabled
  - App approved for business access
  - `.env.local`: `INSTAGRAM_APP_ID=<id>`, `INSTAGRAM_APP_SECRET=<secret>`

- [ ] **Instagram Account Connection**
  - User clicks "Connect Instagram Account"
  - OAuth flow: redirects to Instagram login
  - User grants Cosplans permission to manage content
  - Access token stored securely in database: `instagram_accounts` table
  - Columns: `user_id, team_id, instagram_username, access_token, refresh_token, expires_at`

### Content Calendar

- [ ] **Calendar View** (`/team/instagram/calendar`)
  - Month view with grid layout (7 days × weeks)
  - Each cell shows scheduled posts for that day
  - Click on date → create new post
  - Color-coded by content type (photo, carousel, story, reel)
  - Drag-to-reschedule posts (future enhancement)

- [ ] **Calendar Navigation**
  - Previous/Next month buttons
  - "Today" button (jumps to current date)
  - Month/Year display: "October 2025"
  - Small calendar sidebar for quick navigation

- [ ] **Post Preview on Hover**
  - Hover over post in calendar → tooltip shows:
    - Image thumbnail
    - Caption preview (first 100 chars)
    - Schedule time
    - Status (draft/scheduled/published)

### Draft Creation

- [ ] **New Post Form** (`/team/instagram/drafts/create`)
  - Image/Carousel upload
  - Caption field (rich text, 2200 char limit)
  - Hashtags helper: "Suggested hashtags" list (editable)
  - Alt text for accessibility
  - Save as: Draft or Schedule

- [ ] **Carousel Posts**
  - Upload multiple images (2-10 maximum)
  - Reorder slides: drag-and-drop
  - Individual captions per slide (optional)
  - Preview carousel as user will see

- [ ] **Post Templates**
  - Quick templates for common post types:
    - "Before & After (Costume Progress)"
    - "Behind the Scenes (Shoot)"
    - "Announcement (New Series)"
  - Templates pre-populate caption structure
  - User fills in details

- [ ] **Caption Suggestions**
  - AI/rule-based suggestions for captions
  - Based on post type (progress, BTS, announcement)
  - Editable, not forced
  - Emojis suggestions

- [ ] **Hashtag Research**
  - Popular hashtags for cosplay: #cosplay, #cosplaywig, etc.
  - Searchable list: user types, shows matching hashtags
  - Trending hashtags (weekly updated)
  - Excluded hashtags (banned/risky)

### Draft Management

- [ ] **Drafts List** (`/team/instagram/drafts`)
  - Table view: Thumbnail, Caption preview, Created date, Status
  - Sort by: Date, Status, Created by
  - Filter by: Status (draft/scheduled/published)
  - Edit button: modify draft
  - Delete button: remove draft
  - Publish button: schedule immediately
  - Duplicate button: create copy

- [ ] **Draft Detail & Edit**
  - Full edit form for draft
  - Change images, caption, hashtags
  - Save changes
  - Schedule for later (if not yet published)

### Scheduling

- [ ] **Schedule Post** (`/team/instagram/schedule`)
  - Date picker: select publish date
  - Time picker: select publish time
  - Timezone selector: defaults to team timezone
  - Best time to post suggestion (based on analytics, if available)
  - Preview: how post will look on Instagram
  - "Schedule" button

- [ ] **Scheduled Posts List**
  - Shows all scheduled (not yet published) posts
  - Columns: Image, Caption preview, Scheduled time, Status
  - "Cancel schedule" button (before publish time)
  - "Publish now" button (publish early)
  - Edit scheduled post: change time/content

- [ ] **Automatic Publishing**
  - Cron job: every minute, check `scheduled_instagram_posts`
  - If `scheduled_at <= now` → publish to Instagram via API
  - Update status to `published`
  - Store response: `instagram_post_id`, `published_at`

- [ ] **Publishing Error Handling**
  - If Instagram API fails → retry up to 3 times (exponential backoff)
  - If all retries fail → mark as `failed`, show error message
  - Notify user: "Post failed to publish. [Retry] [Edit]"

### Analytics & Insights

- [ ] **Post Performance** (`/team/instagram/analytics`)
  - Table of published posts: Caption preview, Likes, Comments, Shares, Reach
  - Sort by: Likes, Comments, Engagement rate
  - Date range filter: Last week, Last month, Custom
  - Engagement rate = (Likes + Comments + Shares) / Reach \* 100

- [ ] **Account Analytics**
  - Followers (total, growth this month)
  - Reach (total posts this month)
  - Top performing post (by engagement)
  - Best time to post (from analytics)

### Error Handling

- [ ] **Instagram API Failures**
  - Rate limit exceeded → wait and retry
  - Invalid token → prompt to re-authenticate
  - Image size too large → show error, suggest compression
  - Caption too long → show char count, prevent submit

- [ ] **Network Issues**
  - Offline mode: allow draft creation (saved locally)
  - Queued for sync when online
  - Show sync status: "Synced", "Pending sync"

### Testing (70% coverage minimum)

- [ ] **Unit Tests**
  - Caption validation (char limit)
  - Hashtag parsing
  - Timezone conversion
  - Best time to post calculation
  - **Target**: 10+ unit tests

- [ ] **Integration Tests**
  - Instagram account connection (mock API)
  - Draft creation + storage
  - Schedule post (mock API)
  - Publish post (mock API)
  - Analytics retrieval (mock API)
  - **Target**: 12+ integration tests

- [ ] **E2E Tests** (Playwright)
  - Create draft + schedule post
  - View calendar + scheduled posts
  - Publish post manually
  - **Target**: 4+ E2E tests

- [ ] **Coverage**: 70%+ minimum

### Documentation

- [ ] **Instagram Setup** (`.specify/instagram-setup.md`)
  - How to create Facebook App
  - Instagram Graph API configuration
  - Scope requirements

- [ ] **Content Calendar Guide** (`.specify/instagram-calendar.md`)
  - How to use calendar view
  - How to schedule posts
  - Best practices

- [ ] **API Documentation Update**
  - Instagram account connection endpoints
  - Draft CRUD endpoints
  - Schedule/publish endpoints
  - Analytics endpoints

---

## 🔗 Constitution References

**Principle IV (Social Media Publishing)**

- [ ] Instagram content calendar + scheduling
- [ ] Automatic publishing to Instagram
- [ ] Analytics integration

**Principle V (Visual-First)**

- [ ] Image-centric draft creation
- [ ] Carousel support for multiple images
- [ ] Visual preview before scheduling

**Technology Stack (Constitution v2.2.0)**

- [ ] Instagram Graph API
- [ ] OAuth 2.0 for Instagram connection
- [ ] Scheduled job for automatic publishing
- [ ] Vitest + Playwright for testing

---

## 📦 Deliverables

### Pages

- [ ] `src/routes/(app)/instagram/calendar/+page.svelte` (calendar view)
- [ ] `src/routes/(app)/instagram/drafts/+page.svelte` (drafts list)
- [ ] `src/routes/(app)/instagram/drafts/create/+page.svelte` (create form)
- [ ] `src/routes/(app)/instagram/drafts/[id]/+page.svelte` (edit form)
- [ ] `src/routes/(app)/instagram/schedule/+page.svelte` (schedule post)
- [ ] `src/routes/(app)/instagram/scheduled/+page.svelte` (scheduled posts)
- [ ] `src/routes/(app)/instagram/analytics/+page.svelte` (analytics)

### Components

- [ ] `src/components/CalendarGrid.svelte` (month view)
- [ ] `src/components/PostPreview.svelte` (tooltip preview)
- [ ] `src/components/CarouselEditor.svelte` (multi-image upload)
- [ ] `src/components/CaptionEditor.svelte` (rich text + char count)
- [ ] `src/components/HashtagHelper.svelte` (hashtag search/suggestions)
- [ ] `src/components/InstagramPreview.svelte` (how post looks on IG)

### API Routes

- [ ] `src/routes/api/instagram/accounts/connect/+server.ts` (OAuth callback)
- [ ] `src/routes/api/instagram/drafts/+server.ts` (CRUD)
- [ ] `src/routes/api/instagram/schedule/+server.ts` (schedule post)
- [ ] `src/routes/api/instagram/publish/+server.ts` (publish to IG)
- [ ] `src/routes/api/instagram/analytics/+server.ts` (get analytics)

### Database Migrations

- [ ] `instagram_accounts` table
- [ ] `instagram_drafts` table
- [ ] `scheduled_instagram_posts` table
- [ ] `instagram_post_analytics` table

### Tests

- [ ] Unit tests: 10+
- [ ] Integration tests: 12+
- [ ] E2E tests: 4+
- [ ] Coverage: 70%+

### Documentation

- [ ] Instagram setup guide
- [ ] Content calendar guide
- [ ] Updated API spec

---

## ✅ Sign-Off Criteria

**Week 10 COMPLETE when**:

1. ✅ Instagram account connection working
2. ✅ Calendar view showing scheduled posts
3. ✅ Draft creation + editing working
4. ✅ Schedule post working (save to DB)
5. ✅ Automatic publishing working (cron job)
6. ✅ Analytics retrieval working
7. ✅ 70%+ test coverage
8. ✅ PR approved and merged

---

**Timeline**: Week 10 of 12  
**Dependency**: Week 1-9 merged  
**Next**: Week 11 (Testing & Optimization)
