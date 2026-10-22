import { expect, Locator, Page } from "@playwright/test";

export class SignUpPage {
  usernameInput: Locator;
  passwordInput: Locator;
  emailInput: Locator;
  createAccountButton: Locator;
  constructor(private page: Page) {
    this.usernameInput = page.getByPlaceholder("John_Doe");
    this.passwordInput = page.getByPlaceholder("Create a strong password");
    this.emailInput = page.getByPlaceholder("john@example.com");
    this.createAccountButton = page.getByRole("button", {
      name: "Create Account",
    });
  }

  async goto() {
    await this.page.goto("/signup");
  }

  async signUp(username: string, email: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.emailInput.fill(email);
    await this.createAccountButton.click();
  }

  async expectError() {
    await expect(this.page.getByText("Failed to create User")).toBeVisible();
  }
}
