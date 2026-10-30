import { Locator, Page } from "@playwright/test";

export interface UpdateUserProfileInterface {
  username?: string;
  password?: string;
  emailAddress?: string;
}
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

  async goto() {
    await this.page.goto("/user/update");
  }

  async updateProfile(info: UpdateUserProfileInterface) {
    if (info.username) {
      await this.usernameInput.fill(info.username);
    }
    if (info.emailAddress) {
      await this.emailInput.fill(info.emailAddress);
    }
    if (info.password) {
      await this.passwordInput.fill(info.password);
    }
    await this.updateProfileButton.click();
  }
}
