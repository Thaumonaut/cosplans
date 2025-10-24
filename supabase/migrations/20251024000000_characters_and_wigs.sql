-- Migration: Characters and Wigs Tables
-- Feature: Spec 048 - Character-Centric Resource Model
-- Created: 2025-10-24
-- Description: Creates characters, wigs, and character_wigs junction tables with RLS policies

-- ============================================================================
-- CHARACTERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    
    -- Character Information
    character_name TEXT NOT NULL,
    series TEXT NOT NULL,
    source_medium TEXT CHECK (source_medium IN ('anime', 'manga', 'video_game', 'movie', 'tv_show', 'book', 'comic', 'stage', 'original')),
    appearance_description TEXT,
    personality_notes TEXT,
    aliases TEXT, -- Comma-separated aliases for search
    
    -- Reference Images (R2 URLs)
    reference_images TEXT[] DEFAULT '{}',
    
    -- Budget Tracking
    budget_mode TEXT NOT NULL DEFAULT 'personal' CHECK (budget_mode IN ('personal', 'commission')),
    budget_limit NUMERIC(10, 2),
    
    -- Completion Tracking
    completion_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(character_name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(series, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(aliases, '')), 'C')
    ) STORED,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ
);

-- Indexes for characters
CREATE INDEX IF NOT EXISTS idx_characters_team_id ON public.characters(team_id);
CREATE INDEX IF NOT EXISTS idx_characters_series ON public.characters(series);
CREATE INDEX IF NOT EXISTS idx_characters_source_medium ON public.characters(source_medium);
CREATE INDEX IF NOT EXISTS idx_characters_search_vector ON public.characters USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_characters_deleted_at ON public.characters(deleted_at) WHERE deleted_at IS NULL;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_characters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_characters_updated_at
    BEFORE UPDATE ON public.characters
    FOR EACH ROW
    EXECUTE FUNCTION update_characters_updated_at();

-- ============================================================================
-- WIGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    
    -- Wig Information
    wig_name TEXT NOT NULL,
    color TEXT NOT NULL,
    length TEXT NOT NULL CHECK (length IN ('short', 'medium', 'long', 'extra_long')),
    fiber_type TEXT NOT NULL CHECK (fiber_type IN ('synthetic', 'human_hair', 'blend')),
    base_wig_brand TEXT,
    
    -- Status & Condition
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'ordered', 'received', 'in_progress', 'completed', 'needs_restyling', 'damaged')),
    condition TEXT CHECK (condition IN ('pristine', 'good', 'needs_care', 'damaged')),
    
    -- Cost Tracking
    base_wig_cost NUMERIC(10, 2),
    styling_cost NUMERIC(10, 2),
    total_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    
    -- Maintenance
    last_washed_date TIMESTAMPTZ,
    maintenance_notes TEXT,
    
    -- Storage
    storage_location TEXT,
    storage_method TEXT,
    
    -- Sourcing
    source_type TEXT,
    vendor_id UUID, -- FK to vendors table (nullable, vendors table doesn't exist yet)
    
    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(wig_name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(color, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(base_wig_brand, '')), 'C')
    ) STORED,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ
);

-- Indexes for wigs
CREATE INDEX IF NOT EXISTS idx_wigs_team_id ON public.wigs(team_id);
CREATE INDEX IF NOT EXISTS idx_wigs_status ON public.wigs(status);
CREATE INDEX IF NOT EXISTS idx_wigs_color ON public.wigs(color);
CREATE INDEX IF NOT EXISTS idx_wigs_length ON public.wigs(length);
CREATE INDEX IF NOT EXISTS idx_wigs_search_vector ON public.wigs USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_wigs_deleted_at ON public.wigs(deleted_at) WHERE deleted_at IS NULL;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_wigs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wigs_updated_at
    BEFORE UPDATE ON public.wigs
    FOR EACH ROW
    EXECUTE FUNCTION update_wigs_updated_at();

-- ============================================================================
-- CHARACTER_WIGS JUNCTION TABLE (Many-to-Many)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.character_wigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    wig_id UUID NOT NULL REFERENCES public.wigs(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Ensure unique character-wig pairs
    UNIQUE(character_id, wig_id)
);

