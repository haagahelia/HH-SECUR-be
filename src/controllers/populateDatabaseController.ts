import { Request, Response } from "express";
import repository from "../data/repository/repository";
import { addCountryData } from "../utils/countryData.js";

export const populateDatabase = async (req: Request, res: Response) => {
    await addHHRole();
    await addOrganizations();
    await addCollaborationTypes();
    await addConsortiumTypes();
    await addOrganizationType();
    await addCountryData();
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
export async function addCollaborationTypes() {
    const collaborationTypes = [
        {
            code: "option1",
            fi: "TKI-yhteistyö",
            en: "Research Collaboration"
        },
        {
            code: "option2",
            fi: "Koulutus/opetusyhteistyö",
            en: "Education/Teaching Collaboration"
        },
        {
            code: "option3",
            fi: "Koulutusvienti",
            en: "Export of Education"
        },
        {
            code: "option4",
            fi: "Kansainvälinen opiskelijaliikkuvuus",
            en: "International Student Mobility"
        },
        {
            code: "option5",
            fi: "Kansainvälinen henkilöstöliikkuvuus",
            en: "International Staff Mobility"
        },
        {
            code: "option6",
            fi: "Yhteistutkintoyhteistyö",
            en: "Joint Degree Collaboration"
        },
        {
            code: "option7",
            fi: "Muu",
            en: "Other"
        },
    ]

    for (let i = 0; i < collaborationTypes.length; i++) {

        let collaborationType = await repository.findCollaborationTypeByCode(collaborationTypes[i].code)
        if (collaborationType) {
            collaborationType.fi = collaborationTypes[i].fi;
            collaborationType.en = collaborationTypes[i].en;
            collaborationType.save();
        } else {
            repository.createCollaborationType(collaborationTypes[i]);
        }
    }
}



export async function addConsortiumTypes() {
    const consortiumTypes = [
        {
            code: "option1",
            fi: "Kahdenvälinen",
            en: "Bilateral"
        },
        {
            code: "option2",
            fi: "Monenkeskeinen",
            en: "Multilateral"
        },
    ]

    for (let i = 0; i < consortiumTypes.length; i++) {

        let consortiumType = await repository.findConsortiumTypeByCode(consortiumTypes[i].code)
        if (consortiumType) {
            consortiumType.fi = consortiumTypes[i].fi;
            consortiumType.en = consortiumTypes[i].en;
            consortiumType.save();
        } else {
            repository.createConsortiumType(consortiumTypes[i]);
        }
    }
}

export async function addOrganizations() {
    const organizations = [
        {
            code: "halmstad",
            country_code: "SWE",
            fi: "Halmstadin yliopisto",
            en: "Halmstad University"
        },
        {
            code: "stockholm",
            country_code: "SWE",
            fi: "Tukholman yliopisto",
            en: "Stockholm University"
        },
        {
            code: "harvard",
            country_code: "USA",
            fi: "Harvardin yliopisto",
            en: "Harvard University"
        },
        {
            code: "mit",
            country_code: "USA",
            fi: "MIT",
            en: "MIT"
        },
        {
            code: "moldova-state",
            country_code: "MDA",
            fi: "Moldovan valtionyliopisto",
            en: "Moldova State University"
        },
        {
            code: "peking",
            country_code: "CHN",
            fi: "Pekingin yliopisto",
            en: "Peking University"
        },
        {
            code: "tsinghua",
            country_code: "CHN",
            fi: "Tsinghuan yliopisto",
            en: "Tsinghua University"
        }
    ]

    for (let i = 0; i < organizations.length; i++) {

        let organization = await repository.findOrganizationById(organizations[i].code)
        if (organization) {
            organization.fi = organizations[i].fi;
            organization.en = organizations[i].en;
            organization.country_code = organizations[i].country_code;
            organization.save();
        } else {
            repository.createOrganization(organizations[i]);
        }
    }

}
export async function addOrganizationType() {
    const organizationTypes = [
        {
            code: "university",
            fi: "Yliopisto",
            en: "University"
        },
        {
            code: "otherResearch",
            fi: "Muu tutkimuslaitos",
            en: "Other Research Institute"
        },
        {
            code: "business",
            fi: "Yritys",
            en: "Company"
        },
        {
            code: "ngo",
            fi: "Kansalaisjärjestö",
            en: "Non-Governmental Organization"
        },
        {
            code: "other",
            fi: "Muu",
            en: "Other"
        }
    ]
    for (let i = 0; i < organizationTypes.length; i++) {

        let organizationType = await repository.findOrganizationTypeByCode(organizationTypes[i].code)
        if (organizationType) {
            organizationType.fi = organizationTypes[i].fi;
            organizationType.en = organizationTypes[i].en;
            organizationType.save();
        } else {
            repository.createOrganizationType(organizationTypes[i]);
        }
    }
}