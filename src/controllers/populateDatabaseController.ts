import { Request, Response } from "express";
import repository from "../data/repository/repository";
import { addCountryData } from "../utils/countryData.js";
import Duration from "../data/models/Duration";

export const populateDatabase = async (req: Request, res: Response) => {
    await addHHRole();
    await addOrganizations();
    await addCollaborationTypes();
    await addConsortiumTypes();
    await addOrganizationType();
    await addCountryData();
    await addDuration();
    await addCollaborationHistory();
    await addContractInfo();
    await addEthicsAssessment();
    await addLiability();
    await addDualUse();
    await addPersonalInformation();
    await addFunding();
    res.status(200).json({ message: "Database populated" });
}

export async function addHHRole() {
    const hhRoles = [
        {
            code: "option1",
            fi: "Yhteistyön koordinaattori",
            en: "Collaboration Coordnator"
        },
        {
            code: "option2",
            fi: "Kumppani tai tasaveroinen partner",
            en: "Partner"
        },
        {
            code: "option3",
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
        },
        {
            code: "other",
            country_code: "OTH",
            fi: "Muu",
            en: "Other"
        }
    ]

    for (let i = 0; i < organizations.length; i++) {

        let organization = await repository.findOrganizationByCode(organizations[i].code)
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
            code: "option1",
            fi: "Yliopisto",
            en: "University"
        },
        {
            code: "option2",
            fi: "Muu tutkimuslaitos",
            en: "Other Research Institute"
        },
        {
            code: "option3",
            fi: "Yritys",
            en: "Company"
        },
        {
            code: "option4",
            fi: "Kansalaisjärjestö",
            en: "Non-Governmental Organization"
        },
        {
            code: "option5",
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
export async function addDuration(){
    const durations= [
        {
            code:"option1",
            fi:"0-24 kk",
            en:"0-24 months",
            lowerlimit:0,
            upperlimit:24
        },
        {
            code:"option2",
            fi:"24-60 kk",
            en:"24-60 months",
            lowerlimit:24,
            upperlimit:60
        },
        {
            code:"option3",
            fi:"yli 60 kk",
            en:"Over 60 months",
            lowerlimit:60,
            upperlimit:null
        }
    ]
    for (let i=0; i<durations.length; i++){
        let duration= await repository.findDurationByCode(durations[i].code)
        if (duration){
            duration.fi= durations[i].fi;
            duration.en= durations[i].en;
            duration.lowerlimit= durations[i].lowerlimit;
            duration.upperlimit=durations[i].upperlimit;
            duration.save();
        } else {
            repository.createDuration(durations[i]);
        }
    }
}
export async function addCollaborationHistory() {
    const collaborationHistories = [
        {
            code: "option1",
            fi: "Kyllä",
            en: "Yes"
        },
        {
            code: "option2",
            fi: "Ei",
            en: "No"
        }
    ]
    for (let i = 0; i < collaborationHistories.length; i++) {

        let collaborationHistory = await repository.findCollaborationHistoryByCode(collaborationHistories[i].code)
        if (collaborationHistory) {
            collaborationHistory.fi = collaborationHistories[i].fi;
            collaborationHistory.en = collaborationHistories[i].en;
            collaborationHistory.save();
        } else {
            repository.createCollaborationHistory(collaborationHistories[i]);
        }
    }
}
export async function addContractInfo() {
    const contractInfos = [
        {
            code: "option1",
            fi: "Kyllä",
            en: "Yes"
        },
        {
            code: "option2",
            fi: "Ei",
            en: "No"
        }
    ]
    for (let i = 0; i < contractInfos.length; i++) {

        let contractInfo = await repository.findContractInfoByCode(contractInfos[i].code)
        if (contractInfo) {
            contractInfo.fi = contractInfos[i].fi;
            contractInfo.en = contractInfos[i].en;
            await contractInfo.save();
        } else {
            await repository.createContractInfo(contractInfos[i]);
        }
    }
}
export async function addEthicsAssessment() {
    const ethicsAssessments = [
        {
            code: "option1",
            fi: "Ei missään tapauksessa",
            en: "Absolutely not"
        },
        {
            code: "option2",
            fi: "Melko varmasti ei",
            en: "Most likely not"
        },
        {
            code: "option3",
            fi: "Ehkä",
            en: "Possibly"
        },
        {
            code: "option4",
            fi: "Melko varmasti",
            en: "Very likely"
        },
        {
            code: "option5",
            fi: "Varmasti",
            en: "Definitely"
        }
    ]
    for (let i = 0; i < ethicsAssessments.length; i++) {

        let ethicsAssessment = await repository.findEthicsAssessmentByCode(ethicsAssessments[i].code)
        if (ethicsAssessment) {
            ethicsAssessment.fi = ethicsAssessments[i].fi;
            ethicsAssessment.en = ethicsAssessments[i].en;
            ethicsAssessment.save();
        } else {
            repository.createEthicsAssessment(ethicsAssessments[i]);
        }
    }
}

export async function addLiability() {

    const liabilities = [
        {
            code: "option1",
            fi: "0-20.000",
            en: "0-20.000"
        },

        {
            code: "option2",
            fi: "20.000-50.000",
            en: "20.000-50.000"
        },

        {
            code: "option3",
            fi: "Yli 50.000",
            en: "Over 50.000"
        }

    ]
    for (let i = 0; i < liabilities.length; i++) {

        let liability = await repository.findLiabilityByCode(liabilities[i].code)
        if (liability) {
            liability.fi = liabilities[i].fi;
            liability.en = liabilities[i].en;
            liability.save();
        } else {
            repository.createLiability(liabilities[i]);
        }
    }
}

export async function addFunding() {
    const fundings = [
        {
            code: "option1",
            fi: "Kyllä",
            en: "Yes"
        },
        {
            code: "option2",
            fi: "Ei",
            en: "No"
        }
    ]
    for (let i = 0; i < fundings.length; i++) {
        let funding = await repository.findFundingByCode(fundings[i].code)
        if (funding) {
            funding.fi = fundings[i].fi;
            funding.en = fundings[i].en;
            funding.save();
        } else {
            repository.createFunding(fundings[i]);
        }
    }
}

export async function addDualUse() {
    const dualUses = [
        {
            code: "option1",
            fi: "Kyllä",
            en: "Yes"
        },
        {
            code: "option2",
            fi: "Ei",
            en: "No"
        },
        {
            code: "option3",
            fi: "Ei tiedossa",
            en: "Unknown"
        },
    ]

    for (let i = 0; i < dualUses.length; i++) {

        let dualUse = await repository.findDualUseByCode(dualUses[i].code)
        if (dualUse) {
            dualUse.fi = dualUses[i].fi;
            dualUse.en = dualUses[i].en;
            dualUse.save();
        } else {
            repository.createDualUse(dualUses[i]);
        }
    }
}
export async function addPersonalInformation() {
    const personalInformations = [
        {
            code: "option1",
            fi: "Kyllä",
            en: "Yes"
        },
        {
            code: "option2",
            fi: "Ei",
            en: "No"
        },
        {
            code: "option3",
            fi: "Ei tiedossa",
            en: "Unknown"
        },
    ]

    for (let i = 0; i < personalInformations.length; i++) {

        let personalInformation = await repository.findPersonalInformationByCode(personalInformations[i].code)
        if (personalInformation) {
            personalInformation.fi = personalInformations[i].fi;
            personalInformation.en = personalInformations[i].en;
            personalInformation.save();
        } else {
            repository.createPersonalInformation(personalInformations[i]);
        }
    }
}