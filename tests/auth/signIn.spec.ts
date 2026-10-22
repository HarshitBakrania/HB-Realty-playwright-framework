import { expect } from "@playwright/test";
import { test } from "../../fixtures/base.fixtures";

test.describe("Sign in", () => {
  test("user can signin with valid credentials", async ({
    signInPage,
    page,
  }) => {
    await signInPage.goto();
    await signInPage.login("testuser002", "testuser002");
    await expect(page).toHaveURL("/");
  });

  test("shows error for invalid credentials", async ({ signInPage }) => {
    await signInPage.goto();
    await signInPage.login("invalidUsername", "invalidPassword");
    await signInPage.expectError();
  });
});
