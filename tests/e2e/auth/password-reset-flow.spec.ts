import { test, expect } from '@playwright/test'

/**
 * T034: Integration test for password reset flow (User Story 3)
 * 
 * Tests the complete password reset flow including:
 * - Requesting password reset
 * - Email validation
 * - Reset link functionality
 * - Setting new password
 * - Login with new password
 */

test.describe('Password Reset Flow (US3 - T034)', () => {
  test.describe('Forgot Password Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/forgot-password')
    })

    test('should display forgot password form', async ({ page }) => {
      // Verify form elements are present
      await expect(page.locator('input[name="email"]')).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toBeVisible()
      
      // Verify back to login link
      await expect(page.locator('a[href="/login"]')).toBeVisible()
    })

    test('should show validation error when email is missing', async ({ page }) => {
      // Submit without email
      await page.click('button[type="submit"]')
      
      // Should show error
      await expect(page.locator('text=/Email.*required/i')).toBeVisible()
    })

    test('should show validation error for invalid email format', async ({ page }) => {
      // Enter invalid email
      await page.fill('input[name="email"]', 'notanemail')
      await page.click('button[type="submit"]')
      
      // Should show format error
      await expect(page.locator('text=/valid email/i')).toBeVisible()
    })

    test('should show success message after submitting valid email', async ({ page }) => {
      // Enter valid email
      await page.fill('input[name="email"]', 'test@example.com')
      await page.click('button[type="submit"]')
      
      // Should show success message
      await expect(page.locator('text=/reset email sent/i')).toBeVisible()
    })

    test('should handle non-existent email gracefully (security)', async ({ page }) => {
      // Enter non-existent email
      await page.fill('input[name="email"]', 'nonexistent@example.com')
      await page.click('button[type="submit"]')
      
      // Should show generic success message (don't reveal if email exists)
      await expect(page.locator('text=/reset email sent/i')).toBeVisible()
    })

    test('should handle rate limiting for password reset requests', async ({ page }) => {
      // Submit multiple times rapidly
      for (let i = 0; i < 6; i++) {
        await page.fill('input[name="email"]', 'test@example.com')
        await page.click('button[type="submit"]')
        await page.waitForTimeout(500)
      }
      
      // Should show rate limiting error
      await expect(page.locator('text=/too many.*attempts/i')).toBeVisible()
    })
  })

  test.describe('Reset Password Page', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to reset password page with mock token
      // In real scenario, this would be from email link
      await page.goto('/reset-password?token=mock-reset-token')
    })

    test('should display reset password form', async ({ page }) => {
      // Verify form elements
      await expect(page.locator('input[name="password"]')).toBeVisible()
      await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toBeVisible()
    })

    test('should show validation error when password is missing', async ({ page }) => {
      // Submit without password
      await page.click('button[type="submit"]')
      
      // Should show error
      await expect(page.locator('text=/password.*required/i')).toBeVisible()
    })

    test('should show error when passwords do not match', async ({ page }) => {
      // Enter mismatched passwords
      await page.fill('input[name="password"]', 'NewP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'DifferentP@ss123')
      await page.click('button[type="submit"]')
      
      // Should show mismatch error
      await expect(page.locator('text=/passwords.*match/i')).toBeVisible()
    })

    test('should show error for weak password', async ({ page }) => {
      // Enter weak password
      await page.fill('input[name="password"]', '123')
      await page.fill('input[name="confirmPassword"]', '123')
      await page.click('button[type="submit"]')
      
      // Should show password strength error
      await expect(page.locator('text=/at least.*characters/i')).toBeVisible()
    })

    test('should successfully reset password with valid input', async ({ page }) => {
      // Enter valid new password
      await page.fill('input[name="password"]', 'NewP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'NewP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Should show success message and redirect
      await expect(page.locator('text=/password.*updated/i')).toBeVisible()
      
      // Should eventually redirect to login or dashboard
      await page.waitForURL(/\/(login|dashboard)/)
    })

    test('should show error for expired reset token', async ({ page }) => {
      // Navigate with expired token
      await page.goto('/reset-password?token=expired-token')
      
      // Try to reset password
      await page.fill('input[name="password"]', 'NewP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'NewP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Should show token expired error
      await expect(page.locator('text=/expired.*invalid/i')).toBeVisible()
    })

    test('should show error when accessing reset page without token', async ({ page }) => {
      // Navigate without token
      await page.goto('/reset-password')
      
      // Should show error or redirect
      await expect(page.locator('text=/invalid.*link/i')).toBeVisible()
    })
  })

  test.describe('Complete Password Reset Flow', () => {
    test('should complete full password reset journey', async ({ page }) => {
      // Step 1: Request password reset
      await page.goto('/forgot-password')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.click('button[type="submit"]')
      
      // Verify success message
      await expect(page.locator('text=/reset email sent/i')).toBeVisible()
      
      // Step 2: Simulate clicking reset link from email
      // In real scenario, you'd check email and extract link
      await page.goto('/reset-password?token=valid-reset-token')
      
      // Step 3: Set new password
      await page.fill('input[name="password"]', 'NewP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'NewP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Verify success
      await expect(page.locator('text=/password.*updated/i')).toBeVisible()
      
      // Step 4: Login with new password
      await page.goto('/login')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'NewP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Should successfully login
      await expect(page).toHaveURL('/dashboard')
    })

    test('should not allow using old password after reset', async ({ page }) => {
      // After password reset, try to login with old password
      await page.goto('/login')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'OldP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Should fail
      await expect(page.locator('text=/Invalid.*credentials/i')).toBeVisible()
    })
  })

  test.describe('Security Features', () => {
    test('should enforce 24-hour token expiration', async ({ page }) => {
      // Simulate old token (24+ hours old)
      await page.goto('/reset-password?token=old-token-24h')
      
      await page.fill('input[name="password"]', 'NewP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'NewP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Should show expiration error
      await expect(page.locator('text=/expired/i')).toBeVisible()
    })

    test('should invalidate token after single use', async ({ page }) => {
      // Use token once
      await page.goto('/reset-password?token=single-use-token')
      await page.fill('input[name="password"]', 'NewP@ssw0rd123')
      await page.fill('input[name="confirmPassword"]', 'NewP@ssw0rd123')
      await page.click('button[type="submit"]')
      
      // Try to use same token again
      await page.goto('/reset-password?token=single-use-token')
      await page.fill('input[name="password"]', 'AnotherP@ss123')
      await page.fill('input[name="confirmPassword"]', 'AnotherP@ss123')
      await page.click('button[type="submit"]')
      
      // Should show invalid token error
      await expect(page.locator('text=/invalid.*expired/i')).toBeVisible()
    })
  })
})
