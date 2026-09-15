import { Express} from "express";
import { getUserById, login, getUsers, deleteUserbyId, updateUserById, postUser } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../utils/jwt.js";

export const createUserRoutes = (app: Express) => {
    app.post("/login", login);

    app.get("/users/:id", authenticate, getUserById);

    app.get("/users", authenticate, getUsers);

    app.post("/users", authenticate, requireAdmin, postUser)
    
    app.delete("/users/:id", authenticate, requireAdmin, deleteUserbyId);

    app.patch("/users/:id", authenticate, requireAdmin, updateUserById);
};