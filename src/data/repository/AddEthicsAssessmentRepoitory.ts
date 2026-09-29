import EthicsAssessment from "../models/EthicsAssessment.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";


export function AddEthicsAssessmentRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createEthicsAssessment(ethicsAssessmentAttributes: { code: string; fi: string; en: string; }) {

            return await EthicsAssessment.create(ethicsAssessmentAttributes);
        }

        
        async findEthicsAssessmentByCode(code: string) {
            return EthicsAssessment.findOne({
                where: {
                    code: code,
                },
            });
        }

    }

}