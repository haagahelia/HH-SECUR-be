import OrganizationType from "../models/OrganizationType.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";


export function AddOrganizationTypeRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {

        async createOrganizationType(organizationTypeAttributes: { code: string; fi: string; en: string }) {
            return await OrganizationType.create(organizationTypeAttributes);
        }

        async findOrganizationTypeByCode(code: string) {
            return await OrganizationType.findOne({ where: { code: code, } });
        }

        async getOrganizationTypes() {
            return await OrganizationType.findAll();
        }
    }

}