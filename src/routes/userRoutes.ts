import { Express} from "express";
import { getUserById, login, getUsers, deleteUserbyId, updateUserById } from "../controllers/userController.js";

export const createUserRoutes = (app: Express) => {
    app.post("/login", login);

    app.get("/users/:id", getUserById);

    app.get("/users", getUsers);
    
    // app.delete("/users/:id", deleteUserbyId);

    // app.put("/users/:id", updateUserById);
};