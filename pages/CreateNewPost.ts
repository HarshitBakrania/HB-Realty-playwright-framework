import { Locator, Page } from "@playwright/test";
export interface CreateNewPostInterface {
  title: string;
  price: string;
  address: string;
  city: string;
  bedroom: string;
  bathroom: string;
  type: "Buy" | "Rent";
  property: "Apartment" | "House" | "Land";
  size: string;
  latitude: string;
  longitude: string;
  school?: string;
  hospital?: string;
  restaurant?: string;
  description?: string;
}
export class CreateNewPost {
  titleInput: Locator;
  priceInput: Locator;
  addressInput: Locator;
  cityInput: Locator;
  bedroomInput: Locator;
  bathroomInput: Locator;
  typeSelect: Locator;
  propertySelect: Locator;
  sizeInput: Locator;
  latitudeInput: Locator;
  longitudeInput: Locator;
  schoolInput: Locator;
  hospitalInput: Locator;
  restaurantInput: Locator;
  descriptionEditor: Locator;
  submitButton: Locator;

  constructor(private page: Page) {
    this.titleInput = page.locator('input[name="title"]');
    this.priceInput = page.locator('input[name="price"]');
    this.addressInput = page.locator('input[name="address"]');
    this.cityInput = page.locator('input[name="city"]');
    this.bedroomInput = page.locator('input[name="bedroom"]');
    this.bathroomInput = page.locator('input[name="bathroom"]');
    this.typeSelect = page.locator('select[name="type"]');
    this.propertySelect = page.locator('select[name="property"]');
    this.sizeInput = page.locator('input[name="size"]');
    this.latitudeInput = page.locator('input[name="latitude"]');
    this.longitudeInput = page.locator('input[name="longitude"]');
    this.schoolInput = page.locator('input[name="school"]');
    this.hospitalInput = page.locator('input[name="hospital"]');
    this.restaurantInput = page.locator('input[name="restaurant"]');
    this.descriptionEditor = page.locator(".ql-editor");
    this.submitButton = page.getByRole("button", { name: "Add" });
  }
  async goto() {
    await this.page.goto("/posts/create");
  }
  async createPost(data: CreateNewPostInterface) {
    await this.titleInput.fill(data.title);
    await this.priceInput.fill(data.price);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.bedroomInput.fill(data.bedroom);
    await this.bathroomInput.fill(data.bathroom);
    await this.typeSelect.selectOption(data.type);
    await this.propertySelect.selectOption(data.property);
    await this.sizeInput.fill(data.size);
    await this.latitudeInput.fill(data.latitude);
    await this.longitudeInput.fill(data.longitude);
    if (data.school) await this.schoolInput.fill(data.school);
    if (data.hospital) await this.hospitalInput.fill(data.hospital);
    if (data.restaurant) await this.restaurantInput.fill(data.restaurant);
    if (data.description) await this.descriptionEditor.fill(data.description);
    await this.submitButton.click();
  }
}
