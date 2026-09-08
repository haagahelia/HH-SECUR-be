import { Express} from "express";
import { getUserById, login } from "../controllers/userController.js";

export const createUserRoutes = (app: Express) => {
    app.post("/login", login);

    app.get("/users/:id", getUserById);
};