-- Migration 004: Teams Schema
-- Creates teams, team_members, and team_invitations tables with RLS policies

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
	description TEXT CHECK (description IS NULL OR length(description) <= 500),
	owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
	image_url TEXT,
	archived_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
	joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
	last_active TIMESTAMPTZ,
	custom_permissions JSONB NOT NULL DEFAULT '{}',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE(team_id, user_id)
);

-- Create team_invitations table
CREATE TABLE IF NOT EXISTS team_invitations (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
	email TEXT NOT NULL,
	role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
	token TEXT NOT NULL UNIQUE,
	invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	expires_at TIMESTAMPTZ NOT NULL CHECK (expires_at > created_at),
	accepted_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_archived_at ON teams(archived_at) WHERE archived_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_team_members_unique ON team_members(team_id, user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE UNIQUE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_team_id ON team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_expires_at ON team_invitations(expires_at);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
CREATE POLICY "Users can view their teams" ON teams FOR SELECT
	USING (id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can create teams" ON teams FOR INSERT
	WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their teams" ON teams FOR UPDATE
	USING (owner_id = auth.uid())
	WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete their teams" ON teams FOR DELETE
	USING (owner_id = auth.uid());

-- RLS Policies for team_members
CREATE POLICY "Users can view team members" ON team_members FOR SELECT
	USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Owners and admins can add members" ON team_members FOR INSERT
	WITH CHECK (team_id IN (
		SELECT team_id FROM team_members 
		WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
	));

CREATE POLICY "Owners and admins can update members" ON team_members FOR UPDATE
	USING (team_id IN (
		SELECT team_id FROM team_members 
		WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
	));

CREATE POLICY "Owners and admins can remove members" ON team_members FOR DELETE
	USING (team_id IN (
		SELECT team_id FROM team_members 
		WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
	));

-- RLS Policies for team_invitations
CREATE POLICY "Users can view team invitations" ON team_invitations FOR SELECT
	USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "Owners and admins can create invitations" ON team_invitations FOR INSERT
	WITH CHECK (team_id IN (
		SELECT team_id FROM team_members 
		WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
	));

CREATE POLICY "Anyone can accept invitations" ON team_invitations FOR UPDATE
	USING (true)
	WITH CHECK (accepted_at IS NOT NULL);

CREATE POLICY "Owners and admins can cancel invitations" ON team_invitations FOR DELETE
	USING (team_id IN (
		SELECT team_id FROM team_members 
		WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
	));

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at
	BEFORE UPDATE ON teams
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
	BEFORE UPDATE ON team_members
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();
