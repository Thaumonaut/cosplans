-- Fix infinite recursion in ownership transfer policy
-- Use a security definer function to check if new owner is a team member

-- Drop the problematic policy
DROP POLICY IF EXISTS "Owners can update their teams" ON teams;

-- Create a security definer function to check if user is a team member
CREATE OR REPLACE FUNCTION is_user_team_member(check_team_id uuid, check_user_id uuid)
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

-- Create new policy using the security definer function
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
  is_user_team_member(id, owner_id)
);

COMMENT ON POLICY "Owners can update their teams" ON teams IS
'Allows owners to update their teams and transfer ownership to team members using security definer function';
