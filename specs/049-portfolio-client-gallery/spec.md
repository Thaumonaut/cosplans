# Feature Specification: Portfolio & Client Gallery System (Editing Workflow Integration)

**Feature Branch**: `049-portfolio-client-gallery`  
**Created**: October 24, 2025  
**Status**: Draft - Ideas Phase  
**Input**: User description: "I want photographers to host images like Pixieset for sharing with clients and building portfolios. Also portfolio options for makeup artists, wig stylists, outfit commissioners, etc. Integrate with editing workflow (spec 015) to release approved photos directly to galleries."

**Dependencies**: Builds on spec 015 (Editing Task Assignment) - approved photos flow into client galleries and portfolios.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Release Approved Photos to Client Gallery (Priority: P1)

As a photographer, I want to automatically release approved photos (from spec 015 editing workflow) to a password-protected client gallery where clients can view, favorite, and download their photos so that I can professionally deliver work without manually uploading again.

**Why this priority**: Core value proposition - seamless transition from editing to client delivery. This is the natural next step after photo approval and eliminates duplicate uploads.

**Independent Test**: After photos marked "Approved" in editing workflow, photographer can create/update client gallery; approved photos appear in gallery; client can access, view, favorite, and download.

**Acceptance Scenarios**:

1. **Given** I have 20 approved photos from shoot, **When** I click "Release to Client Gallery" and set password, **Then** gallery is created with all approved photos automatically
2. **Given** more photos get approved later, **When** I add them to existing gallery, **Then** client sees new photos appear in same gallery link
3. **Given** client receives gallery link, **When** they enter password, **Then** they see all approved photos in professional gallery layout (no draft/editing artifacts)
4. **Given** client is viewing gallery, **When** they mark photos as favorites, **Then** I see which photos they selected in real-time on my shoot dashboard
5. **Given** client wants photos, **When** they click download, **Then** they get high-res files (or watermarked previews based on my settings)
6. **Given** I'm still editing, **When** shoot has mix of approved and in-progress photos, **Then** only approved photos appear in client gallery (client doesn't see editing workflow)

---

### User Story 2 - Publish to Public Portfolio (Priority: P1)

As a creative professional (photographer/makeup artist/wig stylist/commissioner), I want to select my best photos from client galleries or shoots and publish them to my public portfolio so that potential clients can discover my work without manually re-uploading.

**Why this priority**: Marketing and client acquisition - essential for growing business. Leverages photos already in system from editing workflow.

**Independent Test**: User can create public portfolio, select photos from shoots/galleries, organize into collections, customize layout; visitors can browse portfolio without login.

**Acceptance Scenarios**:

1. **Given** I have approved photos in multiple shoots, **When** I select best 30 and click "Add to Portfolio", **Then** photos appear in my public portfolio (username.cosplans.app)
2. **Given** I have portfolio, **When** I organize photos into collections ("Fantasy Armor", "Wig Styling", "Makeup FX"), **Then** visitors can browse by category
3. **Given** visitor views portfolio, **When** they click photo, **Then** they see full resolution with caption, tags, and "Hire Me" contact button
4. **Given** I update portfolio, **When** I mark photos as "Featured", **Then** those appear first and in higher prominence
5. **Given** photo is in client gallery, **When** I publish to portfolio, **Then** client's favorites/download data doesn't show publicly (privacy)
6. **Given** I finish a shoot, **When** I review approved photos, **Then** I can one-click publish selected photos to portfolio from editing workflow

---

### User Story 3 - Multi-Role Portfolios (Priority: P2)

As a creative who wears multiple hats (photographer + makeup artist, or wig stylist + commissioner), I want to organize portfolio by role/service type so that clients can easily find relevant work for what they're hiring me for.

**Why this priority**: Supports multi-talented creators. Builds on P1 portfolio by adding organization for different service types.

**Independent Test**: User can create multiple portfolio sections by role, visitors can filter/navigate by service type.

**Acceptance Scenarios**:

1. **Given** I offer photography and makeup services, **When** I create portfolio, **Then** I can organize into "Photography Portfolio" and "Makeup Portfolio" sections
2. **Given** I have role-based sections, **When** visitor arrives, **Then** they see clear navigation between my different services
3. **Given** I'm a commissioner, **When** I showcase work, **Then** I can tag photos with "Outfit", "Wig", "Prop", "Armor" to show what I create
4. **Given** potential client searches for wig stylists, **When** they find my portfolio, **Then** they see only wig-related work prominently

