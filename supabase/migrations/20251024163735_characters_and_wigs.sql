-- Create characters table
CREATE TABLE IF NOT EXISTS public.characters (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    character_name text NOT NULL,
    series text NOT NULL,
    source_medium text,
    appearance_description text,
    personality_notes text,
    aliases text, -- Comma-separated aliases
    reference_images text[] DEFAULT '{}', -- Array of R2 URLs
    budget_mode text DEFAULT 'personal' NOT NULL, -- 'personal' or 'commission'
    budget_limit numeric,
    completion_percentage numeric DEFAULT 0 NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT unique_character_name_series_per_team UNIQUE (team_id, character_name, series)
);

-- Index for search
CREATE INDEX IF NOT EXISTS characters_search_idx ON public.characters USING GIN (
    to_tsvector('english', character_name || ' ' || series || ' ' || coalesce(aliases, ''))
);

-- Index for team queries
CREATE INDEX IF NOT EXISTS characters_team_id_idx ON public.characters(team_id);

-- Create wigs table
CREATE TABLE IF NOT EXISTS public.wigs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    wig_name text NOT NULL,
    color text NOT NULL,
    length text NOT NULL, -- 'short', 'medium', 'long', 'extra_long'
    fiber_type text NOT NULL, -- 'synthetic', 'human_hair', 'blend'
    base_wig_brand text,
    status text DEFAULT 'planned' NOT NULL, -- 'planned', 'ordered', 'received', 'in_progress', 'completed', 'needs_restyling', 'damaged'
    base_wig_cost numeric DEFAULT 0,
    styling_cost numeric DEFAULT 0,
    total_cost numeric DEFAULT 0 NOT NULL,
    condition text, -- 'pristine', 'good', 'needs_care', 'damaged'
    last_washed_date timestamptz,
    maintenance_notes text,
    storage_location text,
    storage_method text,
    source_type text, -- 'purchased', 'commissioned', 'gifted'
    vendor_id uuid, -- FK to vendors table (nullable, vendors table doesn't exist yet)
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for search
CREATE INDEX IF NOT EXISTS wigs_search_idx ON public.wigs USING GIN (
    to_tsvector('english', wig_name || ' ' || color)
);

-- Index for team queries
CREATE INDEX IF NOT EXISTS wigs_team_id_idx ON public.wigs(team_id);

-- Create character_wigs junction table (many-to-many: characters <-> wigs)
CREATE TABLE IF NOT EXISTS public.character_wigs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    wig_id uuid NOT NULL REFERENCES public.wigs(id) ON DELETE CASCADE,
    notes text,
    created_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT unique_character_wig UNIQUE (character_id, wig_id)
);

-- Index for junction table queries
CREATE INDEX IF NOT EXISTS character_wigs_character_id_idx ON public.character_wigs(character_id);
CREATE INDEX IF NOT EXISTS character_wigs_wig_id_idx ON public.character_wigs(wig_id);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_wigs ENABLE ROW LEVEL SECURITY;

-- Characters policies
CREATE POLICY "Users can view characters in their teams"
    ON public.characters FOR SELECT
    USING (
        team_id IN (
            SELECT team_id FROM public.team_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert characters in their teams"
    ON public.characters FOR INSERT
    WITH CHECK (
        team_id IN (
            SELECT team_id FROM public.team_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update characters in their teams"
    ON public.characters FOR UPDATE
    USING (
        team_id IN (
            SELECT team_id FROM public.team_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team owners/admins can delete characters"
    ON public.characters FOR DELETE
    USING (
        team_id IN (
            SELECT team_id FROM public.team_members
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- Wigs policies (same pattern)
CREATE POLICY "Users can view wigs in their teams"
    ON public.wigs FOR SELECT
    USING (
        team_id IN (
            SELECT team_id FROM public.team_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert wigs in their teams"
    ON public.wigs FOR INSERT
    WITH CHECK (
        team_id IN (
            SELECT team_id FROM public.team_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update wigs in their teams"
    ON public.wigs FOR UPDATE
    USING (
        team_id IN (
            SELECT team_id FROM public.team_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team owners/admins can delete wigs"
    ON public.wigs FOR DELETE
    USING (
        team_id IN (
            SELECT team_id FROM public.team_members
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- Character_wigs junction table policies
CREATE POLICY "Users can view character-wig links in their teams"
    ON public.character_wigs FOR SELECT
    USING (
        character_id IN (
            SELECT id FROM public.characters
            WHERE team_id IN (
                SELECT team_id FROM public.team_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can insert character-wig links in their teams"
    ON public.character_wigs FOR INSERT
    WITH CHECK (
        character_id IN (
            SELECT id FROM public.characters
            WHERE team_id IN (
                SELECT team_id FROM public.team_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete character-wig links in their teams"
    ON public.character_wigs FOR DELETE
    USING (
        character_id IN (
            SELECT id FROM public.characters
            WHERE team_id IN (
                SELECT team_id FROM public.team_members
                WHERE user_id = auth.uid()
            )
        )
    );

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger to update updated_at timestamp for characters
CREATE OR REPLACE FUNCTION update_characters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER characters_updated_at
    BEFORE UPDATE ON public.characters
    FOR EACH ROW
    EXECUTE FUNCTION update_characters_updated_at();

-- Trigger to update updated_at timestamp for wigs
CREATE OR REPLACE FUNCTION update_wigs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wigs_updated_at
    BEFORE UPDATE ON public.wigs
    FOR EACH ROW
    EXECUTE FUNCTION update_wigs_updated_at();

-- Trigger to auto-calculate wig total_cost
CREATE OR REPLACE FUNCTION calculate_wig_total_cost()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_cost = COALESCE(NEW.base_wig_cost, 0) + COALESCE(NEW.styling_cost, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wigs_calculate_total_cost
    BEFORE INSERT OR UPDATE ON public.wigs
    FOR EACH ROW
    EXECUTE FUNCTION calculate_wig_total_cost();

