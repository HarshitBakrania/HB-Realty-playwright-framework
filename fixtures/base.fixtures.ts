import { test as base } from "@playwright/test";
import { SignInPage } from "../pages/SignInPage";
import { SignUpPage } from "../pages/SignUpPage";
import { HomePage } from "../pages/HomePage";
import { ListPage } from "../pages/ListPage";

export const test = base.extend<{
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  homePage: HomePage;
  listPage: ListPage;
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
});
