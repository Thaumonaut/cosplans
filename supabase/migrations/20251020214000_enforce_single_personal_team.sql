-- Enforce that each user can only have ONE personal team
-- Constitutional requirement: Users must own exactly one personal team

-- Create unique partial index: only one active personal team per owner
CREATE UNIQUE INDEX idx_teams_one_personal_per_user 
ON teams(owner_id) 
WHERE is_personal = true AND archived_at IS NULL;

-- Add comment for documentation
COMMENT ON INDEX idx_teams_one_personal_per_user IS 
'Ensures each user can only have one active personal team (constitutional requirement)';
