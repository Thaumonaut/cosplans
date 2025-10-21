# Cosplay Planning App - Feature Specification Summary

## Core Architecture
- **Stack**: SvelteKit, Supabase (backend), Bun, Vite
- **Target Market**: USA/English-speaking initially, future expansion to Japan/Korea
- **User Base**: Beginner to experienced cosplayers, photographers, commissioners

## Team System

### Team Structure
Every user has a **personal team** (their workspace) created automatically on signup:
- Cannot be deleted (only archived)
- User is sole owner
- Acts as portfolio
- Can be renamed by user

Users can create/join **collaborative teams**:
- Free tier: Personal team + join 1 collaborative team
- Premium: Personal team + create 3, join 5 collaborative teams
- Team Premium: Purchase premium for specific team (up to 15 members benefit)

### Team Types
1. **Personal Team**: Individual workspace, portfolio, solo projects
2. **Collaborative Teams**: Small groups (2-10 people) for group cosplays, creator collectives, convention squads
3. **Temp/Event Teams**: Short-lived teams for specific photoshoots
   - Set expiration date (auto-archive after event)
   - Public discovery board
   - Free to create for all tiers
   - Auto-archive 7 days after event
   - Optional conversion to permanent team

### Temp Team Features
- **Discovery**: Search by fandom, location, date, skill level
- **Requirements**: Character needs, max participants, skill requirements
- **Visibility**: Public listing, unlisted (link only), or private
- **Safety**: Account age display, past event ratings, report system
- **Post-Event**: Photo gallery, "work with again" easy re-invite

## Reputation System

### Simplified Tier-Based System (No numerical scores)

**Tiers** (from best to worst):
1. **🌟 Exemplary**: 20+ events, 95%+ on-time, 0 no-shows/year, 4.5+ avg rating
2. **✅ Reliable**: 10+ events, 85%+ on-time, 0 no-shows/year, 4.0+ avg rating
3. **👍 Consistent**: 5+ events, 75%+ on-time, max 1 no-show/year, 3.5+ avg rating
4. **🆕 Building Reputation**: New users or <5 events (default starting tier)
5. **⚠️ Flaky**: <70% on-time, 2+ no-shows/year, 3+ late cancellations
6. **🚫 Unreliable**: <50% on-time, 3+ no-shows/year (restricted from events)

### Reputation Calculation
- Based on last 12 months of data only
- Metrics: events attended, on-time rate, no-shows, cancellation timing, avg rating
- Recalculated after each event
- Users can improve by completing events successfully

### Event Restrictions by Tier
- **Exemplary/Reliable/Consistent**: Can join all events, auto-approved
- **Building**: Can join most events (organizer can restrict), auto-approved
- **Flaky**: Limited access, requires manual organizer approval
- **Unreliable**: Temporary ban from public events (30-90 days), very limited access

### Reputation Building
- Any user can host events (helps build reputation)
- Clear progression path shown in profile
- Tips for improvement
- Warnings before tier drops
- Positive actions rewarded (streaks, badges)

### Notifications
- Warning when about to drop tier: "One more no-show will move you to Flaky status"
- Tips for improvement shown in profile
- Clear path to next tier with specific requirements

## Event Attendance System

### Custom Leave-By Date & Severity
**Organizers set**:
- Custom leave-by date (default: 72 hours before event)
- Cancellation severity level:
  - **Lenient**: Minor penalties (community meetups)
  - **Standard**: Normal penalties (typical shoots)
  - **Strict**: Significant penalties (organized productions)
  - **Critical**: Severe penalties (group cosplays where all members essential)

### Cancellation Penalties (Standard severity example)
- 72+ hours notice: 0 penalty
- 24-72 hours notice: -2 impact
- <24 hours notice: -5 impact
- No-show: -10 impact

Severity multiplies these impacts. Critical events may trigger temporary suspensions for no-shows.

### Attendance Tracking
```sql
event_attendance {
  user_id,
  event_id,
  status: 'confirmed' | 'attended' | 'no_show' | 'cancelled_advance' | 'cancelled_late',
  confirmed_at,
  cancelled_at,
  notice_period_hours,
  attended_verified_by, // organizer confirms
  rating_received
}
```

