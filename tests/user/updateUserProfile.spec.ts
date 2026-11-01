import { expect } from "@playwright/test";
import { test } from "../../fixtures/base.fixtures";

test.describe("Updating the user profile", () => {
  test("update profile", async ({ updateUserProfile, authenticatedPage }) => {
    await updateUserProfile.goto();
    await updateUserProfile.updateProfile({ password: "testuser002" });
    await expect(authenticatedPage).toHaveURL("/");
  });

  test("Redirected to login page if user is not signed in", async ({
    page,
  }) => {
    await page.goto("/user/update");
    await expect(page).toHaveURL("/signin");
  });
});
