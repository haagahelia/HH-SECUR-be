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
    ethics: number,
}

type ReportCreationAttributes = {
    collaborationHistoryId: number
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

    let reportCreationAttrbiutes: ReportCreationAttributes = {
        collaborationHistoryId: collaborationHistory.id
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

    const savedReport = await repository.createReportSnapshot(reportSnapshot);

    res.status(200).json({
        message: `Report by the id of ${savedReport.id} has been saved.`,
        report
    })
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

