import { expect, test } from "@playwright/test";

test.describe("Friendly error messaging", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings/service-connections");
  });

  test("shows actionable guidance when verification fails", async ({ page }) => {
    await page.getByLabel(/Environment/i).selectOption("production");
    await page.getByLabel(/Connection name/i).fill("Production Supabase");
    await page.getByLabel(/Supabase URL/i).fill("https://prod.supabase.co");
    await page.getByLabel(/Project reference/i).fill("prod-ref");
    await page.getByLabel(/Service role key/i).fill("invalid-key");
    await page.getByLabel(/Anon key/i).fill("anon-key-prod");

    await page.getByRole("button", { name: /Test Connection/i }).click();

    const toast = page.getByTestId("error-toast");
    await expect(toast).toBeVisible();
    await expect(toast).toContainText("Invalid service credentials");
    await expect(toast).toContainText("Rotate the service role key");
    await expect(toast).toContainText(/Correlation ID/i);

    const retryButton = toast.getByRole("button", { name: /Retry/i });
    await expect(retryButton).toBeVisible();
    await retryButton.click();

    await expect(toast).toBeVisible();
  });
});
