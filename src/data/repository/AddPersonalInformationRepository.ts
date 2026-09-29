import PersonalInformation from "../models/PersonalInformation.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";



export function AddPersonalInformationRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createPersonalInformation(personalInformationAttributes: { code: string; fi: string; en: string; }) {

            return await PersonalInformation.create(personalInformationAttributes);
        }

        
        async findPersonalInformationByCode(code: string) {
            return PersonalInformation.findOne({
                where: {
                    code: code,
                },
            });
        }

    }

}