### Post-Event Ratings
- Mutual ratings between participants
- Categories: Professionalism, Communication, Punctuality, Teamwork (1-5 stars each)
- Optional public comments
- Displayed on user profiles
- Contributes to reputation tier calculation

## Public Profiles & Portfolios

### Profile Components
- Username, display name, avatar, bio, location (city/region)
- Reputation tier badge and stats
- Track record (events attended, on-time rate, no-shows)
- Featured cosplays (max 6)
- Completed projects gallery
- Social media links
- Skills & specialties
- Recent/upcoming public events
- Reviews from other users
- Badges/achievements

### Privacy
- Profiles are public
- Users control which projects are publicly visible
- Can hide specific events from public view
- Location limited to city/region (not precise)

## Team Deletion & Archive System

### Timeline
1. **Day 0**: Deletion initiated
   - Team becomes read-only immediately
   - Export package auto-generated
   - All members notified
   - Members retain read-only access (FREE)

2. **Days 1-30**: Quick restore period
   - Owner can restore instantly with no penalties
   - Full access restoration
   - No storage tier changes needed

3. **Days 31-365**: Long-term archive
   - Owner can still restore anytime
   - All members have read-only access (FREE)
   - Stored in cold storage (cost-optimized)
   - Export available for download
   - **Large teams (>20GB)**: Export requires fee after day 30

4. **Day 365**: Final warning
   - Email to owner and all members
   - 30-day countdown to permanent deletion
   - Last chance to restore or download

5. **Day 395**: Permanent deletion
   - Complete removal, cannot be recovered
   - Anonymized stats kept for analytics only

### Restoration
- **Owner only** can restore
- Instant restoration within first 30 days
- Full year (365 days) to restore with warning prompts
- On restore: team moved back to hot storage, all members notified, full editing enabled

### Export Package
- Auto-generated on deletion
- Available throughout archive period
- Contains: projects (JSON + HTML), photos (original quality), messages (PDF), member info (CSV), timeline
- **Free download for 30 days**
- **After 30 days**: Free for teams <20GB, fee required for larger teams
- Stored for 60 days after generation

### Member Access
- All former members have read-only access to archived teams (FREE)
- Can view all projects, photos, messages
- Cannot add new content or edit
- Can download personal export package

## Subscription Model

### Free Forever
- 1 personal team
- 3 active projects
- Join 1 permanent team
- Join unlimited temp teams
- 5GB storage
- 20 AI requests/month
- Basic features

### Premium Monthly ($12/mo or $120/year)
- Personal team with unlimited projects
- Create 3 permanent teams
- Join 5 permanent teams
- Create unlimited temp teams
- 50GB storage
- 500 AI requests/month
- All integrations (Google Docs, Pinterest, Notion, Discord, Instagram, TikTok)
- Advanced features
- Video storage (25GB)

### Team Premium ($35/mo or $350/year)
- Purchase for specific team
- All members (up to 15) get premium features in that team
- Shared 200GB storage pool
- 2000 AI requests/month (shared)
- Team analytics
- Priority support

### Lifetime Subscription ($399, early adopter $299)
- One-time payment
- Equivalent to Premium Monthly features forever
- AI requests: 500/month (not unlimited)
- Storage: 100GB (capped)
- Future features: Basic access included, AI-heavy features may require add-ons
- **Upgrade pricing for existing subscribers**:
  - Credit based on months subscribed and tier
  - 50-90% credit of amount paid
  - Minimum upgrade price: $99
  - Longer subscription = higher credit percentage

## AI Features (Off-the-shelf APIs)

### AI Services
- **OpenAI GPT-4**: Task generation, pose suggestions, caption writing, contract templates
- **Stable Diffusion API**: Background concepts, mood board generation
- **Claude API**: Long-form planning, project breakdowns
- **Google Vision API**: Auto-tagging photos, costume element detection

### AI Request Management
- **Cost-based credits**: Simple tasks (1 credit) vs image generation (10 credits)
- **Free features** (no limits): Basic templates, curated checklists, database search
- **Premium features** (counted): Custom generation, image analysis, AI tagging
- Rollover unused credits (up to 2x monthly limit)
- Add-on packs: $5 for 100 extra requests

### AI Feature Examples
- Pose suggestions from character reference images
- Photoshoot location recommendations
- Background/scene generation for composite editing
- Task list generation from project description
- Trending hashtag suggestions
- Caption writing
- Material cost estimation

