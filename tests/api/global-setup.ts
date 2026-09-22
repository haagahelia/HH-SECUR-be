import { request } from "@playwright/test";

export default async function globalSetup() {
    const baseURL = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const context = await request.newContext({ baseURL });

    await context.get("/defaultuser");
    await context.get("/defaultadmin");

    await context.dispose();
}
