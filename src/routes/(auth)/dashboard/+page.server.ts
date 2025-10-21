import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	// CONSTITUTIONAL REQUIREMENT: Every user must own at least one team
	// Check if user has completed onboarding
	const { data: profile } = await locals.supabase
		.from('user_profiles')
		.select('onboarding_completed')
		.eq('id', user.id)
		.single();

	// If onboarding not completed, redirect to onboarding
	if (!profile || !profile.onboarding_completed) {
		throw redirect(303, '/onboarding');
	}

	// Verify user actually has at least one team they own
	const { data: ownedTeams } = await locals.supabase
		.from('team_members')
		.select('team_id')
		.eq('user_id', user.id)
		.eq('role', 'owner');

	// If no owned teams, redirect to onboarding (constitutional violation!)
	if (!ownedTeams || ownedTeams.length === 0) {
		console.error('⚠️ Constitutional violation: User has no owned teams!');
		// Reset onboarding status and redirect
		await locals.supabase
			.from('user_profiles')
			.update({ onboarding_completed: false })
			.eq('id', user.id);
		
		throw redirect(303, '/onboarding');
	}

	return {
		user
	};
};