## Integration Strategy

### Phase 1 - Core (MVP)
1. **Stripe Connect**: Payments, escrow, milestone releases, marketplace fees
2. **OpenAI API**: AI assistance features
3. **Cloudflare R2 or AWS S3**: Photo storage with CDN
4. **Stream Chat or SendBird**: In-app messaging

### Phase 2 - Planning Tools
5. **Google Docs API**: Auto-generate contracts, export project plans
6. **Pinterest API**: Mood board integration, import pins to projects
7. **Notion API**: Two-way sync for power users

### Phase 3 - Social Features
8. **Instagram Graph API**: Post scheduling, trending audio, analytics
9. **TikTok API**: Trending sounds, hashtag trends, scheduling
10. **Buffer or Later API**: Unified social media scheduling

### Phase 4 - Enhanced
11. **Stable Diffusion**: Visual generation
12. **Google Vision**: Auto-tagging
13. **Discord Webhooks/Bot**: Team notifications, commands

### Discord Integration
- Webhook notifications for task assignments, milestones, photoshoots
- Bot commands: view tasks, check schedule, update progress
- Two-way sync: create tasks from Discord, update via reactions
- Server integration: auto-create channels for projects, role sync

## Commission Marketplace

### Contract Builder
- Templates: Full costume, specific pieces, photography, editing, makeup
- Customizable terms: Timeline, milestones, payment schedule, revisions, shipping, usage rights, cancellation, rush fees
- Auto-generated via Google Docs API
- Digital signatures
- Stored with project

### Payment Flow (Stripe Connect)
1. Deposit hold
2. Milestone-based releases
3. Progress photo requirements
4. Final payment on delivery confirmation
5. Automatic invoice generation
6. Dispute resolution framework

### Progress Tracking
- Milestone photo uploads
- Status updates
- In-app messaging with timestamps
- Change order tracking
- Client approval workflow

### Two-Way Reviews
- After commission completion
- Rate: Quality, Communication, Timeliness, Value
- Public display on profiles
- Protects both commissioners and clients

## Photo & Video Storage

### Tiered Storage
- **Free**: 5GB, basic resolution
- **Premium**: 50GB, full resolution
- **Pro**: 100GB (lifetime), RAW support

### External Integration
- Google Drive sync
- Dropbox connection
- Direct cloud storage linking (S3, Cloudflare)
- Automatic backup options

### Organization
- Auto-tagging by project
- Metadata preservation
- Batch operations
- Smart albums

### Video Storage
- Separate tier pricing
- Compression options
- Direct export formats (TikTok, Reels, Shorts optimized)
- Thumbnail auto-generation (via Mux)

### Cold Storage for Archives
- Archived teams moved to cold storage (10x cheaper)
- Light compression acceptable
- Thumbnails kept in hot storage for browsing
- Restore to hot storage when team reactivated

## Social Media Planning

### Content Calendar
- Multi-platform scheduling
- Best time to post (AI-suggested based on history)
- Queue management
- Preview grid layout

### Platform-Specific Features
- **Instagram**: Post scheduling, trending audio, hashtag performance, grid preview
- **TikTok**: Trending sounds discovery, hashtag trends, video upload
- **Twitter/X**: Thread planning

### Content Tools
- Trending audio library with search
- Hashtag suggestions by costume type
- Caption AI generation
- Reel length optimizer
- A/B testing suggestions
- Cross-platform content adaptation

## Convention & Event System

### Convention Discovery
- Searchable database (location, date, size, type)
- Cosplay-friendliness ratings
- Deadline trackers (registration, hotel, contests)
- Past attendee reviews
- Photo location mapping

### Convention Day Planner
- Multi-day schedule builder
- "Which costume which day" optimizer
- Panel/event bookmarks with maps
- Group coordination
- Repair station locations
- Photo spot recommendations

### Local Event Sharing
- Community-posted shoots, meetups, craft nights
- Public/private toggles
- RSVP management
- Carpooling coordination

## Database Schema Highlights

