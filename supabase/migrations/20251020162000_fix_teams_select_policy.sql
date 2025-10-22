-- Fix teams SELECT policy to allow owners to see their teams
-- Current policy only checks team_members, causing issues during team creation

DROP POLICY IF EXISTS "Users can view their teams" ON teams;

-- Allow users to see teams they own OR teams they're a member of
CREATE POLICY "Users can view their teams" ON teams FOR SELECT
	USING (
		owner_id = auth.uid() 
		OR id IN (
			SELECT team_id FROM team_members WHERE user_id = auth.uid()
		)
	);
