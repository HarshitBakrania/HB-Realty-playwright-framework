import { expect } from "@playwright/test";
import { test } from "../../fixtures/base.fixtures";

test.describe("User Page", () => {
  test("Logout button works", async ({ userPage, authenticatedPage }) => {
    await userPage.goto();
    await userPage.logout();
    await authenticatedPage.waitForURL("/");
  });

  test("Saved posts are present", async ({ userPage, authenticatedPage }) => {
    await userPage.goto();
    await expect(userPage.savedPosts.first()).toBeVisible();
    const count = await userPage.savedPosts.count();
    expect(count).toBeGreaterThan(0);
  });

  test("User is directed to property page on clicking the saved property", async ({
    authenticatedPage,
    userPage,
  }) => {
    await userPage.goto();
    const userPosts = await authenticatedPage.request.get(
      "http://localhost:3000/api/users/userPosts",
    );
    const userPostsJson = await userPosts.json();
    const savedPosts = userPostsJson.savedPosts;
    const firstSavedPostId = savedPosts[0].id;

    await userPage.savedPosts.first().click();
    await expect(authenticatedPage).toHaveURL(`/posts/${firstSavedPostId}`);
  });

  test("Edit user profile", async ({ authenticatedPage, userPage }) => {
    await userPage.goto();
    await userPage.editProfile();
    await expect(authenticatedPage).toHaveURL("/user/update");
  });
});
