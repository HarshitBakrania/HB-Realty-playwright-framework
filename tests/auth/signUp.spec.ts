import { test } from "../../fixtures/base.fixtures";
import { expect } from "@playwright/test";

test("create a new account", async ({ signUpPage, page }) => {
  await signUpPage.goto();
  await signUpPage.signUp("example04", "example04@test.com", "example04");
  await expect(page).toHaveURL("/");
});

test("creating a user with an existing account", async ({ signUpPage }) => {
  await signUpPage.goto();
  await signUpPage.signUp("example01", "example01@test.com", "example01");
  await signUpPage.expectError();
});
