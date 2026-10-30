import { Locator, Page } from "@playwright/test";

export class UpdateUserProfile {
  usernameInput: Locator;
  emailInput: Locator;
  passwordInput: Locator;
  uploadImageButton: Locator;
  updateProfileButton: Locator;

  constructor(private page: Page) {
    this.usernameInput = page.getByPlaceholder("john");
    this.emailInput = page.getByPlaceholder("john@example.com");
    this.passwordInput = page.getByPlaceholder("*********");
    this.uploadImageButton = page.getByRole("button", { name: "Upload Image" });
    this.updateProfileButton = page.getByRole("button", {
      name: "Update Profile",
    });
  }

  
}
