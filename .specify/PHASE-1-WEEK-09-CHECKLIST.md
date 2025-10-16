# Phase 1 MVP Implementation: Week 9 Checklist

**Timeline**: Week 9 (5 working days)  
**Focus**: Core UI - Dashboard, Shoots, Costumes, Props  
**Deliverable**: GitHub PR with complete UI for core features  
**Dependency**: Week 1-8 must be merged first

---

## 🎯 Acceptance Criteria

### Dashboard Page

- [ ] **Team Dashboard** (`/team/dashboard`)
  - Welcome message: "Welcome, {FirstName}!"
  - Key metrics: Total shoots, total costumes, total crew members (cards)
  - Recent shoots (table): Last 5 shoots, columns: Name, Date, Location, Status
  - Upcoming shoots (table): Sorted by date, next 7 days
  - Quick stats: On time %, shoot completion rate

- [ ] **Dashboard Responsiveness**
  - Desktop: 3 columns (metrics, recent, upcoming)
  - Tablet: 2 columns
  - Mobile: 1 column (stacked)
  - No horizontal scrolling

### Shoots Management

- [ ] **Shoots List Page** (`/team/shoots`)
  - Table with sorting/filtering:
    - Columns: Name, Date, Location, Status (planning/in-progress/complete), Crew Count
    - Sort by: Date, Name, Status
    - Filter by: Status, Location
  - Pagination: 20 per page
  - "Create Shoot" button (prominent)

- [ ] **Shoot Detail Page** (`/team/shoots/[id]`)
  - Header: Shoot name, date, location (map)
  - Tabs: Overview, Costumes, Props, Crew, Timeline
  - Overview tab:
    - Description
    - Start/End time (editable)
    - Location (editable, with Maps search)
    - Status (editable dropdown)
    - Mood board (embedded Google Docs)
  - Edit button (inline form)

- [ ] **Shoot Creation Form** (`/team/shoots/create`)
  - Form fields: Name, Date, Time, Location, Description
  - Location field: Google Places autocomplete
  - Date picker: calendar UI
  - Time picker: 24-hour format
  - Submit button: "Create Shoot"
  - Validation: name required, date in future, location required

- [ ] **Shoot Timeline Tab**
  - Shows: Pre-production → Production → Post-production
  - Collapsible sections with tasks
  - Task list: "Scout location", "Finalize costumes", "Schedule crew", etc.
  - Checkboxes to mark complete

### Costumes Management

- [ ] **Costumes List Page** (`/team/costumes`)
  - Gallery grid: 3-4 columns responsive
  - Each card: thumbnail, name, character/series, status badge
  - Grid responsive: 1 col mobile, 2 col tablet, 3 col desktop
  - Filter by: Status, Series, Character
  - "Create Costume" button

- [ ] **Costume Detail Page** (`/team/costumes/[id]`)
  - Large image (responsive)
  - Details panel:
    - Name, Character, Series
    - Status (draft/in-progress/complete)
    - Designer, Builder
    - Variants (list of costume variations)
    - Notes (rich text)
  - Gallery: all photos of this costume
  - Edit button

- [ ] **Costume Creation Form** (`/team/costumes/create`)
  - Fields: Name, Character, Series, Status, Designer, Builder
  - Image upload (drag-and-drop or click)
  - Notes field (rich text editor)
  - Save button

### Props Management

- [ ] **Props List Page** (`/team/props`)
  - Similar to costumes: gallery grid
  - Card: thumbnail, name, type (weapon, accessory, etc.), status
  - Filter by: Status, Type
  - "Create Prop" button

- [ ] **Prop Detail Page** (`/team/props/[id]`)
  - Image
  - Details: Name, Type, Status, Creator, Notes
  - Gallery of photos
  - Edit button

### Navigation & Layout

- [ ] **Main Navigation** (`src/components/Navigation.svelte`)
  - Logo + home link
  - Sidebar (desktop): Dashboard, Shoots, Costumes, Props, Team, Settings
  - Mobile: hamburger menu (collapsible)
  - User menu (top right): Profile, Settings, Logout
  - Active page highlighted

- [ ] **Responsive Layout**
  - Desktop: 200px sidebar + main content
  - Tablet: 150px sidebar
  - Mobile: hamburger menu (overlays content)
  - All pages responsive to 320px+ width

### Components (Shadcn/svelte)

- [ ] **Use Shadcn/svelte Components**
  - Button, Input, Textarea, Select, Checkbox, Radio
  - Card, Dialog, Dropdown Menu, Tabs
  - Alert, Badge, Toast notifications
  - Table (for lists)
  - Form (with Superforms + Zod validation)

- [ ] **Custom Components**
  - `ImageUpload.svelte` (drag-and-drop)
  - `RichTextEditor.svelte` (notes field)
  - `LocationPicker.svelte` (Google Maps search)
  - `DateTimePicker.svelte`
  - `StatusBadge.svelte` (color-coded status)

