import { Page, Locator, expect } from "@playwright/test";

export class NavBarPage {
  constructor(private readonly page: Page) {}

  async clickUserManagement(): Promise<void> {
    await this.page.getByRole("button", { name: "User Management" }).click();
  }

  async navigateToAssignMultipleBranches(): Promise<void> {
    await this.page
      .getByRole("button", { name: "Assign Multiple Branches" })
      .click();
  }

  async navigateToUserPage(): Promise<void> {
    await this.page.getByRole("button", { name: "Users" }).click();
  }

  async clickMenuActionList(): Promise<void> {
    await this.page.getByRole("button", { name: "Menu Action List" }).click();
  }

  async clickRoleRestriction(): Promise<void> {
    await this.page.getByRole("button", { name: "Role Restrictions" }).click();
  }

  async clickUserAuthorization(): Promise<void> {
    await this.page.getByRole("button", { name: "User Authorization" }).click();
  }

  async navigateUserRestrictions(): Promise<void> {
    await this.page.getByRole("button", { name: "User Restriction" }).click();
  }

  async clickRoleCreation(): Promise<void> {
    await this.page.getByRole("button", { name: "Role Creation" }).click();
  }

  async openHrmsModule(): Promise<void> {
    const HrmsPage = this.page.getByText("HRMS", { exact: true });
    await HrmsPage.click();
  }

  async clickActivateEmployeeAccount(): Promise<void> {
    await this.page
      .getByRole("button", { name: "Activate Employee Account" })
      .click();
  }

  async clickProfileButton(): Promise<void> {
    const menuButton = this.page.getByRole("button", { name: "menu" }).nth(1);

    await expect(menuButton).toBeVisible();
    await menuButton.click();
  }

  async clickChangePassword(): Promise<void> {
    await this.page.getByRole("menuitem", { name: "Change Password" }).click();
  }

  async clickOnTheBranchDeptMappingPage(): Promise<void> {
    await this.page.getByRole("button", { name: "Parameters" }).click();
  }
}
