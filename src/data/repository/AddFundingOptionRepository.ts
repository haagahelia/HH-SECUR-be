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
            return await FundingOption.findAll();
        }

        async getFundingOption(id: number) {
            return await FundingOption.findByPk(id);
        }

        async findFundingOptionByCode(code: string) {
            return await FundingOption.findOne({
                where: {
                    code: code,
                },
            });
        }

        async getFundingOptions() {
            return await FundingOption.findAll();
        }
    }
}