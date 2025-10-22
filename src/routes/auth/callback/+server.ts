import { redirect } from '@sveltejs/kit'
import { createServerClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, cookies }) => {
  console.log('🔐 Auth callback triggered')
  
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const error_description = url.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, error_description)
    throw redirect(302, `/login?error=${encodeURIComponent(error_description || error)}`)
  }

  if (!code) {
    console.error('No authorization code received')
    throw redirect(302, '/login?error=No authorization code received')
  }

  console.log('📝 Exchanging code for session...')
  
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

    console.log('✅ Session created for user:', data.user?.email)
    console.log('📋 User metadata:', JSON.stringify(data.user?.user_metadata, null, 2))

    // Check if user has completed onboarding (Constitutional requirement: must own a team)
    if (data.user) {
      console.log('🔍 Checking onboarding status...')
      
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', data.user.id)
        .single()

      console.log('Profile data:', profile, 'Error:', profileError)

      // Redirect to onboarding if not completed or profile doesn't exist
      if (!profile || !profile.onboarding_completed) {
        console.log('🎯 Redirecting to onboarding (profile:', !!profile, 'completed:', profile?.onboarding_completed, ')')
        // Use 303 See Other to force a GET request and prevent any POST data from being resubmitted
        return new Response(null, {
          status: 303,
          headers: {
            location: '/onboarding'
          }
        })
      }
      
      console.log('✅ Onboarding already completed')
    }

    // Redirect to dashboard on successful authentication
    console.log('🏠 Redirecting to dashboard')
    return new Response(null, {
      status: 303,
      headers: {
        location: '/dashboard'
      }
    })
  } catch (error) {
    // Re-throw redirects - SvelteKit redirects are Response objects with status 3xx
    if (error instanceof Response) {
      console.log('✅ Re-throwing redirect response:', error.status, error.headers.get('location'))
      throw error
    }
    
    console.error('❌ OAuth callback error:', error)
    throw redirect(302, '/login?error=Authentication failed')
  }
}
