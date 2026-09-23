import { Request, Response } from "express";
import { riskResultDescriptions } from "./riskResultDescriptions";
import repository from "../data/repository/repository";

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

type FinancialRisk = {
    "overall": 0 | 1 | 2 | 3,
    "scope": 0 | 1 | 2 | 3,
    "exchange": 0 | 1 | 2 | 3
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


export const calculateRisk = async (req: Request) => {
    const { country, organization, organizationtype, hhrole, collaborationtype, history, contract, funding, liability, exchange, personalinformation, dualuse, ethics, duration, organizationother, collaborationtypeother, additionalinformation } = req.body;
    const dualUseRisk = calculateDualUseRisk(dualuse);
    const countryRisk = await calculateCountryRisk(country, personalinformation);
    const ethicsRisk = calculateEthicsRisk(ethics);
    const financialRisk = calculateFinancialRisk(liability, funding, exchange);
    const collaborationRisk = calculateCollaborationRIsk(countryRisk, collaborationtype)
    const organizationRisk = await calculateOrganizationRisk(organization);

    let collaborationtypeOptional = "";
    let organizationOptional = "";
    let additionalinformationOptional = "";

    if (collaborationtype.includes("option7")) {
        collaborationtypeOptional = collaborationtypeother;
    }
    if (organizationtype === "option5") {
        organizationOptional = organizationother;
    }
    if (additionalinformation) {
        additionalinformationOptional = additionalinformation;
    }

    const report = {
        collaboration: {
            title: riskResultDescriptions.collaboration.title,
            risk: collaborationRisk,
            description: riskResultDescriptions.collaboration[collaborationRisk]
        },
        country: {
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
            }, 
            development: {
                title: riskResultDescriptions.countryDevelopment.title,
                risk: countryRisk.development,
                description: riskResultDescriptions.countryDevelopment[countryRisk.development]
            },
            gdpr: {
                title: riskResultDescriptions.countryGdpr.title,
                risk: countryRisk.gdpr,
                description: riskResultDescriptions.countryGdpr[countryRisk.gdpr]
            },
            sanctions: {
                title: riskResultDescriptions.countrySanctions.title,
                risk: countryRisk.sanctions,
                description: riskResultDescriptions.countrySanctions[countryRisk.sanctions]
            },
            ruleoflaw: {
                title: riskResultDescriptions.countryLaw.title,
                risk: countryRisk.ruleoflaw,
                description: riskResultDescriptions.countryLaw[countryRisk.ruleoflaw]
            }

        },
        organization: {
            title: riskResultDescriptions.organization.title,
            risk: organizationRisk,
            description: riskResultDescriptions.organization[organizationRisk]
        },
        financial: {
            overall: {
                title: riskResultDescriptions.financial.title,
                risk: financialRisk.overall,
                description: riskResultDescriptions.financial[financialRisk.overall]
            },
            exchange: {
                title: riskResultDescriptions.exchangeRate.title,
                risk: financialRisk.exchange,
                description: riskResultDescriptions.exchangeRate[financialRisk.exchange]
            },
            scope: {
                title: riskResultDescriptions.economicScope.title,
                risk: financialRisk.scope,
                description: riskResultDescriptions.economicScope[financialRisk.scope]
            }

        },
        dualuse: {
            title: riskResultDescriptions.dualUse.title,
            risk: dualUseRisk,
            description: riskResultDescriptions.dualUse[dualUseRisk]
        },
        ethics: {
            title: ethicsRisk,
            risk: ethicsRisk,
            description: riskResultDescriptions.ethics[ethicsRisk]
        },
        organizationother: organizationOptional,
        collaborationtypeother: collaborationtypeOptional,
        additionalinformation: additionalinformationOptional,
        realCalculationImpementedFor: [
            "Functionanility that was present in frontend should be fully implemented. Leaving this field here to be reused when currently missing functionality has been mapped and is being implemented in future sprints."
        ]
    }
    return report;
}

const calculateCollaborationRIsk = (countryRisk: CountryRisk, collaborationType: any): 0 | 1 | 2 | 3 => {
    if (!countryRisk) {
        return 0;
    } else if (countryRisk.sanctions === 3) {
        return 3;
    }

    let securityMultiplier = 1;
    let sanctionsMultiplier = 1;
    for (let i = 0; i < collaborationType.length; i++) {
        if (collaborationType[i] === "option1") {
            sanctionsMultiplier = 1.5;
        }
        if (collaborationType[i] === "option4" || collaborationType[i] === "option5" && countryRisk.security > 1) {
            securityMultiplier = 1.5;
        }
    }

    const sanctions = countryRisk.sanctions * sanctionsMultiplier;
    const security = countryRisk.security * securityMultiplier;

    const average = (sanctions + security + countryRisk.corruption + countryRisk.academicfreedom + countryRisk.politicalstability + countryRisk.development + countryRisk.gdpr + countryRisk.ruleoflaw) / 8;
    let roundedAverage = Math.round(average) as 0 | 1 | 2 | 3;

    if (average > 3) roundedAverage = 3;
    if (average < 1) roundedAverage = 0;

    return roundedAverage;
}

