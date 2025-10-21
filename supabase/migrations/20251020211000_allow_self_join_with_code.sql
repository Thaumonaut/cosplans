-- Allow users to add themselves to teams when they have a valid join code
-- This enables the team join functionality

CREATE POLICY "Users can add themselves via active join link"
    ON team_members
    FOR INSERT
    WITH CHECK (
        -- User can only add themselves
        user_id = auth.uid()
        AND
        -- Team must have an active join link
        EXISTS (
            SELECT 1 
            FROM team_join_links 
            WHERE team_join_links.team_id = team_members.team_id
            AND team_join_links.is_active = true
            AND (
                -- Either no expiration, or not expired
                team_join_links.expires_at IS NULL 
                OR team_join_links.expires_at > NOW()
            )
            AND (
                -- Either no max uses, or not reached
                team_join_links.max_uses IS NULL 
                OR team_join_links.current_uses < team_join_links.max_uses
            )
        )
    );

-- Note: This policy allows users to join teams with active join links
-- Security is maintained through:
-- 1. Users can only add themselves (not others)
-- 2. Join link must be active
-- 3. Join link must not be expired
-- 4. Join link must not have reached max uses
-- 5. The actual join code validation happens in application logic
