import { Express } from "express";
import { createUserRoutes } from "./userRoutes.js";

export const createRoutes = (app: Express) => {
    createUserRoutes(app);
};