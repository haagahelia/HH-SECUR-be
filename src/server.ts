import express, { Request, Response } from "express";
import { createRoutes } from "./routes/routes.js";

export const createServer = () => {
    const app = express ();

    app.get("/status", (req: Request, res: Response) => {
        res.json({ ok: true});
    });

    createRoutes(app);

    return app;
}