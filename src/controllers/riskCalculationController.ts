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

    let reportId = req.body.reportid;

    if (!reportId) {
        const newReport = await repository.createReport({});
        reportId = newReport.id;
    }

    const oldReport = await repository.findReportById(reportId);

    if (!oldReport) {
        res.status(404).json({ message: `Failed to add snapshot since report by the id of ${reportId} does not exists` })
    }

    const report = await calculateRisk(req);

    const reportSnapshot: ReportSnapshot = {
        reportId: reportId,
        name: "Placeholder",
        additionalInformation: report.additionalinformation,
        organizationOther: report.organizationother,
        collaborationOther: report.collaborationtypeother,
        collaboration: report.collaboration.risk,
        countryOverall: report.country.overall.risk,
        countryCorruption: report.country.corruption.risk,
        countrySecurity: report.country.security.risk,
        countryAcademicFreedom: report.country.academicfreedom.risk,
        countryPoliticalStability: report.country.politicalstability.risk,
        countryDevelopment: report.country.development.risk,
        countryGdpr: report.country.gdpr.risk,
        countrySanctions: report.country.sanctions.risk,
        countryRuleOfLaw: report.country.ruleoflaw.risk,
        organization: report.organization.risk,
        financialOverall: report.financial.overall.risk,
        financialExchange: report.financial.exchange.risk,
        financialScope: report.financial.scope.risk,
        dualUse: report.dualuse.risk,
        ethics: report.ethics.risk,
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

