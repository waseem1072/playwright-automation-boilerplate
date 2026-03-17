import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { credentials } from "../resources/credentials";
import { NavBarPage } from "../../pages/navbar.page";
import { EmployeeApprovePage } from "../../pages/employee.approve.page";
import { testdata } from "../resources/testdata";
import { UserAuthorization } from "../../pages/user.authorization.page";
import { UserManagementPage } from "../../pages/user.management.page";
import { emplyeedata } from "../resources/emplyeedata";

test.describe("employee approval test", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test(
    "Verify employee approve",
    { tag: ["@regression", "@positive"] },
    async ({ page }) => {
      await loginPage.login(emplyeedata.user1.username, emplyeedata.user1.password);
      await page.waitForLoadState("networkidle");
      const navBarpage = new NavBarPage(page);
      await navBarpage.openHrmsModule();
      await navBarpage.clickActivateEmployeeAccount();
      await expect(
        page.getByRole("heading", { name: "Employee Approve" }),
      ).toBeVisible();
      const employeeApprovepage = new EmployeeApprovePage(page);
      await employeeApprovepage.searchEmployeeId(testdata.employeeIdentifiers.Employee_Number);
      await employeeApprovepage.clickApproveButton();
      await expect(page.getByText('Approve Confirm')).toBeVisible();
      await employeeApprovepage.clickApproveConfirm();
      await employeeApprovepage.clickApproveConfirmButton();

    },
  );

    test(
      "Verify assigning a valid user role",
      { tag: ["@regression", "@TC_02", "@positive"] },
      async ({ page }) => {
        await loginPage.login(emplyeedata.user1.username, emplyeedata.user1.password);
        const navBarpage = new NavBarPage(page);
        await navBarpage.clickUserManagement();
        await navBarpage.navigateToUserPage();
        const userManagementPage = new UserManagementPage(page);
        await userManagementPage.clickAddNewUser();
        await userManagementPage.enterLoginID(testdata.employeeIdentifiers.Employee_Number);
        await userManagementPage.clickValidateButton();
        await userManagementPage.enterUserRoleId();
        await userManagementPage.selectUserRoleId(testdata.roleConfiguration.User_Role_Id);
        await userManagementPage.enterSubmitButton();
      },
    );

    test(
        "Verify successful authorization of user",
        { tag: ["@regression","@positive"] },
        async ({ page }) => {
          await loginPage.login(emplyeedata.user1.username, emplyeedata.user1.password);
          const navBarpage = new NavBarPage(page);
          await navBarpage.clickUserManagement();
          const userAuthorization = new UserAuthorization(page);
          await navBarpage.clickUserAuthorization();
          await userAuthorization.searchingUser(testdata.employeeIdentifiers.Employee_Number)
          await userAuthorization.selectUserRole()
          // await expect(page.getByRole("button", { name: "Authorize" })).toBeVisible();
          //await userAuthorization.verifyPendingUser();
          await userAuthorization.authorizeUser();
        },
      );
    
});
