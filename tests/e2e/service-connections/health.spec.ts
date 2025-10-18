import { expect, test } from "@playwright/test";

test.describe("Service connection health monitoring", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings/service-connections");
  });

  test("surfaces heartbeat status and allows incident acknowledgement", async ({ page }) => {
    await page.getByLabel(/Environment/i).selectOption("staging");
    await page.getByLabel(/Connection name/i).fill("Health Monitor Staging");
    await page.getByLabel(/Supabase URL/i).fill("https://health-monitor.supabase.co");
    await page.getByLabel(/Project reference/i).fill("health-monitor");
    await page.getByLabel(/Service role key/i).fill("health-service-role");
    await page.getByLabel(/Anon key/i).fill("health-anon-key");

    await page.getByRole("button", { name: /Test Connection/i }).click();
    await expect(page.getByRole("status")).toContainText(/Connection verified/i);

    await page.goto("/settings/service-connections?seedHealth=1");

    const heading = page.getByRole("heading", { name: /Service health/i });
    await expect(heading).toBeVisible();

    const section = heading.locator("xpath=ancestor::section[1]");
    const healthRow = section.getByRole("row", { name: /Health Monitor Staging/i }).first();

    await page.waitForFunction(() =>
      Boolean(
        (window as typeof window & { __cosplansHealthHydrated?: boolean }).__cosplansHealthHydrated
      )
    );

    const acknowledgeButton = healthRow.getByRole("button", { name: /Acknowledge/i }).first();
    await expect(acknowledgeButton).toBeEnabled();
    const acknowledgementRequest = page.waitForRequest(
      (request) =>
        request.url().includes("/api/service-connections/incidents") && request.method() === "POST"
    );

    await Promise.all([acknowledgementRequest, acknowledgeButton.click()]);
    await expect(acknowledgeButton).toHaveText(/Acknowledged/i);
  });
});
