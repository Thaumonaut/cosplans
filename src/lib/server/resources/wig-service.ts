import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { Wig, ResourceSearchParams, ResourceSearchResult } from '$lib/types/resources';
import { error } from '@sveltejs/kit';

export class WigService {
  private static instance: WigService;
  private client = getAdminClient();

  private constructor() {}

  public static getInstance(): WigService {
    if (!WigService.instance) {
      WigService.instance = new WigService();
    }
    return WigService.instance;
  }

  /**
   * Create a new wig
   */
  async create(wig: Omit<Wig, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector' | 'total_cost'>): Promise<Wig> {
    // Auto-calculate total_cost from base + styling
    const totalCost = (wig.base_wig_cost || 0) + (wig.styling_cost || 0);

    const { data, error: insertError } = await this.client
      .from('wigs')
      .insert({
        ...wig,
        total_cost: totalCost
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Error creating wig:', insertError);
      throw error(500, `Failed to create wig: ${insertError.message}`);
    }

    return data as Wig;
  }

  /**
   * Get a wig by ID
   */
  async getById(id: string): Promise<Wig | null> {
    const { data, error: fetchError } = await this.client
      .from('wigs')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching wig:', fetchError);
      throw error(500, `Failed to fetch wig: ${fetchError.message}`);
    }

    return data as Wig | null;
  }

  /**
   * Update a wig
   */
  async update(
    id: string,
    updates: Partial<Omit<Wig, 'id' | 'team_id' | 'created_by' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector' | 'total_cost'>>
  ): Promise<Wig> {
    // If costs are being updated, recalculate total_cost
    let totalCost: number | undefined;
    if (updates.base_wig_cost !== undefined || updates.styling_cost !== undefined) {
      // Fetch current wig to get existing costs
      const currentWig = await this.getById(id);
      if (currentWig) {
        const baseCost = updates.base_wig_cost ?? currentWig.base_wig_cost ?? 0;
        const stylingCost = updates.styling_cost ?? currentWig.styling_cost ?? 0;
        totalCost = baseCost + stylingCost;
      }
    }

    const { data, error: updateError } = await this.client
      .from('wigs')
      .update({
        ...updates,
        ...(totalCost !== undefined && { total_cost: totalCost }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating wig:', updateError);
      throw error(500, `Failed to update wig: ${updateError.message}`);
    }

    return data as Wig;
  }

  /**
   * Delete a wig (soft delete)
   */
  async delete(id: string): Promise<void> {
    // Note: Character-wig links will be automatically cascade deleted by database FK constraint
    const { error: deleteError } = await this.client
      .from('wigs')
      .update({
        deleted_at: new Date().toISOString()
      })
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting wig:', deleteError);
      throw error(500, `Failed to delete wig: ${deleteError.message}`);
    }
  }

  /**
   * List wigs for a team with optional filtering
   */
  async list(params: ResourceSearchParams): Promise<ResourceSearchResult<Wig>> {
    const {
      team_id,
      query,
      status,
      offset = 0,
      limit = 50
    } = params;

    if (!team_id) {
      throw error(400, 'team_id is required');
    }

    let queryBuilder = this.client
      .from('wigs')
      .select('*', { count: 'exact' })
      .eq('team_id', team_id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    // Full-text search across wig_name, color, and base_wig_brand
    if (query) {
      queryBuilder = queryBuilder.textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english'
      });
    }

    // Filter by status
    if (status) {
      queryBuilder = queryBuilder.eq('status', status);
    }

    // Pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, error: listError, count } = await queryBuilder;

    if (listError) {
      console.error('Error listing wigs:', listError);
      throw error(500, `Failed to list wigs: ${listError.message}`);
    }

    return {
      resources: data as Wig[],
      total: count || 0,
      hasMore: (count || 0) > offset + limit
    };
  }

  /**
   * Filter wigs by linked character
   */
  async filterByCharacter(characterId: string, limit = 50): Promise<Wig[]> {
    const { data, error: filterError } = await this.client
      .from('character_wigs')
      .select(`
        wig_id,
        wigs!inner (
          *
        )
      `)
      .eq('character_id', characterId)
      .is('wigs.deleted_at', null)
      .limit(limit);

    if (filterError) {
      console.error('Error filtering wigs by character:', filterError);
      throw error(500, `Failed to filter wigs by character: ${filterError.message}`);
    }

    // Extract wigs from the joined result
    return data?.map((link: any) => link.wigs as Wig) || [];
  }

  /**
   * Filter wigs by status
   */
  async filterByStatus(teamId: string, status: string, limit = 50): Promise<Wig[]> {
    const { data, error: filterError } = await this.client
      .from('wigs')
      .select('*')
      .eq('team_id', teamId)
      .eq('status', status)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (filterError) {
      console.error('Error filtering wigs by status:', filterError);
      throw error(500, `Failed to filter wigs by status: ${filterError.message}`);
    }

    return data as Wig[];
  }

  /**
   * Link a wig to a character
   */
  async linkToCharacter(wigId: string, characterId: string, notes?: string): Promise<void> {
    const { error: linkError } = await this.client
      .from('character_wigs')
      .insert({
        wig_id: wigId,
        character_id: characterId,
        notes: notes || null
      });

    if (linkError) {
      // Check if it's a duplicate link error
      if (linkError.code === '23505') { // Unique constraint violation
        console.warn('Wig already linked to character');
        return; // Silently ignore duplicates
      }
      console.error('Error linking wig to character:', linkError);
      throw error(500, `Failed to link wig to character: ${linkError.message}`);
    }
  }

  /**
   * Unlink a wig from a character
   */
  async unlinkFromCharacter(wigId: string, characterId: string): Promise<void> {
    const { error: unlinkError } = await this.client
      .from('character_wigs')
      .delete()
      .eq('wig_id', wigId)
      .eq('character_id', characterId);

    if (unlinkError) {
      console.error('Error unlinking wig from character:', unlinkError);
      throw error(500, `Failed to unlink wig from character: ${unlinkError.message}`);
    }
  }

  /**
   * Get all characters linked to a wig
   */
  async getLinkedCharacters(wigId: string): Promise<any[]> {
    const { data, error: fetchError } = await this.client
      .from('character_wigs')
      .select(`
        character_id,
        notes,
        characters!inner (
          id,
          character_name,
          series,
          source_medium
        )
      `)
      .eq('wig_id', wigId);

    if (fetchError) {
      console.error('Error fetching linked characters:', fetchError);
      throw error(500, `Failed to fetch linked characters: ${fetchError.message}`);
    }

    return data || [];
  }
}

// Export singleton instance
export const wigService = WigService.getInstance();