---

### User Story 4 - Watermarking & Download Control (Priority: P2)

As a photographer protecting my work, I want to control downloads with watermarks, resolution limits, and usage rights so that clients can't misuse images before payment or licensing.

**Why this priority**: Revenue protection and copyright control. Important for professional use but basic gallery works without this.

**Independent Test**: User can set watermark settings per gallery, control download permissions, track download usage.

**Acceptance Scenarios**:

1. **Given** I create client gallery, **When** I enable watermarking, **Then** preview images show my watermark logo but download option gives unwatermarked files (if paid)
2. **Given** gallery is for client selection only, **When** I disable downloads, **Then** client can favorite but not download until I enable it
3. **Given** I offer print sales, **When** I set download resolution limits, **Then** clients get web-res previews but can purchase high-res downloads
4. **Given** I track usage, **When** I view gallery analytics, **Then** I see who downloaded which photos and when

---

### User Story 5 - Integration with Cosplay Projects (Priority: P3)

As a cosplayer/creative, I want my portfolio photos to link to the characters and outfits I created so that viewers can see the full project context beyond just the final photos.

**Why this priority**: Unique value-add for cosplay community. Connects portfolio system to resource management. Nice-to-have but not essential for basic portfolio.

**Independent Test**: User can link portfolio photos to character/outfit entries, visitors see project details alongside photos.

**Acceptance Scenarios**:

1. **Given** I have character "Saber" in my resources, **When** I upload photos to portfolio, **Then** I can tag them as "Character: Saber, Outfit: Armor v1"
2. **Given** visitor views portfolio photo, **When** they click character tag, **Then** they see project details: materials used, time spent, techniques (if I choose to share)
3. **Given** I want to showcase process, **When** I link portfolio to character, **Then** visitors can see "progress photos" alongside finals
4. **Given** I'm a commissioner, **When** I showcase completed work, **Then** I can link to cost/time data to help future clients with estimates

---

### Edge Cases

- What happens when gallery expires or is deleted? (Scheduled expiration dates, client receives download warning before expiration)
- How to handle very large galleries (200+ photos)? (Lazy loading, thumbnail optimization, pagination)
- What if client forgets password? (Email reset link, or photographer can generate new password)
- Should galleries be embeddable on external websites? (Provide iframe embed code for portfolios)
- How to handle NSFW/mature content in portfolios? (Age verification splash page, content warnings, optional hide from public listings)
- Can clients leave feedback on gallery? (Optional comments/ratings if photographer enables)
- What about print fulfillment integration? (Out of scope for MVP, but design data model to support future print shop integration)
- How to handle collaborative work credits? (Tag photos with collaborators, link to their portfolios)
- What if photo is removed from shoot but already in client gallery? (Gallery maintains copy, or shows "photo removed" placeholder based on settings)
- Can photographer update photo in gallery after release? (Support replacing photo with new edit, notify client of updates)
- What if approved photo gets unapproved during editing revisions? (Remove from gallery automatically, or flag for review based on settings)
- How to handle batch releases (50 shoots → one gallery)? (Support multi-shoot galleries, useful for convention compilations)

## Requirements *(mandatory)*

### Functional Requirements

**Client Gallery Management:**
- **FR-001**: System MUST allow users to create password-protected client galleries linked to one or more shoots
- **FR-002**: System MUST automatically populate gallery with photos marked "Approved" from spec 015 editing workflow
- **FR-003**: System MUST generate unique shareable links per gallery (e.g., cosplans.app/gallery/abc123) with password protection
- **FR-004**: System MUST support manual photo upload to gallery for photos not from editing workflow (direct uploads)
- **FR-005**: System MUST allow setting gallery expiration dates with email warnings to client before expiration
- **FR-006**: System MUST support client favoriting/selection of photos within gallery
- **FR-007**: System MUST track gallery analytics: views, favorites, downloads per photo
- **FR-008**: System MUST allow photographer to enable/disable downloads per gallery
- **FR-009**: System MUST support watermark overlay on preview images with customizable logo/text
- **FR-010**: System MUST allow setting download resolution limits (web-res vs print-res)
- **FR-011**: System MUST sync updates when additional photos are approved in editing workflow (auto-add to existing gallery)
- **FR-012**: System MUST allow photographer to remove individual photos from gallery without deleting from shoot

