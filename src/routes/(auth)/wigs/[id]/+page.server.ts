import { wigService } from '$lib/server/resources/wig-service';
import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { session, user } = await locals.safeGetSession();
	
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}
	
	const adminClient = getAdminClient();
	const isNew = params.id === 'new';
	
	// For new wigs, get user's team and characters
	if (isNew) {
		const { data: memberships } = await adminClient
			.from('team_members')
			.select('team_id')
			.eq('user_id', user.id)
			.limit(1)
			.single();
		
		if (!memberships) {
			throw error(400, 'No team found. Please create or join a team first.');
		}
		
		// Get all characters for linking
		const { data: characters } = await adminClient
			.from('characters')
			.select('id, character_name, series')
			.eq('team_id', memberships.team_id)
			.order('character_name', { ascending: true });
		
		return {
			wig: null,
			characters: characters || [],
			isNew: true
		};
	}
	
	// For existing wigs, fetch the wig data
	const { data: wig, error: wigError } = await adminClient
		.from('wigs')
		.select(`
			*,
			teams!inner(id, name)
		`)
		.eq('id', params.id)
		.single();
	
	if (wigError || !wig) {
		console.error('[Wig Detail] Error:', wigError);
		throw error(404, 'Wig not found');
	}
	
	// Verify user is member of this wig's team
	const { data: membership } = await adminClient
		.from('team_members')
		.select('team_id')
		.eq('user_id', user.id)
		.eq('team_id', wig.team_id)
		.single();
	
	if (!membership) {
		throw error(403, 'You do not have access to this wig');
	}
	
	// Get all characters for linking
	const { data: characters } = await adminClient
		.from('characters')
		.select('id, character_name, series')
		.eq('team_id', wig.team_id)
		.order('character_name', { ascending: true});
	
	// Get linked characters
	const { data: linkedCharacters } = await adminClient
		.from('character_wigs')
		.select('characters(id, character_name, series)')
		.eq('wig_id', params.id);
	
	return {
		wig,
		characters: characters || [],
		linkedCharacters: linkedCharacters?.map((cw: any) => cw.characters) || [],
		isNew: false
	};
};

export const actions: Actions = {
	// Create new wig
	create: async ({ request, locals }) => {
		const session = await locals.safeGetSession();
		
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		
		const formData = await request.formData();
		
		// Extract required fields
		const wigName = formData.get('wig_name')?.toString();
		const color = formData.get('color')?.toString();
		
		// Validation
		if (!wigName || !wigName.trim()) {
			return fail(400, { error: 'Wig name is required' });
		}
		if (!color || !color.trim()) {
			return fail(400, { error: 'Color is required' });
		}
		
		// Extract optional fields
		const length = formData.get('length')?.toString() || 'medium';
		const fiberType = formData.get('fiber_type')?.toString() || 'synthetic';
		const baseWigBrand = formData.get('base_wig_brand')?.toString() || undefined;
		const status = formData.get('status')?.toString() || 'planned';
		const baseWigCostStr = formData.get('base_wig_cost')?.toString();
		const baseWigCost = baseWigCostStr ? parseFloat(baseWigCostStr) : 0;
		const stylingCostStr = formData.get('styling_cost')?.toString();
		const stylingCost = stylingCostStr ? parseFloat(stylingCostStr) : 0;
		const condition = formData.get('condition')?.toString() || undefined;
		const maintenanceNotes = formData.get('maintenance_notes')?.toString() || undefined;
		const storageLocation = formData.get('storage_location')?.toString() || undefined;
		const storageMethod = formData.get('storage_method')?.toString() || undefined;
		const characterIdsStr = formData.get('character_ids')?.toString();
		const characterIds: string[] = characterIdsStr ? JSON.parse(characterIdsStr) : [];
		
		// Get user's team
		const adminClient = getAdminClient();
		const { data: memberships } = await adminClient
			.from('team_members')
			.select('team_id')
			.eq('user_id', session.user.id)
			.limit(1)
			.single();
		
		if (!memberships) {
			return fail(400, { error: 'No team found. Please create or join a team first.' });
		}
		
		const teamId = memberships.team_id;
		
		try {
			// Create wig
			const wig = await wigService.create({
				team_id: teamId,
				wig_name: wigName,
				color,
				length: length as any,
				fiber_type: fiberType as any,
				base_wig_brand: baseWigBrand,
				status: status as any,
				base_wig_cost: baseWigCost,
				styling_cost: stylingCost,
				condition: condition as any,
				maintenance_notes: maintenanceNotes,
				storage_location: storageLocation,
				storage_method: storageMethod,
				created_by: session.user.id
			});
			
			// Link to characters if specified
			if (characterIds.length > 0) {
				try {
					// Link to each character
					await Promise.all(
						characterIds.map(characterId => 
							wigService.linkToCharacter(wig.id, characterId)
						)
					);
				} catch (linkErr) {
					console.error('Error linking wig to characters:', linkErr);
					// Non-fatal, continue
				}
			}
			
			// Redirect to wig detail page
			throw redirect(303, `/wigs/${wig.id}`);
		} catch (err: any) {
			// If it's a redirect, re-throw it
			if (err.status === 303) {
				throw err;
			}
			
			console.error('Error creating wig:', err);
			return fail(500, { 
				error: err.message || 'Failed to create wig. Please try again.' 
			});
		}
	},
	
	// Update wig fields
	update: async ({ request, params, locals }) => {
		const session = await locals.safeGetSession();
		
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		
		const formData = await request.formData();
		const updates: Record<string, any> = {};
		
		// Extract all form fields
		for (const [key, value] of formData.entries()) {
			if (value !== null && value !== undefined) {
				updates[key] = value.toString();
			}
		}
		
		try {
			await wigService.update(params.id, updates);
			return { success: true };
		} catch (err) {
			console.error('Error updating wig:', err);
			return fail(500, { error: 'Failed to update wig' });
		}
	},
	
	// Delete wig
	delete: async ({ params, locals }) => {
		const session = await locals.safeGetSession();
		
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		
		try {
			await wigService.delete(params.id);
		} catch (err) {
			console.error('Error deleting wig:', err);
			return fail(500, { error: 'Failed to delete wig' });
		}
		
		// Redirect to wigs overview after successful delete
		throw redirect(303, '/wigs');
	}
};

