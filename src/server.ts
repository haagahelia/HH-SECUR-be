import express, { Request, Response } from "express";
import cors from "cors";
import { createRoutes } from "./routes/routes.js";

/*
const corsOptions = {
    origin: 'https://example.com'
}
*/

export const createServer = () => {
    const app = express ();

    app
        .use(express.json())
        .use(cors()); //allows all, change to cors(corsOptions), uncomment corsOptions and define allowed origins to set specific allowed origins

    app.get("/status", (req: Request, res: Response) => {
        res.json({ ok: true});
    });

    createRoutes(app);

    return app;
}