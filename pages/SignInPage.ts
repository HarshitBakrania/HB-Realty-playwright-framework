import { expect, Locator, Page } from "@playwright/test";

export class SignInPage {
  usernameInput: Locator;
  passwordInput: Locator;
  signInButton: Locator;

  constructor(private page: Page) {
    this.usernameInput = page.getByPlaceholder("Enter your username");
    this.passwordInput = page.getByPlaceholder("Enter your password");
    this.signInButton = page.getByRole("button", { name: "Sign In" });
  }

  async goto() {
    await this.page.goto("/signin");
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async expectError() {
    await expect(this.page.getByText("Invalid Credentials")).toBeVisible();
  }
}
