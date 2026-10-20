import { Express } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getFormOptions } from "../controllers/formContentController.js";

export const createFormContentRoutes = (app: Express) => {
    app.get("/formcontent", authenticate,  getFormOptions);
}