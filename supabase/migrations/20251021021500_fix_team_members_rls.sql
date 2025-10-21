-- Fix RLS policy for team_members to allow viewing all members of teams you belong to
-- Current policy only allows viewing yourself, which prevents seeing other team members

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can view team members" ON team_members;

-- Create new policy that allows viewing all members of teams you're a member of
CREATE POLICY "Users can view all members of their teams"
ON team_members
FOR SELECT
TO public
USING (
  team_id IN (
    SELECT team_id 
    FROM team_members 
    WHERE user_id = auth.uid()
  )
);

COMMENT ON POLICY "Users can view all members of their teams" ON team_members IS
'Allows users to view all members of any team they belong to';
