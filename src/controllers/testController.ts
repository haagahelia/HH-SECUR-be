import { Request, Response } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import repository from "../data/repository/repository.js";

dotenv.config();

export const tokenStatus = async (req: Request, res: Response) => {
    res.json({ token: "accepted" });
}

export const addDefaultUser = async (req: Request, res: Response) => {

    if (!process.env.DEFAULT_USER_PASSWORD || !process.env.DEFAULT_USER_USERNAME || !process.env.DEFAULT_USER_EMAIL) {
        res.json({ message: "Missing env variables" });
    }

    const password = process.env.DEFAULT_USER_PASSWORD as string;
    const passwordHash = await bcrypt.hash(password, 10);
    const username = process.env.DEFAULT_USER_USERNAME as string;
    const email = process.env.DEFAULT_USER_EMAIL as string;

    const user = {
        username: username,
        email: email,
        password_hash: passwordHash
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