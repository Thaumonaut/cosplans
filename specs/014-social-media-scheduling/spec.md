# Feature Specification: Social Media Scheduling

**Feature Branch**: `014-social-media-scheduling`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: User description: "014-social-media-scheduling"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Schedule Posts to Queue (Priority: P1)

Photographers can create posts with photos and captions, schedule them to specific dates/times, and queue them across multiple platforms (Instagram, TikTok, Facebook) for automatic publishing.

**Why this priority**: Core scheduling functionality that automates social media workflow and saves time for photographers who shoot multiple events.

**Independent Test**: Can be fully tested by creating a post, setting a future publish time, and verifying it appears in the scheduled queue with correct platform selections.

**Acceptance Scenarios**:

1. **Given** a team with completed photoshoot images, **When** user creates a post with photo, caption, and scheduled time, **Then** post appears in schedule queue with pending status
2. **Given** a scheduled post with future publish time, **When** scheduled time arrives, **Then** system attempts to publish to selected platforms and updates status to published/failed
3. **Given** multiple posts in queue, **When** user views schedule calendar, **Then** all upcoming posts are displayed with platform icons and publish times

---

### User Story 2 - Caption Templates & Hashtag Management (Priority: P2)

Users can save reusable caption templates with placeholders for event names, character names, and dates, plus create hashtag collections for different shoot types (convention, outdoor, studio) for quick insertion.

**Why this priority**: Reduces repetitive typing and ensures consistent branding/hashtags across posts, building on P1's posting capability.

**Independent Test**: Can be fully tested by creating caption templates with placeholders, saving hashtag collections, and applying them to new posts with auto-replacement.

**Acceptance Scenarios**:

