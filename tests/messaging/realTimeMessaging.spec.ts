import { expect } from "@playwright/test";
import { ensureAuthUser, test } from "../../fixtures/base.fixtures";

test("User 1 sends a message, User 2 receives it in real-time via WebSocket", async ({
  browser,
}) => {
  const user1Auth = await ensureAuthUser(browser, "testuser004", "testuser004");
  const user2Auth = await ensureAuthUser(browser, "Rohit", "Rohit");

  const user1Context = await browser.newContext({ storageState: user1Auth });
  const user2Context = await browser.newContext({ storageState: user2Auth });
  const user1Page = await user1Context.newPage();
  const user2Page = await user2Context.newPage();

  await user1Page.goto("/user/messages");
  await user2Page.goto("/user/messages");

  await user1Page.locator(".flex-1.overflow-y-auto > div").last().click();
  await user2Page.locator(".flex-1.overflow-y-auto > div").last().click();

  const user1Message = `User 1 test message ${Date.now()}`;
  const user2Message = `User 2 test message ${Date.now()}`;

  await user1Page.getByPlaceholder("Type your message...").fill(user1Message);
  await user2Page.getByPlaceholder("Type your message...").fill(user2Message);

  await user1Page.locator(".p-4.border-t button").last().click();
  await user2Page.locator(".p-4.border-t button").last().click();

  await expect(user1Page.getByText(user1Message).last()).toBeVisible();
  await expect(user2Page.getByText(user2Message).last()).toBeVisible();

  await expect(user1Page.getByText(user2Message).last()).toBeVisible();
  await expect(user2Page.getByText(user1Message).last()).toBeVisible();

  await user1Context.close();
  await user2Context.close();
});
