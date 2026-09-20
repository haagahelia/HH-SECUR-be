import { Request, Response } from "express";
import { calculateRisk, parseRiskPayload } from "../utils/riskCalculation";

type Report = {
    dualUse: 0 | 1 | 2 | 3
}


export const generateReport = async (req: Request, res: Response) => {
    if (!parseRiskPayload(req, res)) {
        return;
    }
    const report = calculateRisk(req);
    res.json(report);
}

