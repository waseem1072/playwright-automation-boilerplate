import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../../pages/playwrightHome.page';
import { PlaywrightDocsPage } from '../../pages/playwrightDocs.page';
import { PlaywrightCommunityPage } from '../../pages/playwrightCommunity.page';

test.describe('E2E — Full site journeys @docs @regression', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  // ─── Homepage ─────────────────────────────────────────────────────────────

  test(
    'homepage: hero heading and Get Started link are visible @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      await home.navigateTo();

      await expect(page).toHaveURL('https://playwright.dev/');
      await expect(page).toHaveTitle(/Playwright/);
      // Assert only the stable prefix — full heading changed 2026-04 to include AI agents copy
      // (see locators.json → locators.hero.headingPartialMatch)
      await expect(home.heroHeading).toContainText('Playwright enables reliable');
      await expect(home.getStartedLink).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightHome', 'e2e-homepage.png']);
    },
  );

  // ─── Full docs journey ────────────────────────────────────────────────────

  test(
    'full docs journey: Home → Installation → Writing tests → Debugging @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      const docs = new PlaywrightDocsPage(page);

      // Step 1: Start at homepage
      await home.navigateTo();
      await expect(home.heroHeading).toBeVisible();

      // Step 2: Click Get Started → Installation
      await home.clickGetStarted();
      await expect(page).toHaveURL(/\/docs\/intro/);
      await expect(docs.installationHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'e2e-installation.png']);

      // Step 3: Navigate to Writing tests via sidebar
      await docs.clickSidebarLink('Writing tests');
      await expect(page).toHaveURL('https://playwright.dev/docs/writing-tests');
      await expect(docs.writingTestsHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'e2e-writing-tests.png']);

      // Step 4: Navigate to Debugging tests via sidebar
      await docs.clickSidebarLink('Debugging Tests');
      await expect(page).toHaveURL('https://playwright.dev/docs/debug');
      await expect(docs.debuggingHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'e2e-debugging.png']);
    },
  );

  // ─── Test Generator journey ───────────────────────────────────────────────

  test(
    'docs journey: Installation → Annotations sidebar link @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const docs = new PlaywrightDocsPage(page);

      await docs.navigateTo();
      await expect(docs.installationHeading).toBeVisible();

      await docs.clickSidebarLink('Annotations');
      await expect(page).toHaveURL('https://playwright.dev/docs/test-annotations');
      await expect(docs.annotationsHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'e2e-annotations.png']);
    },
  );

  // ─── Full UI Mode journey ─────────────────────────────────────────────────

  test(
    'full journey: Home → Installation → UI Mode @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      const docs = new PlaywrightDocsPage(page);

      await home.navigateTo();
      await home.clickGetStarted();
      await expect(docs.installationHeading).toBeVisible();

      await docs.clickSidebarLink('UI Mode');
      await expect(page).toHaveURL(/\/docs\/test-ui-mode/);
      await expect(docs.uiModeHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'e2e-ui-mode.png']);
    },
  );

  // ─── API page journey ─────────────────────────────────────────────────────

  test(
    'full API journey: Home → API nav → Playwright Library page @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      const docs = new PlaywrightDocsPage(page);

      await home.navigateTo();
      await home.clickApiNav();

      await expect(page).toHaveURL('https://playwright.dev/docs/api/class-playwright');
      await expect(page).toHaveTitle(/Playwright Library/);
      await expect(docs.apiHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'e2e-api-library.png']);
    },
  );

  // ─── Community page journey ───────────────────────────────────────────────

  test(
    'community journey: Home → Community nav → Welcome page content @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      const community = new PlaywrightCommunityPage(page);

      await home.navigateTo();
      await home.clickCommunityNav();

      await expect(page).toHaveURL('https://playwright.dev/community/welcome');
      await expect(page).toHaveTitle(/Welcome/);
      await expect(community.welcomeHeading).toBeVisible();
      await expect(community.discordLink).toBeVisible();
      await expect(community.linkedInLink).toBeVisible();
      await expect(community.youTubeLink).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightCommunity', 'e2e-community-welcome.png']);
    },
  );

  test(
    'community page: direct navigation loads correctly @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const community = new PlaywrightCommunityPage(page);

      await community.navigateTo();

      await expect(page).toHaveURL('https://playwright.dev/community/welcome');
      await expect(community.welcomeHeading).toBeVisible();
      await expect(community.stackOverflowLink).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightCommunity', 'e2e-community-direct.png']);
    },
  );

  // ─── Logo navigation ──────────────────────────────────────────────────────

  test(
    'logo navigation: Docs → Logo → Homepage → Docs again @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      const docs = new PlaywrightDocsPage(page);

      // Navigate to docs
      await docs.navigateTo();
      await expect(docs.installationHeading).toBeVisible();

      // Click logo → back to homepage
      await home.clickLogo();
      await expect(page).toHaveURL('https://playwright.dev/');
      await expect(home.heroHeading).toBeVisible();

      // Navigate to docs again
      await home.clickDocsNav();
      await expect(page).toHaveURL('https://playwright.dev/docs/intro');
      await expect(docs.installationHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'e2e-logo-roundtrip.png']);
    },
  );

  // ─── Language selector journey ────────────────────────────────────────────

  test(
    'language selector: switch to Python loads Python homepage @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);

      await home.navigateTo();
      await home.selectLanguage('Python');

      await expect(page).toHaveURL('https://playwright.dev/python/');
      await expect(page).toHaveTitle(/Python/);
      await expect(page).toHaveScreenshot(['playwrightHome', 'e2e-language-python.png']);
    },
  );

  test(
    'language selector: switch to Java loads Java homepage @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);

      await home.navigateTo();
      await home.selectLanguage('Java');

      await expect(page).toHaveURL('https://playwright.dev/java/');
      await expect(page).toHaveTitle(/Java/);
      await expect(page).toHaveScreenshot(['playwrightHome', 'e2e-language-java.png']);
    },
  );

  test(
    'language selector: switch to .NET loads .NET homepage @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);

      await home.navigateTo();
      await home.selectLanguage('.NET');

      await expect(page).toHaveURL('https://playwright.dev/dotnet/');
      await expect(page).toHaveTitle(/\.NET/);
      await expect(page).toHaveScreenshot(['playwrightHome', 'e2e-language-dotnet.png']);
    },
  );

  // ─── Search journey ───────────────────────────────────────────────────────

  test(
    'search: open modal, type query and see results @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);

      await home.navigateTo();
      await home.openSearch();

      await expect(home.searchBox).toBeVisible();
      await home.searchBox.fill('locator');
      await expect(home.searchBox).toHaveValue('locator');

      // Results list should appear
      await expect(page.getByRole('listbox').first()).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightHome', 'e2e-search-results.png'], { maxDiffPixelRatio: 0.02 });
    },
  );

  // ─── Dark mode journey ────────────────────────────────────────────────────

  test(
    'dark mode: toggle on homepage then navigate to docs retains theme @docs @regression @positive',
    { tag: ['@docs', '@regression', '@positive'] },
    async ({ page }) => {
      const home = new PlaywrightHomePage(page);
      const docs = new PlaywrightDocsPage(page);

      await home.navigateTo();
      await home.toggleDarkMode();

      await expect(home.darkModeButton).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightHome', 'e2e-dark-mode-home.png']);

      // Navigate to docs and verify dark mode persists
      await home.clickDocsNav();
      await expect(docs.installationHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'e2e-dark-mode-docs.png']);
    },
  );
});
