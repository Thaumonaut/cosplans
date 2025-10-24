/**
 * Resource Management System Types
 *
 * Defines TypeScript interfaces for all resource types:
 * - Characters (with series, references, and budget tracking) - NEW
 * - Wigs (with styling tasks, costs, and maintenance) - NEW
 * - Costumes (with complete lifecycle tracking)
 * - Crew Members (with contact info and roles)
 * - Equipment (with condition and ownership)
 * - Props (with lifecycle and storage)
 * - Locations (with accessibility and photos)
 */

import { z } from 'zod'

// Base resource interface shared by all types
export interface BaseResource {
  id: string
  team_id: string
  created_by: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// Lifecycle states for costumes and props
export type LifecycleState =
  | 'planned'
  | 'acquiring'
  | 'in_progress'
  | 'ready'
  | 'owned'
  | 'sold'
  | 'damaged'
  | 'rented'
  | 'lost'
  | 'stored'
  | 'loaned'
  | 'cancelled'
  | 'paused'

// Equipment condition states
export type EquipmentCondition =
  | 'excellent'
  | 'good'
  | 'fair'
  | 'needs_repair'
  | 'broken'

// Equipment ownership status
export type OwnershipStatus =
  | 'owned'
  | 'rented'
  | 'borrowed'
  | 'loaned_out'
  | 'needs_sourcing'

// Crew member roles
export type CrewRole =
  | 'photographer'
  | 'assistant'
  | 'makeup_artist'
  | 'model'
  | 'coordinator'
  | 'other'

// Location types
export type LocationType =
  | 'studio'
  | 'outdoor'
  | 'convention'
  | 'private_residence'
  | 'other'

// Equipment types
export type EquipmentType =
  | 'camera'
  | 'lens'
  | 'lighting'
  | 'tripod'
  | 'backdrop'
  | 'audio'
  | 'other'

// Prop types
export type PropType =
  | 'weapon'
  | 'accessory'
  | 'wig'
  | 'jewelry'
  | 'other'

// Resource photo interface
export interface ResourcePhoto {
  id: string
  resource_type: 'costume' | 'crew_member' | 'equipment' | 'prop' | 'location' | 'character' | 'wig'
  resource_id: string
  storage_path: string
  filename: string
  file_size: number
  mime_type: string
  width?: number
  height?: number
  display_order: number
  caption?: string
  is_primary: boolean
  uploaded_at: string
  uploaded_by: string
}

// Lifecycle history for audit trail
export interface LifecycleHistory {
  id: string
  resource_type: 'costume' | 'prop'
  resource_id: string
  from_status?: LifecycleState
  to_status: LifecycleState
  state_metadata: Record<string, any>
  notes?: string
  changed_by: string
  changed_at: string
}

// Costume interface
export interface Costume extends BaseResource {
  character_name: string
  series?: string
  costume_type?: string
  status: LifecycleState
  estimated_cost?: number
  actual_cost?: number
  completion_date?: string
  storage_location?: string
  state_metadata: Record<string, any>
  notes?: string
  search_vector: string
}

// Crew member interface
export interface CrewMember extends BaseResource {
  name: string
  previous_roles: CrewRole[]
  email?: string
  phone?: string
  portfolio_url?: string
  instagram_handle?: string
  twitter_handle?: string
  notes?: string
  is_favorite: boolean
  search_vector: string
}

// Equipment interface
export interface Equipment extends BaseResource {
  name: string
  equipment_type: EquipmentType
  brand?: string
  model?: string
  condition: EquipmentCondition
  ownership_status: OwnershipStatus
  purchase_date?: string
  purchase_price?: number
  serial_number?: string
  storage_location?: string
  notes?: string
  // Rental fields
  rental_return_date?: string
  rental_cost?: number
  rental_source?: string
  // Sourcing fields
  estimated_purchase_cost?: number
  estimated_rental_cost?: number
  sourcing_notes?: string
  search_vector: string
}

// Prop interface
export interface Prop extends BaseResource {
  name: string
  prop_type?: PropType
  character_series?: string
  status: LifecycleState
  estimated_cost?: number
  actual_cost?: number
  storage_location?: string
  condition?: string
  state_metadata: Record<string, any>
  notes?: string
  search_vector: string
}

// Location interface
export interface Location extends BaseResource {
  name: string
  location_type: LocationType
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  latitude?: number
  longitude?: number
  accessibility_notes?: string
  parking_info?: string
  cost_info?: string
  notes?: string
  is_favorite: boolean
  search_vector: string
}

// Source medium types for characters
export type SourceMedium =
  | 'anime'
  | 'manga'
  | 'video_game'
  | 'movie'
  | 'tv_show'
  | 'book'
  | 'comic'
  | 'stage'
  | 'original'

// Budget tracking modes
export type BudgetMode = 'personal' | 'commission'

// Wig status types
export type WigStatus =
  | 'planned'
  | 'ordered'
  | 'received'
  | 'in_progress'
  | 'completed'
  | 'needs_restyling'
  | 'damaged'

// Wig length types
export type WigLength = 'short' | 'medium' | 'long' | 'extra_long'

// Wig fiber types
export type WigFiberType = 'synthetic' | 'human_hair' | 'blend'

// Wig condition types
export type WigCondition = 'pristine' | 'good' | 'needs_care' | 'damaged'

// Character interface
export interface Character extends BaseResource {
  character_name: string
  series: string
  source_medium?: SourceMedium
  appearance_description?: string
  personality_notes?: string
  aliases?: string // Comma-separated aliases
  reference_images: string[] // R2 URLs
  budget_mode: BudgetMode
  budget_limit?: number
  completion_percentage: number
  updated_by?: string
  search_vector: string
}

// Wig interface
export interface Wig extends BaseResource {
  wig_name: string
  color: string
  length: WigLength
  fiber_type: WigFiberType
  base_wig_brand?: string
  status: WigStatus
  base_wig_cost?: number
  styling_cost?: number
  total_cost: number
  condition?: WigCondition
  last_washed_date?: string
  maintenance_notes?: string
  storage_location?: string
  storage_method?: string
  source_type?: string
  vendor_id?: string // FK to vendors table (nullable)
  updated_by?: string
  search_vector: string
}

// Character-Wig junction table
export interface CharacterWig {
  id: string
  character_id: string
  wig_id: string
  notes?: string
  created_at: string
}

// Crew account links
export interface CrewAccountLink {
  crew_member_id: string
  user_id: string
  linked_at: string
  linked_by: string
}

// Zod validation schemas
export const lifecycleStateSchema = z.enum([
  'planned', 'acquiring', 'in_progress', 'ready', 'owned',
  'sold', 'damaged', 'rented', 'lost', 'stored', 'loaned',
  'cancelled', 'paused'
])

export const equipmentConditionSchema = z.enum([
  'excellent', 'good', 'fair', 'needs_repair', 'broken'
])

export const ownershipStatusSchema = z.enum(['owned', 'rented', 'borrowed'])

export const crewRoleSchema = z.enum([
  'photographer', 'assistant', 'makeup_artist', 'model', 'coordinator', 'other'
])

export const locationTypeSchema = z.enum([
  'studio', 'outdoor', 'convention', 'private_residence', 'other'
])

export const equipmentTypeSchema = z.enum([
  'camera', 'lens', 'lighting', 'tripod', 'backdrop', 'audio', 'other'
])

export const propTypeSchema = z.enum([
  'weapon', 'accessory', 'wig', 'jewelry', 'other'
])

export const sourceMediumSchema = z.enum([
  'anime', 'manga', 'video_game', 'movie', 'tv_show', 'book', 'comic', 'stage', 'original'
])

export const budgetModeSchema = z.enum(['personal', 'commission'])

export const wigStatusSchema = z.enum([
  'planned', 'ordered', 'received', 'in_progress', 'completed', 'needs_restyling', 'damaged'
])

export const wigLengthSchema = z.enum(['short', 'medium', 'long', 'extra_long'])

export const wigFiberTypeSchema = z.enum(['synthetic', 'human_hair', 'blend'])

export const wigConditionSchema = z.enum(['pristine', 'good', 'needs_care', 'damaged'])

// Base resource schema
export const baseResourceSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  created_by: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable()
})

