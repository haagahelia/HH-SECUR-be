import BaseRepository, { Constructor } from "./BaseRepository.js";
import ReportStatus from "../models/ReportStatus.js";
ReportStatus
export function AddReportStatusRepository<TBase extends Constructor<BaseRepository>>(
    Base:TBase
){

    return class extends Base{
        async createReportStatus(reportStatusAttributes: {code:string; fi:string; en:string}){
            return await ReportStatus.create(reportStatusAttributes);
        }

        async getReportStatuses(){
            return ReportStatus.findAll()
        }

        async findReportStatusByCode(code:string){
            return ReportStatus.findOne({
                where:{
                    code:code,
                },
            });
        }
    }
}