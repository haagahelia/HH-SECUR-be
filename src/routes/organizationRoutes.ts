import { Express } from "express";
import { getOrganizations } from "../controllers/organizationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

export const createOrganizationRoutes = (app: Express) => {
    app.get("/organizations", authenticate, getOrganizations);
}
