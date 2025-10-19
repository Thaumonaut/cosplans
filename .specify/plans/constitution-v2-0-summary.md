# Constitution v2.0.0 - Social Media & Planning Features

**Date**: October 16, 2025  
**Version**: 2.0.0  
**Status**: Social media integration planning features added; payment/SMS deferred

---

## Summary of Changes

### Added Features

**1. New Principle V.5: Social Media Workflow Integration** ✨

- Instagram content planning, scheduling, and analytics
- Content calendar synchronized with shoot schedule
- Draft creation with templates and collaboration
- Engagement tracking and reporting
- Team approval workflow for posted content

**2. Updated Principle III: External Integration Integrity**

- Added Instagram (read/write) to core integrations
- Added TikTok (Phase 2+) to roadmap
- Updated rationale to emphasize social media's importance to cosplay community

**3. Updated Feature Priority Order**

- Moved social media planning up in Phase 1 priority
- Positioned after Google integrations, before advanced views
- TikTok integration deferred to Phase 2+

### Deferred Features (Noted for Future)

**Stripe Payment Processing**: Deferred until paid tier features are solidly defined

- Not blocking Phase 1 launch
- Can use free-tier only during beta
- Revisit when ready to monetize

**SMS Reminders**: Deferred as paid-tier option (Phase 2+)

- Cost concerns addressed by making it optional
- Can implement email-only reminders in Phase 1
- SMS as paid tier upsell later

---

## Instagram Integration (Phase 1)

### Core Capabilities

| Feature                | Phase 1 | Details                                         |
| ---------------------- | ------- | ----------------------------------------------- |
| **Account Connection** | ✅      | OAuth-based Business Account linking            |
| **Content Calendar**   | ✅      | Shoots + posts on timeline                      |
| **Draft Creation**     | ✅      | Feed posts, Stories (Reels in Phase 2)          |
| **Templates**          | ✅      | Caption & hashtag templates by content pillar   |
| **Manual Scheduling**  | ✅      | Schedule posts with dates/times (free tier)     |
| **Analytics Sync**     | ✅      | Hourly engagement metrics (likes, reach, saves) |
| **Team Collaboration** | ✅      | Draft comments, approvals, @mentions            |
| **Auto-Scheduling**    | 🔄      | Phase 1.5 if time permits                       |

### Content Pillars

Teams can categorize posts by type:

- **BTS** (Behind-the-scenes): Getting ready, makeup, wig styling, studio setup
- **Finished**: The final look, full photoshoot reveal, cosplay completed
- **WIP** (Work-in-Progress): Armor painting, sewing, weathering, building
- **Convention**: Convention floor coverage, meetups, crowds, special moments
- **Custom**: Team-defined categories

### Permissions

| Role   | Can Draft | Can Approve | Can Publish | Can View Analytics |
| ------ | --------- | ----------- | ----------- | ------------------ |
| Owner  | ✅ Yes    | ✅ Yes      | ✅ Yes      | ✅ Yes             |
| Admin  | ✅ Yes    | ✅ Yes      | ✅ Yes      | ✅ Yes             |
| Member | ✅ Yes    | ❌ No       | ✅ Own only | ✅ Yes             |
| Viewer | ❌ No     | ❌ No       | ❌ No       | ❌ No              |

### Data Models

**Instagram Accounts**: Connected Business Accounts (encrypted tokens, refresh logic)  
**Instagram Drafts**: Posts (pending, scheduled, published) with content and metadata  
**Instagram Templates**: Reusable captions and hashtag sets  
**Instagram Post Analytics**: Engagement tracking (hourly synced)  
**Instagram Account Metrics**: Follower growth tracking (daily)

---

## Phase 1 Implementation Scope

### UI Components Needed

1. **Instagram Settings Page**
   - Connect/disconnect Instagram Business Account
   - View connected account details
   - Revoke Instagram permissions

2. **Content Calendar**
   - Week/month/timeline views
   - Overlay shoots and scheduled posts
   - Click to create draft linked to shoot
   - Drag-to-reschedule

3. **Draft Editor**
   - Caption text editor with template selector
   - Image picker from Cosplans library
   - Hashtag manager (saved sets + custom)
   - Content pillar selector
   - Post type selector (feed, Stories, Carousel)
   - Preview mockup of Instagram appearance
   - Schedule date/time picker
   - Submit for approval or publish

4. **Drafts List**
   - Filter by status (draft, scheduled, posted, failed)
   - Filter by content pillar
   - Sort by date, engagement, team member
   - Bulk actions (approve, schedule, delete)
   - Quick stats (likes, saves, reach)

5. **Analytics Dashboard**
   - Top posts this month (by engagement)
   - Trending hashtags
   - Follower growth graph
   - Engagement rate by content pillar
   - Best times to post
   - Monthly summary report

6. **Team Collaboration**
   - Draft comments thread
   - @mention notifications
   - Approval request/approval workflow
   - Edit history / version tracking

### API Endpoints (~15-20 new)

Account mgmt (3), Drafts (5), Templates (3), Analytics (3), Calendar (1)

### Database Tables (~5 new)

instagram_accounts, instagram_drafts, instagram_templates, instagram_post_analytics, instagram_account_metrics

### Testing Requirements

- Unit tests: template rendering, hashtag validation, schedule time logic
- Integration tests: Instagram OAuth flow, API error handling, token refresh
- E2E tests: Create draft → schedule → publish → analytics flow
- Mock Instagram API responses (avoid rate limiting in tests)
- Error scenarios: Failed posts, disconnected accounts, rate limits

---

## Data Flow: Create & Schedule Post

