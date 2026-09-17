import Organization from "../models/Organization";
import BaseRepository, { Constructor } from "./BaseRepository";


export function AddOrganizationRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {
        async getOrganizations() {
            return Organization.findAll()
            
        }
    }
}