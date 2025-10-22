-- Fix infinite recursion in team_members RLS policies
-- The issue: SELECT policy was checking team_members table, causing recursion

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Owners and admins can add members" ON team_members;
DROP POLICY IF EXISTS "Owners and admins can update members" ON team_members;
DROP POLICY IF EXISTS "Owners and admins can remove members" ON team_members;

-- Recreate with fixed logic
-- Users can ONLY view their own team_members row (no recursion)
CREATE POLICY "Users can view team members" ON team_members FOR SELECT
	USING (user_id = auth.uid());

-- Owners and admins can add members (check via teams table to avoid recursion)
CREATE POLICY "Owners and admins can add members" ON team_members FOR INSERT
	WITH CHECK (
		team_id IN (
			SELECT t.id FROM teams t
			INNER JOIN team_members tm ON t.id = tm.team_id
			WHERE tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')
		)
	);

-- Owners and admins can update members (check via teams table)
CREATE POLICY "Owners and admins can update members" ON team_members FOR UPDATE
	USING (
		team_id IN (
			SELECT t.id FROM teams t
			INNER JOIN team_members tm ON t.id = tm.team_id
			WHERE tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')
		)
	);

-- Owners and admins can remove members (check via teams table)
CREATE POLICY "Owners and admins can remove members" ON team_members FOR DELETE
	USING (
		team_id IN (
			SELECT t.id FROM teams t
			INNER JOIN team_members tm ON t.id = tm.team_id
			WHERE tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')
		)
	);
