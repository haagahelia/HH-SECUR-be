import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    testDir: "./tests/api",
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: "list",
    globalSetup: "./tests/api/global-setup.ts",
    use: {
        baseURL: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
        extraHTTPHeaders: {
            "Content-Type": "application/json",
        },
    },
});
