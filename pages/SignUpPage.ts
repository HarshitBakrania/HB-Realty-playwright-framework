import { expect, Locator, Page } from "@playwright/test";

export class SignUpPage {
  usernameLocator: Locator;
  passwordLocator: Locator;
  emailLocator: Locator;
  createAccountButton: Locator;
  constructor(private page: Page) {
    this.usernameLocator = page.getByPlaceholder("John_Doe");
    this.passwordLocator = page.getByPlaceholder("Create a strong password");
    this.emailLocator = page.getByPlaceholder("john@example.com");
    this.createAccountButton = page.getByRole("button", {
      name: "Create Account",
    });
  }

  async goto() {
    this.page.goto("/signup");
  }

  async signUp(username: string, email: string, password: string) {
    await this.usernameLocator.fill(username);
    await this.passwordLocator.fill(password);
    await this.emailLocator.fill(email);
    await this.createAccountButton.click();
  }

  async expectError() {
    await expect(this.page.getByText("Failed to create User")).toBeVisible();
  }
}
