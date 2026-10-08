import FundingSource from "../models/FundingSource.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";

export function AddFundingSourceRepository<TBase extends Constructor<BaseRepository>>(
    Base:TBase
){
    return class extends Base{

        async createFundingSource(fundingSourceAttributes: {code:string; fi:string; en:string;}){
            return await FundingSource.create(fundingSourceAttributes);
        }

        async findAllFundingSources(){
            return FundingSource.findAll();
        }

        async findFundingSourceByCode(code:string){
            return FundingSource.findOne({
                where: {
                    code:code,
                },
            });
        }
    }
}
