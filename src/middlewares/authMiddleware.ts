import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import repository from "../data/repository/repository.js";

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

// Must run after authenticate. Lets the request through only if the logged-in user
// created the report, or is an admin.
export async function requireReportOwner(
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

  const idRaw = String(req.params.id);
  const id = parseInt(idRaw, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({
      message: `Requested id ${idRaw} is not a number`,
    });
    return;
  }

  const report = await repository.findReportById(id);
  if (!report) {
    res.status(404).json({
      message: `Report by the id of ${id} does not exist`,
    });
    return;
  }

  const creator = report.reportSnapshots?.[0]?.creatorUsername;
  if (creator && creator === req.user.username) {
    next();
    return;
  }

  const user = await repository.findByEmail(req.user.email);
  if (user?.role === "admin") {
    next();
    return;
  }

  res.status(403).json({
    message: "You do not own this report",
  });
}