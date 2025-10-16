# Phase 1 MVP Implementation: Week 4 Checklist

**Timeline**: Week 4 (5 working days)  
**Focus**: Image Processing + Email Integration  
**Deliverable**: GitHub PR with image upload pipeline + SendGrid email system  
**Dependency**: Week 1-3 (database + API + auth) must be merged first

---

## 🎯 Acceptance Criteria

### Image Upload & Storage

- [ ] **S3-Compatible Storage** (Supabase Storage)
  - Bucket `shoots` created in Supabase
  - Bucket `costumes` created
  - Bucket `avatars` created
  - RLS policies: only user can upload/delete own images
  - Signed URLs (expiring) generated for private images
  - Public URLs for avatars and gallery images

- [ ] **File Type Validation**
  - Accept: JPEG, PNG, WebP
  - Reject: SVG, BMP, GIF, executable files
  - File size limit: 50MB per image
  - Test: rejected files return 400 Bad Request

- [ ] **Upload Endpoint** (`POST /api/images/upload`)
  - Multipart form data: `file`, `bucket`, `folder`
  - Returns: `{ fileName, url, size, width, height, uploadedAt }`
  - Validates auth: user must be authenticated
  - Stores metadata in `images` table
  - Database fields: `id, user_id, team_id, bucket, path, size, width, height, mime_type, uploaded_at`

### Image Optimization (Sharp)

- [ ] **Responsive Image Sizes**
  - Original stored in S3
  - 4 optimized versions created:
    - **Thumbnail**: 320px (for lists)
    - **Medium**: 640px (for detail pages)
    - **Large**: 1280px (for full-screen)
    - **XL**: 2560px (for downloads)
  - All formats: WebP primary, JPEG fallback
  - Compression: 75% quality (good UX without artifacts)

- [ ] **Image Processing Pipeline**
  - Upload triggered → queued in `image_processing_queue`
  - Background worker processes queue (frequency: every 30 seconds or batch of 10)
  - Sharp transforms image to 4 sizes
  - Uploads to S3 with naming: `{folder}/{id}-{size}.webp`, `{folder}/{id}-{size}.jpg`
  - Updates `images` table with `optimized_at` timestamp
  - Test: large image (5MB) processes within 2 seconds

- [ ] **Image Display Component** (`ImageViewer.svelte`)
  - Accepts: `src`, `alt`, `sizes`
  - Renders: `<picture>` with WebP + JPEG sources
  - Responsive: `srcset` with 320/640/1280/2560 sizes
  - Lazy loading: `loading="lazy"`
  - Aspect ratio preserved (no layout shift)

- [ ] **Image Deletion**
  - User deletes image from S3
  - All variants (320, 640, 1280, 2560) deleted
  - Database record marked `deleted_at` (soft delete)
  - Endpoint: `DELETE /api/images/{id}`

### Email Integration (SendGrid)

- [ ] **SendGrid Account Setup**
  - Account created, API key generated
  - `.env.local`: `SENDGRID_API_KEY=<key>`
  - Sender email verified: `noreply@cosplans.app`

- [ ] **Email Templates**
  - **Email Confirmation**: "Welcome to Cosplans! Verify your email"
  - **2FA Setup Confirmation**: "2FA enabled on your account"
  - **Password Reset**: "Reset your password in the next 24 hours"
  - **Shoot Invite**: "{Inviter} invited you to shoot: {ShootName}"
  - **Team Invitation**: "{TeamName} team members invited you"
  - All templates: branded with Cosplans logo, clear CTA, footer with unsubscribe

- [ ] **Email Sending Service** (`src/lib/services/email.ts`)
  - Function: `sendEmail(to, templateId, data)`
  - Returns: `{ success, messageId }`
  - Handles errors: retry on SendGrid failure (up to 3 retries, exponential backoff)
  - Logs: each email sent to `email_logs` table for auditing

- [ ] **Email Verification** (Week 3 dependency)
  - User signs up with email
  - Verification email sent immediately
  - Link: `http://cosplans.app/auth/verify?token={jwt}`
  - Link expires in 24 hours
  - User clicks link → email marked verified, account activated

- [ ] **Transactional Email Queue**
  - Table: `email_queue`
  - Columns: `id, to_email, template_id, data, status (pending/sent/failed), created_at, sent_at`
  - If SendGrid fails → queued, retry every 5 minutes up to 10 times
  - Cron job (every 5 min): check queue for pending emails

### Error Handling & Retry

