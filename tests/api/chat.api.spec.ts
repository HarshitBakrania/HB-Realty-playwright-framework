import { expect, test } from "@playwright/test";

const API = (process.env.API_URL || "http://localhost:3000").replace(/\/$/, "");

const getAuthCookies = async (request: any) => {
  const res = await request.post(`${API}/api/auth/login`, {
    data: {
      username: "testuser002",
      password: "testuser002",
    },
  });
  if (!res.ok()) throw new Error(`Login failed: ${res.status()} ${await res.text()}`);
  return res.headers()["set-cookie"].split(";")[0];
};

test.describe("Chat API", () => {
  test("GET /api/chats without auth returns 401", async ({ request }) => {
    const res = await request.get(`${API}/api/chats`);
    expect(res.status()).toBe(401);

    const body = await res.json();
    expect(body.message).toBe("User Unauthorized");
  });

  test("GET /api/chats returns array of chats", async ({ request }) => {
    const authCookie = await getAuthCookies(request);
    const res = await request.get(`${API}/api/chats`, {
      headers: { Cookie: authCookie },
    });
    expect(res.status()).toBe(200);
    const chats = await res.json();
    expect(Array.isArray(chats)).toBe(true);

    if (chats.length > 0) {
      expect(chats[0]).toMatchObject({
        id: expect.any(String),
        userIDs: expect.any(Array),
      });
    }
  });

  test("POST /api/chats without auth returns 401", async ({ request }) => {
    const res = await request.post(`${API}/api/chats`, {
      data: { receiverId: "6ae618eb9c21358f65df2b84" },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/chats returns or creates a conversation", async ({
    request,
  }) => {
    const authCookie = await getAuthCookies(request);
    const usersRes = await request.get(`${API}/api/users`);
    const users = await usersRes.json();
    const otherUser = users.find((u: any) => u.username !== "testuser002");

    const res = await request.post(`${API}/api/chats`, {
      headers: { Cookie: authCookie },
      data: { receiverId: otherUser.id },
    });
    expect(res.status()).toBe(200);

    const chat = await res.json();
    expect(chat).toMatchObject({
      id: expect.any(String),
      userIDs: expect.arrayContaining([otherUser.id]),
    });
  });

  test("GET /api/chats/:id returns chat details and messages", async ({
    request,
  }) => {
    const authCookie = await getAuthCookies(request);
    const chatsRes = await request.get(`${API}/api/chats`, {
      headers: { Cookie: authCookie },
    });
    const chats = await chatsRes.json();
    expect(chats.length).toBeGreaterThan(0);

    const chatId = chats[0].id;
    const res = await request.get(`${API}/api/chats/${chatId}`, {
      headers: { Cookie: authCookie },
    });
    expect(res.status()).toBe(200);

    const chat = await res.json();
    expect(chat.id).toBe(chatId);
    expect(Array.isArray(chat.messages)).toBe(true);
  });

  test("PUT /api/chats/read/:id marks chat as seen", async ({ request }) => {
    const authCookie = await getAuthCookies(request);
    const chatsRes = await request.get(`${API}/api/chats`, {
      headers: { Cookie: authCookie },
    });
    const chats = await chatsRes.json();
    expect(chats.length).toBeGreaterThan(0);

    const chatId = chats[0].id;
    const res = await request.put(`${API}/api/chats/read/${chatId}`, {
      headers: { Cookie: authCookie },
    });
    expect(res.status()).toBe(200);
  });

  test("user is able to message other users", async ({ request }) => {
    const authCookie = await getAuthCookies(request);
    const chatsRes = await request.get(`${API}/api/chats`, {
      headers: { Cookie: authCookie },
    });
    expect(chatsRes.status()).toBe(200);
    const chats = await chatsRes.json();
    expect(chats.length).toBeGreaterThan(0);

    const chatId = chats[0].id;
    const textMessage = `test message from API ${Date.now()}`;
    const res = await request.post(`${API}/api/messages/${chatId}`, {
      headers: { Cookie: authCookie },
      data: { text: textMessage },
    });
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.text).toBe(textMessage);
    expect(body.chatId).toBe(chatId);
  });
});
