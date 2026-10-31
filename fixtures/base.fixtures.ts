import { test as base, Browser, expect, Page } from "@playwright/test";
import { SignInPage } from "../pages/SignInPage";
import { SignUpPage } from "../pages/SignUpPage";
import { HomePage } from "../pages/HomePage";
import { ListPage } from "../pages/ListPage";
import { PropertyPage } from "../pages/PropertyPage";
import fs from "fs";
import { UserPage } from "../pages/UserPage";
import { CreateNewPost } from "../pages/CreateNewPost";
import { UpdateUserProfile } from "../pages/UpdateUserProfile";
import { NavBar } from "../pages/components/NavBar";
import { MessagesPage } from "../pages/MessagesPage";

export const ensureAuthUser = async (
  browser: Browser,
  username: string,
  password: string,
) => {
  const authFile = `auth/${username}.json`;

  if (!fs.existsSync(authFile)) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/signin");
    await page.getByPlaceholder("Enter your username").fill(username);
    await page.getByPlaceholder("Enter your password").fill(password);
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForURL("/");
    await context.storageState({ path: authFile });
    await context.close();
  }

  return authFile;
};

export const test = base.extend<{
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  homePage: HomePage;
  listPage: ListPage;
  authPropertyPage: PropertyPage;
  authenticatedPage: Page;
  userPage: UserPage;
  createNewPost: CreateNewPost;
  updateUserProfile: UpdateUserProfile;
  navBar: NavBar;
  authenticatedNavBar: NavBar;
  messagesPage: MessagesPage;
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
    const authFile = await ensureAuthUser(
      browser,
      "testuser002",
      "testuser002",
    );

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
  updateUserProfile: async ({ authenticatedPage }, use) => {
    await use(new UpdateUserProfile(authenticatedPage));
  },
  navBar: async ({ page }, use) => {
    await use(new NavBar(page));
  },
  authenticatedNavBar: async ({ authenticatedPage }, use) => {
    await use(new NavBar(authenticatedPage));
  },
  messagesPage: async ({ authenticatedPage }, use) => {
    await use(new MessagesPage(authenticatedPage));
  },
});
