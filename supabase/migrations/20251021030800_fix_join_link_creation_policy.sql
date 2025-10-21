-- Fix join link creation policy to allow team owners to create links during team creation
-- The current policy checks team_members table, but during team creation the member row
-- might not be visible yet due to transaction timing

DROP POLICY IF EXISTS "Owners and admins can create join links" ON team_join_links;

CREATE POLICY "Owners and admins can create join links"
ON team_join_links
FOR INSERT
TO public
WITH CHECK (
  -- Allow if user is the team owner
  (SELECT owner_id FROM teams WHERE id = team_join_links.team_id) = auth.uid()
  OR
  -- Allow if user is owner/admin in team_members
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.team_id = team_join_links.team_id
    AND team_members.user_id = auth.uid()
    AND team_members.role IN ('owner', 'admin')
  )
);

COMMENT ON POLICY "Owners and admins can create join links" ON team_join_links IS
'Allows team owners and admins to create join links. Checks both teams.owner_id and team_members table.';
