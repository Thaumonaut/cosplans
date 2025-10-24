# UI/UX Design Document: Character-Centric Resource Management

**Feature**: Comprehensive Resource Management System (Spec 048)  
**Target Audience**: Ages 13-40, cosplay community (creators, photographers, commissioners)  
**Design Philosophy**: Fresh + Technical - "Adventurer's Tunic" meets precision planning tools  
**Brand Identity**: Organized adventure, maker precision, hopeful optimism (JetBrains Mono + vibrant green)  
**Aesthetic**: High-low tech (monospace structure + organic creativity), clean palette with energetic green accents  
**Inspiration**: Solarpunk, tech-optimism, outdoor adventure, systematic craftsmanship

---

## Table of Contents

1. [Design Research & Trends](#design-research--trends)
2. [Visual Design System](#visual-design-system)
3. [Component Library](#component-library)
4. [Page Layouts](#page-layouts)
5. [Interaction Patterns](#interaction-patterns)
6. [Animation & Micro-interactions](#animation--micro-interactions)
7. [Mobile Patterns](#mobile-patterns)
8. [Empty States & Onboarding](#empty-states--onboarding)
9. [Accessibility & Performance](#accessibility--performance)

---

## Design Research & Trends

### Modern Planning Tools Analysis

**Notion** (Database & Organization):
- ✅ **Adopt**: Gallery view for photo-heavy resources, inline databases, customizable views
- ✅ **Adopt**: Quick actions bar (Cmd/Ctrl+K), keyboard shortcuts, slash commands
- ✅ **Adopt**: Drag-and-drop for everything (reordering, linking, organizing)
- ❌ **Skip**: Overly complex nested pages (keep hierarchy flat for cosplay context)

**Linear** (Task Management):
- ✅ **Adopt**: Command palette (Cmd+K), keyboard-first navigation, fast shortcuts
- ✅ **Adopt**: Beautiful animations (smooth transitions, spring physics)
- ✅ **Adopt**: Status badges with color coding, priority indicators
- ✅ **Adopt**: Contextual quick actions (hover to reveal edit/delete)

**Airtable** (Data Management):
- ✅ **Adopt**: Multiple view modes (Grid, Gallery, Kanban for resources)
- ✅ **Adopt**: Filtering/grouping controls, saved views
- ✅ **Adopt**: Rich field types (photos, attachments, links, currency)
- ❌ **Skip**: Complex formulas (keep cost calculations transparent and automatic)

**Instagram/TikTok** (Visual Social):
- ✅ **Adopt**: Photo-first design, stories-style progress updates
- ✅ **Adopt**: Swipe gestures, bottom sheet modals, full-screen media viewers
- ✅ **Adopt**: Achievement celebrations (completion animations, confetti)
- ✅ **Adapt**: Sharing features (share character to portfolio, social media export)

### Youth-Oriented Design Trends (2024-2025)

**Glassmorphism** (Frosted Glass Effects):
- Semi-transparent cards with backdrop blur
- Subtle borders, depth via layering
- **Use for**: Modal overlays, dropdown menus, floating action buttons
- **Example**: Character summary card over hero image with frosted glass effect

**Bold Gradients**:
- Vibrant, multi-color gradients (not just 2-color)
- Mesh gradients for backgrounds
- Gradient text for headings
- **Use for**: Status badges, progress bars, hero sections, accent elements
- **Colors**: Bright Green→Light Green→Dark Green for brand, Blue→Cyan for info, Green→Lime for success, Purple→Pink (alternative theme)

**Neumorphism** (Subtle 3D):
- Soft shadows, raised/inset elements
- **Use sparingly**: Buttons, input fields, cards (accessibility concerns)
- **Avoid**: Overuse reduces contrast and accessibility

**Custom Illustrations**:
- Playful, hand-drawn style (not corporate stock photos)
- Character-specific (cosplay-themed: wigs, sewing machines, props)
- **Use for**: Empty states, onboarding, error pages, success celebrations
- **Tone**: Fun, encouraging, slightly quirky

**Dark Mode First**:
- Design in dark mode by default, light mode as variant
- Deep blacks (#0a0a0a) not pure black (#000000)
- High contrast accent colors
- **Why**: Younger audience prefers dark mode, easier on eyes for long planning sessions

**Micro-interactions**:
- Button hover states, ripple effects, loading animations
- Checkbox satisfaction (bouncy check animation)
- Confetti on completion, sparkles on milestones
- **Goal**: Make every interaction feel responsive and delightful

---

## Visual Design System

### Color Palette

**Adventurer's Tunic Color Palette** (Fresh, Clean, Ready for Adventure):

```css
/* Primary Brand Colors (Logo Green - Vibrant & Fresh) */
--brand-primary: #19DA5A;        /* Bright green (logo primary) - Buttons, links, primary actions */
--brand-accent: #21F96A;         /* Light green (logo highlight) - Hover states, active elements */
--brand-dark: #008F31;           /* Deep green (logo shadow) - Dark accents, pressed states */

/* Fresh Green Tones (Supporting Palette) */
--green-50: #F0FDF4;             /* Lightest green - Subtle backgrounds, hover states */
--green-100: #DCFCE7;            /* Very light green - Active states, selected items */
--green-200: #BBF7D0;            /* Light green - Muted accents */
--green-600: #16A34A;            /* Medium green - Secondary actions */
--green-700: #15803D;            /* Dark green - Text on light backgrounds */
--green-900: #14532D;            /* Darkest green - Headers, strong text */

/* Clean Neutrals (Slate Gray Family) */
--slate-50: #F8FAFC;             /* Off-white - Nested backgrounds */
--slate-100: #F1F5F9;            /* Very light gray - Dividers */
--slate-200: #E2E8F0;            /* Light gray - Borders */
--slate-400: #94A3B8;            /* Medium gray - Muted text */
--slate-600: #475569;            /* Dark gray - Secondary text */
--slate-900: #0F172A;            /* Almost black - Primary text */

/* Status Colors (Fresh & Clear) */
--status-success: #19DA5A;       /* Logo green - Completion, success */
--status-info: #3B82F6;          /* Bright blue - Info states */
--status-warning: #F59E0B;       /* Amber - Warnings */
--status-error: #EF4444;         /* Red - Errors */
```

**Design Intent** (Inspired by "Adventurer's Tunic"):
- **Fresh, clean, minimal** - Light backgrounds, crisp typography
- **Vibrant green accents** - Logo green as energetic primary color
- **JetBrains Mono headings** - Technical precision meets adventure
- **"Ready for any quest"** - Optimistic, capable, organized


**Light Mode** (Adventurer's Tunic - Default):
```css
/* Backgrounds (Fresh, Clean Whites & Light Greens) */
--bg-primary: #FFFFFF;           /* Pure white - Main background */
--bg-pattern: #DDF9E7;           /* Light mint green - Page background with subtle radial patterns */
--bg-section: #FFFFFF;           /* White - Section containers */
--bg-card: #F1FFF6;              /* Very light green tint - Cards */
--bg-card-nested: #F8FAFC;       /* Off-white - Nested cards */
--bg-input: #FFFFFF;             /* White - Form inputs */
--bg-hover: #F0FDF4;             /* Lightest green - Hover states */
--bg-active: #DCFCE7;            /* Light green - Active/selected states */

/* Text (Clean, High Contrast) */
--text-primary: #0F172A;         /* Dark slate - Primary text (body text, headings) */
--text-secondary: #475569;       /* Medium slate - Secondary text, labels */
--text-tertiary: #64748B;        /* Light slate - Muted text, hints, placeholders */

/* Borders */
--border-subtle: #F1F5F9;        /* Very light - Subtle dividers */
--border-default: #E2E8F0;       /* Light gray - Default borders */
--border-strong: #CBD5E1;        /* Medium gray - Strong borders */
--border-focus: #19DA5A;         /* BRIGHT logo green - Focus rings! */
```

**Dark Mode** (Night Adventurer - Variant):
```css
/* Backgrounds (Clean Dark with Subtle Green Tint) */
--bg-primary: #0A0E0A;           /* Very dark with green hint */
--bg-secondary: #141814;         /* Slightly elevated */
--bg-tertiary: #1F241F;          /* Cards, modals */
--bg-hover: #2A312A;             /* Hover states */
--bg-active: #354035;            /* Active states */

/* Text (Off-white, High Contrast on Dark) */
--text-primary: #F8FAFC;         /* Off-white - Primary text */
--text-secondary: #CBD5E1;       /* Light gray - Secondary text */
--text-tertiary: #94A3B8;        /* Medium gray - Muted text */

/* Borders */
--border-subtle: #1F241F;        /* Dark - Subtle dividers */
--border-default: #2A312A;       /* Medium dark - Borders */
--border-strong: #354035;        /* Lighter - Strong borders */
--border-focus: #21F96A;         /* BRIGHT logo green (lighter for dark mode)! */
```

### Typography

**Font Stack** (Technical Precision + Clean Readability):
```css
/* Headings (Monospace - Tech Precision) */
--font-display: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace;
/* JetBrains Mono: Clean, readable monospace with excellent weight range (100-800)
   Provides "high-low tech" aesthetic - precise tools for creative craftsmanship
   Pairs beautifully with vibrant green for solarpunk/tech-optimism vibe */

/* Body Text (Sans-Serif - Clean & Readable) */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
/* Inter: Professional, readable, excellent for UI and long-form content */

/* Numbers & Code (Monospace) */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
/* Same as headings for consistency */
```

**Type Scale** (1.25 ratio):
```css
--text-xs: 0.75rem;      /* 12px - hints, labels */
--text-sm: 0.875rem;     /* 14px - secondary text */
--text-base: 1rem;       /* 16px - body text */
--text-lg: 1.125rem;     /* 18px - emphasized text */
--text-xl: 1.25rem;      /* 20px - card titles */
--text-2xl: 1.5rem;      /* 24px - section headings */
--text-3xl: 1.875rem;    /* 30px - page headings */
--text-4xl: 2.25rem;     /* 36px - hero titles */
--text-5xl: 3rem;        /* 48px - marketing/landing */
```

**Font Weights**:
```css
/* Display Headings (JetBrains Mono) */
--weight-bold: 700;           /* Primary - H1, H2, H3 */
--weight-extrabold: 800;      /* Optional - Extra large H1 on landing pages */
--weight-semibold: 600;       /* H4, emphasized headings */
--weight-medium: 500;         /* H5, H6 */

/* Body Text (Inter) */
--weight-normal: 400;         /* Body text, paragraphs */
--weight-medium: 500;         /* Labels, emphasized inline text */
--weight-semibold: 600;       /* Buttons, strong emphasis */

/* Usage Guide:
   - H1: JetBrains Mono Bold (700) - 3rem (48px) - Strong, technical presence
   - H2: JetBrains Mono Bold (700) - 2.25rem (36px) - Section headings
   - H3: JetBrains Mono SemiBold (600) - 1.875rem (30px) - Subsections
   - H4: Inter SemiBold (600) - 1.25rem (20px) - Card titles
   - H5, H6: Inter Medium (500) - 1.125rem/1rem - Small headings
   - Body: Inter Regular (400) - 1rem (16px) - Readable content
   - Buttons: Inter SemiBold (600) - Strong call-to-action
*/
```

**Google Fonts Import**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Why JetBrains Mono for Headings?**
- ✅ **Technical precision** meets creative planning
- ✅ **Monospace adds structure** - Organized, systematic, capable
- ✅ **Excellent readability** at all sizes (designed for code, optimized for screen)
- ✅ **Weight range (100-800)** - Flexible for all heading levels
- ✅ **Modern tech aesthetic** - Pairs with solarpunk/maker culture vibe
- ✅ **Creates contrast** with Inter body text - Clear hierarchy

**Line Heights**:
```css
--leading-tight: 1.25;    /* Headings */
--leading-normal: 1.5;    /* Body text */
--leading-relaxed: 1.75;  /* Long-form content */
```

**Font Hierarchy** (Final):
```css
h1 { 
  font-family: var(--font-display); 
  font-weight: 700; 
  font-size: 3rem;
  letter-spacing: -0.02em;  /* Tight tracking for monospace headings */
}

h2 { 
  font-family: var(--font-display); 
  font-weight: 700; 
  font-size: 2.25rem;
  letter-spacing: -0.01em;
}

h3 { 
  font-family: var(--font-display); 
  font-weight: 600; 
  font-size: 1.875rem;
}

h4, h5, h6 { 
  font-family: var(--font-sans); 
  font-weight: 600; 
  font-size: 1.25rem; /* h4 */
}

body { 
  font-family: var(--font-sans); 
  font-weight: 400; 
  font-size: 1rem;
  line-height: 1.5;
}
```

**Visual Example**:
```
JetBrains Mono Bold (H1):     CHARACTER RESOURCES
JetBrains Mono Bold (H2):     LINKED RESOURCES
JetBrains Mono SemiBold (H3): WIGS & ACCESSORIES
Inter SemiBold (H4):          Details & Information
Inter Regular (Body):         This character has 3 linked wigs and 5 accessories ready for your next photoshoot.
```

**Aesthetic Achieved**:
- 🤖 **Technical precision** (monospace structure)
- 🌿 **Nature harmony** (vibrant green accents)
- 🎯 **Organized capability** (clean, systematic)
- ✨ **Modern optimism** (fresh Adventurer's Tunic palette)

### Spacing System

**8px Base Grid**:
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

**Component Spacing**:
- **Cards**: 24px padding (space-6)
- **Sections**: 48px gap (space-12)
- **Form fields**: 16px gap (space-4)
- **Button groups**: 8px gap (space-2)
- **List items**: 12px gap (space-3)

### Border Radius

**Rounded Corners** (Everywhere!):
```css
--radius-sm: 0.375rem;    /* 6px - badges, pills */
--radius-md: 0.5rem;      /* 8px - buttons, inputs */
--radius-lg: 0.75rem;     /* 12px - cards */
--radius-xl: 1rem;        /* 16px - modals, large cards */
--radius-2xl: 1.5rem;     /* 24px - hero sections */
--radius-full: 9999px;    /* Full circle - avatars, badges */
```

### Shadows & Depth

**Layering System** (z-index):
```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
--z-toast: 1080;
```

**Box Shadows**:
```css
/* Subtle elevation */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Default cards */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Modals, dropdowns */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Popovers, tooltips */
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Dramatic hero sections */
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

---

## Component Library

### Buttons

**Primary Button** (Call-to-action):
```svelte
<button class="btn-primary">
  <Icon name="plus" />
  Create Character
</button>
```
- **Style**: Gradient background (brand-gradient), white text, bold font
- **States**: Hover (scale 1.02, shadow increase), Active (scale 0.98), Loading (spinner + disabled)
- **Sizes**: sm (32px), md (40px), lg (48px)
- **Icons**: Always left-aligned, 4px gap

**Secondary Button** (Common actions):
- **Style**: Transparent bg, border (border-default), text-primary
- **Hover**: bg-hover, border-focus

**Ghost Button** (Subtle actions):
- **Style**: Transparent bg, no border, text-secondary
- **Hover**: bg-hover, text-primary

**Danger Button** (Destructive):
- **Style**: Red bg (accent-rose), white text
- **Usage**: Delete confirmations only

### Cards

**Resource Card** (Gallery/Grid View):
```svelte
<div class="resource-card">
  <img class="card-image" src="{primaryPhoto}" alt="{name}" />
  <div class="card-overlay">
    <StatusBadge status="{status}" />
    <QuickActions items="{[edit, duplicate, delete]}" />
  </div>
  <div class="card-content">
    <h3 class="card-title">{name}</h3>
    <p class="card-meta">{linkedCharacter} • ${cost}</p>
    <ProgressBar value="{completion}" max="100" />
  </div>
</div>
```
- **Dimensions**: 280×360px (desktop), full-width (mobile)
- **Image**: 280×200px, object-cover, rounded-top
- **Hover**: Lift (translate -4px), shadow-lg, overlay appears
- **Click**: Navigate to detail page

**Character Hub Card** (Central Dashboard):
```svelte
<div class="character-hub-card">
  <div class="hero-section" style="background: url({coverImage})">
    <div class="hero-overlay-gradient"></div>
    <img class="character-avatar" src="{avatar}" alt="{name}" />
    <h1 class="character-name">{name}</h1>
    <p class="character-series">{series} ({sourceMediaom})</p>
  </div>
  
  <div class="stats-row">
    <Stat label="Completion" value="{completion}%" color="brand" />
    <Stat label="Budget" value="${spent} / ${budget}" color="{budgetColor}" />
    <Stat label="Days to Event" value="{daysUntil}" color="accent-cyan" />
  </div>
  
  <ResourceGroups>
    <ResourceGroup title="Outfits" count="{outfits.length}" items="{outfits}" />
    <ResourceGroup title="Wigs" count="{wigs.length}" items="{wigs}" />
    <ResourceGroup title="Props" count="{props.length}" items="{props}" />
  </ResourceGroups>
</div>
```
- **Hero**: Full-width, 240px height, gradient overlay (bottom-fade)
- **Avatar**: 120×120px circle, border (4px white), positioned bottom-center over hero
- **Stats**: 3-col grid, glassmorphism cards, icons + numbers
- **Groups**: Collapsible sections, horizontal scroll on mobile

### Forms

**Input Field** (Text, Number):
```svelte
<div class="form-field">
  <label for="wig-name">Wig Name</label>
  <input 
    id="wig-name"
    type="text"
    placeholder="e.g., Long Silver Wig"
    class="input"
  />
  <p class="hint">Give it a memorable name</p>
</div>
```
- **Label**: text-sm, weight-medium, 8px margin-bottom
- **Input**: 48px height, 16px padding, radius-md, border-default
- **Focus**: border-focus, ring (4px, brand-primary with 20% opacity)
- **Error**: border-red, shake animation, error text below
- **Success**: border-green, checkmark icon right

**Select Dropdown** (Single choice):
- **Style**: Same as input, chevron-down icon right
- **Dropdown**: shadow-lg, rounded-lg, max-height (300px), scrollable
- **Options**: 40px height, hover bg-hover, checkmark for selected
- **Search**: Input at top for long lists (>10 items)

**Textarea** (Long text):
- **Min height**: 120px
- **Auto-grow**: Expands as user types (max 400px)
- **Character count**: Bottom-right, muted, shows at 80% of max

**File Upload** (Photos, Receipts):
```svelte
<div class="file-upload">
  <div class="drop-zone">
    <Icon name="image" size="48" />
    <p>Drop photos here or <button class="link">browse</button></p>
    <p class="hint">Up to 10 photos, 5MB each (JPG, PNG)</p>
  </div>
  
  {#if files.length > 0}
    <div class="file-preview-grid">
      {#each files as file}
        <FilePreviewCard {file} on:remove={() => removeFile(file)} />
      {/each}
    </div>
  {/if}
</div>
```
- **Drop zone**: Dashed border, bg-secondary, 200px min-height
- **Drag-over**: border-brand, bg with brand tint (10% opacity)
- **Preview**: Grid (3-col desktop, 2-col tablet, 1-col mobile)
- **Upload progress**: Linear progress bar, percentage text

### Modals

**Inline Modal** (Material Allocation, Resource Linking):
```svelte
<div class="modal-backdrop" on:click={closeModal}>
  <div class="modal" on:click|stopPropagation>
    <header class="modal-header">
      <h2>Add Material to {characterName}</h2>
      <button class="close-btn" aria-label="Close">×</button>
    </header>
    
    <div class="modal-body">
      <MaterialSearch bind:selected={material} />
      <QuantityInput bind:value={quantity} unit={material.unitOfMeasure} />
      <CostPreview material={material} quantity={quantity} />
    </div>
    
    <footer class="modal-footer">
      <Button variant="ghost" on:click={closeModal}>Cancel</Button>
      <Button variant="primary" on:click={saveAllocation}>Add Material</Button>
    </footer>
  </div>
</div>
```
- **Backdrop**: Black with 60% opacity, blur (8px)
- **Modal**: Max-width 600px, rounded-xl, shadow-2xl
- **Animation**: Slide-up + fade-in (300ms ease-out)
- **Mobile**: Full-screen, slide from bottom, swipe-down to dismiss
- **Footer**: Sticky, border-top, actions right-aligned

### Badges & Pills

**Status Badge**:
```svelte
<span class="badge" data-status="{status}">
  <span class="badge-dot"></span>
  {statusLabel}
</span>
```
- **Sizes**: sm (24px height), md (28px), lg (32px)
- **Dot**: 6px circle, status color, left-aligned
- **Text**: text-xs, weight-medium, uppercase
- **Colors**: Map to status-* colors
- **Variant**: Solid (colored bg), Soft (colored bg with 20% opacity), Outline (border only)

**Filter Chip** (Removable):
```svelte
<button class="filter-chip">
  {label}
  <Icon name="x" size="14" on:click={remove} />
</button>
```
- **Style**: bg-secondary, rounded-full, padding (8px 12px)
- **Hover**: bg-hover
- **Remove**: X icon right, 4px gap, hover shows red

### Progress Indicators

**Progress Bar** (Completion, Budget):
```svelte
<div class="progress-bar">
  <div class="progress-fill" style="width: {value}%; background: {color};">
    <span class="progress-label">{value}%</span>
  </div>
</div>
```
- **Height**: 24px (default), 12px (compact), 32px (large)
- **Background**: bg-secondary, rounded-full
- **Fill**: Gradient (based on value: green < 80%, amber 80-99%, red >= 100%)
- **Animation**: Width transition (500ms ease-out), shimmer effect during load
- **Label**: Inside fill (white text) if > 20%, outside (right) if < 20%

**Circular Progress** (Character completion):
```svelte
<svg class="circular-progress" viewBox="0 0 100 100">
  <circle class="track" cx="50" cy="50" r="45" />
  <circle 
    class="fill" 
    cx="50" 
    cy="50" 
    r="45"
    style="stroke-dashoffset: {calculateOffset(value)}"
  />
  <text x="50" y="50" class="percentage">{value}%</text>
</svg>
```
- **Size**: 120px (default), 80px (compact), 160px (hero)
- **Track**: bg-secondary, 8px stroke
- **Fill**: brand-gradient, 8px stroke, rounded ends
- **Animation**: Dash offset transition (1s ease-out), counter animation

**Skeleton Loader** (Loading states):
```svelte
<div class="skeleton-card">
  <div class="skeleton skeleton-image"></div>
  <div class="skeleton skeleton-title"></div>
  <div class="skeleton skeleton-text"></div>
  <div class="skeleton skeleton-text short"></div>
</div>
```
- **Background**: bg-secondary with shimmer gradient
- **Animation**: Shimmer moves left-to-right (1.5s infinite)
- **Shapes**: Match actual content (image, title, text lines)
- **Usage**: Lists, cards, detail pages during load

---

## Page Layouts

### Character Detail (Hub Layout)

**Desktop** (>1024px):
```
+-------------------------------------------+
|  Hero Section (Cover Image + Avatar)     |
|  Character Name, Series, Source Medium   |
+-------------------------------------------+
|                                           |
|  +--------+  +--------+  +--------+       |
|  | Comp   |  | Budget |  | Event  |       |
|  | 65%    |  | $450/  |  | 12 days|       |
|  |        |  | $600   |  |        |       |
|  +--------+  +--------+  +--------+       |
|                                           |
+-------------------------------------------+
|                                           |
|  [Outfits]                    + Add       |
|  +------+  +------+  +------+             |
|  | Card |  | Card |  | Card |             |
|  +------+  +------+  +------+             |
|                                           |
|  [Wigs]                       + Add       |
|  +------+  +------+                       |
|  | Card |  | Card |                       |
|  +------+  +------+                       |
|                                           |
|  [Props & Accessories]        + Add       |
|  +------+  +------+  +------+  +------+   |
|  | Card |  | Card |  | Card |  | Card |   |
|  +------+  +------+  +------+  +------+   |
|                                           |
+-------------------------------------------+
```

**Mobile** (<768px):
```
+----------------------+
| Hero (Compact)       |
| Avatar, Name, Series |
+----------------------+
| Tabs: Stats | Links  |
+----------------------+
|                      |
| [Stats Tab]          |
| Completion: 65%      |
| Budget: $450/$600    |
| Event: 12 days       |
|                      |
| [Or Resources Tab]   |
| ▼ Outfits (3)  + Add |
|   Card               |
|   Card               |
|   Card               |
|                      |
| ▼ Wigs (2)     + Add |
|   Card               |
|   Card               |
|                      |
+----------------------+
```

### Resource Overview (List/Grid View)

**View Switcher**: List | Grid | Gallery (User preference, saved)

**Grid View** (Default):
```
+-------------------------------------------+
| Search: [______________] [Filter] [Sort]  |
+-------------------------------------------+
| Active Filters: [Status: Planned ×]       |
|                 [Character: Saber ×]       |
+-------------------------------------------+
|                                           |
|  +------+  +------+  +------+  +------+   |
|  | Card |  | Card |  | Card |  | Card |   |
|  +------+  +------+  +------+  +------+   |
|                                           |
|  +------+  +------+  +------+  +------+   |
|  | Card |  | Card |  | Card |  | Card |   |
|  +------+  +------+  +------+  +------+   |
|                                           |
+-------------------------------------------+
| Showing 8 of 24 wigs     [Load More]      |
+-------------------------------------------+
```
- **Grid**: 4-col (desktop), 2-col (tablet), 1-col (mobile)
- **Card**: 280×360px, hover lift, quick actions overlay
- **Pagination**: Infinite scroll (load more on bottom reach) or "Load More" button

**List View** (Dense):
```
+-------------------------------------------+
| ☑ Name           | Character | Cost    | %|
+-------------------------------------------+
| ☐ Long Silver    | Saber     | $75     |█|
| ☐ Short Pink     | Sakura    | $45     |█|
| ☐ Spiky Blonde   | Cloud     | $120    |█|
+-------------------------------------------+
```
- **Rows**: 56px height, hover bg-hover
- **Checkbox**: Bulk actions (delete, export, change status)
- **Sort**: Click column header to sort
- **Context Menu**: Right-click row for actions

### Resource Detail (Tabbed Content)

**Tabs**: Details | Tasks | Materials | Photos | History

**Details Tab** (Default):
```
+-------------------------------------------+
| [Photo Gallery]                           |
| Primary photo (large) + thumbnail strip   |
+-------------------------------------------+
|                                           |
| Name: [Inline edit field]                 |
| Status: [Dropdown]                        |
| Character: [Link picker]                  |
| Cost: $[Input]                            |
| Vendor: [Autocomplete]                    |
|                                           |
| ▼ Advanced Fields                         |
|   Storage Location: [Input]               |
|   Purchase Date: [Date picker]            |
|   Notes: [Textarea]                       |
|                                           |
+-------------------------------------------+
| [Save Changes]  [Cancel]  [Delete]        |
+-------------------------------------------+
```
- **Inline editing**: Click field to edit, auto-save on blur
- **Advanced**: Collapsed by default, toggle to expand
- **Actions**: Sticky footer on mobile, bottom-right on desktop

**Tasks Tab**:
```
+-------------------------------------------+
| Progress: ████░░░░░░ 4 of 10 tasks (40%) |
+-------------------------------------------+
|                                           |
| ☐ Cut and style bangs       Due: 3 days  |
| ☑ Wash and condition                      |
| ☐ Add wefts to back         Overdue!     |
| ☐ Trim to length                          |
|                                           |
| + Add task...                             |
+-------------------------------------------+
```
- **Drag handles**: Reorder tasks
- **Inline add**: Click "+ Add task" to add inline input
- **Badges**: Due dates (yellow warning if < 7 days, red if overdue)

---

## Interaction Patterns

### Quick Actions

**Hover Overlay** (Cards):
- Hover card → overlay fades in (200ms)
- Shows: Edit (pencil), Duplicate (copy), Delete (trash)
- Icons: 40×40px, rounded-md, bg with blur
- Click icon → immediate action or confirmation modal

**Swipe Actions** (Mobile):
- Swipe left → [Edit | Delete]
- Swipe right → [Mark Complete | Archive]
- Colors: Edit (blue), Delete (red), Complete (green)
- Threshold: 40% of card width triggers action

**Long-Press Menu** (Mobile):
```
[===================]
| Edit              |
| Duplicate         |
| Move to Character |
| Export            |
| ──────────────    |
| Delete            |
[===================]
```
- Trigger: 500ms press
- Menu: Bottom sheet on mobile, popover on desktop
- Haptic feedback on trigger (mobile)

### Drag & Drop

**Task Reordering**:
- Grab handle: 6 dots icon, left of task
- Drag: Task card lifts (shadow-lg), other tasks shift
- Drop: Smooth animation to new position, auto-save

**Photo Gallery Reordering**:
- Drag thumbnail: Enlarges (scale 1.1), follows cursor
- Drop zones: Other photos highlight border-brand
- Primary photo: Star icon, always first position

**Material Allocation** (Advanced):
- Drag material from inventory → drop on character/outfit card
- Shows: Modal with quantity input
- Feedback: Material card shows "Used: X units on Character"

### Search & Filter

**Command Palette** (Cmd/Ctrl+K):
```
+-------------------------------------------+
| > Search characters, resources...         |
+-------------------------------------------+
| Recent                                    |
|   Saber (Character)                       |
|   Long Silver Wig                         |
|                                           |
| Commands                                  |
|   Create Character                        |
|   Create Wig                              |
|   View Budget                             |
|                                           |
| Quick Links                               |
|   Materials Inventory                     |
|   Upcoming Events                         |
+-------------------------------------------+
```
- **Shortcut**: Cmd+K (Mac), Ctrl+K (Windows/Linux)
- **Search**: Fuzzy search across all resources
- **Navigate**: Arrow keys, Enter to select
- **Close**: Escape

**Faceted Filters** (Resource Lists):
```
Filters: [Status ▼] [Character ▼] [Price Range ▼] [Clear All]

Status ▼
├─ ☑ Planned (12)
├─ ☑ In Progress (5)
├─ ☐ Completed (24)
└─ ☐ On Hold (3)
```
- **Dropdown**: Multi-select checkboxes
- **Counts**: Show result count per option
- **Apply**: Real-time (no "Apply" button needed)
- **Chips**: Active filters shown as removable chips

---

## Animation & Micro-interactions

### Page Transitions

**Route Changes**:
- Fade out current page (150ms)
- Fade in new page (200ms)
- Delay: 50ms between (prevents flash)

**Modal Open/Close**:
```css
/* Open */
@keyframes modal-open {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
/* Duration: 300ms, easing: cubic-bezier(0.16, 1, 0.3, 1) */
```

### Micro-interactions

**Button Press**:
```css
.btn:active {
  transform: scale(0.98);
  transition: transform 100ms ease-out;
}
```

**Checkbox Check**:
```css
@keyframes check {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
/* Duration: 400ms, easing: cubic-bezier(0.68, -0.55, 0.27, 1.55) */
```

**Completion Celebration**:
- When character completion hits 100%:
  1. Confetti explosion (3s)
  2. Progress bar fills with shimmer
  3. Toast: "🎉 {Character Name} is complete!"
  4. Optional: Sound effect (toggle in settings)

**Photo Upload Success**:
- Checkmark appears (scale + rotate animation)
- Photo card border pulses green (2 pulses)
- Thumbnail fades in (300ms)

### Loading States

**Shimmer Effect**:
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 0%,
    var(--bg-hover) 50%,
    var(--bg-secondary) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.5s infinite;
}
```

**Progressive Loading** (Character Detail):
1. Show skeleton for hero section (200ms)
2. Load hero image + stats (fade in)
3. Load resource cards one by one (stagger 50ms each)

---

## Mobile Patterns

### Bottom Navigation (< 768px)

```
+----------------------+
|                      |
|   [Content]          |
|                      |
|                      |
+----------------------+
| 🏠    🎭    ➕   📦   |
| Home  Char  New  Inv |
+----------------------+
```
- **Tabs**: 5 max (Home, Characters, New, Materials, Profile)
- **Icons**: 24×24px, active tab has text label
- **Indicator**: Active tab has gradient underline (2px)
- **Haptic**: Tap feedback on selection

### Swipe Gestures

**List Items**:
- Swipe right: Quick complete (green bg reveals)
- Swipe left: Quick delete (red bg reveals)
- Threshold: 40% swipe triggers action
- Snap back: If < 40%, animates back to start

**Photo Gallery**:
- Swipe horizontal: Navigate between photos
- Pinch: Zoom in/out
- Double-tap: Toggle zoom

### Touch-Friendly Targets

**Minimum Sizes**:
- Buttons: 44×44px (iOS standard)
- List items: 56px height
- Form fields: 48px height
- Icon buttons: 40×40px

**Spacing**:
- Between targets: 8px minimum
- Edge padding: 16px (comfortable thumb reach)

---

## Empty States & Onboarding

### Empty States (Illustrated)

**No Characters Yet**:
```
[Illustration: Cute cosplay character with question mark]

"Ready to bring your characters to life?"

Create your first character to start planning your
next cosplay project.

[Create Character] [Browse Examples]
```

**No Materials**:
```
[Illustration: Empty fabric rolls and foam sheets]

"Your materials inventory is empty"

Add materials as you buy them to track costs and
know when you're running low.

[Add Material] [See Tutorial]
```

**Design Style**:
- Flat illustration, 2-color gradient
- Playful, not corporate
- 200×200px illustrations
- Centered layout with max-width 400px

### Onboarding (First-Time User)

**Step 1: Welcome**:
- Hero: Gradient background, app logo, tagline
- CTA: "Get Started" → Next

**Step 2: Choose Mode**:
- Personal Cosplayer: "Track my own projects"
- Commissioner: "Manage client commissions"
- Both: "I do both!"

**Step 3: Create First Character**:
- Quick form: Name, Series, Photo (optional)
- Skip option: "I'll do this later"

**Step 4: Tour (Tooltips)**:
- Highlight key features (4-5 tooltips)
- Dismissible: "Skip Tour" button
- Completion: "Start Planning!" → Dashboard

---

## Accessibility & Performance

### Keyboard Navigation

**Shortcuts** (Document in Help):
- `Cmd/Ctrl+K`: Command palette
- `Cmd/Ctrl+N`: New character
- `Cmd/Ctrl+S`: Save current page
- `Escape`: Close modal/popover
- `Tab`: Navigate form fields
- `Arrow keys`: Navigate lists
- `/`: Focus search input

### Screen Readers

**ARIA Labels** (Examples):
```html
<button aria-label="Delete wig: Long Silver Wig">
  <TrashIcon />
</button>

<div role="status" aria-live="polite">
  3 of 10 tasks complete
</div>

<nav aria-label="Main navigation">
  <!-- sidebar nav -->
</nav>
```

### Color Contrast

**WCAG AA Compliance**:
- Text on backgrounds: 4.5:1 minimum
- Large text (>= 18px): 3:1 minimum
- Icons: Paired with text labels
- Status: Not color-only (icons + text)

**Dark Mode Contrast**:
- Primary text on bg-primary: 15:1 (WCAG AAA)
- Secondary text on bg-primary: 7:1
- Border colors: Subtle but visible (2:1 minimum)

### Performance Budgets

**Page Load**:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s

**Image Optimization**:
- Compress on upload (80% quality)
- Generate thumbnails (200×200px)
- Lazy load below fold
- WebP format with JPG fallback

**Code Splitting**:
- Route-based: Load page JS on demand
- Component-based: Lazy load heavy components (photo editor, PDF export)
- Defer non-critical: Analytics, chat widgets

---

## Implementation Priorities

**Phase 1 (MVP - Core Experience)**:
1. ✅ Visual design system (colors, typography, spacing)
2. ✅ Card components (resource cards, character hub card)
3. ✅ Form components (inputs, dropdowns, file upload)
4. ✅ Basic layouts (overview grids, detail pages)
5. ✅ Mobile responsiveness (bottom nav, touch targets)

**Phase 2 (Enhanced Interactions)**:
1. ⏭️ Micro-interactions (hover states, button animations)
2. ⏭️ Skeleton loaders and loading states
3. ⏭️ Drag-and-drop (task reordering, photo gallery)
4. ⏭️ Swipe gestures (mobile cards)
5. ⏭️ Command palette (Cmd+K)

**Phase 3 (Delight & Polish)**:
1. ⏭️ Custom illustrations for empty states
2. ⏭️ Completion celebrations (confetti, animations)
3. ⏭️ Glassmorphism effects (modals, overlays)
4. ⏭️ Themed customization (user-selected accent colors)
5. ⏭️ Sound effects (optional, toggle in settings)

---

## Design References

**Inspiration Sources**:
- **Notion**: Database views, inline editing, keyboard shortcuts
- **Linear**: Command palette, beautiful animations, status system
- **Airtable**: Multiple views, filtering, rich data types
- **Figma**: Collaborative editing, real-time updates, component variants
- **Instagram**: Photo galleries, stories, swipe gestures
- **Discord**: Glassmorphism, dark mode, modern messaging UI
- **Superhuman**: Keyboard-first, speed, micro-interactions

**Cosplay-Specific**:
- **CosplayLab** (Japan): Photo-forward galleries, event tracking
- **ACParadise**: Portfolio showcases, costume databases
- **TheRPF** Forums: Community-driven project logs
- **Pinterest**: Visual discovery, mood boards, inspiration feeds

---

## Next Steps

1. **Create Figma/Design File**: High-fidelity mockups for key pages
2. **Build Component Library**: Implement design system in SvelteKit
3. **User Testing**: Show designs to cosplay community for feedback
4. **Iterate**: Refine based on feedback before full implementation

**Design File Structure** (Figma):
```
📁 Cosplans Design System
  ├─ 🎨 Colors & Typography
  ├─ 🧩 Components (Buttons, Inputs, Cards)
  ├─ 📱 Mobile Screens
  ├─ 💻 Desktop Screens
  ├─ ✨ Animations & Interactions
  └─ 🎭 Empty States & Illustrations
```

---

**End of UI/UX Design Document**

**Total**: 32 UI/UX FRs (FR-149 to FR-180) + Comprehensive design system + Component library + Interaction patterns + Mobile-first approach + Accessibility standards + Youth-oriented aesthetics

