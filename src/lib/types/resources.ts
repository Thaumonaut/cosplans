/**
 * Resource Management System Types
 *
 * Defines TypeScript interfaces for all 5 resource types:
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
  resource_type: 'costume' | 'crew_member' | 'equipment' | 'prop' | 'location'
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

// Resource photo schema
export const resourcePhotoSchema = z.object({
  id: z.string().uuid(),
  resource_type: z.enum(['costume', 'crew_member', 'equipment', 'prop', 'location']),
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
