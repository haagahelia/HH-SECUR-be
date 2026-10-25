import { Request, Response } from "express";
import { calculateRisk, getReportRisksFromReportSnapshot, generateVerboseReport, parseRiskPayload, validateRiskOptions, generateReportChoices, getReportChoicesFromReport } from "../utils/riskCalculation";
import repository from "../data/repository/repository";

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

/*
export const reportChoicesDebug = async (id: number, res: Response) => {
    const report = await repository.findReportById(id);
    const reportSnapshots = report?.reportSnapshots;

    if (!report) {
        return generateReportChoices({});
    }

    const collaborationTypes = report.collaborationTypes ? report.collaborationTypes.map(type => { return type.code }) : []
    const organizations = report.consortium?.organizations ? report.consortium.organizations.map(organizations => { return organizations.id }) : []

    const reportChoicesRaw = {
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
        ownername: reportSnapshots && reportSnapshots[0].ownerUsername ? reportSnapshots[0].ownerUsername : "",
        creatorname: reportSnapshots && reportSnapshots[0].creatorUsername ? reportSnapshots[0].creatorUsername : "",
        organizationname: reportSnapshots && reportSnapshots[0].organizationName ? reportSnapshots[0].organizationName : "",
        organizationtypeother: reportSnapshots && reportSnapshots[0].organizationOther ? reportSnapshots[0].organizationOther : "",
        collaborationtypeother: reportSnapshots && reportSnapshots[0].collaborationOther ? reportSnapshots[0].collaborationOther : "",
        additionalinformation: reportSnapshots && reportSnapshots[0].additionalInformation ? reportSnapshots[0].additionalInformation : "",
    }

    const reportChoices = generateReportChoices(reportChoicesRaw);
    res.status(200).json({
        debug: true,
        reportSnapshots
    })
    return;
}
*/


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

    const reportChoiceIds: ReportChoiceIds | null = await validateRiskOptions(req, res);
    if (!reportChoiceIds) {
        res.status(422).json({
            message: `Invalid report choices`
        })
        return;
    }

    let collaborationTypes = [];
    for (let i = 0; i < reportChoiceIds.collaborationTypeIds.length; i++) {
        const collaborationType = await repository.getCollaborationType(reportChoiceIds.collaborationTypeIds[i]);
        if (!collaborationType) {
            res.status(404).json({ message: `Id ${reportChoiceIds.collaborationTypeIds[i]} is not a valid code for collaboration type` })
            return;
        }
        collaborationTypes.push(collaborationType);
    }



    report = await repository.findReportById(reportId);
    if (!report) {
        res.status(404).json({
            message: `Report by the id of ${reportId} does not exist`
        })
        return;
    }
    const fundingOption = await repository.getFundingOption(reportChoiceIds.fundingTypeId)
    if (!fundingOption) {
        res.status(404).json({
            message: `Id ${reportChoiceIds.fundingTypeId} is invalid for funding`
        })
        return;
    }
    let funding = await repository.findFundingById(report.fundingId);
    let fundingSource = fundingOption.code === "option1" ? await repository.findFundingSourceByCode(req.body.fundingsource) : null
    let fundingHistory = fundingOption.code === "option1" ? await repository.findFundingHistoryByCode(req.body.fundinghistory) : null
    let fundingExchange = fundingOption.code === "option1" ? await repository.findFundingExchangeByCode(req.body.exchange) : null

    if (fundingOption.code === "option1" && (!fundingSource || !fundingHistory || !fundingExchange)) {
        res.status(404).json({
            message: `Valid options required for fundingsource ${req.body.fundingsource}, fundinghistory ${req.body.fundinghistory} and fundingexchange ${req.body.exchange}`
        })
        return;
    }
    let fundingCreationAttributes = {
        fundingOptionId: fundingOption.id,
        fundingSourceId: fundingSource ? fundingSource.id : null,
        fundingHistoryId: fundingHistory ? fundingHistory.id : null,
        fundingExchangeId: fundingExchange ? fundingExchange.id : null
    }
    if (!funding) {
        funding = await repository.createFunding(fundingCreationAttributes)
    } else {
        funding?.set(fundingCreationAttributes)
    }

    await funding.save();

    const consortiumType = await repository.getConsortiumType(reportChoiceIds.consortiumTypeId)
    if (!consortiumType) {
        await funding.destroy();
        res.status(404).json({
            message: `Id ${reportChoiceIds.consortiumTypeId} is invalid for consortiumtype`
        })
        return;
    }

    let consortiumId = await generateConsortium(req, res, reportChoiceIds, report.consortiumId)

    report.set({
        name: reportChoiceIds.name,
        collaborationHistoryId: reportChoiceIds.collaborationHistoryId,
        contractInfoId: reportChoiceIds.contractInfoId,
        consortiumId: consortiumId,
        countryId: reportChoiceIds.countryId,
        dualUseId: reportChoiceIds.dualUseId,
        durationId: reportChoiceIds.durationId,
        ethicsAssessmentId: reportChoiceIds.ethicsAssessmentId,
        hhroleId: reportChoiceIds.hhroleId,
        liabilityId: reportChoiceIds.liabilityId,
        fundingId: funding.id,
        organizationTypeId: reportChoiceIds.organizationTypeId,
        personalInformationId: reportChoiceIds.personalInformationId,
        userId: reportChoiceIds.userId,
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
        ownerUsername = req.body.ownername;
        if (!ownerUsername) {
            ownerUsername = "PlaceholderOwnerUsername";
        }
    }
    let creatorUsername = req.body.creatorusername;
    if (!creatorUsername) {
        creatorUsername = req.body.creatorname;
        if (!creatorUsername) {
            creatorUsername = "PlaceholderCreatorUsername";
        }
    }
    let organizationName = "";
    const organizationOther = await repository.findOrganizationById(req.body.organization)
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
        organizationOther: reportRisks.organizationtypeother,
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

    const reportChoiceIds: ReportChoiceIds | null = await validateRiskOptions(req, res);
    if (!reportChoiceIds) {
        return;
    }

    let collaborationTypes = [];
    for (let i = 0; i < reportChoiceIds.collaborationTypeIds.length; i++) {
        const collaborationType = await repository.getCollaborationType(reportChoiceIds.collaborationTypeIds[i]);
        if (!collaborationType) {
            res.status(404).json({ message: `Code ${reportChoiceIds.collaborationTypeIds[i]} is not a valid code for collaboration type` })
            return;
        }
        collaborationTypes.push(collaborationType);
    }

    const reportIdRaw = (req.params.id);
    let reportId = parseInt(reportIdRaw as string)
    let report;

    const fundingOption = await repository.getFundingOption(reportChoiceIds.fundingTypeId)
    const fundingOptionId = fundingOption?.id;
    if (!fundingOptionId) {
        res.status(404).json({
            message: `Id ${reportChoiceIds.fundingTypeId} is invalid for funding`
        })
        return;
    }
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
    reportChoiceIds.fundingTypeId = funding.id;

    const consortiumId = await generateConsortium(req, res, reportChoiceIds, null)
    if (!consortiumId) {
        return;
    }
    const reportCreationAttributes: ReportCreationAttributes = {
        name: reportChoiceIds.name,
        userId: reportChoiceIds.userId,
        collaborationHistoryId: reportChoiceIds.collaborationHistoryId,
        consortiumId: consortiumId,
        contractInfoId: reportChoiceIds.contractInfoId,
        countryId: reportChoiceIds.countryId,
        dualUseId: reportChoiceIds.dualUseId,
        durationId: reportChoiceIds.durationId,
        ethicsAssessmentId: reportChoiceIds.ethicsAssessmentId,
        hhroleId: reportChoiceIds.hhroleId,
        liabilityId: reportChoiceIds.liabilityId,
        fundingId: funding.id,
        organizationTypeId: reportChoiceIds.organizationTypeId,
        personalInformationId: reportChoiceIds.personalInformationId,
    }


    report = await repository.createReport(reportCreationAttributes);
    reportId = report.id;

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
        ownerUsername = req.body.ownername;
        if (!ownerUsername) {
            ownerUsername = "PlaceholderOwnerUsername";
        }
    }
    let creatorUsername = req.body.creatorusername;
    if (!creatorUsername) {
        creatorUsername = req.body.creatorname;
        if (!creatorUsername) {
            creatorUsername = "PlaceholderCreatorUsername";
        }
    }
    let organizationName = "";
    const organizationOther = await repository.findOrganizationById(req.body.organization)
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
        organizationOther: reportRisks.organizationtypeother,
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
        for (let i = 1; i < req.body.organization.length; i++) { //starts from 1, index 0 added on array initialization
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

    return consortium?.id

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
            res.json({
                message: `Report with the id ${id} has been deleted`
            })
        }
    }
}

