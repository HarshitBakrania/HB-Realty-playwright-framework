import { expect, Locator, Page } from "@playwright/test";

export class SignInPage {
  usernameLocator: Locator;
  passwordLocator: Locator;
  signInButton: Locator;

  constructor(private page: Page) {
    this.usernameLocator = page.getByPlaceholder("Enter your username");
    this.passwordLocator = page.getByPlaceholder("Enter your password");
    this.signInButton = page.getByRole("button", { name: "Sign In" });
  }

  async goto() {
    await this.page.goto("/signin");
  }

  async login(username: string, password: string) {
    await this.usernameLocator.fill(username);
    await this.passwordLocator.fill(password);
    await this.signInButton.click();
  }

  async expectError() {
    await expect(this.page.getByText("Invalid Credentials")).toBeVisible();
  }
}
