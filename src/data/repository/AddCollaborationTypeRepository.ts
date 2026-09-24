import CollaborationType from '../models/CollaborationType';
import BaseRepository, { Constructor } from "./BaseRepository.js";
import repository from "./repository.js";

export function AddCollaborationTypeRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createCollaborationType(collaborationTypeAttributes: { code: string; fi: string; en: string; }) {
            return await CollaborationType.create(collaborationTypeAttributes);
        }

        async findCollaborationTypeByCode(code: string) {
            return await CollaborationType.findOne({ where: { code } });
        }
    }
}