import { test, expect } from "@playwright/test";
import { DEFAULT_ADMIN } from "./helpers/auth";

test.describe("GET /defaultadmin", () => {
    test("creates or resets the default admin", async ({ request }) => {
        const response = await request.get("/defaultadmin");
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(["User created successfully", "User reset to default values"]).toContain(body.message);
        expect(body.User).toMatchObject({
            username: DEFAULT_ADMIN.username,
            role: "admin",
        });
    });

    test("is idempotent when called again", async ({ request }) => {
        await request.get("/defaultadmin");
        const response = await request.get("/defaultadmin");

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.message).toBe("User reset to default values");
    });
});
