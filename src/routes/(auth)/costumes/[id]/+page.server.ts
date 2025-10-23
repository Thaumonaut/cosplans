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

  try {
    const costume = await costumeService.getById(id);
    
    if (!costume) {
      throw error(404, 'Costume not found');
    }

    return {
      costume,
      user
    };
  } catch (err) {
    console.error('Error loading costume:', err);
    throw error(500, 'Failed to load costume');
  }
};

export const actions: Actions = {
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
      throw redirect(303, '/costumes');
    } catch (err) {
      console.error('Error deleting costume:', err);
      return fail(500, {
        error: 'Failed to delete costume. Please try again.'
      });
    }
  }
};
