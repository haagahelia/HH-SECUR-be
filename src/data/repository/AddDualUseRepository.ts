import DualUse from "../models/DualUse.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";


export function AddDualUseRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createDualUse(dualUseAttributes: { code: string; fi: string; en: string; }) {

            return await DualUse.create(dualUseAttributes);
        }

        
        async findDualUseByCode(code: string) {
            return DualUse.findOne({
                where: {
                    code: code,
                },
            });
        }

    }

}