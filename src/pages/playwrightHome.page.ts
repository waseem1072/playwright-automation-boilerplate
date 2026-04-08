import { Page } from '@playwright/test';

export class PlaywrightHomePage {
  constructor(private readonly page: Page) {}

  async navigateTo() {
    await this.page.goto('https://playwright.dev');
  }

  // Nav actions
  async clickDocsNav() {
    await this.page.getByRole('link', { name: 'Docs' }).click();
  }

  async clickApiNav() {
    await this.page.getByRole('link', { name: 'API' }).click();
  }

  async clickCommunityNav() {
    await this.page.getByRole('link', { name: 'Community' }).click();
  }

  async clickLogo() {
    await this.page.getByRole('link', { name: /Playwright logo/ }).click();
  }

  async clickGetStarted() {
    await this.page.getByRole('link', { name: 'Get started' }).first().click();
  }

  async openLanguageDropdown() {
    await this.page.getByRole('button', { name: 'Node.js' }).click();
  }

  async selectLanguage(name: string) {
    await this.openLanguageDropdown();
    // Scope to the nav dropdown to avoid matching cross-language paragraph links
    await this.page.getByLabel('Main', { exact: true }).getByRole('link', { name, exact: true }).click();
    // Cross-origin sub-sites (/python/, /java/, /dotnet/) load custom fonts that can cause
    // toHaveScreenshot to time out on font-wait. Wait for networkidle before returning so
    // callers can screenshot immediately without raising the snapshot timeout.
    await this.page.waitForLoadState('networkidle');
  }

  async openSearch() {
    await this.page.getByRole('button', { name: /Search/ }).click();
  }

  async toggleDarkMode() {
    await this.page.getByRole('button', { name: /Switch between dark and light mode/ }).click();
  }

  // Getters
  get heroHeading() {
    return this.page.getByRole('heading', { level: 1 });
  }

  get getStartedLink() {
    return this.page.getByRole('link', { name: 'Get started' }).first();
  }

  get searchBox() {
    return this.page.getByRole('searchbox', { name: 'Search' });
  }

  get darkModeButton() {
    return this.page.getByRole('button', { name: /Switch between dark and light mode/ });
  }
}
