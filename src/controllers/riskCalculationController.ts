import { Request, Response } from "express";
import { calculateRisk, getReportRisksFromReportSnapshot, generateVerboseReport, parseRiskPayload, validateRiskOptions, generateReportChoices, getReportChoicesFromReport, validateCollaboration, generateNewOrganizations } from "../utils/riskCalculation";
import repository from "../data/repository/repository";
import Consortium from "../data/models/Consortium";
import { deleteReportByIdTransaction, patchReportTransaction, saveReportTransaction } from "../services/reportTransactions";

export type ReportSnapshot = {
    reportId: number,
    name: string,
    ownerUsername: string,
    creatorUsername: string,
    organizationName: string,
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

export type ReportCreationAttributes = {
    name: string,
    userId: number,
    collaborationHistoryId: number,
    consortiumId: number,
    contractInfoId: number,
    countryId: number,
    dualUseId: number,
    durationId: number,
    ethicsAssessmentId: number,
    hhroleId: number,
    liabilityId: number,
    fundingId: number,
    organizationTypeId: number,
    personalInformationId: number,
}

export type ReportChoiceIds = {
    name: string,
    userId: number,
    collaborationHistoryId: number,
    consortiumTypeId: number,
    organizationIds: number[],
    collaborationTypeIds: number[],
    contractInfoId: number,
    countryId: number,
    dualUseId: number,
    durationId: number,
    ethicsAssessmentId: number,
    hhroleId: number,
    liabilityId: number,
    fundingTypeId: number,
    fundingExchangeId: number | null,
    fundingHistoryId: number | null,
    fundingSourceId: number | null,
    organizationTypeId: number,
    personalInformationId: number,
}

export const generateReport = async (req: Request, res: Response) => {
    if (!await parseRiskPayload(req, res)) {
        return;
    }
    const reportChoiceIds = await validateRiskOptions(req, res);
    if (!reportChoiceIds) {
        return;
    }
    const report = await calculateRisk(req, res, reportChoiceIds);
    if (!report) {
        return;
    }
    const reportChoices = generateReportChoices(req.body);
    res.json({
        report,
        choices: reportChoices
    });
}

export const patchReport = async (req: Request, res: Response) => {

    const reportChoiceIds: ReportChoiceIds | null = await validateRiskOptions(req, res);
    if (!reportChoiceIds) {
        res.status(422).json({
            message: `Invalid report choices`
        })
        return;
    }

    const reportRisks = await calculateRisk(req, res, reportChoiceIds);
    if (!reportRisks) {
        return;
    }

    const savedReport = await patchReportTransaction(req, res);

    const reportChoices = generateReportChoices(req.body);

    if (savedReport) {
        res.status(200).json({
            message: `Report by the id of ${savedReport.id} has been saved.`,
            reportDetails: savedReport,
            report: reportRisks,
            choices: reportChoices
        })
    } else {
        res.status(400).json({
            message: "Something went wrong"
        })
    }
}

export const saveReport = async (req: Request, res: Response) => {

    const reportChoiceIds: ReportChoiceIds | null = await validateRiskOptions(req, res);
    if (!reportChoiceIds) {
        return;
    }

    const reportRisks = await calculateRisk(req, res, reportChoiceIds);
    if (!reportRisks) {
        return;
    }
    const savedReport = await saveReportTransaction(req, res);

    const reportChoices = generateReportChoices(req.body);
    if (savedReport) {
        const updatedReport = await repository.findReportById(savedReport.id);
        if (updatedReport) {
            res.status(200).json({
                message: `Report by the id of ${updatedReport.id} has been saved.`,
                reportDetails: updatedReport,
                report: reportRisks,
                choices: reportChoices
            })
        } else {
            res.status(200).json({
                message: `Report by the id of ${savedReport.id} has been saved.`,
                reportDetails: savedReport,
                report: reportRisks,
                choices: reportChoices
            })
        }
    } else {
        res.status(400).json({
            message: "Something went wrong"
        })
    }
}

export const generateConsortium = async (req: Request, res: Response, choiceIds: ReportChoiceIds, consortiumId: number | null) => {

    const consortium = consortiumId ? await repository.getConsortium(consortiumId) : await repository.createConsortium({ consortiumTypeId: choiceIds.consortiumTypeId })
    let organization = await repository.findOrganizationById(choiceIds.organizationIds[0])
    if (!organization) {
        res.status(422).json({
            message: `Id ${choiceIds.organizationIds[0]} invalid for organization}`
        })
        return;
    }
    let organizations = [organization];
    if (req.body.consortium === "option2") { //multilateral consortium
        for (let i = 1; i < choiceIds.organizationIds.length; i++) { //starts from 1, index 0 added on array initialization
            organization = await repository.findOrganizationById(choiceIds.organizationIds[i])
            if (!organization) {
                res.status(422).json({
                    message: `Id ${choiceIds.organizationIds[i]} invalid for organization}`
                })
                return;
            }
            organizations.push(organization);
        }
    }
    consortium?.set({ consortiumTypeId: choiceIds.consortiumTypeId })
    await consortium?.$set("organizations", organizations)

    await consortium?.save();

    return consortium ? consortium : null;

}

export const getReports = async (req: Request, res: Response) => {
    const reports = await repository.getReports();
    const reportsParsed = reports.map(report => {
        const snapshot = report.reportSnapshots ? report.reportSnapshots[0] : null;
        const organizations = report.consortium ? report.consortium.organizations : null
        const organizationsMapped = organizations?.map(organization => {
            return ({
                id: organization.id,
                fi: organization.fi,
                en: organization.en,
                country_code: organization.country_code
            })
        })
        return ({
            id: report.id,
            name: report.name,
            risk: snapshot ? snapshot.collaboration : "",
            ownwername: snapshot ? snapshot.ownerUsername : "",
            creatorname: snapshot ? snapshot.creatorUsername : "",
            country: {
                code: report.country?.code,
                fi: report.country?.fi,
                en: report.country?.en
            },
            organizations: organizationsMapped,
            created_at: report.created_at,
            updated_at: report.updated_at,
        })
    })
    res.json(
        reportsParsed
    );
}

export const getReportById = async (req: Request, res: Response) => {

    const idRaw = (req.params.id);
    const id = parseInt(idRaw as string);
    let verboseReport = {};
    if (Number.isNaN(id)) {
        res.status(400).json({
            message: `Requested id ${idRaw} is not a number`
        })
        return;
    } else {
        const report = await repository.findReportById(id);
        if (!report) {
            res.status(404).json({
                message: `Report by the id of ${id} does not exist`
            })
            return;
        } else {
            const reportSnapshots = await repository.getReportSnapshotsByReportId(report.id);
            if (reportSnapshots[0]) {
                const reportRisks = getReportRisksFromReportSnapshot(reportSnapshots[0]);
                verboseReport = generateVerboseReport(reportRisks);
            }

            const reportChoices = await getReportChoicesFromReport(report.id);

            res.json({
                reportDetails: report,
                report: verboseReport,
                choices: reportChoices
            })
        }
    }

}

export const deleteReportById = async (req: Request, res: Response) => {
    const destroyed = await deleteReportByIdTransaction(req);
    if (destroyed) {
        res.json({
            message: `Report with the id ${req.params.id} has been deleted`
        })
    }
    /*
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
            const funding = report.funding;
            const consortium = report.consortium;
            await repository.deleteReportById(id);
            await funding?.destroy();
            await consortium?.destroy();
            await repository.deleteUnattachedCustomOrganizations();
            res.json({
                message: `Report with the id ${id} has been deleted`
            })
        }
    }*/

}

