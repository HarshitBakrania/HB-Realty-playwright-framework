import { expect } from "@playwright/test";
import { test } from "../../fixtures/base.fixtures";

test.describe("HomePage & search filter", () => {
  test.beforeEach("navigate to home page", async ({ homePage }) => {
    await homePage.goto();
  });

  test("homepage should display hero element", async ({ homePage }) => {
    await expect(homePage.heading).toBeVisible();
  });

  test("search properties by city", async ({ homePage, page }) => {
    await homePage.searchProperty({ city: "Mumbai" });
    await expect(page).toHaveURL("/list?city=Mumbai");
  });

  test("search property with property type", async ({ homePage, page }) => {
    await homePage.searchProperty({ type: "Buy" });
    await expect(page).toHaveURL("/list?type=buy");
  });

  test("search properties with multiple filters", async ({
    homePage,
    page,
  }) => {
    await homePage.searchProperty({
      city: "Mumbai",
      type: "Buy",
      minPrice: "1000",
      maxPrice: "999999",
    });
    await expect(page).toHaveURL(
      "/list?city=Mumbai&minPrice=1000&maxPrice=999999&type=buy",
    );
  });

  test("navigates to list page on empty search", async ({ homePage, page }) => {
    await homePage.searchProperty({});
    await expect(page).toHaveURL("/list");
  });
});