-- Indexes for character_wigs
CREATE INDEX IF NOT EXISTS idx_character_wigs_character_id ON public.character_wigs(character_id);
CREATE INDEX IF NOT EXISTS idx_character_wigs_wig_id ON public.character_wigs(wig_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_wigs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CHARACTERS RLS POLICIES
-- ============================================================================

-- SELECT: Team members can view characters in their teams
CREATE POLICY "characters_select_policy"
    ON public.characters
    FOR SELECT
    USING (
        team_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- INSERT: Team members can create characters in their teams
CREATE POLICY "characters_insert_policy"
    ON public.characters
    FOR INSERT
    WITH CHECK (
        team_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- UPDATE: Team members can update characters in their teams
CREATE POLICY "characters_update_policy"
    ON public.characters
    FOR UPDATE
    USING (
        team_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        team_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- DELETE: Team owners and admins can delete characters
CREATE POLICY "characters_delete_policy"
    ON public.characters
    FOR DELETE
    USING (
        team_id IN (
            SELECT tm.team_id 
            FROM public.team_members tm
            JOIN public.teams t ON tm.team_id = t.id
            WHERE tm.user_id = auth.uid()
            AND (t.owner_id = auth.uid() OR tm.role = 'admin')
        )
    );

-- ============================================================================
-- WIGS RLS POLICIES
-- ============================================================================

-- SELECT: Team members can view wigs in their teams
CREATE POLICY "wigs_select_policy"
    ON public.wigs
    FOR SELECT
    USING (
        team_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- INSERT: Team members can create wigs in their teams
CREATE POLICY "wigs_insert_policy"
    ON public.wigs
    FOR INSERT
    WITH CHECK (
        team_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- UPDATE: Team members can update wigs in their teams
CREATE POLICY "wigs_update_policy"
    ON public.wigs
    FOR UPDATE
    USING (
        team_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        team_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- DELETE: Team owners and admins can delete wigs
CREATE POLICY "wigs_delete_policy"
    ON public.wigs
    FOR DELETE
    USING (
        team_id IN (
            SELECT tm.team_id 
            FROM public.team_members tm
            JOIN public.teams t ON tm.team_id = t.id
            WHERE tm.user_id = auth.uid()
            AND (t.owner_id = auth.uid() OR tm.role = 'admin')
        )
    );

-- ============================================================================
-- CHARACTER_WIGS RLS POLICIES
-- ============================================================================

-- SELECT: Team members can view character-wig links if they can see either the character or wig
CREATE POLICY "character_wigs_select_policy"
    ON public.character_wigs
    FOR SELECT
    USING (
        character_id IN (SELECT id FROM public.characters WHERE team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        ))
        OR
        wig_id IN (SELECT id FROM public.wigs WHERE team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        ))
    );

-- INSERT: Team members can create links if they can access both character and wig
CREATE POLICY "character_wigs_insert_policy"
    ON public.character_wigs
    FOR INSERT
    WITH CHECK (
        character_id IN (SELECT id FROM public.characters WHERE team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        ))
        AND
        wig_id IN (SELECT id FROM public.wigs WHERE team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        ))
    );

-- UPDATE: Team members can update links if they can access both character and wig
CREATE POLICY "character_wigs_update_policy"
    ON public.character_wigs
    FOR UPDATE
    USING (
        character_id IN (SELECT id FROM public.characters WHERE team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        ))
        AND
        wig_id IN (SELECT id FROM public.wigs WHERE team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        ))
    );

-- DELETE: Team members can delete links if they can access either character or wig
CREATE POLICY "character_wigs_delete_policy"
    ON public.character_wigs
    FOR DELETE
    USING (
        character_id IN (SELECT id FROM public.characters WHERE team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        ))
        OR
        wig_id IN (SELECT id FROM public.wigs WHERE team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        ))
    );

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE public.characters IS 'Character-centric resource hub for cosplay planning (Spec 048)';
COMMENT ON TABLE public.wigs IS 'Wig tracking with styling, maintenance, and cost management (Spec 048)';
COMMENT ON TABLE public.character_wigs IS 'Many-to-many junction table linking characters to wigs (Spec 048)';

COMMENT ON COLUMN public.characters.completion_percentage IS 'Auto-calculated: (completed resources / total resources) × 100';
COMMENT ON COLUMN public.characters.budget_mode IS 'Personal (with limits) or Commission (billable hours + markup)';
COMMENT ON COLUMN public.wigs.total_cost IS 'Auto-calculated: base_wig_cost + styling_cost';