const calculateCountryRisk = async (countryCode: any, personal: any): Promise<CountryRisk> => {
    let personalinformation = personal;
    if (personalinformation != "option1" || personalinformation != "option2") {
        personalinformation = 0;
    }

    //placeholders until database integration
    let countriesPlaceholder = [{
        name: {
            en: "United States of America",
            fi: "Yhdysvallat"
        },
        id: "USA",
        dataYear: 2025,
        risk: {
            corruption: 83.02,
            security: 1,
            academicFreedom: 0.397,
            politicalStability: 47.39,
            development: -1,
            gdpr: 2,
            sanctions: 1,
            ruleOfLaw: 0.67977332
        }
    },
    {
        name: {
            en: "Sweden",
            fi: "Ruotsi"
        },
        id: "SWE",
        dataYear: 2025,
        risk: {
            corruption: 97.64,
            security: 1,
            academicFreedom: 0.934,
            politicalStability: 73.46,
            development: 5,
            gdpr: 1,
            sanctions: 1,
            ruleOfLaw: 0.85227449
        }
    },
    {
        name: {
            en: "China",
            fi: "Kiina"
        },
        id: "CHN",
        dataYear: 2025,
        risk: {
            corruption: 54.25,
            security: 1,
            academicFreedom: 0.071,
            politicalStability: 25.12,
            development: 78,
            gdpr: 3,
            sanctions: 3,
            ruleOfLaw: 0.47709017
        }
    }
    ]
    const countryRaw = countriesPlaceholder.find((country) => country.id === countryCode);
    const country = countryRaw?.risk;
    //placeholders end 

   /*
    const country = await repository.findCountryByCountryId(countryCode);
*/
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

    if (!country) {
        return countryRisk;
    }

    if (country.security == 0 || country.security == 1 || country.security == 2 || country.security == 3) {
        countryRisk.security = country.security;
    }

    if (country.corruption > 66.666) {
        countryRisk.corruption = 1;
    } else if (country.corruption <= 66.666 && country.corruption > 33.333) {
        countryRisk.corruption = 2;
    } else if (country.corruption <= 33.333) {
        countryRisk.corruption = 3;
    }

    if (country.academicFreedom > 0.66) {
        countryRisk.academicfreedom = 1;
    } else if (country.academicFreedom > 0.33 && country.academicFreedom <= 0.66) {
        countryRisk.academicfreedom = 2;
    } else if (country.academicFreedom <= 0.33) {
        countryRisk.academicfreedom = 3;
    }

    if (country.politicalStability > 66.666) {
        countryRisk.politicalstability = 1;
    } else if (country.politicalStability <= 66.666 && country.politicalStability > 33.333) {
        countryRisk.politicalstability = 2;
    } else if (country.politicalStability <= 33.333) {
        countryRisk.politicalstability = 3;
    }

    if (country.development >= 1 && country.development <= 64) {
        countryRisk.development = 1;
    } else if (country.development >= 65 && country.development <= 128) {
        countryRisk.development = 2;
    } else if (country.development >= 129) {
        countryRisk.development = 3;
    }

    if (personalinformation == 0 && !(country.gdpr === 1)) {
        countryRisk.gdpr = 0;
    } else if (personalinformation === "option2" || country.gdpr=== 1) {
        countryRisk.gdpr = 1;
    } else if (personalinformation !== "option2" && country.gdpr === 2) {
        countryRisk.gdpr = 2;
    } else if (personalinformation !== "option2" && country.gdpr === 3) {
        countryRisk.gdpr = 3
    }

    if (country.sanctions == 1) {
        countryRisk.sanctions = 1;
    } else if (country.sanctions == 3) {
        countryRisk.sanctions = 3;
    }

    if (country.ruleOfLaw >= 0.7) {
        countryRisk.ruleoflaw = 1;
    } else if (country.ruleOfLaw >= 0.45 && country.ruleOfLaw < 0.7) {
        countryRisk.ruleoflaw = 2;
    } else if (country.ruleOfLaw < 0.45) {
        countryRisk.ruleoflaw = 3;
    }

    if (countryRisk.ruleoflaw != 0 || countryRisk.development != 0 || countryRisk.politicalstability != 0 || countryRisk.academicfreedom != 0 || countryRisk.corruption != 0) {
        const roundedAverage = Math.round((countryRisk.corruption + country.security + countryRisk.academicfreedom + countryRisk.politicalstability + countryRisk.development + countryRisk.gdpr + countryRisk.sanctions + countryRisk.ruleoflaw) / 8)
        if (roundedAverage === 1 || roundedAverage === 2 || roundedAverage === 3) {
            countryRisk.overall = roundedAverage;
        }
    }

    return countryRisk;
}

const calculateOrganizationRisk = async (code: string): Promise<0 | 1 | 2 | 3> => {
    if (!code) {
        return 0;
    }
    const organization = await repository.findOrganizationById(code)
    if (!organization) {
        return 3;
    }
    return 1;
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

const calculateFinancialRisk = (liability: any, funding: any, exchange: any): FinancialRisk => {
    let financialRisk = {
        "overall": 0 as 0 | 1 | 2 | 3,
        "exchange": 0 as 0 | 1 | 2 | 3,
        "scope": 0 as 0 | 1 | 2 | 3
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

const calculateFinancialRiskOverall = (scope: number, exchange: number): 0 | 1 | 2 | 3 => {

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
