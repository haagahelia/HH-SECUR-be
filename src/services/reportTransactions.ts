import { Request, Response } from "express";
import { Transaction } from "sequelize";
import { calculateRisk, parseRiskPayload, validateRiskOptions, validateCollaboration, generateReportChoices } from "../utils/riskCalculation";
import repository from "../data/repository/repository";
import Consortium from "../data/models/Consortium";
import { ReportChoiceIds, ReportCreationAttributes } from "../controllers/riskCalculationController";
import Report from "../data/models/Report";
import ReportSnapshot from "../data/models/ReportSnapshot";
import Organization from "../data/models/Organization";
import Funding from "../data/models/Funding";

export const saveReportTransaction = async (req: Request, res: Response) => {

    return repository.sequelizeClient.transaction(async (transaction) => {

        if (!parseRiskPayload(req, res)) {
            return;
        }

        const reportChoiceIds: ReportChoiceIds | null = await validateRiskOptions(req, res);

        if (!reportChoiceIds) {
            return;
        }

        if ((req.body.consortium === "option2" || reportChoiceIds.organizationIds.length === 0) && req.body.neworganization) {
            let firstOnly = false;
            if (req.body.consortium === "option1") {
                firstOnly = true
            }
            const newOrganizations = await generateNewOrganizationsTransaction(req, firstOnly, transaction);
            if (newOrganizations) {
                for (let i = 0; i < newOrganizations.length; i++) {
                    reportChoiceIds.organizationIds.push(newOrganizations[i].id)
                }
            }
        }

        const collaborationTypes = await validateCollaboration(res, req.body.collaborationtype);
        if (!collaborationTypes) {
            throw new Error(`Collaboration types required`);
        }

        const fundingCreationAttributes = {
            fundingOptionId: reportChoiceIds.fundingTypeId,
            fundingSourceId: reportChoiceIds.fundingSourceId,
            fundingHistoryId: reportChoiceIds.fundingHistoryId,
            fundingExchangeId: reportChoiceIds.fundingExchangeId
        }
        const funding = await repository.createFunding(fundingCreationAttributes);
        reportChoiceIds.fundingTypeId = funding.id;

        const consortium = await generateConsortiumTransaction(req, reportChoiceIds, null, transaction)
        if (!consortium) {
            throw new Error(`Could not generate consortium`)
        }

        const reportCreationAttributes: ReportCreationAttributes = {
            name: reportChoiceIds.name,
            userId: reportChoiceIds.userId,
            collaborationHistoryId: reportChoiceIds.collaborationHistoryId,
            consortiumId: consortium.id,
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

        let report = await Report.create(reportCreationAttributes, { transaction })
        let reportId = report.id;

        if (!report) {
            res.status(404).json({ message: `Failed to save report` })
        }

        await report?.$set("collaborationTypes", collaborationTypes, { transaction });

        const reportRisks = await calculateRisk(req, res, reportChoiceIds);
        if (!reportRisks) {
            return;
        }

        let name = req.body.name;
        if (!name) {
            name = "PlaceholderName"
        }
        let ownerUsername = req.body.ownerusername;
        if (!ownerUsername) {
            ownerUsername = req.body.ownername;
            if (!ownerUsername) {
                ownerUsername = "";
            }
        }
        let creatorUsername = req.body.creatorusername;
        if (!creatorUsername) {
            creatorUsername = req.body.creatorname;
            if (!creatorUsername) {
                creatorUsername = "";
            }
        }

        let organizationName = "";
        const organizations = Array.isArray(consortium.organizations) ? consortium.organizations : [];
        for (let i = 0; i < organizations.length; i++) {
            if (organizations[i].code === "other") {
                organizationName = req.body.organizationname;
            }
        }

        const reportSnapshot = {
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

        await repository.deleteReportSnapshotByReportIdTransaction(reportId, transaction);

        await ReportSnapshot.create(reportSnapshot, { transaction });

        await repository.deleteUnattachedCustomOrganizationsTransaction(transaction);

        return report;

    });
}

export const patchReportTransaction = async (req: Request, res: Response) => {

    return repository.sequelizeClient.transaction(async (transaction) => {

        const reportIdRaw = (req.params.id);
        if (!reportIdRaw) {
            throw new Error(`Id required`);
        }
        let reportId = parseInt(reportIdRaw as string)
        let report;
        if (Number.isNaN(reportId)) {
            throw new Error(`Requested id ${reportIdRaw} is not a number`)
        }

        if (!parseRiskPayload(req, res)) {
            throw new Error(`Error parsing risk payload`)
        }

        const reportChoiceIds: ReportChoiceIds | null = await validateRiskOptions(req, res);
        if (!reportChoiceIds) {
            throw new Error(`Invalid report choices`)
        }
        if ((req.body.consortium === "option2" || reportChoiceIds.organizationIds.length === 0) && req.body.neworganization) {
            let firstOnly = false;
            if (req.body.consortium === "option2") {
                firstOnly = true
            }
            const newOrganizations = await generateNewOrganizationsTransaction(req, firstOnly, transaction);
            if (newOrganizations) {
                for (let i = 0; i < newOrganizations.length; i++) {
                    reportChoiceIds.organizationIds.push(newOrganizations[i].id)
                }
            }
        }

        const collaborationTypes = await validateCollaboration(res, req.body.collaborationtype);
        if (!collaborationTypes) {
            throw new Error(`Invalid collaboration type codes`)
        }

        report = await repository.findReportById(reportId);
        if (!report) {
            throw new Error(`Report by the id of ${reportId} does not exist`)
        }

        const fundingCreationAttributes = {
            fundingOptionId: reportChoiceIds.fundingTypeId,
            fundingSourceId: reportChoiceIds.fundingSourceId,
            fundingHistoryId: reportChoiceIds.fundingHistoryId,
            fundingExchangeId: reportChoiceIds.fundingExchangeId
        }
        let funding = await repository.findFundingById(report.fundingId);
        if (!funding) {
            funding = await Funding.create(fundingCreationAttributes, { transaction })
        } else {
            funding?.set(fundingCreationAttributes)
        }

        await funding.save({ transaction });

        const consortiumType = await repository.getConsortiumType(reportChoiceIds.consortiumTypeId)
        if (!consortiumType) {
            throw new Error(`Id ${reportChoiceIds.consortiumTypeId} is invalid for consortiumtype`)
        }

        let consortium = await generateConsortiumTransaction(req, reportChoiceIds, report.consortiumId, transaction)
        if (!consortium) {
            throw new Error(`Could not generate consortium`)
        }

        report.set({
            name: reportChoiceIds.name,
            collaborationHistoryId: reportChoiceIds.collaborationHistoryId,
            contractInfoId: reportChoiceIds.contractInfoId,
            consortiumId: consortium.id,
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
        await report.save({ transaction });

        if (!report) {
            throw new Error(`Failed to save report`)
        }

        await report?.$set("collaborationTypes", collaborationTypes, { transaction });

        const reportRisks = await calculateRisk(req, res, reportChoiceIds);
        if (!reportRisks) {
            throw new Error(`Unable to generate risk calculation`)
        }

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
        const organizations = Array.isArray(consortium.organizations) ? consortium.organizations : [];
        for (let i = 0; i < organizations.length; i++) {
            if (organizations[i].code === "other") {
                organizationName = req.body.organizationname;
            }
        }

        const reportSnapshot = {
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

        await repository.deleteReportSnapshotByReportIdTransaction(reportId, transaction);

        await ReportSnapshot.create(reportSnapshot, { transaction });

        const savedReport = await Report.findByPk(reportId, { transaction });

        await repository.deleteUnattachedCustomOrganizationsTransaction(transaction);

        return savedReport;

    });
}

export const generateConsortiumTransaction = async (req: Request, choiceIds: ReportChoiceIds, consortiumId: number | null, transaction: Transaction) => {

    const consortium = consortiumId ? await repository.getConsortium(consortiumId) : await Consortium.create({ consortiumTypeId: choiceIds.consortiumTypeId }, { transaction })
    let organization = await repository.findOrganizationById(choiceIds.organizationIds[0])
    if (!organization) {
        throw new Error(`Id ${choiceIds.organizationIds[0]} invalid for organization`)
    }
    let organizations = [organization];
    if (req.body.consortium === "option2") { //multilateral consortium
        for (let i = 1; i < choiceIds.organizationIds.length; i++) { //starts from 1, index 0 added on array initialization
            organization = await Organization.findByPk(choiceIds.organizationIds[i], { transaction })
            if (!organization) {
                throw new Error(`Id ${choiceIds.organizationIds[i]} invalid for organization`)
            }
            organizations.push(organization);
        }
    }
    consortium?.set({ consortiumTypeId: choiceIds.consortiumTypeId })

    await consortium?.$set("organizations", organizations, { transaction })

    await consortium?.save({ transaction });

    return consortium ? consortium : null;

}

export const generateNewOrganizationsTransaction = async (req: Request, firstOnly: boolean, transaction: Transaction): Promise<Organization[] | null> => {

    const organizationsRaw = req.body.neworganization == null ? [] : Array.isArray(req.body.neworganization) ? req.body.neworganization : [req.body.neworganization];

    const organizations: Organization[] = [];

    for (const organizationRaw of organizationsRaw) {

        if (!organizationRaw.name) {
            throw new Error("name is required for a new organization");
        }

        if (!organizationRaw.countrycode) {
            throw new Error("countrycode is required for a new organization");
        }

        const organization = {
            code: null,
            fi: organizationRaw.name as string,
            en: organizationRaw.name as string,
            country_code: organizationRaw.countrycode as string,
            added_manually: true
        };

        const newOrganization = await repository.createOrganizationTransaction(
            organization,
            transaction
        );

        organizations.push(newOrganization);

        if (firstOnly) {
            break;
        }
    }

    return organizations.length > 0 ? organizations : null;
}

export const deleteReportByIdTransaction = async (req: Request) => {
    return repository.sequelizeClient.transaction(async (transaction) => {
        const idRaw = (req.params.id);
        const id = parseInt(idRaw as string)
        if (Number.isNaN(id)) {
            throw new Error(`Requested id ${idRaw} is not a number`)
        } else {
            const report = await repository.findReportById(id);
            if (!report) {
                throw new Error(`Report by the id of ${id} does not exist`)

            } else {
                const funding = report.funding;
                const consortium = report.consortium;
                await report.destroy({transaction});
                await funding?.destroy({transaction});
                await consortium?.destroy({transaction});
                await repository.deleteUnattachedCustomOrganizationsTransaction(transaction);
            }
        }
        return true;
    })
}
