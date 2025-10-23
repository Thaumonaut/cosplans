import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { Equipment, ResourceSearchParams, ResourceSearchResult } from '$lib/types/resources';
import { error } from '@sveltejs/kit';

export class EquipmentService {
  private static instance: EquipmentService;
  private client = getAdminClient();

  private constructor() {}

  public static getInstance(): EquipmentService {
    if (!EquipmentService.instance) {
      EquipmentService.instance = new EquipmentService();
    }
    return EquipmentService.instance;
  }

  async create(equipment: Omit<Equipment, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector'>): Promise<Equipment> {
    const { data, error: insertError } = await this.client
      .from('equipment')
      .insert(equipment)
      .select('*')
      .single();

    if (insertError) {
      console.error('Error creating equipment:', insertError);
      throw error(500, `Failed to create equipment: ${insertError.message}`);
    }

    return data as Equipment;
  }

  async getById(id: string): Promise<Equipment | null> {
    const { data, error: fetchError } = await this.client
      .from('equipment')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching equipment:', fetchError);
      throw error(500, `Failed to fetch equipment: ${fetchError.message}`);
    }

    return data as Equipment | null;
  }

  async update(id: string, updates: Partial<Omit<Equipment, 'id' | 'team_id' | 'created_by' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector'>>): Promise<Equipment> {
    const { data, error: updateError } = await this.client
      .from('equipment')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating equipment:', updateError);
      throw error(500, `Failed to update equipment: ${updateError.message}`);
    }

    return data as Equipment;
  }

  async delete(id: string): Promise<boolean> {
    const { error: deleteError } = await this.client
      .from('equipment')
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting equipment:', deleteError);
      throw error(500, `Failed to delete equipment: ${deleteError.message}`);
    }

    return true;
  }

  async search(params: ResourceSearchParams): Promise<ResourceSearchResult<Equipment>> {
    const { query, type, condition, ownership, limit = 20, offset = 0, team_id } = params;

    let queryBuilder = this.client
      .from('equipment')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    if (team_id) {
      queryBuilder = queryBuilder.eq('team_id', team_id);
    } else {
      throw error(400, 'team_id is required');
    }

    if (query) {
      queryBuilder = queryBuilder.textSearch('search_vector', query, { type: 'websearch', config: 'english' });
    }

    if (type) queryBuilder = queryBuilder.eq('equipment_type', type);
    if (condition) queryBuilder = queryBuilder.eq('condition', condition);
    if (ownership) queryBuilder = queryBuilder.eq('ownership_status', ownership);

    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, count, error: searchError } = await queryBuilder;

    if (searchError) {
      console.error('Error searching equipment:', searchError);
      throw error(500, `Failed to search equipment: ${searchError.message}`);
    }

    return {
      resources: data as Equipment[],
      total: count || 0,
      hasMore: (offset + (data?.length || 0)) < (count || 0)
    };
  }
}

export const equipmentService = EquipmentService.getInstance();
