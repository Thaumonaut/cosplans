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

    // Validate password strength (Supabase requirements)
    if (password.length < 8) {
      return fail(400, {
        error: 'Password must be at least 8 characters long',
        email,
        firstName,
        lastName
      })
    }

    // Check for required character types
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)

    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecial) {
      return fail(400, {
        error: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
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

      // If email confirmation is disabled, user is signed in immediately
      // Redirect to onboarding to create their first team (Constitutional requirement)
      if (data.session) {
        console.log('✅ User signed up and auto-signed in, redirecting to onboarding')
        throw redirect(303, '/onboarding')
      }

      // If email confirmation is required, show success message
      return {
        success: true,
        message: 'Account created successfully! Please check your email for verification.'
      }
    } catch (error) {
      // If it's a redirect, re-throw it (don't log as error)
      if (error instanceof Response && error.status >= 300 && error.status < 400) {
        throw error
      }

      console.error('❌ Signup error:', error)
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

  if (error?.code === 'weak_password' || error?.message?.includes('Password should contain')) {
    return 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
  }

  if (error?.message?.includes('Password should be at least')) {
    return 'Password must be at least 8 characters long'
  }

  return 'Registration failed. Please try again'
}
