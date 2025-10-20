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
    const joinCode = formData.get('joinCode')?.toString()?.toUpperCase().trim() || ''

    // Validate team name (1-100 characters per spec)
    if (!teamName || teamName.length < 1 || teamName.length > 100) {
      return fail(400, {
        error: 'Team name must be between 1 and 100 characters',
        teamName
      })
    }

    // CONSTITUTIONAL REQUIREMENT: Create personal team (user must own at least one team)
    const teamService = new TeamService(locals.supabase)
    const { team, error: teamError } = await teamService.createTeam(
      userId,
      teamName,
      'My personal team on Cosplans'
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
      console.log('🔍 Attempting to join team with code:', joinCode)

      // Find join link by code
      const { data: joinLink, error: linkError } = await locals.supabase
        .from('team_join_links')
        .select(`
          *,
          teams!inner(id, name)
        `)
        .eq('code', joinCode)
        .eq('is_active', true)
        .single()

      if (joinLink && !linkError) {
        // Check if expired
        const isExpired = joinLink.expires_at && new Date(joinLink.expires_at) < new Date()
        
        // Check max uses
        const maxUsesReached = joinLink.max_uses && joinLink.current_uses >= joinLink.max_uses
        
        // Check if already a member
        const { data: existingMember } = await locals.supabase
          .from('team_members')
          .select('id')
          .eq('team_id', joinLink.team_id)
          .eq('user_id', userId)
          .single()

        if (!isExpired && !maxUsesReached && !existingMember) {
          // Add user to team
          const { error: memberError } = await locals.supabase.from('team_members').insert({
            team_id: joinLink.team_id,
            user_id: userId,
            role: 'member',
            joined_at: new Date().toISOString()
          })

          if (!memberError) {
            // Increment use count
            await locals.supabase
              .from('team_join_links')
              .update({ current_uses: joinLink.current_uses + 1 })
              .eq('id', joinLink.id)

            joinedTeamId = joinLink.team_id
            console.log('✅ Also joined team via code:', joinedTeamId)
          }
        }
      }
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

    console.log('✅ Onboarding complete')
    
    // Redirect to the joined team if they used a code, otherwise their personal team
    const redirectTeamId = joinedTeamId || team.id
    throw redirect(303, `/teams/${redirectTeamId}`)
  },

  // Legacy action for backward compatibility (can be removed later)
  joinTeam: async ({ request, locals }) => {
    // SECURITY: Use safeGetSession which validates JWT via getUser()
    const { session, user } = await locals.safeGetSession()

    // Ensure user is authenticated
    if (!session || !user) {
      throw redirect(302, '/login')
    }

    const userId = user.id
    const formData = await request.formData()
    const code = formData.get('joinCode')?.toString()?.toUpperCase().trim()
    const displayName = formData.get('displayName')?.toString()?.trim() || ''

    if (!code || code.length !== 6) {
      return fail(400, { error: 'Please enter a valid 6-character join code' })
    }

    // Find join link by code
    const { data: joinLink, error: linkError } = await locals.supabase
      .from('team_join_links')
      .select(`
        *,
        teams!inner(id, name)
      `)
      .eq('code', code)
      .eq('is_active', true)
      .single()

    if (linkError || !joinLink) {
      return fail(404, { error: 'Invalid join code. Please check the code and try again.' })
    }

    // Check if expired
    if (joinLink.expires_at) {
      const expiresAt = new Date(joinLink.expires_at)
      if (expiresAt < new Date()) {
        return fail(400, { error: 'This join code has expired' })
      }
    }

    // Check max uses
    if (joinLink.max_uses && joinLink.current_uses >= joinLink.max_uses) {
      return fail(400, { error: 'This join code has reached its maximum number of uses' })
    }

    // Check if already a member
    const { data: existingMember } = await locals.supabase
      .from('team_members')
      .select('id')
      .eq('team_id', joinLink.team_id)
      .eq('user_id', userId)
      .single()

    if (existingMember) {
      return fail(400, { error: `You are already a member of ${joinLink.teams.name}` })
    }

    // Add user to team
    const { error: memberError } = await locals.supabase.from('team_members').insert({
      team_id: joinLink.team_id,
      user_id: userId,
      role: 'member',
      joined_at: new Date().toISOString()
    })

    if (memberError) {
      console.error('Error adding team member:', memberError)
      return fail(500, { error: 'Failed to join team' })
    }

    // Increment use count
    await locals.supabase
      .from('team_join_links')
      .update({ current_uses: joinLink.current_uses + 1 })
      .eq('id', joinLink.id)

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
    }

    console.log('✅ Onboarding complete via join code, redirecting to team:', joinLink.team_id)
    
    // Redirect to the joined team
    throw redirect(303, `/teams/${joinLink.team_id}`)
  }
}
