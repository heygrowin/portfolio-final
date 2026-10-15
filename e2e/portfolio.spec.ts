import { test, expect } from '@playwright/test'

test.describe('Ansh Rajput Single-Page Portfolio Smoke Tests', () => {
  test('Hero renders with Messina lockscreen, Skip works, and Replay works', async ({ page }) => {
    // Clear localStorage to simulate a fresh first-time visitor
    await page.addInitScript(() => {
      window.localStorage.clear()
    })

    await page.goto('/')

    // Hero title and status elements
    const heroSection = page.locator('#hero')
    await expect(heroSection).toBeVisible()

    const skipBtn = page.locator('#skip')
    // Click skip to test skip functionality
    if (await skipBtn.isVisible()) {
      await skipBtn.click()
    }

    // After skip, hero should have "done" class and name should be visible
    await expect(heroSection).toHaveClass(/done/)
    await expect(page.locator('h1', { hasText: 'Ansh Rajput' })).toBeVisible()

    // Test Replay button
    const replayBtn = page.locator('#replay')
    await expect(replayBtn).toBeVisible()
    await replayBtn.click()

    // Hero enters sequence mode again
    await expect(page.locator('#skip')).toBeVisible()

    // Skip again to leave in completed state
    await page.locator('#skip').click()
    await expect(heroSection).toHaveClass(/done/)
  })

  test('Clicking a project card opens full-screen story sheet and Esc key closes it', async ({ page }) => {
    await page.goto('/')

    // Skip hero animation if visible
    const skipBtn = page.locator('#skip')
    if (await skipBtn.isVisible()) {
      await skipBtn.click()
    }

    // Find first project card in the work feed
    const firstCard = page.locator('#work article').first()
    await expect(firstCard).toBeVisible()
    await firstCard.click()

    // Sheet should open as a dialog
    const storyDialog = page.locator('[role="dialog"]')
    await expect(storyDialog).toBeVisible()
    await expect(page.locator('#sheet-close-btn')).toBeVisible()

    // Press Escape to close
    await page.keyboard.press('Escape')
    await expect(storyDialog).not.toBeVisible()
  })

  test('Direct URL hash navigation opens the story sheet directly', async ({ page }) => {
    // Navigate with hash #plant-nursery (the anonymous slug while permission is unticked)
    await page.goto('/#plant-nursery')

    const storyDialog = page.locator('[role="dialog"]')
    await expect(storyDialog).toBeVisible()

    // Close button should close and remove hash or clean url
    await page.locator('#sheet-close-btn').click()
    await expect(storyDialog).not.toBeVisible()
  })

  test('Audience tabs switch and update URL parameter ?for=', async ({ page }) => {
    await page.goto('/')

    const clientTab = page.locator('button[role="tab"]', { hasText: 'Your business' })
    await expect(clientTab).toBeVisible()
    await clientTab.click()

    await expect(clientTab).toHaveAttribute('aria-selected', 'true')
    await expect(page).toHaveURL(/for=client/)

    const buildTab = page.locator('button[role="tab"]', { hasText: 'Build together' })
    await buildTab.click()

    await expect(buildTab).toHaveAttribute('aria-selected', 'true')
    await expect(page).toHaveURL(/for=build/)
  })
})
