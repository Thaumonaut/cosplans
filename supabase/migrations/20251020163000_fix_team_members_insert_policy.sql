-- Fix team_members INSERT policy to allow team owners to add themselves
-- Current policy creates chicken-and-egg: can't add yourself as member unless you're already a member

DROP POLICY IF EXISTS "Owners and admins can add members" ON team_members;

-- Allow:
-- 1. Team owners to add members (checked via teams.owner_id)
-- 2. Existing owners/admins to add members (checked via team_members)
CREATE POLICY "Owners and admins can add members" ON team_members FOR INSERT
	WITH CHECK (
		-- User is the team owner (for initial team creation)
		team_id IN (
			SELECT id FROM teams WHERE owner_id = auth.uid()
		)
		OR
		-- User is already an owner/admin of the team
		team_id IN (
			SELECT t.id FROM teams t
			INNER JOIN team_members tm ON t.id = tm.team_id
			WHERE tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')
		)
	);
