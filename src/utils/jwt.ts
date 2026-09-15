import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import repository from "../data/repository/repository";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export type UserRole = "user" | "admin";

export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  if (!req.user.email) {
    res.status(400).json({
      message: "Token payload incomplete",
    })
    return;
  }

  const user = await repository.findByEmail(req.user.email);
  if (!user) {
    res.status(401).json({
      message: "User no longer exists",
    });
    return;
  }

  if (user.role !== "admin") {
    res.status(403).json({
      message: "Admin access required",
    });
    return;
  }


  next();
}