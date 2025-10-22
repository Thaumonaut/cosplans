import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { getAdminClient } from '$lib/server/supabase/admin-client'

export const load: LayoutServerLoad = async ({ locals, url }) => {
  console.log('Auth layout loading for:', url.pathname)
  
  const { session, user } = await locals.safeGetSession()

  console.log('Auth check - Session exists:', !!session, 'User exists:', !!user)

  // Require authentication for all routes in (auth) group
  if (!session || !user) {
    console.log('No session/user found, redirecting to login')
    throw redirect(302, '/login')
  }

  console.log('Auth check passed for user:', user.email)

  // CONSTITUTIONAL REQUIREMENT: Check if user has completed onboarding
  // (except when already on onboarding page)
  // Use admin client to bypass RLS issues in server context
  if (url.pathname !== '/onboarding') {
    const adminClient = getAdminClient()
    const { data: profile } = await adminClient
      .from('user_profiles')
      .select('onboarding_completed, display_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile || !profile.onboarding_completed) {
      console.log('Onboarding not completed, redirecting to onboarding')
      throw redirect(303, '/onboarding')
    }
    
    console.log('Onboarding completed, allowing access to:', url.pathname)
    
    // Return profile data for client-side use
    return {
      session,
      user,
      profile
    }
  }

  // On onboarding page, don't fetch profile
  return {
    session,
    user,
    profile: null
  }
}
