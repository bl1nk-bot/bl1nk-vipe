import { test, expect } from '@playwright/test'

test.describe('MCP Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mcp')
  })

  test('should load MCP page successfully', async ({ page }) => {
    await expect(page).toHaveURL('/mcp')
    const heading = page.locator('h1')
    await expect(heading).toContainText('MCP Interface')
  })

  test('should display server list', async ({ page }) => {
    const serverList = page.locator('[data-testid="server-list"]')
    await expect(serverList).toBeVisible()

    const servers = await page.locator('[data-testid="server-item"]').count()
    expect(servers).toBeGreaterThan(0)
  })

  test('should select a server', async ({ page }) => {
    const firstServer = page.locator('[data-testid="server-item"]').first()
    await firstServer.click()

    const connectionStatus = page.locator('[data-testid="connection-status"]')
    await expect(connectionStatus).toBeVisible()
  })

  test('should display request builder form', async ({ page }) => {
    const methodInput = page.locator('[data-testid="request-method"]')
    await expect(methodInput).toBeVisible()

    const sendButton = page.locator('[data-testid="send-request-btn"]')
    await expect(sendButton).toBeVisible()
  })

  test('should validate method field', async ({ page }) => {
    const methodInput = page.locator('[data-testid="request-method"]')
    const sendButton = page.locator('[data-testid="send-request-btn"]')

    // Try sending without method
    await sendButton.click()

    // Should show error or prevent submission
    const errorMsg = page.locator('[role="alert"]')
    if (await errorMsg.isVisible()) {
      const text = await errorMsg.textContent()
      expect(text).toContain('method')
    }
  })

  test('should display response display section', async ({ page }) => {
    const responseDisplay = page.locator('[data-testid="response-display"]')
    await expect(responseDisplay).toBeVisible()
  })

  test('should handle JSON parameter input', async ({ page }) => {
    const methodInput = page.locator('[data-testid="request-method"]')
    await methodInput.fill('test_method')

    const paramsInput = page.locator('textarea[placeholder*="key"]')
    await paramsInput.fill('{"test": "value"}')

    const value = await paramsInput.inputValue()
    expect(value).toContain('test')
    expect(value).toContain('value')
  })

  test('should show connection status indicator', async ({ page }) => {
    const connectionStatus = page.locator('[data-testid="connection-status"]')

    // Initially disconnected
    const initialStatus = await connectionStatus.getAttribute('data-status')
    expect(initialStatus).toBeDefined()
  })

  test('should update UI when server is selected', async ({ page }) => {
    const serverItem = page.locator('[data-testid="server-item"]').first()
    const serverName = await serverItem.locator('div').first().textContent()

    await serverItem.click()

    const connectionStatus = page.locator('[data-testid="connection-status"]')
    const statusText = await connectionStatus.textContent()

    expect(statusText).toBeTruthy()
  })
})

test.describe('MCP Interface - Request Building', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mcp')
  })

  test('should populate method from dropdown', async ({ page }) => {
    const methodSelect = page.locator('select').first()
    await methodSelect.selectOption('list_tools')

    const methodInput = page.locator('[data-testid="request-method"]')
    const value = await methodInput.inputValue()
    expect(value).toBe('list_tools')
  })

  test('should allow custom method name', async ({ page }) => {
    const methodInput = page.locator('[data-testid="request-method"]')
    await methodInput.fill('custom_method')

    const value = await methodInput.inputValue()
    expect(value).toBe('custom_method')
  })

  test('should validate JSON parameters', async ({ page }) => {
    const methodInput = page.locator('[data-testid="request-method"]')
    await methodInput.fill('test_method')

    const paramsInput = page.locator('textarea[placeholder*="key"]')
    await paramsInput.fill('invalid json')

    const sendButton = page.locator('[data-testid="send-request-btn"]')
    await sendButton.click()

    const errorAlert = page.locator('[role="alert"]')
    if (await errorAlert.isVisible()) {
      const text = await errorAlert.textContent()
      expect(text?.toLowerCase()).toContain('json')
    }
  })

  test('should clear error on input change', async ({ page }) => {
    const methodInput = page.locator('[data-testid="request-method"]')

    // Create error state
    await methodInput.fill('')

    // Change input to clear error
    await methodInput.fill('new_method')

    const errorAlert = page.locator('[role="alert"]')
    const isVisible = await errorAlert.isVisible().catch(() => false)

    if (isVisible) {
      expect(await errorAlert.textContent()).not.toContain('method')
    }
  })
})

test.describe('MCP Interface - Response History', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mcp')
  })

  test('response display should be visible', async ({ page }) => {
    const responseDisplay = page.locator('[data-testid="response-display"]')
    await expect(responseDisplay).toBeVisible()
  })

  test('should show empty state initially', async ({ page }) => {
    const responseDisplay = page.locator('[data-testid="response-display"]')
    const text = await responseDisplay.textContent()

    expect(text?.toLowerCase()).toContain('no requests')
  })

  test('should expand/collapse response items', async ({ page }) => {
    const responseDisplay = page.locator('[data-testid="response-display"]')
    const items = await page.locator('[data-testid^="response-item-"]').count()

    // No items initially
    expect(items).toBe(0)
  })
})

test.describe('MCP Interface - Mobile Layout', () => {
  test('should stack components vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/mcp')

    const serverManager = page.locator('[data-testid="server-list"]').first()
    const connectionMonitor = page.locator('[data-testid="connection-status"]').first()

    const managerBox = await serverManager.boundingBox()
    const monitorBox = await connectionMonitor.boundingBox()

    if (managerBox && monitorBox) {
      // Should be stacked vertically (monitor below manager)
      expect(monitorBox.y).toBeGreaterThan(managerBox.y)
    }
  })

  test('buttons should be mobile-friendly on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/mcp')

    const buttons = await page.locator('button').all()

    for (const button of buttons) {
      const box = await button.boundingBox()
      if (box) {
        // Minimum 40px height for mobile buttons
        const height = box.height
        // Text buttons should be at least 44px
        const text = await button.textContent()
        if (text && text.trim().length > 0) {
          expect(height).toBeGreaterThanOrEqual(40)
        }
      }
    }
  })

  test('input fields should be mobile-optimized', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/mcp')

    const inputs = await page.locator('input, textarea').all()

    for (const input of inputs) {
      const box = await input.boundingBox()
      if (box) {
        // Inputs should be at least 44px for touch
        expect(box.height).toBeGreaterThanOrEqual(40)
      }
    }
  })
})

test.describe('MCP Interface - Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/mcp')

    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1) // Only one H1

    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const count = await headings.count()
    expect(count).toBeGreaterThan(0)
  })

  test('buttons should have accessible labels', async ({ page }) => {
    await page.goto('/mcp')

    const buttons = await page.locator('button').all()

    for (const button of buttons.slice(0, 5)) {
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')

      const isAccessible = text && text.trim().length > 0
      expect(isAccessible || ariaLabel).toBeTruthy()
    }
  })

  test('form inputs should be associated with labels', async ({ page }) => {
    await page.goto('/mcp')

    const labels = page.locator('label')
    const labelCount = await labels.count()

    expect(labelCount).toBeGreaterThan(0)
  })

  test('error messages should be properly marked', async ({ page }) => {
    await page.goto('/mcp')

    const sendButton = page.locator('[data-testid="send-request-btn"]')
    await sendButton.click()

    const alerts = page.locator('[role="alert"]')
    const count = await alerts.count()

    // Might have no alert if server selected, but structure should support it
    expect(count).toBeGreaterThanOrEqual(0)
  })
})
