import { fail, redirect } from '@sveltejs/kit'
import { createSupabaseServerClient } from '$lib/server/auth'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  // If user is not authenticated, redirect to login
  if (!locals.user) {
    throw redirect(302, '/login')
  }

  // If user already has completed onboarding, redirect to dashboard
  // TODO: Check if user has a team or onboarding completion status

  return {
    user: locals.user
  }
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    // Ensure user is authenticated
    if (!locals.user) {
      throw redirect(302, '/login')
    }

    const data = await request.formData()
    const teamName = data.get('teamName')?.toString() || 'My Team'
    const displayName = data.get('displayName')?.toString()
    const bio = data.get('bio')?.toString()
    const isPublicProfile = data.get('isPublicProfile') === 'on'

    try {
      const supabase = createSupabaseServerClient({
        cookies: {
          get: (name: string) => {
            // This is a simplified implementation
            // In a real app, you'd need proper cookie handling
            return undefined
          },
          set: (name: string, value: string, options: any) => {
            // Simplified implementation
          },
          remove: (name: string, options: any) => {
            // Simplified implementation
          }
        }
      } as any)

      // Update user profile
      const { error: profileError } = await supabase
        .from('users')
        .update({
          first_name: displayName?.split(' ')[0] || locals.user?.first_name,
          last_name: displayName?.split(' ').slice(1).join(' ') || locals.user?.last_name,
          bio: bio || locals.user?.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', locals.user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
        return fail(500, {
          error: 'Failed to update profile',
          teamName,
          displayName,
          bio,
          isPublicProfile
        })
      }

      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamName,
          owner_id: locals.user.id,
          description: `Team created by ${locals.user?.first_name || 'user'}`
        })
        .select()
        .single()

      if (teamError) {
        console.error('Team creation error:', teamError)
        return fail(500, {
          error: 'Failed to create team',
          teamName,
          displayName,
          bio,
          isPublicProfile
        })
      }

      // Add user as team owner
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamData.id,
          user_id: locals.user.id,
          role_id: 'owner' // Assuming 'owner' role exists
        })

      if (memberError) {
        console.error('Team member creation error:', memberError)
        return fail(500, {
          error: 'Failed to add user to team',
          teamName,
          displayName,
          bio,
          isPublicProfile
        })
      }

      // Mark onboarding as complete (you might want to add an onboarding_status field to users table)
      // For now, we'll just redirect to dashboard

      return {
        success: true,
        message: 'Setup complete! Welcome to Cosplans!'
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      return fail(500, {
        error: 'An unexpected error occurred',
        teamName,
        displayName,
        bio,
        isPublicProfile
      })
    }
  }
}
