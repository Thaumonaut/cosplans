-- Create team_join_links table for shareable join links and codes
CREATE TABLE IF NOT EXISTS team_join_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE, -- For shareable links
    code TEXT UNIQUE, -- Short code for manual entry (e.g., "ABC123")
    created_by UUID NOT NULL REFERENCES auth.users(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    max_uses INTEGER, -- NULL = unlimited
    current_uses INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE, -- NULL = never expires
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_team_join_links_team_id ON team_join_links(team_id);
CREATE INDEX idx_team_join_links_token ON team_join_links(token);
CREATE INDEX idx_team_join_links_code ON team_join_links(code) WHERE code IS NOT NULL;
CREATE INDEX idx_team_join_links_active ON team_join_links(is_active) WHERE is_active = true;

-- Add RLS policies
ALTER TABLE team_join_links ENABLE ROW LEVEL SECURITY;

-- Team members can view their team's join links
CREATE POLICY "Team members can view team join links"
    ON team_join_links
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.team_id = team_join_links.team_id
            AND team_members.user_id = auth.uid()
        )
    );

-- Only owners and admins can create join links
CREATE POLICY "Owners and admins can create join links"
    ON team_join_links
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.team_id = team_join_links.team_id
            AND team_members.user_id = auth.uid()
            AND team_members.role IN ('owner', 'admin')
        )
    );

-- Only owners and admins can update join links
CREATE POLICY "Owners and admins can update join links"
    ON team_join_links
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.team_id = team_join_links.team_id
            AND team_members.user_id = auth.uid()
            AND team_members.role IN ('owner', 'admin')
        )
    );

-- Only owners and admins can delete join links
CREATE POLICY "Owners and admins can delete join links"
    ON team_join_links
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.team_id = team_join_links.team_id
            AND team_members.user_id = auth.uid()
            AND team_members.role IN ('owner', 'admin')
        )
    );

-- Function to generate short join codes (6 characters, alphanumeric)
CREATE OR REPLACE FUNCTION generate_join_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Exclude similar looking chars
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Add comment
COMMENT ON TABLE team_join_links IS 'Shareable join links and codes for teams. Supports both URL tokens and short codes for easy sharing.';
