/**
 * Onboarding Page - Server Logic
 * Constitutional Requirement: Every user MUST own at least one team (Principle II.5)
 * 
 * This page creates the user's first team during onboarding
 */

import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { TeamService } from '$lib/server/teams/team-service'
import { TeamJoinService } from '$lib/server/teams/join-service'

export const load: PageServerLoad = async ({ locals, url }) => {
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

  // Get join code from URL if present
  const joinCode = url.searchParams.get('joinCode') || ''

  return {
    user,
    userEmail,
    fullName,
    joinCode
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
    const joinCode = formData.get('joinCode')?.toString()?.toUpperCase().trim() || ''

    // Validate team name (1-100 characters per spec)
    if (!teamName || teamName.length < 1 || teamName.length > 100) {
      return fail(400, {
        error: 'Team name must be between 1 and 100 characters',
        teamName
      })
    }

    // CONSTITUTIONAL REQUIREMENT: Create personal team (permanent solo workspace)
    const teamService = new TeamService(locals.supabase)
    const { team, error: teamError } = await teamService.createTeam(
      userId,
      teamName,
      'My personal team on Cosplans',
      true // isPersonal = true
    )

    if (teamError || !team) {
      console.error('❌ Team creation error:', teamError)
      return fail(500, {
        error: teamError?.message || 'Failed to create team',
        teamName
      })
    }

    console.log('✅ Personal team created:', team.id)

    // OPTIONAL: Join another team with code
    let joinedTeamId = null
    if (joinCode && joinCode.length === 6) {
      const joinService = new TeamJoinService(locals.supabase)
      const result = await joinService.joinTeamWithCode(userId, joinCode)
      
      if (result.success) {
        joinedTeamId = result.teamId
        console.log('✅ Successfully joined team:', result.teamName)
      } else {
        console.log('❌ Failed to join team:', result.error)
        // Non-fatal - continue with onboarding even if join fails
      }
    }

    // Mark onboarding as complete and save display name
    // Use upsert to handle cases where profile might not exist
    const { error: profileError } = await locals.supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        display_name: displayName || null,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.error('❌ CRITICAL: Profile update error:', profileError)
      // This is critical - if profile isn't updated, user gets stuck in onboarding loop
      return fail(500, {
        error: 'Failed to complete onboarding. Please try again.',
        teamName
      })
    }

    console.log('✅ Onboarding complete - profile updated successfully')
    
    // Redirect to the joined team if they used a code, otherwise their personal team
    const redirectTeamId = joinedTeamId || team.id
    throw redirect(303, `/teams/${redirectTeamId}`)
  }
}
