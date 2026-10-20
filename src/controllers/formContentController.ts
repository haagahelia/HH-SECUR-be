import { Request, Response } from "express";
import repository from "../data/repository/repository.js";

type FormPageObject = {
    code: string,
    fi: string,
    en: string
}

export const getFormOptions = async (req: Request, res: Response) => {

    const hhRoleRaw = await repository.getHHRoles();
    const consortiumRaw = await repository.getConsortiumTypes();
    const collaborationHistorieRaw = await repository.getCollaborationHistories();
    const organizationTypeRaw = await repository.getCollaborationTypes()
    const contractRaw = await repository.getContractInfos();
    const collaborationTypeRaw = await repository.getCollaborationTypes();
    const externalFundingRaw = await repository.getFundingOptions();
    const fundingExchangeRaw = await repository.getFundingExchanges();
    const fundingSourceRaw = await repository.getFundingSources();
    const fundingHistoryRaw = await repository.getFundingHistories();
    const liabilityRaw = await repository.getLiabilities();
    const personalInformationRaw = await repository.getPersonalInformations();
    const dualUseRaw = await repository.getDualUses();
    const ethicsRaw = await repository.getEthicsAssessments();
    const durationRaw = await repository.getDurations();
    const hhRole = mapOptions(hhRoleRaw);

    const consortium = mapOptions(consortiumRaw);
    const collaborationHistory = mapOptions(collaborationHistorieRaw);
    const organization = mapOptions(organizationTypeRaw);
    const contract = mapOptions(contractRaw);
    const collaborationType = mapOptions(collaborationTypeRaw);
    const externalFunding = mapOptions(externalFundingRaw);
    const fundingExchange = mapOptions(fundingExchangeRaw);
    const fundingSource = mapOptions(fundingSourceRaw);
    const fundingHistory = mapOptions(fundingHistoryRaw);
    const liability = mapOptions(liabilityRaw);
    const personalInformation = mapOptions(personalInformationRaw);
    const dualUse = mapOptions(dualUseRaw);
    const ethics = mapOptions(ethicsRaw);
    const duration = mapOptions(durationRaw);


    let formQuestions = {
        name: {
            type: "TextField",
            placeholder: {
                fi: "Projektin nimi",
                en: "Project name"
            },
        },
        hhRole: {
            type: "SingleChoice",
            fi: "Haaga-Helia ammattikorkeakoulun rooli yhteistyössä",
            en: "Haaga-Helia university of applied sciences role in collaboration",
            options: hhRole,
            other: {
                type: "TextField",
                placeholder: {
                    fi: "Tarkenna",
                    en: "Please specify"
                }
            }
        },
        consortium: {
            type: "SingleChoice",
            fi: "Yhteistyökonsortion koostumus",
            en: "Composition of the Collaboration Consortium",
            options: consortium
        },
        collaborationHistory: {
            type: "SingleChoice",
            fi: "Onko yhteistyöorganisaation kanssa tehty onnistunutta yhteistyötä aiemmin?",
            en: "Has there been previous successful cooperation with the organization?",
            options: collaborationHistory
        },
        organizationType: {
            type: "SingleChoice",
            fi: "Yhteistyöorganisaation tyyppi?",
            en: "Type of Partner Organization?",
            options: organization,
            other: {
                type: "TextField",
                placeholder: {
                    fi: "Tarkenna",
                    en: "Please specify"
                }
            }
        },
        contract: {
            type: "SingleChoice",
            fi: "Onko kirjallinen sopimus solmittu tai tullaanko sellainen solmimaan ennen yhteistyön aloittamista?",
            en: "Has a written agreement been signed, or will one be signed before the collaboration begins?",
            options: contract
        },
        collaborationType: {
            type: "MultiChoice",
            fi: "Yhteistyön muodot?",
            en: "Forms of Collaboration",
            options: collaborationType
        },
        externalFunding: {
            type: "SingleChoice",
            fi: "Sisältyykö yhteistyöhön ulkopuolista rahoitusta?",
            en: "Does the collaboration involve external funding?",
            options: externalFunding,
            fundingExchange: {
                type: "SingleSelect",
                fi: "Valitse valuutta",
                en: "Select currency",
                options: fundingExchange,
                placeholder: {
                    fi: "Rahoitukseen liittyvä vaihto",
                    en: "Funding exchange"
                }
            },
            fundingSource: {
                type: "SingleSelect",
                fi: "Valitse rahoittajan tyyppi",
                en: "Select funding organization type",
                options: fundingSource,
                placeholder: {
                    fi: "Rahoituksen lähde",
                    en: "Funding source"
                },
            },
            fundingHistory: {
                type: "SingleSelect",
                fi: "Valitse aiempi historia",
                en: "Select prior history",
                options: fundingHistory,
                placeholder: {
                    fi: "Aiempi rahoitushistoria",
                    en: "Funding history"
                },
            }
        },
        liability: {
            type: "SingleChoice",
            fi: "Anna arvio yhteistyön taloudellisista kokonaisvastuista (sis. omarahoitus) sen kokonaiskeston aikana.",
            en: "Provide an estimate of the collaboration’s total financial responsibilities (including self-funding) for the university over its entire duration.",
            options: liability
        },
        personalInformation: {
            type: "SingleChoice",
            fi: "Onko mahdollista, että yhteistyössä siirretään henkilötietoja yhteistyökumppaneille?",
            en: "Is it possible that personal data will be transferred to the partner organization during the collaboration?",
            options: personalInformation
        },
        dualUse: {
            type: "SingleChoice",
            fi: "Onko mahdollista, että yhteistyössä siirtyy sotilaskäyttöön soveltuvaa teknologiaa tai osaamista kumppanille (vrt. Dual Use)?",
            en: "Is it possible that technology or expertise suitable for military use (i.e., Dual Use) will be transferred to the partner organization during the collaboration?",
            options: dualUse
        },
        ethics: {
            type: "SingleChoice",
            fi: "Arvioi, sisältääkö yhteistyö eettisiä ongelmakohtia (ihmisoikeudet, tasa-arvo, yhdenvertaisuus) tai ristiriitaa Haaga-Helian arvojen kanssa.",
            en: "Assess whether the collaboration involves any ethical issues (human rights, equality, non-discrimination) or conflicts with the university's values.",
            options: ethics
        },
        duration: {
            type: "SingleChoice",
            fi: "Mikä on yhteistyön kesto?",
            en: "Duration of Collaboration",
            options: duration
        },
        additionalInformation: {
            type: "TextField",
            fi: "Tähän kenttään voi esimerkiksi kirjoittaa tärkeitä lisätietoja yhteistyöstä.",
            en: "In this field, you can enter important additional information about the collaboration.",
            placeholder: {
                fi: "Lisätietoja",
                en: "Additional information",
            }
        }
    }

    res.status(200).json(formQuestions)
}

const mapOptions = (optionsRaw: FormPageObject[]) => {
    return optionsRaw.map(option => {
        return {
            code: option.code,
            fi: option.fi,
            en: option.en,
        }
    })
}