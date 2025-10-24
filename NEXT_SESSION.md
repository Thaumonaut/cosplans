# Next Session Roadmap

## Session Goal
Improve UI for all resource pages using the placeholder page design as reference, then create unified detail pages with inline editing.

## Phase 1: Improve List Pages (All Resources)

### Pattern to Follow (from `/characters-costumes`)
1. **Stats Cards** at top (4 cards with icons)
2. **ThemedCard** for all sections
3. **Better filters** with search and dropdowns
4. **Improved cards** showing more information
5. **Info box** at bottom explaining the feature

### Resources to Update
- [ ] `/costumes` - Add stats, improve layout
- [ ] `/crew` - Add stats (roles, favorites, total)
- [ ] `/equipment` - Add stats (types, condition, ownership)
- [ ] `/props` - Add stats (status, types)
- [ ] `/locations` - Add stats (types, favorites)

## Phase 2: Unified Detail Pages

### Pattern to Implement
- Use `/resource/[id]` where id="new" for creation
- Inline editing with `InlineEditField` component
- Click placeholder text to edit
- Auto-save on blur
- All resources use same pattern

### Components Ready
✅ `InlineEditField.svelte` - Click-to-edit fields
✅ `RoleChipSelector.svelte` - Multi-select roles for crew
✅ `LifecycleStateBadge.svelte` - Status badges (fixed for Svelte 5)

### Resources to Create Detail Pages
- [ ] `/costumes/[id]` - Unified create/edit
- [ ] `/crew/[id]` - Unified create/edit (already started, needs inline editing)
- [ ] `/equipment/[id]` - Unified create/edit
- [ ] `/props/[id]` - Unified create/edit
- [ ] `/locations/[id]` - Unified create/edit

## Phase 3: Polish & Cleanup

- [ ] Remove old placeholder pages (`/characters-costumes`)
- [ ] Test all flows
- [ ] Ensure theme compliance
- [ ] Add helpful empty states
- [ ] Verify all CRUD operations work

## Key Design Principles

1. **Consistency** - All resource pages look and feel the same
2. **Information Density** - Show useful data at a glance
3. **Visual Hierarchy** - Clear sections with ThemedCard
4. **Helpful Context** - Info boxes explaining features
5. **Theme Compliance** - Use CSS variables throughout

## Files to Reference

- **Good UI Example**: `src/routes/(auth)/characters-costumes/+page.svelte`
- **Components**: `src/lib/components/ui/ThemedCard.svelte`, `ThemedButton.svelte`
- **Inline Edit**: `src/lib/components/ui/InlineEditField.svelte`
- **Data Model**: `specs/045-resource-management/data-model.md`

## Current State

✅ Database migrations complete
✅ All tables created with RLS policies
✅ Services working for all 5 resources
✅ Basic list pages functional
✅ Crew uses `previous_roles` array
✅ Reusable components created
⚠️ UI needs improvement
⚠️ Detail pages need inline editing

---

**Start here next session**: Improve `/costumes` page UI using placeholder design
