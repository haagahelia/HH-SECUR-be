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

  const user = await repository.findByEmail(req.user.email);

  /*
  //change to use db check after db is used on deployed version
  const hashedPassword = "$2a$10$HN7AR4scRDb2fvtUA7u2DO/C5g0MvgsZ2Q8f.Jp3ZSepfJj0OfFcu"; //password
  const hashedAdminPassword = "$2a$10$tb1ZscEiK9ODOc2FYvMHh.i0Xi4Zp4fqa8LYn8jSuFucBBjw.kRkG" //adminPassword
  const tempUsers = [{ id: 123, username: "user", passwordHash: hashedPassword, email: "user@testing.com", role: "user" }, { id: 124, username: "admin", passwordHash: hashedAdminPassword, email: "admin@testing.com", role: "admin" }];
  const email = req.user.email;
  const user = tempUsers.find( 
    (user) => user.email === email
  );
*/



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