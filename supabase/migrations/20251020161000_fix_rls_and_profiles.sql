-- Fix RLS policies and create missing user profiles

-- 1. Fix team_members RLS to prevent infinite recursion
DROP POLICY IF EXISTS "Users can view team members" ON team_members;

-- Simple policy: users can only see their own memberships
CREATE POLICY "Users can view team members" ON team_members FOR SELECT
	USING (user_id = auth.uid());

-- 2. Create user_profiles for all existing auth users who don't have one
INSERT INTO public.user_profiles (id, onboarding_completed)
SELECT id, false 
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;
