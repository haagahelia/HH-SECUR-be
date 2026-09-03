import { Express} from "express";
import { addDefaultUser, tokenStatus } from "../controllers/testController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

export const createTestRoutes = (app: Express) => {
    app.get("/tokenstatus", authenticate, tokenStatus);

    app.get("/defaultuser", addDefaultUser);
}
