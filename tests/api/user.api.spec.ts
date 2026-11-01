import { expect, test } from "@playwright/test";

const API = (process.env.API_URL || "http://localhost:3000").replace(/\/$/, "");

const getAuthData = async (request: any) => {
  const res = await request.post(`${API}/api/auth/login`, {
    data: { username: "testuser002", password: "testuser002" },
  });

  if (!res.ok()) throw new Error(`Login failed: ${res.status()} ${await res.text()}`);

  const body = await res.json();
  const userId = body.id;
  const authCookie = res.headers()["set-cookie"].split(";")[0];

  return { userId, authCookie };
};

test.describe("User API", () => {
  test("GET /api/users/userPosts without auth returns 401", async ({
    request,
  }) => {
    const res = await request.get(`${API}/api/users/userPosts`);
    expect(res.status()).toBe(401);

    const body = await res.json();
    expect(body.message).toBe("User Unauthorized");
  });

  test("edit profile avatar", async ({ request }) => {
    const { userId, authCookie } = await getAuthData(request);
    const res = await request.put(`${API}/api/users/${userId}`, {
      headers: { Cookie: authCookie },
      data: { avatar: "https://example.com/new-avatar.png" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.avatar).toBe("https://example.com/new-avatar.png");
  });

  test("GET /api/users/userPosts returns userPosts and savedPosts array", async ({
    request,
  }) => {
    const { authCookie } = await getAuthData(request);
    const res = await request.get(`${API}/api/users/userPosts`, {
      headers: { Cookie: authCookie },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(body).toMatchObject({
      userPosts: expect.any(Array),
      savedPosts: expect.any(Array),
    });
  });

  test("POST /api/users/save without auth return 401", async ({ request }) => {
    const res = await request.post(`${API}/api/users/save`, {
      data: { postId: "random-post-id" },
    });
    expect(res.status()).toBe(401);
  });

  test("saving a post toggles between saved and unsaved", async ({
    request,
  }) => {
    const { authCookie } = await getAuthData(request);
    const postsRes = await request.get(`${API}/api/posts`);
    const posts = await postsRes.json();
    const postId = posts[0].id;

    const firstRes = await request.post(`${API}/api/users/save`, {
      headers: { Cookie: authCookie },
      data: { postId },
    });
    expect(firstRes.status()).toBe(200);
    const firstBody = await firstRes.json();
    expect(firstBody.message).toMatch(
      /Post added to saved list!|Post removed from saved list!/,
    );

    const secondRes = await request.post(`${API}/api/users/save`, {
      headers: { Cookie: authCookie },
      data: { postId },
    });
    expect(secondRes.status()).toBe(200);
    const secondBody = await secondRes.json();
    if (firstBody.message === "Post added to saved list!") {
      expect(secondBody.message).toBe("Post removed from saved list!");
    } else {
      expect(secondBody.message).toBe("Post added to saved list!");
    }
  });

  test("PUT /api/users/:id", async ({ request }) => {
    const res = await request.put(`${API}/api/users/random-id`, {
      data: { username: "asd" },
    });
    expect(res.status()).toBe(401);
  });

  test("GET /api/users/notification returns unread count", async ({
    request,
  }) => {
    const { authCookie } = await getAuthData(request);
    const res = await request.get(`${API}/api/users/notification`, {
      headers: { Cookie: authCookie },
    });
    expect(res.status()).toBe(200);
    const count = await res.json();
    expect(typeof count).toBe("number");
  });
});
