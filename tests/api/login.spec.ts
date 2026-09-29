import { test, expect } from "@playwright/test";
import { DEFAULT_USER } from "./helpers/auth";

test.describe("POST /login", () => {
    test.beforeAll(async ({ request }) => {
        await request.get("/defaultuser");
    });

    test("logs in with valid default user credentials", async ({ request }) => {
        const response = await request.post("/login", { data: DEFAULT_USER });
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.message).toBe("Login successful");
        expect(body.username).toBe(DEFAULT_USER.username);
        expect(body.role).toBe("user");
        expect(typeof body.token).toBe("string");
    });

    test("rejects a request with missing credentials", async ({ request }) => {
        const response = await request.post("/login", { data: {} });
        expect(response.status()).toBe(400);
    });

    test("rejects an invalid password", async ({ request }) => {
        const response = await request.post("/login", {
            data: { username: DEFAULT_USER.username, password: "wrong-password" },
        });
        expect(response.status()).toBe(401);
    });

    test("rejects an unknown username", async ({ request }) => {
        const response = await request.post("/login", {
            data: { username: "no-such-user", password: "whatever" },
        });
        expect(response.status()).toBe(401);
    });
});
