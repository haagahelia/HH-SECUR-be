import { Express } from "express";
import { createUserRoutes } from "./userRoutes.js";
import { createTestRoutes } from "./testRoutes.js";
import { createProjectRoutes } from "./projectRoutes.js";

export const createRoutes = (app: Express) => {
    createUserRoutes(app);
    createTestRoutes(app);
    createProjectRoutes(app);
};