- [ ] **Image Upload Errors**
  - Invalid format → `400 Bad Request`
  - File too large → `413 Payload Too Large`
  - Quota exceeded → `429 Too Many Requests`
  - S3 unavailable → `503 Service Unavailable`, retry after 10s

- [ ] **Email Send Errors**
  - SendGrid API down → queued, retry after 5 min
  - Invalid email → logged, not retried
  - Rate limited → `429`, backoff with jitter

### Testing (70% coverage minimum)

- [ ] **Unit Tests** (Vitest)
  - Image size validation
  - MIME type checking
  - Sharp transforms (aspect ratio preservation, compression quality)
  - Email template rendering
  - **Target**: 12+ unit tests

- [ ] **Integration Tests**
  - Image upload → S3 storage → metadata in DB
  - Image optimization pipeline (queue → process → upload)
  - Email sent via SendGrid
  - Email retry queue after SendGrid failure
  - Image deletion cascade
  - **Target**: 10+ integration tests

- [ ] **E2E Tests** (Playwright)
  - Upload image, verify in S3
  - Upload image, verify optimized sizes exist
  - ImageViewer component loads responsive image
  - **Target**: 4+ E2E tests

- [ ] **Coverage Report**
  - Minimum 70% overall
  - Generate: `npm run test:coverage`

### Documentation

- [ ] **Image Upload Guide** (`.specify/image-upload.md`)
  - How to upload images
  - Supported formats
  - Size limits
  - Optimization pipeline explained

- [ ] **Email Configuration** (`.specify/email-setup.md`)
  - SendGrid API key setup
  - Template management
  - Queue architecture
  - Retry logic

- [ ] **API Documentation Update**
  - `POST /api/images/upload` (image metadata response)
  - `DELETE /api/images/{id}`
  - `GET /api/emails/logs` (admin only, audit trail)

---

## 🔗 Constitution References

**Principle I (Web-First, Mobile-Responsive)**
- [ ] Images optimized for mobile (responsive sizes: 320/640/1280/2560)
- [ ] WebP with JPEG fallback for broad browser support
- [ ] Lazy loading prevents page bloat

**Principle V (Visual-First)**
- [ ] Image upload central to user experience
- [ ] Optimization transparent to user (automatic processing)
- [ ] ImageViewer component reusable across app

**Principle VII (Security & Privacy)**
- [ ] RLS policies: users can only access own images
- [ ] Signed URLs prevent unauthorized access
- [ ] Email verification required before sending marketing emails

**Technology Stack (Constitution v2.2.0)**
- [ ] Sharp.js for image optimization
- [ ] Supabase Storage for S3-compatible storage
- [ ] SendGrid for email delivery
- [ ] Vitest + Playwright for testing

---

## 📦 Deliverables

### Code
- [ ] `src/lib/services/imageUpload.ts` (Sharp pipeline)
- [ ] `src/routes/api/images/upload/+server.ts` (upload endpoint)
- [ ] `src/routes/api/images/[id]/+server.ts` (delete endpoint)
- [ ] `src/components/ImageViewer.svelte` (responsive image display)
- [ ] `src/lib/services/email.ts` (SendGrid integration)
- [ ] `src/routes/api/emails/send/+server.ts` (send email endpoint)
- [ ] Database migrations: `images` table, `email_queue` table, `image_processing_queue` table

### Tests
- [ ] Unit tests: 12+
- [ ] Integration tests: 10+
- [ ] E2E tests: 4+
- [ ] Coverage: 70%+

### Documentation
- [ ] Image upload guide
- [ ] Email configuration guide
- [ ] Updated API spec with image + email endpoints

---

## ⚠️ Known Blockers / Decisions Needed

| Blocker | Impact | Resolution |
|---------|--------|-----------|
| **SendGrid API Key** | Cannot test real email without key | Use mock SendGrid endpoint in tests; real key in staging |
| **S3 Bucket Permissions** | Must configure RLS policies | Document exact Supabase Storage policy JSON |
| **Sharp Performance** | Large images (20MB) may timeout | Set 30-second timeout; queue for background processing |

---

## ✅ Sign-Off Criteria

**Week 4 COMPLETE when**:
1. ✅ Image upload working, stored in S3
2. ✅ Responsive optimization pipeline working (320/640/1280/2560)
3. ✅ ImageViewer component displays images responsively
4. ✅ SendGrid email integration working
5. ✅ Email queue + retry logic working
6. ✅ 70%+ test coverage
7. ✅ PR approved and merged

---

**Timeline**: Week 4 of 12  
**Dependency**: Week 1-3 merged  
**Next**: Week 5-6 (Real-Time Sync)
