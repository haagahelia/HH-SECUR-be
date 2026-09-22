import ConsortiumType from '../models/ConsortiumType';
import BaseRepository, { Constructor } from "./BaseRepository.js";
import repository from "./repository.js";

export function AddConsortiumTypeRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createConsortiumType(consortiumTypeAttributes: { option: string; fi: string; en: string; }) {
            return await ConsortiumType.create(consortiumTypeAttributes);
        }

        async findConsortiumTypeByOption(option: string) {
            return await ConsortiumType.findOne({ where: { option } });
        }
    }
}
