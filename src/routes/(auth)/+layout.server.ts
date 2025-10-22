import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

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

  // Fetch user profile for display name and onboarding status
  const { data: profile } = await locals.supabase
    .from('user_profiles')
    .select('onboarding_completed, display_name, avatar_url')
    .eq('id', user.id)
    .single()

  // CONSTITUTIONAL REQUIREMENT: Check if user has completed onboarding
  // (except when already on onboarding page)
  if (url.pathname !== '/onboarding') {
    if (!profile || !profile.onboarding_completed) {
      console.log('Onboarding not completed, redirecting to onboarding')
      throw redirect(303, '/onboarding')
    }
  }

  return {
    session,
    user,
    profile
  }
}
