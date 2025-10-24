import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { Character, ResourceSearchParams, ResourceSearchResult } from '$lib/types/resources';
import { error } from '@sveltejs/kit';

export class CharacterService {
  private static instance: CharacterService;
  private client = getAdminClient();

  private constructor() {}

  public static getInstance(): CharacterService {
    if (!CharacterService.instance) {
      CharacterService.instance = new CharacterService();
    }
    return CharacterService.instance;
  }

  /**
   * Create a new character
   */
  async create(character: Omit<Character, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector' | 'completion_percentage'>): Promise<Character> {
    const { data, error: insertError } = await this.client
      .from('characters')
      .insert({
        ...character,
        completion_percentage: 0, // Always start at 0%
        reference_images: character.reference_images || []
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Error creating character:', insertError);
      throw error(500, `Failed to create character: ${insertError.message}`);
    }

    return data as Character;
  }

  /**
   * Get a character by ID
   */
  async getById(id: string): Promise<Character | null> {
    const { data, error: fetchError } = await this.client
      .from('characters')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching character:', fetchError);
      throw error(500, `Failed to fetch character: ${fetchError.message}`);
    }

    return data as Character | null;
  }

  /**
   * Update a character
   */
  async update(
    id: string,
    updates: Partial<Omit<Character, 'id' | 'team_id' | 'created_by' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector' | 'completion_percentage'>>
  ): Promise<Character> {
    const { data, error: updateError } = await this.client
      .from('characters')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating character:', updateError);
      throw error(500, `Failed to update character: ${updateError.message}`);
    }

    return data as Character;
  }

  /**
   * Delete a character (soft delete with automatic unlinking)
   */
  async delete(id: string): Promise<void> {
    // Note: Character-wig links will be automatically cascade deleted by database FK constraint
    const { error: deleteError } = await this.client
      .from('characters')
      .update({
        deleted_at: new Date().toISOString()
      })
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting character:', deleteError);
      throw error(500, `Failed to delete character: ${deleteError.message}`);
    }
  }

  /**
   * List characters for a team with optional filtering
   */
  async list(params: ResourceSearchParams): Promise<ResourceSearchResult<Character>> {
    const {
      team_id,
      query,
      offset = 0,
      limit = 50
    } = params;

    if (!team_id) {
      throw error(400, 'team_id is required');
    }

    let queryBuilder = this.client
      .from('characters')
      .select('*', { count: 'exact' })
      .eq('team_id', team_id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    // Full-text search across character_name, series, and aliases
    if (query) {
      queryBuilder = queryBuilder.textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english'
      });
    }

    // Pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, error: listError, count } = await queryBuilder;

    if (listError) {
      console.error('Error listing characters:', listError);
      throw error(500, `Failed to list characters: ${listError.message}`);
    }

    return {
      resources: data as Character[],
      total: count || 0,
      hasMore: (count || 0) > offset + limit
    };
  }

  /**
   * Search characters by name
   */
  async searchByName(teamId: string, searchQuery: string, limit = 10): Promise<Character[]> {
    const { data, error: searchError } = await this.client
      .from('characters')
      .select('*')
      .eq('team_id', teamId)
      .is('deleted_at', null)
      .ilike('character_name', `%${searchQuery}%`)
      .order('character_name')
      .limit(limit);

    if (searchError) {
      console.error('Error searching characters by name:', searchError);
      throw error(500, `Failed to search characters: ${searchError.message}`);
    }

    return data as Character[];
  }

  /**
   * Search characters by series
   */
  async searchBySeries(teamId: string, series: string, limit = 10): Promise<Character[]> {
    const { data, error: searchError } = await this.client
      .from('characters')
      .select('*')
      .eq('team_id', teamId)
      .eq('series', series)
      .is('deleted_at', null)
      .order('character_name')
      .limit(limit);

    if (searchError) {
      console.error('Error searching characters by series:', searchError);
      throw error(500, `Failed to search characters by series: ${searchError.message}`);
    }

    return data as Character[];
  }

  /**
   * Filter characters by source medium
   */
  async filterBySourceMedium(teamId: string, sourceMedium: string, limit = 50): Promise<Character[]> {
    const { data, error: filterError } = await this.client
      .from('characters')
      .select('*')
      .eq('team_id', teamId)
      .eq('source_medium', sourceMedium)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (filterError) {
      console.error('Error filtering characters by source medium:', filterError);
      throw error(500, `Failed to filter characters: ${filterError.message}`);
    }

    return data as Character[];
  }

  /**
   * Calculate and update completion percentage for a character
   * Formula: (completed resources / total resources) × 100
   */
  async calculateCompletionPercentage(characterId: string): Promise<number> {
    // Get linked wigs with completed status
    const { data: wigs, error: wigsError } = await this.client
      .from('character_wigs')
      .select(`
        wig_id,
        wigs!inner (
          id,
          status
        )
      `)
      .eq('character_id', characterId);

    if (wigsError) {
      console.error('Error fetching linked wigs:', wigsError);
      return 0;
    }

    // Count total and completed wigs
    const totalResources = wigs?.length || 0;
    if (totalResources === 0) {
      return 0;
    }

    const completedResources = wigs?.filter((link: any) => 
      link.wigs?.status === 'completed'
    ).length || 0;

    const percentage = Math.round((completedResources / totalResources) * 100);

    // Update the character with new percentage
    await this.update(characterId, {
      completion_percentage: percentage
    });

    return percentage;
  }

  /**
   * Check for duplicate character (same series + name)
   * Used for FR-001a duplicate prevention
   */
  async findDuplicate(teamId: string, characterName: string, series: string, excludeId?: string): Promise<Character | null> {
    let queryBuilder = this.client
      .from('characters')
      .select('*')
      .eq('team_id', teamId)
      .eq('character_name', characterName)
      .eq('series', series)
      .is('deleted_at', null)
      .limit(1);

    // Exclude current character if updating
    if (excludeId) {
      queryBuilder = queryBuilder.neq('id', excludeId);
    }

    const { data, error: searchError } = await queryBuilder.single();

    if (searchError && searchError.code !== 'PGRST116') {
      console.error('Error checking for duplicate character:', searchError);
      return null;
    }

    return data as Character | null;
  }
}

// Export singleton instance
export const characterService = CharacterService.getInstance();

