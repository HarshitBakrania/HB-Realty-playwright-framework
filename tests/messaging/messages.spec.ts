import { expect } from "@playwright/test";
import { test } from "../../fixtures/base.fixtures";

test.describe("Messages page tests", () => {
  test("unauthenticated users are redirected to signin page", async ({
    page,
  }) => {
    await page.goto("/user/messages");
    await expect(page).toHaveURL("/signin");
  });

  test("user is able to send message", async ({
    messagesPage,
    authenticatedPage,
  }) => {
    await messagesPage.goto();
    const testMessage = `Test message ${Date.now()}`;
    await messagesPage.sendMessage(testMessage);
    await expect(authenticatedPage.getByText(testMessage).last()).toBeVisible();
  });
});
