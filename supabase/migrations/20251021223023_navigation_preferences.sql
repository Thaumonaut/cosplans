-- Migration: Navigation Preferences and Adaptive Navigation
-- Feature: 041-sidebar-navigation
-- Date: 2025-10-21
-- Description: Add navigation layout preferences, auto-hide tracking, and project status

-- User Profiles: Navigation preferences (Q13)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS navigation_layout TEXT DEFAULT 'auto' CHECK (navigation_layout IN ('auto', 'minimal', 'full', 'photographer', 'coordinator'));

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS hidden_nav_sections TEXT[] DEFAULT '{}';

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS pinned_nav_sections TEXT[] DEFAULT '{}';

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS last_accessed_sections JSONB DEFAULT '{}';

-- Team Members: Per-team navigation overrides (Q13)
ALTER TABLE team_members
ADD COLUMN IF NOT EXISTS navigation_layout_override TEXT CHECK (navigation_layout_override IN ('auto', 'minimal', 'full', 'photographer', 'coordinator'));

-- Teams: Recommended layout for team (Q13)
ALTER TABLE teams
ADD COLUMN IF NOT EXISTS recommended_navigation_layout TEXT CHECK (recommended_navigation_layout IN ('auto', 'minimal', 'full', 'photographer', 'coordinator'));

-- Projects: Status field for lifecycle (Q9, Q10)
-- Check if projects table exists first
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
        -- Add status column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'status') THEN
            ALTER TABLE projects
            ADD COLUMN status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'archived'));
        END IF;
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.navigation_layout IS 'Global navigation layout preference: auto (smart), minimal, full, photographer, coordinator';
COMMENT ON COLUMN user_profiles.hidden_nav_sections IS 'Array of navigation section IDs that are hidden in overflow menu';
COMMENT ON COLUMN user_profiles.pinned_nav_sections IS 'Array of navigation section IDs that are pinned (prevent auto-hide)';
COMMENT ON COLUMN user_profiles.last_accessed_sections IS 'JSONB object tracking last access timestamp for each section (for 30-day auto-hide)';
COMMENT ON COLUMN team_members.navigation_layout_override IS 'Per-team navigation layout override (takes precedence over global)';
COMMENT ON COLUMN teams.recommended_navigation_layout IS 'Team admin recommended navigation layout (suggestion, not enforced)';

-- Create index for faster navigation preference lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_navigation_layout ON user_profiles(navigation_layout);
CREATE INDEX IF NOT EXISTS idx_team_members_navigation_override ON team_members(navigation_layout_override) WHERE navigation_layout_override IS NOT NULL;

-- RLS policies remain unchanged - existing policies cover these columns
-- user_profiles: Users can read/update their own profile
-- team_members: Users can read their own team memberships
-- teams: Team members can read team settings
