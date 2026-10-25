import { Request, Response } from "express";
import { riskResultDescriptions } from "./riskResultDescriptions";
import repository from "../data/repository/repository";
import ReportSnapshot from "../data/models/ReportSnapshot";
import { ReportChoiceIds, ReportCreationAttributes } from "../controllers/riskCalculationController";
import FundingExchange from "../data/models/FundingExchange";

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

type ReportRisks = {
    name: string,
    ownername: string,
    creatorname: string,
    collaboration: 0 | 1 | 2 | 3,
    country: CountryRisk,
    organization: 0 | 1 | 2 | 3,
    financial: FinancialRisk,
    dualuse: 0 | 1 | 2 | 3,
    ethics: 0 | 1 | 2 | 3,
    organizationname: string,
    organizationtypeother: string,
    collaborationtypeother: string,
    additionalinformation: string,
}

type ReportChoices = {
    country: string | null
    organization: string | string[] | null,
    organizationtype: string | null,
    hhrole: string | null,
    collaborationtype: string | string[] | null,
    history: string | null,
    contract: string | null,
    funding: string | null,
    liability: string | null,
    exchange: string | null,
    personalinformation: string | null,
    dualuse: string | null,
    ethics: string | null,
    duration: string | null,
    organizationtypeother: string | null,
    collaborationtypeother: string | null,
    additionalinformation: string | null,
    name: string | null,
    fundinghistory: string | null,
    fundingsource: string | null,
    consortium: string | null,
    organizationname: string | null,
    ownerusername: string | null,
    creatorusername: string | null

}

//TODO: add stricter type definitions and fix code to accommodate
type ReportChoicesRaw = {
    country: string | null | undefined
    organization: string | string[] | [] | any | null | undefined,
    organizationtype: string | null| undefined,
    hhrole: string | null| undefined,
    collaborationtype: string | string[] | [] | null| undefined,
    history: string | null| undefined,
    contract: string | null| undefined,
    funding: string | null| undefined,
    liability: string | null| undefined,
    exchange: string | null| undefined,
    personalinformation: string | null| undefined,
    dualuse: string | null| undefined,
    ethics: string | null| undefined,
    duration: string | null| undefined,
    organizationtypeother: string | null| undefined,
    collaborationtypeother: string | null| undefined,
    additionalinformation: string | null| undefined,
    name: string | null| undefined,
    fundinghistory: string | null| undefined,
    fundingsource: string | null| undefined,
    consortium: string | null| undefined,
    organizationname: string | null| undefined,
    ownerusername: string | null | undefined,
    creatorusername: string | null| undefined

}

