import { getAdminClient } from '$lib/server/supabase/admin-client';
import type { Location, ResourceSearchParams, ResourceSearchResult } from '$lib/types/resources';
import { error } from '@sveltejs/kit';

export class LocationService {
  private static instance: LocationService;
  private client = getAdminClient();

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async create(location: Omit<Location, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector'>): Promise<Location> {
    const { data, error: insertError } = await this.client
      .from('locations')
      .insert(location)
      .select('*')
      .single();

    if (insertError) {
      console.error('Error creating location:', insertError);
      throw error(500, `Failed to create location: ${insertError.message}`);
    }

    return data as Location;
  }

  async getById(id: string): Promise<Location | null> {
    const { data, error: fetchError } = await this.client
      .from('locations')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching location:', fetchError);
      throw error(500, `Failed to fetch location: ${fetchError.message}`);
    }

    return data as Location | null;
  }

  async update(id: string, updates: Partial<Omit<Location, 'id' | 'team_id' | 'created_by' | 'created_at' | 'updated_at' | 'deleted_at' | 'search_vector'>>): Promise<Location> {
    const { data, error: updateError } = await this.client
      .from('locations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating location:', updateError);
      throw error(500, `Failed to update location: ${updateError.message}`);
    }

    return data as Location;
  }

  async delete(id: string): Promise<boolean> {
    const { error: deleteError } = await this.client
      .from('locations')
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting location:', deleteError);
      throw error(500, `Failed to delete location: ${deleteError.message}`);
    }

    return true;
  }

  async toggleFavorite(id: string): Promise<Location> {
    const current = await this.getById(id);
    if (!current) {
      throw error(404, 'Location not found');
    }

    return this.update(id, { is_favorite: !current.is_favorite });
  }

  async search(params: ResourceSearchParams): Promise<ResourceSearchResult<Location>> {
    const { query, location_type, is_favorite, limit = 20, offset = 0, team_id } = params;

    let queryBuilder = this.client
      .from('locations')
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

    if (location_type) queryBuilder = queryBuilder.eq('location_type', location_type);
    if (is_favorite !== undefined) queryBuilder = queryBuilder.eq('is_favorite', is_favorite);

    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, count, error: searchError } = await queryBuilder;

    if (searchError) {
      console.error('Error searching locations:', searchError);
      throw error(500, `Failed to search locations: ${searchError.message}`);
    }

    return {
      resources: data as Location[],
      total: count || 0,
      hasMore: (offset + (data?.length || 0)) < (count || 0)
    };
  }
}

export const locationService = LocationService.getInstance();
