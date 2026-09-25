import Duration from "../models/Duration.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";



export function AddDurationRepository<TBase extends Constructor<BaseRepository>>(
    Base:TBase
){
    return class extends Base{
        async createDuration(durationAttributes: {code:string; fi:string; en:string; lowerlimit:number|null; upperlimit:number|null}){
            return await Duration.create(durationAttributes);
        }
        async findDurationByCode(code:string){
            return Duration.findOne({
                where: {
                    code:code,
                },
            });
        }
    }
}