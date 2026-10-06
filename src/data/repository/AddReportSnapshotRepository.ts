import ReportSnapshot from "../models/ReportSnapshot.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";


export function AddReportSnapshotRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createReportSnapshot(reportSnapshotAttributes: {
            reportId: number;
            name: string;
            ownerUsername: string;
            creatorUsername: string;
            organizationName: string;
            additionalInformation: string;
            organizationOther: string;
            collaborationOther: string;
            collaboration: number;
            countryOverall: number;
            countryCorruption: number;
            countrySecurity: number;
            countryAcademicFreedom: number;
            countryPoliticalStability: number;
            countryDevelopment: number;
            countryGdpr: number;
            countrySanctions: number;
            countryRuleOfLaw: number;
            organization: number;
            financialOverall: number;
            financialExchange: number;
            financialScope: number;
            dualUse: number;
            ethics: number;
        }) {
            return await ReportSnapshot.create(reportSnapshotAttributes);
        }

        async deleteReportSnapshot(id: number) {
            const reportSnapshot = await ReportSnapshot.findByPk(id);
            if (reportSnapshot) {
                await reportSnapshot.destroy();
                return true;
            }
            return false;
        }

        async deleteReportSnapshotByReportId(id: number) {
            await ReportSnapshot.destroy({
                where: {
                    reportId: id,
                },
            });
        }

        async getReportSnapshotsByReportId(id: number) {
            return await ReportSnapshot.findAll({
                where:
                {
                    reportId: id
                }
            });
        }
    }
}