// Costume schema
export const costumeSchema = baseResourceSchema.extend({
  character_name: z.string().min(1, 'Character name is required'),
  series: z.string().optional(),
  costume_type: z.string().optional(),
  status: lifecycleStateSchema,
  estimated_cost: z.number().min(0).optional(),
  actual_cost: z.number().min(0).optional(),
  completion_date: z.string().optional(),
  storage_location: z.string().optional(),
  state_metadata: z.record(z.any()).default({}),
  notes: z.string().optional()
})

// Crew member schema
export const crewMemberSchema = baseResourceSchema.extend({
  name: z.string().min(1, 'Name is required'),
  role: crewRoleSchema,
  email: z.string().email().optional(),
  phone: z.string().optional(),
  portfolio_url: z.string().url().optional(),
  instagram_handle: z.string().optional(),
  twitter_handle: z.string().optional(),
  notes: z.string().optional(),
  is_favorite: z.boolean().default(false)
})

// Equipment schema
export const equipmentSchema = baseResourceSchema.extend({
  name: z.string().min(1, 'Equipment name is required'),
  equipment_type: equipmentTypeSchema,
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: equipmentConditionSchema,
  ownership_status: ownershipStatusSchema,
  purchase_date: z.string().optional(),
  purchase_price: z.number().min(0).optional(),
  rental_info: z.record(z.any()).default({}),
  notes: z.string().optional()
})