export const parseRiskPayload = (req: Request, res: Response) => {
    const requiredFields = ["country", "organizationtype", "hhrole", "collaborationtype", "history", "contract", "funding", "liability", "personalinformation", "dualuse", "ethics", "duration"]
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

export const generateReportChoices = (choices: ReportChoicesRaw) => {
    const reportChoices: ReportChoices = {
        country: choices.country ? choices.country : "",
        organization: choices.organization ? choices.organization : "",
        organizationtype: choices.organizationtype ? choices.organizationtype : "",
        hhrole: choices.hhrole ? choices.hhrole : "",
        collaborationtype: choices.collaborationtype ? choices.collaborationtype : "",
        history: choices.history ? choices.history : "",
        contract: choices.contract ? choices.contract : "",
        funding: choices.funding ? choices.funding : "",
        liability: choices.liability ? choices.liability : "",
        exchange: choices.exchange ? choices.exchange : "",
        personalinformation: choices.personalinformation ? choices.personalinformation : "",
        dualuse: choices.dualuse ? choices.dualuse : "",
        ethics: choices.ethics ? choices.ethics : "",
        duration: choices.duration ? choices.duration : "",
        organizationtypeother: choices.organizationtypeother ? choices.organizationtypeother : "",
        collaborationtypeother: choices.collaborationtypeother ? choices.collaborationtypeother : "",
        additionalinformation: choices.additionalinformation ? choices.additionalinformation : "",
        name: choices.name ? choices.name : "",
        fundinghistory: choices.fundinghistory ? choices.fundinghistory : "",
        fundingsource: choices.fundingsource ? choices.fundingsource : "",
        consortium: choices.consortium ? choices.consortium : "",
        organizationname: choices.organizationname ? choices.organizationname : "",
        ownerusername: choices.ownerusername ? choices.ownerusername : "",
        creatorusername: choices.creatorusername ? choices.creatorusername : ""
    }

    return reportChoices;
}

export const getReportChoicesFromReport = async (id: number): Promise<ReportChoices | null> => {
    const report = await repository.findReportById(id);
    const reportSnapshot = report?.reportSnapshots ? report?.reportSnapshots[0] : null;

    if (!report) {
        return null;
    }

    const collaborationTypes = report.collaborationTypes ? report.collaborationTypes.map(type => { return type.code }) : []
    const organizations = report.consortium?.organizations ? report.consortium.organizations.map(organizations => { return organizations.id }) : []

    const reportChoicesRaw: ReportChoicesRaw = {
        country: report.country?.code,
        organization: organizations,
        organizationtype: report.organizationType?.code,
        hhrole: report.hhrole?.code,
        collaborationtype: collaborationTypes,
        history: report.collaborationHistory?.code,
        contract: report.contractInfo?.code,
        funding: report.funding?.fundingOption?.code,
        liability: report.liability?.code,
        exchange: report.funding?.fundingExchange?.code,
        personalinformation: report.personalInformation?.code,
        dualuse: report.dualUse?.code,
        ethics: report.ethicsAssessment?.code,
        duration: report.duration?.code,
        name: report.name,
        fundinghistory: report.funding?.fundingHistory?.code,
        fundingsource: report.funding?.fundingSource?.code,
        consortium: report.consortium?.consortiumType?.code,
        ownerusername: reportSnapshot?.ownerUsername ? reportSnapshot.ownerUsername : "",
        creatorusername: reportSnapshot?.creatorUsername ? reportSnapshot.creatorUsername : "",
        organizationname: reportSnapshot?.organizationName ? reportSnapshot.organizationName : "",
        organizationtypeother: reportSnapshot?.organizationOther ? reportSnapshot.organizationOther : "",
        collaborationtypeother: reportSnapshot?.collaborationOther ? reportSnapshot.collaborationOther : "",
        additionalinformation: reportSnapshot?.additionalInformation ? reportSnapshot.additionalInformation : "",
    }

    const reportChoices = generateReportChoices(reportChoicesRaw);

    return reportChoices;
}

export const validateRiskOptions = async (req: Request, res: Response): Promise<ReportChoiceIds | null> => {

    const collaborationHistoryCode = req.body.history;
    const collaborationHistory = await repository.findCollaborationHistoryByCode(collaborationHistoryCode);
    if (!collaborationHistory) {
        res.status(404).json({ message: `Code ${collaborationHistoryCode} is invalid for field history` })
        return null;
    }

    const collaborationTypeCodes = Array.isArray(req.body.collaborationtype) ? req.body.collaborationtype : [req.body.collaborationtype];;
    if (collaborationTypeCodes.length == 0) {
        res.status(404).json({ message: `Collaborationtype codes required` })
        return null;
    }
    let collaborationTypes = [];
    for (let i = 0; i < collaborationTypeCodes.length; i++) {
        const collaborationType = await repository.findCollaborationTypeByCode(collaborationTypeCodes[i]);
        if (!collaborationType) {
            res.status(404).json({ message: `Code ${collaborationTypeCodes[i]} is not a valid code for collaboration type` })
            return null;
        }
        collaborationTypes.push(collaborationType);
    }

    const consortiumTypeCode = req.body.consortium;
    const consortiumType = await repository.findConsortiumTypeByCode(consortiumTypeCode);
    if (!consortiumType) {
        res.status(404).json({ message: `Code ${consortiumTypeCode} is invalid for field consortium` })
        return null;
    }

    const contractInfoCode = req.body.contract;
    const contractInfo = await repository.findContractInfoByCode(contractInfoCode);
    if (!contractInfo) {
        res.status(404).json({ message: `Code ${contractInfoCode} is invalid for field contract` })
        return null;
    }

    const countryCode = req.body.country;
    const country = await repository.findCountryByCode(countryCode);
    if (!country) {
        res.status(404).json({ message: `Code ${countryCode} is invalid for field country` })
        return null;
    }

    const dualUseCode = req.body.dualuse;
    const dualUse = await repository.findDualUseByCode(dualUseCode);
    if (!dualUse) {
        res.status(404).json({ message: `Code ${dualUseCode} is invalid for field dualuse` })
        return null;
    }

    const durationCode = req.body.duration;
    const duration = await repository.findDurationByCode(durationCode);
    if (!duration) {
        res.status(404).json({ message: `Code ${durationCode} is invalid for field duration` })
        return null;
    }

    const ethicsAssessmentCode = req.body.ethics;
    const ethicsAssessment = await repository.findEthicsAssessmentByCode(ethicsAssessmentCode);
    if (!ethicsAssessment) {
        res.status(404).json({ message: `Code ${ethicsAssessmentCode} is invalid for field ethics` })
        return null;
    }

    const hhroleCode = req.body.hhrole;
    const hhrole = await repository.findHHRoleByCode(hhroleCode);
    if (!hhrole) {
        res.status(404).json({ message: `Code ${hhroleCode} is invalid for field hhrole` })
        return null;
    }

    const liabilityCode = req.body.liability;
    const liability = await repository.findLiabilityByCode(liabilityCode);
    if (!liability) {
        res.status(404).json({ message: `Code ${liabilityCode} is invalid for field liability` })
        return null;
    }


    const fundingCode = req.body.funding;
    const funding = await repository.findFundingOptionByCode(fundingCode);
    if (!funding) {
        res.status(404).json({ message: `Code ${funding} is invalid for field funding` })
        return null;
    }

    const organizationTypeCode = req.body.organizationtype;
    const organizationType = await repository.findOrganizationTypeByCode(organizationTypeCode);
    if (!organizationType) {
        res.status(404).json({ message: `Code ${organizationTypeCode} is invalid for field organizationtype` })
        return null;
    }

    const personalInformationCode = req.body.personalinformation;
    const personalInformation = await repository.findPersonalInformationByCode(personalInformationCode);
    if (!personalInformation) {
        res.status(404).json({ message: `Code ${personalInformationCode} is invalid for field personalInformation` })
        return null;
    }

    const ownerUsername = req.body.ownername;
    const ownerUser = await repository.findByUsername(ownerUsername);
    if (!ownerUser) {
        res.status(404).json({ message: `Username ${ownerUsername} is invalid for field ownerusername` })
        return null;
    }

    const creatorUsername = req.body.creatorname;
    const creatorUser = await repository.findByUsername(creatorUsername);
    if (!creatorUser) {
        res.status(404).json({ message: `Username ${creatorUsername} is invalid for field creatorusername` })
        return null;
    }

    const name = req.body.name;
    if (!name) {
        res.status(404).json({ message: `name field cannot be empty` })
        return null;
    }


    const organizationIds = Array.isArray(req.body.organization) ? req.body.organization : [req.body.organization];
    let organization = await repository.findOrganizationById(organizationIds[0]);
    if (!organization) {
        res.status(404).json({ message: `Id ${organizationIds[0]} is invalid for field organization` })
        return null;
    } else if (consortiumTypeCode === "option2") { //multilateral consortium 
        for (let i = 1; i < organizationIds.length; i++) {
            organization = await repository.findOrganizationById(organizationIds[0]);
            if (!organization) {
                res.status(404).json({ message: `Id ${organizationIds[i]} is invalid for field organization` })
                return null;
            }
        }
    }

    let collaborationTypeIds = [];
    for (let i = 0; i < collaborationTypeCodes.length; i++) {
        const collaborationType = await repository.findCollaborationTypeByCode(collaborationTypeCodes[i]);
        if (!collaborationType) {
            res.status(404).json({
                message: `Id ${collaborationTypeCodes[i]} is invalid for collaborationtype`,
                codes: collaborationTypeCodes
            })
            return null;
        }
        collaborationTypeIds.push(collaborationType.id);
    }

    let reportChoiceIds: ReportChoiceIds = {
        name: name,
        userId: ownerUser.id,
        collaborationHistoryId: collaborationHistory.id,
        consortiumTypeId: consortiumType.id,
        organizationIds: organizationIds,
        collaborationTypeIds: collaborationTypeIds,
        contractInfoId: contractInfo.id,
        countryId: country.id,
        dualUseId: dualUse.id,
        durationId: duration.id,
        ethicsAssessmentId: ethicsAssessment.id,
        hhroleId: hhrole.id,
        liabilityId: liability.id,
        fundingTypeId: funding.id,
        fundingExchangeId: funding.code === "option2" ? null : null,
        fundingHistoryId: funding.code === "option2" ? null : null,
        fundingSourceId: funding.code === "option2" ? null : null,
        organizationTypeId: organizationType.id,
        personalInformationId: personalInformation.id
    }

    return reportChoiceIds;
}

export const calculateRisk = async (req: Request) => {
    const { country, organization, organizationtype, hhrole, collaborationtype, history, contract, funding, liability, exchange, personalinformation, dualuse, ethics, duration, organizationother, collaborationtypeother, additionalinformation, name, fundinghistory, fundingsource, consortium, organizationname, ownername, creatorname } = req.body;
    const dualUseRisk = calculateDualUseRisk(dualuse);
    const countryRisk = await calculateCountryRisk(country, personalinformation);
    const ethicsRisk = calculateEthicsRisk(ethics);
    const financialRisk = calculateFinancialRisk(liability, funding, exchange, fundinghistory, fundingsource);
    const collaborationRisk = calculateCollaborationRIsk(countryRisk, collaborationtype, duration, hhrole, contract, history)
    const organizationRisk = await calculateOrganizationRisk(organization);

    let collaborationtypeOptional = "";
    let organizationOptional = "";
    let additionalinformationOptional = "";
    let organizationNameOptional = "";

    if (collaborationtype.includes("option7")) {
        collaborationtypeOptional = collaborationtypeother;
    }
    if (organizationtype === "option5") {
        organizationOptional = organizationother;
    }
    if (additionalinformation) {
        additionalinformationOptional = additionalinformation;
    }
    if (organization) {
        organizationNameOptional = organizationname;
    }
    let ownerName = "Placeholder";
    let creatorName = "Placeholder";
    if (ownername) {
        ownerName = ownername;
    }
    if (creatorname) {
        creatorName = creatorname;
    }

    const reportRisks: ReportRisks = {
        name: name,
        ownername: ownerName,
        creatorname: creatorName,
        collaboration: collaborationRisk,
        country: countryRisk,
        organization: organizationRisk,
        financial: financialRisk,
        dualuse: dualUseRisk,
        ethics: ethicsRisk,
        organizationname: organizationNameOptional,
        organizationtypeother: organizationOptional,
        collaborationtypeother: collaborationtypeOptional,
        additionalinformation: additionalinformationOptional,
    }

    const report = generateVerboseReport(reportRisks);
    return report;
}

export const generateVerboseReport = (risks: ReportRisks) => {

    const report = {
        name: risks.name,
        ownername: risks.ownername,
        creatorname: risks.creatorname,
        collaboration: {
            title: riskResultDescriptions.collaboration.title,
            risk: risks.collaboration,
            description: riskResultDescriptions.collaboration[risks.collaboration]
        },
        country: {
            overall: {
                title: riskResultDescriptions.countryOverall.title,
                risk: risks.country.overall,
                description: riskResultDescriptions.countryOverall[risks.country.overall]
            },
            corruption: {
                title: riskResultDescriptions.countryCorruption.title,
                risk: risks.country.corruption,
                description: riskResultDescriptions.countryCorruption[risks.country.corruption]
            },
            security: {
                title: riskResultDescriptions.countrySecurity.title,
                risk: risks.country.security,
                description: riskResultDescriptions.countrySecurity[risks.country.security]
            },
            academicfreedom: {
                title: riskResultDescriptions.countryAcademic.title,
                risk: risks.country.academicfreedom,
                description: riskResultDescriptions.countryAcademic[risks.country.academicfreedom]

            },
            politicalstability: {
                title: riskResultDescriptions.countryPolitical.title,
                risk: risks.country.politicalstability,
                description: riskResultDescriptions.countryPolitical[risks.country.politicalstability]
            },
            development: {
                title: riskResultDescriptions.countryDevelopment.title,
                risk: risks.country.development,
                description: riskResultDescriptions.countryDevelopment[risks.country.development]
            },
            gdpr: {
                title: riskResultDescriptions.countryGdpr.title,
                risk: risks.country.gdpr,
                description: riskResultDescriptions.countryGdpr[risks.country.gdpr]
            },
            sanctions: {
                title: riskResultDescriptions.countrySanctions.title,
                risk: risks.country.sanctions,
                description: riskResultDescriptions.countrySanctions[risks.country.sanctions]
            },
            ruleoflaw: {
                title: riskResultDescriptions.countryLaw.title,
                risk: risks.country.ruleoflaw,
                description: riskResultDescriptions.countryLaw[risks.country.ruleoflaw]
            }

        },
        organization: {
            title: riskResultDescriptions.organization.title,
            risk: risks.organization,
            description: riskResultDescriptions.organization[risks.organization]
        },
        financial: {
            overall: {
                title: riskResultDescriptions.financial.title,
                risk: risks.financial.overall,
                description: riskResultDescriptions.financial[risks.financial.overall]
            },
            exchange: {
                title: riskResultDescriptions.exchangeRate.title,
                risk: risks.financial.exchange,
                description: riskResultDescriptions.exchangeRate[risks.financial.exchange]
            },
            scope: {
                title: riskResultDescriptions.economicScope.title,
                risk: risks.financial.scope,
                description: riskResultDescriptions.economicScope[risks.financial.scope]
            }

        },
        dualuse: {
            title: riskResultDescriptions.dualUse.title,
            risk: risks.dualuse,
            description: riskResultDescriptions.dualUse[risks.dualuse]
        },
        ethics: {
            title: riskResultDescriptions.ethics.title,
            risk: risks.ethics,
            description: riskResultDescriptions.ethics[risks.ethics]
        },
        organizationname: risks.organizationname,
        organizationtypeother: risks.organizationtypeother,
        collaborationtypeother: risks.collaborationtypeother,
        additionalinformation: risks.additionalinformation
    }

    return report;
}

export const getReportRisksFromReportSnapshot = (reportSnapshot: ReportSnapshot) => {

    const reportRisks: ReportRisks = {
        name: reportSnapshot.name,
        ownername: reportSnapshot.ownerUsername,
        creatorname: reportSnapshot.creatorUsername,
        collaboration: reportSnapshot.collaboration as 0 | 1 | 2 | 3,
        country: {
            overall: reportSnapshot.countryOverall as 0 | 1 | 2 | 3,
            corruption: reportSnapshot.countryCorruption as 0 | 1 | 2 | 3,
            security: reportSnapshot.countrySecurity as 0 | 1 | 2 | 3,
            academicfreedom: reportSnapshot.countryAcademicFreedom as 0 | 1 | 2 | 3,
            politicalstability: reportSnapshot.countryPoliticalStability as 0 | 1 | 2 | 3,
            development: reportSnapshot.countryDevelopment as 0 | 1 | 2 | 3,
            gdpr: reportSnapshot.countryGdpr as 0 | 1 | 2 | 3,
            sanctions: reportSnapshot.countrySanctions as 0 | 1 | 2 | 3,
            ruleoflaw: reportSnapshot.countryRuleOfLaw as 0 | 1 | 2 | 3
        },
        organization: reportSnapshot.organization as 0 | 1 | 2 | 3,
        financial: {
            overall: reportSnapshot.financialOverall as 0 | 1 | 2 | 3,
            scope: reportSnapshot.financialScope as 0 | 1 | 2 | 3,
            exchange: reportSnapshot.financialExchange as 0 | 1 | 2 | 3
        },
        dualuse: reportSnapshot.dualUse as 0 | 1 | 2 | 3,
        ethics: reportSnapshot.ethics as 0 | 1 | 2 | 3,
        organizationname: reportSnapshot.organizationName,
        organizationtypeother: reportSnapshot.organizationOther,
        collaborationtypeother: reportSnapshot.collaborationOther,
        additionalinformation: reportSnapshot.additionalInformation,
    }

    return reportRisks;
}

const calculateCollaborationRIsk = (countryRisk: CountryRisk, collaborationType: any, duration: any, hhrole: any, contract: any, history: any): 0 | 1 | 2 | 3 => {
    if (!countryRisk) {
        return 0;
    } else if (countryRisk.sanctions === 3) { //All project to sanctioned countries have risk of 3
        return 3;
    }
    let roleMultiplier = 1;
    let durationMultiplier = 1;
    let contractMultiplier = 1;
    let historyMultiplier = 1;
    let securityMultiplier = 1;
    let sanctionsMultiplier = 1;

    if (hhrole !== "option1" && hhrole !== "option2" && hhrole !== "option3") {
        return 0;
    } else if (hhrole === "option1") {
        roleMultiplier = 1.2;
    }


    let consortiumRisk = 0; //implement calculation once risk calculation for consortiums is supported

    let durationRisk = 0;

    if (duration !== "option1" && duration !== "option2" && duration !== "option3") {
        return 0;
    } else if (duration === "option1") {
        durationRisk = 1;
    } else if (duration === "option2") {
        durationRisk = 2;
    } else if (duration === "option3") {
        durationRisk = 3;
        durationMultiplier = 1.2;
    }

    if (contract !== "option1" && contract !== "option2") {
        return 0;
    } else if (contract === "option2") {
        contractMultiplier = 1.2;
    }

    if (history !== "option1" && history !== "option2") {
        return 0;
    } else if (history === "option2") {
        historyMultiplier = 1.2;
    }

    for (let i = 0; i < collaborationType.length; i++) {
        if (collaborationType[i] === "option1") {
            //sanctionsMultiplier = 1.5; //Sanctions mean automatic risk of 3, implement multiplier if this is changed
        }
        if (collaborationType[i] === "option4" || collaborationType[i] === "option5" && countryRisk.security > 1) {
            securityMultiplier = 1.5;
        }
    }

    const sanctions = countryRisk.sanctions * sanctionsMultiplier;
    const security = countryRisk.security * securityMultiplier;

    const risks = [sanctions, security, countryRisk.corruption, countryRisk.academicfreedom, countryRisk.politicalstability, countryRisk.development, countryRisk.gdpr, countryRisk.ruleoflaw, durationRisk]
    const risksSum = risks.reduce((acc, e) => acc + e, 0);
    let validRisks = 0;
    let highRisks = 0;
    for (let i = 0; i < risks.length; i++) {
        if (risks[i] != 0) {
            validRisks++;
        }
        if (risks[i] == 3) {
            highRisks++;
        }
    }
    if (highRisks >= 3) { //3 or more high risks trigger automatic overall risk of 3
        return 3;
    }

    const average = risksSum / validRisks;
    const multipliedAverage = average * roleMultiplier * durationMultiplier * contractMultiplier;

    let roundedAverage = Math.round(multipliedAverage) as 0 | 1 | 2 | 3;

    if (average > 3) roundedAverage = 3;
    if (average < 1) roundedAverage = 0;

    return roundedAverage;

}


const calculateCountryRisk = async (countryCode: any, personal: any): Promise<CountryRisk> => {

    /*
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
*/

    const country = await repository.findCountryByCode(countryCode);

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

    if ((personal !== "option1" && personal !== "option2") && country.gdpr !== 1) {
        countryRisk.gdpr = 0;
    } else if (personal === "option2" || country.gdpr === 1) {
        countryRisk.gdpr = 1;
    } else if (personal !== "option2" && country.gdpr === 2) {
        countryRisk.gdpr = 2;
    } else if (personal !== "option2" && country.gdpr === 3) {
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

const calculateOrganizationRisk = async (id: string): Promise<0 | 1 | 2 | 3> => {
    if (!id) {
        return 0;
    }
    const idNumber = Number.parseInt(id);
    if (Number.isNaN(idNumber)) {
        return 0;
    }
    const organization = await repository.findOrganizationById(idNumber)
    if (!organization || organization.code === "other") {
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

const calculateFinancialRisk = (liability: any, funding: any, exchange: any, fundinghistory: any, fundingsource: any): FinancialRisk => {
    let financialRisk = {
        "overall": 0 as 0 | 1 | 2 | 3,
        "exchange": 0 as 0 | 1 | 2 | 3,
        "scope": 0 as 0 | 1 | 2 | 3
    }

    if (liability === "option1") {
        financialRisk.scope = 1;
    } else if (liability === "option2") {
        financialRisk.scope = 2;
    } else if (liability === "option3") {
        financialRisk.scope = 3;
    }

    if (funding === "option2") {
        financialRisk.exchange = 1
    } else if (exchange === "option1") {
        financialRisk.exchange = 1;
    } else if (exchange === "option2") {
        financialRisk.exchange = 2;
    } else if (exchange === "option3") {
        financialRisk.exchange = 3;
    }

    financialRisk.overall = calculateFinancialRiskOverall(financialRisk.scope, financialRisk.exchange, funding, fundinghistory, fundingsource);

    return financialRisk;
}

const calculateFinancialRiskOverall = (scope: number, exchange: number, funding: any, fundinghistory: any, fundingsource: any): 0 | 1 | 2 | 3 => {
    let additionalRisk = 0;
    if (!funding || (funding === "option1" && (!fundinghistory || !fundingsource))) {
        return 0; //remove comment once front end side has been implemented
    } else if (funding === "option2") {
        additionalRisk = 0;
    } else if (fundinghistory === "option1") {
        additionalRisk = 0;
    } else if (fundingsource === "option3" || fundingsource === "option7") {
        additionalRisk = 1;
    } else {
        return 0;
    }


    if (scope == 0 || exchange == 0) {
        return 0;
    }

    let overall = (scope + exchange + additionalRisk) / 2;
    if (overall < 1) {
        overall = 0;
    } else if (overall > 3) {
        overall = 3;
    }
    const roundedOverall = Math.round(overall) as 0 | 1 | 2 | 3;

    return roundedOverall;
}
