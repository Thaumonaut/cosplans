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
<!-- MANUAL ADDITIONS END -->
