# cosplans Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-16

## Runtime Requirement

**CONSTITUTIONAL MANDATE**: This project MUST use Bun runtime (not Node.js). All package management, development, and build commands MUST use Bun.

## Active Technologies

- **Runtime**: Bun (constitutionally required)
- TypeScript/JavaScript with SvelteKit + SvelteKit, Tailwind CSS, Shadcn/svelte, Yjs, @casl/ability, Supabase (001-dashboard-views)
- TypeScript 5.x with SvelteKit running on Bun 1.3.x runtime + SvelteKit load/actions stack, `@supabase/supabase-js`, Tailwind CSS with theme variables, shadcn/svelte components, Yjs realtime layer (existing) (042-setup-and-connect)
- Supabase PostgreSQL (managed) with storage buckets for diagnostics evidence (042-setup-and-connect)
- TypeScript 5.x (SvelteKit) running on Bun 1.3.x runtime + SvelteKit, @supabase/supabase-js, Tailwind CSS with theme variables, shadcn/svelte, Yjs, @casl/ability (042-setup-and-connect)
- Supabase PostgreSQL with Storage buckets for diagnostics evidence (042-setup-and-connect)

## Project Structure

```
src/
tests/
```

## Commands

**Use Bun commands only**:

- `bun install` (never npm install)
- `bun --bun run dev` (development server)
- `bun run build` (production build)
- `bun test` (run tests)
- `bun run lint` (run linting)

## Code Style

TypeScript/JavaScript with SvelteKit: Follow standard conventions

## Recent Changes

- 042-setup-and-connect: Added TypeScript 5.x (SvelteKit) running on Bun 1.3.x runtime + SvelteKit, @supabase/supabase-js, Tailwind CSS with theme variables, shadcn/svelte, Yjs, @casl/ability
- 042-setup-and-connect: Added TypeScript 5.x with SvelteKit running on Bun 1.3.x runtime + SvelteKit load/actions stack, `@supabase/supabase-js`, Tailwind CSS with theme variables, shadcn/svelte components, Yjs realtime layer (existing)
- 001-dashboard-views: Added TypeScript/JavaScript with SvelteKit + SvelteKit, Tailwind CSS, Shadcn/svelte, Yjs, @casl/ability, Supabase

<!-- MANUAL ADDITIONS START -->

## 📜 CONSTITUTION: Source of Truth

**ALWAYS consult `.specify/memory/constitution.md` - This is the foundational source of truth for the entire project.**

The constitution defines:
- **Core Principles I-X** - Architectural mandates that MUST be followed
- **Principle IX: Bun Runtime** - Constitutional requirement (never use Node.js/npm)
- **Principle I: Web-First** - SvelteKit responsive web → Flutter mobile
- **Principle II: Real-Time** - SSE + Yjs for collaboration
- **Principle III: Integrations** - Google Calendar/Maps/Docs, Instagram, Email
- **Principle IV-X** - Workflow customization, visual-first, TDD, team roles, creator community, analytics, sustainability

**Before making ANY architectural decisions:**
1. Read the relevant principle in constitution.md
2. Verify your approach aligns with constitutional mandates
3. If unsure, reference the constitution explicitly

**The constitution supersedes all other documentation. When in conflict, constitution wins.**

---

## ⚠️ CRITICAL: Implementation Workflow

**ALWAYS follow this sequence before implementing ANY feature:**

### 1. **Check Prerequisites First**
```bash
# Run the prerequisites check for the feature
.specify/scripts/bash/check-prerequisites.sh --json
```
- Ensure all previous features are complete
- Verify no blocking dependencies

### 2. **Read ALL Spec Files**
Load ALL files from the feature's `specs/[FEATURE_DIR]/` directory:

**Required Reading:**
- 📋 `spec.md` - Core requirements, user stories, acceptance criteria
- 🏗️ `plan.md` - Architecture decisions, tech stack, file structure, implementation approach
- ✅ `tasks.md` - Implementation task breakdown and checklist
- 🗄️ `data-model.md` - Database schema and relationships (if exists)
- 📡 `contracts/` - API endpoints and contracts (if exists)
- ☑️ `checklists/implementation.md` - Detailed validation checklist (if exists)