- [ ] **Icons (Lucide)**
  - Consistent icon usage
  - Navigation icons
  - Status icons (check, alert, clock, etc.)

### Form Validation

- [ ] **Client-Side Validation** (Sveltekit-Superforms + Zod)
  - Real-time validation as user types
  - Error messages below fields
  - Submit disabled if form invalid
  - Examples:
    - Name: required, 3-100 characters
    - Date: required, must be future date
    - Location: required, valid address

- [ ] **Server-Side Validation**
  - All fields re-validated on server
  - Returns: `{ form }` with errors if invalid
  - Prevents tampering

### Accessibility

- [ ] **WCAG 2.1 Level AA Compliance**
  - All buttons keyboard accessible (Tab navigation)
  - Form labels associated with inputs (`for` attribute)
  - Color contrast: 4.5:1 for text
  - Images have alt text
  - Focus visible indicators

- [ ] **Mobile Accessibility**
  - Touch targets: 44px minimum
  - Font size: 16px+ for inputs (prevents iOS zoom)

### Testing (70% coverage minimum)

- [ ] **Unit Tests**
  - Form validation logic
  - Status badge color logic
  - Date/time formatting
  - **Target**: 8+ unit tests

- [ ] **Component Tests**
  - Dashboard metrics calculation
  - Shoot list sorting/filtering
  - Costume gallery grid responsive behavior
  - Form submit with validation
  - **Target**: 10+ component tests

- [ ] **E2E Tests** (Playwright)
  - Navigate to dashboard
  - Create shoot (form flow)
  - View shoot detail
  - Edit costume
  - **Target**: 6+ E2E tests

- [ ] **Coverage**: 70%+ minimum

### Documentation

- [ ] **UI Component Guide** (`.specify/ui-components.md`)
  - Which Shadcn components used where
  - How to use custom components
  - Examples of each component

- [ ] **Page Structure** (`.specify/page-structure.md`)
  - Dashboard layout
  - Shoots/Costumes/Props pages
  - Detail page structure

---

## 🔗 Constitution References

**Principle I (Web-First, Mobile-Responsive)**
- [ ] All pages responsive: mobile 1 col, tablet 2 col, desktop 3+ col
- [ ] Font sizes accessible (16px+ for inputs)
- [ ] Touch targets 44px minimum

**Principle V (Visual-First)**
- [ ] Gallery grid for costumes/props
- [ ] Large, responsive images
- [ ] Status badges with color coding
- [ ] Consistent visual hierarchy

**Technology Stack (Constitution v2.2.0)**
- [ ] SvelteKit for routing
- [ ] Shadcn/svelte for UI components
- [ ] Lucide for icons
- [ ] Tailwind CSS for styling
- [ ] Sveltekit-Superforms + Zod for forms
- [ ] Vitest + Playwright for testing

---

## 📦 Deliverables

### Pages
- [ ] `src/routes/(app)/dashboard/+page.svelte` (dashboard)
- [ ] `src/routes/(app)/shoots/+page.svelte` (list)
- [ ] `src/routes/(app)/shoots/create/+page.svelte` (create form)
- [ ] `src/routes/(app)/shoots/[id]/+page.svelte` (detail)
- [ ] `src/routes/(app)/costumes/+page.svelte` (list)
- [ ] `src/routes/(app)/costumes/[id]/+page.svelte` (detail)
- [ ] `src/routes/(app)/props/+page.svelte` (list)
- [ ] `src/routes/(app)/props/[id]/+page.svelte` (detail)

### Components
- [ ] `src/components/Navigation.svelte`
- [ ] `src/components/ImageUpload.svelte`
- [ ] `src/components/RichTextEditor.svelte`
- [ ] `src/components/LocationPicker.svelte`
- [ ] `src/components/DateTimePicker.svelte`
- [ ] `src/components/StatusBadge.svelte`

### Tests
- [ ] Unit tests: 8+
- [ ] Component tests: 10+
- [ ] E2E tests: 6+
- [ ] Coverage: 70%+

### Documentation
- [ ] UI component guide
- [ ] Page structure reference

---

## ✅ Sign-Off Criteria

**Week 9 COMPLETE when**:
1. ✅ Dashboard page working
2. ✅ Shoots CRUD (create, read, update, delete) working
3. ✅ Costumes CRUD working
4. ✅ Props CRUD working
5. ✅ All pages responsive (mobile, tablet, desktop)
6. ✅ Form validation working (client + server)
7. ✅ WCAG 2.1 AA compliance
8. ✅ 70%+ test coverage
9. ✅ PR approved and merged

---

**Timeline**: Week 9 of 12  
**Dependency**: Week 1-8 merged  
**Next**: Week 10 (Instagram Integration)
