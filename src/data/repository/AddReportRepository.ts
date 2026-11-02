import CollaborationHistory from "../models/CollaborationHistory.js";
import CollaborationType from "../models/CollaborationType.js";
import Consortium from "../models/Consortium.js";
import ConsortiumType from "../models/ConsortiumType.js";
import ContractInfo from "../models/ContractInfo.js";
import Country from "../models/Country.js";
import DualUse from "../models/DualUse.js";
import Duration from "../models/Duration.js";
import EthicsAssessment from "../models/EthicsAssessment.js";
import Funding from "../models/Funding.js";
import FundingExchange from "../models/FundingExchange.js";
import FundingHistory from "../models/FundingHistory.js";
import FundingOption from "../models/FundingOption.js";
import FundingSource from "../models/FundingSource.js";
import HHRole from "../models/HHRole.js";
import Liability from "../models/Liability.js";
import Organization from "../models/Organization.js";
import OrganizationType from "../models/OrganizationType.js";
import PersonalInformation from "../models/PersonalInformation.js";
import Report from "../models/Report.js";
import ReportSnapshot from "../models/ReportSnapshot.js";
import User from "../models/User.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";


export function AddReportRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createReport(reportAttributes: {
            name: string,
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
            fundingSourceId?: number | null,
            organizationTypeId: number,
            personalInformationId: number,
            userId: number,
        }) {
            return await Report.create(reportAttributes);
        }

        async getReports() {
            return await Report.findAll({
                include: [{ model: ReportSnapshot },
                { model: CollaborationType },
                { model: Country },
                {
                    model: Consortium,
                    include: [{ model: Organization }]

                }]
            })
        }

        async findReportById(id: number) {
            return await Report.findByPk(id, {
                include: [
                    { model: ReportSnapshot },
                    { model: CollaborationHistory },
                    { model: CollaborationType },
                    {
                        model: Consortium,
                        include: [
                            {
                                model: ConsortiumType
                            },
                            {
                                model: Organization
                            },
                        ]

                    },
                    { model: ContractInfo },
                    { model: Country },
                    { model: EthicsAssessment },
                    { model: DualUse },
                    { model: Duration },
                    { model: HHRole },
                    { model: Liability },
                    {
                        model: Funding,
                        include: [
                            { model: FundingOption },
                            { model: FundingSource },
                            { model: FundingHistory },
                            { model: FundingExchange },
                        ]
                    },
                    { model: OrganizationType },
                    { model: PersonalInformation },
                    {
                        model: User, attributes: {
                            exclude: ["password_hash"],
                        }
                    }
                ],
                raw: false
            });
        }

        async deleteReportById(id: number) {
            const report = await Report.findByPk(id);
            if (report) {
                await report.destroy();
                return true;
            }
            return false;
        }

    }

}
