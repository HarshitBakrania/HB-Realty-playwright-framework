import { test, expect } from "@playwright/test";
import { SignUpPage } from "../../pages/SignUpPage";

test("create a new account", async ({ page }) => {
  const signUp = new SignUpPage(page);
  await signUp.goto();
  await signUp.signUp("example03", "example03@test.com", "example03");
  await expect(page).toHaveURL("/");
});

test("creating a user with an existing account", async ({ page }) => {
  const signUp = new SignUpPage(page);
  await signUp.goto();
  await signUp.signUp("example01", "example01@test.com", "example01");
  await signUp.expectError();
});
