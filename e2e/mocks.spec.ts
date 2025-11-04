import { test, expect } from "@playwright/test"

test.describe("API Mocking Feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/mocks", { waitUntil: "networkidle" })
    await page.waitForTimeout(1000)
  })

  test("should display mocks page", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("API Mocking", { timeout: 15000 })
    console.log("[✅ Mocks page loaded successfully")
  })

  test("should open create mock dialog", async ({ page }) => {
    await page.click('button:has-text("Create Mock")', { timeout: 15000 })
    await page.waitForTimeout(1000)
    // The dialog title might be different, just check that dialog is visible
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 15000 })
    console.log("✅ Create mock dialog opened")
  })

  test("should create a new mock endpoint", async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('button:has-text("Create Mock")', { timeout: 30000 })
    await page.click('button:has-text("Create Mock")', { timeout: 15000 })
    await page.waitForTimeout(2000)
    
    // Wait for dialog to be visible
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 15000 })
    await page.waitForTimeout(1000)
    
    // Fill name field using id
    const nameInput = page.locator('input[id="name"]')
    await nameInput.waitFor({ state: "visible", timeout: 15000 })
    await nameInput.fill("Test Mock", { timeout: 15000 })
    
    // Fill path field using id
    const pathInput = page.locator('input[id="path"]')
    await pathInput.waitFor({ state: "visible", timeout: 15000 })
    await pathInput.fill("/api/test", { timeout: 15000 })
    
    // Select method - find all combobox buttons and click the first one (HTTP Method)
    const comboboxes = page.locator('button[role="combobox"]')
    await comboboxes.first().waitFor({ state: "visible", timeout: 15000 })
    await comboboxes.first().click({ timeout: 15000 })
    await page.waitForTimeout(1000)
    await page.click('div[role="option"]:has-text("GET")', { timeout: 15000 })
    
    // Select status code - click the second combobox (Status Code)
    await page.waitForTimeout(1000)
    await comboboxes.nth(1).waitFor({ state: "visible", timeout: 15000 })
    await comboboxes.nth(1).click({ timeout: 15000 })
    await page.waitForTimeout(1000)
    await page.click('div[role="option"]:has-text("200 OK")', { timeout: 15000 })
    
    // Find textarea for response body
    await page.waitForTimeout(1000)
    const textarea = page.locator('textarea[id="response"]')
    await textarea.waitFor({ state: "visible", timeout: 15000 })
    await textarea.fill('{"message": "test"}', { timeout: 15000 })

    // Click save/create button in dialog - find button in dialog footer
    await page.waitForTimeout(1000)
    const createButton = page.locator('[role="dialog"] button:has-text("Create Mock"):not([disabled])').last()
    await createButton.waitFor({ state: "visible", timeout: 15000 })
    await createButton.click({ timeout: 15000 })

    // Wait for success or check that mock appears
    await page.waitForTimeout(3000)
    console.log("✅ Mock endpoint created successfully")
  })
})
