import { Express } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getFormOptions, getReportStatusOptions } from "../controllers/formContentController.js";

export const createFormContentRoutes = (app: Express) => {
    app.get("/formcontent", authenticate,  getFormOptions);

    app.get("/reportstatusoptions", authenticate, getReportStatusOptions)
}