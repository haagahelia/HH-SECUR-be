import { Express } from "express";
import { getCountries, getCountryByCode } from "../controllers/countryController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

export const createCountryRoutes = (app: Express) => {
    app.get("/countries", authenticate,  getCountries);
    app.get("/countries/:code", authenticate, getCountryByCode);
}