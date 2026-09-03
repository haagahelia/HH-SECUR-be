import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/jwt.js";

const hashedPassword = await bcrypt.hash("password", 10); //Remove after user db implementation
const users = [{ id: 123, username: "user", passwordHash: hashedPassword }]; //Remove after user db implementation

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({
            message: "Username and password are required",
        });
        return;
    }

    const user = users.find( //Replace with db lookup once user in db is implemented
        (user) => user.username === username
    );

    if (!user) {
        res.status(401).json({
            message: "Invalid username or password",
        });
        return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        res.status(401).json({
            message: "Invalid username or password",
        });
        return;
    }

    const token = generateToken({
        userId: user.id,
        username: user.username,
    });

    res.json({
        message: "Login successful",
        token,
    });
}