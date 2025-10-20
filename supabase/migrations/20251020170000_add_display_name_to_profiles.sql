-- Add display_name to user_profiles
-- Users provide this during onboarding

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Create index for display name searches
CREATE INDEX IF NOT EXISTS idx_user_profiles_display_name ON public.user_profiles(display_name);