### Core Tables
```sql
-- Users & Profiles
users (auth.users extended)
user_profiles (public info, reputation, stats)
user_reputation_history (track changes over time)

-- Teams
teams (
  id, 
  name, 
  type, 
  owner_id, 
  status, 
  premium_tier, 
  storage_tier, 
  deleted_at, 
  can_restore_until,
  export_package_url,
  export_generated_at,
  export_expires_at
)
team_memberships (team_id, user_id, role, is_personal_team)
team_settings (discord webhooks, integrations)

-- Temp Teams
temp_teams (
  id, 
  name, 
  event_date, 
  location, 
  max_participants, 
  min_reputation_tier, 
  leave_by_date, 
  cancellation_severity, 
  status, 
  auto_archive_at
)
temp_team_participants (temp_team_id, user_id, character_name, role, status)
temp_team_requests (pending join requests)

-- Events & Attendance
event_attendance (
  user_id, 
  event_id, 
  status, 
  notice_period_hours, 
  attended_verified_by
)
event_ratings (
  event_id, 
  rated_user_id, 
  rated_by_user_id, 
  rating, 
  categories, 
  comment
)

-- Projects
projects (id, team_id, owner_id, name, type, status, budget)
project_tasks (id, project_id, assigned_to, status, due_date, dependencies)
project_photos (id, project_id, storage_url, metadata)

-- Commissions
commissions (id, team_id, client_id, status, contract_url, payment_schedule)
commission_milestones (commission_id, milestone_number, amount, status, proof_photo)

-- Storage & Archives
team_deletion_log (track deletions)
archived_team_access (who can view archived teams)
export_packages (team_id, url, generated_at, expires_at)

-- Reputation
reputation_events (user_id, event_type, impact, timestamp)
reputation_tiers (tier definitions)

-- Social & Content
social_posts (user_id, platform, scheduled_for, status, content)
trending_audio (platform, audio_id, trending_score, updated_at)
```

### Row Level Security (RLS)
- Team access limited to members
- Personal teams only accessible by owner
- Archived teams read-only for all former members
- Owner-only restoration rights
- Commission details visible to involved parties only

## Key Features to Implement

### Phase 1 - Core Platform
1. User authentication & profiles
2. Personal team auto-creation
3. Project management (create, edit, track)
4. Basic photo upload & gallery
5. Team creation & invitation system
6. Basic messaging

### Phase 2 - Reputation & Events
7. Temp team creation & discovery
8. Event attendance tracking
9. Reputation system calculation
10. Post-event rating system
11. User profiles with reputation display
12. Event restrictions based on reputation

### Phase 3 - Collaboration
13. Team roles & permissions
14. Commission marketplace
15. Contract builder (Google Docs integration)
16. Stripe payment integration
17. Milestone tracking
18. Two-way reviews

### Phase 4 - AI & Automation
19. OpenAI integration for task generation
20. AI pose suggestions
21. Location recommendations
22. Auto-tagging photos
23. AI credit management system

### Phase 5 - Social & Content
24. Social media calendar
25. Instagram/TikTok integration
26. Post scheduling & queuing
27. Trending audio/hashtag discovery
28. Content analytics

### Phase 6 - Advanced Features
29. Convention database & discovery
30. Convention day planner
31. Discord integration
32. Pinterest mood boards
33. Notion sync
34. Video storage & processing
35. Advanced AI features (image generation)

### Phase 7 - Polish & Scale
36. Team archive system with restoration
37. Export package generation
38. Cold storage migration
39. Lifetime subscription system
40. Subscription upgrade pricing
41. Mobile app development

## Technical Implementation Notes

### SvelteKit Stores
```javascript
// stores/team.js
export const currentTeam = writable(null);
export const personalTeam = writable(null);
export const userTeams = writable([]);
export const isPersonalTeam = derived(...);
export const teamPremiumFeatures = derived(...);

// stores/reputation.js
export const userReputation = writable(null);
export const reputationTier = derived(...);
export const canJoinEvent = derived(...);
```

### Supabase Real-Time
- Live task updates across team members
- Real-time attendance changes for events
- Instant messaging
- Notification system
- Team member online status

### Edge Functions
- `calculateReputationTier(userId)`: Recalculate after events
- `checkEventEligibility(userId, eventId)`: Verify can join
- `generateExportPackage(teamId)`: Create archive zip
- `processScheduledPurges()`: Daily cron job
- `notifyDiscord(teamId, event)`: Webhook notifications
- `transferTeamOwnership(params)`: Handle ownership changes

