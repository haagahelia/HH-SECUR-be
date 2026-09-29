import HHRole from "../models/HHRole.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";
import repository from "./repository.js";

export function AddHHRoleRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createHHRole(hhRoleAttributes: { code: string; fi: string; en: string; }) {

            return await HHRole.create(hhRoleAttributes);
        }

        
        async findHHRoleByCode(code: string) {
            return HHRole.findOne({
                where: {
                    code: code,
                },
            });
        }

    }

}