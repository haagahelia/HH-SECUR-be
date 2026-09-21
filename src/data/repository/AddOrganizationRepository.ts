import Organization from "../models/Organization.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";


export function AddOrganizationRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {
        async getOrganizations() {
            return Organization.findAll()

        }

        async findOrganizationById(id: string) {
            return Organization.findOne({
                where: {
                    id: id,
                },
            });
        }

        async createOrganization(organizationAttributes: { id: string; fi: string; en: string; country_id: string; }) {
            return await Organization.create(organizationAttributes);
        }
    }
}