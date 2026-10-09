import { Request, Response } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import repository from "../data/repository/repository.js";
import User from "../data/models/User.js";
import { addExtraUser } from "../utils/tempUtils.js";

dotenv.config();

export const tokenStatus = async (req: Request, res: Response) => {
    res.json({ token: "accepted" });
}

export const tokenStatusAdmin = async (req: Request, res: Response) => {
    res.json({ adminAccess: true });
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
        role: role
    }

    try {
        const oldUser: User | null = await repository.findByEmail(email);
        if (oldUser != null) {
            oldUser.username = username;
            oldUser.email = email;
            oldUser.password_hash = passwordHash;
            oldUser.role = role;
            await oldUser.save();
            res.json({
                message: "User reset to default values",
                User: oldUser
            })
        } else {
            const newUser = await repository.createUser(user);
            res.json({
                message: "User created successfully",
                User: newUser
            });
        }
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
        role: adminRole
    }

    try {
        const oldAdmin: User | null = await repository.findByEmail(adminEmail);
        if (oldAdmin != null) {
            oldAdmin.username = adminUsername;
            oldAdmin.email = adminEmail;
            oldAdmin.password_hash = adminPasswordHash;
            oldAdmin.role = adminRole;
            await oldAdmin.save();
            res.json({
                message: "User reset to default values",
                User: oldAdmin
            })
        } else {
            const newAdmin = await repository.createUser(admin);
            res.json({
                message: "User created successfully",
                User: newAdmin
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: {
                message: "Error creating default user"
            }
        })
    }

}

export const addExtraUsers = async () => {


    if (process.env.EXTRA_USER_1_USERNAME && process.env.EXTRA_USER_1_PASSWORD && process.env.EXTRA_USER_1_EMAIL && process.env.EXTRA_USER_1_ROLE) {

        await addExtraUser(process.env.EXTRA_USER_1_USERNAME, process.env.EXTRA_USER_1_PASSWORD, process.env.EXTRA_USER_1_EMAIL, process.env.EXTRA_USER_1_ROLE);
    }

    if (process.env.EXTRA_USER_2_USERNAME && process.env.EXTRA_USER_2_PASSWORD && process.env.EXTRA_USER_2_EMAIL && process.env.EXTRA_USER_2_ROLE) {

        await addExtraUser(process.env.EXTRA_USER_2_USERNAME, process.env.EXTRA_USER_2_PASSWORD, process.env.EXTRA_USER_2_EMAIL, process.env.EXTRA_USER_2_ROLE);
    }

    if (process.env.EXTRA_USER_3_USERNAME && process.env.EXTRA_USER_3_PASSWORD && process.env.EXTRA_USER_3_EMAIL && process.env.EXTRA_USER_3_ROLE) {

        await addExtraUser(process.env.EXTRA_USER_3_USERNAME, process.env.EXTRA_USER_3_PASSWORD, process.env.EXTRA_USER_3_EMAIL, process.env.EXTRA_USER_3_ROLE);
    }

    if (process.env.EXTRA_USER_4_USERNAME && process.env.EXTRA_USER_4_PASSWORD && process.env.EXTRA_USER_4_EMAIL && process.env.EXTRA_USER_4_ROLE) {

        await addExtraUser(process.env.EXTRA_USER_4_USERNAME, process.env.EXTRA_USER_4_PASSWORD, process.env.EXTRA_USER_4_EMAIL, process.env.EXTRA_USER_4_ROLE);
    }

    if (process.env.EXTRA_USER_5_USERNAME && process.env.EXTRA_USER_5_PASSWORD && process.env.EXTRA_USER_5_EMAIL && process.env.EXTRA_USER_5_ROLE) {

        await addExtraUser(process.env.EXTRA_USER_5_USERNAME, process.env.EXTRA_USER_5_PASSWORD, process.env.EXTRA_USER_5_EMAIL, process.env.EXTRA_USER_5_ROLE);
    }

    return true;
}