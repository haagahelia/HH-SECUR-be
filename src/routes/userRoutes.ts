import { Express} from "express";
import { login } from "../controllers/userController.js";

export const createUserRoutes = (app: Express) => {
    app.post("/login", login);    
};