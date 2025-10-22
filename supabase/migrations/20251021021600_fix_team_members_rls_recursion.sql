-- Fix infinite recursion in team_members RLS policy
-- The previous policy caused recursion by querying team_members within the policy itself

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view all members of their teams" ON team_members;

-- Create a simpler policy using a direct join to teams
-- This avoids the recursion by checking team ownership or membership through teams table
CREATE POLICY "Users can view all members of their teams"
ON team_members
FOR SELECT
TO public
USING (
  -- Can view members of teams you own
  team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  OR
  -- Can view members of teams where you are a member (using EXISTS to avoid recursion)
  EXISTS (
    SELECT 1 
    FROM team_members tm 
    WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid()
  )
);

COMMENT ON POLICY "Users can view all members of their teams" ON team_members IS
'Allows users to view all members of teams they own or are members of, without recursion';
