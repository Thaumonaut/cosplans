import { expect, test } from "@playwright/test";

test.describe("Service connection diagnostics", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings/service-connections");
  });

  test("allows QA specialist to run diagnostics and review results", async ({ page }) => {
    await page.getByLabel(/Environment/i).selectOption("staging");
    await page.getByLabel(/Connection name/i).fill("Diagnostics Staging");
    await page.getByLabel(/Supabase URL/i).fill("https://diagnostics.supabase.co");
    await page.getByLabel(/Project reference/i).fill("diag-staging");
    await page.getByLabel(/Service role key/i).fill("valid-diagnostics-key");
    await page.getByLabel(/Anon key/i).fill("diagnostics-anon-key");

    await page.getByRole("button", { name: /Test Connection/i }).click();
    await expect(page.getByRole("status")).toContainText(/Connection verified/i);

    await page.getByRole("button", { name: /Run diagnostics/i }).click();

    const alert = page.getByRole("alert");
    await expect(alert).toContainText(/Diagnostics/i);
    await expect(alert).toContainText(/timeout/i);

    const timeoutCell = page.getByRole("cell", { name: /Timeout/i });
    await expect(timeoutCell).toBeVisible();

    const failureBadge = page.getByRole("cell", { name: /fail/i }).first();
    await expect(failureBadge).toBeVisible();

    const passBadge = page.getByRole("cell", { name: /pass/i }).first();
    await expect(passBadge).toBeVisible();
  });
});
