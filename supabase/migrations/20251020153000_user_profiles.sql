-- Migration: User Profiles
-- Creates user_profiles table for storing user metadata including onboarding status
-- Constitutional requirement: Track onboarding completion for team ownership requirement

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
	id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
	onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
	onboarding_completed_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for onboarding queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON public.user_profiles(onboarding_completed);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
-- Users can only view and update their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT
	USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE
	USING (id = auth.uid())
	WITH CHECK (id = auth.uid());

-- System can insert profiles (for new user creation)
CREATE POLICY "System can insert profiles" ON public.user_profiles FOR INSERT
	WITH CHECK (id = auth.uid());

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
	BEFORE UPDATE ON public.user_profiles
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
	INSERT INTO public.user_profiles (id)
	VALUES (NEW.id)
	ON CONFLICT (id) DO NOTHING;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
	AFTER INSERT ON auth.users
	FOR EACH ROW
	EXECUTE FUNCTION public.handle_new_user();
