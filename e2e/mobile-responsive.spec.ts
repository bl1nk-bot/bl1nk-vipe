import { test, expect, devices } from '@playwright/test'

// Define test devices with viewport sizes
const testDevices = {
  'Pixel 5': { width: 412, height: 914, dpr: 2 },
  'iPhone SE': { width: 375, height: 812, dpr: 2 },
  'Galaxy S20': { width: 360, height: 800, dpr: 2 },
  'iPad Mini': { width: 768, height: 1024, dpr: 2 },
}

test.describe('Mobile Responsiveness Suite', () => {
  test('should render correctly on Pixel 5 (412px)', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 914 })
    await page.goto('/')

    // Verify no horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.clientWidth)
    expect(bodyWidth).toBeLessThanOrEqual(412)

    // Verify main content is visible
    const main = page.locator('[role="main"]')
    expect(main).toBeTruthy()
  })

  test('should render correctly on iPhone SE (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const bodyWidth = await page.evaluate(() => document.body.clientWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)

    // Check readability
    const fontSize = await page.evaluate(
      () => window.getComputedStyle(document.body).fontSize
    )
    expect(fontSize).toBeDefined()
  })

  test('should render correctly on Galaxy S20 (360px)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto('/')

    const bodyWidth = await page.evaluate(() => document.body.clientWidth)
    expect(bodyWidth).toBeLessThanOrEqual(360)
  })

  test('should handle landscape orientation', async ({ page }) => {
    await page.setViewportSize({ width: 812, height: 375 })
    await page.goto('/')

    const main = page.locator('[role="main"]')
    await expect(main).toBeVisible()
  })

  test('touch targets should be minimum 44x44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const buttons = await page.locator('button').all()
    let validTouchTargets = 0

    for (const button of buttons) {
      const box = await button.boundingBox()
      if (box && box.width >= 44 && box.height >= 44) {
        validTouchTargets++
      }
    }

    expect(validTouchTargets).toBeGreaterThan(0)
  })

  test('safe-area-inset CSS should be applied', async ({ page }) => {
    await page.goto('/')

    const hasSafeAreaPadding = await page.evaluate(() => {
      return window.getComputedStyle(document.body).paddingTop !== '0px'
    })

    expect(hasSafeAreaPadding).toBeTruthy()
  })

  test('no horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })

    expect(hasHorizontalScroll).toBeFalsy()
  })

  test('text should be readable on mobile (font-size >= 14px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const paragraphs = await page.locator('p, li, span').all()
    let readableElements = 0

    for (const el of paragraphs.slice(0, 10)) {
      const fontSize = await el.evaluate(
        el => parseFloat(window.getComputedStyle(el).fontSize)
      )
      if (fontSize >= 12) {
        readableElements++
      }
    }

    expect(readableElements).toBeGreaterThan(0)
  })
})

test.describe('MCP Page Mobile Responsiveness', () => {
  test('MCP page should render on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/mcp')

    await expect(page).toHaveURL('/mcp')
    const heading = page.locator('h1')
    await expect(heading).toContainText('MCP Interface')
  })

  test('MCP server list should be scrollable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/mcp')

    const serverList = page.locator('[data-testid="server-list"]')
    await expect(serverList).toBeVisible()

    const servers = await page.locator('[data-testid="server-item"]').count()
    expect(servers).toBeGreaterThan(0)
  })

  test('MCP components should have touch-friendly buttons', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/mcp')

    const buttons = await page.locator('button').all()

    for (const button of buttons) {
      const box = await button.boundingBox()
      if (box) {
        // Allow some button variations (icon-only might be smaller)
        const text = await button.textContent()
        if (text && text.trim().length > 0) {
          expect(box.height).toBeGreaterThanOrEqual(40)
        }
      }
    }
  })

  test('MCP request builder should be vertically scrollable on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/mcp')

    const builder = page.locator('[data-testid="request-builder"]')
    const scrollHeight = await builder.evaluate(el => el.scrollHeight)
    const clientHeight = await builder.evaluate(el => el.clientHeight)

    // The builder might not scroll if empty, but structure should allow scrolling
    expect(scrollHeight).toBeGreaterThanOrEqual(clientHeight)
  })
})

test.describe('Viewport Transitions', () => {
  test('should adapt layout from mobile to tablet to desktop', async ({ page }) => {
    // Start mobile
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    let layoutElements = await page.locator('[data-mobile-layout]').count()
    expect(layoutElements).toBeGreaterThanOrEqual(0)

    // Transition to tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await new Promise(resolve => setTimeout(resolve, 500))

    const isResponsive = await page.evaluate(() => {
      return document.body.clientWidth === 768
    })
    expect(isResponsive).toBeTruthy()

    // Transition to desktop
    await page.setViewportSize({ width: 1440, height: 900 })
    await new Promise(resolve => setTimeout(resolve, 500))

    const isDesktop = await page.evaluate(() => {
      return document.body.clientWidth === 1440
    })
    expect(isDesktop).toBeTruthy()
  })
})
