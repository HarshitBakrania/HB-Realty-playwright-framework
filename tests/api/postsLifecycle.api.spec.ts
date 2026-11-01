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

test.describe("Posts API - Lifecycle & Details", () => {
  test("GET /api/posts/:id returns single post details", async ({
    request,
  }) => {
    const authCookie = await getAuthCookies(request);
    const postsRes = await request.get(`${API}/api/posts`);
    const posts = await postsRes.json();
    const postId = posts[0].id;

    const res = await request.get(`${API}/api/posts/${postId}`, {
      headers: { Cookie: authCookie },
    });
    expect(res.status()).toBe(200);

    const post = await res.json();
    expect(post).toMatchObject({
      id: postId,
      title: expect.any(String),
      price: expect.any(Number),
      city: expect.any(String),
      address: expect.any(String),
    });
  });

  test("POST /api/posts without auth returns 401", async ({ request }) => {
    const res = await request.post(`${API}/api/posts`, {
      data: {
        postData: {
          title: "Unauthorized Post",
          price: 2000,
          city: "Mumbai",
          address: "123 Street",
          bedroom: 2,
          bathroom: 1,
          type: "buy",
          property: "apartment",
          latitude: "19.076",
          longitude: "72.877",
          images: [],
        },
      },
    });
    expect(res.status()).toBe(401);
  });

  test("DELETE /api/posts/:id without auth returns 401", async ({
    request,
  }) => {
    const postsRes = await request.get(`${API}/api/posts`);
    const posts = await postsRes.json();
    const postId = posts[0].id;

    const res = await request.delete(`${API}/api/posts/${postId}`);
    expect(res.status()).toBe(401);
  });

  test("create, retrieve, and delete a post", async ({ request }) => {
    const authCookie = await getAuthCookies(request);

    const createRes = await request.post(`${API}/api/posts`, {
      headers: { Cookie: authCookie },
      data: {
        postData: {
          title: `API Created Post ${Date.now()}`,
          price: 4500,
          address: "404 Test Avenue",
          city: "Mumbai",
          bedroom: 2,
          bathroom: 2,
          type: "rent",
          property: "apartment",
          latitude: "19.0760",
          longitude: "72.8777",
          images: [],
        },
        postDetail: {
          description: "Created through API automated test",
          utilities: "Included",
          pet: "Allowed",
          size: 900,
          school: 200,
          hospital: 150,
          restaurant: 100,
        },
      },
    });

    expect(createRes.status()).toBe(200);
    const createdPost = await createRes.json();
    const newPostId = createdPost.id;
    expect(newPostId).toBeDefined();

    const getRes = await request.get(`${API}/api/posts/${newPostId}`, {
      headers: { Cookie: authCookie },
    });
    expect(getRes.status()).toBe(200);
    const retrievedPost = await getRes.json();
    expect(retrievedPost.id).toBe(newPostId);

    const deleteRes = await request.delete(`${API}/api/posts/${newPostId}`, {
      headers: { Cookie: authCookie },
    });
    expect(deleteRes.status()).toBe(200);
    const deleteBody = await deleteRes.json();
    expect(deleteBody.message).toBe("Post deleted!");
  });
});
