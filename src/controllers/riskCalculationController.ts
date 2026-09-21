import { Request, Response } from "express";
import { calculateRisk, parseRiskPayload } from "../utils/riskCalculation";

export const generateReport = async (req: Request, res: Response) => {
    if (!parseRiskPayload(req, res)) {
        return;
    }
    const report = calculateRisk(req);
    res.json(report);
}

