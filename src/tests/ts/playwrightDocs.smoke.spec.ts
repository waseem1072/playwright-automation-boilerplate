import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../../pages/playwrightHome.page';
import { PlaywrightDocsPage } from '../../pages/playwrightDocs.page';

test.describe('Playwright Docs — Smoke Suite @docs @smoke', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  // ─── Homepage ─────────────────────────────────────────────────────────────

  test(
    'homepage loads with correct title and hero content @docs @smoke @positive',
    { tag: ['@docs', '@smoke', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      await home.navigateTo();

      await expect(page).toHaveURL('https://playwright.dev/');
      await expect(page).toHaveTitle(/Playwright/);
      // Using the stable common prefix — the full heading changed from "end-to-end testing" to
      // "web automation for testing, scripting, and AI agents" (as of 2026-04).
      // Matching only the invariant prefix keeps this assertion resilient to future copy tweaks.
      await expect(home.heroHeading).toContainText('Playwright enables reliable');
      await expect(home.getStartedLink).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightHome', 'homepage-loads.png']);
    },
  );

  // ─── Navbar navigation ────────────────────────────────────────────────────

  test(
    'Docs nav link navigates to Installation page @docs @smoke @positive',
    { tag: ['@docs', '@smoke', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      const docs = new PlaywrightDocsPage(page);
      await home.navigateTo();
      await home.clickDocsNav();

      await expect(page).toHaveURL('https://playwright.dev/docs/intro');
      await expect(page).toHaveTitle(/Installation/);
      await expect(docs.installationHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'nav-docs-installation.png']);
    },
  );

  test(
    'API nav link navigates to Playwright Library page @docs @smoke @positive',
    { tag: ['@docs', '@smoke', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      const docs = new PlaywrightDocsPage(page);
      await home.navigateTo();
      await home.clickApiNav();

      await expect(page).toHaveURL('https://playwright.dev/docs/api/class-playwright');
      await expect(page).toHaveTitle(/Playwright Library/);
      await expect(docs.apiHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'nav-api-library.png']);
    },
  );

  test(
    'Community nav link navigates to Welcome page @docs @smoke @positive',
    { tag: ['@docs', '@smoke', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      await home.navigateTo();
      await home.clickCommunityNav();

      await expect(page).toHaveURL('https://playwright.dev/community/welcome');
      await expect(page).toHaveTitle(/Welcome/);
      await expect(page.getByRole('heading', { name: 'Welcome', level: 1 })).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'nav-community-welcome.png']);
    },
  );

  // ─── Hero CTA ─────────────────────────────────────────────────────────────

  test(
    'Get started hero button navigates to Installation page @docs @smoke @positive',
    { tag: ['@docs', '@smoke', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      const docs = new PlaywrightDocsPage(page);
      await home.navigateTo();
      await home.clickGetStarted();

      await expect(page).toHaveURL(/\/docs\/intro/);
      await expect(page).toHaveTitle(/Installation/);
      await expect(docs.installationHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'hero-get-started-installation.png']);
    },
  );

  // ─── Logo ─────────────────────────────────────────────────────────────────

  test(
    'Playwright logo returns to homepage from docs page @docs @smoke @positive',
    { tag: ['@docs', '@smoke', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      const docs = new PlaywrightDocsPage(page);
      await docs.navigateTo();
      await home.clickLogo();

      await expect(page).toHaveURL('https://playwright.dev/');
      await expect(page).toHaveTitle(/Fast and reliable end-to-end testing/);
      await expect(page).toHaveScreenshot(['playwrightHome', 'logo-homepage-return.png']);
    },
  );

  // ─── Language selector ────────────────────────────────────────────────────

  test(
    'language selector switches to Python site @docs @smoke @positive',
    { tag: ['@docs', '@smoke', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      await home.navigateTo();
      await home.selectLanguage('Python');

      await expect(page).toHaveURL('https://playwright.dev/python/');
      await expect(page).toHaveTitle(/Python/);
      // Wait for network idle before screenshot — the Python sub-site loads additional
      // font resources that exceed the default 5 s font-wait timeout in toHaveScreenshot.
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot(['playwrightHome', 'language-python-homepage.png'], { timeout: 15000 });
    },
  );

  // ─── Search ───────────────────────────────────────────────────────────────

  test(
    'search modal opens and accepts input @docs @smoke @positive',
    { tag: ['@docs', '@smoke', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      await home.navigateTo();
      await home.openSearch();

      await expect(home.searchBox).toBeVisible();
      await home.searchBox.fill('locator');
      await expect(home.searchBox).toHaveValue('locator');
      await expect(page).toHaveScreenshot(['playwrightHome', 'search-modal-open.png']);
    },
  );

  // ─── Dark mode toggle ─────────────────────────────────────────────────────

  test(
    'dark mode toggle is visible and interactive @docs @smoke @positive',
    { tag: ['@docs', '@smoke', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      await home.navigateTo();

      await expect(home.darkModeButton).toBeVisible();
      await home.toggleDarkMode();
      await expect(page.getByRole('button', { name: /Switch between dark and light mode \(currently (dark|light) mode\)/ })).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightHome', 'dark-mode-active.png']);
    },
  );

  // ─── Docs sidebar ─────────────────────────────────────────────────────────

  test(
    'docs sidebar Writing tests link navigates to Writing tests page @docs @smoke @positive',
    { tag: ['@docs', '@smoke', '@positive'] },
    async ({ page }) => {
      const docs = new PlaywrightDocsPage(page);
      await docs.navigateTo();
      await docs.clickSidebarLink('Writing tests');

      await expect(page).toHaveURL('https://playwright.dev/docs/writing-tests');
      await expect(page).toHaveTitle(/Writing tests/);
      await expect(docs.writingTestsHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'sidebar-writing-tests.png']);
    },
  );
});
