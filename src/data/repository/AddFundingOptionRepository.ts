import FundingOption from "../models/FundingOption";
import BaseRepository, { Constructor } from "./BaseRepository.js";

export function AddFundingOptionRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createFundingOption(fundingAttributes: { code: string; fi: string; en: string; }) {
            return await FundingOption.create(fundingAttributes);
        }

        async findAllFundingOptions() {
            return FundingOption.findAll();
        }

        async getFundingOption(id: number) {
            return FundingOption.findByPk(id);
        }

        async findFundingOptionByCode(code: string) {
            return FundingOption.findOne({
                where: {
                    code: code,
                },
            });
        }
    }
}