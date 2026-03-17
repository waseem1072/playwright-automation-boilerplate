import { Page, Locator, expect } from "@playwright/test";

export class BranchDeptMappingPage {
  constructor(private readonly page: Page) {}

  async selectBranchDepartmentMappingPage() {
    await this.page
      .getByRole("button", { name: "Branch Department Mapping" })
      .click();
  }
  async selectAssignDepttoBranch() {
    // Click the Branch dropdown to expand options
    await this.page.locator("#root_branchId").click();
  }

  async IsListOfAllExpectedBranches() {
    // List of all expected branches
    const expectedBranches = [
      "Head Office - 999-HO",
      "Matara - Matara",
      "Galle - Galle",
      "Kandy - Kandy",
      "Matale - Matale",
      "Nuwara-Eliya - Nuwara-Eliya",
      "Trincomalee - Trincomalee",
      "Batticaloa - Batticaloa",
      "Ampara - Ampara",
      "Jaffna - Jaffna",
      "Kilinochchi - Kilinochchi",
      "Mannar - Mannar",
      "Mullaitivu - Mullaitivu",
      "Vavniya - Vavniya",
      "Colombo - 001",
      "Gampaha - 002",
      "Kalutara001 - Kalutara",
      "Kurunegala - Kurunegala",
      "Puttalama - Puttalama",
      "Polonnaruwa - Polonnaruwa",
      "Anuradhapura - Anuradhapura",
      "Badulla - Badulla",
      "Moneragala - Moneragala",
      "Ratnapura - 056",
      "Kegalle - 028",
      "Hambantota - Hambantota",
    ];

    // Iterate and verify each branch is visible
    for (const branch of expectedBranches) {
      await this.page
        .getByRole("option", { name: branch })
        .scrollIntoViewIfNeeded();
      await expect(
        this.page.getByRole("option", { name: branch }),
      ).toBeVisible();
    }
  }

  async selectABranch() {
    const galleOption = this.page.getByRole("option", { name: "Kandy - Kandy" });
    await galleOption.click();
  }

async verifyBranchInTable(branchName: string) {
    // Pick the first table cell matching the branch name
    const cell = this.page.getByRole('cell', { name: branchName }).first();

    // Verify it's visible
    await expect(cell).toBeVisible();
}


async verifyAllBranchOccurrences(branchName: string) {
    const cells = this.page.getByRole('cell', { name: branchName });
    const count = await cells.count();

    for (let i = 0; i < count; i++) {
      await expect(cells.nth(i)).toBeVisible();
    }
  }

}
