import { expect } from "@playwright/test";
import { test } from "../../fixtures/base.fixtures";

test.describe("Property Page Elements & Details", () => {
  test.beforeEach(
    "get the first post from API",
    async ({ request, authPropertyPage, authenticatedPage }) => {
      const apiUrl = (process.env.API_URL || "http://localhost:3000").replace(/\/$/, "");
      const response = await request.get(`${apiUrl}/api/posts`);
      const posts = await response.json();
      const postId = posts[0].id;

      await authPropertyPage.goto(postId);
    },
  );

  test("validate all elements and details are present on the property page", async ({
    authPropertyPage,
  }) => {
    await expect(authPropertyPage.price).toBeVisible();
    await expect(authPropertyPage.leaftletMap).toBeVisible();
    await expect(authPropertyPage.propertyTitle).toBeVisible();
    await expect(authPropertyPage.propertyType).toBeVisible();
    await expect(authPropertyPage.property).toBeVisible();
    await expect(authPropertyPage.furnished).toBeVisible();
    await expect(authPropertyPage.pets).toBeVisible();
    await expect(authPropertyPage.size).toBeVisible();
    await expect(authPropertyPage.bedrooms).toBeVisible();
    await expect(authPropertyPage.bathrooms).toBeVisible();
    await expect(authPropertyPage.school).toBeVisible();
    await expect(authPropertyPage.hospital).toBeVisible();
    await expect(authPropertyPage.restaurant).toBeVisible();
    await expect(authPropertyPage.ownerName).toBeVisible();
    await expect(authPropertyPage.savePlaceButton).toBeVisible();
    await expect(authPropertyPage.sendMessageButton).toBeVisible();
  });

  test("save/unsave the property", async ({ authPropertyPage }) => {
    const initialText = await authPropertyPage.savePlaceButton.innerText();
    await authPropertyPage.toggleSave();

    if (initialText === "Save Place") {
      await expect(authPropertyPage.savePlaceButton).toHaveText("Place is saved", { timeout: 10000 });
    } else {
      await expect(authPropertyPage.savePlaceButton).toHaveText("Save Place", { timeout: 10000 });
    }
  });

  test("user can message the property owner", async ({
    authPropertyPage,
    authenticatedPage,
  }) => {
    await expect(authPropertyPage.sendMessageButton).toBeVisible();
    await authPropertyPage.messageOwner();
    await expect(authenticatedPage).toHaveURL("/user/messages");
  });
});
