# UpcomingShootsWidget - Visual Layout Reference

## Widget Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    LOADING STATE                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  [████████████] (Next Shoot skeleton)                  │ │
│  │  [████] [████] [████] [████] [████] [████] [████]      │ │
│  │  (Week calendar 7-column skeleton)                     │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    EMPTY STATE                               │
│  📋                                                          │
│  No shoots scheduled                                        │
│  Your calendar is clear. Schedule your first shoot!         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   ERROR STATE                                │
│  ⚠️                                                          │
│  Failed to load upcoming shoots                             │
│  [Retry]                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              NORMAL STATE - SECTION 1                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ▓▓▓▓▓ (Blue Gradient)                                   │ │
│ │ Next Scheduled Shoot                                   │ │
│ │ Convention Shoot                                       │ │
│ │ Oct 25, 2025 at 2:00 PM                    [Upcoming] │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│              NORMAL STATE - SECTION 2                        │
│  This Week                                                   │
│  ┌────┬────┬────┬────┬────┬────┬────┐                       │
│  │Mon │Tue │Wed │Thu │Fri │Sat │Sun │  (Day columns)       │
│  │ 18 │ 19 │ 20 │ 21 │ 22 │ 23 │ 24 │                      │
│  │ 1s │    │    │ 2s │    │ 1s │    │  (Shoot counts)      │
│  └────┴────┴────┴────┴────┴────┴────┘                       │
│   (Today: Blue BG with white text)                           │
│   (Days with shoots: Light blue BG)                          │
│                                                              │
│              NORMAL STATE - SECTION 3                        │
│  Upcoming Shoots                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ┌────────────┐  ┌──────────────────────────────────────┐││
│  │ │            │  │ Convention Shoot        [Upcoming]   │││
│  │ │  [Image]   │  │ Sailor Moon, Tuxedo Mask             │││
│  │ │  132×132px │  │                                      │││
│  │ │ (or📷 icon) │  │ 📅 Oct 25, 2025 at 2:00 PM         │││
│  │ │            │  │ 📍 Convention Center Hall A         │││
│  │ └────────────┘  │                                      │││
│  │                 │ 📷 Alex Chen      👥 4 members      │││
│  │                 └──────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ┌────────────┐  ┌──────────────────────────────────────┐││
│  │ │            │  │ Studio Session          [Planning]   │││
│  │ │  [Image]   │  │ Asuka Langley                        │││
│  │ │  132×132px │  │                                      │││
│  │ │ (or📷 icon) │  │ 📅 Nov 2, 2025 at 10:00 AM         │││
│  │ │            │  │ 📍 Downtown Studio                 │││
│  │ └────────────┘  │                                      │││
│  │                 │ 📷 Sarah Kim       👥 6 members     │││
│  │                 └──────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ┌────────────┐  ┌──────────────────────────────────────┐││
│  │ │            │  │ Outdoor Cosplay      [Confirmed]    │││
│  │ │  [Image]   │  │ Nezuko, Tanjiro                      │││
│  │ │  132×132px │  │                                      │││
│  │ │ (or📷 icon) │  │ 📅 Nov 15, 2025 at 9:00 AM         │││
│  │ │            │  │ 📍 Cherry Blossom Park             │││
│  │ └────────────┘  │                                      │││
│  │                 │ 📷 Mike Rodriguez  👥 3 members    │││
│  │                 └──────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  View all upcoming shoots →                                │
└─────────────────────────────────────────────────────────────┘
```

## Card Detail Layout

### Shoot Card Anatomy

```
┌─ Card (flex, gap-4, p-4) ─────────────────────────────────┐
│                                                            │
│ ┌─ Image ─┐  ┌─ Details (flex-col, justify-between) ───┐ │
│ │          │  │                                        │ │
│ │  Image   │  │  ┌─ Header ──────────────────────────┐ │ │
│ │  132×132 │  │  │ Title              [Status Badge]  │ │ │
│ │          │  │  │ Character Names                    │ │ │
│ │    or    │  │  └────────────────────────────────────┘ │ │
│ │   📷     │  │                                        │ │
│ │  Icon    │  │  ┌─ Info Group ──────────────────────┐ │ │
│ │          │  │  │ 📅 Date at Time                   │ │ │
│ │          │  │  │ 📍 Location                       │ │ │
│ │          │  │  └────────────────────────────────────┘ │ │
│ └──────────┘  │                                        │ │
│               │  ┌─ Footer ───────────────────────────┐ │ │
│               │  │ 📷 Photographer    👥 Team Count  │ │ │
│               │  └────────────────────────────────────┘ │ │
│               └────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Responsive Behavior

