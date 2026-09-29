import { test, expect } from "@playwright/test";
import { DEFAULT_USER } from "./helpers/auth";

test.describe("GET /defaultuser", () => {
    test("creates or resets the default user", async ({ request }) => {
        const response = await request.get("/defaultuser");
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(["User created successfully", "User reset to default values"]).toContain(body.message);
        expect(body.User).toMatchObject({
            username: DEFAULT_USER.username,
            role: "user",
        });
    });

    test("is idempotent when called again", async ({ request }) => {
        await request.get("/defaultuser");
        const response = await request.get("/defaultuser");

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.message).toBe("User reset to default values");
    });
});