```
Team Member Creates Draft
    ↓
Selects content pillar (BTS, finished, WIP, convention)
    ↓
Writes caption (or selects template with placeholders)
    ↓
Attaches images from shoot library
    ↓
Adds hashtags (or selects saved set)
    ↓
Sets posting schedule (date/time)
    ↓
Submits for approval (if approval required)
    ↓
[APPROVAL GATE]
Admin reviews: edit caption, change hashtags, change time
    ↓
Admin approves
    ↓
[SCHEDULING]
Scheduled time arrives
    ↓
Team member gets notification: "Ready to post?"
    ↓
Team member clicks "Publish Now" in Cosplans
    ↓
POST to Instagram via Graph API
    ↓
✅ Post live on Instagram
    ↓
Hourly: Analytics sync (likes, comments, reach, saves)
    ↓
✅ Metrics visible in Cosplans dashboard
```

---

## Security Considerations

✅ Instagram tokens encrypted at field level  
✅ Tokens rotated via refresh logic (automatic)  
✅ OAuth scope: minimal (only what needed)  
✅ Audit logging: all posts, edits, approvals  
✅ Rate limiting: respect Instagram API limits  
✅ Privacy: drafts only visible to team members  
✅ Immutability: posted content cannot be edited (prevents data sync issues)

---

## Future Expansion (Phase 2+)

| Feature                            | Rationale                                       |
| ---------------------------------- | ----------------------------------------------- |
| **TikTok Integration**             | Younger cosplay audience; vertical video format |
| **Reels Support**                  | Instagram's prioritized format; video workflow  |
| **Stories Publishing**             | Ephemeral content for behind-the-scenes         |
| **Auto-Scheduling**                | Post at optimal times without manual trigger    |
| **Video Editing**                  | In-app trim, effects, transitions (Phase 3)     |
| **Influencer Collab Tools**        | Track tag team members, link collaborators      |
| **Content Performance Benchmarks** | Compare team's metrics to cosplay community avg |

---

## Deferred Decisions (Revisit Later)

### Stripe Payment Processing

**Status**: Deferred until paid tier feature set solidified  
**Next Steps**: Define what features justify paid tier, then implement Stripe  
**Timeline**: Phase 1.5 or Phase 2

### SMS Reminders

**Status**: Deferred as paid-tier option  
**Reason**: Cost per SMS ($.005-0.02); email-only sufficient for Phase 1  
**Alternative**: Email reminders + optional Twilio SMS as upsell  
**Timeline**: Phase 2+ (if demand justifies)

---

## Testing Scenarios

### Scenario 1: Anime Expo Convention Coverage

```
Owner schedules: "Anime Expo Photoshoot - Saturday"
Members create drafts:
  - BTS: "Makeup time!" (template: BTS captions + convention hashtags)
  - Finished: "The look complete!" (custom)
  - Convention: "Floor coverage" (template: convention captions)

Admin reviews all drafts:
  - Edits hashtags for consistency
  - Approves all three

Saturday during event:
  - BTS post scheduled to post at 3pm ✅
  - Finished post scheduled for 6pm ✅
  - Convention photos posted manually as available

Next week:
  - See analytics: Finished got 2.5K reach, 180 saves (high-performing)
  - Finished hashtags: #cosplay #animexpo trending among followers
  - Team decides to focus future posts on convention format
```

### Scenario 2: Cross-Team Collaboration

```
Team A shoots with Team B
Both teams linked to shared Instagram account

Team A member creates draft: "Collaboration magic!"
Draft submitted for approval

Team B admin approves the draft
Draft published to shared Instagram account

Both Team A and Team B see post in their analytics
Both teams' members credited as collaborators
```

### Scenario 3: Mobile Viewing (Phase 1 responsive)

```
Member opens Cosplans on mobile (during convention)
Navigates to Content Calendar
Sees upcoming posts scheduled for today
Clicks "View Draft" on "The Look" post
Draft editor opens with preview mockup
Sees: image, caption, hashtags
Swipes back to calendar
✅ Mobile-responsive calendar and draft editor working
```

---

## Constitution Alignment

✅ **Principle V.5 (NEW)**: Social Media Workflow Integration  
✅ **Principle III**: External Integration Integrity (updated for Instagram)  
✅ **Principle I**: Mobile-responsive (content calendar, draft editor)  
✅ **Principle II**: Real-time collaboration (draft comments, approvals)  
✅ **Principle V**: Visual-first content (images from shoots integrated)  
✅ **Security & Privacy**: OAuth handling, token encryption, PII protection  
✅ **Technical Architecture**: API resilience for Instagram failures, retry logic

---

## Files Updated

1. **Constitution v2.0.0** (`.specify/memory/constitution.md`)
   - Added Principle V.5: Social Media Workflow Integration
   - Updated Principle III: External Integration Integrity
   - Updated Feature Priority Order
   - Updated External API Resilience section

2. **Social Media Integration Spec** (`.specify/plans/social-media-integration-v2.md`) - NEW
   - Complete Phase 1 Instagram integration specification
   - Data models, API endpoints, permissions
   - Phase 2+ roadmap (TikTok, Reels)
   - Testing scenarios, security considerations

---

## Next Steps

1. **Review & Feedback**
   - Confirm Instagram scope meets team needs
   - Validate permissions model
   - Agree on Phase 1.5 features (auto-scheduling, Reels)

2. **Data Model Implementation**
   - Create Supabase migrations for 5 new tables
   - Set up Instagram token encryption

3. **Instagram OAuth Setup**
   - Register Cosplans as Instagram app
   - Set up OAuth callback handler
   - Configure required permissions

4. **UI Development**
   - Draft editor component
   - Content calendar visualization
   - Analytics dashboard

5. **Instagram API Integration**
   - Account connection & token refresh
   - Post scheduling via Graph API
   - Analytics syncing (hourly jobs)

---

**Constitution finalized v2.0.0 - Ready for Phase 1 implementation! 🚀**
