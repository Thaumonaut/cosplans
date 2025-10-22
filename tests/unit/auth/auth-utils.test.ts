import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auth, supabase } from '$lib/auth/auth-utils'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn()
    }
  }))
}))

describe('Auth Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signUp', () => {
    it('should successfully sign up a user with email and password', async () => {
      const mockUser = { id: '123', email: 'test@example.com' }
      const mockSession = { access_token: 'token', user: mockUser }
      
      vi.spyOn(supabase.auth, 'signUp').mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      })

      const result = await auth.signUp('test@example.com', 'password123')

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: undefined
        }
      })
      expect(result.data?.user?.email).toBe('test@example.com')
      expect(result.error).toBeNull()
    })

    it('should include metadata when provided', async () => {
      const metadata = { firstName: 'John', lastName: 'Doe' }
      
      vi.spyOn(supabase.auth, 'signUp').mockResolvedValue({
        data: { user: null, session: null },
        error: null
      })

      await auth.signUp('test@example.com', 'password123', metadata)

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: metadata
        }
      })
    })

    it('should handle sign up errors', async () => {
      const mockError = { message: 'User already registered' }
      
      vi.spyOn(supabase.auth, 'signUp').mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      })

      const result = await auth.signUp('existing@example.com', 'password123')

      expect(result.error).toEqual(mockError)
      expect(result.data.user).toBeNull()
    })

    it('should handle weak password errors', async () => {
      const mockError = { message: 'Password should be at least 6 characters' }
      
      vi.spyOn(supabase.auth, 'signUp').mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      })

      const result = await auth.signUp('test@example.com', '123')

      expect(result.error).toEqual(mockError)
    })
  })

  describe('signIn', () => {
    it('should successfully sign in with valid credentials', async () => {
      const mockUser = { id: '123', email: 'test@example.com' }
      const mockSession = { access_token: 'token', user: mockUser }
      
      vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      })

      const result = await auth.signIn('test@example.com', 'password123')

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(result.data?.user?.email).toBe('test@example.com')
      expect(result.error).toBeNull()
    })

    it('should handle invalid credentials', async () => {
      const mockError = { message: 'Invalid login credentials' }
      
      vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      })

      const result = await auth.signIn('wrong@example.com', 'wrongpass')

      expect(result.error).toEqual(mockError)
      expect(result.data.user).toBeNull()
    })

    it('should handle unconfirmed email', async () => {
      const mockError = { message: 'Email not confirmed' }
      
      vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      })

      const result = await auth.signIn('unconfirmed@example.com', 'password123')

      expect(result.error).toEqual(mockError)
    })

    it('should handle rate limiting', async () => {
      const mockError = { message: 'Too many requests' }
      
      vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      })

      const result = await auth.signIn('test@example.com', 'password123')

      expect(result.error).toEqual(mockError)
    })
  })

  describe('signInWithOAuth', () => {
    it('should initiate Google OAuth flow', async () => {
      const mockData = { url: 'https://accounts.google.com/oauth', provider: 'google' }
      
      vi.spyOn(supabase.auth, 'signInWithOAuth').mockResolvedValue({
        data: mockData,
        error: null
      })

      const result = await auth.signInWithOAuth('google')

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback')
        }
      })
      expect(result.error).toBeNull()
    })

    it('should initiate Facebook OAuth flow', async () => {
      const mockData = { url: 'https://facebook.com/oauth', provider: 'facebook' }
      
      vi.spyOn(supabase.auth, 'signInWithOAuth').mockResolvedValue({
        data: mockData,
        error: null
      })

      const result = await auth.signInWithOAuth('facebook')

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'facebook',
        options: {
          redirectTo: expect.stringContaining('/auth/callback')
        }
      })
    })

    it('should handle OAuth errors', async () => {
      const mockError = { message: 'OAuth provider error' }
      
      vi.spyOn(supabase.auth, 'signInWithOAuth').mockResolvedValue({
        data: { url: null, provider: 'google' },
        error: mockError
      })

      const result = await auth.signInWithOAuth('google')

      expect(result.error).toEqual(mockError)
    })
  })

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      vi.spyOn(supabase.auth, 'signOut').mockResolvedValue({
        error: null
      })

      const result = await auth.signOut()

      expect(supabase.auth.signOut).toHaveBeenCalled()
      expect(result.error).toBeNull()
    })

    it('should handle sign out errors', async () => {
      const mockError = { message: 'Sign out failed' }
      
      vi.spyOn(supabase.auth, 'signOut').mockResolvedValue({
        error: mockError
      })

      const result = await auth.signOut()

      expect(result.error).toEqual(mockError)
    })
  })

  describe('getSession', () => {
    it('should return validated user session', async () => {
      const mockUser = { id: '123', email: 'test@example.com' }
      
      vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const result = await auth.getSession()

      expect(supabase.auth.getUser).toHaveBeenCalled()
      expect(result.data.user?.email).toBe('test@example.com')
      expect(result.data.session?.user).toEqual(mockUser)
      expect(result.error).toBeNull()
    })

    it('should return null session when user validation fails', async () => {
      const mockError = { message: 'Invalid JWT' }
      
      vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const result = await auth.getSession()

      expect(result.data.session).toBeNull()
      expect(result.data.user).toBeNull()
      expect(result.error).toEqual(mockError)
    })

    it('should return null session when no user exists', async () => {
      vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({
        data: { user: null },
        error: null
      })

      const result = await auth.getSession()

      expect(result.data.session).toBeNull()
      expect(result.data.user).toBeNull()
    })
  })

  describe('getUser', () => {
    it('should return validated user', async () => {
      const mockUser = { id: '123', email: 'test@example.com' }
      
      vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const result = await auth.getUser()

      expect(supabase.auth.getUser).toHaveBeenCalled()
      expect(result.data.user?.email).toBe('test@example.com')
      expect(result.error).toBeNull()
    })

    it('should handle JWT validation errors', async () => {
      const mockError = { message: 'Invalid JWT' }
      
      vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const result = await auth.getUser()

      expect(result.error).toEqual(mockError)
      expect(result.data.user).toBeNull()
    })
  })

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      vi.spyOn(supabase.auth, 'resetPasswordForEmail').mockResolvedValue({
        data: {},
        error: null
      })

      const result = await auth.resetPassword('test@example.com')

      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: expect.stringContaining('/reset-password')
        }
      )
      expect(result.error).toBeNull()
    })

    it('should handle email not found errors', async () => {
      const mockError = { message: 'Email not found' }
      
      vi.spyOn(supabase.auth, 'resetPasswordForEmail').mockResolvedValue({
        data: {},
        error: mockError
      })

      const result = await auth.resetPassword('nonexistent@example.com')

      expect(result.error).toEqual(mockError)
    })

    it('should handle rate limiting on password reset', async () => {
      const mockError = { message: 'Too many requests' }
      
      vi.spyOn(supabase.auth, 'resetPasswordForEmail').mockResolvedValue({
        data: {},
        error: mockError
      })

      const result = await auth.resetPassword('test@example.com')

      expect(result.error).toEqual(mockError)
    })
  })

  describe('updatePassword', () => {
    it('should successfully update password', async () => {
      const mockUser = { id: '123', email: 'test@example.com' }
      
      vi.spyOn(supabase.auth, 'updateUser').mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const result = await auth.updatePassword('newpassword123')

      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'newpassword123'
      })
      expect(result.error).toBeNull()
    })

    it('should handle weak password errors on update', async () => {
      const mockError = { message: 'Password should be at least 6 characters' }
      
      vi.spyOn(supabase.auth, 'updateUser').mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const result = await auth.updatePassword('123')

      expect(result.error).toEqual(mockError)
    })

    it('should handle unauthorized password update', async () => {
      const mockError = { message: 'User not authenticated' }
      
      vi.spyOn(supabase.auth, 'updateUser').mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const result = await auth.updatePassword('newpassword123')

      expect(result.error).toEqual(mockError)
    })
  })
})
