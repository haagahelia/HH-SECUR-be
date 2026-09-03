import { Request, Response } from "express";

export const tokenStatus = async (req: Request, res: Response) => {
    res.json({ token: "accepted"});
}