import { test, expect } from "@playwright/test";
import { SignInPage } from "../../pages/SignInPage";

test.describe("Sign in", () => {
  let signIn: SignInPage;

  test.beforeEach(async ({ page }) => {
    signIn = new SignInPage(page);
    await signIn.goto();
  });

  test("user can sign in with valid credentials", async ({ page }) => {
    await signIn.login("testuser003", "testuser003");
    await expect(page).toHaveURL("/");
  });

  test("shows error for invalid credentials", async () => {
    await signIn.login("incorrectUsername", "incorrectPassword");
    await signIn.expectError();
  });
});
