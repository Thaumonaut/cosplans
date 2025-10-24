import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { equipmentService } from '$lib/server/resources/equipment-service';

export const load: PageServerLoad = async ({ params, locals }) => {
  console.log('[Equipment Detail] Load function called with params:', params);
  
  const { session, user } = await locals.safeGetSession();
  console.log('[Equipment Detail] Session check:', { hasSession: !!session, hasUser: !!user });
  
  if (!session || !user) {
    console.log('[Equipment Detail] No session/user, redirecting to login');
    throw redirect(303, '/login');
  }

  const { id } = params;
  console.log('[Equipment Detail] Equipment ID:', id);

  // Handle "new" case for creating new equipment
  if (id === 'new') {
    console.log('[Equipment Detail] Creating new equipment template');
    return {
      equipment: {
        id: 'new',
        name: '',
        equipment_type: '',
        brand: null,
        model: null,
        condition: '',
        ownership_status: '',
        purchase_date: null,
        purchase_price: null,
        serial_number: null,
        storage_location: null,
        notes: null,
        rental_return_date: null,
        rental_cost: null,
        estimated_purchase_cost: null,
        estimated_rental_cost: null,
        rental_source: null,
        sourcing_notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      user,
      isNew: true
    };
  }

  try {
    console.log('[Equipment Detail] Fetching equipment from database...');
    const equipment = await equipmentService.getById(id);
    console.log('[Equipment Detail] Equipment fetched:', equipment ? 'Found' : 'Not found');
    
    if (!equipment) {
      console.log('[Equipment Detail] Equipment not found, throwing 404');
      throw error(404, 'Equipment not found');
    }

    console.log('[Equipment Detail] Returning equipment data');
    return {
      equipment,
      user,
      isNew: false
    };
  } catch (err) {
    console.error('[Equipment Detail] Error loading equipment:', err);
    console.error('[Equipment Detail] Error stack:', err instanceof Error ? err.stack : 'No stack trace');
    throw error(500, `Failed to load equipment: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    
    const teamId = formData.get('team_id') as string;
    if (!teamId) {
      return fail(400, { error: 'Team ID is required' });
    }
    
    const conditionValue = formData.get('condition') as string;
    const ownershipValue = formData.get('ownership_status') as string;
    
    const data = {
      team_id: teamId,
      created_by: user.id,
      name: formData.get('name') as string,
      equipment_type: formData.get('equipment_type') as any,
      brand: formData.get('brand') as string || undefined,
      model: formData.get('model') as string || undefined,
      condition: (conditionValue && conditionValue.trim() !== '') ? conditionValue : 'good',
      ownership_status: (ownershipValue && ownershipValue.trim() !== '') ? ownershipValue : 'owned',
      purchase_date: formData.get('purchase_date') as string || undefined,
      purchase_price: formData.get('purchase_price') ? parseFloat(formData.get('purchase_price') as string) : undefined,
      serial_number: formData.get('serial_number') as string || undefined,
      storage_location: formData.get('storage_location') as string || undefined,
      notes: formData.get('notes') as string || undefined,
      rental_return_date: formData.get('rental_return_date') as string || undefined,
      rental_cost: formData.get('rental_cost') ? parseFloat(formData.get('rental_cost') as string) : undefined,
      estimated_purchase_cost: formData.get('estimated_purchase_cost') ? parseFloat(formData.get('estimated_purchase_cost') as string) : undefined,
      estimated_rental_cost: formData.get('estimated_rental_cost') ? parseFloat(formData.get('estimated_rental_cost') as string) : undefined,
      rental_source: formData.get('rental_source') as string || undefined,
      sourcing_notes: formData.get('sourcing_notes') as string || undefined
    };

    if (!data.name) {
      return fail(400, { error: 'Name is required' });
    }

    try {
      await equipmentService.create(data);
    } catch (err) {
      console.error('Error creating equipment:', err);
      return fail(500, {
        error: 'Failed to create equipment. Please try again.'
      });
    }
    
    // Redirect to equipment list on success
    redirect(303, `/equipment`);
  },

  update: async ({ request, params, locals }) => {
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const { id } = params;
    const formData = await request.formData();
    
    const conditionValue = formData.get('condition') as string;
    const ownershipValue = formData.get('ownership_status') as string;
    
    const data = {
      name: formData.get('name') as string,
      equipment_type: formData.get('equipment_type') as string,
      brand: formData.get('brand') as string || undefined,
      model: formData.get('model') as string || undefined,
      condition: (conditionValue && conditionValue.trim() !== '') ? conditionValue : 'good',
      ownership_status: (ownershipValue && ownershipValue.trim() !== '') ? ownershipValue : 'owned',
      purchase_date: formData.get('purchase_date') as string || undefined,
      purchase_price: formData.get('purchase_price') ? parseFloat(formData.get('purchase_price') as string) : undefined,
      serial_number: formData.get('serial_number') as string || undefined,
      storage_location: formData.get('storage_location') as string || undefined,
      notes: formData.get('notes') as string || undefined,
      rental_return_date: formData.get('rental_return_date') as string || undefined,
      rental_cost: formData.get('rental_cost') ? parseFloat(formData.get('rental_cost') as string) : undefined,
      estimated_purchase_cost: formData.get('estimated_purchase_cost') ? parseFloat(formData.get('estimated_purchase_cost') as string) : undefined,
      estimated_rental_cost: formData.get('estimated_rental_cost') ? parseFloat(formData.get('estimated_rental_cost') as string) : undefined,
      rental_source: formData.get('rental_source') as string || undefined,
      sourcing_notes: formData.get('sourcing_notes') as string || undefined
    };

    try {
      await equipmentService.update(id, data);
      
      return {
        success: true,
        message: 'Equipment updated successfully'
      };
    } catch (err) {
      console.error('Error updating equipment:', err);
      return fail(500, {
        error: 'Failed to update equipment. Please try again.'
      });
    }
  },

  delete: async ({ params, locals }) => {
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const { id } = params;

    try {
      await equipmentService.delete(id);
      throw redirect(303, '/equipment');
    } catch (err) {
      console.error('Error deleting equipment:', err);
      return fail(500, {
        error: 'Failed to delete equipment. Please try again.'
      });
    }
  }
};
