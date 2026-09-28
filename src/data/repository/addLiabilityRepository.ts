import BaseRepository, { Constructor } from "./BaseRepository.js";
import repository from "./repository.js";
import Liability from "../models/Liability.js";

export function AddLiabilityRepository<TBase extends Constructor<BaseRepository>>(
    Base:TBase
){

    return class extends Base{
        async createLiability(liabilityAttributes: {code:string; fi:string; en:string}){
            return await Liability.create(liabilityAttributes);
        }

        async getLiabilities(){
            return Liability.findAll()
        }

        async findLiabilityByCode(code:string){
            return Liability.findOne({
                where:{
                    code:code,
                },
            });
        }
    }
}