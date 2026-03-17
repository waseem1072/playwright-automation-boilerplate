import { Page, Locator } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async navigateToLoginPage() {
    await this.page.goto("");
  }

  async login(username: string, password: string) {
    await this.page.fill("#root_email", username);
    await this.page.fill("#root_password", password);
    await this.page.getByRole("button", { name: "Sign In" }).click();
  }

    async loginPage(username: string, password: string) {

  }

  async loginWithchangePassword(username: string, password: string, location: string) {
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.page.locator("#root_currentPassword").fill(username);
    await this.page.locator("#root_newPassword").fill(password);
    await this.page.locator("#root_reNewPassword").fill(password);
    await this.page.getByRole('button', { name: 'Reset Password' }).click();
  }

  async SelectYourBranch(location: string) {
    await this.page.click("#demo-simple-select-outlined");
    await this.page.getByRole("option", { name: location }).first().click();
    await this.page.getByRole("button", { name: "Submit" }).click();
  }

  async getErrorMessage(): Promise<string> {
    return (
      (await this.page.locator('//h3[@data-test="error"]').textContent()) ?? ""
    );
  }
}
