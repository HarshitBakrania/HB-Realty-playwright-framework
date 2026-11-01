import { expect, test } from "@playwright/test";

const API = (process.env.API_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

test.describe("Posts API - Filters", () => {
  test("GET /api/posts returns all posts", async ({ request }) => {
    const res = await request.get(`${API}/api/posts`);
    expect(res.status()).toBe(200);

    const posts = await res.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);

    expect(posts[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      price: expect.any(Number),
      city: expect.any(String),
      bedroom: expect.any(Number),
      bathroom: expect.any(Number),
      type: expect.any(String),
      property: expect.any(String),
    });
  });

  test("GET /api/posts?type=buy filters posts for purchase", async ({
    request,
  }) => {
    const res = await request.get(`${API}/api/posts?type=buy`);
    expect(res.status()).toBe(200);

    const posts = await res.json();
    expect(Array.isArray(posts)).toBe(true);
    for (const post of posts) {
      expect(post.type).toBe("buy");
    }
  });

  test("GET /api/posts?type=rent filters posts for renting", async ({
    request,
  }) => {
    const res = await request.get(`${API}/api/posts?type=rent`);
    expect(res.status()).toBe(200);

    const posts = await res.json();
    expect(Array.isArray(posts)).toBe(true);
    for (const post of posts) {
      expect(post.type).toBe("rent");
    }
  });

  test("GET /api/posts?city=Mumbai filters posts by city", async ({
    request,
  }) => {
    const res = await request.get(`${API}/api/posts?city=Mumbai`);
    expect(res.status()).toBe(200);

    const posts = await res.json();
    expect(Array.isArray(posts)).toBe(true);
    for (const post of posts) {
      expect(post.city).toBe("Mumbai");
    }
  });

  test("GET /api/posts?property=apartment filters by property type", async ({
    request,
  }) => {
    const res = await request.get(`${API}/api/posts?property=apartment`);
    expect(res.status()).toBe(200);

    const posts = await res.json();
    expect(Array.isArray(posts)).toBe(true);
    for (const post of posts) {
      expect(post.property).toBe("apartment");
    }
  });

  test("GET /api/posts with price range filter", async ({ request }) => {
    const minPrice = 1000;
    const maxPrice = 50000;
    const res = await request.get(
      `${API}/api/posts?minPrice=${minPrice}&maxPrice=${maxPrice}`,
    );
    expect(res.status()).toBe(200);

    const posts = await res.json();
    expect(Array.isArray(posts)).toBe(true);
    for (const post of posts) {
      expect(post.price).toBeGreaterThanOrEqual(minPrice);
      expect(post.price).toBeLessThanOrEqual(maxPrice);
    }
  });

  test("GET /api/posts with multiple combined filters", async ({ request }) => {
    const res = await request.get(
      `${API}/api/posts?city=Mumbai&type=buy&property=apartment&bedroom=2`,
    );
    expect(res.status()).toBe(200);

    const posts = await res.json();
    expect(Array.isArray(posts)).toBe(true);
    for (const post of posts) {
      expect(post.city).toBe("Mumbai");
      expect(post.type).toBe("buy");
      expect(post.property).toBe("apartment");
      expect(post.bedroom).toBe(2);
    }
  });
});

