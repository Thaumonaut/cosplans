import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { costumeService } from '$lib/server/resources/costume-service';
import { createCostumeSchema } from '$lib/types/resources';

export const load: PageServerLoad = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    throw redirect(303, '/login');
  }

  // Get user's teams (for team selection)
  // For now, we'll use the default team from user metadata
  const teamId = user.user_metadata?.default_team_id;
  
  return {
    teamId,
    user
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    const data = {
      team_id: formData.get('team_id') as string,
      character_name: formData.get('character_name') as string,
      series: formData.get('series') as string || undefined,
      costume_type: formData.get('costume_type') as string || undefined,
      status: (formData.get('status') as string) || 'planned',
      estimated_cost: formData.get('estimated_cost') ? parseFloat(formData.get('estimated_cost') as string) : undefined,
      storage_location: formData.get('storage_location') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    };

    // Validate the data
    const validation = createCostumeSchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      return fail(400, {
        error: 'Validation failed',
        errors: fieldErrors as Record<string, string[]>
      });
    }

    try {
      // Create the costume
      const costume = await costumeService.create({
        team_id: validation.data.team_id,
        created_by: user.id,
        character_name: validation.data.character_name,
        series: validation.data.series,
        costume_type: validation.data.costume_type,
        status: validation.data.status,
        estimated_cost: validation.data.estimated_cost,
        actual_cost: undefined,
        completion_date: undefined,
        storage_location: validation.data.storage_location,
        state_metadata: {},
        notes: validation.data.notes
      });

      // Redirect to the costume detail page
      throw redirect(303, `/costumes/${costume.id}`);
    } catch (err) {
      console.error('Error creating costume:', err);
      return fail(500, {
        error: 'Failed to create costume. Please try again.'
      });
    }
  }
};
