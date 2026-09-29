import ContractInfo from "../models/ContractInfo.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";


export function AddContractInfoRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createContractInfo(contractInfoAttributes: { code: string; fi: string; en: string }) {
            return await ContractInfo.create(contractInfoAttributes);
        }

        async findContractInfoByCode(code: string) {
            return await ContractInfo.findOne({ where: { code: code, } });
        }
    }
}
