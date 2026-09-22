import { APIRequestContext } from "@playwright/test";

export const DEFAULT_USER = {
    username: process.env.DEFAULT_USER_USERNAME || "user",
    password: process.env.DEFAULT_USER_PASSWORD || "1234",
};

export const DEFAULT_ADMIN = {
    username: process.env.DEFAULT_ADMIN_USERNAME || "admin",
    password: process.env.DEFAULT_ADMIN_PASSWORD || "1234",
};

export async function login(request: APIRequestContext, username: string, password: string) {
    const response = await request.post("/login", { data: { username, password } });
    const body = await response.json();
    return { response, body };
}
