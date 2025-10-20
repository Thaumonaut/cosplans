import { fail, redirect } from '@sveltejs/kit'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

// @ts-ignore - SvelteKit types
export const load = async ({ locals }: any) => {
  // If already authenticated, redirect to dashboard
  const { session } = await locals.safeGetSession()
  if (session) {
    throw redirect(302, '/dashboard')
  }
  return {}
}

// @ts-ignore - SvelteKit types
export const actions = {
  default: async ({ request, locals }: any) => {
    const data = await request.formData()
    const email = data.get('email')?.toString()
    const password = data.get('password')?.toString()
    const rememberMe = data.get('rememberMe') === 'on'

    // Basic validation
    if (!email || !password) {
      return fail(400, {
        error: 'Email and password are required',
        email
      })
    }

    try {
      // Use the Supabase client from locals (set up in hooks.server.ts)
      const { data: authData, error } = await locals.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Login error:', error)
        return fail(400, {
          error: getAuthErrorMessage(error),
          email
        })
      }

      if (!authData.session) {
        console.error('Login succeeded but no session returned')
        return fail(400, {
          error: 'Login failed - no session created',
          email
        })
      }

      console.log('Login successful, session created:', authData.session.user.email)

      // Redirect to dashboard on successful login
      throw redirect(303, '/dashboard')
    } catch (error: any) {
      // Don't catch redirect errors
      if (error?.status === 303 || error?.status === 302) {
        throw error
      }
      
      console.error('Login error:', error)
      return fail(400, {
        error: 'An error occurred during login',
        email
      })
    }
  }
}

// Helper function to get user-friendly error messages
function getAuthErrorMessage(error: any) {
  if (error?.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password'
  }

  if (error?.message?.includes('Email not confirmed')) {
    return 'Please check your email and click the confirmation link'
  }

  if (error?.message?.includes('Too many requests')) {
    return 'Too many attempts. Please try again later'
  }

  return 'Login failed. Please try again'
}
