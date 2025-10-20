import { describe, it, expect } from 'vitest'

/**
 * Password validation utilities
 * Per spec requirements:
 * - Minimum 8 characters (constitutional requirement from quickstart.md)
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 * - Must contain at least one special character
 */

export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  
  // Check minimum length (8 characters per constitutional requirement)
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  // Check for number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (errors.length === 0) {
    if (password.length >= 12) {
      strength = 'strong'
    } else if (password.length >= 10) {
      strength = 'medium'
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  }
}

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  return { isValid: true }
}

describe('Password Validation (T015)', () => {
  describe('validatePassword', () => {
    it('should accept strong passwords with all requirements', () => {
      const result = validatePassword('MyP@ssw0rd123')
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.strength).toBe('strong')
    })

    it('should reject passwords shorter than 8 characters', () => {
      const result = validatePassword('Abc1!')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters long')
    })

    it('should reject passwords without uppercase letters', () => {
      const result = validatePassword('myp@ssw0rd')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one uppercase letter')
    })

    it('should reject passwords without lowercase letters', () => {
      const result = validatePassword('MYP@SSW0RD')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one lowercase letter')
    })

    it('should reject passwords without numbers', () => {
      const result = validatePassword('MyP@ssword')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one number')
    })

    it('should reject passwords without special characters', () => {
      const result = validatePassword('MyPassword123')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one special character')
    })

    it('should return multiple errors for passwords with multiple issues', () => {
      const result = validatePassword('abc')
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
      expect(result.errors).toContain('Password must be at least 8 characters long')
      expect(result.errors).toContain('Password must contain at least one uppercase letter')
    })

    it('should classify 8-9 character valid passwords as weak', () => {
      const result = validatePassword('MyP@ss1!')
      
      expect(result.isValid).toBe(true)
      expect(result.strength).toBe('weak')
    })

    it('should classify 10-11 character valid passwords as medium', () => {
      const result = validatePassword('MyP@ssw0rd')
      
      expect(result.isValid).toBe(true)
      expect(result.strength).toBe('medium')
    })

    it('should classify 12+ character valid passwords as strong', () => {
      const result = validatePassword('MyP@ssw0rd123')
      
      expect(result.isValid).toBe(true)
      expect(result.strength).toBe('strong')
    })

    it('should accept various special characters', () => {
      const specialChars = '!@#$%^&*()_+-=[]{};\':"|,.<>/?'
      
      for (const char of specialChars) {
        const result = validatePassword(`MyPass1${char}`)
        expect(result.isValid).toBe(true)
      }
    })

    it('should handle empty password', () => {
      const result = validatePassword('')
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example-domain.com'
      ]
      
      for (const email of validEmails) {
        const result = validateEmail(email)
        expect(result.isValid).toBe(true)
        expect(result.error).toBeUndefined()
      }
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
        ''
      ]
      
      for (const email of invalidEmails) {
        const result = validateEmail(email)
        expect(result.isValid).toBe(false)
        expect(result.error).toBeDefined()
      }
    })

    it('should return error message for empty email', () => {
      const result = validateEmail('')
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Email is required')
    })

    it('should return error message for invalid format', () => {
      const result = validateEmail('notanemail')
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please enter a valid email address')
    })
  })
})
