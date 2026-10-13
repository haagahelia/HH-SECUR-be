import { Request, Response } from "express";
import { calculateRisk, getReportRisksFromReportSnapshot, generateVerboseReport, parseRiskPayload, validateRiskOptions, generateReportChoices, getReportChoicesFromReport } from "../utils/riskCalculation";
import repository from "../data/repository/repository";
import { request } from "node:http";
import FundingExchange from "../data/models/FundingExchange";

type ReportSnapshot = {
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

type ReportCreationAttributes = {
    name: string,
    userId: number,
    collaborationHistoryId: number,
    consortiumTypeId: number,
    contractInfoId: number,
    countryId: number,
    dualUseId: number,
    durationId: number,
    ethicsAssessmentId: number,
    hhroleId: number,
    liabilityId: number,
    fundingId: number,
    organizationId: number,
    organizationTypeId: number,
    personalInformationId: number,
}



export const generateReport = async (req: Request, res: Response) => {
    if (!parseRiskPayload(req, res)) {
        return;
    }
    const report = await calculateRisk(req);
    const reportChoices = generateReportChoices(req.body);
    res.json({
        report,
        choices: reportChoices
    });
}

export const patchReport = async (req: Request, res: Response) => {

    const reportIdRaw = (req.params.id);
    if (!reportIdRaw) {
        res.status(400).json({
            message: `Id required is not a number`
        })
        return;
    }
    let reportId = parseInt(reportIdRaw as string)
    let report;
    if (Number.isNaN(reportId)) {
        res.status(400).json({
            message: `Requested id ${reportIdRaw} is not a number`
        })
        return;
    }

    if (!parseRiskPayload(req, res)) {
        return;
    }

    const reportCreationAttributes: ReportCreationAttributes | null = await validateRiskOptions(req, res);
    if (!reportCreationAttributes) {
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


    if (Number.isNaN(reportId)) {
        res.status(400).json({
            message: `Requested id ${reportIdRaw} is not a number`
        })
        return;
    }
    report = await repository.findReportById(reportId);
    if (!report) {
        res.status(404).json({
            message: `Report by the id of ${reportId} does not exist`
        })
        return;
    }
    const fundingOption = await repository.getFundingOption(reportCreationAttributes.fundingId)
    if (!fundingOption) {
        res.status(404).json({
            message: `Id ${reportCreationAttributes.fundingId} is invalid for funding`
        })
        return;
    }
    let funding = await repository.findFundingById(report.fundingId);
    if (!funding) {
        return;
    }
    funding?.set({ fundingOptionId: fundingOption.id })
    if (fundingOption.code === "option2") {
        funding?.set({
            fundingSourceId: null,
            fundingHistoryId: null,
            fundingExchangeId: null
        })
    } else if (fundingOption.code === "option1") {
        const fundingSource = await repository.findFundingSourceByCode(req.body.fundingsource)
        if (fundingSource) {
            funding?.set({ fundingSourceId: fundingSource.id })
        }
        const fundingHistory = await repository.findFundingHistoryByCode(req.body.fundinghistory)
        if (fundingHistory) {
            funding?.set({ fundingHistoryId: fundingHistory.id })
        }
    }

    await funding.save();

    report.set({
        name: reportCreationAttributes.name,
        collaborationHistoryId: reportCreationAttributes.collaborationHistoryId,
        contractInfoId: reportCreationAttributes.contractInfoId,
        countryId: reportCreationAttributes.countryId,
        dualUseId: reportCreationAttributes.dualUseId,
        durationId: reportCreationAttributes.durationId,
        ethicsAssessmentId: reportCreationAttributes.ethicsAssessmentId,
        hhroleId: reportCreationAttributes.hhroleId,
        liabilityId: reportCreationAttributes.liabilityId,
        fundingId: funding.id,
        organizationId: reportCreationAttributes.organizationId,
        organizationTypeId: reportCreationAttributes.organizationTypeId,
        personalInformationId: reportCreationAttributes.personalInformationId,
        userId: reportCreationAttributes.userId,
    });
    await report.save();

    if (!report) {
        res.status(404).json({ message: `Failed to save report` })
    }

    await report?.$set("collaborationTypes", collaborationTypes);

    const reportRisks = await calculateRisk(req);

    let name = req.body.name;
    if (!name) {
        name = "PlaceholderName"
    }
    let ownerUsername = req.body.ownerusername;
    if (!ownerUsername) {
        ownerUsername = "PlaceholderOwnerUsername";
    }
    let creatorUsername = req.body.creatorusername;
    if (!creatorUsername) {
        creatorUsername = "PlaceholderCreatorUsername";
    }
    let organizationName = "";
    const organizationOther = await repository.findOrganizationById(report.organizationId)
    if (organizationOther) {
        if (organizationOther.code === "other") {
            organizationName = req.body.organizationname;
        }
    }

    const reportSnapshot: ReportSnapshot = {
        reportId: reportId,
        name: name,
        ownerUsername: ownerUsername,
        creatorUsername: creatorUsername,
        organizationName: organizationName,
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

    await repository.deleteReportSnapshotByReportId(reportId);

    await repository.createReportSnapshot(reportSnapshot);

    const savedReport = await repository.findReportById(reportId);

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
    if (!parseRiskPayload(req, res)) {
        return;
    }

    const reportCreationAttributes: ReportCreationAttributes | null = await validateRiskOptions(req, res);
    if (!reportCreationAttributes) {
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

    const reportIdRaw = (req.params.id);
    let reportId = parseInt(reportIdRaw as string)
    let report;

    const fundingOption = await repository.getFundingOption(reportCreationAttributes.fundingId)
    const fundingOptionId = fundingOption?.id;
    if (!fundingOptionId) {
        res.status(404).json({
            message: `Id ${reportCreationAttributes.fundingId} is invalid for funding`
        })
        return;
    } //else {
    const fundingSource = fundingOption.code === "option1" ? await repository.findFundingSourceByCode(req.body.fundingsource) : null
    const fundingHistory = fundingOption.code === "option1" ? await repository.findFundingHistoryByCode(req.body.fundinghistory) : null
    const fundingExchange = fundingOption.code === "option1" ? await repository.findFundingExchangeByCode(req.body.exchange) : null

    if ((!fundingSource || !fundingHistory || !fundingExchange) && fundingOption.code === "option1") {
        res.status(422).json({

            message: `Valid options required for fundingsource, fundinghistory and exchange`,
            source: fundingSource,
            history: fundingHistory,
            exchange: fundingExchange
        })
        return;
    }

    const fundingCreationAttributes = {
        fundingOptionId: fundingOptionId,
        fundingSourceId: fundingSource ? fundingSource.id : null,
        fundingHistoryId: fundingHistory ? fundingHistory.id : null,
        fundingExchangeId: fundingExchange ? fundingExchange.id : null
    }
    const funding = await repository.createFunding(fundingCreationAttributes);
    reportCreationAttributes.fundingId = funding.id;
    report = await repository.createReport(reportCreationAttributes);
    reportId = report.id;
    // }

    if (!report) {
        res.status(404).json({ message: `Failed to save report` })
    }

    await report?.$set("collaborationTypes", collaborationTypes);

    const reportRisks = await calculateRisk(req);


    let name = req.body.name;
    if (!name) {
        name = "PlaceholderName"
    }
    let ownerUsername = req.body.ownerusername;
    if (!ownerUsername) {
        ownerUsername = "PlaceholderOwnerUsername";
    }
    let creatorUsername = req.body.creatorusername;
    if (!creatorUsername) {
        creatorUsername = "PlaceholderCreatorUsername";
    }
    let organizationName = "";
    const organizationOther = await repository.findOrganizationById(report.organizationId)
    if (organizationOther) {
        if (organizationOther.code === "other") {
            organizationName = req.body.organizationname;
        }
    }

    const reportSnapshot: ReportSnapshot = {
        reportId: reportId,
        name: name,
        ownerUsername: ownerUsername,
        creatorUsername: creatorUsername,
        organizationName: organizationName,
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

    await repository.deleteReportSnapshotByReportId(reportId);

    await repository.createReportSnapshot(reportSnapshot);

    const savedReport = await repository.findReportById(reportId);

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

export const getReports = async (req: Request, res: Response) => {
    const reports = await repository.getReports();
    res.json(
        reports
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
            await repository.deleteReportById(id);
            await funding?.destroy();
            res.json({
                message: `Report with the id ${id} has been deleted`
            })
        }
    }
}

