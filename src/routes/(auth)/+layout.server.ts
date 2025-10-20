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

  return {
    session,
    user
  }
}
