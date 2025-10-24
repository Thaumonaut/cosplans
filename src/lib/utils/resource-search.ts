/**
 * Resource Search Utilities
 *
 * Provides search and filtering functionality for all resource types.
 * Uses PostgreSQL full-text search with debouncing and caching.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  ResourceSearchParams,
  Costume,
  CrewMember,
  Equipment,
  Prop,
  Location,
  ResourceSearchResult
} from '$lib/types/resources'

// Search result type union
type SearchableResource = Costume | CrewMember | Equipment | Prop | Location

export class ResourceSearchService {
  private supabase: SupabaseClient
  private searchCache = new Map<string, { results: any[], timestamp: number }>()
  private readonly CACHE_DURATION = 30000 // 30 seconds

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  /**
   * Search across all resource types
   */
  async searchAll(params: ResourceSearchParams): Promise<ResourceSearchResult<SearchableResource>> {
    const cacheKey = this.generateCacheKey('all', params)

    // Check cache first
    const cached = this.searchCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.results as ResourceSearchResult<SearchableResource>
    }

    const results: SearchableResource[] = []
    let total = 0

    // Search each resource type
    const searchPromises = [
      this.searchCostumes(params),
      this.searchCrew(params),
      this.searchEquipment(params),
      this.searchProps(params),
      this.searchLocations(params)
    ]

    try {
      const searchResults = await Promise.all(searchPromises)

      // Combine results
      for (const result of searchResults) {
        results.push(...result.resources)
        total += result.total
      }

      // Sort by relevance (if search query provided) or by updated date
      if (params.query) {
        results.sort((a, b) => {
          // Sort by updated date (newest first) as secondary sort
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        })
      } else {
        results.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      }

      // Apply pagination
      const start = params.offset || 0
      const limit = params.limit || 50
      const paginatedResults = results.slice(start, start + limit)

      const searchResult: ResourceSearchResult<SearchableResource> = {
        resources: paginatedResults,
        total,
        hasMore: start + limit < total
      }

      // Cache results
      this.searchCache.set(cacheKey, { results: searchResult, timestamp: Date.now() })

      return searchResult

    } catch (error) {
      console.error('Search error:', error)
      throw new Error('Search failed')
    }
  }

  /**
   * Search costumes
   */
  async searchCostumes(params: ResourceSearchParams): Promise<ResourceSearchResult<Costume>> {
    let query = this.supabase
      .from('costumes')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)

    // Apply search query
    if (params.query) {
      query = query.textSearch('search_vector', params.query)
    }

    // Apply filters
    if (params.status) {
      query = query.eq('status', params.status)
    }

    // Apply pagination
    if (params.limit) {
      query = query.limit(params.limit)
    }
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 50) - 1)
    }

    const { data: costumes, error, count } = await query

    if (error) {
      throw new Error(`Costume search failed: ${error.message}`)
    }

    return {
      resources: costumes || [],
      total: count || 0,
      hasMore: false // Simplified for MVP
    }
  }

  /**
   * Search crew members
   */
  async searchCrew(params: ResourceSearchParams): Promise<ResourceSearchResult<CrewMember>> {
    let query = this.supabase
      .from('crew_members')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)

    // Apply search query
    if (params.query) {
      query = query.textSearch('search_vector', params.query)
    }

    // Apply filters
    if (params.role) {
      query = query.eq('role', params.role)
    }
    if (params.is_favorite !== undefined) {
      query = query.eq('is_favorite', params.is_favorite)
    }

    // Apply pagination
    if (params.limit) {
      query = query.limit(params.limit)
    }
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 50) - 1)
    }

    const { data: crew, error, count } = await query

    if (error) {
      throw new Error(`Crew search failed: ${error.message}`)
    }

    return {
      resources: crew || [],
      total: count || 0,
      hasMore: false
    }
  }

  /**
   * Search equipment
   */
  async searchEquipment(params: ResourceSearchParams): Promise<ResourceSearchResult<Equipment>> {
    let query = this.supabase
      .from('equipment')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)

    // Apply search query
    if (params.query) {
      query = query.textSearch('search_vector', params.query)
    }

    // Apply filters
    if (params.type) {
      query = query.eq('equipment_type', params.type)
    }
    if (params.condition) {
      query = query.eq('condition', params.condition)
    }
    if (params.ownership) {
      query = query.eq('ownership_status', params.ownership)
    }

    // Apply pagination
    if (params.limit) {
      query = query.limit(params.limit)
    }
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 50) - 1)
    }

    const { data: equipment, error, count } = await query

    if (error) {
      throw new Error(`Equipment search failed: ${error.message}`)
    }

    return {
      resources: equipment || [],
      total: count || 0,
      hasMore: false
    }
  }

  /**
   * Search props
   */
  async searchProps(params: ResourceSearchParams): Promise<ResourceSearchResult<Prop>> {
    let query = this.supabase
      .from('props')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)

    // Apply search query
    if (params.query) {
      query = query.textSearch('search_vector', params.query)
    }

    // Apply filters
    if (params.status) {
      query = query.eq('status', params.status)
    }
    if (params.type) {
      query = query.eq('prop_type', params.type)
    }

    // Apply pagination
    if (params.limit) {
      query = query.limit(params.limit)
    }
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 50) - 1)
    }

    const { data: props, error, count } = await query

    if (error) {
      throw new Error(`Props search failed: ${error.message}`)
    }

    return {
      resources: props || [],
      total: count || 0,
      hasMore: false
    }
  }

  /**
   * Search locations
   */
  async searchLocations(params: ResourceSearchParams): Promise<ResourceSearchResult<Location>> {
    let query = this.supabase
      .from('locations')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)

    // Apply search query
    if (params.query) {
      query = query.textSearch('search_vector', params.query)
    }

    // Apply filters
    if (params.location_type) {
      query = query.eq('location_type', params.location_type)
    }
    if (params.is_favorite !== undefined) {
      query = query.eq('is_favorite', params.is_favorite)
    }

    // Apply pagination
    if (params.limit) {
      query = query.limit(params.limit)
    }
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 50) - 1)
    }

    const { data: locations, error, count } = await query

    if (error) {
      throw new Error(`Locations search failed: ${error.message}`)
    }

    return {
      resources: locations || [],
      total: count || 0,
      hasMore: false
    }
  }

  /**
   * Clear search cache
   */
  clearCache() {
    this.searchCache.clear()
  }

  /**
   * Generate cache key for search parameters
   */
  private generateCacheKey(resourceType: string, params: ResourceSearchParams): string {
    const keyParts = [
      resourceType,
      params.query || '',
      params.status || '',
      params.role || '',
      params.type || '',
      params.condition || '',
      params.ownership || '',
      params.location_type || '',
      params.is_favorite?.toString() || '',
      params.limit?.toString() || '',
      params.offset?.toString() || ''
    ]
    return keyParts.join('|')
  }

  /**
   * Get resource statistics for dashboard
   */
  async getResourceStats(teamId?: string): Promise<{
    costumes: number
    crew: number
    equipment: number
    props: number
    locations: number
    total: number
  }> {
    const baseQuery = teamId ? { team_id: teamId } : {}

    try {
      const [costumesResult, crewResult, equipmentResult, propsResult, locationsResult] = await Promise.all([
        this.supabase.from('costumes').select('*', { count: 'exact', head: true }).match(baseQuery).is('deleted_at', null),
        this.supabase.from('crew_members').select('*', { count: 'exact', head: true }).match(baseQuery).is('deleted_at', null),
        this.supabase.from('equipment').select('*', { count: 'exact', head: true }).match(baseQuery).is('deleted_at', null),
        this.supabase.from('props').select('*', { count: 'exact', head: true }).match(baseQuery).is('deleted_at', null),
        this.supabase.from('locations').select('*', { count: 'exact', head: true }).match(baseQuery).is('deleted_at', null)
      ])

      const stats = {
        costumes: costumesResult.count || 0,
        crew: crewResult.count || 0,
        equipment: equipmentResult.count || 0,
        props: propsResult.count || 0,
        locations: locationsResult.count || 0,
        total: (costumesResult.count || 0) + (crewResult.count || 0) + (equipmentResult.count || 0) +
               (propsResult.count || 0) + (locationsResult.count || 0)
      }

      return stats

    } catch (error) {
      console.error('Stats error:', error)
      return {
        costumes: 0,
        crew: 0,
        equipment: 0,
        props: 0,
        locations: 0,
        total: 0
      }
    }
  }
}

// Export singleton instance
export let resourceSearchService: ResourceSearchService | null = null

// Initialize service with Supabase client
export function initializeResourceSearchService(supabase: SupabaseClient) {
  resourceSearchService = new ResourceSearchService(supabase)
  return resourceSearchService
}
