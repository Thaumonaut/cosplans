-- Add is_personal flag to teams table
-- Personal teams are created during onboarding and cannot have additional members
-- Public teams are created post-onboarding and support collaboration

ALTER TABLE teams
ADD COLUMN is_personal BOOLEAN NOT NULL DEFAULT false;

-- Create index for faster queries
CREATE INDEX idx_teams_is_personal ON teams(is_personal);

-- Mark all existing teams as personal (since they were created during onboarding)
-- This can be adjusted manually later if needed
UPDATE teams SET is_personal = true;

-- Add comment for documentation
COMMENT ON COLUMN teams.is_personal IS 'Personal teams are solo workspaces created during onboarding. Public teams are collaborative workspaces created post-onboarding.';
