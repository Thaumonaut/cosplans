import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { CrewMember, ResourceSearchParams, ResourceSearchResult } from '$lib/types/resources';
import { error } from '@sveltejs/kit';

export class CrewService {
  private static instance: CrewService;
  private client = getAdminClient();

  private constructor() {}

  public static getInstance(): CrewService {
    if (!CrewService.instance) {
      CrewService.instance = new CrewService();
    }
    return CrewService.instance;
  }

  /**
   * Create a new crew member
   */
  async create(crewMember: Omit<CrewMember, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector'>): Promise<CrewMember> {
    const { data, error: insertError } = await this.client
      .from('crew_members')
      .insert(crewMember)
      .select('*')
      .single();

    if (insertError) {
      console.error('Error creating crew member:', insertError);
      throw error(500, `Failed to create crew member: ${insertError.message}`);
    }

    return data as CrewMember;
  }

  /**
   * Get a crew member by ID
   */
  async getById(id: string): Promise<CrewMember | null> {
    const { data, error: fetchError } = await this.client
      .from('crew_members')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching crew member:', fetchError);
      throw error(500, `Failed to fetch crew member: ${fetchError.message}`);
    }

    return data as CrewMember | null;
  }

  /**
   * Update a crew member
   */
  async update(
    id: string,
    updates: Partial<Omit<CrewMember, 'id' | 'team_id' | 'created_by' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector'>>
  ): Promise<CrewMember> {
    const { data, error: updateError } = await this.client
      .from('crew_members')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating crew member:', updateError);
      throw error(500, `Failed to update crew member: ${updateError.message}`);
    }

    return data as CrewMember;
  }

  /**
   * Soft delete a crew member
   */
  async delete(id: string): Promise<boolean> {
    const { error: deleteError } = await this.client
      .from('crew_members')
      .update({ 
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting crew member:', deleteError);
      throw error(500, `Failed to delete crew member: ${deleteError.message}`);
    }

    return true;
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<CrewMember> {
    const current = await this.getById(id);
    if (!current) {
      throw error(404, 'Crew member not found');
    }

    return this.update(id, { is_favorite: !current.is_favorite });
  }

  /**
   * Search crew members with pagination and filtering
   */
  async search(params: ResourceSearchParams): Promise<ResourceSearchResult<CrewMember>> {
    const {
      query,
      role,
      is_favorite,
      limit = 20,
      offset = 0,
      team_id
    } = params;

    let queryBuilder = this.client
      .from('crew_members')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    if (team_id) {
      queryBuilder = queryBuilder.eq('team_id', team_id);
    } else {
      throw error(400, 'team_id is required for searching crew members');
    }

    if (query) {
      queryBuilder = queryBuilder.textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english'
      });
    }

    if (role) {
      queryBuilder = queryBuilder.eq('role', role);
    }

    if (is_favorite !== undefined) {
      queryBuilder = queryBuilder.eq('is_favorite', is_favorite);
    }

    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, count, error: searchError } = await queryBuilder;

    if (searchError) {
      console.error('Error searching crew members:', searchError);
      throw error(500, `Failed to search crew members: ${searchError.message}`);
    }

    return {
      resources: data as CrewMember[],
      total: count || 0,
      hasMore: (offset + (data?.length || 0)) < (count || 0)
    };
  }

  /**
   * Get all crew members for a team
   */
  async getByTeam(teamId: string, limit = 20, offset = 0): Promise<ResourceSearchResult<CrewMember>> {
    return this.search({
      team_id: teamId,
      limit,
      offset
    });
  }

  /**
   * Get favorite crew members
   */
  async getFavorites(teamId: string): Promise<CrewMember[]> {
    const result = await this.search({
      team_id: teamId,
      is_favorite: true,
      limit: 100
    });
    return result.resources;
  }
}

export const crewService = CrewService.getInstance();
