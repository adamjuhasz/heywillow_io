import { test } from "@playwright/test";

test("test", async ({ page }) => {
  // Go to http://localhost:3000/
  await page.goto("http://localhost:3000/");

  await page.screenshot({
    path: "test-results/landing-page.png",
    fullPage: true,
  });

  // Click text=Login
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/login' }*/),
    page.locator("text=Login").click(),
  ]);

  await page.screenshot({
    path: "test-results/login.png",
    fullPage: true,
  });

  // Click input[name="email"]
  await page.locator('input[name="email"]').click();

  // Fill input[name="email"]
  await page.locator('input[name="email"]').fill("adam@paytgthr.com");

  // Click input[name="password"]
  await page.locator('input[name="password"]').click();

  // Fill input[name="password"]
  await page.locator('input[name="password"]').fill("password");

  // Click text=Log in
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/a/paytgthr/workspace' }*/),
    page.locator("text=Log in").click(),
  ]);

  await page.screenshot({
    path: "test-results/workspace.png",
    fullPage: true,
  });
});
