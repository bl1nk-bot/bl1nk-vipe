import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Vibe Coding Agent')
})

test('get started', async ({ page }) => {
  await page.goto('/')

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click()

  // Expects the URL to contain intro.
  await expect(page.getByRole('heading', { name: 'Get Started' })).toBeVisible()
})