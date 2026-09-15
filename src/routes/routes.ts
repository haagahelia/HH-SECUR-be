import { Express } from "express";
import { createUserRoutes } from "./userRoutes.js";
import { createTestRoutes } from "./testRoutes.js";

export const createRoutes = (app: Express) => {
    createUserRoutes(app);
    createTestRoutes(app);
};