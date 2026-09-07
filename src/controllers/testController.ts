import { Request, Response } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import repository from "../data/repository/repository.js";

dotenv.config();

export const tokenStatus = async (req: Request, res: Response) => {
    res.json({ token: "accepted" });
}

export const addDefaultUser = async (req: Request, res: Response) => {

    if (!process.env.DEFAULT_USER_PASSWORD || !process.env.DEFAULT_USER_USERNAME || !process.env.DEFAULT_USER_EMAIL || !process.env.DEFAULT_USER_ROLE) {
        res.json({ message: "Missing env variables" });
    }

    const password = process.env.DEFAULT_USER_PASSWORD as string;
    const passwordHash = await bcrypt.hash(password, 10);
    const username = process.env.DEFAULT_USER_USERNAME as string;
    const email = process.env.DEFAULT_USER_EMAIL as string;
    const role = process.env.DEFAULT_USER_ROLE as string;


    const user = {
        username: username,
        email: email,
        password_hash: passwordHash,
        user_role: role
    }

    try {
        await repository.deleteByEmail(email);
        const newUser = await repository.createUser(user);
        res.json({
            message: "User created successfully",
            newUser
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: {
                message: "Error creating default user"
            }
        })
    }
}

export const addDefaultAdmin = async (req: Request, res: Response) => {

    if (!process.env.DEFAULT_ADMIN_PASSWORD || !process.env.DEFAULT_ADMIN_USERNAME || !process.env.DEFAULT_ADMIN_EMAIL || !process.env.DEFAULT_ADMIN_ROLE) {
        res.json({ message: "Missing env variables" });
    }

    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD as string;
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const adminUsername = process.env.DEFAULT_ADMIN_USERNAME as string;
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL as string;
    const adminRole = process.env.DEFAULT_ADMIN_ROLE as string;


    const admin = {
        username: adminUsername,
        email: adminEmail,
        password_hash: adminPasswordHash,
        user_role: adminRole
    }

    try {
        await repository.deleteByEmail(adminEmail);
        const newUser = await repository.createUser(admin);
        res.json({
            message: "User created successfully",
            newUser
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: {
                message: "Error creating default user"
            }
        })
    }

}