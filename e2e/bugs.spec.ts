import { test, expect } from "@playwright/test"

test.describe("Bug Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/bugs", { waitUntil: "networkidle" })
    await page.waitForTimeout(1000)
    console.log("Navigated to bugs page")
  })

  test("should load bug dashboard", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Bug Dashboard")
    await expect(page.locator('button:has-text("Report Bug")')).toBeVisible()
    console.log("Bug dashboard loaded successfully")
  })

  test("should open bug report dialog", async ({ page }) => {
    await page.click('button:has-text("Report Bug")', { timeout: 15000 })
    await page.waitForTimeout(1000)
    await expect(page.locator("text=Report a Bug")).toBeVisible({ timeout: 15000 })
    await expect(page.locator('input[id="title"]')).toBeVisible({ timeout: 15000 })
    console.log("Bug report dialog opened")
  })

  test("should create new bug", async ({ page }) => {
    await page.click('button:has-text("Report Bug")', { timeout: 15000 })
    await page.waitForTimeout(1000)

    await page.fill('input[id="title"]', "Test Bug from E2E", { timeout: 15000 })
    await page.fill('textarea[id="description"]', "This is a test bug created by Playwright", { timeout: 15000 })
    await page.fill('input[id="endpoint"]', "https://api.test.com/endpoint", { timeout: 15000 })

    await page.click('button[type="submit"]:has-text("Submit Bug Report")', { timeout: 15000 })
    await page.waitForTimeout(2000)

    await expect(page.locator("text=Bug reported successfully")).toBeVisible({ timeout: 15000 })
    console.log("Bug created successfully")
  })

  test("should filter bugs by severity", async ({ page }) => {
    await page.click('button:has-text("Report Bug")', { timeout: 15000 })
    await page.waitForTimeout(1000)
    
    await page.fill('input[id="title"]', "Critical Bug", { timeout: 15000 })
    await page.fill('textarea[id="description"]', "Critical test", { timeout: 15000 })
    await page.fill('input[id="endpoint"]', "https://api.test.com", { timeout: 15000 })
    
    // Select severity using SelectTrigger (it's a Select component, not a select element)
    // Find the severity select by its id or by finding the label and then the button
    const severitySelect = page.locator('button[id="severity"]')
    await severitySelect.waitFor({ state: "visible", timeout: 15000 })
    await severitySelect.click({ timeout: 15000 })
    await page.waitForTimeout(1000)
    await page.click('div[role="option"]:has-text("Critical")', { timeout: 15000 })
    
    await page.click('button[type="submit"]:has-text("Submit Bug Report")', { timeout: 15000 })
    await page.waitForTimeout(3000)

    // Now filter by severity in the main page - wait for filters to be visible
    await page.waitForSelector('button[role="combobox"]', { timeout: 30000 })
    const severityFilter = page.locator('button[role="combobox"]').first()
    await severityFilter.waitFor({ state: "visible", timeout: 15000 })
    await severityFilter.click({ timeout: 15000 })
    await page.waitForTimeout(1000)
    await page.click('div[role="option"]:has-text("Critical")', { timeout: 15000 })
    await page.waitForTimeout(2000)

    console.log("Severity filter applied")
  })

  test("should display bug statistics", async ({ page }) => {
    // Wait for page to fully load and bugs to be fetched
    await page.waitForTimeout(2000)
    // Check for statistics cards - they use CardDescription for labels
    await expect(page.locator("text=Total Bugs").first()).toBeVisible({ timeout: 20000 })
    await expect(page.locator("text=Open").first()).toBeVisible({ timeout: 20000 })
    await expect(page.locator("text=In Progress").first()).toBeVisible({ timeout: 20000 })
    await expect(page.locator("text=Resolved").first()).toBeVisible({ timeout: 20000 })
    console.log("Bug statistics displayed")
  })
})
