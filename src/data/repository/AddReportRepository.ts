import CollaborationHistory from "../models/CollaborationHistory.js";
import CollaborationType from "../models/CollaborationType.js";
import ConsortiumType from "../models/ConsortiumType.js";
import Country from "../models/Country.js";
import DualUse from "../models/DualUse.js";
import Duration from "../models/Duration.js";
import EthicsAssessment from "../models/EthicsAssessment.js";
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
            consortiumTypeId: number,
            countryId: number,
            dualUseId: number,
            durationId: number,
            ethicsAssessmentId: number,
            hhroleId: number,
            liabilityId: number,
            organizationId: number,
            organizationTypeId: number,
            personalInformationId: number,
            userId: number,
        }) {
            return await Report.create(reportAttributes);
        }

        async getReports() {
            return await Report.findAll( {
                include: [{model: CollaborationType }]
            })

        }

        async findReportById(id: number) {
            return await Report.findByPk(id, {
                include: [
                    {model: ReportSnapshot },
                    { model: CollaborationHistory },
                    { model: CollaborationType },
                    { model: ConsortiumType },
                    { model: Country },
                    { model: DualUse },
                    { model: Duration},
                    { model: EthicsAssessment },
                    { model: HHRole },
                    { model: Liability},
                    { model: Organization},
                    { model: OrganizationType}, 
                    { model: PersonalInformation},
                    { model: User}
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