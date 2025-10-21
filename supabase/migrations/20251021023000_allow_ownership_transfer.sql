-- Allow ownership transfer by updating the teams UPDATE policy
-- Current policy only allows owner to update if they remain the owner
-- New policy allows owner to transfer ownership to another team member

-- Drop the old policy
DROP POLICY IF EXISTS "Owners can update their teams" ON teams;

-- Create new policy that allows ownership transfer
CREATE POLICY "Owners can update their teams"
ON teams
FOR UPDATE
TO public
USING (owner_id = auth.uid())
WITH CHECK (
  -- Allow if owner stays the same (normal updates)
  owner_id = auth.uid()
  OR
  -- Allow if transferring ownership to a team member
  (
    -- Old owner is current user
    (SELECT owner_id FROM teams WHERE id = teams.id) = auth.uid()
    AND
    -- New owner is a member of the team
    owner_id IN (
      SELECT user_id FROM team_members WHERE team_id = teams.id
    )
  )
);

COMMENT ON POLICY "Owners can update their teams" ON teams IS
'Allows owners to update their teams and transfer ownership to team members';
