import { Express } from "express";
import { createUserRoutes } from "./userRoutes.js";
import { createTestRoutes } from "./testRoutes.js";
import { createProjectRoutes } from "./projectRoutes.js";
import { createOrganizationRoutes } from "./organizationRoutes.js";
import { createCountryRoutes } from "./countryRoutes.js";
import { createFormContentRoutes } from "./formContentRoutes.js";

export const createRoutes = (app: Express) => {
    createUserRoutes(app);
    createTestRoutes(app);
    createProjectRoutes(app);
    createOrganizationRoutes(app);
    createCountryRoutes(app);
    createFormContentRoutes(app);
};