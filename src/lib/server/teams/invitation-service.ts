/**
 * InvitationService - Team invitation management
 * Handles creating, accepting, and managing team invitations
 * 
 * Security: Uses cryptographically secure tokens with 7-day expiration
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { TeamInvitation, InvitationRole } from '$lib/types/teams';

export class InvitationService {
	constructor(private supabase: SupabaseClient) {}

	/**
	 * Create a team invitation
	 * Generates secure token and sets 7-day expiration
	 * 
	 * @param teamId - ID of the team
	 * @param email - Email of the invitee
	 * @param role - Role to assign (admin or member)
	 * @param invitedBy - ID of the user sending the invitation
	 * @returns Created invitation
	 */
	async createInvitation(
		teamId: string,
		email: string,
		role: InvitationRole,
		invitedBy: string
	): Promise<{ invitation: TeamInvitation | null; error: Error | null }> {
		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return {
				invitation: null,
				error: new Error('Invalid email format')
			};
		}

		// Prevent self-invitation
		const { data: inviter } = await this.supabase.auth.getUser();
		if (inviter?.user?.email === email) {
			return {
				invitation: null,
				error: new Error('You cannot invite yourself to a team')
			};
		}

		// Check if user is already a member
		const { data: existingMember } = await this.supabase
			.from('team_members')
			.select('id, user_id')
			.eq('team_id', teamId)
			.eq('user_id', inviter?.user?.id || '')
			.single();

		if (existingMember) {
			return {
				invitation: null,
				error: new Error('User is already a member of this team')
			};
		}

		// Generate secure token
		const token = crypto.randomUUID();

		// Set expiration to 7 days from now
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		// Create invitation
		const { data: invitation, error } = await this.supabase
			.from('team_invitations')
			.insert({
				team_id: teamId,
				email: email.toLowerCase(), // Normalize email
				role,
				token,
				invited_by: invitedBy,
				expires_at: expiresAt.toISOString()
			})
			.select()
			.single();

		if (error || !invitation) {
			return {
				invitation: null,
				error: error || new Error('Failed to create invitation')
			};
		}

		return { invitation, error: null };
	}

	/**
	 * Accept a team invitation
	 * Validates token, expiration, and adds user to team
	 * 
	 * @param token - Invitation token
	 * @param userId - ID of the user accepting the invitation
	 * @returns Success status
	 */
	async acceptInvitation(
		token: string,
		userId: string
	): Promise<{ success: boolean; teamId: string | null; error: Error | null }> {
		// Find invitation by token
		const { data: invitation, error: inviteError } = await this.supabase
			.from('team_invitations')
			.select('*')
			.eq('token', token)
			.single();

		if (inviteError || !invitation) {
			return {
				success: false,
				teamId: null,
				error: new Error('Invalid invitation token')
			};
		}

		// Check if already accepted
		if (invitation.accepted_at) {
			return {
				success: false,
				teamId: null,
				error: new Error('This invitation has already been accepted')
			};
		}

		// Check if expired
		const now = new Date();
		const expiresAt = new Date(invitation.expires_at);
		if (now > expiresAt) {
			return {
				success: false,
				teamId: null,
				error: new Error('This invitation has expired')
			};
		}

		// Verify user email matches invitation email
		const { data: user } = await this.supabase.auth.getUser();
		if (user?.user?.email?.toLowerCase() !== invitation.email.toLowerCase()) {
			return {
				success: false,
				teamId: null,
				error: new Error('This invitation was sent to a different email address')
			};
		}

		// Add user to team_members
		const { error: memberError } = await this.supabase.from('team_members').insert({
			team_id: invitation.team_id,
			user_id: userId,
			role: invitation.role,
			invited_by: invitation.invited_by
		});

		if (memberError) {
			return {
				success: false,
				teamId: null,
				error: new Error('Failed to add user to team')
			};
		}

		// Mark invitation as accepted
		const { error: updateError } = await this.supabase
			.from('team_invitations')
			.update({ accepted_at: new Date().toISOString() })
			.eq('id', invitation.id);

		if (updateError) {
			// Non-fatal error - user was added successfully
			console.error('Failed to mark invitation as accepted:', updateError);
		}

		return { success: true, teamId: invitation.team_id, error: null };
	}

	/**
	 * Get pending invitations for a team
	 * Only returns non-expired, non-accepted invitations
	 * 
	 * @param teamId - ID of the team
	 * @returns Array of pending invitations
	 */
	async getPendingInvitations(
		teamId: string
	): Promise<{ invitations: TeamInvitation[]; error: Error | null }> {
		const now = new Date().toISOString();

		const { data: invitations, error } = await this.supabase
			.from('team_invitations')
			.select('*')
			.eq('team_id', teamId)
			.is('accepted_at', null)
			.gt('expires_at', now)
			.order('created_at', { ascending: false });

		if (error) {
			return { invitations: [], error };
		}

		return { invitations: invitations || [], error: null };
	}

	/**
	 * Cancel a pending invitation
	 * Only owner/admin can cancel invitations
	 * 
	 * @param invitationId - ID of the invitation
	 * @param userId - ID of the user canceling the invitation
	 * @returns Success status
	 */
	async cancelInvitation(
		invitationId: string,
		userId: string
	): Promise<{ success: boolean; error: Error | null }> {
		// Delete invitation (RLS ensures only owner/admin can delete)
		const { error } = await this.supabase
			.from('team_invitations')
			.delete()
			.eq('id', invitationId);

		if (error) {
			return { success: false, error };
		}

		return { success: true, error: null };
	}

	/**
	 * Check for pending invitations for a user's email
	 * Used during signup to auto-accept invitations
	 * 
	 * @param email - User's email address
	 * @returns Array of pending invitations
	 */
	async getPendingInvitationsForEmail(
		email: string
	): Promise<{ invitations: TeamInvitation[]; error: Error | null }> {
		const now = new Date().toISOString();

		const { data: invitations, error } = await this.supabase
			.from('team_invitations')
			.select('*')
			.eq('email', email.toLowerCase())
			.is('accepted_at', null)
			.gt('expires_at', now);

		if (error) {
			return { invitations: [], error };
		}

		return { invitations: invitations || [], error: null };
	}

	/**
	 * Auto-accept pending invitations for a new user
	 * Called during signup/onboarding
	 * 
	 * @param userId - ID of the new user
	 * @param email - User's email address
	 * @returns Number of invitations accepted
	 */
	async autoAcceptPendingInvitations(
		userId: string,
		email: string
	): Promise<{ acceptedCount: number; error: Error | null }> {
		const { invitations, error: fetchError } = await this.getPendingInvitationsForEmail(email);

		if (fetchError || !invitations.length) {
			return { acceptedCount: 0, error: fetchError };
		}

		let acceptedCount = 0;

		for (const invitation of invitations) {
			const { success } = await this.acceptInvitation(invitation.token, userId);
			if (success) {
				acceptedCount++;
			}
		}

		return { acceptedCount, error: null };
	}
}
