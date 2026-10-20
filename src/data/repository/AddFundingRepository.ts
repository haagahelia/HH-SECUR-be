import Funding from "../models/Funding";
import FundingOption from "../models/FundingOption";
import BaseRepository, { Constructor } from "./BaseRepository.js";

export function AddFundingRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createFunding(fundingAttributes: { fundingOptionId: number; fundingSourceId: number | null; fundingHistoryId: number | null; fundingExchangeId: number | null }) {
            return await Funding.create(fundingAttributes);
        }

        async findFundingById(id: number) {
            return await Funding.findByPk(id, {
                include: [
                    { model: FundingOption },
                ],
                raw: false
            });
        }

        async findAllFunding() {
            return Funding.findAll();
        }

        async deleteFunding(id: number) {
            const funding = await Funding.findByPk(id);
            if (funding) {
                await funding.destroy();
            }
        }

        async getFundings() {
            return await Funding.findAll();
        }

    }
}