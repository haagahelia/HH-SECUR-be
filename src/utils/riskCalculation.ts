import { Request, Response } from "express";
import { riskResultDescriptions } from "./riskResultDescriptions";

type CountryRisk = {
    "overall": 0 | 1 | 2 | 3,
    "corruption": 0 | 1 | 2 | 3,
    "security": 0 | 1 | 2 | 3,
    "academicfreedom": 0 | 1 | 2 | 3,
    "politicalstability": 0 | 1 | 2 | 3,
    "development": 0 | 1 | 2 | 3,
    "gdpr": 0 | 1 | 2 | 3,
    "sanctions": 0 | 1 | 2 | 3,
    "ruleoflaw": 0 | 1 | 2 | 3,
}

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
    const { country, organization, organizationtype, hhrole, collaborationtype, history, contract, funding, liability, exchange, personalinformation, dualuse, ethics, duration, organizationother, collaborationtypeother, additionalinformation } = req.body;
    const dualUseRisk = calculateDualUseRisk(dualuse);
    const countryRisk = calculateCountryRisk(country);
    const ethicsRisk = calculateEthicsRisk(ethics);
    const financialRisk = calculateFinancialRisk(liability, funding, exchange);

    //Placeholders to be replacedby functions
    const collaborationRisk = 3;
    const organizationRisk = 3;

    const report = {
        collaboration: {
            title: riskResultDescriptions.collaboration.title,
            risk: collaborationRisk,
            description: riskResultDescriptions.collaboration[collaborationRisk]
        },
        countryrisk: {
            overall: {
                title: riskResultDescriptions.countryOverall.title,
                risk: countryRisk.overall,
                description: riskResultDescriptions.countryOverall[countryRisk.overall]
            },
            corruption: {
                title: riskResultDescriptions.countryCorruption.title,
                risk: countryRisk.corruption,
                description: riskResultDescriptions.countryCorruption[countryRisk.corruption]
            },
            security: {
                title: riskResultDescriptions.countrySecurity.title,
                risk: countryRisk.security,
                description: riskResultDescriptions.countrySecurity[countryRisk.security]
            },
            academicfreedom: {
                title: riskResultDescriptions.countryAcademic.title,
                risk: countryRisk.academicfreedom,
                description: riskResultDescriptions.countryAcademic[countryRisk.academicfreedom]

            },
            politicalstability: {
                title: riskResultDescriptions.countryPolitical.title,
                risk: countryRisk.politicalstability,
                description: riskResultDescriptions.countryPolitical[countryRisk.politicalstability]
            }

        },
        organizationrisk: {
            title: riskResultDescriptions.organization.title,
            risk: organizationRisk,
            description: riskResultDescriptions.organization[organizationRisk]
        },
        financialrisk: {
            title: riskResultDescriptions.financial.title,
            risk: financialRisk
        },
        dualuserisk: {
            title: riskResultDescriptions.dualUse.title,
            risk: dualUseRisk,
            description: riskResultDescriptions.dualUse[dualUseRisk]
        },
        ethicsrisk: {
            title: ethicsRisk,
            risk: ethicsRisk,
            description: riskResultDescriptions.ethics[ethicsRisk]
        },
        realCalculationImpementedFor: [
            "dualuserisk",
            "ethicsrisk",
            "financialrisk"
        ]
    }

    return report;
}

const calculateCountryRisk = (countryCode: any): CountryRisk => {
    let countryRisk =
    {
        "overall": 0 as 0 | 1 | 2 | 3,
        "corruption": 0 as 0 | 1 | 2 | 3,
        "security": 0 as 0 | 1 | 2 | 3,
        "academicfreedom": 0 as 0 | 1 | 2 | 3,
        "politicalstability": 0 as 0 | 1 | 2 | 3,
        "development": 0 as 0 | 1 | 2 | 3,
        "gdpr": 0 as 0 | 1 | 2 | 3,
        "sanctions": 0 as 0 | 1 | 2 | 3,
        "ruleoflaw": 0 as 0 | 1 | 2 | 3,
    }

    //Add risk calculation logic
    if (countryCode) {
        countryRisk.overall = 3;
        countryRisk.corruption = 3;
        countryRisk.security = 3;
        countryRisk.academicfreedom = 3;
        countryRisk.politicalstability = 3;
        countryRisk.development = 3;
        countryRisk.gdpr = 3;
        countryRisk.sanctions = 3;
        countryRisk.ruleoflaw = 3;
    }

    return countryRisk;
}

const calculateDualUseRisk = (dualUse: string): 0 | 1 | 2 | 3 => {
    let dualUseRisk = 0 as 0 | 1 | 2 | 3;

    if (dualUse === "option1") {
        dualUseRisk = 1;
    } else if (dualUse === "option2") {
        dualUseRisk = 2;
    } else if (dualUse === "option3") {
        dualUseRisk = 3;
    }
    return dualUseRisk;
}

const calculateEthicsRisk = (ethics: any): 0 | 1 | 2 | 3 => {
    let ethicsRisk = 0 as 0 | 1 | 2 | 3;

    if (ethics === "option1") {
        ethicsRisk = 1;
    } else if (ethics === "option2" || ethics === "option3") {
        ethicsRisk = 2;
    } else if (ethics === "option4" || ethics === "option5") {
        ethicsRisk = 3;
    }
    return ethicsRisk;
}

const calculateFinancialRisk = (liability: any, funding: any, exchange: any) => {
    let financialRisk = {
        "overall": 0,
        "exchange": 0,
        "scope": 0
    }

    if (liability && funding && exchange) {
        financialRisk.overall = 3;
    }

    if (liability === "option1") {
        financialRisk.scope = 1;
    } else if (liability === "option2") {
        financialRisk.scope = 2;
    } else if (liability === "option3") {
        financialRisk.scope = 3;
    }

    if (exchange === "option1") {
        financialRisk.exchange = 1;
    } else if (exchange === "option2") {
        financialRisk.exchange = 2;
    } else if (exchange === "option3") {
        financialRisk.exchange = 3;
    }

    financialRisk.overall = calculateFinancialRiskOverall(financialRisk.scope, financialRisk.exchange);

    return financialRisk;
}

const calculateFinancialRiskOverall = (scope: number, exchange: number): 0 | 1 | 2 | 3 =>{

    if (scope == 0 || exchange == 0) {
        return 0;
    }
    let overall = (scope + exchange) / 2;
    if (overall < 1) {
        overall = 0;
    } else if (overall > 3) {
        overall = 3;
    }
    const roundedOverall = Math.round(overall) as 0 | 1 | 2 | 3;

    return roundedOverall;
}
