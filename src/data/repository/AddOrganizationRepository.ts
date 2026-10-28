import Organization from "../models/Organization.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";


export function AddOrganizationRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {
        async getOrganizations() {
            return Organization.findAll()

        }

        async findOrganizationById(id: number) {
            return Organization.findOne({
                where: {
                    id: id,
                },
            });
        }

        async findOrganizationByCode(code: string) {
            return Organization.findOne({
                where: {
                    code: code,
                },
            });
        }

        async createOrganization(organizationAttributes: { code: string|null; fi: string; en: string; country_code: string; added_manually: boolean }) {
            return await Organization.create(organizationAttributes);
        }
    }
}