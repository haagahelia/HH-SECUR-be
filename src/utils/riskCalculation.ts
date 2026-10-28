import { Request, Response } from "express";
import { riskResultDescriptions } from "./riskResultDescriptions";
import repository from "../data/repository/repository";
import ReportSnapshot from "../data/models/ReportSnapshot";
import { ReportChoiceIds } from "../controllers/riskCalculationController";
import CollaborationType from "../data/models/CollaborationType";
import { parseIntArray } from "./utils";

type CountryRisk = {
    overall: 0 | 1 | 2 | 3,
    corruption: 0 | 1 | 2 | 3,
    security: 0 | 1 | 2 | 3,
    academicfreedom: 0 | 1 | 2 | 3,
    politicalstability: 0 | 1 | 2 | 3,
    development: 0 | 1 | 2 | 3,
    gdpr: 0 | 1 | 2 | 3,
    sanctions: 0 | 1 | 2 | 3,
    ruleoflaw: 0 | 1 | 2 | 3,
}

type FinancialRisk = {
    overall: 0 | 1 | 2 | 3,
    scope: 0 | 1 | 2 | 3,
    exchange: 0 | 1 | 2 | 3
}

type ReportRisks = {
    name: string,
    ownerusername: string,
    creatorusername: string,
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
    organization: number | number[] | [],
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

type ReportChoicesRaw = {
    country: string | null | undefined
    organization: string | string[] | [] | any | null | undefined,
    organizationtype: string | null | undefined,
    hhrole: string | null | undefined,
    collaborationtype: string | string[] | [] | null | undefined,
    history: string | null | undefined,
    contract: string | null | undefined,
    funding: string | null | undefined,
    liability: string | null | undefined,
    exchange: string | null | undefined,
    personalinformation: string | null | undefined,
    dualuse: string | null | undefined,
    ethics: string | null | undefined,
    duration: string | null | undefined,
    organizationtypeother: string | null | undefined,
    collaborationtypeother: string | null | undefined,
    additionalinformation: string | null | undefined,
    name: string | null | undefined,
    fundinghistory: string | null | undefined,
    fundingsource: string | null | undefined,
    consortium: string | null | undefined,
    organizationname: string | null | undefined,
    ownerusername: string | null | undefined,
    creatorusername: string | null | undefined

}

export const parseRiskPayload = async (req: Request, res: Response) => {
    //Add when legacy variations have been removed from frontend: "ownerusername", "creatorusername"
    const requiredFields = ["country", "organization", "organizationtype", "hhrole", "collaborationtype", "history", "contract", "funding", "liability", "personalinformation", "dualuse", "ethics", "duration", "consortium"]
    let missingFields: string[] = [];
    for (let i = 0; i < requiredFields.length; i++) {
        if (!req.body[requiredFields[i]]) {
            missingFields.push(requiredFields[i])
        }
    }
    if (!req.body.ownerusername && !req.body.ownername) { //Temporary check to allow legacy format
        missingFields.push("ownerusername")
    }
    if (!req.body.creatorusername && !req.body.creatorname) {
        missingFields.push("creatorusername")
    }

    if (missingFields.length == 0) {
        return true
    } else {
        res.status(422).json({ message: "Missing fields", missing: missingFields })
        return false;
    }
}

export const generateReportChoices = (choices: ReportChoicesRaw) => {
    let organizationIds = choices.organization;
    if (organizationIds) {
        organizationIds = parseIntArray(choices.organization)
    }
    const reportChoices: ReportChoices = {
        country: choices.country ? choices.country : "",
        organization: organizationIds ? organizationIds : [],
        organizationtype: choices.organizationtype ? choices.organizationtype : "",
        hhrole: choices.hhrole ? choices.hhrole : "",
        collaborationtype: choices.collaborationtype ? choices.collaborationtype : [],
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

export const validateCollaboration = async (res: Response, collaborationRaw: any): Promise<CollaborationType[] | null> => {
    if (!collaborationRaw) {
        res.status(422).json({ message: "Collaboration type codes required" });
        return null;
    }
    const collaborationTypes = [];
    const collaborationTypeCodes = Array.isArray(collaborationRaw) ? collaborationRaw : [collaborationRaw];
    if (collaborationTypeCodes.length == 0) {
        res.status(422).json({ message: `Collaborationtype codes required` })
        return null;
    }

    for (let i = 0; i < collaborationTypeCodes.length; i++) {
        const collaborationType = await repository.findCollaborationTypeByCode(collaborationTypeCodes[i]);
        if (!collaborationType) {
            res.status(404).json({
                message: `Id ${collaborationTypeCodes[i]} is invalid for collaborationtype`,
                codes: collaborationTypeCodes
            })
            return null;
        }
        collaborationTypes.push(collaborationType);
    }
    return collaborationTypes;
}

export const validateRiskOptions = async (req: Request, res: Response): Promise<ReportChoiceIds | null> => {

    const collaborationHistoryCode = req.body.history;
    const collaborationHistory = await repository.findCollaborationHistoryByCode(collaborationHistoryCode);
    if (!collaborationHistory) {
        res.status(422).json({ message: `Code ${collaborationHistoryCode} is invalid for field history` })
        return null;
    }

    const collaborationType = req.body.collaborationtype;
    if (!collaborationType) {
        res.status(422).json({ message: `Collaborationtype codes required` });
        return null;
    }
    const collaborationTypes = await validateCollaboration(res, collaborationType)
    if (!collaborationTypes) {
        res.status(422).json({ message: `Valid collaboration type codes required` });
        return null;
    }
    const collaborationTypeIds = [];
    for (let i = 0; i > collaborationTypes.length; i++) {
        collaborationTypeIds.push(collaborationTypes[i].id)
    }

    const consortiumTypeCode = req.body.consortium;
    const consortiumType = await repository.findConsortiumTypeByCode(consortiumTypeCode);
    if (!consortiumType) {
        res.status(422).json({ message: `Code ${consortiumTypeCode} is invalid for field consortium` })
        return null;
    }

    const contractInfoCode = req.body.contract;
    const contractInfo = await repository.findContractInfoByCode(contractInfoCode);
    if (!contractInfo) {
        res.status(422).json({ message: `Code ${contractInfoCode} is invalid for field contract` })
        return null;
    }

    const countryCode = req.body.country;
    const country = await repository.findCountryByCode(countryCode);
    if (!country) {
        res.status(422).json({ message: `Code ${countryCode} is invalid for field country` })
        return null;
    }

    const dualUseCode = req.body.dualuse;
    const dualUse = await repository.findDualUseByCode(dualUseCode);
    if (!dualUse) {
        res.status(422).json({ message: `Code ${dualUseCode} is invalid for field dualuse` })
        return null;
    }

    const durationCode = req.body.duration;
    const duration = await repository.findDurationByCode(durationCode);
    if (!duration) {
        res.status(422).json({ message: `Code ${durationCode} is invalid for field duration` })
        return null;
    }

    const ethicsAssessmentCode = req.body.ethics;
    const ethicsAssessment = await repository.findEthicsAssessmentByCode(ethicsAssessmentCode);
    if (!ethicsAssessment) {
        res.status(422).json({ message: `Code ${ethicsAssessmentCode} is invalid for field ethics` })
        return null;
    }

    const hhroleCode = req.body.hhrole;
    const hhrole = await repository.findHHRoleByCode(hhroleCode);
    if (!hhrole) {
        res.status(422).json({ message: `Code ${hhroleCode} is invalid for field hhrole` })
        return null;
    }

    const liabilityCode = req.body.liability;
    const liability = await repository.findLiabilityByCode(liabilityCode);
    if (!liability) {
        res.status(422).json({ message: `Code ${liabilityCode} is invalid for field liability` })
        return null;
    }


    const fundingCode = req.body.funding;
    const funding = await repository.findFundingOptionByCode(fundingCode);
    if (!funding) {
        res.status(422).json({ message: `Code ${fundingCode} is invalid for field funding` })
        return null;
    }

    let fundingExchangeId = null;
    let fundingHistoryId = null;
    let fundingSourceId = null;

    if (funding.code === "option1") {
        const fundingExchangeCode = req.body.exchange;
        const fundingExchange = await repository.findFundingExchangeByCode(fundingExchangeCode)
        if (!fundingExchange) {
            res.status(404).json({ message: `Code ${fundingExchangeCode} is invalid for field exchange` })
            return null;
        }
        fundingExchangeId = fundingExchange?.id;
        const fundingHistoryCode = req.body.exchange;
        const fundingHistory = await repository.findFundingHistoryByCode(fundingHistoryCode)
        if (!fundingHistory) {
            res.status(404).json({ message: `Code ${fundingHistoryCode} is invalid for field fundinghistory` })
            return null;
        }
        fundingHistoryId = fundingHistory?.id;
        const fundingSourceCode = req.body.exchange;
        const fundingSource = await repository.findFundingSourceByCode(fundingSourceCode)
        if (!fundingSource) {
            res.status(404).json({ message: `Code ${fundingSourceCode} is invalid for field fundingsource` })
            return null;
        }
        fundingSourceId = fundingSource?.id;
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

    let ownerUsername = req.body.ownerusername;
    if (!ownerUsername) {
        ownerUsername = req.body.ownername;
    }
    const ownerUser = await repository.findByUsername(ownerUsername);
    if (!ownerUser) {
        res.status(404).json({ message: `Username ${ownerUsername} is invalid for field ownername` })
        return null;
    }

    let creatorUsername = req.body.creatorusername;
    if (!creatorUsername) {
        creatorUsername = req.body.creatorname;
    }
    const creatorUser = await repository.findByUsername(creatorUsername);
    if (!creatorUser) {
        res.status(404).json({ message: `Username ${creatorUsername} is invalid for field creatorname` })
        return null;
    }

    const name = req.body.name;
    if (!name) {
        res.status(404).json({ message: `name field cannot be empty` })
        return null;
    }

    const organizationIdsRaw = Array.isArray(req.body.organization) ? req.body.organization : [req.body.organization];
    const organizationIdsParsed = parseIntArray(organizationIdsRaw)
    if (!organizationIdsParsed) {
        res.status(422).json({ message: `Organization IDs must be parseable as integers` })
        return null;
    }
    let organizationIds = [];
    let organizationId = organizationIdsParsed[0];

    let organization = await repository.findOrganizationById(organizationId);
    if (!organization) {
        res.status(404).json({ message: `Id ${organizationId} is not an id of an organization` })
        return null;
    }
    organizationIds.push(organization.id);
    if (consortiumTypeCode === "option2") { //multilateral consortium 
        for (let i = 1; i < organizationIdsRaw.length; i++) {
            organizationId = organizationIdsParsed[i];
            organization = await repository.findOrganizationById(organizationId);
            if (!organization) {
                res.status(404).json({ message: `Id ${organizationId} is not an id of an organization` })
                return null;
            }
            organizationIds.push(organization.id);
        }
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
        fundingExchangeId: fundingExchangeId,
        fundingHistoryId: fundingHistoryId,
        fundingSourceId: fundingSourceId,
        organizationTypeId: organizationType.id,
        personalInformationId: personalInformation.id
    }

    return reportChoiceIds;
}

export const calculateRisk = async (req: Request, res: Response, reportChoiceIds: ReportChoiceIds) => {

    const { country, organization, organizationtype, hhrole, collaborationtype, history, contract, funding, liability, exchange, personalinformation, dualuse, ethics, duration, organizationother, organizationtypeother, collaborationtypeother, additionalinformation, name, fundinghistory, fundingsource, consortium, organizationname, ownername, creatorname, ownerusername, creatorusername } = req.body;
    if (!collaborationtype) {
        return;
    }

    const collaborationTypeCodes = await validateCollaboration(res, collaborationtype)
    const dualUseRisk = calculateDualUseRisk(dualuse);
    let countryRisk = await calculateCountryRisk(country, personalinformation);
    const ethicsRisk = calculateEthicsRisk(ethics);
    const financialRisk = calculateFinancialRisk(liability, funding, exchange, fundinghistory, fundingsource);
    const collaborationRisk = await calculateCollaborationRisk(countryRisk, collaborationTypeCodes, duration, hhrole, contract, history, consortium, reportChoiceIds.organizationIds, personalinformation)
    const organizationRisk = await calculateOrganizationRisk(reportChoiceIds.organizationIds);

    let collaborationtypeOptional = "";
    let organizationOptional = "";
    let additionalinformationOptional = "";
    let organizationNameOptional = "";

    //Highest risk of member Country is used for multilateral collaboration if if Haaga-Helia is the collaboratin coordinator
    //Currently the Country calculation is based on is selected by user, uncomment to enable this instead
    /*
    if (hhrole === "option1" && consortium === "option2") {
        const highestRisk = await calculateCountryRiskHighest(organization, personalinformation);
        if (highestRisk) {
            countryRisk = highestRisk
        }
    }
    */

    if (collaborationtype.includes("option7")) { //Collaboration description is added if option "other" is chosen
        collaborationtypeOptional = collaborationtypeother;
    }
    if (organizationtype === "option5") { //Organization type description is added if option "other" is chosen
        if (organizationtypeother) {
            organizationOptional = organizationtypeother;
        } else if (organizationother) {
            organizationOptional = organizationother;
        }
    }
    if (additionalinformation) { //Additional information is included if present
        additionalinformationOptional = additionalinformation;
    }
    if (organization) { //Organization name is added if option "other" is chosen
        organizationNameOptional = organizationname;
    }

    //Remove placeholders, ownername and creatorname once front-end has been updated to use username format
    let ownerName = "Placeholder";
    let creatorName = "Placeholder";
    if (ownername) {
        ownerName = ownername;
    }
    if (ownerusername) {
        ownerName = ownerusername;
    }
    if (creatorname) {
        creatorName = creatorname;
    }
    if (creatorusername) {
        creatorName = creatorusername;
    }

    const reportRisks: ReportRisks = {
        name: name,
        ownerusername: ownerName,
        creatorusername: creatorName,
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
        ownername: risks.ownerusername,
        creatorname: risks.creatorusername,
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
        ownerusername: reportSnapshot.ownerUsername,
        creatorusername: reportSnapshot.creatorUsername,
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

const calculateCountryRiskHighest = async (organizationRaw: any, personal: any) => {
    const organizations = Array.isArray(organizationRaw) ? organizationRaw : [organizationRaw];
    let riskHighest = null;
    for (let i = 0; i < organizations.length; i++) {
        const organization = await repository.findOrganizationById(organizationRaw)
        if (organization) {
            const risk = await calculateCountryRisk(organization.country_code, personal);
            if (risk.overall === 3) {
                return risk;

            } else if (!riskHighest) {
                riskHighest = risk;
            } else if (risk.overall > riskHighest.overall) {
                riskHighest = risk;
            }
        }
    }
    return riskHighest;
}

const countConsortiumCountries = async (organizationRaw: any) => {
    //const organizations = Array.isArray(organizationRaw) ? organizationRaw : [organizationRaw]
    const organizations = parseIntArray(organizationRaw)
    if (!organizations) {
        return 0;
    }
    let countries = null;
    for (let i = 1; i < organizations.length; i++) {
        const organization = await repository.findOrganizationById(organizations[i])
        if (organization) {
            if (!countries) {
                countries = [organization.country_code]
            } else if (!countries.includes(organization.country_code)) {
                countries.push(organization.country_code);
            }
        }
    }
    if (!countries) {
        countries = [];
    }
    return countries.length;
}

const calculateCollaborationRisk = async (countryRisk: CountryRisk, collaborationType: any, duration: any, hhrole: any, contract: any, history: any, consortium: any, organization: any, personal: any): Promise<0 | 1 | 2 | 3> => {
    if (!countryRisk) {
        return 0;
    } else if (countryRisk.sanctions === 3) { //All project to sanctioned countries have risk of 3
        return 3;
    }
    //Multiplayers that counted after calculating the average, they stay at 1 unless their condition is triggered
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

    //Risk is added to total depending on the number of Countries in consortium
    let consortiumRisk = 0;
    if (consortium === "option2") {
        const consortiumCountries = await countConsortiumCountries(organization);
        if (consortiumCountries === 1) {
            consortiumRisk = 2;
        } else if (consortiumCountries > 1) {
            consortiumRisk = 3;
        }
    }

    //Duration increases risk with highest duration also adding a multiplier
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

    //Having no signed contract adds a multiplier to total risk
    if (contract !== "option1" && contract !== "option2") {
        return 0;
    } else if (contract === "option2") {
        contractMultiplier = 1.2;
    }

    //Having no previous history adds a multiplier
    if (history !== "option1" && history !== "option2") {
        return 0;
    } else if (history === "option2") {
        historyMultiplier = 1.2;
    }

    //Country's security rating adds a multiplier if it's more than 1 and project includes personnel movement
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

    const average = (risksSum + consortiumRisk) / validRisks;
    const multipliedAverage = average * roleMultiplier * durationMultiplier * contractMultiplier * historyMultiplier;

    let roundedAverage = Math.round(multipliedAverage) as 0 | 1 | 2 | 3;

    if (average > 3) roundedAverage = 3;
    if (average < 1) roundedAverage = 0;

    return roundedAverage;

}

//Country risk calculation based on the Country's risk factors and planned handling of personal information
const calculateCountryRisk = async (countryCode: any, personal: any): Promise<CountryRisk> => {

    const country = await repository.findCountryByCode(countryCode);

    let countryRisk: CountryRisk =
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

    //Reduced or no GDPR compliance increases risk if personal information may be moved
    if ((personal !== "option1" && personal !== "option2") && country.gdpr !== 1) {
        countryRisk.gdpr = 0;
    } else if (personal === "option2" || country.gdpr === 1) {
        countryRisk.gdpr = 1;
    } else if (personal !== "option2" && country.gdpr === 2) {
        countryRisk.gdpr = 2;
    } else if (personal !== "option2" && country.gdpr === 3) {
        countryRisk.gdpr = 3
    }

    //Is country under EU sanctions
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

//Organization risk based on whether organization is known
const calculateOrganizationRisk = async (ids: number[]): Promise<0 | 1 | 2 | 3> => {
    if (!ids) {
        return 0;
    }
    for (let i = 0; i < ids.length; i++) {
        const organization = await repository.findOrganizationById(ids[i])
        if (!organization || organization.code === "other") {
            return 3;
        }
    }
    return 1;
}

//Risk of collaboration or its results being used for military use
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

//Assessment of ethical issues with the collaboration
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


//Financial risk is based on Haaga-Helia's investment, and external funding and its source and its currency
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
    let externalFunding = 0;
    let exchangeRisk = 0;
    if (funding === "option1") {
        externalFunding = 1;
        exchangeRisk = exchange;
    }
    if (!funding || (funding === "option1" && (!fundinghistory || !fundingsource))) {
        return 0;
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

    let overall = (scope + exchangeRisk + additionalRisk) / (1 + externalFunding); //If there is external funding, then the risk is split and may lower the value depending on funding source and currency, if there is not then it's just HH's liability
    if (overall <= 0) {
        overall = 0;
    } else if (overall > 3) {
        overall = 3;
    }
    const roundedOverall = Math.round(overall) as 0 | 1 | 2 | 3;

    return roundedOverall;
}
