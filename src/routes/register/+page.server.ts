import { fail, redirect } from '@sveltejs/kit'

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
    const confirmPassword = data.get('confirmPassword')?.toString()
    const firstName = data.get('firstName')?.toString()
    const lastName = data.get('lastName')?.toString()

    // Basic validation
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return fail(400, {
        error: 'All fields are required',
        email,
        firstName,
        lastName
      })
    }

    if (password !== confirmPassword) {
      return fail(400, {
        error: 'Passwords do not match',
        email,
        firstName,
        lastName
      })
    }

    if (password.length < 6) {
      return fail(400, {
        error: 'Password must be at least 6 characters long',
        email,
        firstName,
        lastName
      })
    }

    try {
      // Use the Supabase client from locals (set up in hooks.server.ts)
      const { data, error } = await locals.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      })

      if (error) {
        console.error('Signup error:', error)
        return fail(400, {
          error: getAuthErrorMessage(error),
          email,
          firstName,
          lastName
        })
      }

      return {
        success: true,
        message: 'Account created successfully! Please check your email for verification.'
      }
    } catch (error) {
      console.error('Signup error:', error)
      return fail(400, {
        error: 'An error occurred during registration',
        email,
        firstName,
        lastName
      })
    }
  }
}

// Helper function to get user-friendly error messages
function getAuthErrorMessage(error: any) {
  if (error?.message?.includes('User already registered')) {
    return 'An account with this email already exists'
  }

  if (error?.message?.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long'
  }

  return 'Registration failed. Please try again'
}