**Public Portfolio:**
- **FR-013**: System MUST allow users to create public portfolio with custom subdomain (username.cosplans.app)
- **FR-014**: System MUST allow selecting photos from shoots, galleries, or direct upload to add to portfolio
- **FR-015**: System MUST support "Publish to Portfolio" one-click action from editing workflow approved photos
- **FR-016**: System MUST support organizing portfolio photos into collections/categories
- **FR-017**: System MUST allow marking photos as "Featured" for prominent display
- **FR-018**: System MUST support photo captions, tags, and metadata
- **FR-019**: System MUST display contact/hire information on portfolio pages
- **FR-020**: System MUST allow customizing portfolio layout and theme
- **FR-021**: System MUST support multi-role portfolios with section navigation
- **FR-022**: System MUST hide client gallery analytics (favorites, downloads) when photo is published to public portfolio (privacy)

**Editing Workflow Integration (builds on spec 015):**
- **FR-023**: System MUST add "Release to Gallery" action on shoot page when approved photos exist
- **FR-024**: System MUST show gallery status on shoot dashboard (e.g., "15 of 20 approved photos in client gallery")
- **FR-025**: System MUST allow batch-publishing approved photos to portfolio from shoot view
- **FR-026**: System MUST maintain link between source photo (shoot/editing) and gallery/portfolio copies for version tracking

**Resource Integration:**
- **FR-027**: System MUST allow tagging portfolio photos with character/outfit/project links (from spec 048)
- **FR-028**: System MUST display project context when viewer clicks character tags
- **FR-029**: System MUST support showing progress photos alongside final portfolio images (optional)

**Download & Rights:**
- **FR-030**: System MUST track all downloads with timestamp and downloader info
- **FR-031**: System MUST support expiring gallery links with configurable duration
- **FR-032**: System MUST allow photographer to revoke gallery access at any time
- **FR-033**: System MUST allow replacing photo in gallery with updated edit (e.g., client requested change after initial release)

### Key Entities

- **Gallery**: Password-protected client gallery linked to shoot(s). Attributes: name, password hash, shareable link, expiration date, watermark enabled, download enabled, view count, linked shoot IDs, auto-sync approved photos (boolean)
- **GalleryPhoto**: Photo within gallery. Attributes: source photo ID (from shoot/editing workflow), photo R2 URL, thumbnail URL, display order, favorite count, download count, added date, is manually added (vs auto from approval)
- **Portfolio**: Public portfolio page for creative professional. Attributes: subdomain, bio, contact info, services offered, theme settings
- **PortfolioCollection**: Organized photo collections within portfolio. Attributes: collection name, description, display order, role/service type
- **PortfolioPhoto**: Photo in public portfolio. Attributes: photo R2 URL, caption, tags, featured status, linked character/outfit ID (optional)
- **Download**: Track download events. Attributes: photo ID, downloader IP/session, timestamp, resolution downloaded

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Photographers can create client gallery with 50 photos in under 5 minutes
- **SC-002**: Gallery links load for clients in under 2 seconds on 3G connection
- **SC-003**: 90% of client galleries result in successful photo delivery (measured by download completion)
- **SC-004**: Portfolio pages load in under 3 seconds with optimized images
- **SC-005**: 70% of photographers with portfolios report increased client inquiries (measured via survey)
- **SC-006**: Watermarked previews render in under 500ms
- **SC-007**: Users can organize 100+ photos into collections in under 10 minutes
- **SC-008**: Public portfolios are discoverable via search within 24 hours of creation

## Assumptions

- Users are familiar with gallery platforms like Pixieset, SmugMug, Format
- Photos are already edited/processed before upload to gallery
- Most galleries contain 20-100 photos
- Clients access galleries primarily on mobile devices
- Watermarks are simple logo/text overlays, not advanced DRM
- Portfolio customization is template-based (not full custom code)

## Dependencies

- **Spec 015** (Editing Task Assignment) - approved photos are source for client galleries
- Cloudflare R2 storage for high-resolution image hosting (photos already stored from editing workflow)
- Image processing library for watermark overlay and thumbnail generation
- Subdomain routing for custom portfolio URLs (username.cosplans.app)
- Character/outfit entities from spec 048 (for portfolio integration with cosplay projects)

## Out of Scope

- Print fulfillment / shop integration
- Advanced DRM or image protection
- Video hosting in galleries
- Live photo viewing sessions
- Payment/e-commerce for photo sales
- Client booking/scheduling
- Contract/model release management
- RAW file hosting

