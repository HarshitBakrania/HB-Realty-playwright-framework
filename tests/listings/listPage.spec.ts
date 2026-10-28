import { expect } from "@playwright/test";
import { test } from "../../fixtures/base.fixtures";

test.describe("List Page", () => {
  test.beforeEach("Navigate to the list page", async ({ listPage }) => {
    await listPage.goto();
  });

  test("search properties by location filter", async ({ listPage, page }) => {
    await listPage.searchProperty({ location: "Mumbai" });
    await expect(page).toHaveURL("/list?city=Mumbai");
  });

  test("search properties by property filter", async ({ listPage, page }) => {
    await listPage.searchProperty({ property: "Apartment" });
    await expect(page).toHaveURL("/list?property=apartment");
  });

  test("search properties with multiple filters", async ({
    listPage,
    page,
  }) => {
    await listPage.searchProperty({
      location: "Mumbai",
      type: "Any",
      property: "House",
      minPrice: "0",
      maxPrice: "999999",
      bedrooms: "3",
    });
    await expect(page).toHaveURL(
      "/list?city=Mumbai&property=house&minPrice=0&maxPrice=999999&bedroom=3",
    );
  });

  test("Map is visible", async ({ listPage }) => {
    await expect(listPage.leafletMap).toBeVisible();
  });

  test("map buttons work", async ({ listPage }) => {
    await expect(listPage.mapZoomInButton).toBeEnabled();
    await expect(listPage.mapZoomOutButton).toBeEnabled();
  });

  test("property cards are present", async ({ listPage }) => {
    await expect(listPage.propertyCards.first()).toBeVisible();
    const count = await listPage.propertyCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("text is present if no properties are found", async ({ listPage }) => {
    await listPage.mockNoProperties();
    await listPage.goto();
    await expect(listPage.noPropertiesFound).toBeVisible();
  });

  test("navigates to the signin page if the user is not logged in", async ({
    listPage,
    page,
  }) => {
    await listPage.propertyCards.first().click();
    await expect(page).toHaveURL("/signin");
  });

  test("navigates to property page", async ({ listPage, page, signInPage }) => {
    await signInPage.goto();
    await signInPage.login("testuser002", "testuser002");
    await expect(page).toHaveURL("/");
    await listPage.goto();
    await listPage.propertyCards.first().click();
    await expect(page).toHaveURL(/\/posts\/.+/);
  });
});
