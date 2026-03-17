import { Page, Locator } from "@playwright/test";
import { promises } from "node:dns";

export class ResetPasswordPage {
  constructor(private readonly page: Page) {}

  async clickChangePassword() {
    await this.page
      .getByText(/Forgot Password/i)
      .first()
      .click();
  }

  async fillUserName(userName: string): Promise<void> {
    await this.page.locator("#root_userName").fill(userName);
  }

  async fillEmail(email: string): Promise <void> {
    await this.page.locator("#root_email").fill(email);
  }

    async fillcontactNumber(contactNumber: string): Promise <void> {
    await this.page.locator("#root_contactNumber").fill(contactNumber);
  }

  async resetPasswordButton() {
    await this.page.getByRole('button', { name: 'Reset Password' }).click();
  }

//////////
  async CurrentPassword(password_1: string) {
    await this.page.fill("#root_currentPassword", password_1);
  }
  
  async NewPassword(password_2: string) {
    await this.page.fill("#root_newPassword", password_2);
  }

  async ConfirmNewPassword(password_3: string) {
    await this.page.fill("#root_reNewPassword", password_3);
  }

  async ResetPassword() {
    await this.page.getByRole("button", { name: "Reset Password" }).click();
  }
}
