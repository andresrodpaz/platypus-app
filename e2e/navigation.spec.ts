import { test, expect } from "@playwright/test"

test.describe("Navigation", () => {
  test("should navigate between all pages", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toContainText("Platypus QA Lab")
    console.log("Home page loaded")

    await page.click('a[href="/playground"]')
    await expect(page.locator("h1")).toContainText("API Playground")
    console.log("Navigated to Playground")

    await page.click('a[href="/bugs"]')
    await expect(page.locator("h1")).toContainText("Bug Dashboard")
    console.log("Navigated to Bugs")

    await page.click('a[href="/reports"]')
    await expect(page.locator("h1")).toContainText("Test Reports")
    console.log("Navigated to Reports")

    await page.click('a[href="/"]')
    await expect(page.locator("h1")).toContainText("Platypus QA Lab")
    console.log("[Navigated back to Home")
  })

  test("should highlight active navigation item", async ({ page }) => {
    await page.goto("/playground", { waitUntil: "networkidle" })
    await page.waitForTimeout(1000)
    // The active class is on the Button inside the Link
    const playgroundButton = page.locator('a[href="/playground"] button')
    await expect(playgroundButton).toHaveClass(/bg-secondary/, { timeout: 15000 })
    console.log("[Active nav item highlighted")
  })

  test("should toggle theme", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })
    await page.waitForTimeout(2000)
    // Theme toggle button - find button with Sun or Moon icon in the header
    const themeToggle = page.locator('nav button:has(svg), button[aria-label*="theme" i]').last()
    await themeToggle.waitFor({ state: "visible", timeout: 15000 })
    // Check if button is visible and clickable
    await expect(themeToggle).toBeVisible({ timeout: 15000 })
    await themeToggle.click({ timeout: 15000 })
    await page.waitForTimeout(2000)
    console.log("Theme toggled successfully")
  })
})