### Desktop (Current)

- Image: 132×132px
- Card: Full width container
- Week calendar: 7 columns visible
- Layout: Horizontal flex (image left, details right)

### Mobile (Future Enhancement)

- Image: May reduce to 100×100px or 80×80px
- Card: Stack option or smaller image
- Week calendar: Scrollable horizontal
- Layout: Could stack to vertical if needed

## Color Scheme

| Element           | Color Class                   | Usage                  |
| ----------------- | ----------------------------- | ---------------------- |
| Next Shoot Bar    | `from-blue-50 to-blue-100`    | Gradient background    |
| Next Shoot Border | `border-blue-200`             | Container border       |
| Today in Calendar | `bg-blue-600 text-white`      | Current date highlight |
| Days with Shoots  | `bg-blue-100 border-blue-400` | Busy days              |
| Empty Days        | `bg-gray-100 text-gray-600`   | Free days              |
| Card Hover        | `border-blue-400`             | Interactive state      |
| Card Background   | `bg-white`                    | Default                |
| Icon Color        | `text-gray-500`               | Info icons             |
| Label Text        | `text-gray-600`               | Category labels        |
| Detail Text       | `text-gray-700`               | Information            |

## Typography

| Element          | Classes                                       | Purpose                |
| ---------------- | --------------------------------------------- | ---------------------- |
| Next Shoot Label | `text-xs font-medium uppercase tracking-wide` | Category label         |
| Next Shoot Title | `text-lg font-semibold`                       | Primary attention      |
| Week Label       | `text-xs font-medium uppercase`               | Section header         |
| Day Name         | `text-xs font-semibold`                       | Calendar column header |
| Day Number       | `text-lg font-bold`                           | Calendar date          |
| Shoot Count      | `text-xs font-medium`                         | Calendar info          |
| Card Title       | `text-sm font-semibold`                       | Shoot name             |
| Character Names  | `text-xs text-gray-600`                       | Supporting info        |
| Detail Text      | `text-xs`                                     | Date, location, people |
| Link Text        | `text-xs font-medium`                         | "View all" action      |

## Interaction States

### Hover (Cards)

- Border: Gray-200 → Blue-400
- Shadow: `shadow-sm` → `shadow-md`
- Transition: `transition-all`
- Cursor: `cursor-pointer` removed (better semantics)

### Week Calendar Days

- Hover empty day: `hover:bg-gray-200`
- Today: Always highlighted blue
- With shoots: Border emphasis

### Links

- Color: `text-blue-600`
- Hover: `hover:text-blue-800`
- Underline on hover (browser default)

## Spacing

| Element           | Utility             | Value                         |
| ----------------- | ------------------- | ----------------------------- |
| Widget Container  | `space-y-6`         | 1.5rem between sections       |
| Cards List        | `space-y-3`         | 0.75rem between cards         |
| Card Padding      | `p-4`               | 1rem all sides                |
| Card Gap          | `gap-4`             | 1rem between image/details    |
| Week Calendar Gap | `gap-2`             | 0.5rem between days           |
| Next Shoot Gap    | `gap-4` within flex | 1rem sections                 |
| Day Box Padding   | `p-3`               | 0.75rem                       |
| Header Gap        | `gap-2`             | 0.5rem between title/badge    |
| Footer Gap        | `gap-1`             | 0.25rem between icon/text     |
| Border Top        | `pt-2`              | 0.5rem padding before divider |

## Icons Used

```
📋 Clipboard - Empty state (32×32px, text-gray-400)
⚠️  Alert - Error state (32×32px, text-red-500)
📷 Camera - Image placeholder (32×32px, text-gray-400)
🗓️  Calendar - Date/time info (14×14px, text-gray-500)
📍 Location - Address info (14×14px, text-gray-500)
👤 Person - Photographer (12×12px, text-gray-500)
👥 People - Team count (12×12px, text-gray-500)
```

All SVG icons from heroicons inline, no external icon library needed.

---

**Last Updated**: 2025-10-16
**Widget Location**: `/src/lib/components/dashboard/UpcomingShootsWidget.svelte`
