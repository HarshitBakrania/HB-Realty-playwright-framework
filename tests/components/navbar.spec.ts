import { expect } from "@playwright/test";
import { test } from "../../fixtures/base.fixtures";

test.beforeEach("navigate to homepage", async ({ page }) => {
  await page.goto("/");
});

test("navigation links route correctly", async ({ navBar, page }) => {
  await expect(navBar.logo).toBeVisible();
  await navBar.clickLogo();
  await expect(page).toHaveURL("/");

  await expect(navBar.buyLink).toBeVisible();
  await navBar.clickBuy();
  await expect(page).toHaveURL("/list?type=buy");

  await expect(navBar.rentLink).toBeVisible();
  await navBar.clickRent();
  await expect(page).toHaveURL("/list?type=rent");
});

test("unauthenticated user sees Login Button", async ({ navBar, page }) => {
  await expect(navBar.loginButton).toBeVisible();
  await navBar.clickLogin();
  await expect(page).toHaveURL("/signin");
});

test("authenticated user sees avatar and can navigate to profile", async ({
  authenticatedNavBar,
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/");
  await expect(authenticatedNavBar.avatar).toBeVisible();
  await authenticatedNavBar.clickAvatar();
  await expect(authenticatedPage).toHaveURL("/user");
});

test("authenticated user can navigate to messages page", async ({
  authenticatedPage,
  authenticatedNavBar,
}) => {
  await authenticatedPage.goto("/");
  await expect(authenticatedNavBar.messagesIcon).toBeVisible();
  await authenticatedNavBar.clickMessages();
  await expect(authenticatedPage).toHaveURL("/user/messages");
});
