import Consortium from "../models/Consortium.js";
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
            return Organization.findByPk(id, {
                include: [
                    { model: Consortium }
                ]
            });
        }

        async findOrganizationByCode(code: string) {
            return Organization.findOne({
                where: {
                    code: code,
                },
            });
        }

        async createOrganization(organizationAttributes: { code: string | null; fi: string; en: string; country_code: string; added_manually: boolean }) {
            return await Organization.create(organizationAttributes);
        }

        async deleteUnattachedCustomOrganizations() {
            let destroyed = 0;
            const organizations = await Organization.findAll({
                where: {
                    added_manually: true,
                }, include: [{
                    model: Consortium
                }]
            })
            //return organizations;
            for (let i = 0; i < organizations.length; i++) {
                const consortiums = organizations[i].consortiums
                if (consortiums) {
                    if (consortiums.length === 0) {
                        await organizations[i].destroy();
                        destroyed++;
                    }
                } else {
                    await organizations[i].destroy();
                    destroyed++;
                }
            }
            return destroyed;
        }
    }

}