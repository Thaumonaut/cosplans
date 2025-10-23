import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { crewService } from '$lib/server/resources/crew-service';
import type { CrewRole } from '$lib/types/resources';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    throw redirect(303, '/login');
  }

  const { id } = params;

  // Handle "new" case for creating a new crew member
  if (id === 'new') {
    return {
      crewMember: {
        id: 'new',
        name: '',
        previous_roles: [],
        email: null,
        phone: null,
        portfolio_url: null,
        instagram_handle: null,
        twitter_handle: null,
        notes: null,
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      user,
      isNew: true
    };
  }

  try {
    const crewMember = await crewService.getById(id);
    
    if (!crewMember) {
      throw error(404, 'Crew member not found');
    }

    return {
      crewMember,
      user,
      isNew: false
    };
  } catch (err) {
    console.error('Error loading crew member:', err);
    throw error(500, 'Failed to load crew member');
  }
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      portfolio_url: formData.get('portfolio_url') as string || undefined,
      instagram_handle: formData.get('instagram_handle') as string || undefined,
      twitter_handle: formData.get('twitter_handle') as string || undefined,
      notes: formData.get('notes') as string || undefined,
      is_favorite: formData.get('is_favorite') === 'on'
    };

    if (!data.name) {
      return fail(400, { error: 'Name is required' });
    }

    try {
      const newCrewMember = await crewService.create(data);
      throw redirect(303, `/crew/${newCrewMember.id}`);
    } catch (err) {
      console.error('Error creating crew member:', err);
      return fail(500, {
        error: 'Failed to create crew member. Please try again.'
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
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      portfolio_url: formData.get('portfolio_url') as string || undefined,
      instagram_handle: formData.get('instagram_handle') as string || undefined,
      twitter_handle: formData.get('twitter_handle') as string || undefined,
      notes: formData.get('notes') as string || undefined,
      is_favorite: formData.get('is_favorite') === 'on'
    };

    try {
      await crewService.update(id, data);
      
      return {
        success: true,
        message: 'Crew member updated successfully'
      };
    } catch (err) {
      console.error('Error updating crew member:', err);
      return fail(500, {
        error: 'Failed to update crew member. Please try again.'
      });
    }
  },

  toggleFavorite: async ({ params, locals }) => {
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const { id } = params;

    try {
      await crewService.toggleFavorite(id);
      return { success: true };
    } catch (err) {
      console.error('Error toggling favorite:', err);
      return fail(500, { error: 'Failed to update favorite status' });
    }
  },

  delete: async ({ params, locals }) => {
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const { id } = params;

    try {
      await crewService.delete(id);
      throw redirect(303, '/crew');
    } catch (err) {
      console.error('Error deleting crew member:', err);
      return fail(500, {
        error: 'Failed to delete crew member. Please try again.'
      });
    }
  }
};
