import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
  const token = url.searchParams.get('token')

  if (!token) {
    throw redirect(302, '/forgot-password?error=no-token')
  }

  return {
    token
  }
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData()
    const password = data.get('password')?.toString()
    const confirmPassword = data.get('confirmPassword')?.toString()
    const token = data.get('token')?.toString()

    // Basic validation
    if (!password || !confirmPassword || !token) {
      return fail(400, {
        error: 'All fields are required',
        token
      })
    }

    if (password !== confirmPassword) {
      return fail(400, {
        error: 'Passwords do not match',
        token
      })
    }

    if (password.length < 6) {
      return fail(400, {
        error: 'Password must be at least 6 characters long',
        token
      })
    }

    try {
      const { data, error } = await locals.supabase.auth.updateUser({ password })

      if (error) {
        console.error('Password update error:', error)
        return fail(400, {
          error: getAuthErrorMessage(error),
          token
        })
      }

      throw redirect(302, '/login?message=password-updated')
    } catch (error) {
      // Re-throw redirects - they are NOT errors!
      if (error instanceof Response && error.status >= 300 && error.status < 400) {
        throw error
      }

      console.error('❌ Password update error:', error)
      return fail(400, {
        error: 'An error occurred while updating your password',
        token
      })
    }
  }
}

const getAuthErrorMessage = (error: any) => {
  if (error?.message?.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long'
  }

  if (error?.message?.includes('New password should be different')) {
    return 'New password must be different from the old one'
  }

  return 'Unable to update password right now'
}
