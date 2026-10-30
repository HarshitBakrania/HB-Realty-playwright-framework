import { Locator, Page } from "@playwright/test";

export class NavBar {
  buyLink: Locator;
  rentLink: Locator;
  contactLink: Locator;
  aboutLink: Locator;
  loginButton: Locator;
  messagesLink: Locator;
  profileLink: Locator;
  logo: Locator;
  avatar: Locator;
  messagesIcon: Locator;

  constructor(private page: Page) {
    this.logo = page.getByAltText("logo");
    this.buyLink = page.getByRole("navigation").getByText("Buy");
    this.rentLink = page.getByRole("navigation").getByText("Rent");
    this.contactLink = page.getByRole("navigation").getByText("Contact");
    this.aboutLink = page.getByRole("navigation").getByText("About");
    this.loginButton = page.getByRole("navigation").getByText("Login");
    this.avatar = page.getByAltText("avatar");
    this.messagesIcon = page.getByRole("button").filter({ hasText: /^$/ });
  }

  async clickBuy() {
    await this.buyLink.click();
  }
  async clickRent() {
    await this.rentLink.click();
  }
  async clickLogin() {
    await this.loginButton.click();
  }

  async clickLogo() {
    await this.logo.click();
  }

  async clickAvatar() {
    await this.avatar.click();
  }

  async clickMessages() {
    await this.messagesIcon.click();
  }
}
