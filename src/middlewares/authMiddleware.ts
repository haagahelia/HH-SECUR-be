import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      message: "Invalid authorization header",
    });
    return;
  }

  try {
    const payload = verifyToken(token);

    req.user = payload;

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}