import { Request, Response } from "express";

type CountryRisk = {
    "overall": 0 | 1 | 2 | 3,
    "corruption": 0 | 1 | 2 | 3,
    "security": 0 | 1 | 2 | 3,
    "academicfreedom": 0 | 1 | 2 | 3,
    "politicalstability": 0 | 1 | 2 | 3,
    "development": 0 | 1 | 2 | 3,
    "gdpr": 0 | 1 | 2 | 3,
    "sanctions": 0 | 1 | 2 | 3,
    "ruleoflaw": 0 | 1 | 2 | 3,
}

export const parseRiskPayload = (req: Request, res: Response) => {
    const requiredFields = ["country", "organization", "organizationtype", "hhrole", "collaborationtype", "history", "contract", "funding", "liability", "exchange", "personalinformation", "dualuse", "ethics", "duration"]
    let missingFields: string[] = [];
    for (let i = 0; i < requiredFields.length; i++) {
        if (!req.body[requiredFields[i]]) {
            missingFields.push(requiredFields[i])
        }
    }

    if (missingFields.length == 0) {
        return true
    } else {
        res.status(422).json({ message: "Missing fields", missing: missingFields })
    }
}


export const calculateRisk = (req: Request) => {
    const { country, organization, organizationtype, hhrole, collaborationtype, history, contract, funding, liability, exchange, personalinformation, dualuse, ethics, duration, organizationother, collaborationtypeother, additionalinformation } = req.body;
    const dualUseRisk = calculateDualUseRisk(dualuse);
    const countryRisk = calculateCountryRisk(country);
    const ethicsRisk = calculateEthicsRisk(ethics);
    const financialRisk = calculateFinancialScopeRisk(liability);

    //Placeholders to be replacedby functions
    const collaborationRisk = 3;
    const organizationRisk = 3;

    const report = {
        collaboration: {
            title: resultDescriptions.collaboration.title,
            risk: collaborationRisk,
            description: resultDescriptions.collaboration[collaborationRisk]
        },
        countryrisk: {
            overall: {
                title: resultDescriptions.countryOverall.title,
                risk: countryRisk.overall,
                description: resultDescriptions.countryOverall[countryRisk.overall]
            },
            corruption: {
                title: resultDescriptions.countryCorruption.title,
                risk: countryRisk.corruption,
                description: resultDescriptions.countryCorruption[countryRisk.corruption]
            },
            security: {
                title: resultDescriptions.countrySecurity.title,
                risk: countryRisk.security,
                description: resultDescriptions.countrySecurity[countryRisk.security]
            },
            academicfreedom: {
                title: resultDescriptions.countryAcademic.title,
                risk: countryRisk.academicfreedom,
                description: resultDescriptions.countryAcademic[countryRisk.academicfreedom]

            },
            politicalstability: {
                title: resultDescriptions.countryPolitical.title,
                risk: countryRisk.politicalstability,
                description: resultDescriptions.countryPolitical[countryRisk.politicalstability]
            }

        },
        organizationrisk: {
            title: resultDescriptions.organization.title,
            risk: organizationRisk,
            description: resultDescriptions.organization[organizationRisk]
        },
        financialrisk: {
            title: resultDescriptions.financial.title,
            risk: financialRisk
        },
        dualuserisk: {
            title: resultDescriptions.dualUse.title,
            risk: dualUseRisk,
            description: resultDescriptions.dualUse[dualUseRisk]
        },
        ethicsrisk: {
            title: ethicsRisk,
            risk: ethicsRisk,
            description: resultDescriptions.ethics[ethicsRisk]
        },
        realCalculationImpementedFor: [
            "dualuserisk"
        ]
    }

    return report;
}

