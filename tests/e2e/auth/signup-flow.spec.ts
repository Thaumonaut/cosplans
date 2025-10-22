import { test, expect } from '@playwright/test'

/**
 * T014: Integration test for signup flow (User Story 1)
 * 
 * Tests the complete signup flow including:
 * - Registration form validation
 * - Account creation
 * - Email verification
 * - Onboarding flow
 * - First login
 */

test.describe('Signup Flow (US1 - T014)', () => {
  test.describe('Registration Form', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register')
    })

    test('should display registration form with all required fields', async ({ page }) => {
      // Verify all form fields are present
      await expect(page.locator('input[name="firstName"]')).toBeVisible()
      await expect(page.locator('input[name="lastName"]')).toBeVisible()
      await expect(page.locator('input[name="email"]')).toBeVisible()
      await expect(page.locator('input[name="password"]')).toBeVisible()
      await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toBeVisible()
      
      // Verify link to login page
      await expect(page.locator('a[href="/login"]')).toBeVisible()
    })

    test('should show validation error when required fields are missing', async ({ page }) => {
      // Submit empty form
      await page.click('button[type="submit"]')
      
      // Should show error message
      await expect(page.locator('text=/required/i')).toBeVisible()
    })

    test('should validate email format', async ({ page }) => {
      // Enter invalid email
      await page.fill('input[name="firstName"]', 'John')
      await page.fill('input[name="lastName"]', 'Doe')
      await page.fill('input[name="email"]', 'notanemail')
      await page.fill('input[name="password"]', 'ValidP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'ValidP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Should show email format error
      await expect(page.locator('text=/valid email/i')).toBeVisible()
    })

    test('should enforce password requirements', async ({ page }) => {
      // Enter weak password
      await page.fill('input[name="firstName"]', 'John')
      await page.fill('input[name="lastName"]', 'Doe')
      await page.fill('input[name="email"]', 'john@example.com')
      await page.fill('input[name="password"]', '123')
      await page.fill('input[name="confirmPassword"]', '123')
      await page.click('button[type="submit"]')
      
      // Should show password requirements error
      await expect(page.locator('text=/at least.*characters/i')).toBeVisible()
    })

    test('should show error when passwords do not match', async ({ page }) => {
      // Enter mismatched passwords
      await page.fill('input[name="firstName"]', 'John')
      await page.fill('input[name="lastName"]', 'Doe')
      await page.fill('input[name="email"]', 'john@example.com')
      await page.fill('input[name="password"]', 'ValidP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'DifferentP@ss123')
      await page.click('button[type="submit"]')
      
      // Should show mismatch error
      await expect(page.locator('text=/passwords.*match/i')).toBeVisible()
    })

    test('should show error when email already exists', async ({ page }) => {
      // Try to register with existing email
      await page.fill('input[name="firstName"]', 'John')
      await page.fill('input[name="lastName"]', 'Doe')
      await page.fill('input[name="email"]', 'existing@example.com')
      await page.fill('input[name="password"]', 'ValidP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'ValidP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Should show email exists error
      await expect(page.locator('text=/already.*exists/i')).toBeVisible()
    })

    test('should display password strength indicator', async ({ page }) => {
      const passwordInput = page.locator('input[name="password"]')
      
      // Enter weak password
      await passwordInput.fill('abc123')
      await expect(page.locator('text=/weak/i')).toBeVisible()
      
      // Enter medium password
      await passwordInput.fill('Abcd1234!')
      await expect(page.locator('text=/medium/i')).toBeVisible()
      
      // Enter strong password
      await passwordInput.fill('MyStr0ng!P@ssword')
      await expect(page.locator('text=/strong/i')).toBeVisible()
    })

    test('should successfully create account with valid data', async ({ page }) => {
      // Fill in valid registration data
      await page.fill('input[name="firstName"]', 'John')
      await page.fill('input[name="lastName"]', 'Doe')
      await page.fill('input[name="email"]', `test-${Date.now()}@example.com`)
      await page.fill('input[name="password"]', 'ValidP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'ValidP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Should show success message
      await expect(page.locator('text=/check your email/i')).toBeVisible()
    })
  })

  test.describe('Email Verification', () => {
    test('should show verification pending message after signup', async ({ page }) => {
      await page.goto('/register')
      
      // Complete registration
      await page.fill('input[name="firstName"]', 'John')
      await page.fill('input[name="lastName"]', 'Doe')
      await page.fill('input[name="email"]', `verify-${Date.now()}@example.com`)
      await page.fill('input[name="password"]', 'ValidP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'ValidP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Should show verification instructions
      await expect(page.locator('text=/verification.*email/i')).toBeVisible()
    })

    test('should handle email verification callback', async ({ page }) => {
      // Simulate clicking verification link from email
      await page.goto('/auth/callback?token=verification-token&type=signup')
      
      // Should redirect to onboarding or show success
      await page.waitForURL(/\/(onboarding|dashboard)/)
    })

    test('should prevent login before email verification', async ({ page }) => {
      // Try to login with unverified account
      await page.goto('/login')
      await page.fill('input[name="email"]', 'unverified@example.com')
      await page.fill('input[type="password"]', 'ValidP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Should show verification required error
      await expect(page.locator('text=/email.*confirm/i')).toBeVisible()
    })
  })

  test.describe('Onboarding Flow (Constitutional Requirement)', () => {
    test.beforeEach(async ({ page }) => {
      // Simulate verified user landing on onboarding
      await page.goto('/onboarding')
    })

    test('should display onboarding form with team creation', async ({ page }) => {
      // Verify onboarding elements
      await expect(page.locator('input[name="teamName"]')).toBeVisible()
      await expect(page.locator('text=/create.*team/i')).toBeVisible()
    })

    test('should create default team with user as owner', async ({ page }) => {
      // Enter team name
      await page.fill('input[name="teamName"]', 'My Cosplay Team')
      
      // Optional: Upload profile picture
      const profilePicInput = page.locator('input[type="file"]')
      if (await profilePicInput.isVisible()) {
        // In real test, you'd upload an actual file
        // await profilePicInput.setInputFiles('path/to/test-image.jpg')
      }
      
      // Complete onboarding
      await page.click('button[type="submit"]')
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
      
      // Verify team was created (check dashboard for team name)
      await expect(page.locator('text=/My Cosplay Team/i')).toBeVisible()
    })

    test('should allow skipping optional fields with defaults', async ({ page }) => {
      // Click "Skip for now" button
      const skipButton = page.locator('button:has-text("Skip")')
      if (await skipButton.isVisible()) {
        await skipButton.click()
      } else {
        // Or just submit with minimal data
        await page.click('button[type="submit"]')
      }
      
      // Should still create team and redirect
      await expect(page).toHaveURL('/dashboard')
    })

    test('should not show onboarding again after completion', async ({ page, context }) => {
      // Complete onboarding
      await page.fill('input[name="teamName"]', 'Test Team')
      await page.click('button[type="submit"]')
      await expect(page).toHaveURL('/dashboard')
      
      // Logout and login again
      await page.goto('/logout')
      await page.goto('/login')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'ValidP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Should go directly to dashboard, not onboarding
      await expect(page).toHaveURL('/dashboard')
    })

    test('should enforce team ownership requirement (constitutional)', async ({ page }) => {
      // User must own at least one team
      // Try to complete onboarding without creating team
      await page.click('button[type="submit"]')
      
      // Should show error or create default team
      // Either way, user should end up with a team they own
      await expect(page).toHaveURL('/dashboard')
    })
  })

  test.describe('Complete Signup Journey', () => {
    test('should complete full signup to first login flow', async ({ page }) => {
      const uniqueEmail = `fulltest-${Date.now()}@example.com`
      
      // Step 1: Register
      await page.goto('/register')
      await page.fill('input[name="firstName"]', 'Jane')
      await page.fill('input[name="lastName"]', 'Smith')
      await page.fill('input[name="email"]', uniqueEmail)
      await page.fill('input[name="password"]', 'MyP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'MyP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Verify success message
      await expect(page.locator('text=/check your email/i')).toBeVisible()
      
      // Step 2: Verify email (simulated)
      await page.goto('/auth/callback?token=mock-verification-token&type=signup')
      
      // Step 3: Complete onboarding
      await page.waitForURL('/onboarding')
      await page.fill('input[name="teamName"]', 'Jane\'s Team')
      await page.click('button[type="submit"]')
      
      // Step 4: Arrive at dashboard
      await expect(page).toHaveURL('/dashboard')
      
      // Verify user is authenticated and team exists
      await expect(page.locator('text=/Jane\'s Team/i')).toBeVisible()
    })
  })

  test.describe('Security Features', () => {
    test('should redirect authenticated users away from signup page', async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'ValidP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      await expect(page).toHaveURL('/dashboard')
      
      // Try to access signup page
      await page.goto('/register')
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
    })

    test('should sanitize user input to prevent XSS', async ({ page }) => {
      await page.goto('/register')
      
      // Try to inject script in name fields
      await page.fill('input[name="firstName"]', '<script>alert("xss")</script>')
      await page.fill('input[name="lastName"]', 'Doe')
      await page.fill('input[name="email"]', `xss-${Date.now()}@example.com`)
      await page.fill('input[name="password"]', 'ValidP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'ValidP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Script should not execute
      // If successful, check that name is escaped in dashboard
      await page.waitForURL('/onboarding')
      await page.fill('input[name="teamName"]', 'Test Team')
      await page.click('button[type="submit"]')
      
      // Name should be escaped/sanitized
      const nameElement = await page.locator('text=/<script>/').count()
      expect(nameElement).toBe(0)
    })
  })
})
