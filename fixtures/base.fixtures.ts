import { test as base, expect, Page } from "@playwright/test";
import { SignInPage } from "../pages/SignInPage";
import { SignUpPage } from "../pages/SignUpPage";
import { HomePage } from "../pages/HomePage";
import { ListPage } from "../pages/ListPage";
import { PropertyPage } from "../pages/PropertyPage";
import fs from "fs";
import { UserPage } from "../pages/UserPage";
import { CreateNewPost } from "../pages/CreateNewPost";

export const test = base.extend<{
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  homePage: HomePage;
  listPage: ListPage;
  authPropertyPage: PropertyPage;
  authenticatedPage: Page;
  userPage: UserPage;
  createNewPost: CreateNewPost;
}>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  listPage: async ({ page }, use) => {
    await use(new ListPage(page));
  },
  authenticatedPage: async ({ browser }, use) => {
    const authFile = "auth/testuser002.json";
    if (!fs.existsSync(authFile)) {
      const setupContext = await browser.newContext();
      const setupPage = await setupContext.newPage();
      await setupPage.goto("/signin");
      await setupPage
        .getByPlaceholder("Enter your username")
        .fill("testuser002");
      await setupPage
        .getByPlaceholder("Enter your password")
        .fill("testuser002");
      await setupPage.getByRole("button", { name: "Sign In" }).click();
      await setupPage.waitForURL("/");
      await setupContext.storageState({ path: "auth/testuser002.json" });
      await setupContext.close();
    }

    const context = await browser.newContext({
      storageState: authFile,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  authPropertyPage: async ({ authenticatedPage }, use) => {
    await use(new PropertyPage(authenticatedPage));
  },
  userPage: async ({ authenticatedPage }, use) => {
    await use(new UserPage(authenticatedPage));
  },
  createNewPost: async ({ authenticatedPage }, use) => {
    await use(new CreateNewPost(authenticatedPage));
  },
});
