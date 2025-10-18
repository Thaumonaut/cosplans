import { expect, test } from "@playwright/test";

test.describe("Service connection configuration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings/service-connections");
  });

  test("allows operations lead to configure and activate a verified connection", async ({ page }) => {
    await page.getByLabel(/Environment/i).selectOption("staging");
    await page.getByLabel(/Connection name/i).fill("Staging Supabase");
    await page.getByLabel(/Supabase URL/i).fill("https://staging.supabase.co");
    await page.getByLabel(/Project reference/i).fill("staging-ref");
    await page.getByLabel(/Service role key/i).fill("valid-service-role-key");
    await page.getByLabel(/Anon key/i).fill("anon-key-staging");

    await page.getByRole("button", { name: /Test Connection/i }).click();
    await expect(page.getByRole("status")).toContainText("Connection verified");

    await expect(page.getByRole("button", { name: /Activate Connection/i })).toBeEnabled();
    await page.getByRole("button", { name: /Activate Connection/i }).click();
    await expect(page.getByRole("status")).toContainText("Connection activated");
  });

  test("surfaces remediation guidance when verification fails", async ({ page }) => {
    await page.getByLabel(/Environment/i).selectOption("production");
    await page.getByLabel(/Connection name/i).fill("Production Supabase");
    await page.getByLabel(/Supabase URL/i).fill("https://prod.supabase.co");
    await page.getByLabel(/Project reference/i).fill("prod-ref");
    await page.getByLabel(/Service role key/i).fill("invalid-key");
    await page.getByLabel(/Anon key/i).fill("anon-key-prod");

    await page.getByRole("button", { name: /Test Connection/i }).click();
    await expect(page.getByRole("alert")).toContainText("Invalid service credentials");
    await expect(page.getByRole("alert")).toContainText("Rotate the service role key");
    await expect(page.getByRole("button", { name: /Activate Connection/i })).toBeDisabled();
  });
});
