import { Request, Response } from "express";
import repository from "../data/repository/repository";

export const populateDatabase = async (req: Request, res: Response) => {
    await addHHRole();
    await addOrganizations();
    res.status(200).json({ message: "Database populated" });
}

export async function addHHRole() {
    const hhRoles = [
        {
            code: "coordinator",
            fi: "Yhteistyön koordinaattori",
            en: "Collaboration Coordnator"
        },
        {
            code: "partner",
            fi: "Kumppani tai tasaveroinen partner",
            en: "Partner"
        },
        {
            code: "other",
            fi: "Muu",
            en: "Other"
        }
    ]

    for (let i = 0; i < hhRoles.length; i++) {

        let hhRole = await repository.findHHRoleByCode(hhRoles[i].code)
        if (hhRole) {
            hhRole.fi = hhRoles[i].fi;
            hhRole.en = hhRoles[i].en;
            hhRole.save();
        } else {
            repository.createHHRole(hhRoles[i]);
        }
    }

}

export async function addOrganizations() {
    const organizations = [
        {
            id: "halmstad",
            country_id: "SWE",
            fi: "Halmstadin yliopisto",
            en: "Halmstad University"
        },
        {
            id: "stockholm",
            country_id: "SWE",
            fi: "Tukholman yliopisto",
            en: "Stockholm University"
        },
        {
            id: "harvard",
            country_id: "USA",
            fi: "Harvardin yliopisto",
            en: "Harvard University"
        },
        {
            id: "mit",
            country_id: "USA",
            fi: "MIT",
            en: "MIT"
        },
        {
            id: "moldova-state",
            country_id: "MDA",
            fi: "Moldovan valtionyliopisto",
            en: "Moldova State University"
        },
        {
            id: "peking",
            country_id: "CHN",
            fi: "Pekingin yliopisto",
            en: "Peking University"
        },
        {
            id: "tsinghua",
            country_id: "CHN",
            fi: "Tsinghuan yliopisto",
            en: "Tsinghua University"
        }
    ]

    for (let i = 0; i < organizations.length; i++) {

        let organization = await repository.findOrganizationById(organizations[i].id)
        if (organization) {
            organization.fi = organizations[i].fi;
            organization.en = organizations[i].en;
            organization.country_id = organizations[i].country_id;
            organization.save();
        } else {
            repository.createOrganization(organizations[i]);
        }
    }

}