import FundingExchange from "../models/FundingExchange";
import BaseRepository, { Constructor } from "./BaseRepository.js";

export function AddFundingExchangeRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createFundingExchange(fundingAttributes: { code: string; fi: string; en: string; }) {
            return await FundingExchange.create(fundingAttributes);
        }

        async findAllFundingExchanges() {
            return FundingExchange.findAll();
        }

        async getFundingExchange(id: number) {
            return FundingExchange.findByPk(id);
        }

        async findFundingExchangeByCode(code: string) {
            return FundingExchange.findOne({
                where: {
                    code: code,
                },
            });
        }

        async getFundingExchanges() {
            return await FundingExchange.findAll();
        }
    }
}