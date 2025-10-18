# Dashboard Layout Visual Mockup & Component Structure

## Current Dashboard Structure (After Redesign)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                      STICKY HEADER                     ┃
┃  Dashboard    [Online Badge]        View: [Dropdown]   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃              ⭐ QUICK STATS - PINNED FOCUS              ┃
┃┌─────────────────────────────────────────────────────┐┃
┃│  📸              👥              📷              📅  │┃
┃│  Active Shoots   Team Members    Portfolio        Next Shoot│
┃│      3               8               24           Oct 25   │
┃│  +1 this week   All available   +3 this month   3 days away│
┃└─────────────────────────────────────────────────────┘┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🎥 UPCOMING SHOOTS                                   ┃
┃   Your scheduled shoots and team assignments           ┃
┃┌─────────────────────────────────────────────────────┐┃
┃│                                                     │┃
┃│  ┌──────────────────────────────────────────────┐ │┃
┃│  │ Convention Shoot                    upcoming │ │┃
┃│  │ Sailor Moon, Tuxedo Mask                    │ │┃
┃│  │                                              │ │┃
┃│  │ 📅 Oct 25, 2025          ⏰ 2:00 PM       │ │┃
┃│  │ 📍 Convention Center Hall A                 │ │┃
┃│  │ ─────────────────────────────────────────── │ │┃
┃│  │ 📸 Alex Chen              👥 4 team members│ │┃
┃│  └──────────────────────────────────────────────┘ │┃
┃│                                                     │┃
┃│  ┌──────────────────────────────────────────────┐ │┃
┃│  │ Studio Session                    planning   │ │┃
┃│  │ Asuka Langley                              │ │┃
┃│  │                                              │ │┃
┃│  │ 📅 Nov 2, 2025           ⏰ 10:00 AM      │ │┃
┃│  │ 📍 Downtown Studio                          │ │┃
┃│  │ ─────────────────────────────────────────── │ │┃
┃│  │ 📸 Sarah Kim              👥 6 team members│ │┃
┃│  └──────────────────────────────────────────────┘ │┃
┃│                                                     │┃
┃│  ┌──────────────────────────────────────────────┐ │┃
┃│  │ Outdoor Cosplay                  confirmed  │ │┃
┃│  │ Nezuko, Tanjiro                            │ │┃
┃│  │                                              │ │┃
┃│  │ 📅 Nov 14, 2025          ⏰ 9:00 AM       │ │┃
┃│  │ 📍 Cherry Blossom Park                      │ │┃
┃│  │ ─────────────────────────────────────────── │ │┃
┃│  │ 📸 Mike Rodriguez         👥 3 team members│ │┃
┃│  └──────────────────────────────────────────────┘ │┃
┃│                                                     │┃
┃└─────────────────────────────────────────────────────┘┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃         SECONDARY METRICS                              ┃
┃┌────────────────────────────┐ ┌──────────────────────┐┃
┃│  📊 Progress Overview      │ │ ⚠️  Alerts & Notify  │┃
┃│                            │ │                      │┃
┃│  Overall: 45% Complete    │ │ • 3 pending approvals│
┃│  • Costume: 80%            │ │ • 1 new message      │
┃│  • Props: 60%              │ │ • Weather alert      │
┃│  • Photography: 20%        │ │ • 1 task overdue     │
┃│                            │ │                      │
┃└────────────────────────────┘ └──────────────────────┘┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## Component Hierarchy