// Prop schema
export const propSchema = baseResourceSchema.extend({
  name: z.string().min(1, 'Prop name is required'),
  prop_type: propTypeSchema.optional(),
  character_series: z.string().optional(),
  status: lifecycleStateSchema,
  estimated_cost: z.number().min(0).optional(),
  actual_cost: z.number().min(0).optional(),
  storage_location: z.string().optional(),
  condition: z.string().optional(),
  state_metadata: z.record(z.any()).default({}),
  notes: z.string().optional()
})

// Location schema
export const locationSchema = baseResourceSchema.extend({
  name: z.string().min(1, 'Location name is required'),
  location_type: locationTypeSchema,
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  accessibility_notes: z.string().optional(),
  parking_info: z.string().optional(),
  cost_info: z.string().optional(),
  notes: z.string().optional(),
  is_favorite: z.boolean().default(false)
})

// Character schema
export const characterSchema = baseResourceSchema.extend({
  character_name: z.string().min(1, 'Character name is required'),
  series: z.string().min(1, 'Series is required'),
  source_medium: sourceMediumSchema.optional(),
  appearance_description: z.string().optional(),
  personality_notes: z.string().optional(),
  aliases: z.string().optional(),
  reference_images: z.array(z.string()).default([]),
  budget_mode: budgetModeSchema.default('personal'),
  budget_limit: z.number().min(0).optional(),
  completion_percentage: z.number().min(0).max(100).default(0),
  updated_by: z.string().uuid().optional()
})

// Wig schema
export const wigSchema = baseResourceSchema.extend({
  wig_name: z.string().min(1, 'Wig name is required'),
  color: z.string().min(1, 'Color is required'),
  length: wigLengthSchema,
  fiber_type: wigFiberTypeSchema,
  base_wig_brand: z.string().optional(),
  status: wigStatusSchema,
  base_wig_cost: z.number().min(0).optional(),
  styling_cost: z.number().min(0).optional(),
  total_cost: z.number().min(0).default(0),
  condition: wigConditionSchema.optional(),
  last_washed_date: z.string().optional(),
  maintenance_notes: z.string().optional(),
  storage_location: z.string().optional(),
  storage_method: z.string().optional(),
  source_type: z.string().optional(),
  vendor_id: z.string().uuid().optional(),
  updated_by: z.string().uuid().optional()
})

// Character-Wig junction schema
export const characterWigSchema = z.object({
  id: z.string().uuid(),
  character_id: z.string().uuid(),
  wig_id: z.string().uuid(),
  notes: z.string().optional(),
  created_at: z.string()
})

// Resource photo schema
export const resourcePhotoSchema = z.object({
  id: z.string().uuid(),
  resource_type: z.enum(['costume', 'crew_member', 'equipment', 'prop', 'location', 'character', 'wig']),
  resource_id: z.string().uuid(),
  storage_path: z.string(),
  filename: z.string(),
  file_size: z.number(),
  mime_type: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  display_order: z.number().default(0),
  caption: z.string().optional(),
  is_primary: z.boolean().default(false),
  uploaded_at: z.string(),
  uploaded_by: z.string().uuid()
})

