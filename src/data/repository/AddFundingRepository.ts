import Funding from "../models/Funding";
import BaseRepository, { Constructor } from "./BaseRepository.js";

export function AddFundingRepository<TBase extends Constructor<BaseRepository>>(
    Base:TBase
){
    return class extends Base{

        async createFunding(fundingAttributes: {code:string; fi:string; en:string;}){
            return await Funding.create(fundingAttributes);
        }

        async findAllFunding(){
            return Funding.findAll();
        }

        async findFundingByCode(code:string){
            return Funding.findOne({
                where: {
                    code:code,
                },
            });
        }
    }
}