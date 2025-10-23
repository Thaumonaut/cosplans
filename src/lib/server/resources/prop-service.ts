import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { Prop, ResourceSearchParams, ResourceSearchResult, LifecycleState } from '$lib/types/resources';
import { validateStateTransition } from '$lib/utils/lifecycle-states';
import { error } from '@sveltejs/kit';

export class PropService {
  private static instance: PropService;
  private client = getAdminClient();

  private constructor() {}

  public static getInstance(): PropService {
    if (!PropService.instance) {
      PropService.instance = new PropService();
    }
    return PropService.instance;
  }

  async create(prop: Omit<Prop, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector'>): Promise<Prop> {
    const { data, error: insertError } = await this.client
      .from('props')
      .insert({ ...prop, state_metadata: prop.state_metadata || {} })
      .select('*')
      .single();

    if (insertError) {
      console.error('Error creating prop:', insertError);
      throw error(500, `Failed to create prop: ${insertError.message}`);
    }

    return data as Prop;
  }

  async getById(id: string): Promise<Prop | null> {
    const { data, error: fetchError } = await this.client
      .from('props')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching prop:', fetchError);
      throw error(500, `Failed to fetch prop: ${fetchError.message}`);
    }

    return data as Prop | null;
  }

  async update(id: string, updates: Partial<Omit<Prop, 'id' | 'team_id' | 'created_by' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector'>>): Promise<Prop> {
    if (updates.status) {
      const current = await this.getById(id);
      if (current) {
        const validation = validateStateTransition(current.status, updates.status);
        if (!validation.valid) {
          throw error(400, `Invalid status transition: ${validation.message}`);
        }
      }
    }

    const { data, error: updateError } = await this.client
      .from('props')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating prop:', updateError);
      throw error(500, `Failed to update prop: ${updateError.message}`);
    }

    return data as Prop;
  }

  async delete(id: string): Promise<boolean> {
    const { error: deleteError } = await this.client
      .from('props')
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting prop:', deleteError);
      throw error(500, `Failed to delete prop: ${deleteError.message}`);
    }

    return true;
  }

  async search(params: ResourceSearchParams): Promise<ResourceSearchResult<Prop>> {
    const { query, status, limit = 20, offset = 0, team_id } = params;

    let queryBuilder = this.client
      .from('props')
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

    if (status) queryBuilder = queryBuilder.eq('status', status);

    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, count, error: searchError } = await queryBuilder;

    if (searchError) {
      console.error('Error searching props:', searchError);
      throw error(500, `Failed to search props: ${searchError.message}`);
    }

    return {
      resources: data as Prop[],
      total: count || 0,
      hasMore: (offset + (data?.length || 0)) < (count || 0)
    };
  }
}

export const propService = PropService.getInstance();
