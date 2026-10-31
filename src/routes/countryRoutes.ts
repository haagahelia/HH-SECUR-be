import { Express } from "express";
import { deleteCountry, getCountries, getCountryByCode, patchCountry, postCountry } from "../controllers/countryController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../utils/jwt.js";

export const createCountryRoutes = (app: Express) => {
    app.get("/countries", authenticate,  getCountries);
    app.get("/countries/:code", authenticate, getCountryByCode);
    app.post("/countries", authenticate, postCountry);
    app.patch("/countries/:id", authenticate, requireAdmin, patchCountry);
    app.delete("/countries/:id", authenticate, requireAdmin, deleteCountry);
}