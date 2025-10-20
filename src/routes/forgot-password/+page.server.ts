import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  // Allow access to forgot password page regardless of auth state
  return {}
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData()
    const email = data.get('email')?.toString()

    // Basic validation
    if (!email) {
      return fail(400, {
        error: 'Email is required',
        email
      })
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return fail(400, {
        error: 'Please enter a valid email address',
        email
      })
    }

    try {
      const { data, error } = await locals.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${new URL(request.url).origin}/reset-password`
      })

      if (error) {
        console.error('Password reset error:', error)
        return fail(400, {
          error: getAuthErrorMessage(error),
          email
        })
      }

      return {
        success: true,
        message: 'Password reset email sent successfully!'
      }
    } catch (error) {
      console.error('Password reset error:', error)
      return fail(400, {
        error: 'An error occurred while sending the reset email',
        email
      })
    }
  }
}

const getAuthErrorMessage = (error: any) => {
  if (error?.message?.includes('Email not found')) {
    return 'No account found for this email'
  }

  if (error?.message?.includes('Too many requests')) {
    return 'Too many attempts. Please try again later'
  }

  return 'Unable to send reset email right now'
}
