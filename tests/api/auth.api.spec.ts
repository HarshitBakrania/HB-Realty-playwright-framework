import { expect, test } from "@playwright/test";

const API = (process.env.API_URL || "http://localhost:3000").replace(/\/$/, "");

test.describe("Auth API", () => {
  test("login with valid credentials returns user and sets cookies", async ({
    request,
  }) => {
    const res = await request.post(`${API}/api/auth/login`, {
      data: { username: "testuser002", password: "testuser002" },
    });
    expect(res.status()).toBe(200);

    const body = await res.json();

    expect(body).toMatchObject({
      id: expect.any(String),
      username: "testuser002",
      email: expect.any(String),
    });

    expect(body.password).toBeUndefined();

    const cookies = res.headers()["set-cookie"];
    expect(cookies).toContain("authToken");
  });

  test("login with invalid credentials returns 401", async ({ request }) => {
    const res = await request.post(`${API}/api/auth/login`, {
      data: { username: "testuser002", password: "invalidPassowrd" },
    });

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.message).toBe("Invalid credentials");
  });

  test("login with user that does not exist in DB", async ({ request }) => {
    const res = await request.post(`${API}/api/auth/login`, {
      data: { username: "randomUser", password: "randomPassword" },
    });

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.message).toBe("Invalid credentials");
  });

  test("logout clears the authToken cookie", async ({ request }) => {
    const res = await request.post(`${API}/api/auth/logout`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("Logged out successfully");

    const cookies = res.headers()["set-cookie"];
    expect(cookies).toContain("authToken=;");
  });

  test("Register a new user", async ({ request }) => {
    const res = await request.post(`${API}/api/auth/register`, {
      data: {
        username: `registerUser${Date.now()}`,
        email: `registerUser${Date.now()}@test.com`,
        password: "testuser",
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("User created successfully");
  });

  test("register with duplicate username returns 500", async ({ request }) => {
    const res = await request.post(`${API}/api/auth/register`, {
      data: {
        username: "testuser002",
        email: "testuser002@gmail.com",
        password: "testuser002",
      },
    });

    expect(res.status()).toBe(500);
    const body = await res.json();
    expect(body.message).toBe("Failed to create User");
  });
});
