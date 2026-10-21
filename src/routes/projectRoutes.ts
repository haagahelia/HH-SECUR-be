import { Express} from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { deleteReportById, generateReport, getReportById, getReports, patchReport, saveReport} from "../controllers/riskCalculationController.js";
import { requireAdmin } from "../utils/jwt.js";

export const createProjectRoutes = (app: Express) => {

    app.get("/reports", authenticate, getReports)

    app.get("/reports/:id", authenticate, getReportById)

    app.post("/calculaterisk", authenticate, generateReport);

    app.post("/reports", authenticate, saveReport);

    app.patch("/reports/:id", authenticate, patchReport);

    app.delete("/reports/:id", authenticate, deleteReportById);
}