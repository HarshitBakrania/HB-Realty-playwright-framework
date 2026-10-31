import { Locator, Page } from "@playwright/test";

export class MessagesPage {
  conversationCards: Locator;
  messageInput: Locator;
  sendButton: Locator;
  chatMessages: Locator;

  constructor(private page: Page) {
    this.conversationCards = page.locator(".flex-1.overflow-y-auto > div");
    this.messageInput = page.getByPlaceholder("Type your message...");
    this.sendButton = page.locator(".p-4.border-t button").last();
    this.chatMessages = page.locator(
      ".flex-1.overflow-y-auto.p-4.space-y-4 > div",
    );
  }

  async goto() {
    await this.page.goto("/user/messages");
  }

  async openFirstConversation() {
    await this.conversationCards.first().click();
  }

  async sendMessage(text: string) {
    await this.openFirstConversation();
    await this.messageInput.fill(text);
    await this.sendButton.click();
  }
}
