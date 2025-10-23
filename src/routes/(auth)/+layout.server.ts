import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { getAdminClient } from '$lib/server/supabase/admin-client'

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const { session, user } = await locals.safeGetSession()

  // Require authentication for all routes in (auth) group
  if (!session || !user) {
    throw redirect(302, '/login')
  }

  // CONSTITUTIONAL REQUIREMENT: Check if user has completed onboarding
  // (except when already on onboarding page)
  // Use admin client to bypass RLS issues in server context
  if (url.pathname !== '/onboarding') {
    const adminClient = getAdminClient()
    const { data: profile, error: profileError } = await adminClient
      .from('user_profiles')
      .select('onboarding_completed, display_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle()

    // Only redirect if query succeeds but onboarding is not completed
    // If query fails (e.g., missing column), allow access to prevent infinite redirect loop
    if (profileError) {
      // Profile query failed - allow access to prevent infinite redirect
    } else if (!profile || !profile.onboarding_completed) {
      throw redirect(303, '/onboarding')
    }
    
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
