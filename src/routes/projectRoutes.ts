import { Express} from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { deleteReportById, generateReport, getReportById, saveReport} from "../controllers/riskCalculationController.js";
import { requireAdmin } from "../utils/jwt.js";

export const createProjectRoutes = (app: Express) => {

    app.get("/reports/:id", authenticate, getReportById)

    app.post("/calculaterisk", authenticate, generateReport);

    app.post("/reports", authenticate, saveReport);

    app.delete("/reports/:id", authenticate, requireAdmin, deleteReportById);
}