import { Express} from "express";
import { addDefaultAdmin, addDefaultUser, tokenStatus, tokenStatusAdmin } from "../controllers/testController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../utils/jwt.js";

export const createTestRoutes = (app: Express) => {
    app.get("/tokenstatus", authenticate, tokenStatus);

    app.get("/tokenstatusadmin", authenticate, requireAdmin, tokenStatusAdmin);

    app.get("/defaultuser", addDefaultUser);

    app.get("/defaultadmin", addDefaultAdmin);
}
