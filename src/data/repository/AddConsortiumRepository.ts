
import Consortium from '../models/Consortium';
import ConsortiumType from '../models/ConsortiumType';
import BaseRepository, { Constructor } from "./BaseRepository.js";
import repository from "./repository.js";

export function AddConsortiumRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createConsortium(consortiumTypeAttributes: { consortiumTypeId: number }) {
            return await Consortium.create(consortiumTypeAttributes);
        }

        async getConsortium(id: number) {
            return await Consortium.findByPk(id);
        }
    }
}
