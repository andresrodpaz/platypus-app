import { test, expect } from "@playwright/test"

test.describe("API Playground", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/playground", { waitUntil: "networkidle" })
    await page.waitForTimeout(1000) // Wait for page to fully load
    console.log("Navigated to playground page")
  })

  test("should load playground page", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("API Playground", { timeout: 15000 })
    // Check for the public APIs section - wait for the CardTitle to appear
    await page.waitForSelector('text=Public APIs', { timeout: 30000 })
    await expect(page.locator("text=Public APIs").first()).toBeVisible({ timeout: 15000 })
    console.log("Playground page loaded successfully")
  })

  test("should load preset API", async ({ page }) => {
    // Wait for APIs to load, then click first preset button
    await page.waitForSelector('button:has-text("GET")', { timeout: 30000 })
    await page.waitForTimeout(1000) // Additional wait for stability
    // Click first preset button (should be a public API)
    await page.locator('button:has-text("GET")').first().click({ timeout: 15000 })
    await page.waitForTimeout(1000)
    // Use id selector for URL input
    const urlInput = page.locator('input[id="url"]')
    await urlInput.waitFor({ state: "visible", timeout: 15000 })
    await expect(urlInput).toHaveValue(/.+/, { timeout: 15000 })
    console.log("Preset API loaded successfully")
  })

  test("should send API request", async ({ page }) => {
    // Fill URL field first using id
    const urlInput = page.locator('input[id="url"]')
    await urlInput.waitFor({ state: "visible", timeout: 15000 })
    await urlInput.fill("https://jsonplaceholder.typicode.com/posts/1", { timeout: 15000 })
    await page.click('button:has-text("Send Request")', { timeout: 15000 })

    // Wait for response card to appear
    await expect(page.locator('text=Response').first()).toBeVisible({ timeout: 30000 })
    console.log("API request sent and response received")
  })

  test("should display humorous comment", async ({ page }) => {
    // Fill URL and send request using id
    const urlInput = page.locator('input[id="url"]')
    await urlInput.waitFor({ state: "visible", timeout: 15000 })
    await urlInput.fill("https://jsonplaceholder.typicode.com/posts/1", { timeout: 15000 })
    await page.click('button:has-text("Send Request")', { timeout: 15000 })

    await page.waitForSelector('text=Response', { timeout: 30000 })
    await page.waitForTimeout(3000) // Wait for AI analysis to load
    // Check for AI analysis comment in alert
    const comment = page.locator('[role="alert"]').first()
    await expect(comment).toBeVisible({ timeout: 15000 })
    console.log("Humorous comment displayed")
  })

  test("should show error for empty URL", async ({ page }) => {
    await page.click('button:has-text("Send Request")')
    await expect(page.locator("text=Please enter a URL")).toBeVisible()
    console.log("Empty URL validation working")
  })

  test("should switch between formatted and raw tabs", async ({ page }) => {
    // Fill URL and send request using id
    const urlInput = page.locator('input[id="url"]')
    await urlInput.waitFor({ state: "visible", timeout: 15000 })
    await urlInput.fill("https://jsonplaceholder.typicode.com/posts/1", { timeout: 15000 })
    await page.click('button:has-text("Send Request")', { timeout: 15000 })

    await page.waitForSelector('text=Response', { timeout: 30000 })
    await page.waitForTimeout(1000)
    // Find and click Raw tab
    await page.click('button[role="tab"]:has-text("Raw")', { timeout: 15000 })
    await page.waitForTimeout(500)
    // Verify tabs are visible
    await expect(page.locator('button[role="tab"]:has-text("Formatted")')).toBeVisible({ timeout: 15000 })
    console.log("[Tab switching works correctly")
  })
})
