/**
 * Allocation Service (Stub)
 * 
 * Feature: Spec 048 - Material Allocation System
 * Status: STUB - Placeholder for future implementation
 * 
 * This service will handle:
 * - Material-to-resource allocation tracking (FR-079)
 * - Per-project material cost allocation (FR-079)
 * - Cost aggregation per character (FR-081)
 * - Tool-to-material linking (FR-082)
 * 
 * Implementation deferred to Phase 3 (Materials Management)
 */

import { getAdminClient } from '$lib/server/supabase/admin-client';
import { error } from '@sveltejs/kit';

export class AllocationService {
  private static instance: AllocationService;
  private client = getAdminClient();

  private constructor() {}

  public static getInstance(): AllocationService {
    if (!AllocationService.instance) {
      AllocationService.instance = new AllocationService();
    }
    return AllocationService.instance;
  }

  /**
   * Get material allocations for a character (STUB)
   * @returns Empty array until materials system is implemented
   */
  async getMaterialAllocationsForCharacter(characterId: string): Promise<any[]> {
    console.warn('AllocationService.getMaterialAllocationsForCharacter called but materials system not yet implemented');
    return [];
  }

  /**
   * Get material allocations for a wig (STUB)
   * @returns Empty array until materials system is implemented
   */
  async getMaterialAllocationsForWig(wigId: string): Promise<any[]> {
    console.warn('AllocationService.getMaterialAllocationsForWig called but materials system not yet implemented');
    return [];
  }

  /**
   * Calculate total material costs for a character (STUB)
   * @returns 0 until materials system is implemented
   */
  async calculateMaterialCostsForCharacter(characterId: string): Promise<number> {
    console.warn('AllocationService.calculateMaterialCostsForCharacter called but materials system not yet implemented');
    return 0;
  }

  /**
   * Allocate material to a resource (STUB)
   * @throws Error indicating feature not yet implemented
   */
  async allocateMaterial(materialId: string, resourceId: string, resourceType: string, quantityUsed: number, costAllocated: number): Promise<void> {
    throw error(501, 'Material allocation not yet implemented. This feature will be available in Phase 3 (Materials Management).');
  }
}

// Export singleton instance
export const allocationService = AllocationService.getInstance();

