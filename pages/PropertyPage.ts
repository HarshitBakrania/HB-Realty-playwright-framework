import { Locator, Page } from "@playwright/test";

export class PropertyPage {
  leaftletMap: Locator;
  propertyTitle: Locator;
  price: Locator;
  propertyType: Locator;
  property: Locator;
  furnished: Locator;
  pets: Locator;
  size: Locator;
  bedrooms: Locator;
  bathrooms: Locator;
  school: Locator;
  hospital: Locator;
  restaurant: Locator;
  ownerName: Locator;
  savePlaceButton: Locator;
  sendMessageButton: Locator;

  constructor(private page: Page) {
    this.leaftletMap = page.locator(".leaflet-container");
    this.propertyTitle = page.locator(".text-2xl");
    this.price = page.getByText(/^\$[\d,]+/);
    this.propertyType = page
      .getByText("Type", { exact: true })
      .locator("+ span");
    this.property = page
      .getByText("Property", { exact: true })
      .locator("+ span");
    this.furnished = page
      .getByText("Furnished", { exact: true })
      .locator("+ span");
    this.pets = page.getByText("Pets", { exact: true }).locator("+ span");
    this.size = page.getByText("Size", { exact: true }).locator("+ div");
    this.bedrooms = page
      .getByText("Bedrooms", { exact: true })
      .locator("+ div");
    this.bathrooms = page
      .getByText("Bathrooms", { exact: true })
      .locator("+ div");
    this.school = page
      .locator("div.justify-between")
      .filter({ hasText: "School" })
      .locator("span")
      .last();
    this.hospital = page
      .locator("div.justify-between")
      .filter({ hasText: "Hospital" })
      .locator("span")
      .last();
    this.restaurant = page
      .locator("div.justify-between")
      .filter({ hasText: "Restaurant" })
      .locator("span")
      .last();
    this.ownerName = page
      .locator("div")
      .filter({ has: page.getByAltText("owner avatar") })
      .first();
    this.savePlaceButton = page.getByRole("button", {
      name: /Save Place|Place is saved/,
    });
    this.sendMessageButton = page.getByRole("button", {
      name: "Send a message",
    });
  }

  async goto(postId: string) {
    await this.page.goto(`/posts/${postId}`);
  }

  async toggleSave() {
    await this.savePlaceButton.click();
  }

  async messageOwner() {
    await this.sendMessageButton.click();
  }
}