const calculateCountryRisk = (countryCode: any): CountryRisk => {
    let countryRisk =
    {
        "overall": 0 as 0 | 1 | 2 | 3,
        "corruption": 0 as 0 | 1 | 2 | 3,
        "security": 0 as 0 | 1 | 2 | 3,
        "academicfreedom": 0 as 0 | 1 | 2 | 3,
        "politicalstability": 0 as 0 | 1 | 2 | 3,
        "development": 0 as 0 | 1 | 2 | 3,
        "gdpr": 0 as 0 | 1 | 2 | 3,
        "sanctions": 0 as 0 | 1 | 2 | 3,
        "ruleoflaw": 0 as 0 | 1 | 2 | 3,
    }

    //Add risk calculation logic
    if (countryCode) {
        countryRisk.overall = 3;
        countryRisk.corruption = 3;
        countryRisk.security = 3;
        countryRisk.academicfreedom = 3;
        countryRisk.politicalstability = 3;
        countryRisk.development = 3;
        countryRisk.gdpr = 3;
        countryRisk.sanctions = 3;
        countryRisk.ruleoflaw = 3;
    }

    return countryRisk;
}

const calculateDualUseRisk = (dualUse: string): 0 | 1 | 2 | 3 => {
    let dualUseRisk = 0 as 0 | 1 | 2 | 3;

    //Add risk calculation logic
    if (dualUse === "option1") {
        dualUseRisk = 1;
    } else if (dualUse === "option2") {
        dualUseRisk = 2;
    } else if (dualUse === "option3") {
        dualUseRisk = 3;
    }
    return dualUseRisk;
}

const calculateEthicsRisk = (ethics: any): 0 | 1 | 2 | 3 => {
    let ethicsRisk = 0 as 0 | 1 | 2 | 3;

    //Add risk calculation logic
    if (ethics) {
        ethicsRisk = 3;
    }
    return ethicsRisk;
}

const calculateFinancialScopeRisk = (financial: any) => {
    let financialRisk = {
        "overall": 0,
        "exchange": 0,
        "scope": 0
    }

    //Add risk calculation logic
    if (financial) {
        financialRisk.overall = 3;
        financialRisk.exchange = 3;
        financialRisk.scope = 3;
    }

    return financialRisk;
}

const calculateFinancialRiskOverall = (scope: number, exchange: number): 0 | 1 | 2 | 3 => {
    let overall = 0 as 0;

    //Add risk calculation logic
    return overall;
}

