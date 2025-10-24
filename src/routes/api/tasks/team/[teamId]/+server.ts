import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /api/tasks/team/:teamId
 * Fetches all tasks for shoots in a team
 */
export const GET: RequestHandler = async ({ params, locals }) => {
  const { teamId } = params;

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    // Verify user has access to this team
    const { data: teamMember, error: memberError } = await locals.supabase
      .from('team_members')
      .select('team_id')
      .eq('team_id', teamId)
      .eq('user_id', locals.user.id)
      .single();

    if (memberError || !teamMember) {
      throw error(404, 'Team not found or access denied');
    }

    // Get all shoots for the team
    const { data: shoots, error: shootsError } = await locals.supabase
      .from('shoots')
      .select('id, title')
      .eq('team_id', teamId);

    if (shootsError) {
      throw error(500, 'Failed to fetch shoots');
    }

    if (!shoots || shoots.length === 0) {
      return json({ tasks: [] });
    }

    const shootIds = shoots.map(s => s.id);

    // Fetch tasks from various sources and combine them
    const allTasks: any[] = [];

    // Get costume tasks
    const { data: costumeTasks, error: costumeError } = await locals.supabase
      .from('costumes')
      .select(`
        id,
        item_name,
        status,
        due_date,
        assigned_to,
        shoot_id,
        shoots!inner(title)
      `)
      .in('shoot_id', shootIds)
      .not('status', 'eq', 'completed');

    if (!costumeError && costumeTasks) {
      costumeTasks.forEach(costume => {
        allTasks.push({
          id: `costume-${costume.id}`,
          title: `Costume: ${costume.item_name}`,
          category: 'costumes',
          shoot_title: costume.shoots.title,
          due_date: costume.due_date,
          priority: costume.status === 'in_progress' ? 'high' : 'medium',
          completed: false,
          assigned_to: costume.assigned_to,
          shoot_id: costume.shoot_id,
          team_id: teamId,
        });
      });
    }

    // Get prop tasks
    const { data: propTasks, error: propError } = await locals.supabase
      .from('props')
      .select(`
        id,
        item_name,
        status,
        due_date,
        assigned_to,
        shoot_id,
        shoots!inner(title)
      `)
      .in('shoot_id', shootIds)
      .not('status', 'eq', 'owned');

    if (!propError && propTasks) {
      propTasks.forEach(prop => {
        allTasks.push({
          id: `prop-${prop.id}`,
          title: `Prop: ${prop.item_name}`,
          category: 'props',
          shoot_title: prop.shoots.title,
          due_date: prop.due_date,
          priority: prop.status === 'needed' ? 'high' : 'medium',
          completed: false,
          assigned_to: prop.assigned_to,
          shoot_id: prop.shoot_id,
          team_id: teamId,
        });
      });
    }

    // Get location tasks
    const { data: locationTasks, error: locationError } = await locals.supabase
      .from('locations')
      .select(`
        id,
        location_name,
        status,
        due_date,
        assigned_to,
        shoot_id,
        shoots!inner(title)
      `)
      .in('shoot_id', shootIds)
      .not('status', 'eq', 'confirmed');

    if (!locationError && locationTasks) {
      locationTasks.forEach(location => {
        allTasks.push({
          id: `location-${location.id}`,
          title: `Location: ${location.location_name}`,
          category: 'location',
          shoot_title: location.shoots.title,
          due_date: location.due_date,
          priority: location.status === 'scouting' ? 'high' : 'medium',
          completed: false,
          assigned_to: location.assigned_to,
          shoot_id: location.shoot_id,
          team_id: teamId,
        });
      });
    }

    // Sort tasks by priority and due date
    allTasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      const dateA = new Date(a.due_date).getTime();
      const dateB = new Date(b.due_date).getTime();
      return dateA - dateB;
    });

    return json({ tasks: allTasks });
  } catch (err) {
    console.error('Error fetching team tasks:', err);
    throw error(500, 'Internal server error');
  }
};
