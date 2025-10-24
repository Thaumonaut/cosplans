import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { Costume, ResourceSearchParams, ResourceSearchResult } from '$lib/types/resources';
import { validateStateTransition, validateStateMetadata } from '$lib/utils/lifecycle-states';
import { error } from '@sveltejs/kit';

export class CostumeService {
  private static instance: CostumeService;
  private client = getAdminClient();

  private constructor() {}

  public static getInstance(): CostumeService {
    if (!CostumeService.instance) {
      CostumeService.instance = new CostumeService();
    }
    return CostumeService.instance;
  }

  /**
   * Create a new costume
   */
  async create(costume: Omit<Costume, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector'>): Promise<Costume> {
    const { data, error: insertError } = await this.client
      .from('costumes')
      .insert({
        ...costume,
        state_metadata: costume.state_metadata || {}
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Error creating costume:', insertError);
      throw error(500, `Failed to create costume: ${insertError.message}`);
    }

    return data as Costume;
  }

  /**
   * Get a costume by ID
   */
  async getById(id: string): Promise<Costume | null> {
    const { data, error: fetchError } = await this.client
      .from('costumes')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching costume:', fetchError);
      throw error(500, `Failed to fetch costume: ${fetchError.message}`);
    }

    return data as Costume | null;
  }

  /**
   * Update a costume
   */
  async update(
    id: string,
    updates: Partial<Omit<Costume, 'id' | 'team_id' | 'created_by' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector'>>
  ): Promise<Costume> {
    // If status is being updated, validate the transition
    if (updates.status) {
      const current = await this.getById(id);
      if (current) {
        const validation = validateStateTransition(current.status, updates.status);
        if (!validation.valid) {
          throw error(400, `Invalid status transition: ${validation.message}`);
        }
      }

      // Validate state metadata if required
      if (updates.state_metadata) {
        const metadataValidation = validateStateMetadata(updates.status, updates.state_metadata);
        if (!metadataValidation.valid) {
          throw error(400, `Missing required metadata: ${metadataValidation.missing.join(', ')}`);
        }
      }
    }

    const { data, error: updateError } = await this.client
      .from('costumes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating costume:', updateError);
      throw error(500, `Failed to update costume: ${updateError.message}`);
    }

    return data as Costume;
  }

  /**
   * Soft delete a costume
   */
  async delete(id: string): Promise<boolean> {
    const { error: deleteError } = await this.client
      .from('costumes')
      .update({ 
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting costume:', deleteError);
      throw error(500, `Failed to delete costume: ${deleteError.message}`);
    }

    return true;
  }

  /**
   * Search costumes with pagination and filtering
   */
  async search(params: ResourceSearchParams): Promise<ResourceSearchResult<Costume>> {
    const {
      query,
      status,
      limit = 20,
      offset = 0,
      team_id
    } = params;

    // Start building the query
    let queryBuilder = this.client
      .from('costumes')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    // Apply team filter (required)
    if (team_id) {
      queryBuilder = queryBuilder.eq('team_id', team_id);
    } else {
      throw error(400, 'team_id is required for searching costumes');
    }

    // Apply search query (full-text search)
    if (query) {
      queryBuilder = queryBuilder.textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english'
      });
    }

    // Apply status filter
    if (status) {
      queryBuilder = queryBuilder.eq('status', status);
    }

    // Apply pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, count, error: searchError } = await queryBuilder;

    if (searchError) {
      console.error('Error searching costumes:', searchError);
      throw error(500, `Failed to search costumes: ${searchError.message}`);
    }

    return {
      resources: data as Costume[],
      total: count || 0,
      hasMore: (offset + (data?.length || 0)) < (count || 0)
    };
  }

  /**
   * Get all costumes for a team
   */
  async getByTeam(teamId: string, limit = 20, offset = 0): Promise<ResourceSearchResult<Costume>> {
    return this.search({
      team_id: teamId,
      limit,
      offset
    });
  }

  /**
   * Search for unique series names
   */
  async searchSeries(query: string, limit = 10): Promise<string[]> {
    const { data, error: searchError } = await this.client
      .from('costumes')
      .select('series')
      .is('deleted_at', null)
      .not('series', 'is', null)
      .neq('series', '')
      .ilike('series', `%${query}%`)
      .limit(limit * 2); // Get more to filter duplicates

    if (searchError) {
      console.error('Error searching series:', searchError);
      throw error(500, `Failed to search series: ${searchError.message}`);
    }

    // Extract unique series names (case-insensitive)
    const uniqueSeries = new Set<string>();
    const seriesList: string[] = [];
    
    for (const item of data || []) {
      if (item.series) {
        const lowerSeries = item.series.toLowerCase();
        if (!uniqueSeries.has(lowerSeries)) {
          uniqueSeries.add(lowerSeries);
          seriesList.push(item.series);
          
          if (seriesList.length >= limit) break;
        }
      }
    }

    return seriesList;
  }
}

export const costumeService = CostumeService.getInstance();