1. **Given** a saved caption template "Check out photos from {event} featuring {character}!", **When** user applies template to post and fills placeholders, **Then** caption populates with replaced values
2. **Given** saved hashtag collections (#cosplay, #anime, #photography), **When** user selects collection, **Then** hashtags are inserted into caption
3. **Given** multiple caption templates, **When** user creates new post, **Then** template dropdown shows all saved templates with preview

---

### User Story 3 - Cross-Platform Preview (Priority: P3)

Before publishing, users can preview how their post will appear on each platform (Instagram square/portrait, TikTok vertical, Facebook horizontal) with correct image cropping and character limits.

**Why this priority**: Prevents formatting issues and ensures posts look professional across different platform requirements.

**Independent Test**: Can be fully tested by creating a post with image and caption, selecting multiple platforms, and viewing side-by-side previews showing correct aspect ratios and caption truncation.

**Acceptance Scenarios**:

1. **Given** a post with horizontal photo, **When** user selects Instagram + TikTok + Facebook, **Then** preview shows Instagram center-crop, TikTok vertical-crop, Facebook full-width
2. **Given** a caption with 500 characters, **When** user views platform previews, **Then** Instagram shows truncation at 2200 chars, Twitter at 280, Facebook full caption
3. **Given** multiple images in post, **When** user views preview, **Then** carousel indicator shows image count and order per platform

---

### User Story 4 - Post Analytics Dashboard (Priority: P4)

After posts are published, users can view engagement metrics (likes, comments, shares, views) aggregated across platforms with trends over time to identify which content performs best.

**Why this priority**: Provides insights for improving content strategy, but requires posts to be published first (builds on P1-P3).

**Independent Test**: Can be fully tested by viewing dashboard showing published posts with engagement metrics from API, sorted by performance, with trend graphs.

**Acceptance Scenarios**:

1. **Given** published posts across multiple platforms, **When** user views analytics dashboard, **Then** metrics display for each post (likes, comments, shares, reach) with platform breakdown
2. **Given** analytics for past 30 days, **When** user views trend graph, **Then** engagement over time is visualized with peaks/valleys and best-performing days highlighted
3. **Given** posts with different hashtag sets, **When** user compares performance, **Then** system shows which hashtag collections correlated with higher engagement

---

### Edge Cases

- What happens when OAuth token expires mid-publish? System MUST detect expired tokens, halt publishing, notify user to re-authenticate, and preserve post in queue for retry after re-auth
- How does system handle platform API rate limits? System MUST track API usage per platform, queue posts when approaching limits, and automatically retry after rate limit window resets
- What if image aspect ratio doesn't fit any platform requirements? System MUST show cropping preview with manual adjustment controls (pan, zoom) and warn if important content will be cropped
- How are posts handled if scheduled time is in the past? System MUST detect past timestamps on save, show warning, and offer to publish immediately or reschedule to next available slot
- What happens when platform APIs are down during scheduled publish? System MUST retry up to 3 times with exponential backoff, mark post as failed if all retries fail, and send notification for manual retry
- How are deleted/unavailable photos handled? System MUST detect missing images before publish, mark post as invalid, and prevent publishing until user replaces image or removes post
- What if user schedules multiple posts to same time slot? System MUST allow overlapping schedules but stagger actual API calls by 2-minute intervals to avoid rate limits
- How are platform-specific character limits enforced? System MUST validate caption length per platform on save, show character counts with warnings, and prevent publishing if captions exceed limits (unless truncation enabled)

## Requirements *(mandatory)*

### Functional Requirements

#### Post Creation & Scheduling (FR-001 to FR-006)

- **FR-001**: System MUST allow users to create social media posts with one or more images, caption text (up to 5000 characters), and platform selection (Instagram, TikTok, Facebook)
- **FR-002**: System MUST allow users to schedule posts to specific date/time (UTC) or save as draft for manual publishing
- **FR-003**: System MUST display scheduled posts in calendar view with daily/weekly/monthly layouts showing post thumbnails and platform icons
- **FR-004**: System MUST allow users to edit scheduled posts before publish time, including images, caption, platforms, and scheduled time
- **FR-005**: System MUST allow users to cancel scheduled posts and move them back to drafts without publishing
- **FR-006**: System MUST support bulk scheduling by uploading multiple images with caption template and generating individual posts with sequential publish times (e.g., every 2 hours)

#### Platform Integration & Publishing (FR-007 to FR-011)

- **FR-007**: System MUST integrate with Instagram Graph API for automated posting to Instagram Feed and Instagram Stories
- **FR-008**: System MUST integrate with TikTok Creator API for automated video/photo posting with caption and hashtags
- **FR-009**: System MUST integrate with Facebook Graph API for automated posting to Facebook Pages with images, caption, and tags
- **FR-010**: System MUST handle OAuth authentication for each platform per team, storing refresh tokens securely and detecting expired tokens with re-auth prompts
- **FR-011**: System MUST publish posts at scheduled time (within 60 seconds of target time) by calling platform APIs in background job, updating post status to published/failed with error details

#### Caption Templates & Hashtags (FR-012 to FR-016)

- **FR-012**: System MUST allow users to create caption templates with placeholders ({event}, {character}, {photographer}, {date}) that auto-replace when applied to posts
- **FR-013**: System MUST allow users to save hashtag collections with names (e.g., "Convention Posts", "Outdoor Shoots") containing up to 30 hashtags each
- **FR-014**: System MUST allow users to insert saved hashtag collections into captions with single click, appending to existing caption text
- **FR-015**: System MUST show character count per platform (Instagram 2200, Facebook 63,206, Twitter 280, TikTok 2200) with warnings when caption exceeds limits
- **FR-016**: System MUST support hashtag autocomplete based on previously used hashtags and popular trending tags per platform

#### Cross-Platform Preview (FR-017 to FR-019)

- **FR-017**: System MUST generate platform-specific previews showing how post will appear on each selected platform (Instagram square/portrait, TikTok vertical 9:16, Facebook horizontal)
- **FR-018**: System MUST allow users to adjust image cropping per platform with pan/zoom controls and save different crops for each platform
- **FR-019**: System MUST show caption preview per platform with character truncation indicators and link preview rendering (if URL present in caption)

#### Analytics & Performance (FR-020 to FR-022)

- **FR-020**: System MUST fetch engagement metrics from platform APIs after post is published (likes, comments, shares, views, reach) and display in analytics dashboard
- **FR-021**: System MUST allow users to view performance trends over time with graphs showing engagement metrics by day/week/month
- **FR-022**: System MUST allow users to compare post performance by hashtag collections, time of day, or day of week to identify patterns

### Key Entities

- **SocialMediaPost**: A scheduled or published social media post with images, caption, platforms, scheduled time, publish status, engagement metrics
- **CaptionTemplate**: A reusable caption template with placeholders for dynamic content (event, character, date, etc.)
- **HashtagCollection**: A saved collection of hashtags with name and tags, organized for different shoot types
- **PlatformConnection**: OAuth connection to social media platform (Instagram, TikTok, Facebook) with access tokens and expiration tracking
- **PostAnalytics**: Engagement metrics for published post (likes, comments, shares, views, reach) fetched from platform APIs

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create and schedule a post with image and caption in under 2 minutes
- **SC-002**: System publishes scheduled posts within 60 seconds of target time with 99% success rate
- **SC-003**: OAuth token refresh process completes without user intervention 95% of the time
- **SC-004**: Platform previews generate in under 2 seconds showing correct aspect ratios for all platforms
- **SC-005**: Caption templates reduce post creation time by 50% compared to manual caption writing
- **SC-006**: Hashtag autocomplete surfaces relevant hashtags within 3 keystrokes
- **SC-007**: Analytics dashboard loads engagement metrics for 30 posts in under 3 seconds
- **SC-008**: Bulk scheduling uploads 20 images and creates individual posts in under 60 seconds
- **SC-009**: Failed publish attempts retry successfully 80% of the time without user intervention
- **SC-010**: 90% of users successfully connect at least one platform account on first attempt