```
DashboardLayout
├── Header
│   ├── Title
│   ├── ConnectionStatus Badge
│   └── TemplateSelector
│
├── Main Content
│   ├── QuickStatsSection
│   │   ├── StatCard (Active Shoots)
│   │   │   ├── Icon
│   │   │   ├── Label
│   │   │   ├── Number
│   │   │   └── Change Indicator
│   │   ├── StatCard (Team Members)
│   │   ├── StatCard (Portfolio Items)
│   │   └── StatCard (Next Shoot)
│   │
│   ├── PrimaryWidgetSection
│   │   └── UpcomingShootsCard (Full Width)
│   │       ├── Header (Blue Gradient)
│   │       │   ├── Icon + Title
│   │       │   └── Description
│   │       └── Content
│   │           └── UpcomingShootsWidget
│   │               └── ShootCard[] (3+ cards)
│   │                   ├── Title + Characters + Status
│   │                   ├── Date/Time/Location
│   │                   └── Photographer + Team Count
│   │
│   └── SecondaryMetricsSection
│       ├── SectionLabel
│       └── MetricsGrid (2 columns)
│           ├── Card (Progress Overview)
│           └── Card (Alerts Notifications)
```

---

## Color & Styling Reference

### Quick Stats Cards

#### Card 1: Active Shoots (Blue)
```
Background: from-blue-500 to-blue-600
Text: text-white
Icon Background: bg-white/20
Format: 
  Label: text-blue-100 text-sm font-medium
  Number: text-3xl font-bold
  Meta: text-blue-100 text-xs
```

#### Card 2: Team Members (Purple)
```
Background: from-purple-500 to-purple-600
Text: text-white
Icon Background: bg-white/20
Format: Same as Blue card
```

#### Card 3: Portfolio Items (Green)
```
Background: from-green-500 to-green-600
Text: text-white
Icon Background: bg-white/20
Format: Same as Blue card
```

#### Card 4: Next Shoot (Orange)
```
Background: from-orange-500 to-orange-600
Text: text-white
Icon Background: bg-white/20
Format: Same as Blue card (but number smaller at text-lg)
```

### Primary Widget Section

```
Container: bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden

Header:
  Background: bg-gradient-to-r from-blue-600 to-blue-700
  Padding: px-6 py-4
  Title: text-lg font-semibold text-white flex items-center gap-2
  Icon: w-5 h-5 text-white
  Subtitle: text-blue-100 text-sm mt-1

Content:
  Padding: p-6
  Contains UpcomingShootsWidget output
```

### Secondary Metrics Grid

```
Container: mb-8
Label: text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide

Grid:
  gap-6 grid-cols-1 md:grid-cols-2
  
Cards: Use existing Card component
  - transition-shadow hover:shadow-lg focus-within:shadow-lg
  - Standard CardHeader, CardTitle, CardContent structure
```

---

## Responsive Behavior

### Desktop (≥1024px)
```
Quick Stats:    4 cards in row
Shoots:         Full width
Secondary:      2 columns
Layout:         Max width 7xl, centered
```

### Tablet (768px - 1023px)
```
Quick Stats:    2 cards per row (2×2 grid)
Shoots:         Full width
Secondary:      2 columns (may stack to 1 on very small tablets)
Layout:         Full width with padding
```

### Mobile (<768px)
```
Quick Stats:    1 card per row (stacks vertically)
Shoots:         Full width, shoot cards adapt to narrower space
Secondary:      1 column (stacks vertically)
Layout:         Full width with minimal padding
Sidebar:        (To be added) Collapses to hamburger
```

---

## Layout CSS Classes

### Quick Stats Grid
```
grid grid-cols-1 md:grid-cols-4 gap-4 mb-8
```

### Stat Cards
```
bg-gradient-to-br from-{color}-500 to-{color}-600
rounded-lg p-6 text-white shadow-lg
flex items-center justify-between
```

### Primary Widget Container
```
mb-8
bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden
```

### Primary Widget Header
```
bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4
```

### Secondary Metrics Grid
```
grid gap-6 grid-cols-1 md:grid-cols-2
```

---

## Upcoming Shoots Widget Card Structure

Each shoot card now has better visual organization:

### Header Section (No Truncation)
```
┌─────────────────────────────────┬──────────────┐
│ Convention Shoot                │  [upcoming]  │
│ Sailor Moon, Tuxedo Mask        │              │
└─────────────────────────────────┴──────────────┘
```

