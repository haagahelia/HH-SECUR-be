import { NextFunction, Request, Response } from "express";
import { ConnectionError, DatabaseError, ValidationError } from "sequelize";

export default function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (res.headersSent) {
        return next(error);
    } if (error instanceof ValidationError) {
        return res.status(422).json({
            error: "Validation error",
            details: error.errors
        });
    } if (error instanceof ConnectionError) {
        return res.status(503).json({
            error: "Database unavailable"
        });
    } if (error instanceof DatabaseError) {
        return res.status(500).json({
            error: getErrorMessage(error)
        });
    } if (error instanceof Error) {
        return res.status(400).json({
            error: "Unknown error",
            details: getErrorMessage(error)
        });
    }
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    } if (typeof error === "string") {
        return error;
    } return "An error occurred";
}