# Implementation Plan: UI Library Migration to Flowbite Svelte

**Branch**: `044-ui-flowbite-migration` | **Date**: 2025-10-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/044-ui-flowbite-migration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Migrate from shadcn-svelte to Flowbite Svelte as the primary UI component library and create a comprehensive set of reusable themed components. This reduces code duplication by ~60%, ensures consistent theme variable usage across all components, and provides a stable UI foundation compatible with Tailwind CSS v3. The migration includes creating ThemedCard, ThemedInput, ThemedButton, ThemedTextarea, ThemedSelect, and ThemedAlert components, along with backward compatibility wrappers for existing dashboard widgets.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, Svelte 5.x, SvelteKit (latest)
**Primary Dependencies**: 
- Flowbite Svelte v1.18.0 (UI component library)
- Tailwind CSS v3.4.18 (styling framework)
- flowbite v3.1.2 (Tailwind plugin)
**Storage**: N/A (UI refactor only, no data changes)
**Testing**: Vitest (unit), Playwright (E2E), manual testing for visual regression
**Target Platform**: Web (Chrome, Firefox, Safari, Edge latest 2 versions)
**Project Type**: Web application (SvelteKit)
**Performance Goals**: 
- Theme switching <100ms
- Build time increase <10%
- No runtime performance degradation
**Constraints**: 
- Must maintain 100% functional parity with existing pages
- All components must use theme CSS variables (no hardcoded colors)
- Backward compatibility with dashboard widgets required
**Scale/Scope**: 
- 6 new reusable themed components
- 7 backward compatibility wrappers
- ~15 pages to refactor (starting with team settings)
- ~500-1000 lines of duplicated inline styling to eliminate

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1: Technology Stack Alignment
**Status**: ✅ PASS

- Constitution requires Flowbite Svelte as primary UI library (Section: Recommended Technology Stack)
- Constitution requires Tailwind CSS v3 (v4 has SSR issues)
- This migration implements exactly what the constitution mandates

### Gate 2: Theme System Compliance
**Status**: ✅ PASS

- Constitution requires all components use theme CSS variables
- All new themed components use `var(--theme-*)` exclusively
- No hardcoded colors permitted per constitution

### Gate 3: Mobile Responsiveness
**Status**: ✅ PASS

- All Flowbite components are mobile-responsive by default
- Themed components use Tailwind utility classes for responsive design
- No impact on mobile-first architecture

### Gate 4: Performance Requirements
**Status**: ✅ PASS

- Constitution requires <3sec page loads on 3G
- UI library change does not affect load times (CSS-only)
- Build time increase constrained to <10%

### Gate 5: Test-Driven Development
**Status**: ⚠️ PARTIAL

- Constitution requires tests before implementation
- Components already created (work in progress)
- **Action Required**: Add visual regression tests and component unit tests before completion

**Overall**: 4/5 gates pass. Gate 5 requires test addition before merge.

## Project Structure

### Documentation (this feature)

```
specs/044-ui-flowbite-migration/
├── spec.md              # Feature specification
├── plan.md              # This file (implementation plan)
├── research.md          # N/A (no research needed - tech stack already defined)
├── data-model.md        # N/A (UI refactor only, no data changes)
├── quickstart.md        # Component usage guide
└── tasks.md             # Task breakdown (created by /speckit.tasks)
```

**Note**: research.md and data-model.md are not applicable for this UI refactor since we're not introducing new technologies or data models.

### Source Code (repository root)

```
src/lib/components/ui/
├── ThemedCard.svelte          # ✅ Created - Card/section container
├── ThemedInput.svelte         # ✅ Created - Text input field
├── ThemedTextarea.svelte      # ✅ Created - Multi-line text input
├── ThemedButton.svelte        # ✅ Created - Button with variants
├── ThemedSelect.svelte        # ✅ Created - Dropdown select
├── ThemedAlert.svelte         # ✅ Created - Success/error/warning/info messages
├── ConfirmModal.svelte        # ✅ Exists - Confirmation dialog
├── Button.svelte              # ✅ Created - Backward compat wrapper
├── Badge.svelte               # ✅ Created - Backward compat wrapper
├── Card.svelte                # ✅ Created - Backward compat wrapper
├── CardHeader.svelte          # ✅ Created - Backward compat wrapper
├── CardTitle.svelte           # ✅ Created - Backward compat wrapper
└── CardContent.svelte         # ✅ Created - Backward compat wrapper

src/routes/(auth)/teams/[teamId]/
├── +page.svelte               # 🔄 Partially refactored - Team settings page
└── +page.server.ts            # No changes needed

src/routes/onboarding/
├── +page.svelte               # ⏳ To be refactored
└── +page.server.ts            # No changes needed

tailwind.config.js             # ✅ Updated - Flowbite plugin configured
package.json                   # ✅ Updated - Flowbite Svelte installed
.specify/memory/constitution.md # ✅ Updated - Tech stack documented

tests/
└── components/                # ⏳ To be created - Component tests
    ├── ThemedCard.test.ts
    ├── ThemedInput.test.ts
    ├── ThemedButton.test.ts
    └── ...
```

**Structure Decision**: SvelteKit web application structure. All new themed components are in `src/lib/components/ui/` following the existing pattern. Backward compatibility wrappers maintain the same location to avoid breaking imports in dashboard widgets.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

