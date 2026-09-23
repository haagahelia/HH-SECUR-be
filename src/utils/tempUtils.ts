import bcrypt from "bcrypt";
import dotenv from "dotenv";
import repository from "../data/repository/repository.js";
import User from "../data/models/User.js";

dotenv.config();

export const internalAddDefaultUser = async () => {

    if (!process.env.DEFAULT_USER_PASSWORD || !process.env.DEFAULT_USER_USERNAME || !process.env.DEFAULT_USER_EMAIL || !process.env.DEFAULT_USER_ROLE) {
        return false;
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
            return true;
        } else {
            const newUser = await repository.createUser(user);
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const internalAddDefaultAdmin = async () => {

    if (!process.env.DEFAULT_ADMIN_PASSWORD || !process.env.DEFAULT_ADMIN_USERNAME || !process.env.DEFAULT_ADMIN_EMAIL || !process.env.DEFAULT_ADMIN_ROLE) {
        return false;
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
            return true;
        } else {
            const newAdmin = await repository.createUser(admin);
            return true;;
        }
    } catch (error) {
        console.log(error);
        return false;
    }

}