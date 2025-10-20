/**
 * Onboarding Page - Server Logic
 * Constitutional Requirement: Every user MUST own at least one team (Principle II.5)
 * 
 * This page creates the user's first team during onboarding
 */

import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { TeamService } from '$lib/server/teams/team-service'

export const load: PageServerLoad = async ({ locals }) => {
  // SECURITY: Use safeGetSession which validates JWT via getUser()
  const { session, user } = await locals.safeGetSession()

  // If user is not authenticated, redirect to login
  if (!session || !user) {
    throw redirect(302, '/login')
  }

  const userId = user.id

  // Check if user has completed onboarding
  const { data: profile } = await locals.supabase
    .from('user_profiles')
    .select('onboarding_completed')
    .eq('id', userId)
    .single()

  if (profile?.onboarding_completed) {
    throw redirect(302, '/dashboard')
  }

  // Get user metadata for default values
  const userEmail = user.email || ''
  const userMetadata = user.user_metadata || {}
  
  // Try to get full name from various OAuth provider formats
  let fullName = userMetadata.full_name || userMetadata.name || ''
  
  // If no full_name, try to construct from first/last name
  if (!fullName) {
    const firstName = userMetadata.first_name || userMetadata.firstName || ''
    const lastName = userMetadata.last_name || userMetadata.lastName || ''
    fullName = `${firstName} ${lastName}`.trim()
  }

  return {
    user,
    userEmail,
    fullName
  }
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    // SECURITY: Use safeGetSession which validates JWT via getUser()
    const { session, user } = await locals.safeGetSession()

    // Ensure user is authenticated
    if (!session || !user) {
      throw redirect(302, '/login')
    }

    const userId = user.id
    const formData = await request.formData()
    const teamName = formData.get('teamName')?.toString()?.trim() || `${user.email}'s Team`
    const displayName = formData.get('displayName')?.toString()?.trim() || ''
    const bio = formData.get('bio')?.toString()?.trim() || ''

    // Validate team name (1-100 characters per spec)
    if (!teamName || teamName.length < 1 || teamName.length > 100) {
      return fail(400, {
        error: 'Team name must be between 1 and 100 characters',
        teamName
      })
    }

    // Use TeamService to create team (includes validation, rollback, and constitutional compliance)
    const teamService = new TeamService(locals.supabase)
    const { team, error: teamError } = await teamService.createTeam(
      userId,
      teamName,
      'My first team on Cosplans'
    )

    if (teamError || !team) {
      console.error('❌ Team creation error:', teamError)
      return fail(500, {
        error: teamError?.message || 'Failed to create team',
        teamName
      })
    }

    // Mark onboarding as complete and save display name
    const { error: profileError } = await locals.supabase
      .from('user_profiles')
      .update({
        display_name: displayName || null,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (profileError) {
      console.error('⚠️ Profile update error:', profileError)
      // Non-fatal - team was created successfully
    }

    console.log('✅ Onboarding complete, redirecting to team:', team.id)
    
    // Redirect to the newly created team
    throw redirect(303, `/teams/${team.id}`)
  }
}
