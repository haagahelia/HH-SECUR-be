import express, { Request, Response } from "express";

export const createServer = () => {
    const app = express ();

    app.get("/status", (req: Request, res: Response) => {
        res.json({ ok: true});
    });

    return app;
}