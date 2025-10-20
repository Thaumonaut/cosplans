import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase browser client with SSR support
// This properly handles PKCE flow and cookies for OAuth
export const supabase: SupabaseClient = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, metadata?: { firstName?: string; lastName?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign in with OAuth provider
  signInWithOAuth: async (provider: 'google' | 'facebook' | 'twitter') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session (secure - validates JWT)
  // Note: We only use getUser() as it validates the JWT
  // getSession() is insecure and should not be used
  getSession: async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError || !userData.user) {
      return { data: { session: null, user: null }, error: userError }
    }
    
    // Return the validated user
    return { 
      data: { 
        session: { user: userData.user }, // Minimal session with validated user
        user: userData.user 
      }, 
      error: null 
    }
  },

  // Get current user (validates JWT)
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { data, error }
  },

  // Update password
  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password })
    return { data, error }
  }
}

export default supabase
