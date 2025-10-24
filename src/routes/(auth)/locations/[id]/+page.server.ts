import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { locationService } from '$lib/server/resources/location-service';
import type { LocationType } from '$lib/types/resources';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    throw redirect(303, '/login');
  }

  const { id } = params;

  // Handle "new" location creation
  if (id === 'new') {
    const newLocation = {
      id: 'new',
      team_id: '',
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      name: '',
      location_type: 'studio' as LocationType,
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      latitude: undefined,
      longitude: undefined,
      accessibility_notes: '',
      parking_info: '',
      cost_info: '',
      notes: '',
      search_vector: ''
    };

    return {
      location: newLocation,
      isNew: true,
      user
    };
  }

  try {
    const location = await locationService.getById(id);
    
    if (!location) {
      throw error(404, 'Location not found');
    }

    return {
      location,
      isNew: false,
      user
    };
  } catch (err) {
    console.error('Error loading location:', err);
    throw error(500, 'Failed to load location');
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
    
    const data = {
      team_id: teamId,
      created_by: user.id,
      name: formData.get('name') as string,
      location_type: (formData.get('location_type') as LocationType) || 'studio',
      address: formData.get('address') as string || undefined,
      city: formData.get('city') as string || undefined,
      state: formData.get('state') as string || undefined,
      country: formData.get('country') as string || undefined,
      postal_code: formData.get('postal_code') as string || undefined,
      latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
      longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
      accessibility_notes: formData.get('accessibility_notes') as string || undefined,
      parking_info: formData.get('parking_info') as string || undefined,
      cost_info: formData.get('cost_info') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    };

    try {
      const location = await locationService.create(data);
      redirect(303, `/locations/${location.id}`);
    } catch (err) {
      console.error('Error creating location:', err);
      return fail(500, {
        error: 'Failed to create location. Please try again.'
      });
    }
  },

  update: async ({ request, params, locals }) => {
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const { id } = params;
    const formData = await request.formData();
    
    const data = {
      name: formData.get('name') as string,
      location_type: (formData.get('location_type') as LocationType) || 'studio',
      address: formData.get('address') as string || undefined,
      city: formData.get('city') as string || undefined,
      state: formData.get('state') as string || undefined,
      country: formData.get('country') as string || undefined,
      postal_code: formData.get('postal_code') as string || undefined,
      latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
      longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
      accessibility_notes: formData.get('accessibility_notes') as string || undefined,
      parking_info: formData.get('parking_info') as string || undefined,
      cost_info: formData.get('cost_info') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    };

    try {
      await locationService.update(id, data);
      
      return {
        success: true,
        message: 'Location updated successfully'
      };
    } catch (err) {
      console.error('Error updating location:', err);
      return fail(500, {
        error: 'Failed to update location. Please try again.'
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
      await locationService.delete(id);
      redirect(303, '/locations');
    } catch (err) {
      console.error('Error deleting location:', err);
      return fail(500, {
        error: 'Failed to delete location. Please try again.'
      });
    }
  }
};
