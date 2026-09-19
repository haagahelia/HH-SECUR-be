import { Request, Response } from "express";
import { parseRiskPayload } from "../utils/riskCalculation";


export const calculateRisk = async (req: Request, res: Response) => {
    if (parseRiskPayload(req, res)) {
        res.json({ risk: true })
    }

}

