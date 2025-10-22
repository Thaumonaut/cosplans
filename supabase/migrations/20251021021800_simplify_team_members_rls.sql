-- Simplify team_members RLS using the security definer function
-- This completely avoids recursion by using the function created earlier

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view all members of their teams" ON team_members;
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Team members can view each other" ON team_members;

-- Ensure the security definer function exists
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

-- Simple policy using the function
CREATE POLICY "Team members can view each other"
ON team_members
FOR SELECT
TO public
USING (
  -- Can see all members if you're a member of the team (using security definer function)
  is_team_member(team_id, auth.uid())
);

COMMENT ON POLICY "Team members can view each other" ON team_members IS
'Allows team members to view all other members of their teams using security definer function';
