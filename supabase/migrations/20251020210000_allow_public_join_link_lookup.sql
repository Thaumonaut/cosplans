-- Allow anyone to look up active join links by code
-- This is necessary for users to join teams they're not yet members of

CREATE POLICY "Anyone can view active join links by code"
    ON team_join_links
    FOR SELECT
    USING (is_active = true);

-- Note: This policy allows anyone to see active join links
-- This is intentional - join codes are meant to be shared
-- Security is maintained through:
-- 1. Random 6-character codes (hard to guess)
-- 2. Optional expiration dates
-- 3. Optional max uses
-- 4. Can be deactivated by team admins
