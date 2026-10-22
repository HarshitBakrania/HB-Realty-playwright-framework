import { Locator, Page } from "@playwright/test";

export interface SearchCriteria {
  city?: string;
  type?: "Buy" | "Rent" | "Any";
  minPrice?: string;
  maxPrice?: string;
}

export class HomePage {
  heading: Locator;
  cityInput: Locator;
  dropDownType: Locator;
  minPriceInput: Locator;
  maxPriceInput: Locator;
  searchPropertyButton: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", { name: "Find Your Dream Home" });
    this.cityInput = page.getByPlaceholder("Enter a City");
    this.dropDownType = page.locator(`select[name="type"]`);
    this.minPriceInput = page.getByPlaceholder("0", { exact: true });
    this.maxPriceInput = page.getByPlaceholder("1,000,000", { exact: true });
    this.searchPropertyButton = page.getByRole("button", { name: "Search" });
  }

  async goto() {
    await this.page.goto("/");
  }

  async searchProperty(criteria: SearchCriteria) {
    if (criteria.city) {
      await this.cityInput.fill(criteria.city);
    }
    if (criteria.type) {
      await this.dropDownType.selectOption(criteria.type);
    }
    if (criteria.minPrice) {
      await this.minPriceInput.fill(criteria.minPrice);
    }
    if (criteria.maxPrice) {
      await this.maxPriceInput.fill(criteria.maxPrice);
    }
    await this.searchPropertyButton.click();
  }
}
