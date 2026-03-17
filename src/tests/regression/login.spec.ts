import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { credentials } from "../resources/credentials";
import { testdata } from "../resources/testdata";
import { emplyeedata } from "../resources/emplyeedata";

test.describe("Login Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test(
    "Verify successful login with correct User ID, Password, and Location",
    { tag: ["@regression", "@TC_1", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.admin2.username, credentials.admin2.password);
      await page.waitForLoadState("networkidle");
      await expect(
        page.locator("main").getByText("Dashboard", { exact: true }),
      ).toBeVisible();
    },
  );

  test(
    "Verify multiple location selection",
    { tag: ["@regression", "@TC_2", "@positive"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin1.username, credentials.admin1.password
      );
      await loginPage.SelectYourBranch(testdata.restrictionConfiguration.location);
      await page.waitForLoadState("networkidle");
      await expect(
        page.locator("main").getByText("Dashboard", { exact: true }),
      ).toBeVisible();
    },
  );

  test(
    "Verify first-time login redirects to change password",
    { tag: ["@regression", "@TC_3", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.admin2.username, credentials.admin2.password);
      await loginPage.loginWithchangePassword(emplyeedata.user1.password,emplyeedata.user2.password,emplyeedata.user3.password);
      await page.waitForLoadState("networkidle");
      await expect(page.getByText('Sign in').first()).toBeDisabled();
    },
  );

  test(
    "Verify login with invalid User ID",
    { tag: ["@regression", "@TC_7", "@negative"] },
    async ({ page }) => {
      await loginPage.login("invalid", credentials.admin2.password);
      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("alert")).toContainText("USER NOT FOUND");
    },
  );

test(
  "Verify login with invalid Password",
  { tag: ["@regression", "@TC_8", "@negative"] },
  async ({ page }) => {
    await loginPage.login(credentials.admin2.username, "invalid");

    const alert = page.getByRole("alert");

    await expect(alert).toBeVisible();
    await expect(alert).toContainText(
      /AUTHENTICATION_FAILED|INVALID_CREDENTIALS|Invalid username or password/
    );
  },
);

  test(
    "Verify login with blank credentials",
    { tag: ["@regression", "@TC_9", "@negative"] },
    async ({ page }) => {
      await loginPage.login("", "");
      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("alert")).toContainText(
        "USER NOT FOUNDNo user found for the provided username. ",
      );
    },
  );

  test(
    "Verify login with expired password",
    { tag: ["@regression", "@TC_11", "@negative"] },
    async ({ page }) => {
      await loginPage.login(
        emplyeedata.expiredUser.username,
        emplyeedata.expiredUser.password,
      );
      await page.waitForLoadState("networkidle");
      await expect(page.getByText("Your password has expired")).toBeVisible();
    },
  );

  test(
    "Verify lockout after multiple failed attempts",
    { tag: ["@regression", "@TC_14", "@negative"] },
    async ({ page }) => {
      const maxAttempts = 3;

      for (let i = 0; i < maxAttempts; i++) {
        await loginPage.login(credentials.admin2.username, "invalid");

        const alert = page.getByRole("alert");
        await expect(alert).toBeVisible();
        await expect(alert).toContainText(
          "AUTHENTICATION_FAILEDEntered credentials are invalid ",
        );
      }

      // Final attempt should show lockout message
      await loginPage.login(credentials.admin2.username, "invalid");

      await expect(page.getByRole("alert")).toContainText(
        "AUTHENTICATION_FAILEDEntered credentials are invalid ",
      );
    },
  );

  test(
    "Verify the login page UI",
    { tag: ["@regression", "@TC_15", "@UI"] },
    async ({ page }) => {
      await loginPage.loginPage("", "");

      const loginContainer = page.locator("div.loginPage");

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await loginContainer.screenshot({
        mask: [page.locator("footer"), page.locator("img.dynamicLogo")],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot("loginPage.png", {
        maxDiffPixelRatio: 0.02,
      });
    },
  );

  test(
    "Verify font consistency",
    { tag: ["@regression", "@TC_16", "@UI"] },
    async ({ page }) => {
      await loginPage.loginPage("", "");

      const loginContainer = page.locator("div.loginPage");

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await loginContainer.screenshot({
        mask: [page.locator("footer"), page.locator("img.dynamicLogo")],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot("loginPage.png", {
        maxDiffPixelRatio: 0.02,
      });
    },
  );

    test(
    "Verify focus highlighting",
    { tag: ["@regression", "@TC_17", "@UI"] },
    async ({ page }) => {
      await loginPage.loginPage("", "");

      const loginContainer = page.locator("div.loginPage");

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await loginContainer.screenshot({
        mask: [page.locator("footer"), page.locator("img.dynamicLogo")],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot("loginPage.png", {
        maxDiffPixelRatio: 0.02,
      });
    },
  );

    test(
    "Verify incorrect credentials UI",
    { tag: ["@regression", "@TC_18", "@UI"] },
    async ({ page }) => {
      await loginPage.login(credentials.admin2.username, "invalid");

      const loginContainer = page.locator("div.loginPage");

      // Mask dynamic elements like footer, timestamps, or logos
      const screenshotBuffer = await loginContainer.screenshot({
        mask: [page.locator("footer"), page.locator("div.loginPage")],
      });

      // Allow a small tolerance for minor pixel differences
      expect(screenshotBuffer).toMatchSnapshot("InValidloginPage-chromium-win32.png", {
        maxDiffPixelRatio: 0.02,
      });
    },
  );
});
