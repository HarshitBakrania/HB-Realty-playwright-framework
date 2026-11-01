import { test } from "../../fixtures/base.fixtures";
import { expect } from "@playwright/test";

test("create a new account", async ({ signUpPage, page }) => {
  await signUpPage.goto();
  const testUser = Math.random() * 100;
  await signUpPage.signUp(
    `testuser${testUser}`,
    `testuser${testUser}@test.com`,
    `testuser${testUser}`,
  );
  await expect(page).toHaveURL("/");
});

test("creating a user with an existing account", async ({ signUpPage }) => {
  await signUpPage.goto();
  await signUpPage.signUp("example01", "example01@test.com", "example01");
  await signUpPage.expectError();
});
