import Report from "../models/Report.js";
import ReportSnapshot from "../models/ReportSnapshot.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";


export function AddReportRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createReport(reportAttributes: {
        }) {
            return await Report.create(reportAttributes);
        }

        async findReportById(id: number) {
            return await Report.findByPk(id, {
                include: [{ model: ReportSnapshot}],
                raw: false
            });
        }

        async deleteReportById(id: number) {
            const report = await Report.findByPk(id);
            if (report) {
                await report.destroy();
            }
        }
    }
}