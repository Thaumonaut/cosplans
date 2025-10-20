import { test, expect } from '@playwright/test'

/**
 * T024: Integration test for login flow (User Story 2)
 * 
 * Tests the complete login flow including:
 * - Successful login with valid credentials
 * - Failed login with invalid credentials
 * - Session persistence
 * - Redirect to dashboard after login
 * - Redirect to login for protected routes
 */

test.describe('Login Flow (US2 - T024)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login')
  })

  test('should display login form with all required fields', async ({ page }) => {
    // Verify login form elements are present
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Verify "Forgot Password" link is present
    await expect(page.locator('a[href="/forgot-password"]')).toBeVisible()
  })

  test('should show validation error when email is missing', async ({ page }) => {
    // Leave email empty and submit
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=/Email.*required/i')).toBeVisible()
  })

  test('should show validation error when password is missing', async ({ page }) => {
    // Leave password empty and submit
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=/password.*required/i')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=/Invalid.*credentials/i')).toBeVisible()
  })

  test('should successfully login with valid credentials and redirect to dashboard', async ({ page }) => {
    // Note: This test requires a test user to exist in the database
    // In a real scenario, you'd set up test data in beforeEach or use a test database
    
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'ValidP@ssw0rd123')
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('should persist session across page refreshes', async ({ page, context }) => {
    // Login first
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'ValidP@ssw0rd123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
    
    // Refresh the page
    await page.reload()
    
    // Should still be on dashboard (session persisted)
    await expect(page).toHaveURL('/dashboard')
  })

  test('should redirect unauthenticated users to login when accessing protected routes', async ({ page }) => {
    // Try to access dashboard without logging in
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect already authenticated users away from login page', async ({ page }) => {
    // Login first
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'ValidP@ssw0rd123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
    
    // Try to access login page again
    await page.goto('/login')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('should handle "Remember Me" functionality', async ({ page }) => {
    // Check "Remember Me" checkbox
    const rememberMeCheckbox = page.locator('input[name="rememberMe"]')
    if (await rememberMeCheckbox.isVisible()) {
      await rememberMeCheckbox.check()
    }
    
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'ValidP@ssw0rd123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
    
    // Session should persist (tested by checking cookies or session storage)
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find(c => c.name.includes('supabase'))
    expect(sessionCookie).toBeDefined()
  })

  test('should show error for unconfirmed email', async ({ page }) => {
    // Try to login with unconfirmed email
    await page.fill('input[name="email"]', 'unconfirmed@example.com')
    await page.fill('input[type="password"]', 'ValidP@ssw0rd123')
    await page.click('button[type="submit"]')
    
    // Should show email confirmation error
    await expect(page.locator('text=/email.*confirm/i')).toBeVisible()
  })

  test('should handle rate limiting after multiple failed attempts', async ({ page }) => {
    // Attempt login multiple times with wrong password
    for (let i = 0; i < 6; i++) {
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')
      
      // Wait a bit between attempts
      await page.waitForTimeout(500)
    }
    
    // Should show rate limiting error
    await expect(page.locator('text=/too many.*attempts/i')).toBeVisible()
  })
})
