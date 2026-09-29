import { test, expect } from "@playwright/test";
import { DEFAULT_USER, login } from "./helpers/auth";

test.describe("GET /tokenstatus", () => {
    let token: string;

    test.beforeAll(async ({ request }) => {
        await request.get("/defaultuser");
        const { body } = await login(request, DEFAULT_USER.username, DEFAULT_USER.password);
        token = body.token;
    });

    test("accepts a valid bearer token", async ({ request }) => {
        const response = await request.get("/tokenstatus", {
            headers: { Authorization: `Bearer ${token}` },
        });
        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual({ token: "accepted" });
    });

    test("rejects a missing authorization header", async ({ request }) => {
        const response = await request.get("/tokenstatus");
        expect(response.status()).toBe(401);
    });

    test("rejects a malformed authorization header", async ({ request }) => {
        const response = await request.get("/tokenstatus", {
            headers: { Authorization: "Token abc" },
        });
        expect(response.status()).toBe(401);
    });

    test("rejects an invalid token", async ({ request }) => {
        const response = await request.get("/tokenstatus", {
            headers: { Authorization: "Bearer invalid.token.value" },
        });
        expect(response.status()).toBe(401);
    });
});
