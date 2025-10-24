/**
 * Resource Lifecycle State Management
 *
 * Defines allowed state transitions and validation for costumes and props.
 * Implements finite state machine with override confirmation for corrections.
 */

import type { LifecycleState } from '$lib/types/resources'

// Allowed transitions for each lifecycle state
export const ALLOWED_TRANSITIONS: Record<LifecycleState, LifecycleState[]> = {
  planned: ['acquiring', 'in_progress', 'cancelled'],
  acquiring: ['in_progress', 'planned'],
  in_progress: ['ready', 'acquiring', 'paused'],
  ready: ['owned', 'in_progress'],
  owned: ['sold', 'damaged', 'loaned', 'stored', 'lost'],
  sold: [], // Terminal state (with override)
  damaged: ['owned', 'lost'], // Can repair or write off
  loaned: ['owned'], // Return from loan
  stored: ['owned'], // Retrieve from storage
  lost: [], // Terminal state
  rented: ['owned'], // Return rental
  cancelled: [], // Terminal state
  paused: ['in_progress', 'cancelled'] // Resume work or cancel
}

// State metadata requirements for each state
export const STATE_METADATA_REQUIREMENTS: Record<LifecycleState, string[]> = {
  planned: ['estimated_cost'],
  acquiring: ['estimated_cost'],
  in_progress: ['estimated_cost'],
  ready: ['actual_cost', 'completion_date'],
  owned: ['actual_cost', 'completion_date'],
  sold: ['sale_price', 'sale_date', 'buyer_info'],
  damaged: ['damage_details', 'repair_cost', 'repair_timeline'],
  loaned: ['borrower_name', 'borrower_contact', 'return_date', 'loan_terms'],
  stored: ['storage_location', 'storage_conditions'],
  lost: ['loss_details', 'loss_date', 'insurance_claim'],
  rented: ['rental_cost', 'rental_period', 'rental_company'],
  cancelled: ['cancellation_reason', 'cancellation_date'],
  paused: ['pause_reason', 'resume_date']
}

// Human-readable state labels
export const STATE_LABELS: Record<LifecycleState, string> = {
  planned: 'Planned',
  acquiring: 'Acquiring',
  in_progress: 'In Progress',
  ready: 'Ready',
  owned: 'Owned',
  sold: 'Sold',
  damaged: 'Damaged',
  loaned: 'Loaned',
  stored: 'Stored',
  lost: 'Lost',
  rented: 'Rented',
  cancelled: 'Cancelled',
  paused: 'Paused'
}

// State colors for UI badges
export const STATE_COLORS: Record<LifecycleState, string> = {
  planned: 'var(--theme-info)',
  acquiring: 'var(--theme-warning)',
  in_progress: 'var(--theme-warning)',
  ready: 'var(--theme-info)',
  owned: 'var(--theme-success)',
  sold: 'var(--theme-muted)',
  damaged: 'var(--theme-error)',
  loaned: 'var(--theme-warning)',
  stored: 'var(--theme-info)',
  lost: 'var(--theme-error)',
  rented: 'var(--theme-warning)',
  cancelled: 'var(--theme-muted)',
  paused: 'var(--theme-warning)'
}

// Terminal states (no further transitions possible without override)
export const TERMINAL_STATES: LifecycleState[] = ['sold', 'lost', 'cancelled']

// States that indicate availability for shoots
export const AVAILABLE_STATES: LifecycleState[] = ['owned', 'ready']

// States that indicate unavailability for shoots
export const UNAVAILABLE_STATES: LifecycleState[] = ['sold', 'damaged', 'loaned', 'lost', 'rented', 'stored']

/**
 * Validates if a state transition is allowed
 */
export function isValidTransition(fromState: LifecycleState, toState: LifecycleState): boolean {
  return ALLOWED_TRANSITIONS[fromState]?.includes(toState) ?? false
}

/**
 * Gets all allowed next states for a given state
 */
export function getAllowedTransitions(currentState: LifecycleState): LifecycleState[] {
  return ALLOWED_TRANSITIONS[currentState] ?? []
}

/**
 * Checks if a state is terminal (no further transitions without override)
 */
export function isTerminalState(state: LifecycleState): boolean {
  return TERMINAL_STATES.includes(state)
}

/**
 * Checks if a resource is available for shoots
 */
export function isAvailableForShoots(state: LifecycleState): boolean {
  return AVAILABLE_STATES.includes(state)
}

/**
 * Gets the CSS color variable for a state badge
 */
export function getStateColor(state: LifecycleState): string {
  return STATE_COLORS[state] ?? 'var(--theme-muted)'
}

/**
 * Gets the human-readable label for a state
 */
export function getStateLabel(state: LifecycleState): string {
  return STATE_LABELS[state] ?? state
}

/**
 * Validates state transition and returns validation result
 */
export function validateStateTransition(
  fromState: LifecycleState,
  toState: LifecycleState,
  overrideReason?: string
): { valid: boolean; requiresOverride: boolean; message: string } {
  if (isValidTransition(fromState, toState)) {
    return {
      valid: true,
      requiresOverride: false,
      message: `Transition from ${getStateLabel(fromState)} to ${getStateLabel(toState)} is allowed.`
    }
  }

  if (isTerminalState(fromState) && overrideReason) {
    return {
      valid: true,
      requiresOverride: true,
      message: `Override: ${overrideReason}. Transition from ${getStateLabel(fromState)} to ${getStateLabel(toState)}.`
    }
  }

  return {
    valid: false,
    requiresOverride: false,
    message: `Invalid transition from ${getStateLabel(fromState)} to ${getStateLabel(toState)}. Allowed transitions: ${getAllowedTransitions(fromState).map(getStateLabel).join(', ')}`
  }
}

/**
 * Gets state-specific metadata requirements
 */
export function getRequiredMetadata(state: LifecycleState): string[] {
  return STATE_METADATA_REQUIREMENTS[state] ?? []
}

/**
 * Validates that required metadata is provided for a state
 */
export function validateStateMetadata(
  state: LifecycleState,
  metadata: Record<string, any>
): { valid: boolean; missing: string[]; message: string } {
  const required = getRequiredMetadata(state)
  const missing = required.filter(field => !metadata[field])

  if (missing.length === 0) {
    return {
      valid: true,
      missing: [],
      message: 'All required metadata provided.'
    }
  }

  return {
    valid: false,
    missing,
    message: `Missing required metadata for ${getStateLabel(state)}: ${missing.join(', ')}`
  }
}

/**
 * Creates default state metadata for a lifecycle state
 */
export function createDefaultStateMetadata(state: LifecycleState): Record<string, any> {
  const baseMetadata: Record<string, any> = {}

  switch (state) {
    case 'planned':
      return { estimated_cost: 0 }
    case 'in_progress':
      return { progress_percentage: 0 }
    case 'sold':
      return { sale_price: 0, sale_date: new Date().toISOString().split('T')[0] }
    case 'damaged':
      return { damage_details: '', repair_cost: 0 }
    case 'loaned':
      return { borrower_name: '', return_date: '', loan_terms: '' }
    case 'rented':
      return { rental_cost: 0, rental_period: '', rental_company: '' }
    case 'stored':
      return { storage_location: '', storage_conditions: '' }
    case 'lost':
      return { loss_details: '', loss_date: new Date().toISOString().split('T')[0] }
    case 'cancelled':
      return { cancellation_reason: '', cancellation_date: new Date().toISOString().split('T')[0] }
    case 'paused':
      return { pause_reason: '', resume_date: '' }
    default:
      return {}
  }
}
