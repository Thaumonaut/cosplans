import { redirect } from '@sveltejs/kit'
import { createServerClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const error_description = url.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, error_description)
    throw redirect(302, `/login?error=${encodeURIComponent(error_description || error)}`)
  }

  if (!code) {
    throw redirect(302, '/login?error=No authorization code received')
  }

  try {
    // Create Supabase server client (same pattern as hooks.server.ts)
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        getAll: () => cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, { ...options, path: '/' })
          })
        }
      }
    })

    // Exchange code for session
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error('Session exchange error:', sessionError)
      throw redirect(302, `/login?error=${encodeURIComponent(sessionError.message)}`)
    }

    // Redirect to dashboard on successful authentication
    throw redirect(302, '/dashboard')
  } catch (error) {
    console.error('OAuth callback error:', error)
    throw redirect(302, '/login?error=Authentication failed')
  }
}
