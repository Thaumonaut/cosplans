# UI Library Migration: Flowbite Svelte & Reusable Components

**Status**: In Progress  
**Branch**: `ui-library-migration-flowbite`  
**Priority**: High  
**Estimated Effort**: 3-5 days

## Overview

Migrate from shadcn-svelte to Flowbite Svelte as the primary UI component library and create a comprehensive set of reusable themed components to reduce code duplication and ensure consistent styling across the application.

## Problem Statement

1. **shadcn-svelte incompatibility**: Cannot use shadcn-svelte with Tailwind v3 (requires v4 which has SSR issues with SvelteKit)
2. **Code duplication**: Repeated inline styling with theme variables across multiple components (~60% duplication)
3. **Maintenance burden**: Changes to styling require updates in multiple locations
4. **Inconsistent patterns**: Mix of inline styles and component-based approaches

## Solution

### 1. Flowbite Svelte Integration
- Install Flowbite Svelte v1.18.0 as primary UI library
- Configure Tailwind CSS v3 with Flowbite plugin
- Update constitution and memory system to reflect tech stack change

### 2. Reusable Themed Component System
Create a comprehensive set of reusable components that automatically use theme variables:

**Core Components**:
- `ThemedCard` - Section/card containers
- `ThemedInput` - Text input fields
- `ThemedTextarea` - Multi-line text inputs
- `ThemedButton` - Buttons with variants (primary, secondary, danger, warning)
- `ThemedSelect` - Dropdown selects
- `ThemedAlert` - Success/error/warning/info messages

**Backward Compatibility Wrappers**:
- `Button.svelte` - Maps old shadcn props to ThemedButton
- `Badge.svelte` - Badge component with theme variables
- `Card.svelte`, `CardHeader.svelte`, `CardTitle.svelte`, `CardContent.svelte`

### 3. Refactor Existing Pages
- Team settings page (`/teams/[teamId]`)
- Onboarding page
- Dashboard widgets (when implemented)
- Any other pages with repeated styling patterns

## Implementation Plan

### Phase 1: Setup & Infrastructure ✅
- [x] Install Flowbite Svelte and dependencies
- [x] Configure Tailwind CSS v3 with Flowbite plugin
- [x] Update constitution with tech stack changes
- [x] Update memory system with component hierarchy
- [x] Create components.json for future shadcn compatibility

### Phase 2: Create Reusable Components ✅
- [x] ThemedCard component
- [x] ThemedInput component
- [x] ThemedTextarea component
- [x] ThemedButton component
- [x] ThemedSelect component
- [x] ThemedAlert component
- [x] Backward compatibility wrappers (Button, Badge, Card, etc.)

### Phase 3: Refactor Existing Pages 🔄
- [x] Team settings - Team Information section
- [ ] Team settings - Team Management section
- [ ] Team settings - Invite Members section
- [ ] Team settings - Danger Zone section
- [ ] Onboarding page
- [ ] Other pages as needed

### Phase 4: Testing & Documentation
- [ ] Test all refactored pages in light/dark mode
- [ ] Verify theme switching works correctly
- [ ] Test form submissions and validations
- [ ] Update component documentation
- [ ] Create usage examples

### Phase 5: Cleanup
- [ ] Remove unused shadcn component files
- [ ] Update imports across codebase
- [ ] Run linter and fix warnings
- [ ] Performance audit

## Benefits

1. **Code Reduction**: ~60% reduction in code duplication
2. **Consistency**: Automatic theme variable usage across all components
3. **Maintainability**: Change once, updates everywhere
4. **Type Safety**: Full TypeScript support with proper prop types
5. **Developer Experience**: Simpler, cleaner component usage
6. **Theme Support**: Automatic light/dark mode and custom theme support

## Technical Details

### Component API Design

**ThemedCard**:
```svelte
<ThemedCard title="Section Title" padding="p-6">
  Content goes here
</ThemedCard>
```

**ThemedButton**:
```svelte
<ThemedButton type="submit" variant="primary" disabled={false}>
  Save Changes
</ThemedButton>
```

**ThemedAlert**:
```svelte
<ThemedAlert type="success" dismissible onDismiss={handleClose}>
  Operation successful!
</ThemedAlert>
```

### Theme Variables Used
- `--theme-background`
- `--theme-foreground`
- `--theme-sidebar-bg`
- `--theme-sidebar-border`
- `--theme-sidebar-text`
- `--theme-sidebar-muted`
- `--theme-sidebar-accent`
- `--theme-success`
- `--theme-error`
- `--theme-warning`
- `--theme-info`

## Testing Checklist

- [ ] All forms submit correctly
- [ ] Theme switching works (light/dark mode)
- [ ] All buttons respond to clicks
- [ ] Input validation works
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Modals open and close properly
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

## Migration Guide

### Before (Old Pattern):
```svelte
<div class="shadow rounded-lg p-6" 
     style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);">
  <h2 class="text-xl font-semibold mb-4" style="color: var(--theme-foreground);">
    Title
  </h2>
  <input type="text" name="field" 
         class="w-full px-3 py-2 border rounded-lg"
         style="background: var(--theme-sidebar-bg); color: var(--theme-foreground);" />
</div>
```

### After (New Pattern):
```svelte
<ThemedCard title="Title">
  <ThemedInput type="text" name="field" />
</ThemedCard>
```

## Risks & Mitigation

**Risk**: Breaking existing functionality during refactor  
**Mitigation**: Work in dedicated branch, test thoroughly before merging

**Risk**: Flowbite components may not match our design  
**Mitigation**: Use Flowbite for complex components only, use themed components for basic UI

**Risk**: Performance impact from additional component layers  
**Mitigation**: Components are lightweight wrappers, minimal overhead

## Success Criteria

1. ✅ Flowbite Svelte successfully integrated
2. ✅ All reusable themed components created and documented
3. 🔄 Team settings page fully refactored (50% complete)
4. ⏳ All pages use consistent component patterns
5. ⏳ No hardcoded colors or inline theme styles
6. ⏳ All tests passing
7. ⏳ Documentation updated

## Related Specs

- 020-user-management-and-access (uses team settings UI)
- 021-shoots-teams-creation (team creation flows)

## Notes

- Tailwind v4 attempted but has SSR compatibility issues with SvelteKit
- Staying on Tailwind v3 for stability
- Flowbite Svelte is native Svelte (not a port), better than shadcn for our use case
- Component wrappers maintain backward compatibility with dashboard widgets