// Form schemas for creating/updating resources
export const createCostumeSchema = z.object({
  team_id: z.string().uuid(),
  character_name: z.string().min(1, 'Character name is required'),
  series: z.string().optional(),
  costume_type: z.string().optional(),
  status: lifecycleStateSchema,
  estimated_cost: z.number().min(0).optional(),
  actual_cost: z.number().min(0).optional(),
  completion_date: z.string().optional(),
  storage_location: z.string().optional(),
  state_metadata: z.record(z.any()).default({}),
  notes: z.string().optional()
})

export const createCrewMemberSchema = z.object({
  team_id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  previous_roles: z.array(crewRoleSchema).default([]),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  portfolio_url: z.string().url().optional(),
  instagram_handle: z.string().optional(),
  twitter_handle: z.string().optional(),
  notes: z.string().optional(),
  is_favorite: z.boolean().default(false)
})

export const createEquipmentSchema = z.object({
  name: z.string().min(1, 'Equipment name is required'),
  equipment_type: equipmentTypeSchema,
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: equipmentConditionSchema,
  ownership_status: ownershipStatusSchema,
  purchase_date: z.string().optional(),
  purchase_price: z.number().min(0).optional(),
  rental_info: z.record(z.any()).default({}),
  notes: z.string().optional()
})

export const createPropSchema = z.object({
  name: z.string().min(1, 'Prop name is required'),
  prop_type: propTypeSchema.optional(),
  character_series: z.string().optional(),
  status: lifecycleStateSchema,
  estimated_cost: z.number().min(0).optional(),
  actual_cost: z.number().min(0).optional(),
  storage_location: z.string().optional(),
  condition: z.string().optional(),
  state_metadata: z.record(z.any()).default({}),
  notes: z.string().optional()
})

export const createLocationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  location_type: locationTypeSchema,
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  accessibility_notes: z.string().optional(),
  parking_info: z.string().optional(),
  cost_info: z.string().optional(),
  notes: z.string().optional(),
  is_favorite: z.boolean().default(false)
})

export const createCharacterSchema = z.object({
  team_id: z.string().uuid(),
  character_name: z.string().min(1, 'Character name is required'),
  series: z.string().min(1, 'Series is required'),
  source_medium: sourceMediumSchema.optional(),
  appearance_description: z.string().optional(),
  personality_notes: z.string().optional(),
  aliases: z.string().optional(),
  reference_images: z.array(z.string()).default([]),
  budget_mode: budgetModeSchema.default('personal'),
  budget_limit: z.number().min(0).optional()
})

export const createWigSchema = z.object({
  team_id: z.string().uuid(),
  wig_name: z.string().min(1, 'Wig name is required'),
  color: z.string().min(1, 'Color is required'),
  length: wigLengthSchema,
  fiber_type: wigFiberTypeSchema,
  base_wig_brand: z.string().optional(),
  status: wigStatusSchema.default('planned'),
  base_wig_cost: z.number().min(0).optional(),
  styling_cost: z.number().min(0).optional(),
  condition: wigConditionSchema.optional(),
  storage_location: z.string().optional(),
  storage_method: z.string().optional(),
  source_type: z.string().optional(),
  vendor_id: z.string().uuid().optional()
})

// Search and filter types
export interface ResourceSearchParams {
  query?: string
  type?: string
  status?: string
  role?: string
  condition?: string
  ownership?: string
  location_type?: string
  is_favorite?: boolean
  team_id?: string
  limit?: number
  offset?: number
}

export interface ResourceSearchResult<T> {
  resources: T[]
  total: number
  hasMore: boolean
}

// API response types
export interface ResourceApiResponse<T> {
  data?: T
  error?: string
}

export interface ResourceListResponse<T> extends ResourceApiResponse<T[]> {
  total: number
  hasMore: boolean
}

// Bulk operation types
export interface BulkOperationRequest {
  action: 'delete' | 'update_status' | 'export'
  ids: string[]
  data?: Record<string, any>
}

export interface BulkOperationResponse {
  success: number
  failed: number
  errors: string[]
}