### Performance Considerations
- Pagination for large galleries
- Lazy loading team photo libraries
- Cached reputation calculations
- Optimistic UI updates
- CDN for media delivery
- Cold storage for archived teams
- Compressed thumbnails for browsing

### Security
- OAuth 2.0 for all third-party services
- RLS policies for all tables
- Secure webhook handling (Stripe, Discord)
- API key management per user
- Data encryption for contracts, payments
- Rate limiting on AI requests

## User Experience Priorities

### Onboarding
1. Create account → Personal team auto-created
2. Optional tutorial for beginners
3. Quick project template selection
4. Skill assessment (optional)
5. Connect social media (optional)

### Stress Reduction Features
- "Idea Bank" for future projects (unlimited)
- Limited active projects (forces prioritization)
- "Next action" highlighting
- Progress visualization
- Gentle reminders without pressure
- Easy project pausing
- Scope creep warnings

### Mobile-First Considerations
- Responsive design
- Quick photo uploads from shoots
- Mobile-optimized galleries
- Push notifications for key events
- Offline support for critical features
- Native apps in Phase 7

## Success Metrics

### User Engagement
- Active projects completion rate
- Event attendance rate
- Reputation tier distribution
- Commission completion rate
- Social post scheduling usage

### Platform Health
- Team creation rate
- Temp event success rate (actual vs planned attendance)
- Repeat collaboration rate
- Review/rating completion rate
- Archive restoration rate

### Business Metrics
- Free to premium conversion rate
- Lifetime subscription adoption
- Commission marketplace GMV
- Storage usage per tier
- AI request usage patterns
- Churn rate by tier

---

## Constitution File Key Principles

1. **Reduce Overwhelm**: Limited active projects, idea vault for future plans, clear prioritization
2. **Build Community Trust**: Transparent reputation system, two-way reviews, accountability
3. **Flexible Collaboration**: Easy temp teams for shoots, permanent teams for ongoing work
4. **Data Safety**: Long archive periods, free read access, restoration options
5. **Fair Pricing**: Free tier is functional, premium unlocks convenience, lifetime option available
6. **Privacy Respectful**: Public profiles by choice, location privacy, data export always available
7. **Progressive Enhancement**: Works without AI/integrations, better with them
8. **Mobile Ready**: Designed for on-the-go creatives
9. **Beginner Friendly**: Templates, tutorials, helpful defaults, reputation building paths
10. **Professional Capable**: Advanced features for serious creators, commission marketplace, team management

---

## Implementation Roadmap Summary

### MVP (Months 1-3)
- Core authentication & personal teams
- Basic project management
- Photo storage & galleries
- Team creation & invitations
- Simple messaging

### Beta (Months 4-6)
- Temp teams & event discovery
- Reputation system
- Event attendance tracking
- User profiles & portfolios
- Basic AI features (OpenAI integration)

### V1.0 (Months 7-9)
- Commission marketplace
- Contract builder
- Stripe payments
- Two-way reviews
- Team roles & permissions

### V1.5 (Months 10-12)
- Social media integrations
- Content scheduling
- Convention discovery
- Google Docs/Pinterest/Notion integrations
- Video storage

### V2.0 (Year 2)
- Discord integration
- Advanced AI features
- Team analytics
- Mobile apps
- International expansion (Japan/Korea)

### V2.5+ (Future)
- White-label options
- API access
- AR features
- Advanced marketplace features
- Studio/Pro tier

---

## Notes for AI-Assisted Development

### Context for AI Pair Programming
When working with AI assistants on this codebase:

1. **Always specify**: SvelteKit + Supabase + TypeScript
2. **Mention tier**: Which subscription tier the feature applies to
3. **State dependencies**: What integrations/APIs the feature uses
4. **Reference reputation**: How features interact with reputation system
5. **Consider teams**: Personal vs collaborative vs temp team context

### Common Patterns to Establish
- RLS policy patterns for different team types
- Reputation calculation triggers
- Event lifecycle hooks (created → active → completed → archived)
- Export package generation flow
- Storage tier migrations (hot → cold)

### Testing Priorities
- Reputation tier calculations
- Event eligibility checks
- Team access permissions
- Archive/restore flows
- Payment flows (Stripe integration)
- AI credit management

### Documentation Needs
- API integration guides for each service
- RLS policy documentation
- Reputation system logic
- Team lifecycle state machine
- Archive timeline flowchart
