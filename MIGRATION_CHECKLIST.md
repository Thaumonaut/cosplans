# Database Migration Checklist

## Resource Management System Setup

Before the resource management pages will work, you need to run the database migrations.

### Prerequisites
- Docker Desktop running
- Supabase local development environment set up

### Migration File to Run

**`20251022210000_create_all_resources.sql`** - Complete Resource Management Setup
   - ✅ Creates all 5 resource tables (costumes, crew_members, equipment, props, locations)
   - ✅ Creates resource_photos table
   - ✅ Sets up RLS policies for all tables
   - ✅ Creates indexes for performance
   - ✅ Sets up triggers for updated_at timestamps
   - ✅ Crew members use `previous_roles` array (not single role)
   - ✅ Full-text search on all resources
   - ✅ Soft delete support

### How to Run Migrations

```bash
# Start Supabase (if not already running)
supabase start

# Run migrations
supabase db reset

# Or apply specific migration
supabase migration up
```

### Verification

After running migrations, verify tables exist:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('costumes', 'crew_members', 'equipment', 'props', 'locations', 'resource_photos');

-- Check crew_members structure
\d crew_members
```

### Current Page Status

| Page | Status | Notes |
|------|--------|-------|
| `/characters-costumes` | ✅ Working | Old placeholder with nice UI (static data) |
| `/costumes` | ⚠️ 500 Error | New resource management (needs migrations) |
| `/crew` | ⚠️ 400 Error | New resource management (needs migrations + team) |
| `/equipment` | ⚠️ Needs migrations | New resource management |
| `/props` | ⚠️ Needs migrations | New resource management |
| `/locations` | ⚠️ Needs migrations | New resource management |

### Next Steps

1. Run database migrations
2. Ensure user has a team (create one if needed)
3. Test `/costumes` page
4. Incorporate nice UI elements from `/characters-costumes` into new pages
5. Remove old placeholder pages once new ones are working