### Details Section
```
┌─────────────────────────────────────────────────┐
│ 📅 Oct 25, 2025        ⏰ 2:00 PM              │
│ 📍 Convention Center Hall A (full text visible)│
└─────────────────────────────────────────────────┘
```

### Footer Section
```
┌────────────────────────────────────────────────┐
│ 📸 Alex Chen          👥 4 team members        │
└────────────────────────────────────────────────┘
```

---

## Information Hierarchy Map

### Visual Weight (Highest to Lowest)

1. **Quick Stats Cards** (Highest)
   - Large typography (text-3xl)
   - Bright, saturated colors (blue, purple, green, orange)
   - Top of page (attention capture)
   - 4-card grid forces scanning

2. **Upcoming Shoots Header** (High)
   - Blue gradient background
   - Icon + descriptive subtitle
   - Full width separation
   - Clear CTA area

3. **Shoot Cards** (High-Medium)
   - Larger cards with proper spacing
   - Multiple visual elements
   - Clear visual hierarchy within each card
   - Card hover effects

4. **Secondary Metrics** (Medium)
   - Smaller cards in 2-column grid
   - Muted styling compared to primary widget
   - "Secondary Metrics" label indicates lower priority
   - Still scannable and accessible

### Attention Flow
```
User arrives → Eyes drawn to colorful stats (1st)
           → Scans down to blue "Upcoming Shoots" (2nd)
           → Reads through shoot cards (3rd)
           → Scrolls to secondary metrics (4th, if needed)
```

---

## Future Navigation Integration

When sidebar is added, layout will be:

```
┌────────────────────────────────────────────────┐
│ Sidebar  │  Header                             │
├──────────┼────────────────────────────────────────
│          │  Main Content (Dashboard)           │
│  Menu    │  - Quick Stats                      │
│  Items   │  - Primary Widget (Shoots)          │
│          │  - Secondary Metrics                │
│          │                                     │
│          │  (Same content, now has left nav)   │
└──────────┴─────────────────────────────────────┘
```

Sidebar will add:
- Left navigation (250-280px on desktop, 64px collapsed on mobile)
- Team context at top
- User menu at bottom
- Notification badges on nav items

---

## Tailwind Classes Used

### Colors
- `from-blue-500 to-blue-600` - Primary (shoots)
- `from-purple-500 to-purple-600` - Team
- `from-green-500 to-green-600` - Content
- `from-orange-500 to-orange-600` - Alerts
- `bg-white/20` - Overlay tint

### Spacing
- `gap-4` - Stat card gaps (16px)
- `gap-6` - Widget gaps (24px)
- `p-6` - Card padding (24px)
- `px-6 py-4` - Header padding (24px x 16px)
- `mb-8` - Section margins (32px)

### Typography
- `text-3xl font-bold` - Stat numbers
- `text-sm font-medium` - Stat labels
- `text-lg font-semibold` - Widget titles
- `text-xs` - Supporting text

### Layout
- `grid-cols-1 md:grid-cols-4` - Stats responsive
- `grid-cols-1 md:grid-cols-2` - Secondary widgets
- `max-w-7xl mx-auto` - Container max width
- `sticky top-0 z-10` - Header sticky positioning

---

## Notes for Developers

1. **No New Components Needed**: Uses existing Card, CardHeader, CardContent, CardTitle, Badge, Button components

2. **Mock Data**: Currently using mock shoots data from `UpcomingShootsWidget.svelte`
   - Will integrate with real Supabase data when auth is implemented
   - Same structure applies to Quick Stats (mock for now)

3. **Real-time Updates**: 
   - Connection status badge already updates via store
   - Quick stats will need reactive computation from real data
   - Shoots widget already has mock real-time setup

4. **Performance**:
   - No additional queries (reuses existing widget data)
   - Pure CSS layout (no JavaScript calculations)
   - Gradients are GPU-optimized
   - Should render <100ms after data loads

5. **Accessibility**:
   - All text semantic and readable
   - Icons paired with text labels
   - Good color contrast ratios
   - Ready for screen reader support

