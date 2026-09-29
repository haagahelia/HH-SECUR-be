import { Request, Response } from "express";
import { calculateRisk, parseRiskPayload } from "../utils/riskCalculation";
import repository from "../data/repository/repository";

type ReportSnapshot = {
    reportId: number,
    name: string,
    additionalInformation: string,
    organizationOther: string,
    collaborationOther: string,
    collaboration: number,
    countryOverall: number,
    countryCorruption: number,
    countrySecurity: number,
    countryAcademicFreedom: number,
    countryPoliticalStability: number,
    countryDevelopment: number,
    countryGdpr: number,
    countrySanctions: number,
    countryRuleOfLaw: number,
    organization: number,
    financialOverall: number,
    financialExchange: number,
    financialScope: number,
    dualUse: number,
    ethics: number
}

type ReportCreationAttributes = {
    name: string,
    collaborationHistoryId: number,
    consortiumTypeId: number,
    contractInfoId: number,
    countryId: number,
    dualUseId: number,
    durationId: number,
    ethicsAssessmentId: number,
    hhroleId: number,
    liabilityId: number,
    organizationId: number,
    organizationTypeId: number,
    personalInformationId: number,
    userId: number
}



export const generateReport = async (req: Request, res: Response) => {
    if (!parseRiskPayload(req, res)) {
        return;
    }
    const report = await calculateRisk(req);
    res.json(report);
}

