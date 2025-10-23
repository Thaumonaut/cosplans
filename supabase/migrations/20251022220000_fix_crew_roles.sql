-- Fix crew_members table to use previous_roles array
-- This migration safely updates the structure

-- First, check if the old 'role' column exists and previous_roles doesn't
DO $$
BEGIN
  -- If role column exists and previous_roles doesn't, we need to migrate
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'crew_members' AND column_name = 'role'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'crew_members' AND column_name = 'previous_roles'
  ) THEN
    
    -- Drop the generated column first
    ALTER TABLE public.crew_members DROP COLUMN IF EXISTS search_vector;
    
    -- Add the new previous_roles column
    ALTER TABLE public.crew_members ADD COLUMN previous_roles TEXT[] DEFAULT '{}';
    
    -- Migrate existing role data to previous_roles array
    UPDATE public.crew_members SET previous_roles = ARRAY[role] WHERE role IS NOT NULL;
    
    -- Drop the old role column
    ALTER TABLE public.crew_members DROP COLUMN role;
    
    -- Recreate the search_vector with the new structure
    ALTER TABLE public.crew_members ADD COLUMN search_vector tsvector 
      GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(array_to_string(previous_roles, ' '), '')), 'B') ||
        setweight(to_tsvector('english', coalesce(notes, '')), 'C')
      ) STORED;
    
    -- Recreate the search index
    CREATE INDEX IF NOT EXISTS idx_crew_search ON crew_members USING GIN(search_vector);
    
  END IF;
END $$;
