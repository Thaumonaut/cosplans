-- Final fix for team_members RLS - create a security definer function to avoid recursion
-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view all members of their teams" ON team_members;

-- Create a function that checks if user is a member of a team (bypasses RLS)
CREATE OR REPLACE FUNCTION is_team_member(check_team_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM team_members
    WHERE team_id = check_team_id AND user_id = check_user_id
  );
$$;

-- Create policy using the function
CREATE POLICY "Users can view all members of their teams"
ON team_members
FOR SELECT
TO public
USING (
  -- Can view members of teams you own
  team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
  OR
  -- Can view members of teams you belong to (using security definer function)
  is_team_member(team_id, auth.uid())
);

COMMENT ON POLICY "Users can view all members of their teams" ON team_members IS
'Allows users to view all members of teams they own or belong to, using security definer function to avoid recursion';
