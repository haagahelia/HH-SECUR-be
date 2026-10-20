import FundingHistory from "../models/FundingHistory";
import BaseRepository, { Constructor } from "./BaseRepository.js";

export function AddFundingHistoryRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createFundingHistory(fundingAttributes: { code: string; fi: string; en: string; }) {
            return await FundingHistory.create(fundingAttributes);
        }

        async findAllFundingHistories() {
            return FundingHistory.findAll();
        }

        async getFundingHistory(id: number) {
            return FundingHistory.findByPk(id);
        }

        async findFundingHistoryByCode(code: string) {
            return FundingHistory.findOne({
                where: {
                    code: code,
                },
            });
        }

        async getFundingHistories() {
            return await FundingHistory.findAll();
        }
    }
}