const resultDescriptions = {
    collaboration: {
        title: {
            fi: "Yhteistyön kokonaisriskiarvio",
            en: "Overall Collaboration Risk Level"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Yhteistyön kokonaisriski on alhainen. Yhteistyössä voi kuitenkin  esiintyä tunnistamattomia riskejä ja nyt arvioitujen asioiden riskitaso saattaa muuttua jatkossa.",
            en: "Overall risk rating for the collaboration is low. Collaboration may still include unforeseen risks and risk ratings for currently assessed risks may change in the future."
        },
        2: {
            fi: "Yhteistyön kokonaisriskitaso on kohonnut. Kiinnitä erityistä huomiota kohonneisiin riskeihin ja mieti niiden hallintaa. Toteuta tarvittaessa yksityiskohtaisempi riskiarvio.",
            en: "The overall collaboration risk level has increased. Pay special attention to the elevated risks and consider how to manage them. If necessary, conduct a more detailed risk assessment."
        },
        3: {
            fi: "Yhteistyön kokonaisriskitaso on merkittävä. Yksityiskohtaisemman riskiarvion toteuttaminen on suositeltavaa. Ryhdy myös toimenpiteisiin tunnistettujen riskien hallitsemiseksi.",
            en: "Risk level is high. It is highly recommendable to undertake a more detailed risk assessment, and take action on individual risks indentified here."
        }
    },
    countryOverall: {
        title: {
            fi: "Maan riskitaso",
            en: "Country Risk Level"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Maan yhteenlaskettu kokonaisriskitaso on matala.",
            en: "The overall risk rating for the selected country is low."
        },
        2: {
            fi: "Väliaikainen kuvausteksti tasolle 2",
            en: "Placeholder description for rating 2"
        },
        3: {
            fi: "Maan yhteenlaskettu kokonaisriskitaso on korkea.",
            en: "The country’s overall aggregated risk level is high."
        }
    },
    countryCorruption: {
        title: {
            fi: "Korruptio",
            en: "Corruption"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Yhteistyökumppanin sijaintimaassa korruptio ei ole merkittävä riski.",
            en: "Risk for corruption in the collaborator's country of residence is not meaningful."
        },
        2: {
            fi: "Yhteistyökumppanin sijaintimaassa korruption riski on kohonnut. Ota tämä huomioon yhteistyön suunnittelussa ja toteutuksessa.",
            en: "Your collaboration partner is located in a country, where the risk of corruption is elevated. Take this into account in planning and implementing your collaboration."
        },
        3: {
            fi: "Yhteistyökumppanin sijaintimaassa korruption riski on merkittävä. Ota tämä huomioon yhteistyön suunnittelussa ja toteutuksessa ja varmistu, ettet osallistu korruptioon.",
            en: "The risk of corruption in the partner organization’s country is significant. Take this into account when planning and implementing the collaboration, and ensure that you do not engage in any corrupt practices."
        }
    },
    countrySecurity: {
        title: {
            fi: "Turvallisuustaso",
            en: "Security Level"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Yhteistyömaahan matkustamiseen ei liity rajoituksia. Varmistu halutessasi tarkemmin tilanteesta ulkoministeriön matkustustiedotteista.",
            en: "There are not restrictions for travel to the collaborating country. You may use the ministry of foreign affairs travel notices to reassess the status."
        },
        2: {
            fi: "Yhteistyömaahan matkustamiseen liittyy rajoituksia, jotka on syytä ottaa huomioon. Tutki tarkemmat yksityiskohdat ulkoministeriön matkustustiedotteista.",
            en: "Travelling to this country may be restricted. Please review details at the Ministry of Foreign Affairs travel advisory, in Finnish only. "
        },
        3: {
            fi: "Yhteistyömaahan matkustaminen ei ole tällä hetkellä mahdollista. Tutki tarkemmat yksityiskohdat ulkoministeriön matkustustiedotteista.",
            en: "Travel to the partner country is currently not possible. Please consult the detailed information in the Ministry for Foreign Affairs travel advisories."
        }
    },
    countryAcademic: {
        title: {
            fi: "Akateeminen vapaus",
            en: "Academic Freedom"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Yhteistyökumppanisi sijaitsee maassa, jossa akateeminen vapaus on hyvällä tasolla.",
            en: "Your collaboration partner is located in a country, where academic freedom is at a good level."
        },
        2: {
            fi: "Yhteistyökumppanisi sijaitsee maassa, jossa akateeminen vapaus on jonkin verran rajoitettua. Huomioi tämä yhteistyön toteutuksessa.",
            en: "Your collaboration partner is located in a country, where academic freedom is somewhat restricted. Take this into account in implementation."
        },
        3: {
            fi: "Yhteistyökumppanisi sijaitsee maassa, jossa akateeminen vapaus on hyvin rajoitettua. Harkitse yhteistyötä tarkasti tästä ja yliopiston arvojen näkökulmasta",
            en: "Your partner organization is located in a country where academic freedom is highly restricted. Consider the collaboration carefully from this perspective and in light of the university’s values."
        }
    },
    countryPolitical: {
        title: {
            fi: "Poliittinen vakaus",
            en: "Political Stability"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Yhteistyökumppanisi sijaitsee poliittisesti vakaassa maassa.",
            en: "Your collaboration partner is located in a politically stable country."
        },
        2: {
            fi: "Yhteistyökumppanisi sijaitsee poliittisesti melko epävakaassa maassa.",
            en: "Your collaboration partner is located in a politically somewhat unstable country."
        },
        3: {
            fi: "Yhteistyökumppanisi sijaitsee poliittisesti epävakaassa maassa.",
            en: "Your partner organization is located in a politically unstable country."
        }
    },
    countryDevelopment: {
        title: {
            fi: "Maan kehittyineisyys",
            en: "Country Development Level"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Yhteistyökumppanisi sijaitsee kehittyneessä maassa.",
            en: "Your partner is located in a developed country."
        },
        2: {
            fi: "Yhteistyökumppanisi sijaitsee vähemmän kehittyneessä maassa, millä saattaa olla vaikutusta yhteistyön suunnitteluun ja toteutukseen.",
            en: "Your partner organization is located in a less developed country, which may affect the planning and implementation of the collaboration."
        },
        3: {
            fi: "Yhteistyökumppanisi sijaitsee vähiten kehittyneessä maassa. Tämä ei itsessään ole välttämättä riski, mutta ota tämä kuitenkin huomioon yhteistyön suunnittelussa ja toteutuksessa",
            en: "Your partner is located in a least developed country. In and by itself, this is not a risk, but you should still take this into account in planning and implementing phases."
        }
    },
    countryGdpr: {
        title: {
            fi: "GDPR",
            en: "GDPR"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Antamisesi tietojen perusteella yhteistyöhön ei kohdistu  tietousuojamielessä erityisiä vaatimuksia mutta varmistu, että  henkilötietoja ei yhteistyössä tarvitse luovuttaa.",
            en: "Based on the information you have provided, GDPR is not applicable, but please double check, if this really is the case."
        },
        2: {
            fi: "Yhteistyö maa on määritelty EU:n toimesta tarpeeksi luotettavaksi henkilödatan käsittelyssä.",
            en: "Collaborator country is rated for adequate data protection by EU."
        },
        3: {
            fi: "Henkilötietojen luovuttamista koskee EU:n GDPR-sääntely.",
            en: "The transfer of personal data is subject to the EU’s GDPR regulations."
        }
    },
    countrySanctions: {
        title: {
            fi: "Pakotteet",
            en: "Sanctions"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Yhteistyökumppanisi sijaitsee maassa, johon ei kohdistu YK- tai  EU-pakotteita. Pakotteilla ei siis ole vaikutusta yhteistyöhankkeeseesi.",
            en: "Your collaboration partner is located in a country, which is no sanctioned by UN or EU. Sanctions have no effect on your collaboration."
        },
        2: {
            fi: "Väliaikainen kuvausteksti tasolle 2",
            en: "Placeholder description for rating 2"
        },
        3: {
            fi: "Lue lisää maahan kohdistuvista pakotteista sanctionsmap.eu-sivulta",
            en: "Read more about the sanctions imposed on the country at sanctionsmap.eu-page"
        }
    },
    countryLaw: {
        title: {
            fi: "Oikeusvalitio",
            en: "Rule of Law"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Yhteistyökumppanisi sijaitsee maassa, joka on oikeusvaltio, mikä  tarkoittaa muun muassa, että sopimuksiin liittyvä oikeussuoja on  lähtökohtaisesti vahva. Tämä on kuitenkin vain perusta ja  yhteistyösopimus on joka tapauksessa syytä laatia huolella.",
            en: "Your collaboration partner is located in a country, where rule of law is prevalent and agreements are normally followed and respected. As this is merely the point of departure, it is still necessary to draw up an agreement with appropriate care."
        },
        2: {
            fi: "Yhteistyökumppanisi sijaitsee maassa, jossa oikeusvaltioperiaate toteutuu vain osittain. Kiinnitä huomiota yhteistyösopimuksen muotoiluihin erityisesti valittavan oikeuspaikan ja riidanratkaisumekanisimien osalta. Konsultoi tarvittaessa organisaatiosi asiantuntijajuristeja.",
            en: "Your collaboration partner is located in a country, where rule of law is only partially adhered. Pay emphasis in the clauses concerning legal venue and resolution of disagreements in the collaboration agreement. Consider also consulting your organization's legal experts."
        },
        3: {
            fi: "Yhteistyökumppanisi sijaitsee maassa, jossa oikeusvaltioperiaate on vakavasti vaarantunut. Varmistu siitä, että yhteistyösopimuksen muotoilut oikeuspaikan ja riidanratkaisumekanismien osalta on mietiitty tarkasti ja konsultoi Haaga-Helian asiantuntijajuristeja.",
            en: "Your partner organization is located in a country where the rule of law is seriously compromised. Ensure that the collaboration agreement’s provisions regarding jurisdiction and dispute resolution mechanisms are carefully considered, and consult the university’s legal experts."
        }
    },
    organization: {
        title: {
            fi: "Organisaation riskitaso",
            en: "Organization Risk Level"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Yhteistyöyliopisto on listattu World Higher Education -tietokannassa. Tämä tarkoittaa, että yliopisto kuuluu varmuudella sijaintimaansa viralliseen koulutusjärjestelmään. Tämä on minimtaso, eikä välttämättä ole tae sen laadusta.",
            en: "The partner university is listed in the World Higher Education database. This means that the university is officially part of its country’s education system. This represents a minimum standard and does not necessarily guarantee the quality of the institution."
        },
        2: {
            fi: "Väliaikainen kuvausteksti tasolle 2",
            en: "Placeholder description for rating 2"
        },
        3: {
            fi: "Yhteistyöorganisaatiota ei löydy World Higher Education -tietokannasta. Varmista, että kyseessä on maansa viralliseen korkakoulujärjestelmään kuuluva yliopisto.",
            en: "Collaboration organization is not part of the World Higher Education database and therefore likely not part of the higher education system of the country where it is based."
        }
    },
    financial: {
        overall: {
            fi: "Yhteistyön taloudellinen kokonaisriskitaso",
            en: "Overall Financial Risk Level of the Collaboration"
        },
        title: {
            fi: "Taloudellinen kokonaisriskitaso",
            en: "Overall Financial Risk Level"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Yhteistyön taloudellinen laajuus ei ole merkittävä, eikä muodosta merkittävää riskiä. Varmista tarvittaessa ykskkösi talouden lähipalveluilta, että hankkeen budjetti on asianmukainen.",
            en: "The financial scope of the collaboration is not significant and does not pose a major risk. If necessary, consult your unit’s financial services to ensure that the project budget is appropriate."
        },
        2: {
            fi: "Väliaikainen kuvausteksti tasolle 2",
            en: "Placeholder description for rating 2"
        },
        3: {
            fi: "Talouden kokoanaisriski on noussut. Kokonaisriskiin vaikuttavat talouden laajuuden ja valuuttakurssiriskin lisäksi se, että onko yksikkösi ilmoituksen mukaan saanut samalta rahoittajalta aiempaa rahoitusta, onko rahoittajana yritys.",
            en: "The overall economic risk is increased. In additional to the scope of the economy and currency exchange rate risks the overall risk is influenced by whether your unit, according to the notification, received previous funding from the same funder, whether the funder is a company."
        }
    },

    exchangeRate: {
        title: {
            fi: "Valuuttakurssiriski",
            en: "Exchange Rate"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Yhteistyösi talous on sidottu Euroon, mikä on hyvä tapa välttää valuuttakurssiriskejä.",
            en: "Your collaboration is based on funding in Euro, which is a good away of avoiding currency risks."
        },
        2: {
            fi: "Yhteistyösi talous on osittain riippuvainen valuuttakurssien vaihtelusta. Varmista, ettei valuuttakurssiriski muodostu liian suureksi ja jos mahdollista, pyri siihen, että yhteistyösi olisi kokonaan europerusteista. Konsultoi tarvittaessa yksikkösi talousasiantuntijoita.",
            en: "Your collaborition is somewhat vulnerable to currency exchange risks. Please ensure that the currency risk is not excessive, and consider using Euro as the only currency, if possible. Consult your unit's financial experts."
        },
        3: {
            fi: "Yhteistyösi talous on riippuvainen valuuttakurssien vaihtelusta. Varmista, että yhteistyösopimuksessa on riittävät mekanismit valuuttakurssiriskin hallitsemiseksi ja konsultoi yksikkösi talousasiantuntijoita. Suhteuta valuuttakurssiriskien hallintatavavat hankkeen kokonaisrahoituksen määrään sen koko keston aikana.",
            en: "Your collaboration is vulnerable to currency exchange risks. Please ensure that your collaboration agreement has sufficient safeguards for managing the currency exchange risks. Consult your unit's financial experts. Use proportionate measures on how to manage currency exchange risks with respect to the total funding of the project for the entire duration of it."
        }

    },

    economicScope: {
        title: {
            fi: "Taloudellinen laajuus",
            en: "Fincancial scope"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Yhteistyön taloudellinen laajuus ei ole merkittävä, eikä muodosta merkittävää riskiä. Varmista tarvittaessa ykskkösi talouden lähipalveluilta, että hankkeen budjetti on asianmukainen.",
            en: "The financial scope of the collaboration is not significant, and does not pose a substantial risk. Consult your unit's financial experts to make sure that the project budget is appropriate."
        },
        2: {
            fi: "Yhteistyön taloudellinen laajuus on kohtalainen ja siihen liittyvä riskitaso on kohonnut. Varmista, että yksikkösi talouden lähipalvelut käy etukäteen läpi hankkeen budjetin.",
            en: "The financial scope of the collaboration is moderate, and the related risk level is elevated.Make sure that your unit's financial experts have reviewed the budget in advance."
        },
        3: {
            fi: "Yhteistyön taloudellinen laajuus on huomattava, ja siihen liittyvä riskitaso on merkittävä",
            en: "The financial scope the collaboration is siginificant and poses a substantial risk"
        }

    },

    dualUse: {
        title: {
            fi: "Kaksikäyttötuotteiden riskitaso",
            en: "Dual-Use Products Risk Level"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Antamiesi tietojen perusteella yhteistyö ei sisällä kaksoiskäyttöriskejä. Jos tästä kuitenkin on jotain epävarmuutta, tutustu yliopiston ohjeisiin.",
            en: "Based on your response, this collaboration does not pose Dual Use risks. "
        },
        2: {
            fi: "Olet ilmoittanut, että ei ole tiedossa onko yhteistyössä mahdollisuus siihen, että kumppanille siirtyy sotilaskäyttöön soveltuvaa teknologiaa tai osaamista. Intressimme ja myös lakisääteinen velvollisuutemme on varmistaa, että asiantuntijuuttamme tai teknologiaamme ei päädy sotilaalliseen loppukäyttöön. Tutustu tarkasti Flammassa oleviin ohjeisiin ja ota yhteyttä tarvittaessa yliopiston asiantuntijoihin.",
            en: "You have indicated that it is unknown whether the collaboration may involve the transfer of technology or expertise suitable for military use to the partner. Our interest, as well as our legal obligation, is to ensure that our expertise or technology does not end up in military end-use. Please carefully review the guidelines available in Flamma and consult the university’s experts if necessary."
        },
        3: {
            fi: "Olet ilmoittanut, että yhteistyössä on mahdollisuus siihen, että kumppanille siirtyy sotilaskäyttöön soveltuvaa teknologiaa tai osaamista. Intressimme ja myös lakisääteinen velvollisuutemme on varmistaa, että asiantuntijuuttamme tai teknologiaamme ei päädy sotilaalliseen loppukäyttöön.",
            en: "According to the information provided, there is a possibility of military technology or related knowledge being tranferred to the partner in question. It is our interest, and legal requirement to ensure that our expertise or technology does not end up in military use."
        }
    },
    ethics: {
        title: {
            fi: "Eettinen riskitaso",
            en: "Ethical Risk Level"
        },
        0: {
            fi: "Virheellinen tai puuttuva riskiluokitus",
            en: "Invalid or missing risk level"
        },
        1: {
            fi: "Ilmoituksesi perusteella yhteistyössä ei ole erityisiä eettisiä haasteita.",
            en: "Based on your response, this collaboration does not pose ethical challenges."
        },
        2: {
            fi: "Et ole varma yhteistyön eettisistä riskeistä.",
            en: "You are not sure if the collaboration includes ethical risks."
        },
        3: {
            fi: "Olet arvioinut yhteistyön eettiset riskit merkittäviksi.",
            en: "You have assessed the ethical risks of the collaboration as significant."
        }
    }
}