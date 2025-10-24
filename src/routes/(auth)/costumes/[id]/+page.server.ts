import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { costumeService } from '$lib/server/resources/costume-service';
import { createCostumeSchema, type LifecycleState } from '$lib/types/resources';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    throw redirect(303, '/login');
  }

  const { id } = params;

  // Handle "new" costume creation
  if (id === 'new') {
    const newCostume = {
      id: 'new',
      team_id: '',
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      character_name: '',
      series: '',
      costume_type: '',
      status: 'planned' as LifecycleState,
      estimated_cost: undefined,
      actual_cost: undefined,
      completion_date: '',
      storage_location: '',
      state_metadata: {},
      notes: '',
      search_vector: ''
    };

    return {
      costume: newCostume,
      isNew: true,
      user
    };
  }

  try {
    const costume = await costumeService.getById(id);
    
    if (!costume) {
      throw error(404, 'Costume not found');
    }

    return {
      costume,
      isNew: false,
      user
    };
  } catch (err) {
    console.error('Error loading costume:', err);
    throw error(500, 'Failed to load costume');
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
      character_name: formData.get('character_name') as string,
      series: formData.get('series') as string || undefined,
      costume_type: formData.get('costume_type') as string || undefined,
      status: (formData.get('status') as LifecycleState) || 'planned',
      estimated_cost: formData.get('estimated_cost') ? parseFloat(formData.get('estimated_cost') as string) : undefined,
      actual_cost: formData.get('actual_cost') ? parseFloat(formData.get('actual_cost') as string) : undefined,
      completion_date: formData.get('completion_date') as string || undefined,
      storage_location: formData.get('storage_location') as string || undefined,
      notes: formData.get('notes') as string || undefined,
      state_metadata: {},
    };

    let costume;
    try {
      costume = await costumeService.create(data);
    } catch (err) {
      console.error('Error creating costume:', err);
      return fail(500, {
        error: 'Failed to create costume. Please try again.'
      });
    }
    
    throw redirect(303, `/costumes/${costume.id}`);
  },

  update: async ({ request, params, locals }) => {
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const { id } = params;
    const formData = await request.formData();
    
    const data = {
      character_name: formData.get('character_name') as string,
      series: formData.get('series') as string || undefined,
      costume_type: formData.get('costume_type') as string || undefined,
      status: (formData.get('status') as LifecycleState) || 'planned',
      estimated_cost: formData.get('estimated_cost') ? parseFloat(formData.get('estimated_cost') as string) : undefined,
      actual_cost: formData.get('actual_cost') ? parseFloat(formData.get('actual_cost') as string) : undefined,
      completion_date: formData.get('completion_date') as string || undefined,
      storage_location: formData.get('storage_location') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    };

    try {
      await costumeService.update(id, data);
      
      return {
        success: true,
        message: 'Costume updated successfully'
      };
    } catch (err) {
      console.error('Error updating costume:', err);
      return fail(500, {
        error: 'Failed to update costume. Please try again.'
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
      await costumeService.delete(id);
    } catch (err) {
      console.error('Error deleting costume:', err);
      return fail(500, {
        error: 'Failed to delete costume. Please try again.'
      });
    }
    
    throw redirect(303, '/costumes');
  }
};
