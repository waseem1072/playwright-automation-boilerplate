import { Page, Locator, expect } from "@playwright/test";
import { testdata } from "../tests/resources/testdata";

export class UserAuthorization {
  constructor(private readonly page: Page) {}

  async clickUserAuthorization(): Promise<void> {
    await this.page.getByRole("button", { name: "User Authorization" }).click();
  }

  async searchingUser(userId: string): Promise<void> {
    await this.page.locator("#outlined-basic").fill(userId);
  }

  async clicksearchButton(userId: string): Promise<void> {
    await this.page.getByRole("button", { name: "Search" }).click();
  }

    async selectUserRole(): Promise<void> {
    await this.page.locator("#root_departmentId").click();
    await this.page.getByRole('option', { name: '05' }).click();
  }

  async verifyUserAuthorizationPage(): Promise<boolean> {
    return await this.page
      .getByRole("heading", { name: "User Authorization" })
      .isVisible();
  }

  // async hoverPendingUser(): Promise<void> {
  //   await this.page.getByRole("row", { name: /Pending/i }).hover();
  // }

  async verifyPendingUser(): Promise<boolean> {
    return await this.page.getByRole("row", { name: /Pending/i }).isVisible();
  }

  async authorizeUser(): Promise<void> {
    const row = this.page.getByRole("row", {
      name: new RegExp(testdata.employeeIdentifiers.Employee_Number),
    });

    await expect(row).toBeVisible();

    const authorizeButton = row.locator("button").nth(1); // second action button
    await expect(authorizeButton).toBeVisible();

    await authorizeButton.click();
  }

  async RejectUser(): Promise<void> {
    await this.page.getByRole("button", { name: "Cancel" }).first().click();
  }
}
