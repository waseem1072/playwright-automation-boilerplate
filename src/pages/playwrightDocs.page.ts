import { Page } from '@playwright/test';

export class PlaywrightDocsPage {
  constructor(private readonly page: Page) {}

  async navigateTo() {
    await this.page.goto('https://playwright.dev/docs/intro');
  }

  async navigateToHomepage() {
    await this.page.goto('https://playwright.dev');
  }

  async clickGetStarted() {
    await this.page.getByRole('link', { name: 'Get started' }).first().click();
  }

  async clickSidebarLink(name: string) {
    const link = this.page.getByRole('link', { name, exact: true }).first();
    const href = await link.getAttribute('href');
    await link.click();
    if (href) {
      await this.page.waitForURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
    }
    // Wait for new page heading matching the link name to appear in the DOM (SPA re-render)
    await this.page
      .getByRole('heading', { name, exact: false, level: 1 })
      .waitFor({ state: 'visible', timeout: 15000 });
  }

  get installationHeading() {
    return this.page.getByRole('heading', { name: 'Installation', level: 1 });
  }

  get writingTestsHeading() {
    return this.page.getByRole('heading', { name: 'Writing tests', level: 1 });
  }

  get apiHeading() {
    return this.page.getByRole('heading', { name: 'Playwright Library', level: 1 });
  }

  get uiModeHeading() {
    // Primary: h1 role-based locator, exact name match scoped to level 1
    // Fallback: level-agnostic exact match (catches any future heading level change)
    const primary = this.page.getByRole('heading', { name: 'UI Mode', exact: true, level: 1 });
    const fallback = this.page.getByRole('heading', { name: 'UI mode', exact: true, level: 1 });
    // Return primary; if the live site ever lowercases 'm', the spec will surface that
    // and the fallback chain in the test can be activated. Both are level-1 to avoid
    // matching sidebar/breadcrumb heading-role elements that share the same text.
    return primary;
  }

  get debuggingHeading() {
    return this.page.getByRole('heading', { name: 'Debugging tests', level: 1 });
  }

  get testGeneratorHeading() {
    return this.page.getByRole('heading', { name: 'Generating tests', level: 1 });
  }

  get annotationsHeading() {
    return this.page.getByRole('heading', { name: 'Annotations', level: 1 });
  }

  get webServerHeading() {
    return this.page.getByRole('heading', { name: 'Web server', level: 1 });
  }
}
