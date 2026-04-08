import { test, expect } from '@playwright/test';
import { PlaywrightDocsPage } from '../../pages/playwrightDocs.page';

test.describe('Docs Sidebar — Web Server Happy Path @docs @smoke', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('navigates to Web Server page via sidebar @docs @smoke @positive', { tag: ['@docs', '@smoke', '@positive'] }, async ({ page }) => {
    const docs = new PlaywrightDocsPage(page);
    await docs.navigateTo();
    await expect(docs.installationHeading).toBeVisible();
    await docs.clickSidebarLink('Web server');
    await expect(page).toHaveURL('https://playwright.dev/docs/test-webserver');
    await expect(page).toHaveTitle(/Web server/);
    await expect(docs.webServerHeading).toBeVisible();
    await expect(page).toHaveScreenshot(['playwrightDocs', 'web-server-page.png']);
  });
});