**Never skip spec files. They contain critical context.**

### 3. **Understand Existing Architecture**
Before adding new files:
- Check existing file structure in `src/`
- Review related components already implemented
- Look for existing patterns to follow
- Check for similar functionality that can be reused

### 4. **Implement According to Spec**
- Follow the exact requirements from spec files
- Use the tech stack specified in `plan.md`
- Match the file structure outlined in `plan.md`
- Implement tasks in the order specified in `tasks.md`

### 5. **Update Documentation as You Go**
- ✅ Mark tasks complete in `tasks.md`
- ✅ Update `checklists/implementation.md`
- 💾 Commit changes with descriptive messages
- 📝 Note any deviations from the spec

---

## 🧠 Key Things to Remember

### Always Check Constitution & Specs Before:
- **Constitution First**: Check `.specify/memory/constitution.md` for architectural principles
- Creating new components
- Adding new routes
- Implementing new features
- Making architectural decisions
- Adding database tables/migrations
- Choosing technologies or patterns

### Never:
- Implement features without reading spec files
- Assume implementation details without checking `plan.md`
- Skip updating `tasks.md` when completing work
- Use Node.js/npm commands (use Bun only!)
- Add features not defined in specs without discussion

### Always:
- Start implementation with `/speckit.implement` prompt
- Read ALL spec files from the feature directory
- Follow the exact tech stack from `plan.md`
- Update task checklists as you complete items
- Commit frequently with descriptive messages
- Use Bun runtime for all commands

### Theme Variables (CSS):
All components MUST use theme variables for colors:
- `var(--theme-foreground)` - Primary text
- `var(--theme-sidebar-bg)` - Background
- `var(--theme-sidebar-hover)` - Hover states
- `var(--theme-sidebar-border)` - Borders
- `var(--theme-sidebar-accent)` - Accent/primary color
- `var(--theme-sidebar-text)` - Secondary text
- `var(--theme-sidebar-muted)` - Muted/disabled text
- `var(--theme-header-bg)` - Header backgrounds
- `var(--theme-header-text)` - Header text

### Authorization Patterns:
- Use `@casl/ability` for permissions
- Check `locals.ability` in server routes
- Available subjects: `DashboardWidget`, `TimelineView`, `ProgressTracker`, `CharacterProfile`, `TeamBudget`, `CostumeInventory`, `Shoot`, `Team`
- Available actions: `create`, `read`, `update`, `delete`, `manage`

### Real-time Updates:
- Use Server-Sent Events (SSE) via `/api/events`
- Subscribe to events on client with reconnection logic
- Broadcast changes to team members on mutations

### Database:
- All migrations go in `database/migrations/`
- Follow RLS (Row Level Security) patterns
- Use Supabase client from `locals.supabase`
- Always check user permissions before queries

---

## 📝 Commit Message Format

```
<type>(<scope>): <short description>

<detailed explanation>
- List specific changes
- Note any deviations from spec
- Reference user stories (US-XXX)

Completes X/Y tasks (Z% complete)
```

**Types:** feat, fix, docs, refactor, test, chore

---

## 🔍 Quick Reference

**Feature in Progress:** 001-dashboard-views (31/87 tasks, 36%)

**Current Tech Stack:**
- Runtime: Bun 1.3.x
- Framework: SvelteKit
- Language: TypeScript 5.x
- Styling: Tailwind CSS + theme variables
- UI: shadcn/svelte components
- Database: Supabase PostgreSQL
- Real-time: SSE + Yjs CRDT
- Auth: Supabase Auth + @casl/ability

**Key Directories:**
- `/src/routes/` - SvelteKit routes
- `/src/lib/components/` - Reusable components
- `/src/lib/server/` - Server-side code
- `/database/migrations/` - Database migrations
- `/specs/` - Feature specifications

<!-- MANUAL ADDITIONS END -->
