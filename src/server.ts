import express, { Request, Response } from "express";
import { createRoutes } from "./routes/routes.js";

export const createServer = () => {
    const app = express ();

    app
        .use(express.json());

    app.get("/status", (req: Request, res: Response) => {
        res.json({ ok: true});
    });

    createRoutes(app);

    return app;
}