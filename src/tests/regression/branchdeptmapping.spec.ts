import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { credentials } from "../resources/credentials";
import { testdata } from "../resources/testdata";
import { emplyeedata } from "../resources/emplyeedata";
import { NavBarPage } from "../../pages/navbar.page";
import { BranchDeptMappingPage } from "../../pages/branchdeptmapping.page";

test.describe("Branch Dept Mapping", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test(
    "Verify Branch Dept/Div Mapping page loads successfully",
    { tag: ["@regression", "@TC_001", "@positive"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      const pageHeader = page.getByRole("heading", {
        name: "Branch - Dept/Div Mapping",
        level: 3,
      });
      await expect(pageHeader).toBeVisible();
    },
  );

  test(
    "Verify Branch dropdown displays available branches",
    { tag: ["@regression", "@TC_002", "@positive"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      await branchDeptMappingPage.selectAssignDepttoBranch();
      await branchDeptMappingPage.IsListOfAllExpectedBranches();
    },
  );

  test(
    "Verify selecting a branch loads mapped Dept/Div records",
    { tag: ["@regression", "@TC_003", "@positive"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      await branchDeptMappingPage.selectAssignDepttoBranch();
      await branchDeptMappingPage.selectABranch();
      await branchDeptMappingPage.verifyBranchInTable(testdata.Branch.Branch);
    },
  );

  test(
    "Verify Branch Details grid columns are displayed correctly",
    { tag: ["@regression", "@TC_004", "@positive"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      await branchDeptMappingPage.selectAssignDepttoBranch();
      await branchDeptMappingPage.selectABranch();
      await branchDeptMappingPage.verifyAllBranchOccurrences(testdata.Branch.Branch);
    },
  );

  test(
    "Verify page title and breadcrumb display",
    { tag: ["@regression", "@TC_020", "@UI"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      const pageHeader = page.getByRole("heading", {
        name: "Branch - Dept/Div Mapping",
        level: 3,
      });
      await expect(pageHeader).toBeVisible();

      const BranchDepartmentMapping = page.locator(
        "//main[@class='jss11 jss13']",
      );

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await BranchDepartmentMapping.screenshot({
        mask: [
          page.locator("footer"),
          page.locator("Branch Department Mapping.png"),
        ],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot(
        "Branch Department Mapping.png",
        {
          maxDiffPixelRatio: 0.02,
        },
      );
    },
  );

  test(
    "Verify left navigation menu highlighting",
    { tag: ["@regression", "@TC_021", "@UI"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      const pageHeader = page.getByRole("heading", {
        name: "Branch - Dept/Div Mapping",
        level: 3,
      });
      await expect(pageHeader).toBeVisible();

      const BranchDepartmentMapping = page.locator(
        "//main[@class='jss11 jss13']",
      );

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await BranchDepartmentMapping.screenshot({
        mask: [
          page.locator("footer"),
          page.locator("Branch Department Mapping.png"),
        ],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot(
        "Branch Department Mapping.png",
        {
          maxDiffPixelRatio: 0.02,
        },
      );
    },
  );

  test(
    "Verify Branch dropdown label and alignment",
    { tag: ["@regression", "@TC_022", "@UI"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      const pageHeader = page.getByRole("heading", {
        name: "Branch - Dept/Div Mapping",
        level: 3,
      });
      await expect(pageHeader).toBeVisible();

      const BranchDepartmentMapping = page.locator(
        "//main[@class='jss11 jss13']",
      );

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await BranchDepartmentMapping.screenshot({
        mask: [
          page.locator("footer"),
          page.locator("Branch Department Mapping.png"),
        ],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot(
        "Branch Department Mapping.png",
        {
          maxDiffPixelRatio: 0.02,
        },
      );
    },
  );

  test(
    "Verify Branch Details section visibility",
    { tag: ["@regression", "@TC_023", "@UI"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      const pageHeader = page.getByRole("heading", {
        name: "Branch - Dept/Div Mapping",
        level: 3,
      });
      await expect(pageHeader).toBeVisible();

      const BranchDepartmentMapping = page.locator(
        "//main[@class='jss11 jss13']",
      );

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await BranchDepartmentMapping.screenshot({
        mask: [
          page.locator("footer"),
          page.locator("Branch Department Mapping.png"),
        ],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot(
        "Branch Department Mapping.png",
        {
          maxDiffPixelRatio: 0.02,
        },
      );
    },
  );

  test(
    "Verify grid column headers alignment",
    { tag: ["@regression", "@TC_024", "@UI"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      const pageHeader = page.getByRole("heading", {
        name: "Branch - Dept/Div Mapping",
        level: 3,
      });
      await expect(pageHeader).toBeVisible();

      const BranchDepartmentMapping = page.locator(
        "//main[@class='jss11 jss13']",
      );

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await BranchDepartmentMapping.screenshot({
        mask: [
          page.locator("footer"),
          page.locator("Branch Department Mapping.png"),
        ],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot(
        "Branch Department Mapping.png",
        {
          maxDiffPixelRatio: 0.02,
        },
      );
    },
  );

  test(
    "Verify modal title and layout",
    { tag: ["@regression", "@TC_025", "@UI"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      const pageHeader = page.getByRole("heading", {
        name: "Branch - Dept/Div Mapping",
        level: 3,
      });
      await expect(pageHeader).toBeVisible();

      const BranchDepartmentMapping = page.locator(
        "//main[@class='jss11 jss13']",
      );

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await BranchDepartmentMapping.screenshot({
        mask: [
          page.locator("footer"),
          page.locator("Branch Department Mapping.png"),
        ],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot(
        "Branch Department Mapping.png",
        {
          maxDiffPixelRatio: 0.02,
        },
      );
    },
  );

  test(
    "Verify Dept/Div dropdown label and spacing",
    { tag: ["@regression", "@TC_026", "@UI"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      const pageHeader = page.getByRole("heading", {
        name: "Branch - Dept/Div Mapping",
        level: 3,
      });
      await expect(pageHeader).toBeVisible();

      const BranchDepartmentMapping = page.locator(
        "//main[@class='jss11 jss13']",
      );

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await BranchDepartmentMapping.screenshot({
        mask: [
          page.locator("footer"),
          page.locator("Branch Department Mapping.png"),
        ],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot(
        "Branch Department Mapping.png",
        {
          maxDiffPixelRatio: 0.02,
        },
      );
    },
  );

  test(
    "Verify Save and Cancel button alignment",
    { tag: ["@regression", "@TC_027", "@UI"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      const pageHeader = page.getByRole("heading", {
        name: "Branch - Dept/Div Mapping",
        level: 3,
      });
      await expect(pageHeader).toBeVisible();

      const BranchDepartmentMapping = page.locator(
        "//main[@class='jss11 jss13']",
      );

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await BranchDepartmentMapping.screenshot({
        mask: [
          page.locator("footer"),
          page.locator("Branch Department Mapping.png"),
        ],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot(
        "Branch Department Mapping.png",
        {
          maxDiffPixelRatio: 0.02,
        },
      );
    },
  );

  test(
    "Verify Save button color and emphasis",
    { tag: ["@regression", "@TC_028", "@UI"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickOnTheBranchDeptMappingPage();
      const branchDeptMappingPage = new BranchDeptMappingPage(page);
      await branchDeptMappingPage.selectBranchDepartmentMappingPage();
      const pageHeader = page.getByRole("heading", {
        name: "Branch - Dept/Div Mapping",
        level: 3,
      });
      await expect(pageHeader).toBeVisible();

      const BranchDepartmentMapping = page.locator(
        "//main[@class='jss11 jss13']",
      );

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await BranchDepartmentMapping.screenshot({
        mask: [
          page.locator("footer"),
          page.locator("Branch Department Mapping.png"),
        ],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot(
        "Branch Department Mapping.png",
        {
          maxDiffPixelRatio: 0.02,
        },
      );
    },
  );
});
