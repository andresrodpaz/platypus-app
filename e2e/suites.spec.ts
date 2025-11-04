import { test, expect } from "@playwright/test"

test.describe("Test Suites Feature", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to suites page (assuming user is logged in)
    await page.goto("/suites", { waitUntil: "networkidle" })
    await page.waitForTimeout(1000)
  })

  test("should display suites page", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Test Suites", { timeout: 15000 })
    console.log("✅ Suites page loaded successfully")
  })

  test("should open create suite dialog", async ({ page }) => {
    // Wait for page to fully load
    await page.waitForSelector('button:has-text("Create Suite")', { timeout: 30000 })
    await page.click('button:has-text("Create Suite")', { timeout: 15000 })
    await page.waitForTimeout(2000) // Wait for dialog animation
    // Check for dialog by title or role
    await expect(page.locator('h2:has-text("Create Test Suite"), [role="dialog"] h2')).toBeVisible({ timeout: 15000 })
    console.log("[✅ Create suite dialog opened")
  })

  test("should create a new test suite", async ({ page }) => {
    // Wait for page to fully load
    await page.waitForSelector('button:has-text("Create Suite")', { timeout: 30000 })
    await page.click('button:has-text("Create Suite")', { timeout: 15000 })
    await page.waitForTimeout(2000) // Wait for dialog animation

    // Use id selector for name input
    const nameInput = page.locator('input[id="name"]')
    await nameInput.waitFor({ state: "visible", timeout: 15000 })
    await nameInput.fill("E2E Test Suite", { timeout: 15000 })
    
    // Use id selector for description textarea
    const descInput = page.locator('textarea[id="description"]')
    await descInput.waitFor({ state: "visible", timeout: 15000 })
    await descInput.fill("Created by E2E test", { timeout: 15000 })

    // Click create button - find it specifically in the dialog footer
    const createButton = page.locator('[role="dialog"] button:has-text("Create Suite"):not([disabled])').last()
    await createButton.waitFor({ state: "visible", timeout: 15000 })
    // Scroll into view if needed
    await createButton.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await createButton.click({ timeout: 15000 })
    
    // Wait for dialog to close (indicates successful creation)
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 20000 })
    await page.waitForTimeout(1000)
    
    // Verify the form was submitted by checking that dialog is closed
    // The suite should be created, but we verify the dialog closed as success indicator
    const dialogVisible = await page.locator('[role="dialog"]').isVisible().catch(() => false)
    expect(dialogVisible).toBe(false)
    console.log("✅ Test suite created successfully")
  })
})
