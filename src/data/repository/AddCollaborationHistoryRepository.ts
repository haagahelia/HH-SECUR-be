import CollaborationHistory from "../models/CollaborationHistory.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";


export function AddCollaborationHistoryRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createCollaborationHistory(collaborationHistoryAttributes: { code:string; fi: string; en:string}) {
            return await CollaborationHistory.create(collaborationHistoryAttributes);
        }

        async findCollaborationHistoryByCode(code:string){
            return CollaborationHistory.findOne({where: {code:code,}});
        }
    }
}
