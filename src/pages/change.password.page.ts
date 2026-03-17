import { Page, Locator, expect } from "@playwright/test";
import { promises } from "node:dns";

export class ChangePassword {
  constructor(private readonly page: Page) {}

  async navigateToAssignMultipleBranches(): Promise<void> {
    await this.page
      .getByRole("button", { name: "Assign Multiple Branches" })
      .click();
  }

  
  async fillCurrentPassword(currentPassword: string): Promise<void> {
    await this.page.locator("#root_currentPassword").fill(currentPassword);
  }

  async fillNewPassword(currentPassword2: string): Promise<void> {
    await this.page.locator("#root_newPassword").fill(currentPassword2);
  }

  async fillRePassword(currentPassword3: string): Promise<void> {
    await this.page.locator("#root_reNewPassword").fill(currentPassword3);
  }

  async clickChangePasswordButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Change Password' }).click();
  }
}
