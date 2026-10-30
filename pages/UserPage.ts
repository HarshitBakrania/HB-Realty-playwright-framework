import { Locator, Page } from "@playwright/test";

export class UserPage {
  newlistingButton: Locator;
  savedPosts: Locator;
  logoutButton: Locator;
  yourListings: Locator;
  username: Locator;
  emailAddress: Locator;
  editProfileButton: Locator;

  constructor(private page: Page) {
    this.newlistingButton = page.getByRole("button", { name: "New Listing" });
    this.logoutButton = page.getByRole("button", { name: "Logout" });
    this.editProfileButton = page.getByRole("button", { name: "Edit Profile" });

    this.savedPosts = page
      .getByText("Saved Posts", { exact: true })
      .locator("..")
      .getByText("View Details →");
  }

  async goto() {
    await this.page.goto("/user");
  }

  async logout() {
    await this.logoutButton.click();
  }

  async editProfile() {
    await this.editProfileButton.click();
  }
}
