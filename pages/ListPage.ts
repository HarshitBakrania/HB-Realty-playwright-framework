import { Locator, Page } from "@playwright/test";

export interface ListCriteria {
  location?: string;
  type?: "Any" | "Buy" | "Rent";
  property?: "Any" | "Apartment" | "House" | "Land";
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
}

export class ListPage {
  locationInput: Locator;
  typeDropDown: Locator;
  propertyDropDown: Locator;
  minPriceInput: Locator;
  maxPriceInput: Locator;
  bedroomsInput: Locator;
  searchButton: Locator;
  leafletMap: Locator;
  mapZoomInButton: Locator;
  mapZoomOutButton: Locator;
  propertyCards: Locator;
  noPropertiesFound: Locator;

  constructor(private page: Page) {
    this.locationInput = page.getByPlaceholder("City name…");
    this.typeDropDown = page.locator(`select[name="type"]`);
    this.propertyDropDown = page.locator(`select[name="property"]`);
    this.minPriceInput = page.getByPlaceholder("0", { exact: true });
    this.maxPriceInput = page.getByPlaceholder("1,000,000", { exact: true });
    this.bedroomsInput = page.getByPlaceholder("Any");
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.leafletMap = page.locator(".leaflet-container");
    this.mapZoomInButton = page.locator(".leaflet-control-zoom-in");
    this.mapZoomOutButton = page.locator(".leaflet-control-zoom-out");
    this.propertyCards = page.getByText("View Details →");
    this.noPropertiesFound = page.getByText("No properties found", {
      exact: true,
    });
  }

  async goto() {
    await this.page.goto("/list");
  }

  async searchProperty(criteria: ListCriteria) {
    if (criteria.location) {
      await this.locationInput.fill(criteria.location);
    }
    if (criteria.type) {
      await this.typeDropDown.selectOption(criteria.type);
    }
    if (criteria.property) {
      await this.propertyDropDown.selectOption(criteria.property);
    }
    if (criteria.minPrice) {
      await this.minPriceInput.fill(criteria.minPrice);
    }
    if (criteria.maxPrice) {
      await this.maxPriceInput.fill(criteria.maxPrice);
    }
    if (criteria.bedrooms) {
      await this.bedroomsInput.fill(criteria.bedrooms);
    }
    await this.searchButton.click();
  }

  async mockNoProperties() {
    await this.page.route("**/api/posts*", async (route) => {
      await route.fulfill({
        body: JSON.stringify([]),
        contentType: "application/json",
        status: 200,
      });
    });
  }
}
