import { test, expect } from "@playwright/test";
import { DEFAULT_ADMIN, DEFAULT_USER, login } from "./helpers/auth";

test.describe("GET /tokenstatusadmin", () => {
    let adminToken: string;
    let userToken: string;

    test.beforeAll(async ({ request }) => {
        await request.get("/defaultadmin");
        await request.get("/defaultuser");

        const admin = await login(request, DEFAULT_ADMIN.username, DEFAULT_ADMIN.password);
        adminToken = admin.body.token;

        const user = await login(request, DEFAULT_USER.username, DEFAULT_USER.password);
        userToken = user.body.token;
    });

    test("grants access for an admin token", async ({ request }) => {
        const response = await request.get("/tokenstatusadmin", {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual({ adminAccess: true });
    });

    test("rejects a non-admin (user) token", async ({ request }) => {
        const response = await request.get("/tokenstatusadmin", {
            headers: { Authorization: `Bearer ${userToken}` },
        });
        expect(response.status()).toBe(403);
    });

    test("rejects a missing authorization header", async ({ request }) => {
        const response = await request.get("/tokenstatusadmin");
        expect(response.status()).toBe(401);
    });

    test("rejects an invalid token", async ({ request }) => {
        const response = await request.get("/tokenstatusadmin", {
            headers: { Authorization: "Bearer invalid.token.value" },
        });
        expect(response.status()).toBe(401);
    });
});
