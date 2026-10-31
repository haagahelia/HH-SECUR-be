import { Express } from "express";
import { deleteOrganization, getOrganizations, postOrganization } from "../controllers/organizationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../utils/jwt.js";

export const createOrganizationRoutes = (app: Express) => {
    app.get("/organizations", authenticate, getOrganizations);
    app.post("/organizations", authenticate, requireAdmin, postOrganization);
    app.delete("/organizations/:id", authenticate, requireAdmin, deleteOrganization)
}
