import { writable } from 'svelte/store'
import { supabase, auth } from './auth-utils'
import type { AuthState, User, AuthSession } from './types'

// Create the auth store
function createAuthStore() {
  let currentState: AuthState = {
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false
  }

  const { subscribe, set, update } = writable<AuthState>(currentState)

  // Subscribe to changes to keep currentState in sync
  subscribe(state => {
    currentState = state
  })

  // Initialize auth state from current session
  const initialize = async () => {
    try {
      const { data: sessionData, error: sessionError } = await auth.getSession()

      if (sessionError) {
        console.error('Error getting session:', sessionError)
        set({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false
        })
        return
      }

      if (sessionData.session?.user) {
        set({
          user: sessionData.session.user as User,
          session: sessionData.session as unknown as AuthSession,
          isLoading: false,
          isAuthenticated: true
        })
      } else {
        set({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false
        })
      }
    } catch (error) {
      console.error('Error initializing auth store:', error)
      set({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false
      })
    }
  }

  // Get current state (for use in load functions)
  const getState = () => currentState

  // Set up auth state change listener
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, session)

    if (event === 'SIGNED_IN' && session?.user) {
      set({
        user: session.user as User,
        session: session as unknown as AuthSession,
        isLoading: false,
        isAuthenticated: true
      })
    } else if (event === 'SIGNED_OUT') {
      set({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false
      })
    } else if (event === 'TOKEN_REFRESHED' && session?.user) {
      update(state => ({
        ...state,
        user: session.user as User,
        session: session as unknown as AuthSession,
        isLoading: false
      }))
    }
  })

  // Auth methods
  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    update(state => ({ ...state, isLoading: true }))

    const { data, error } = await auth.signUp(email, password, {
      firstName,
      lastName
    })

    update(state => ({ ...state, isLoading: false }))

    if (error) {
      throw error
    }

    return data
  }

  const signIn = async (email: string, password: string) => {
    update(state => ({ ...state, isLoading: true }))

    const { data, error } = await auth.signIn(email, password)

    update(state => ({ ...state, isLoading: false }))

    if (error) {
      throw error
    }

    return data
  }

  const signInWithOAuth = async (provider: 'google' | 'facebook' | 'twitter') => {
    update(state => ({ ...state, isLoading: true }))

    const { data, error } = await auth.signInWithOAuth(provider)

    // Note: For OAuth, the loading state will be managed by the auth state change listener
    if (error) {
      update(state => ({ ...state, isLoading: false }))
      throw error
    }

    return data
  }

  const signOut = async () => {
    update(state => ({ ...state, isLoading: true }))

    const { error } = await auth.signOut()

    // Note: The auth state change listener will handle updating the state
    if (error) {
      update(state => ({ ...state, isLoading: false }))
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await auth.resetPassword(email)

    if (error) {
      throw error
    }

    return data
  }

  const updatePassword = async (password: string) => {
    const { data, error } = await auth.updatePassword(password)

    if (error) {
      throw error
    }

    return data
  }

  return {
    subscribe,
    initialize,
    getState,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword
  }
}

export const authStore = createAuthStore()
