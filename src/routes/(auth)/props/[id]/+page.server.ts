import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { propService } from '$lib/server/resources/prop-service';
import type { LifecycleState } from '$lib/types/resources';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    throw redirect(303, '/login');
  }

  const { id } = params;

  // Handle "new" prop creation
  if (id === 'new') {
    const newProp = {
      id: 'new',
      team_id: '',
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      name: '',
      prop_type: undefined,
      character_series: '',
      status: 'planned' as LifecycleState,
      estimated_cost: undefined,
      actual_cost: undefined,
      storage_location: '',
      condition: '',
      state_metadata: {},
      notes: '',
      search_vector: ''
    };

    return {
      prop: newProp,
      isNew: true,
      user
    };
  }

  try {
    const prop = await propService.getById(id);
    
    if (!prop) {
      throw error(404, 'Prop not found');
    }

    return {
      prop,
      isNew: false,
      user
    };
  } catch (err) {
    console.error('Error loading prop:', err);
    throw error(500, 'Failed to load prop');
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
      prop_type: formData.get('prop_type') as string || undefined,
      character_series: formData.get('character_series') as string || undefined,
      status: (formData.get('status') as LifecycleState) || 'planned',
      estimated_cost: formData.get('estimated_cost') ? parseFloat(formData.get('estimated_cost') as string) : undefined,
      actual_cost: formData.get('actual_cost') ? parseFloat(formData.get('actual_cost') as string) : undefined,
      storage_location: formData.get('storage_location') as string || undefined,
      condition: formData.get('condition') as string || undefined,
      notes: formData.get('notes') as string || undefined,
      state_metadata: {},
    };

    try {
      const prop = await propService.create(data);
      redirect(303, `/props/${prop.id}`);
    } catch (err) {
      console.error('Error creating prop:', err);
      return fail(500, {
        error: 'Failed to create prop. Please try again.'
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
      prop_type: formData.get('prop_type') as string || undefined,
      character_series: formData.get('character_series') as string || undefined,
      status: (formData.get('status') as LifecycleState) || 'planned',
      estimated_cost: formData.get('estimated_cost') ? parseFloat(formData.get('estimated_cost') as string) : undefined,
      actual_cost: formData.get('actual_cost') ? parseFloat(formData.get('actual_cost') as string) : undefined,
      storage_location: formData.get('storage_location') as string || undefined,
      condition: formData.get('condition') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    };

    try {
      await propService.update(id, data);
      
      return {
        success: true,
        message: 'Prop updated successfully'
      };
    } catch (err) {
      console.error('Error updating prop:', err);
      return fail(500, {
        error: 'Failed to update prop. Please try again.'
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
      await propService.delete(id);
      redirect(303, '/props');
    } catch (err) {
      console.error('Error deleting prop:', err);
      return fail(500, {
        error: 'Failed to delete prop. Please try again.'
      });
    }
  }
};
