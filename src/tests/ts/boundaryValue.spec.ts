import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../../pages/playwrightHome.page';
import { PlaywrightDocsPage } from '../../pages/playwrightDocs.page';

test.describe('Boundary Value Testing @docs @boundary', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  // ─── Language Selector ────────────────────────────────────────────────────

  test(
    'language selector — Python (first non-default boundary) @docs @boundary @smoke @positive',
    { tag: ['@docs', '@boundary', '@smoke', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      await home.navigateTo();

      await home.selectLanguage('Python');

      await expect(page).toHaveURL(/\/python\//);
      await expect(page).toHaveTitle(/Python/);
      await expect(page).toHaveScreenshot(['playwrightHome', 'boundary-language-python.png'], { timeout: 15000 });
    },
  );

  test(
    'language selector — .NET (last language boundary) @docs @boundary @regression @positive',
    { tag: ['@docs', '@boundary', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      await home.navigateTo();

      await home.selectLanguage('.NET');

      await expect(page).toHaveURL(/\/dotnet\//);
      await expect(page).toHaveTitle(/\.NET/);
      await expect(page).toHaveScreenshot(['playwrightHome', 'boundary-language-dotnet.png'], { timeout: 15000 });
    },
  );

  // ─── Search Input ─────────────────────────────────────────────────────────

  test(
    'search modal — empty input boundary (zero characters) @docs @boundary @smoke @positive',
    { tag: ['@docs', '@boundary', '@smoke', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      await home.navigateTo();

      await home.openSearch();

      await expect(home.searchBox).toBeVisible();
      await expect(home.searchBox).toHaveValue('');
      await expect(page).toHaveScreenshot(['playwrightHome', 'boundary-search-empty.png']);
    },
  );

  test(
    'search modal — maxlength boundary: input capped at 64 characters @docs @boundary @regression @positive',
    { tag: ['@docs', '@boundary', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      await home.navigateTo();
      await home.openSearch();

      // The search field has maxlength="64" — fill exactly at the boundary
      const query = 'a'.repeat(64);
      await home.searchBox.fill(query);

      await expect(home.searchBox).toHaveValue(query);
      expect((await home.searchBox.inputValue()).length).toBe(64);
      await expect(page).toHaveScreenshot(['playwrightHome', 'boundary-search-maxlength.png']);
    },
  );

  // ─── Dark Mode Toggle ─────────────────────────────────────────────────────

  test(
    'dark mode — lower boundary: activate dark mode (off to on) @docs @boundary @smoke @positive',
    { tag: ['@docs', '@boundary', '@smoke', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      await home.navigateTo();

      // In headless Chromium the site initialises with data-theme='light' (system default).
      // The toggle cycles: system → light → dark. Two clicks are required to reach dark mode.
      await home.toggleDarkMode();
      await home.toggleDarkMode();

      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(home.darkModeButton).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightHome', 'boundary-dark-mode-on.png']);
    },
  );

  test(
    'dark mode — upper boundary: return to light mode (on to off) @docs @boundary @regression @positive',
    { tag: ['@docs', '@boundary', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      await home.navigateTo();

      // Reach dark mode (2 clicks from headless default), then toggle back to light
      await home.toggleDarkMode();
      await home.toggleDarkMode();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

      await home.toggleDarkMode();

      await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
      await expect(home.darkModeButton).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightHome', 'boundary-dark-mode-off.png']);
    },
  );

  // ─── Docs Sidebar ─────────────────────────────────────────────────────────

  test(
    'docs sidebar — first link boundary: Writing tests visible and navigable @docs @boundary @smoke @positive',
    { tag: ['@docs', '@boundary', '@smoke', '@positive'] },
    async ({ page }) => {
      const docs = new PlaywrightDocsPage(page);
      await docs.navigateTo();
      await expect(docs.installationHeading).toBeVisible();

      await docs.clickSidebarLink('Writing tests');

      await expect(page).toHaveURL('https://playwright.dev/docs/writing-tests');
      await expect(page).toHaveTitle(/Writing tests/);
      await expect(docs.writingTestsHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'boundary-sidebar-writing-tests.png']);
    },
  );

  test(
    'docs sidebar — deep link boundary: Annotations visible and navigable @docs @boundary @regression @positive',
    { tag: ['@docs', '@boundary', '@regression', '@positive'] },
    async ({ page }) => {
      const docs = new PlaywrightDocsPage(page);
      await docs.navigateTo();
      await expect(docs.installationHeading).toBeVisible();

      await docs.clickSidebarLink('Annotations');

      await expect(page).toHaveURL(/\/docs\/test-annotations/);
      await expect(page).toHaveTitle(/Annotations/);
      await expect(docs.annotationsHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'boundary-sidebar-annotations.png']);
    },
  );
});
