import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { credentials } from "../resources/credentials";
import { NavBarPage } from "../../pages/navbar.page";
import { EmployeeApprovePage } from "../../pages/employee.approve.page";
import { testdata } from "../resources/testdata";
import { UserAuthorization } from "../../pages/user.authorization.page";
import { UserManagementPage } from "../../pages/user.management.page";
import { emplyeedata } from "../resources/emplyeedata";
import { ResetPasswordPage } from "../../pages/forgot.password.page";

test.describe("employee approval test", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test(
    "Verify Reset Password page loads successfully",
    { tag: ["@regression", "@TC_1", "@Positive"] },
    async ({ page }) => {
      await loginPage.loginPage("", "");
      const resetPasswordPage = new ResetPasswordPage(page);
      await resetPasswordPage.clickChangePassword();
      await expect(
        page.getByText("Forgot Password", { exact: true }).first(),
      ).toBeVisible();
    },
  );

  test(
    "Verify successful password reset using valid User ID and registered email",
    { tag: ["@regression", "@TC_2", "@Positive"] },
    async ({ page }) => {
      await loginPage.loginPage("", "");
      const resetPasswordPage = new ResetPasswordPage(page);
      await resetPasswordPage.clickChangePassword();
      await expect(
        page.getByText("Forgot Password", { exact: true }).first(),
      ).toBeVisible();
      await resetPasswordPage.fillUserName(emplyeedata.user4.username)
      await resetPasswordPage.fillEmail(emplyeedata.user4.email)
      await resetPasswordPage.fillcontactNumber(emplyeedata.user4.contactNumber)
      await resetPasswordPage.resetPasswordButton();

    },
  );
});
