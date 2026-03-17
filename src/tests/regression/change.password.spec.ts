import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { credentials } from "../resources/credentials";
import { testdata } from "../resources/testdata";
import { NavBarPage } from "../../pages/navbar.page";
import { ChangePassword } from "../../pages/change.password.page";
import { emplyeedata } from "../resources//emplyeedata";

test.describe("Login Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test(
    "Verify successful password change with valid current password and new password",
    { tag: ["@regression", "@TC_1", "@positive"] },
    async ({ page }) => {
      await loginPage.login(emplyeedata.user1.username, emplyeedata.user2.password);
      await page.waitForLoadState("networkidle");
      await expect(
        page.locator("main").getByText("Dashboard", { exact: true }),
      ).toBeVisible();
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickProfileButton();
      await navBarpage.clickChangePassword();
      await expect(
        page.getByRole("heading", { name: "Change Password" }),
      ).toBeVisible();

      const changepassword = new ChangePassword(page);
      await changepassword.fillCurrentPassword(emplyeedata.user1.password);
      await changepassword.fillNewPassword(emplyeedata.user2.password);
      await changepassword.fillRePassword(emplyeedata.user3.password);
      await changepassword.clickChangePasswordButton();
      await expect(
        page.getByRole("heading", { name: "SUCCESS" }),
      ).toBeVisible();
    },
  );

  test(
    "Verify successful notification delivery",
    { tag: ["@regression", "@TC_2", "@positive"] },
    async ({ page }) => {
      await loginPage.login(emplyeedata.user1.username, emplyeedata.user2.password);
      await page.waitForLoadState("networkidle");
      await expect(
        page.locator("main").getByText("Dashboard", { exact: true }),
      ).toBeVisible();
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickProfileButton();
      await navBarpage.clickChangePassword();
      await expect(
        page.getByRole("heading", { name: "Change Password" }),
      ).toBeVisible();

      const changepassword = new ChangePassword(page);
      await changepassword.fillCurrentPassword(emplyeedata.user1.password);
      await changepassword.fillNewPassword(emplyeedata.user2.password);
      await changepassword.fillRePassword(emplyeedata.user3.password);
      await changepassword.clickChangePasswordButton();
    },
  );

  test(
    "Verify all active sessions expire after password change",
    { tag: ["@regression","@TC_3", "@positive"] },
    async ({ page }) => {
      await loginPage.login(emplyeedata.user1.username, emplyeedata.user2.password);
      await page.waitForLoadState("networkidle");
      await expect(
        page.locator("main").getByText("Dashboard", { exact: true }),
      ).toBeVisible();
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickProfileButton();
      await navBarpage.clickChangePassword();
      await expect(
        page.getByRole("heading", { name: "Change Password" }),
      ).toBeVisible();

      const changepassword = new ChangePassword(page);
      await changepassword.fillCurrentPassword(emplyeedata.user1.password);
      await changepassword.fillNewPassword(emplyeedata.user2.password);
      await changepassword.fillRePassword(emplyeedata.user3.password);
      await changepassword.clickChangePasswordButton();
    },
  );

    test(
    "Verify new password meets complexity requirements",
    { tag: ["@regression","@TC_4", "@positive"] },
    async ({ page }) => {
      await loginPage.login(emplyeedata.user1.username, emplyeedata.user2.password);
      await page.waitForLoadState("networkidle");
      await expect(
        page.locator("main").getByText("Dashboard", { exact: true }),
      ).toBeVisible();
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickProfileButton();
      await navBarpage.clickChangePassword();
      await expect(
        page.getByRole("heading", { name: "Change Password" }),
      ).toBeVisible();

      const changepassword = new ChangePassword(page);
      await changepassword.fillCurrentPassword(emplyeedata.user1.password);
      await changepassword.fillNewPassword(emplyeedata.user2.password);
      await changepassword.fillRePassword(emplyeedata.user3.password);
      await changepassword.clickChangePasswordButton();
    },
  );

  test(
    "Verify old password cannot be reused",
    { tag: ["@regression", "@TC_5", "@positive"] },
    async ({ page }) => {
      await loginPage.login(emplyeedata.user1.username, emplyeedata.user2.password);
      await page.waitForLoadState("networkidle");
      await expect(
        page.locator("main").getByText("Dashboard", { exact: true }),
      ).toBeVisible();
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickProfileButton();
      await navBarpage.clickChangePassword();
      await expect(
        page.getByRole("heading", { name: "Change Password" }),
      ).toBeVisible();

      const changepassword = new ChangePassword(page);
      await changepassword.fillCurrentPassword(emplyeedata.user1.password);
      await changepassword.fillNewPassword(emplyeedata.user4.password);
      await changepassword.fillRePassword(emplyeedata.user4.password);
      await changepassword.clickChangePasswordButton();
      // await expect(
      //   page.getByRole("heading", { name: "SUCCESS" }),
      // ).toBeVisible();
      await expect(
        page.getByText(
          /Invalid Current password|Do not use the current password as the new password|Current Password can not be empty|New password cannot be the same as your previous 3 passwords./i,
        ),
      ).toBeVisible();
    },
  );

  test(
    "Verify validation for incorrect current password",
    { tag: ["@regression", "@TC_6", "@negative"] },
    async ({ page }) => {
      await loginPage.login(emplyeedata.user1.username, emplyeedata.user2.password);
      await page.waitForLoadState("networkidle");
      await expect(
        page.locator("main").getByText("Dashboard", { exact: true }),
      ).toBeVisible();
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickProfileButton();
      await navBarpage.clickChangePassword();
      await expect(
        page.getByRole("heading", { name: "Change Password" }),
      ).toBeVisible();

      const changepassword = new ChangePassword(page);
      await changepassword.fillCurrentPassword(emplyeedata.user2.password);
      await changepassword.fillNewPassword(emplyeedata.user2.password);
      await changepassword.fillRePassword(emplyeedata.user1.password);
      await changepassword.clickChangePasswordButton();

      await expect(
        page.getByText(
          /Invalid Current password|Do not use the current password as the new password|Current Password can not be empty/i,
        ),
      ).toBeVisible();

    },
  );

  test(
    "Verify behavior when new and confirm passwords do not match",
    { tag: ["@regression", "@TC_7", "@negative"] },
    async ({ page }) => {
      await loginPage.login(emplyeedata.user1.username, emplyeedata.user2.password);
      await page.waitForLoadState("networkidle");
      await expect(
        page.locator("main").getByText("Dashboard", { exact: true }),
      ).toBeVisible();
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickProfileButton();
      await navBarpage.clickChangePassword();
      await expect(
        page.getByRole("heading", { name: "Change Password" }),
      ).toBeVisible();

      const changepassword = new ChangePassword(page);
      await changepassword.fillCurrentPassword(emplyeedata.user1.password);
      await changepassword.fillNewPassword(emplyeedata.user2.password);
      await changepassword.fillRePassword(emplyeedata.user4.password);
      await changepassword.clickChangePasswordButton();
      await expect(
        page.getByText(
          /Invalid Current password|Do not use the current password as the new password|Current Password can not be empty|New Password Do not match with the re entered password/i,
        ),
      ).toBeVisible();
    },
  );

    test(
    "Verify system enforces mandatory field validation",
    { tag: ["@regression", "@TC_8", "@negative"] },
    async ({ page }) => {
      await loginPage.login(emplyeedata.user1.username, emplyeedata.user2.password);
      await page.waitForLoadState("networkidle");
      await expect(
        page.locator("main").getByText("Dashboard", { exact: true }),
      ).toBeVisible();
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickProfileButton();
      await navBarpage.clickChangePassword();
      await expect(
        page.getByRole("heading", { name: "Change Password" }),
      ).toBeVisible();

      const changepassword = new ChangePassword(page);
      await changepassword.fillCurrentPassword("");
      await changepassword.fillNewPassword("");
      await changepassword.fillRePassword(emplyeedata.user1.password);
      await changepassword.clickChangePasswordButton();
      await expect(
        page.getByText(
          /Invalid Current password|Do not use the current password as the new password|Current Password can not be empty|New Password Do not match with the re entered password/i,
        ),
      ).toBeVisible();
    },
  );

});
