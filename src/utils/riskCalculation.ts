import { Request, Response } from "express";

export const parseRiskPayload = (req: Request, res: Response) => {
    const requiredFields = ["country", "organization", "organizationtype", "hhrole", "collaborationtype", "history", "contract", "funding", "liability", "exchange", "personalinformation", "dualuse", "ethics", "duration"]
    let missingFields: string[] = [];
    for (let i = 0; i < requiredFields.length; i++) {
        if (!req.body[requiredFields[i]]) {
            missingFields.push(requiredFields[i])
        }
    }

    if (missingFields.length == 0) {
        return true
    } else {
        res.status(422).json({ message: "Missing fields", missing: missingFields })
    }
}


export const calculateRisk = (req: Request) => {
    const { country, organization, organizationtype, hhrole, collaborationtype, history, contract, funding, liability, exchange, personalinformation, dualuse, ethics, duration } = req.body;
    const dualUseRisk = calculateDualUseRisk(dualuse);
    const countryRisk = calculateCountryRisk(country);
    const ethicsRisk = calculateEthicsRisk(ethics);
    const financialRisk = calculateFinancialScopeRisk(liability);

    //Placeholders to be replacedby functions
    const collaborationRisk = 3;
    const organizationRisk = 3;

    const report = {
        collaborationrisk: collaborationRisk,
        countryrisk: countryRisk,
        organizationrisk: organizationRisk,
        financialrisk: financialRisk,
        dualuserisk: dualUseRisk,
        ethicsrisk: ethicsRisk,
        realCalculationImplementedFor: ["dualUseRisk"]
    }

    return report;
}

const calculateCountryRisk = (countryCode: any) => {
    let country =
    {
        "overall": 0,
        "corruption": 0,
        "security": 0,
        "academicfreedom": 0,
        "politicalstability": 0,
        "development": 0,
        "gdpr": 0,
        "sanctions": 0,
        "ruleoflaw": 0,
    }

    //Add risk calculation logic
    if (countryCode) {
        country.overall = 3;
        country.corruption = 3;
        country.security = 3;
        country.academicfreedom = 3;
        country.politicalstability = 3;
        country.development = 3;
        country.gdpr = 3;
        country.sanctions = 3;
        country.ruleoflaw = 3;
    }
    return country;
}

const calculateDualUseRisk = (dualUse: string): 0 | 1 | 2 | 3 => {
    let dualUseRisk = 0 as 0 | 1 | 2 | 3;

    //Add risk calculation logic
    if (dualUse === "no") {
        dualUseRisk = 1;
    } else if (dualUse === "unknown") {
        dualUseRisk = 2;
    } else if (dualUse === "yes") {
        dualUseRisk = 3;
    }
    return dualUseRisk;
}

const calculateEthicsRisk = (ethics: any): 0 | 1 | 2 | 3 => {
    let ethicsRisk = 0 as 0 | 1 | 2 | 3;

    //Add risk calculation logic
    if (ethics) {
        ethicsRisk = 3;
    }
    return ethicsRisk;
}

const calculateFinancialScopeRisk = (financial: any) => {
    let financialRisk = {
        "overall": 0,
        "exchange": 0,
        "scope": 0
    }

    //Add risk calculation logic
    if (financial) {
        financialRisk.overall = 3;
        financialRisk.exchange = 3;
        financialRisk.scope = 3;
    }

    return financialRisk;
}

const calculateFinancialRiskOverall = (scope: number, exchange: number): 0 | 1 | 2 | 3 => {
    let overall = 0 as 0;

    //Add risk calculation logic
    return overall;
}

