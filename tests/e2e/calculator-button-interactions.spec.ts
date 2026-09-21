import { test, expect } from '@playwright/test';

test.describe('SCRUM-18: Calculator button interaction feedback', () => {
  test.beforeEach(async ({ page }) => {
    // Base URL is provided via playwright.config.ts
    await page.goto('/');
  });

  test('calculator basic operation still works (7 + 8 = 15)', async ({ page }) => {
    const display = page.locator('.display');

    await page.getByRole('button', { name: '7' }).click();
    await expect(display).toHaveText('7');

    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '8' }).click();
    await page.getByRole('button', { name: '=' }).click();

    await expect(display).toHaveText('15');
  });

  test('keyboard users can tab to Clear button and it exposes focus-visible styling', async ({ page, browserName }) => {
    // Note: Focus-visible rendering varies slightly by browser; we assert the CSS rule exists and that focus actually moves via keyboard navigation.
    const clearBtn = page.getByRole('button', { name: 'C' });

    // Start tabbing
    await page.keyboard.press('Tab');

    // Guard to avoid infinite loop if tab order changes
    for (let i = 0; i < 30; i++) {
      if (await clearBtn.evaluate(el => el === document.activeElement)) break;
      await page.keyboard.press('Tab');
    }

    await expect(clearBtn).toBeFocused();

    const hasFocusVisibleRule = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      const needle = 'button:focus-visible';
      for (const sheet of sheets) {
        let rules;
        try { rules = sheet.cssRules; } catch { continue; } // ignore CORS-protected sheets
        for (const rule of Array.from(rules)) {
          const text = rule.cssText || '';
          if (text.includes(needle) && text.includes('outline')) return true;
        }
      }
      return false;
    });

    expect(hasFocusVisibleRule, `Expected CSS rule for button:focus-visible (browser=${browserName})`).toBeTruthy();
  });

  test('pressed/active styling exists for buttons (CSS rule presence)', async ({ page }) => {
    const hasActiveRule = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      const needle = 'button:active';
      for (const sheet of sheets) {
        let rules;
        try { rules = sheet.cssRules; } catch { continue; }
        for (const rule of Array.from(rules)) {
          const text = rule.cssText || '';
          if (text.includes(needle) && text.includes('transform') && text.includes('box-shadow')) return true;
        }
      }
      return false;
    });

    expect(hasActiveRule).toBeTruthy();
  });

  test('hover feedback does not break interactions (smoke)', async ({ page }) => {
    const seven = page.getByRole('button', { name: '7' });
    const display = page.locator('.display');

    await seven.hover();
    await seven.click();
    await expect(display).toHaveText('7');
  });
});
