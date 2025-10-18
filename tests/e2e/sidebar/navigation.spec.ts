import { expect, test } from "@playwright/test";

test.describe("Sidebar Navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (authenticated route with sidebar)
    await page.goto("/dashboard");
  });

  test("renders sidebar with navigation items", async ({ page }) => {
    // Check sidebar is visible
    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible();

    // Check brand is visible
    await expect(page.getByText("Cosplans")).toBeVisible();

    // Check some key navigation items are present
    await expect(page.getByRole("link", { name: /Dashboard/i })).toBeVisible();
  });

  test("navigates between pages and updates active state", async ({ page }) => {
    // Start on dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Dashboard link should be active (aria-current="page")
    const dashboardLink = page.getByRole("link", { name: /^Dashboard$/i });
    await expect(dashboardLink).toHaveAttribute("aria-current", "page");

    // Navigate to calendar if it exists
    const calendarLink = page.getByRole("link", { name: /Calendar/i }).first();
    if (await calendarLink.isVisible()) {
      await calendarLink.click();

      // Wait for navigation
      await expect(page).toHaveURL(/\/calendar/);

      // Calendar link should now be active
      await expect(calendarLink).toHaveAttribute("aria-current", "page");

      // Dashboard link should no longer be active
      await expect(dashboardLink).not.toHaveAttribute("aria-current", "page");
    }
  });

  test("sidebar persists across navigation", async ({ page }) => {
    const sidebar = page.locator("aside");

    // Sidebar visible on dashboard
    await expect(sidebar).toBeVisible();

    // Navigate to another page
    const galleryLink = page.getByRole("link", { name: /Gallery/i }).first();
    if (await galleryLink.isVisible()) {
      await galleryLink.click();
      await page.waitForURL(/\/gallery/);

      // Sidebar still visible
      await expect(sidebar).toBeVisible();
    }
  });

  test("mobile hamburger toggles sidebar", async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Find mobile toggle button
    const mobileToggle = page.getByRole("button", { name: /menu/i }).first();

    // On mobile, sidebar should start closed (check by transform class)
    const sidebarContainer = page.locator("[data-state]");
    await expect(sidebarContainer).toHaveAttribute("data-state", "closed");

    // Click toggle to open
    await mobileToggle.click();
    await expect(sidebarContainer).toHaveAttribute("data-state", "open");

    // Click backdrop to close
    const backdrop = page.locator(".fixed.inset-0.bg-black\\/50");
    if (await backdrop.isVisible()) {
      await backdrop.click();
      await expect(sidebarContainer).toHaveAttribute("data-state", "closed");
    }
  });

  test("keyboard navigation with Escape key closes mobile sidebar", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open mobile sidebar
    const mobileToggle = page.getByRole("button", { name: /menu/i }).first();
    await mobileToggle.click();

    const sidebarContainer = page.locator("[data-state]");
    await expect(sidebarContainer).toHaveAttribute("data-state", "open");

    // Press Escape
    await page.keyboard.press("Escape");

    // Sidebar should close
    await expect(sidebarContainer).toHaveAttribute("data-state", "closed");
  });

  test("sidebar collapse/expand on desktop", async ({ page }) => {
    // Ensure desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    // Find collapse button (hidden on mobile, visible on desktop)
    const collapseButton = page.getByRole("button", { name: /collapse sidebar|expand sidebar/i });

    if (await collapseButton.isVisible()) {
      const sidebar = page.locator("aside");

      // Check initial width class
      const initialClass = await sidebar.getAttribute("class");

      // Click to toggle
      await collapseButton.click();

      // Wait for transition
      await page.waitForTimeout(300);

      // Class should change (w-72 <-> w-20)
      const newClass = await sidebar.getAttribute("class");
      expect(newClass).not.toBe(initialClass);
    }
  });
});
