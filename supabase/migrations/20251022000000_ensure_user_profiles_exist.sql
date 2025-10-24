-- Migration: Ensure all existing users have profiles
-- Fixes issue where users created before the profile trigger was added don't have profiles

-- Insert profiles for any users that don't have one yet
INSERT INTO public.user_profiles (id, onboarding_completed, onboarding_completed_at)
SELECT 
  au.id,
  TRUE, -- Assume existing users have completed onboarding
  NOW()
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL;

-- Log the result
DO $$
DECLARE
  inserted_count INTEGER;
BEGIN
  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RAISE NOTICE 'Created % user profiles for existing users', inserted_count;
END $$;
