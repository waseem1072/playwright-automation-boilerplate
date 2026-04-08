import { Page } from '@playwright/test';

export class PlaywrightCommunityPage {
  constructor(private readonly page: Page) {}

  async navigateTo() {
    await this.page.goto('https://playwright.dev/community/welcome');
  }

  get welcomeHeading() {
    return this.page.getByRole('heading', { name: 'Welcome', level: 1 });
  }

  get discordLink() {
    return this.page.getByRole('link', { name: /Discord/ }).first();
  }

  get linkedInLink() {
    return this.page.getByRole('link', { name: /LinkedIn/ }).first();
  }

  get youTubeLink() {
    return this.page.getByRole('link', { name: /YouTube/ }).first();
  }

  get stackOverflowLink() {
    return this.page.getByRole('link', { name: /Stack Overflow/ }).first();
  }
}
