import { test, expect } from '@playwright/test';
import { PlaywrightDocsPage } from '../../pages/playwrightDocs.page';

test.describe('Playwright Docs - Get Started @docs', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let docsPage: PlaywrightDocsPage;

  test.beforeEach(async ({ page }) => {
    docsPage = new PlaywrightDocsPage(page);
    await docsPage.navigateToHomepage();
  });

  test(
    'clicking Get Started navigates to the Installation page @docs @smoke @positive',
    { tag: ['@docs', '@smoke', '@positive'] },
    async ({ page }) => {
      // Act
      await docsPage.clickGetStarted();

      // Assert
      await expect(page).toHaveURL(/\/docs\/intro/);
      await expect(page).toHaveTitle(/Installation/);
      await expect(docsPage.installationHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'installation-page.png']);
    },
  );

  test(
    'Get Started → Installation → UI Mode sidebar navigation @docs @smoke @positive',
    { tag: ['@docs', '@smoke', '@positive'] },
    async ({ page }) => {
      // Act: click Get Started from homepage
      await docsPage.clickGetStarted();

      // Assert: Installation page loads
      await expect(page).toHaveURL(/\/docs\/intro/);
      await expect(docsPage.installationHeading).toBeVisible();

      // Act: click UI Mode in sidebar
      await docsPage.clickSidebarLink('UI Mode');

      // Assert: UI Mode page loads
      await expect(page).toHaveURL(/\/docs\/test-ui-mode/);
      await expect(docsPage.uiModeHeading).toBeVisible();
      await expect(page).toHaveScreenshot(['playwrightDocs', 'ui-mode-page.png']);
    },
  );
});
