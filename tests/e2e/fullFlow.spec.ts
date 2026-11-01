import { expect } from "@playwright/test";
import { test } from "../../fixtures/base.fixtures";
import { HomePage } from "../../pages/HomePage";
import { ListPage } from "../../pages/ListPage";
import { PropertyPage } from "../../pages/PropertyPage";
import { MessagesPage } from "../../pages/MessagesPage";
import { UserPage } from "../../pages/UserPage";
import { NavBar } from "../../pages/components/NavBar";

test.describe("E2E User Journeys", () => {
  test.setTimeout(60000);
  test("complete authenticated user journey: search, view, save, message, profile, logout", async ({
    authenticatedPage,
  }) => {
    const homePage = new HomePage(authenticatedPage);
    const listPage = new ListPage(authenticatedPage);
    const propertyPage = new PropertyPage(authenticatedPage);
    const messagesPage = new MessagesPage(authenticatedPage);
    const userPage = new UserPage(authenticatedPage);
    const navBar = new NavBar(authenticatedPage);

    await homePage.goto();
    await expect(homePage.heading).toBeVisible();

    await homePage.searchProperty({ city: "Mumbai", type: "Buy" });
    await expect(authenticatedPage).toHaveURL("/list?city=Mumbai&type=buy");

    await expect(listPage.propertyCards.first()).toBeVisible();
    await listPage.propertyCards.first().click();
    await expect(authenticatedPage).toHaveURL(/\/posts\/.+/);

    await expect(propertyPage.price).toBeVisible();
    await expect(propertyPage.propertyTitle).toBeVisible();

    const saveButtonText = await propertyPage.savePlaceButton.innerText();
    if (saveButtonText === "Save Place") {
      await propertyPage.toggleSave();
      await expect(propertyPage.savePlaceButton).toHaveText("Place is saved");
    }

    await propertyPage.messageOwner();
    await expect(authenticatedPage).toHaveURL("/user/messages");

    await messagesPage.openFirstConversation();
    const message = `E2E message ${Date.now()}`;
    await messagesPage.messageInput.fill(message);
    await messagesPage.sendButton.click();
    await expect(authenticatedPage.getByText(message).last()).toBeVisible();

    await navBar.clickAvatar();
    await expect(authenticatedPage).toHaveURL("/user");
    await expect(userPage.savedPosts.first()).toBeVisible();

    await userPage.logout();
    await expect(authenticatedPage).toHaveURL("/");
  });

  test("unauthenticated user journey: search, explore, protected redirect to signin", async ({
    page,
    homePage,
    listPage,
    signInPage,
  }) => {
    await homePage.goto();
    await expect(homePage.heading).toBeVisible();

    await homePage.searchProperty({ city: "Mumbai" });
    await expect(page).toHaveURL("/list?city=Mumbai");

    await expect(listPage.propertyCards.first()).toBeVisible();
    await listPage.propertyCards.first().click();
    await expect(page).toHaveURL("/signin");

    await signInPage.login("testuser002", "testuser002");
    await expect(page).toHaveURL("/");
  });
});

