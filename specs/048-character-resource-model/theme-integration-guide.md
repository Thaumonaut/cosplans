# UI Theme Integration Guide

**Feature**: Comprehensive Resource Management System (Spec 048)  
**Purpose**: Ensure all new UI components work seamlessly with the existing theme system

---

## Overview

Cosplans has a sophisticated **CSS custom properties** (CSS variables) based theming system with:
- **8 built-in themes**: 4 light modes (default, green, warm, cool) + 4 dark modes (default, cozy, cosmic, fantasy)
- **Custom theme support**: Users can create their own themes via theme builder
- **~40 CSS variables**: Covering backgrounds, borders, sidebar, header, status colors, interactions

**CRITICAL REQUIREMENT**: All new components MUST use CSS custom properties (`var(--theme-*)`) for colors, backgrounds, and borders. **NO hardcoded hex colors (#8B5CF6, #EC4899, etc.)** except in theme definition files.

---

## Theme Variable Reference

### Core Colors

```css
/* Backgrounds */
--theme-background          /* Page/app background */
--theme-background-pattern  /* Optional gradient/pattern overlay */
--theme-foreground          /* Primary text color */
--theme-section-bg          /* Section containers */
--theme-card-bg             /* Card backgrounds (often with opacity for glassmorphism) */
--theme-card-nested         /* Nested cards */
--theme-content-bg          /* Main content areas */
--theme-input-bg            /* Form inputs */
```

### Borders & Dividers

```css
--theme-border              /* Default borders */
--theme-border-subtle       /* Light dividers */
--theme-border-strong       /* Emphasized borders */
```

### Sidebar

```css
--theme-sidebar-bg          /* Sidebar background */
--theme-sidebar-text        /* Sidebar text */
--theme-sidebar-muted       /* Muted sidebar text (icons, secondary) */
--theme-sidebar-accent      /* Accent color for active items */
--theme-sidebar-hover       /* Hover state background */
--theme-sidebar-active      /* Active state background */
--theme-sidebar-border      /* Sidebar borders */
--theme-sidebar-shadow      /* Sidebar shadow (elevation) */
```

### Header/Top Bar

```css
--theme-header-bg           /* Header background */
--theme-header-text         /* Header text */
--theme-header-muted        /* Muted header text */
--theme-header-hover        /* Hover state */
--theme-header-active       /* Active state */
--theme-header-shadow       /* Header shadow */
```

### Interactive States

```css
--theme-hover               /* Generic hover color */
--theme-active              /* Generic active color */
--theme-focus               /* Focus ring color */
```

### Brand Colors

```css
--theme-primary             /* Primary brand color (e.g., purple #8B5CF6 in light-default) */
--theme-primary-hover       /* Primary hover state */
--theme-accent              /* Accent color (e.g., pink #EC4899 in light-default) */
--theme-accent-hover        /* Accent hover state */
```

### Status Colors

```css
--theme-success             /* Success (green) */
--theme-error               /* Error (red) */
--theme-warning             /* Warning (amber/yellow) */
--theme-info                /* Info (blue) */
```

---

## Component Styling Patterns

### ✅ Buttons (Primary, Secondary, Ghost)

**Primary Button** (Call-to-action):
```svelte
<button class="btn-primary">
  Create Character
</button>

<style>
  .btn-primary {
    background: var(--theme-primary);
    color: var(--theme-foreground);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 150ms ease;
  }
  
  .btn-primary:hover {
    background: var(--theme-primary-hover);
    transform: scale(1.02);
  }
  
  .btn-primary:active {
    transform: scale(0.98);
  }
  
  /* ✅ GREAT: Gradient using theme variables */
  .btn-primary.gradient {
    background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent));
  }
</style>
```

**Secondary Button**:
```svelte
<button class="btn-secondary">
  Cancel
</button>

<style>
  .btn-secondary {
    background: transparent;
    color: var(--theme-foreground);
    border: 1px solid var(--theme-border);
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    transition: all 150ms ease;
  }
  
  .btn-secondary:hover {
    background: var(--theme-hover);
    border-color: var(--theme-focus);
  }
</style>
```

### ✅ Cards (Resource Cards, Detail Pages)

**Card Component**:
```svelte
<div class="resource-card">
  <div class="card-header">
    <h3>{name}</h3>
  </div>
  <div class="card-body">
    <p>{description}</p>
  </div>
</div>

<style>
  .resource-card {
    background: var(--theme-card-bg);
    border: 1px solid var(--theme-border);
    border-radius: 0.75rem; /* 12px */
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    transition: all 200ms ease;
  }
  
  .resource-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }
  
  .card-header h3 {
    color: var(--theme-foreground);
    margin: 0;
  }
  
  .card-body p {
    color: var(--theme-sidebar-muted); /* Muted text for secondary content */
  }
</style>
```

**Glassmorphism Card** (frosted glass effect):
```svelte
<div class="glass-card">
  <p>Content with glassmorphism</p>
</div>

<style>
  .glass-card {
    /* Use theme card-bg which already has opacity in most themes */
    background: var(--theme-card-bg);
    border: 1px solid var(--theme-border-subtle);
    border-radius: 1rem;
    padding: 1.5rem;
    
    /* Add backdrop blur for glassmorphism effect */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
</style>
```

### ✅ Status Badges

```svelte
<span class="badge" data-status={status}>
  <span class="badge-dot"></span>
  {statusLabel}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
  }
  
  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  
  /* Map status to theme colors */
  .badge[data-status="completed"] {
    background: color-mix(in srgb, var(--theme-success) 20%, transparent);
    color: var(--theme-success);
  }
  
  .badge[data-status="completed"] .badge-dot {
    background: var(--theme-success);
  }
  
  .badge[data-status="in-progress"] {
    background: color-mix(in srgb, var(--theme-warning) 20%, transparent);
    color: var(--theme-warning);
  }
  
  .badge[data-status="in-progress"] .badge-dot {
    background: var(--theme-warning);
  }
  
  .badge[data-status="planned"] {
    background: color-mix(in srgb, var(--theme-info) 20%, transparent);
    color: var(--theme-info);
  }
  
  .badge[data-status="planned"] .badge-dot {
    background: var(--theme-info);
  }
</style>
```

### ✅ Progress Bars

```svelte
<div class="progress-bar">
  <div class="progress-fill" style="width: {value}%;">
    <span class="progress-label">{value}%</span>
  </div>
</div>

<style>
  .progress-bar {
    width: 100%;
    height: 24px;
    background: var(--theme-section-bg);
    border-radius: 9999px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    /* Gradient from primary to accent */
    background: linear-gradient(90deg, var(--theme-primary), var(--theme-accent));
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 0.75rem;
    transition: width 500ms ease-out;
  }
  
  .progress-label {
    color: var(--theme-foreground);
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  /* Budget warning state */
  .progress-fill.warning {
    background: var(--theme-warning);
  }
  
  .progress-fill.exceeded {
    background: var(--theme-error);
  }
</style>
```

### ✅ Form Inputs

```svelte
<div class="form-field">
  <label for="character-name">Character Name</label>
  <input 
    id="character-name"
    type="text"
    placeholder="e.g., Saber"
  />
</div>

<style>
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  label {
    color: var(--theme-foreground);
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  input {
    background: var(--theme-input-bg);
    color: var(--theme-foreground);
    border: 1px solid var(--theme-border);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    transition: all 150ms ease;
  }
  
  input::placeholder {
    color: var(--theme-sidebar-muted);
  }
  
  input:focus {
    outline: none;
    border-color: var(--theme-focus);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--theme-focus) 20%, transparent);
  }
  
  input:hover:not(:focus) {
    border-color: var(--theme-border-strong);
  }
</style>
```

### ✅ Modals & Overlays

```svelte
<div class="modal-backdrop" on:click={close}>
  <div class="modal" on:click|stopPropagation>
    <header class="modal-header">
      <h2>Add Material</h2>
      <button class="close-btn">×</button>
    </header>
    <div class="modal-body">
      <!-- Content -->
    </div>
    <footer class="modal-footer">
      <button class="btn-secondary">Cancel</button>
      <button class="btn-primary">Save</button>
    </footer>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
  }
  
  .modal {
    background: var(--theme-content-bg);
    border: 1px solid var(--theme-border);
    border-radius: 1rem;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--theme-border);
  }
  
  .modal-header h2 {
    color: var(--theme-foreground);
    margin: 0;
  }
  
  .close-btn {
    background: transparent;
    border: none;
    color: var(--theme-sidebar-muted);
    font-size: 2rem;
    cursor: pointer;
  }
  
  .close-btn:hover {
    color: var(--theme-foreground);
  }
  
  .modal-body {
    padding: 1.5rem;
    color: var(--theme-foreground);
  }
  
  .modal-footer {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    padding: 1.5rem;
    border-top: 1px solid var(--theme-border);
    background: var(--theme-section-bg);
  }
</style>
```

---

## Testing Across Themes

### Manual Testing Checklist

When creating a new component, test it across all 8 themes:

**Light Themes**:
- [ ] light-default (purple-pink gradient)
- [ ] light-green (Adventurer's Tunic)
- [ ] light-warm (Mystic Sands)
- [ ] light-cool (Crystal Waters)

**Dark Themes**:
- [ ] dark-default (cyan accents)
- [ ] dark-cozy (Cozy Burrow)
- [ ] dark-cosmic (Galactic Sea)
- [ ] dark-fantasy (Tarnished Realm)

### Testing Procedure

1. Open the component page in your browser
2. Open DevTools → Console
3. Run this snippet to cycle through themes:

```javascript
const themes = [
  'light-default', 'light-green', 'light-warm', 'light-cool',
  'dark-default', 'dark-cozy', 'dark-cosmic', 'dark-fantasy'
];

let index = 0;
setInterval(() => {
  document.documentElement.dataset.theme = themes[index];
  console.log('Theme:', themes[index]);
  index = (index + 1) % themes.length;
}, 2000);
```

4. Verify:
   - Text is readable (sufficient contrast)
   - Borders are visible
   - Hover states are clear
   - Focus states are obvious
   - Colors adapt to theme (no hardcoded values showing through)

---

## Common Mistakes ❌

### 1. Hardcoded Hex Colors

```svelte
<!-- ❌ BAD: Will look wrong in non-default themes -->
<button style="background: #8B5CF6; color: white;">Save</button>

<!-- ✅ GOOD: Uses theme variables -->
<button style="background: var(--theme-primary); color: var(--theme-foreground);">Save</button>
```

### 2. Theme-Specific Logic

```svelte
<!-- ❌ BAD: Checking theme mode in component logic -->
{#if $theme.mode === 'dark'}
  <div class="dark-only-content"></div>
{:else}
  <div class="light-only-content"></div>
{/if}

<!-- ✅ GOOD: Use CSS variables that adapt automatically -->
<div style="color: var(--theme-foreground); background: var(--theme-background);">
  Content works in any theme
</div>
```

### 3. Ignoring Existing Variables

```svelte
<!-- ❌ BAD: Creating custom CSS variables -->
<style>
  :root {
    --my-custom-purple: #8B5CF6;
  }
  .card {
    background: var(--my-custom-purple);
  }
</style>

<!-- ✅ GOOD: Use existing theme variables -->
<style>
  .card {
    background: var(--theme-primary);
  }
</style>
```

### 4. Missing Hover/Focus States

```svelte
<!-- ❌ BAD: No hover state -->
<button style="background: var(--theme-primary);">Click</button>

<!-- ✅ GOOD: Hover and focus states -->
<button class="btn">Click</button>

<style>
  .btn {
    background: var(--theme-primary);
    transition: all 150ms ease;
  }
  
  .btn:hover {
    background: var(--theme-primary-hover);
  }
  
  .btn:focus {
    outline: none;
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--theme-focus) 20%, transparent);
  }
</style>
```

---

## Advanced Patterns

### Color Mixing (Modern CSS)

```css
/* Create lighter/darker variants using color-mix() */
.badge {
  /* 20% opacity of theme color */
  background: color-mix(in srgb, var(--theme-success) 20%, transparent);
}

.hover-state {
  /* Mix primary color with white for lighter shade */
  background: color-mix(in srgb, var(--theme-primary) 80%, white 20%);
}
```

### Multi-Color Gradients

```css
/* Gradient from primary → accent → success */
.progress-gradient {
  background: linear-gradient(
    135deg,
    var(--theme-primary) 0%,
    var(--theme-accent) 50%,
    var(--theme-success) 100%
  );
}
```

### Dynamic Gradients Based on Value

```svelte
<script>
  let completion = 75;
  
  // Green if < 80%, amber if 80-99%, red if >= 100%
  $: progressColor = completion < 80 
    ? 'var(--theme-success)'
    : completion < 100
      ? 'var(--theme-warning)'
      : 'var(--theme-error)';
</script>

<div class="progress-bar">
  <div 
    class="progress-fill" 
    style="width: {completion}%; background: {progressColor};"
  ></div>
</div>
```

---

## Quick Reference

### Most Common Variables

For 90% of components, you'll use these:

```css
/* Backgrounds */
var(--theme-card-bg)        /* Cards, panels */
var(--theme-section-bg)     /* Sections, containers */
var(--theme-input-bg)       /* Form inputs */

/* Text */
var(--theme-foreground)     /* Primary text */
var(--theme-sidebar-muted)  /* Secondary text */

/* Borders */
var(--theme-border)         /* Default borders */
var(--theme-border-subtle)  /* Light dividers */

/* Interactive */
var(--theme-primary)        /* Primary actions */
var(--theme-primary-hover)  /* Primary hover */
var(--theme-focus)          /* Focus rings */

/* Status */
var(--theme-success)        /* Success states */
var(--theme-error)          /* Error states */
var(--theme-warning)        /* Warning states */
var(--theme-info)           /* Info states */
```

---

## Extending the Theme System (Future)

If you need to add **new theme variables** (e.g., for complex multi-stop gradients):

1. **Update TypeScript types**: `src/lib/types/theme.ts`
   ```typescript
   export interface ThemeVariant {
     id: string;
     label: string;
     cssVars: {
       '--theme-gradient-start'?: string;  // Optional new variable
       '--theme-gradient-mid'?: string;
       '--theme-gradient-end'?: string;
       // ... existing variables
     };
   }
   ```

2. **Update all 8 theme variants**: `src/lib/utils/theme-variants.ts`
   ```typescript
   {
     id: 'light-default',
     cssVars: {
       '--theme-gradient-start': '#8b5cf6',
       '--theme-gradient-mid': '#ec4899',
       '--theme-gradient-end': '#f59e0b',
       // ... existing variables
     }
   }
   ```

3. **Document the new variables** in this guide

4. **Test across all themes** to ensure consistency

---

## Resources

- **Theme Store**: `src/lib/stores/theme.ts` - Theme state management
- **Theme Variants**: `src/lib/utils/theme-variants.ts` - All 8 built-in themes
- **Theme Types**: `src/lib/types/theme.ts` - TypeScript definitions
- **ui-design.md**: Visual design system reference (aspirational colors, not implementation)
- **Existing Components**: `src/lib/components/ui/*` - See how current components use theme variables

---

**Remember**: The ui-design.md document specifies colors for **visual design intent** (purple-pink gradients, vibrant accents). The **implementation** uses theme variables so those colors adapt to user-selected themes. This gives users freedom to customize while maintaining the modern, vibrant aesthetic across all themes.

