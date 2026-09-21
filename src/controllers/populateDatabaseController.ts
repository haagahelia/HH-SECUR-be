import e, { Request, Response } from "express";
import repository from "../data/repository/repository";

export const populateDatabase = async (req: Request, res: Response) => {
    await addHHRole();
    await addCollaborationTypes();
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
            option: "option1",
            fi: "TKI-yhteistyö",
            en: "Research Collaboration"
        },
        {
            option: "option2",
            fi: "Koulutus/opetusyhteistyö",
            en: "Education/Teaching Collaboration"
        },
        {
            option: "option3",
            fi: "Koulutusvienti",
            en: "Export of Education"
        },
        {
            option: "option4",
            fi: "Kansainvälinen opiskelijaliikkuvuus",
            en: "International Student Mobility"
        },
        {
            option: "option5",
            fi: "Kansainvälinen henkilöstöliikkuvuus",
            en: "International Staff Mobility"
        },
        {
            option: "option6",
            fi: "Yhteistutkintoyhteistyö",
            en: "Joint Degree Collaboration"
        },
        {
            option: "option7",
            fi: "Muu",
            en: "Other"
        },
        ]

    for (let i = 0; i < collaborationTypes.length; i++) {

        let collaborationType = await repository.findCollaborationTypeByOption(collaborationTypes[i].option)
        if (collaborationType) {
            collaborationType.fi = collaborationTypes[i].fi;
            collaborationType.en = collaborationTypes[i].en;
            collaborationType.save();
        } else {
            repository.createCollaborationType(collaborationTypes[i]);
        }
    }
}