export const saveReport = async (req: Request, res: Response) => {
    if (!parseRiskPayload(req, res)) {
        return;
    }

    const collaborationHistoryCode = req.body.history;
    const collaborationHistory = await repository.findCollaborationHistoryByCode(collaborationHistoryCode);
    if (!collaborationHistory) {
        res.status(404).json({ message: `Code ${collaborationHistoryCode} is invalid for field history` })
        return;
    }

    const collaborationTypeCodes = req.body.collaborationtype;
    if (!collaborationTypeCodes) {
        res.status(404).json({ message: `Collaborationtype codes required` })
        return;
    }
    let collaborationTypes = [];
    for (let i = 0; i < collaborationTypeCodes.length; i++) {
        const collaborationType = await repository.findCollaborationTypeByCode(collaborationTypeCodes[i]);
        if (!collaborationType) {
            res.status(404).json({ message: `Code ${collaborationTypeCodes[i]} is not a valid code for collaboration type` })
            return;
        }
        collaborationTypes.push(collaborationType);
    }

    const consortiumTypeCode = req.body.consortium;
    const consortiumType = await repository.findConsortiumTypeByCode(consortiumTypeCode);
    if (!consortiumType) {
        res.status(404).json({ message: `Code ${consortiumTypeCode} is invalid for field consortium` })
        return;
    }

    const contractInfoCode = req.body.contract;
    const contractInfo = await repository.findContractInfoByCode(contractInfoCode);
    if (!contractInfo) {
        res.status(404).json({ message: `Code ${contractInfoCode} is invalid for field contract` })
        return;
    }

    const countryCode = req.body.country;
    const country = await repository.findCountryByCode(countryCode);
    if (!country) {
        res.status(404).json({ message: `Code ${countryCode} is invalid for field country` })
        return;
    }

    const dualUseCode = req.body.dualuse;
    const dualUse = await repository.findDualUseByCode(dualUseCode);
    if (!dualUse) {
        res.status(404).json({ message: `Code ${dualUseCode} is invalid for field dualuse` })
        return;
    }

    const durationCode = req.body.duration;
    const duration = await repository.findDurationByCode(durationCode);
    if (!duration) {
        res.status(404).json({ message: `Code ${durationCode} is invalid for field duration` })
        return;
    }

    const ethicsAssessmentCode = req.body.ethics;
    const ethicsAssessment = await repository.findEthicsAssessmentByCode(ethicsAssessmentCode);
    if (!ethicsAssessment) {
        res.status(404).json({ message: `Code ${ethicsAssessmentCode} is invalid for field ethics` })
        return;
    }

    const hhroleCode = req.body.hhrole;
    const hhrole = await repository.findHHRoleByCode(hhroleCode);
    if (!hhrole) {
        res.status(404).json({ message: `Code ${hhroleCode} is invalid for field hhrole` })
        return;
    }

    const liabilityCode = req.body.liability;
    const liability = await repository.findLiabilityByCode(liabilityCode);
    if (!liability) {
        res.status(404).json({ message: `Code ${liabilityCode} is invalid for field liability` })
        return;
    }

    const organizationId = req.body.organization;
    const organization = await repository.findOrganizationById(organizationId);
    if (!organization) {
        res.status(404).json({ message: `Id ${organizationId} is invalid for field organization` })
        return;
    }

    const organizationTypeCode = req.body.organizationtype;
    const organizationType = await repository.findOrganizationTypeByCode(organizationTypeCode);
    if (!organizationType) {
        res.status(404).json({ message: `Code ${organizationTypeCode} is invalid for field organizationtype` })
        return;
    }

    const personalInformationCode = req.body.personalinformation;
    const personalInformation = await repository.findPersonalInformationByCode(personalInformationCode);
    if (!personalInformation) {
        res.status(404).json({ message: `Code ${personalInformationCode} is invalid for field personalInformation` })
        return;
    }

    const userEmail = req.body.email;
    const user = await repository.findByEmail(userEmail);
    if (!user) {
        res.status(404).json({ message: `Email ${userEmail} is invalid for field email` })
        return;
    }

    const name = req.body.name;
    if (!name) {
        res.status(404).json({ message: `name field cannot be empty` })
        return;
    }

    let reportCreationAttrbiutes: ReportCreationAttributes = {
        name: name,
        collaborationHistoryId: collaborationHistory.id,
        consortiumTypeId: consortiumType.id,
        contractInfoId: contractInfo.id,
        countryId: country.id,
        dualUseId: dualUse.id,
        durationId: duration.id,
        ethicsAssessmentId: ethicsAssessment.id,
        hhroleId: hhrole.id,
        liabilityId: liability.id,
        organizationId: organization.id,
        organizationTypeId: organizationType.id,
        personalInformationId: personalInformation.id,
        userId: user.id
    }

    let reportId = req.body.reportid;

    let report;

    if (reportId) {
        report = await repository.findReportById(reportId);
    } else {
        report = await repository.createReport(reportCreationAttrbiutes);
        reportId = report.id;
    }

    if (!report) {
        res.status(404).json({ message: `Failed to add snapshot since report by the id of ${reportId} does not exists` })
    }

    await report?.$set("collaborationTypes", collaborationTypes);

    const reportRisks = await calculateRisk(req);

    const reportSnapshot: ReportSnapshot = {
        reportId: reportId,
        name: "Placeholder",
        additionalInformation: reportRisks.additionalinformation,
        organizationOther: reportRisks.organizationother,
        collaborationOther: reportRisks.collaborationtypeother,
        collaboration: reportRisks.collaboration.risk,
        countryOverall: reportRisks.country.overall.risk,
        countryCorruption: reportRisks.country.corruption.risk,
        countrySecurity: reportRisks.country.security.risk,
        countryAcademicFreedom: reportRisks.country.academicfreedom.risk,
        countryPoliticalStability: reportRisks.country.politicalstability.risk,
        countryDevelopment: reportRisks.country.development.risk,
        countryGdpr: reportRisks.country.gdpr.risk,
        countrySanctions: reportRisks.country.sanctions.risk,
        countryRuleOfLaw: reportRisks.country.ruleoflaw.risk,
        organization: reportRisks.organization.risk,
        financialOverall: reportRisks.financial.overall.risk,
        financialExchange: reportRisks.financial.exchange.risk,
        financialScope: reportRisks.financial.scope.risk,
        dualUse: reportRisks.dualuse.risk,
        ethics: reportRisks.ethics.risk,
    }


    await repository.createReportSnapshot(reportSnapshot);

    const savedReport = await repository.findReportById(reportId);

    if (savedReport) {
        res.status(200).json({
            message: `Report by the id of ${savedReport.id} has been saved.`,
            report: savedReport
        })
    } else {
        res.status(400).json({
            message: "Something went wrong"
        })
    }
}

export const getReports = async (req: Request, res: Response) => {
    const reports = await repository.getReports();
    res.json(
        reports
    );
}

export const getReportById = async (req: Request, res: Response) => {
    const idRaw = (req.params.id);
    const id = parseInt(idRaw as string);
    if (Number.isNaN(id)) {
        res.status(400).json({
            message: `Requested id ${idRaw} is not a number`
        })
    } else {
        const report = await repository.findReportById(id);
        if (!report) {
            res.status(404).json({
                message: `Report by the id of ${id} does not exist`
            })
        } else {
            res.json({
                report,
            })
        }
    }
}

export const deleteReportById = async (req: Request, res: Response) => {
    const idRaw = (req.params.id);
    const id = parseInt(idRaw as string)
    if (Number.isNaN(id)) {
        res.status(400).json({
            message: `Requested id ${idRaw} is not a number`
        })
    } else {
        const report = await repository.findReportById(id);
        if (!report) {
            res.status(404).json({
                message: `Report by the id of ${id} does not exist`
            })
        } else {
            await repository.deleteReportById(id);
            res.json({
                message: `Report with the id ${id} has been deleted`
            })
        }
    }
}

