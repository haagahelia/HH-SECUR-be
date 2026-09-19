import { Express} from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { calculateRisk} from "../controllers/riskCalculationController.js";

export const createProjectRoutes = (app: Express) => {

    app.post("/calculaterisk", authenticate, calculateRisk);
}