# HH-SECUR-be
Backend and Database for HH-SECUR-i

## Endpoints

<details>

<summary>

**/status** - GET: Server status check

</summary>

Responds `{ok: true}` if server is running. Doesn't require successful database connection.

</details>

<details>

<summary>

**/login** - POST: Login endpoint with username and password payload

</summary>

**Request body format:**

```
{
    "username": "user",
    "password": "password"
}

```

Credentials for default user and admin are defined in env variables.

</details>

<details>

<summary>

**/users** - GET: List of users with password hash omitted

</summary>

    - Returns list of users with password_hash omitted

    - Requires authentication

Responses:

    - Failures: 401: Auth failure

</details>

<details>

<summary>

**/users/{id}** - GET: User by the specific id with password hash omitted

</summary>

    - Returns specific user by ID

    - Requires authentication

Responses:

    - Success: 200

    - Failures: 401: Auth failure, 404: user not found
    
</details>

<details>

<summary>

**/users** - POST: Post a new user with user data in the request body

</summary>

    - Create new user

    - Requires authentication and admin role

Request body:

```
{
    "username": "Username",
    "email": "valid@emailformat.com",
    "password": "password",
    "role": "role"
}
```

Requirements:

    - Not empty / null: username, email, password, role

    - Unique: username, email

    - Valid format: email

Responses:

    - Success: 200 - Json of generated user with password_hash omitted

    - Failures: 401, 403: Auth errors, 422: Validation errors
    
</details>

<details>

<summary>

**/users/{id}** - PATCH: Update user values with omitted fields retaining old values

</summary>

    - Update information of a specific user.

    - Requires authentication and admin role

Request body (attributes can be omitted, only included ones will be updated):

```
{
    "username": "Username",
    "email": "valid@emailformat.com",
    "password": "password",
    "role": "role"
}
```

Responses:

    - Success: 200 - Success message and updated json of user with password_hash omitted

    - Failures: 401, 403 - Auth failures

</details>

<details>

<summary>

**/users/{id}** - DELETE: Delete user by id

</summary>

    - Deletes a specific user
    
    - Requires authentication and admin role

Responses:

    - Success: 200 - User has been deleted message

    - Failures: 401, 403 - Auth failures, 404 - User not found

</details>

<details>

<summary>

**/organizations** - GET: List of partner organizations

</summary>

    - Returns list of organizations (id, name:(fi, en), country id)

    - Requires authentication

Response body:

```
{
    "organizations": [
        {
            "id": "organization-id",
            "name": {
                "fi": "Name in Finnish",
                "en": "Name in English"
            },
            "countryId": "XXX"
        }
    ]
}
```

Responses:

    - Success: 200

    - Failures: 401: Auth failure

</details>

<details>

<summary>

**/calculaterisk** - POST: Risk calculation endpoint

</summary>

Requires: authentication

Request body:

```
{
    "name": "Esimerkkiprojekti",
    "ownerusername": "User",
    "creatorusername": "Admin",
    "country": "CHN",
    "organization": 1,
    "hhrole": "option1",
    "consortium": "option1"
    "organizationtype": "option1",
    "history": "option1",
    "contract": "option1",
    "collaborationtype": ["option1", "option2"]´
    "funding": "option1",
    "exhange": "option1"
    "fundinghistory": "option1",
    "fundingsource": "option1"
    "liability": "option1",
    "personalinformation": "option1",
    "dualuse": "option1",
    "ethics": "option1",
    "duration": "option1",
    "organizationother": "specify organization",
    "collaborationtypeother": "specify collaboration type",
    "additionalinformation": "additional description"

}
```

Optional fields: 

    - organizationother - Description for other option in organization

    - collaborationtypeother - Description for other option in collaboration type

    - additionalinformation - Additional information about project

Conditionally required fields

Funding: "option1":

    - exchange

    - fundinghistory

    - fundingsource

Response will always contain these but left empty if missing from request or condition to include them is not triggered.

Valid values #descriptions after:

```
name: project name field content,
ownerusername: valid username of project owner,
creatorusername: valid username of current user,
country: 3 letter country code
organization: organization number id
hhrole: option1 | option2 | option3 # Collaboration coordinator | Partner  Other
consortium: option1 | option2 # Bilateral | Multilateral
history: option1 | option2 # Yes | No
organizationtype: option1 | option2 | option3 | option4 | option5 # University | Other Research Institute | Company | Non-Governmental Organization | Other
contract: option1 | option2 # Yes | No
collaborationtype: [ option1 | option2 | option3 | option4 | option5 | option6 | option7 ] # Research Collaboration | Education/Teaching Collaboration | Export of Education | International Student Mobility | International Staff Mobility | Joint Degree 
funding: option1 | option2 # Yes | No
exchange: option1 | option2 | option3 # In euros | Partially in euros | In currency other than euros
fundinghistory: option1 | option2 #Yes | No
fundingsource: option1 | option2 | option3 | option4 | option5 | option6 | option7 | option 8 # Finnish public sector entity | Finnish foundation or equivalent | Finnish corpororation | Finnish source other than the above | Foreign public sector entity | Foreign foundation or equivalent | Foreign corporation | Foreign entity other than the above
liability: option1 | option2 | option3  # 0-20.000 | 20.000 | Over 50.000
personalinformation: option1 | option2 # Yes | No | Unkown
dualuse: option1 | option2 | option3 # Yes | No | Unkown
ethics: option1 | option2 | option3 | option4 | option5 # Absolutely not | Most likely not | Possibly | Very likely | Definitely
duration: option1 | option2 | option3 # 0-24 months | 24-60 months | Over 60 Months
organizationother: any text
collaborationother: any text
additionalinformation: any text

```

Responses:

    - Success: 200 - Risk report with 0 - 3 range for risk factors

        - 0 for a risk factor means calculation failed likely due to invalid value in the request body

    - Failures: 401 - Auth failure, 422 - Missing fields from request body, missing fields listed

Response body:

```
{
    "report": {
        "name": "Sample report",
        "ownername": "Placeholder",
        "creatorname": "Placeholder",
        "collaboration": {
            "title": {
                "fi": "Yhteistyön kokonaisriskiarvio",
                "en": "Overall Collaboration Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Yhteistyön kokonaisriski on alhainen. Yhteistyössä voi kuitenkin  esiintyä tunnistamattomia riskejä ja nyt arvioitujen asioiden riskitaso saattaa muuttua jatkossa.",
                "en": "Overall risk rating for the collaboration is low. Collaboration may still include unforeseen risks and risk ratings for currently assessed risks may change in the future."
            }
        },
        "country": {
            "overall": {
                "title": {
                    "fi": "Maan riskitaso",
                    "en": "Country Risk Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Maan yhteenlaskettu kokonaisriskitaso on matala.",
                    "en": "The overall risk rating for the selected country is low."
                }
            },
            "corruption": {
                "title": {
                    "fi": "Korruptio",
                    "en": "Corruption"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanin sijaintimaassa korruptio ei ole merkittävä riski.",
                    "en": "Risk for corruption in the collaborator's country of residence is not meaningful."
                }
            },
            "security": {
                "title": {
                    "fi": "Turvallisuustaso",
                    "en": "Security Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyömaahan matkustamiseen ei liity rajoituksia. Varmistu halutessasi tarkemmin tilanteesta ulkoministeriön matkustustiedotteista.",
                    "en": "There are not restrictions for travel to the collaborating country. You may use the ministry of foreign affairs travel notices to reassess the status."
                }
            },
            "academicfreedom": {
                "title": {
                    "fi": "Akateeminen vapaus",
                    "en": "Academic Freedom"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee maassa, jossa akateeminen vapaus on hyvällä tasolla.",
                    "en": "Your collaboration partner is located in a country, where academic freedom is at a good level."
                }
            },
            "politicalstability": {
                "title": {
                    "fi": "Poliittinen vakaus",
                    "en": "Political Stability"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee poliittisesti vakaassa maassa.",
                    "en": "Your collaboration partner is located in a politically stable country."
                }
            },
            "development": {
                "title": {
                    "fi": "Maan kehittyineisyys",
                    "en": "Country Development Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee kehittyneessä maassa.",
                    "en": "Your partner is located in a developed country."
                }
            },
            "gdpr": {
                "title": {
                    "fi": "GDPR",
                    "en": "GDPR"
                },
                "risk": 1,
                "description": {
                    "fi": "Antamisesi tietojen perusteella yhteistyöhön ei kohdistu  tietousuojamielessä erityisiä vaatimuksia mutta varmistu, että  henkilötietoja ei yhteistyössä tarvitse luovuttaa.",
                    "en": "Based on the information you have provided, GDPR is not applicable, but please double check, if this really is the case."
                }
            },
            "sanctions": {
                "title": {
                    "fi": "Pakotteet",
                    "en": "Sanctions"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee maassa, johon ei kohdistu YK- tai  EU-pakotteita. Pakotteilla ei siis ole vaikutusta yhteistyöhankkeeseesi.",
                    "en": "Your collaboration partner is located in a country, which is no sanctioned by UN or EU. Sanctions have no effect on your collaboration."
                }
            },
            "ruleoflaw": {
                "title": {
                    "fi": "Oikeusvalitio",
                    "en": "Rule of Law"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee maassa, joka on oikeusvaltio, mikä  tarkoittaa muun muassa, että sopimuksiin liittyvä oikeussuoja on  lähtökohtaisesti vahva. Tämä on kuitenkin vain perusta ja  yhteistyösopimus on joka tapauksessa syytä laatia huolella.",
                    "en": "Your collaboration partner is located in a country, where rule of law is prevalent and agreements are normally followed and respected. As this is merely the point of departure, it is still necessary to draw up an agreement with appropriate care."
                }
            }
        },
        "organization": {
            "title": {
                "fi": "Organisaation riskitaso",
                "en": "Organization Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Yhteistyöyliopisto on listattu World Higher Education -tietokannassa. Tämä tarkoittaa, että yliopisto kuuluu varmuudella sijaintimaansa viralliseen koulutusjärjestelmään. Tämä on minimtaso, eikä välttämättä ole tae sen laadusta.",
                "en": "The partner university is listed in the World Higher Education database. This means that the university is officially part of its country’s education system. This represents a minimum standard and does not necessarily guarantee the quality of the institution."
            }
        },
        "financial": {
            "overall": {
                "title": {
                    "fi": "Taloudellinen kokonaisriskitaso",
                    "en": "Overall Financial Risk Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyön taloudellinen laajuus ei ole merkittävä, eikä muodosta merkittävää riskiä. Varmista tarvittaessa ykskkösi talouden lähipalveluilta, että hankkeen budjetti on asianmukainen.",
                    "en": "The financial scope of the collaboration is not significant and does not pose a major risk. If necessary, consult your unit’s financial services to ensure that the project budget is appropriate."
                }
            },
            "exchange": {
                "title": {
                    "fi": "Valuuttakurssiriski",
                    "en": "Exchange Rate"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyösi talous on sidottu Euroon, mikä on hyvä tapa välttää valuuttakurssiriskejä.",
                    "en": "Your collaboration is based on funding in Euro, which is a good away of avoiding currency risks."
                }
            },
            "scope": {
                "title": {
                    "fi": "Taloudellinen laajuus",
                    "en": "Fincancial scope"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyön taloudellinen laajuus ei ole merkittävä, eikä muodosta merkittävää riskiä. Varmista tarvittaessa ykskkösi talouden lähipalveluilta, että hankkeen budjetti on asianmukainen.",
                    "en": "The financial scope of the collaboration is not significant, and does not pose a substantial risk. Consult your unit's financial experts to make sure that the project budget is appropriate."
                }
            }
        },
        "dualuse": {
            "title": {
                "fi": "Kaksikäyttötuotteiden riskitaso",
                "en": "Dual-Use Products Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Antamiesi tietojen perusteella yhteistyö ei sisällä kaksoiskäyttöriskejä. Jos tästä kuitenkin on jotain epävarmuutta, tutustu yliopiston ohjeisiin.",
                "en": "Based on your response, this collaboration does not pose Dual Use risks. "
            }
        },
        "ethics": {
            "title": {
                "fi": "Eettinen riskitaso",
                "en": "Ethical Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Ilmoituksesi perusteella yhteistyössä ei ole erityisiä eettisiä haasteita.",
                "en": "Based on your response, this collaboration does not pose ethical challenges."
            }
        },
        "organizationname": "Add name here if other is selected for organization",
        "organizationother": "This message is added to response if option5 is selected for organizationtype",
        "collaborationtypeother": "This message is added to response if option7 is included in collaboration types",
        "additionalinformation": "Additional information about project"
    },
    "choices": {
        "country": "SWE",
        "organization": "1",
        "organizationtype": "option5",
        "hhrole": "option1",
        "collaborationtype": [
            "option1",
            "option2",
            "option3",
            "option4",
            "option7"
        ],
        "history": "option1",
        "contract": "option1",
        "funding": "option1",
        "liability": "option1",
        "exchange": "option1",
        "personalinformation": "option1",
        "dualuse": "option1",
        "ethics": "option1",
        "duration": "option1",
        "organizationother": "This message is added to response if option5 is selected for organizationtype",
        "collaborationtypeother": "This message is added to response if option7 is included in collaboration types",
        "additionalinformation": "Additional information about project",
        "name": "Sample report",
        "fundinghistory": "option1",
        "fundingsource": "option1",
        "consortium": "option1",
        "organizationname": "Add name here if other is selected for organization",
        "ownerusername": "User",
        "creatorusername": "User"
    }
}
```

</details>

<details>

<summary>

**/reports** - GET: fetch all reports

</summary>

Fetches all reports with collaborationTypes relation included.

Requires: Authentication

</details>

<details>

<summary>

**/reports** - POST: Save reports to database

</summary>

Saves report to database and returns that report and its relations.

Requires: Authentication

Request body:

Same as **/calculaterisk**

Elements:

    - "reportDeails": {} - representation of report data in the database

    - "report": {} - risk report in readable form including localizations

    - "choices": {} - list of choices for form page options

Report and choices content can be used fill results and form pages.

Example response:

```

{
    "message": "Report by the id of 1 has been saved.",
    "reportDetails": {
        "id": 1,
        "name": "Sample report",
        "collaborationHistoryId": 1,
        "consortiumTypeId": 1,
        "contractInfoId": 1,
        "countryId": 152,
        "dualUseId": 1,
        "durationId": 1,
        "ethicsAssessmentId": 1,
        "hhroleId": 1,
        "liabilityId": 1,
        "fundingId": 1,
        "organizationId": 6,
        "organizationTypeId": 5,
        "personalInformationId": 1,
        "userId": 1,
        "created_at": "2026-10-02T14:16:38.000Z",
        "updated_at": "2026-10-02T14:16:38.000Z",
        "reportSnapshots": [
            {
                "id": 1,
                "reportId": 1,
                "name": "Sample report",
                "ownerUsername": "User",
                "creatorUsername": "User",
                "organizationName": "",
                "additionalInformation": "Additional information about project",
                "organizationOther": "This message is added to response if option5 is selected for organizationtype",
                "collaborationOther": "This message is added to response if option7 is included in collaboration types",
                "collaboration": 1,
                "countryOverall": 1,
                "countryCorruption": 1,
                "countrySecurity": 1,
                "countryAcademicFreedom": 1,
                "countryPoliticalStability": 1,
                "countryDevelopment": 1,
                "countryGdpr": 1,
                "countrySanctions": 1,
                "countryRuleOfLaw": 1,
                "organization": 1,
                "financialOverall": 1,
                "financialExchange": 1,
                "financialScope": 1,
                "dualUse": 1,
                "ethics": 1,
                "created_at": "2026-10-02T14:16:38.000Z",
                "updated_at": "2026-10-02T14:16:38.000Z"
            }
        ],
        "collaborationHistory": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "collaborationTypes": [
            {
                "id": 1,
                "code": "option1",
                "fi": "TKI-yhteistyö",
                "en": "Research Collaboration",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 1,
                    "reportId": 1,
                    "collaborationTypeId": 1,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            },
            {
                "id": 2,
                "code": "option2",
                "fi": "Koulutus/opetusyhteistyö",
                "en": "Education/Teaching Collaboration",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 2,
                    "reportId": 1,
                    "collaborationTypeId": 2,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            },
            {
                "id": 3,
                "code": "option3",
                "fi": "Koulutusvienti",
                "en": "Export of Education",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 3,
                    "reportId": 1,
                    "collaborationTypeId": 3,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            },
            {
                "id": 4,
                "code": "option4",
                "fi": "Kansainvälinen opiskelijaliikkuvuus",
                "en": "International Student Mobility",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 4,
                    "reportId": 1,
                    "collaborationTypeId": 4,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            },
            {
                "id": 7,
                "code": "option7",
                "fi": "Muu",
                "en": "Other",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 5,
                    "reportId": 1,
                    "collaborationTypeId": 7,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            }
        ],
        "consortiumType": {
            "id": 1,
            "code": "option1",
            "fi": "Kahdenvälinen",
            "en": "Bilateral",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "contractInfo": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "country": {
            "id": 152,
            "code": "SWE",
            "fi": "Ruotsi",
            "en": "Sweden",
            "dataYear": 2025,
            "corruption": 97.64,
            "security": 1,
            "politicalStability": 73.46,
            "academicFreedom": 0.934,
            "development": 5,
            "gdpr": 1,
            "sanctions": 1,
            "ruleOfLaw": 0.85227449,
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "dualUse": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "duration": {
            "id": 1,
            "code": "option1",
            "fi": "0-24 kk",
            "en": "0-24 months",
            "lowerlimit": 0,
            "upperlimit": 24,
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "ethicsAssessment": {
            "id": 1,
            "code": "option1",
            "fi": "Ei missään tapauksessa",
            "en": "Absolutely not",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "hhrole": {
            "id": 1,
            "code": "option1",
            "fi": "Yhteistyön koordinaattori",
            "en": "Collaboration Coordnator",
            "created_at": "2026-10-02T14:16:37.000Z",
            "updated_at": "2026-10-02T14:16:37.000Z"
        },
        "liability": {
            "id": 1,
            "code": "option1",
            "fi": "0-20.000",
            "en": "0-20.000",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "funding": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "organization": {
            "id": 6,
            "code": "peking",
            "fi": "Pekingin yliopisto",
            "en": "Peking University",
            "country_code": "CHN",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "organizationType": {
            "id": 5,
            "code": "option5",
            "fi": "Muu",
            "en": "Other",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "personalInformation": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "user": {
            "id": 1,
            "username": "User",
            "email": "user@testing.com",
            "password_hash": "$2b$10$ZiprhagywjrZUNrz9/RdxOjhJ9Sl4onXYW2/o8joMqPKYhICl6xSC",
            "role": "user",
            "created_at": "2026-10-02T14:16:37.000Z",
            "updated_at": "2026-10-02T14:16:37.000Z"
        }
    },
    "report": {
        "name": "Sample report",
        "ownername": "Placeholder",
        "creatorname": "Placeholder",
        "collaboration": {
            "title": {
                "fi": "Yhteistyön kokonaisriskiarvio",
                "en": "Overall Collaboration Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Yhteistyön kokonaisriski on alhainen. Yhteistyössä voi kuitenkin  esiintyä tunnistamattomia riskejä ja nyt arvioitujen asioiden riskitaso saattaa muuttua jatkossa.",
                "en": "Overall risk rating for the collaboration is low. Collaboration may still include unforeseen risks and risk ratings for currently assessed risks may change in the future."
            }
        },
        "country": {
            "overall": {
                "title": {
                    "fi": "Maan riskitaso",
                    "en": "Country Risk Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Maan yhteenlaskettu kokonaisriskitaso on matala.",
                    "en": "The overall risk rating for the selected country is low."
                }
            },
            "corruption": {
                "title": {
                    "fi": "Korruptio",
                    "en": "Corruption"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanin sijaintimaassa korruptio ei ole merkittävä riski.",
                    "en": "Risk for corruption in the collaborator's country of residence is not meaningful."
                }
            },
            "security": {
                "title": {
                    "fi": "Turvallisuustaso",
                    "en": "Security Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyömaahan matkustamiseen ei liity rajoituksia. Varmistu halutessasi tarkemmin tilanteesta ulkoministeriön matkustustiedotteista.",
                    "en": "There are not restrictions for travel to the collaborating country. You may use the ministry of foreign affairs travel notices to reassess the status."
                }
            },
            "academicfreedom": {
                "title": {
                    "fi": "Akateeminen vapaus",
                    "en": "Academic Freedom"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee maassa, jossa akateeminen vapaus on hyvällä tasolla.",
                    "en": "Your collaboration partner is located in a country, where academic freedom is at a good level."
                }
            },
            "politicalstability": {
                "title": {
                    "fi": "Poliittinen vakaus",
                    "en": "Political Stability"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee poliittisesti vakaassa maassa.",
                    "en": "Your collaboration partner is located in a politically stable country."
                }
            },
            "development": {
                "title": {
                    "fi": "Maan kehittyineisyys",
                    "en": "Country Development Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee kehittyneessä maassa.",
                    "en": "Your partner is located in a developed country."
                }
            },
            "gdpr": {
                "title": {
                    "fi": "GDPR",
                    "en": "GDPR"
                },
                "risk": 1,
                "description": {
                    "fi": "Antamisesi tietojen perusteella yhteistyöhön ei kohdistu  tietousuojamielessä erityisiä vaatimuksia mutta varmistu, että  henkilötietoja ei yhteistyössä tarvitse luovuttaa.",
                    "en": "Based on the information you have provided, GDPR is not applicable, but please double check, if this really is the case."
                }
            },
            "sanctions": {
                "title": {
                    "fi": "Pakotteet",
                    "en": "Sanctions"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee maassa, johon ei kohdistu YK- tai  EU-pakotteita. Pakotteilla ei siis ole vaikutusta yhteistyöhankkeeseesi.",
                    "en": "Your collaboration partner is located in a country, which is no sanctioned by UN or EU. Sanctions have no effect on your collaboration."
                }
            },
            "ruleoflaw": {
                "title": {
                    "fi": "Oikeusvalitio",
                    "en": "Rule of Law"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee maassa, joka on oikeusvaltio, mikä  tarkoittaa muun muassa, että sopimuksiin liittyvä oikeussuoja on  lähtökohtaisesti vahva. Tämä on kuitenkin vain perusta ja  yhteistyösopimus on joka tapauksessa syytä laatia huolella.",
                    "en": "Your collaboration partner is located in a country, where rule of law is prevalent and agreements are normally followed and respected. As this is merely the point of departure, it is still necessary to draw up an agreement with appropriate care."
                }
            }
        },
        "organization": {
            "title": {
                "fi": "Organisaation riskitaso",
                "en": "Organization Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Yhteistyöyliopisto on listattu World Higher Education -tietokannassa. Tämä tarkoittaa, että yliopisto kuuluu varmuudella sijaintimaansa viralliseen koulutusjärjestelmään. Tämä on minimtaso, eikä välttämättä ole tae sen laadusta.",
                "en": "The partner university is listed in the World Higher Education database. This means that the university is officially part of its country’s education system. This represents a minimum standard and does not necessarily guarantee the quality of the institution."
            }
        },
        "financial": {
            "overall": {
                "title": {
                    "fi": "Taloudellinen kokonaisriskitaso",
                    "en": "Overall Financial Risk Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyön taloudellinen laajuus ei ole merkittävä, eikä muodosta merkittävää riskiä. Varmista tarvittaessa ykskkösi talouden lähipalveluilta, että hankkeen budjetti on asianmukainen.",
                    "en": "The financial scope of the collaboration is not significant and does not pose a major risk. If necessary, consult your unit’s financial services to ensure that the project budget is appropriate."
                }
            },
            "exchange": {
                "title": {
                    "fi": "Valuuttakurssiriski",
                    "en": "Exchange Rate"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyösi talous on sidottu Euroon, mikä on hyvä tapa välttää valuuttakurssiriskejä.",
                    "en": "Your collaboration is based on funding in Euro, which is a good away of avoiding currency risks."
                }
            },
            "scope": {
                "title": {
                    "fi": "Taloudellinen laajuus",
                    "en": "Fincancial scope"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyön taloudellinen laajuus ei ole merkittävä, eikä muodosta merkittävää riskiä. Varmista tarvittaessa ykskkösi talouden lähipalveluilta, että hankkeen budjetti on asianmukainen.",
                    "en": "The financial scope of the collaboration is not significant, and does not pose a substantial risk. Consult your unit's financial experts to make sure that the project budget is appropriate."
                }
            }
        },
        "dualuse": {
            "title": {
                "fi": "Kaksikäyttötuotteiden riskitaso",
                "en": "Dual-Use Products Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Antamiesi tietojen perusteella yhteistyö ei sisällä kaksoiskäyttöriskejä. Jos tästä kuitenkin on jotain epävarmuutta, tutustu yliopiston ohjeisiin.",
                "en": "Based on your response, this collaboration does not pose Dual Use risks. "
            }
        },
        "ethics": {
            "title": {
                "fi": "Eettinen riskitaso",
                "en": "Ethical Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Ilmoituksesi perusteella yhteistyössä ei ole erityisiä eettisiä haasteita.",
                "en": "Based on your response, this collaboration does not pose ethical challenges."
            }
        },
        "organizationname": "Add name here if other is selected for organization",
        "organizationother": "This message is added to response if option5 is selected for organizationtype",
        "collaborationtypeother": "This message is added to response if option7 is included in collaboration types",
        "additionalinformation": "Additional information about project"
    },
    "choices": {
        "country": "SWE",
        "organization": "6",
        "organizationtype": "option5",
        "hhrole": "option1",
        "collaborationtype": [
            "option1",
            "option2",
            "option3",
            "option4",
            "option7"
        ],
        "history": "option1",
        "contract": "option1",
        "funding": "option1",
        "liability": "option1",
        "exchange": "option1",
        "personalinformation": "option1",
        "dualuse": "option1",
        "ethics": "option1",
        "duration": "option1",
        "organizationother": "This message is added to response if option5 is selected for organizationtype",
        "collaborationtypeother": "This message is added to response if option7 is included in collaboration types",
        "additionalinformation": "Additional information about project",
        "name": "Sample report",
        "fundinghistory": "option1",
        "fundingsource": "option1",
        "consortium": "option1",
        "organizationname": "Add name here if other is selected for organization",
        "ownerusername": "User",
        "creatorusername": "User"
    }
}

```

</details>

<details>

<summary>

**/reports/{id}** - GET: Fetch specific report

</summary>

Fetches a specific report, its relations, and its verbose risk report

Requires: Authentication

Reponse:

Elements:

    - "reportDeails": {} - representation of report data in the database

    - "report": {} - risk report in readable form including localizations

    - "choices": {} - list of choices for form page options

Report and choices content can be used fill results and form pages.

Example response:

```

{
    "reportDetails": {
        "id": 1,
        "name": "Sample report",
        "collaborationHistoryId": 1,
        "consortiumTypeId": 1,
        "contractInfoId": 1,
        "countryId": 152,
        "dualUseId": 1,
        "durationId": 1,
        "ethicsAssessmentId": 1,
        "hhroleId": 1,
        "liabilityId": 1,
        "fundingId": 1,
        "organizationId": 6,
        "organizationTypeId": 5,
        "personalInformationId": 1,
        "userId": 1,
        "created_at": "2026-10-02T14:16:38.000Z",
        "updated_at": "2026-10-02T14:16:38.000Z",
        "reportSnapshots": [
            {
                "id": 1,
                "reportId": 1,
                "name": "Sample report",
                "ownerUsername": "User",
                "creatorUsername": "User",
                "organizationName": "",
                "additionalInformation": "Additional information about project",
                "organizationOther": "This message is added to response if option5 is selected for organizationtype",
                "collaborationOther": "This message is added to response if option7 is included in collaboration types",
                "collaboration": 1,
                "countryOverall": 1,
                "countryCorruption": 1,
                "countrySecurity": 1,
                "countryAcademicFreedom": 1,
                "countryPoliticalStability": 1,
                "countryDevelopment": 1,
                "countryGdpr": 1,
                "countrySanctions": 1,
                "countryRuleOfLaw": 1,
                "organization": 1,
                "financialOverall": 1,
                "financialExchange": 1,
                "financialScope": 1,
                "dualUse": 1,
                "ethics": 1,
                "created_at": "2026-10-02T14:16:38.000Z",
                "updated_at": "2026-10-02T14:16:38.000Z"
            }
        ],
        "collaborationHistory": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "collaborationTypes": [
            {
                "id": 1,
                "code": "option1",
                "fi": "TKI-yhteistyö",
                "en": "Research Collaboration",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 1,
                    "reportId": 1,
                    "collaborationTypeId": 1,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            },
            {
                "id": 2,
                "code": "option2",
                "fi": "Koulutus/opetusyhteistyö",
                "en": "Education/Teaching Collaboration",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 2,
                    "reportId": 1,
                    "collaborationTypeId": 2,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            },
            {
                "id": 3,
                "code": "option3",
                "fi": "Koulutusvienti",
                "en": "Export of Education",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 3,
                    "reportId": 1,
                    "collaborationTypeId": 3,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            },
            {
                "id": 4,
                "code": "option4",
                "fi": "Kansainvälinen opiskelijaliikkuvuus",
                "en": "International Student Mobility",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 4,
                    "reportId": 1,
                    "collaborationTypeId": 4,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            },
            {
                "id": 7,
                "code": "option7",
                "fi": "Muu",
                "en": "Other",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 5,
                    "reportId": 1,
                    "collaborationTypeId": 7,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            }
        ],
        "consortiumType": {
            "id": 1,
            "code": "option1",
            "fi": "Kahdenvälinen",
            "en": "Bilateral",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "contractInfo": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "country": {
            "id": 152,
            "code": "SWE",
            "fi": "Ruotsi",
            "en": "Sweden",
            "dataYear": 2025,
            "corruption": 97.64,
            "security": 1,
            "politicalStability": 73.46,
            "academicFreedom": 0.934,
            "development": 5,
            "gdpr": 1,
            "sanctions": 1,
            "ruleOfLaw": 0.85227449,
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "dualUse": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "duration": {
            "id": 1,
            "code": "option1",
            "fi": "0-24 kk",
            "en": "0-24 months",
            "lowerlimit": 0,
            "upperlimit": 24,
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "ethicsAssessment": {
            "id": 1,
            "code": "option1",
            "fi": "Ei missään tapauksessa",
            "en": "Absolutely not",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "hhrole": {
            "id": 1,
            "code": "option1",
            "fi": "Yhteistyön koordinaattori",
            "en": "Collaboration Coordnator",
            "created_at": "2026-10-02T14:16:37.000Z",
            "updated_at": "2026-10-02T14:16:37.000Z"
        },
        "liability": {
            "id": 1,
            "code": "option1",
            "fi": "0-20.000",
            "en": "0-20.000",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "funding": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "organization": {
            "id": 6,
            "code": "peking",
            "fi": "Pekingin yliopisto",
            "en": "Peking University",
            "country_code": "CHN",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "organizationType": {
            "id": 5,
            "code": "option5",
            "fi": "Muu",
            "en": "Other",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "personalInformation": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "user": {
            "id": 1,
            "username": "User",
            "email": "user@testing.com",
            "password_hash": "$2b$10$ZiprhagywjrZUNrz9/RdxOjhJ9Sl4onXYW2/o8joMqPKYhICl6xSC",
            "role": "user",
            "created_at": "2026-10-02T14:16:37.000Z",
            "updated_at": "2026-10-02T14:16:37.000Z"
        }
    },
    "report": {
        "name": "Sample report",
        "ownername": "User",
        "creatorname": "User",
        "collaboration": {
            "title": {
                "fi": "Yhteistyön kokonaisriskiarvio",
                "en": "Overall Collaboration Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Yhteistyön kokonaisriski on alhainen. Yhteistyössä voi kuitenkin  esiintyä tunnistamattomia riskejä ja nyt arvioitujen asioiden riskitaso saattaa muuttua jatkossa.",
                "en": "Overall risk rating for the collaboration is low. Collaboration may still include unforeseen risks and risk ratings for currently assessed risks may change in the future."
            }
        },
        "country": {
            "overall": {
                "title": {
                    "fi": "Maan riskitaso",
                    "en": "Country Risk Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Maan yhteenlaskettu kokonaisriskitaso on matala.",
                    "en": "The overall risk rating for the selected country is low."
                }
            },
            "corruption": {
                "title": {
                    "fi": "Korruptio",
                    "en": "Corruption"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanin sijaintimaassa korruptio ei ole merkittävä riski.",
                    "en": "Risk for corruption in the collaborator's country of residence is not meaningful."
                }
            },
            "security": {
                "title": {
                    "fi": "Turvallisuustaso",
                    "en": "Security Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyömaahan matkustamiseen ei liity rajoituksia. Varmistu halutessasi tarkemmin tilanteesta ulkoministeriön matkustustiedotteista.",
                    "en": "There are not restrictions for travel to the collaborating country. You may use the ministry of foreign affairs travel notices to reassess the status."
                }
            },
            "academicfreedom": {
                "title": {
                    "fi": "Akateeminen vapaus",
                    "en": "Academic Freedom"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee maassa, jossa akateeminen vapaus on hyvällä tasolla.",
                    "en": "Your collaboration partner is located in a country, where academic freedom is at a good level."
                }
            },
            "politicalstability": {
                "title": {
                    "fi": "Poliittinen vakaus",
                    "en": "Political Stability"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee poliittisesti vakaassa maassa.",
                    "en": "Your collaboration partner is located in a politically stable country."
                }
            },
            "development": {
                "title": {
                    "fi": "Maan kehittyineisyys",
                    "en": "Country Development Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee kehittyneessä maassa.",
                    "en": "Your partner is located in a developed country."
                }
            },
            "gdpr": {
                "title": {
                    "fi": "GDPR",
                    "en": "GDPR"
                },
                "risk": 1,
                "description": {
                    "fi": "Antamisesi tietojen perusteella yhteistyöhön ei kohdistu  tietousuojamielessä erityisiä vaatimuksia mutta varmistu, että  henkilötietoja ei yhteistyössä tarvitse luovuttaa.",
                    "en": "Based on the information you have provided, GDPR is not applicable, but please double check, if this really is the case."
                }
            },
            "sanctions": {
                "title": {
                    "fi": "Pakotteet",
                    "en": "Sanctions"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee maassa, johon ei kohdistu YK- tai  EU-pakotteita. Pakotteilla ei siis ole vaikutusta yhteistyöhankkeeseesi.",
                    "en": "Your collaboration partner is located in a country, which is no sanctioned by UN or EU. Sanctions have no effect on your collaboration."
                }
            },
            "ruleoflaw": {
                "title": {
                    "fi": "Oikeusvalitio",
                    "en": "Rule of Law"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee maassa, joka on oikeusvaltio, mikä  tarkoittaa muun muassa, että sopimuksiin liittyvä oikeussuoja on  lähtökohtaisesti vahva. Tämä on kuitenkin vain perusta ja  yhteistyösopimus on joka tapauksessa syytä laatia huolella.",
                    "en": "Your collaboration partner is located in a country, where rule of law is prevalent and agreements are normally followed and respected. As this is merely the point of departure, it is still necessary to draw up an agreement with appropriate care."
                }
            }
        },
        "organization": {
            "title": {
                "fi": "Organisaation riskitaso",
                "en": "Organization Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Yhteistyöyliopisto on listattu World Higher Education -tietokannassa. Tämä tarkoittaa, että yliopisto kuuluu varmuudella sijaintimaansa viralliseen koulutusjärjestelmään. Tämä on minimtaso, eikä välttämättä ole tae sen laadusta.",
                "en": "The partner university is listed in the World Higher Education database. This means that the university is officially part of its country’s education system. This represents a minimum standard and does not necessarily guarantee the quality of the institution."
            }
        },
        "financial": {
            "overall": {
                "title": {
                    "fi": "Taloudellinen kokonaisriskitaso",
                    "en": "Overall Financial Risk Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyön taloudellinen laajuus ei ole merkittävä, eikä muodosta merkittävää riskiä. Varmista tarvittaessa ykskkösi talouden lähipalveluilta, että hankkeen budjetti on asianmukainen.",
                    "en": "The financial scope of the collaboration is not significant and does not pose a major risk. If necessary, consult your unit’s financial services to ensure that the project budget is appropriate."
                }
            },
            "exchange": {
                "title": {
                    "fi": "Valuuttakurssiriski",
                    "en": "Exchange Rate"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyösi talous on sidottu Euroon, mikä on hyvä tapa välttää valuuttakurssiriskejä.",
                    "en": "Your collaboration is based on funding in Euro, which is a good away of avoiding currency risks."
                }
            },
            "scope": {
                "title": {
                    "fi": "Taloudellinen laajuus",
                    "en": "Fincancial scope"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyön taloudellinen laajuus ei ole merkittävä, eikä muodosta merkittävää riskiä. Varmista tarvittaessa ykskkösi talouden lähipalveluilta, että hankkeen budjetti on asianmukainen.",
                    "en": "The financial scope of the collaboration is not significant, and does not pose a substantial risk. Consult your unit's financial experts to make sure that the project budget is appropriate."
                }
            }
        },
        "dualuse": {
            "title": {
                "fi": "Kaksikäyttötuotteiden riskitaso",
                "en": "Dual-Use Products Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Antamiesi tietojen perusteella yhteistyö ei sisällä kaksoiskäyttöriskejä. Jos tästä kuitenkin on jotain epävarmuutta, tutustu yliopiston ohjeisiin.",
                "en": "Based on your response, this collaboration does not pose Dual Use risks. "
            }
        },
        "ethics": {
            "title": {
                "fi": "Eettinen riskitaso",
                "en": "Ethical Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Ilmoituksesi perusteella yhteistyössä ei ole erityisiä eettisiä haasteita.",
                "en": "Based on your response, this collaboration does not pose ethical challenges."
            }
        },
        "organizationname": "",
        "organizationother": "This message is added to response if option5 is selected for organizationtype",
        "collaborationtypeother": "This message is added to response if option7 is included in collaboration types",
        "additionalinformation": "Additional information about project"
    },
    "choices": {
        "country": "SWE",
        "organization": 6,
        "organizationtype": "option5",
        "hhrole": "option1",
        "collaborationtype": [
            "option1",
            "option2",
            "option3",
            "option4",
            "option7"
        ],
        "history": "option1",
        "contract": "option1",
        "funding": "option1",
        "liability": "option1",
        "exchange": "placeholder",
        "personalinformation": "option1",
        "dualuse": "option1",
        "ethics": "option1",
        "duration": "option1",
        "organizationother": "This message is added to response if option5 is selected for organizationtype",
        "collaborationtypeother": "This message is added to response if option7 is included in collaboration types",
        "additionalinformation": "Additional information about project",
        "name": "Sample report",
        "fundinghistory": "placeholder",
        "fundingsource": "placeholder",
        "consortium": "option1",
        "organizationname": "",
        "ownerusername": "User",
        "creatorusername": "User"
    }
}

```

</details>

<details>

<summary>

**/reports/{id}** - PATCH: Update a specific report

</summary>

Uses the same function as saving the report and updating is done instead of creation of id param is found.

Requires: Authentication

Reponse:

Elements:

    - "reportDeails": {} - representation of report data in the database

    - "report": {} - risk report in readable form including localizations

    - "choices": {} - list of choices for form page options

Report and choices content can be used fill results and form pages.

```
{
    "message": "Report by the id of 1 has been saved.",
    "reportDetails": {
        "id": 1,
        "name": "Sample report",
        "collaborationHistoryId": 1,
        "consortiumTypeId": 1,
        "contractInfoId": 1,
        "countryId": 152,
        "dualUseId": 1,
        "durationId": 1,
        "ethicsAssessmentId": 1,
        "hhroleId": 1,
        "liabilityId": 1,
        "fundingId": 1,
        "organizationId": 1,
        "organizationTypeId": 5,
        "personalInformationId": 1,
        "userId": 1,
        "created_at": "2026-10-02T14:16:38.000Z",
        "updated_at": "2026-10-02T14:18:28.000Z",
        "reportSnapshots": [
            {
                "id": 2,
                "reportId": 1,
                "name": "Sample report",
                "ownerUsername": "User",
                "creatorUsername": "User",
                "organizationName": "",
                "additionalInformation": "Additional information about project",
                "organizationOther": "This message is added to response if option5 is selected for organizationtype",
                "collaborationOther": "This message is added to response if option7 is included in collaboration types",
                "collaboration": 1,
                "countryOverall": 1,
                "countryCorruption": 1,
                "countrySecurity": 1,
                "countryAcademicFreedom": 1,
                "countryPoliticalStability": 1,
                "countryDevelopment": 1,
                "countryGdpr": 1,
                "countrySanctions": 1,
                "countryRuleOfLaw": 1,
                "organization": 1,
                "financialOverall": 1,
                "financialExchange": 1,
                "financialScope": 1,
                "dualUse": 1,
                "ethics": 1,
                "created_at": "2026-10-02T14:18:28.000Z",
                "updated_at": "2026-10-02T14:18:28.000Z"
            }
        ],
        "collaborationHistory": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "collaborationTypes": [
            {
                "id": 1,
                "code": "option1",
                "fi": "TKI-yhteistyö",
                "en": "Research Collaboration",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 1,
                    "reportId": 1,
                    "collaborationTypeId": 1,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            },
            {
                "id": 2,
                "code": "option2",
                "fi": "Koulutus/opetusyhteistyö",
                "en": "Education/Teaching Collaboration",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 2,
                    "reportId": 1,
                    "collaborationTypeId": 2,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            },
            {
                "id": 3,
                "code": "option3",
                "fi": "Koulutusvienti",
                "en": "Export of Education",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 3,
                    "reportId": 1,
                    "collaborationTypeId": 3,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            },
            {
                "id": 4,
                "code": "option4",
                "fi": "Kansainvälinen opiskelijaliikkuvuus",
                "en": "International Student Mobility",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 4,
                    "reportId": 1,
                    "collaborationTypeId": 4,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            },
            {
                "id": 7,
                "code": "option7",
                "fi": "Muu",
                "en": "Other",
                "createdAt": "2026-10-02T14:16:37.000Z",
                "updatedAt": "2026-10-02T14:16:37.000Z",
                "ReportCollaborationType": {
                    "id": 5,
                    "reportId": 1,
                    "collaborationTypeId": 7,
                    "createdAt": "2026-10-02T14:16:38.000Z",
                    "updatedAt": "2026-10-02T14:16:38.000Z"
                }
            }
        ],
        "consortiumType": {
            "id": 1,
            "code": "option1",
            "fi": "Kahdenvälinen",
            "en": "Bilateral",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "contractInfo": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "country": {
            "id": 152,
            "code": "SWE",
            "fi": "Ruotsi",
            "en": "Sweden",
            "dataYear": 2025,
            "corruption": 97.64,
            "security": 1,
            "politicalStability": 73.46,
            "academicFreedom": 0.934,
            "development": 5,
            "gdpr": 1,
            "sanctions": 1,
            "ruleOfLaw": 0.85227449,
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "dualUse": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "duration": {
            "id": 1,
            "code": "option1",
            "fi": "0-24 kk",
            "en": "0-24 months",
            "lowerlimit": 0,
            "upperlimit": 24,
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "ethicsAssessment": {
            "id": 1,
            "code": "option1",
            "fi": "Ei missään tapauksessa",
            "en": "Absolutely not",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "hhrole": {
            "id": 1,
            "code": "option1",
            "fi": "Yhteistyön koordinaattori",
            "en": "Collaboration Coordnator",
            "created_at": "2026-10-02T14:16:37.000Z",
            "updated_at": "2026-10-02T14:16:37.000Z"
        },
        "liability": {
            "id": 1,
            "code": "option1",
            "fi": "0-20.000",
            "en": "0-20.000",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "funding": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "organization": {
            "id": 1,
            "code": "halmstad",
            "fi": "Halmstadin yliopisto",
            "en": "Halmstad University",
            "country_code": "SWE",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "organizationType": {
            "id": 5,
            "code": "option5",
            "fi": "Muu",
            "en": "Other",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "personalInformation": {
            "id": 1,
            "code": "option1",
            "fi": "Kyllä",
            "en": "Yes",
            "createdAt": "2026-10-02T14:16:37.000Z",
            "updatedAt": "2026-10-02T14:16:37.000Z"
        },
        "user": {
            "id": 1,
            "username": "User",
            "email": "user@testing.com",
            "password_hash": "$2b$10$ZiprhagywjrZUNrz9/RdxOjhJ9Sl4onXYW2/o8joMqPKYhICl6xSC",
            "role": "user",
            "created_at": "2026-10-02T14:16:37.000Z",
            "updated_at": "2026-10-02T14:16:37.000Z"
        }
    },
    "report": {
        "name": "Sample report",
        "ownername": "Placeholder",
        "creatorname": "Placeholder",
        "collaboration": {
            "title": {
                "fi": "Yhteistyön kokonaisriskiarvio",
                "en": "Overall Collaboration Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Yhteistyön kokonaisriski on alhainen. Yhteistyössä voi kuitenkin  esiintyä tunnistamattomia riskejä ja nyt arvioitujen asioiden riskitaso saattaa muuttua jatkossa.",
                "en": "Overall risk rating for the collaboration is low. Collaboration may still include unforeseen risks and risk ratings for currently assessed risks may change in the future."
            }
        },
        "country": {
            "overall": {
                "title": {
                    "fi": "Maan riskitaso",
                    "en": "Country Risk Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Maan yhteenlaskettu kokonaisriskitaso on matala.",
                    "en": "The overall risk rating for the selected country is low."
                }
            },
            "corruption": {
                "title": {
                    "fi": "Korruptio",
                    "en": "Corruption"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanin sijaintimaassa korruptio ei ole merkittävä riski.",
                    "en": "Risk for corruption in the collaborator's country of residence is not meaningful."
                }
            },
            "security": {
                "title": {
                    "fi": "Turvallisuustaso",
                    "en": "Security Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyömaahan matkustamiseen ei liity rajoituksia. Varmistu halutessasi tarkemmin tilanteesta ulkoministeriön matkustustiedotteista.",
                    "en": "There are not restrictions for travel to the collaborating country. You may use the ministry of foreign affairs travel notices to reassess the status."
                }
            },
            "academicfreedom": {
                "title": {
                    "fi": "Akateeminen vapaus",
                    "en": "Academic Freedom"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee maassa, jossa akateeminen vapaus on hyvällä tasolla.",
                    "en": "Your collaboration partner is located in a country, where academic freedom is at a good level."
                }
            },
            "politicalstability": {
                "title": {
                    "fi": "Poliittinen vakaus",
                    "en": "Political Stability"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee poliittisesti vakaassa maassa.",
                    "en": "Your collaboration partner is located in a politically stable country."
                }
            },
            "development": {
                "title": {
                    "fi": "Maan kehittyineisyys",
                    "en": "Country Development Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee kehittyneessä maassa.",
                    "en": "Your partner is located in a developed country."
                }
            },
            "gdpr": {
                "title": {
                    "fi": "GDPR",
                    "en": "GDPR"
                },
                "risk": 1,
                "description": {
                    "fi": "Antamisesi tietojen perusteella yhteistyöhön ei kohdistu  tietousuojamielessä erityisiä vaatimuksia mutta varmistu, että  henkilötietoja ei yhteistyössä tarvitse luovuttaa.",
                    "en": "Based on the information you have provided, GDPR is not applicable, but please double check, if this really is the case."
                }
            },
            "sanctions": {
                "title": {
                    "fi": "Pakotteet",
                    "en": "Sanctions"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee maassa, johon ei kohdistu YK- tai  EU-pakotteita. Pakotteilla ei siis ole vaikutusta yhteistyöhankkeeseesi.",
                    "en": "Your collaboration partner is located in a country, which is no sanctioned by UN or EU. Sanctions have no effect on your collaboration."
                }
            },
            "ruleoflaw": {
                "title": {
                    "fi": "Oikeusvalitio",
                    "en": "Rule of Law"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyökumppanisi sijaitsee maassa, joka on oikeusvaltio, mikä  tarkoittaa muun muassa, että sopimuksiin liittyvä oikeussuoja on  lähtökohtaisesti vahva. Tämä on kuitenkin vain perusta ja  yhteistyösopimus on joka tapauksessa syytä laatia huolella.",
                    "en": "Your collaboration partner is located in a country, where rule of law is prevalent and agreements are normally followed and respected. As this is merely the point of departure, it is still necessary to draw up an agreement with appropriate care."
                }
            }
        },
        "organization": {
            "title": {
                "fi": "Organisaation riskitaso",
                "en": "Organization Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Yhteistyöyliopisto on listattu World Higher Education -tietokannassa. Tämä tarkoittaa, että yliopisto kuuluu varmuudella sijaintimaansa viralliseen koulutusjärjestelmään. Tämä on minimtaso, eikä välttämättä ole tae sen laadusta.",
                "en": "The partner university is listed in the World Higher Education database. This means that the university is officially part of its country’s education system. This represents a minimum standard and does not necessarily guarantee the quality of the institution."
            }
        },
        "financial": {
            "overall": {
                "title": {
                    "fi": "Taloudellinen kokonaisriskitaso",
                    "en": "Overall Financial Risk Level"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyön taloudellinen laajuus ei ole merkittävä, eikä muodosta merkittävää riskiä. Varmista tarvittaessa ykskkösi talouden lähipalveluilta, että hankkeen budjetti on asianmukainen.",
                    "en": "The financial scope of the collaboration is not significant and does not pose a major risk. If necessary, consult your unit’s financial services to ensure that the project budget is appropriate."
                }
            },
            "exchange": {
                "title": {
                    "fi": "Valuuttakurssiriski",
                    "en": "Exchange Rate"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyösi talous on sidottu Euroon, mikä on hyvä tapa välttää valuuttakurssiriskejä.",
                    "en": "Your collaboration is based on funding in Euro, which is a good away of avoiding currency risks."
                }
            },
            "scope": {
                "title": {
                    "fi": "Taloudellinen laajuus",
                    "en": "Fincancial scope"
                },
                "risk": 1,
                "description": {
                    "fi": "Yhteistyön taloudellinen laajuus ei ole merkittävä, eikä muodosta merkittävää riskiä. Varmista tarvittaessa ykskkösi talouden lähipalveluilta, että hankkeen budjetti on asianmukainen.",
                    "en": "The financial scope of the collaboration is not significant, and does not pose a substantial risk. Consult your unit's financial experts to make sure that the project budget is appropriate."
                }
            }
        },
        "dualuse": {
            "title": {
                "fi": "Kaksikäyttötuotteiden riskitaso",
                "en": "Dual-Use Products Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Antamiesi tietojen perusteella yhteistyö ei sisällä kaksoiskäyttöriskejä. Jos tästä kuitenkin on jotain epävarmuutta, tutustu yliopiston ohjeisiin.",
                "en": "Based on your response, this collaboration does not pose Dual Use risks. "
            }
        },
        "ethics": {
            "title": {
                "fi": "Eettinen riskitaso",
                "en": "Ethical Risk Level"
            },
            "risk": 1,
            "description": {
                "fi": "Ilmoituksesi perusteella yhteistyössä ei ole erityisiä eettisiä haasteita.",
                "en": "Based on your response, this collaboration does not pose ethical challenges."
            }
        },
        "organizationname": "Add name here if other is selected for organization",
        "organizationother": "This message is added to response if option5 is selected for organizationtype",
        "collaborationtypeother": "This message is added to response if option7 is included in collaboration types",
        "additionalinformation": "Additional information about project"
    },
    "choices": {
        "country": "SWE",
        "organization": "1",
        "organizationtype": "option5",
        "hhrole": "option1",
        "collaborationtype": [
            "option1",
            "option2",
            "option3",
            "option4",
            "option7"
        ],
        "history": "option1",
        "contract": "option1",
        "funding": "option1",
        "liability": "option1",
        "exchange": "option1",
        "personalinformation": "option1",
        "dualuse": "option1",
        "ethics": "option1",
        "duration": "option1",
        "organizationother": "This message is added to response if option5 is selected for organizationtype",
        "collaborationtypeother": "This message is added to response if option7 is included in collaboration types",
        "additionalinformation": "Additional information about project",
        "name": "Sample report",
        "fundinghistory": "option1",
        "fundingsource": "option1",
        "consortium": "option1",
        "organizationname": "Add name here if other is selected for organization",
        "ownerusername": "User",
        "creatorusername": "User"
    }
}

```

</details>

<details>

<summary>

**/reports/{id}** - DELETE: Delete specific report

</summary>

Requires: Authentication, Admin access

</details>

<details>

<summary>

**/tokenstatus** - GET: Check auth token validity

</summary>
    - Uses Bearer authentication to look for valid token.

Responses:

    - Success: {"token": "accepted"}
    
    - Failed: failure status response from auth middleware

</details>

<details>

<summary>

**/tokenstatusadmin** - GET: Check admin auth token validity

</summary>

Checks for token authenticity and if that passes checks for admin role.

Responses:

    - Authentic token with admin role: {"adminAccess" : true}

    - Authentic token without admin role: {"message": "Admin status required"}

    - Token check failed: failure status response from auth middleware

</details>

<details>

<summary>

**/defaultuser** - GET: Generates default user or updates it to default values

</summary>

Creates default user. Updates values to default if email is already present.

Requires following env variables set:

```
DEFAULT_USER_USERNAME=username
DEFAULT_USER_PASSWORD=password
DEFAULT_USER_EMAIL=email
DEFAULT_USER_ROLE=user
```

</details>

<details>

<summary>

**/defaultadmin** - GET: Generates default admin or updates it to default values

</summary>

Creates default user with admin role. Updates values to default if email is already present.

Requires following env variables set:

```
DEFAULT_ADMIN_USERNAME=adminUsername
DEFAULT_ADMIN_PASSWORD=adminPassword
DEFAULT_ADMIN_EMAIL=email
DEFAULT_ADMIN_ROLE=admin
```

</details>

## env variable template

Use .env file locally in the root directory and update values to match your environment. Extra user credentials are optional.

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=YourPassword
DB_DATABASE=YourDatabaseName
JWT_SECRET=secretForJWTTokenGeneration
DEFAULT_USER_USERNAME=usernameForDefaultUser
DEFAULT_USER_PASSWORD=passwordForDefaultUser
DEFAULT_USER_EMAIL=emailForDefaultUser
DEFAULT_USER_ROLE=user
DEFAULT_ADMIN_USERNAME=usernameForDefaultAdmin
DEFAULT_ADMIN_PASSWORD=passwordForDefaultAdmin
DEFAULT_ADMIN_EMAIL=emailForDefaultAdmin
DEFAULT_ADMIN_ROLE=admin
EXTRA_USER_1_USERNAME=nameForExtraUser1
EXTRA_USER_1_PASSWORD=passwordForExtraUser1
EXTRA_USER_1_EMAIL=EmailForExtraUser1
EXTRA_USER_1_ROLE=user
EXTRA_USER_2_USERNAME=nameForExtraUser2
EXTRA_USER_2_PASSWORD=passwordForExtraUser2
EXTRA_USER_2_EMAIL=EmailForExtraUser2
EXTRA_USER_2_ROLE=user
EXTRA_USER_3_USERNAME=nameForExtraUser3
EXTRA_USER_3_PASSWORD=passwordForExtraUser3
EXTRA_USER_3_EMAIL=EmailForExtraUser3
EXTRA_USER_3_ROLE=user
EXTRA_USER_4_USERNAME=nameForExtraUser4
EXTRA_USER_4_PASSWORD=passwordForExtraUser4
EXTRA_USER_4_EMAIL=sEmailForExtraUser4
EXTRA_USER_4_ROLE=user
EXTRA_USER_5_USERNAME=nameForExtraUser5
EXTRA_USER_5_PASSWORD=passwordForExtraUser5
EXTRA_USER_5_EMAIL=EmailForExtraUser5
EXTRA_USER_5_ROLE=user
```

## Default users (Rahti)

The usernames and passwords are now in Teams → DevOps channel → Shared → usernames_passwords.docx.



# Docker Compose Guide (HH-SECUR-be)

## 1. Prerequisites

* Docker Desktop running (check with `docker info`, should return no error)
* `.env` file in the project root, every developer needs their own copy on their own machine. It's in `.gitignore` (`.gitignore:69-70`) and is not version-controlled, since it contains passwords and secrets, share it with the team through some other channel (not via Git).

## 2. `.env` file contents

```env
# be.env
PORT=3000
BE_SERVER_PORT=3000

# db.env, app-side connection settings (config.ts)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=<your-value>
DB_PASSWORD=<your-value>
DB_DATABASE=<your-value>

# db.image.env, MariaDB container's init variables (must be the SAME values as above)
MARIADB_DATABASE=<same as DB_DATABASE>
MARIADB_USER=<same as DB_USERNAME>
MARIADB_PASSWORD=<same as DB_PASSWORD>
MARIADB_ROOT_PASSWORD=<your-value>

# auth.env
JWT_SECRET=<your-value>

# default seed credentials (/defaultuser, /defaultadmin)
DEFAULT_USER_USERNAME=user
DEFAULT_USER_EMAIL=user@testing.com
DEFAULT_USER_PASSWORD=<your-value>
DEFAULT_USER_ROLE=user

DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_EMAIL=admin@testing.com
DEFAULT_ADMIN_PASSWORD=<your-value>
DEFAULT_ADMIN_ROLE=admin
```

> **Note:** `DB_PORT` must be `3306`, containers always talk to each other on MariaDB's internal port, regardless of the host-side port mapping. `DB_USERNAME` / `DB_PASSWORD` / `DB_DATABASE` must exactly match `MARIADB_USER` / `MARIADB_PASSWORD` / `MARIADB_DATABASE`.

## 3. Starting it up

First time, or whenever the code / Dockerfile / package.json has changed:

```bash
docker compose -f docker-compose-dbbe.yaml up --build
```

If the image is already built and nothing has changed since, `--build` isn't needed, plain `up` is enough and starts faster:

```bash
docker compose -f docker-compose-dbbe.yaml up
```

Both do the same basic sequence:

1. The backend is built from the `Dockerfile` if needed (`npm ci` → `npm run build` → `npm start`)
2. `hh_secur_db_service` (MariaDB) starts, and it waits until it's healthy (`healthcheck`)
3. `hh_secur_be_service` starts only once the db is healthy, connecting to it internally via `hh_secur_db_service` (the Docker network's service name, not `localhost`)

Run in the background by adding `-d` (works with either command):

```bash
docker compose -f docker-compose-dbbe.yaml up -d
```

Check what already exists:

```bash
docker compose -f docker-compose-dbbe.yaml ps
docker images
```

## 4. Signs of success in the logs

```
Backend is running
Succsefully connected to database
API running on 3000
```

## 5. Testing

```bash
curl http://localhost:3000/status
```

→ `{"ok": true}`

The full test flow (login, tokens, default users), in short:

1. `POST /login` → get a token
2. `GET /defaultuser` and `GET /defaultadmin` create test users in the DB
3. `GET /users/{id}` fetches them

## 6. Stopping it

```bash
docker compose -f docker-compose-dbbe.yaml down
```

The database persists across restarts via the named volume (`hh_secur_db_data`), including the next `up` without `--build`. Add `-v` if you want a clean/empty database:

```bash
docker compose -f docker-compose-dbbe.yaml down -v
```

## 7. Common pitfalls (we already hit these)

* Docker Desktop not running → `npipe` error right away.
* `.dockerignore` must not exclude `package-lock.json`, already fixed at `.dockerignore:48`, but if the `#` in front is ever removed by accident, `npm ci` will fail during the build.
* `.env` values don't match (`DB_*` vs `MARIADB_*`) → the database connection fails on startup.
* Forgetting `--build` after a code change → the container starts with the old code and your changes won't show up.


## Testing

API tests are written with [Playwright](https://playwright.dev/) (`@playwright/test`) and cover `/login`, `/tokenstatus`, `/tokenstatusadmin`, `/defaultuser` and `/defaultadmin`. Test files live in `tests/api/`.

### Requirements

- The backend API must be running and reachable (default: `http://localhost:3000`).
- The database must be running and reachable by the API.
- The `.env` file must be set up (see variables referenced throughout this README), especially `JWT_SECRET`, `DB_*` and `DEFAULT_USER_*` / `DEFAULT_ADMIN_*`.

Start the API and database with Docker Compose:

```
docker compose -f docker-compose-dbbe.yaml up -d
```

Or run them locally instead (requires a running MariaDB instance matching the `DB_*` env variables):

```
npm run dev
```

Test data (the default user and admin) is created/reset automatically before the test run via a Playwright `globalSetup` that calls `/defaultuser` and `/defaultadmin` — no manual seeding needed.

### Running the tests

```
npm test
```

Runs the full Playwright suite headlessly against the API.

```
npm run test:ui
```

Opens Playwright's UI mode for interactively running and debugging individual tests.

By default tests target `http://localhost:3000` (or `PORT` from `.env`). To point tests at a different URL, set `API_BASE_URL`:

```
API_BASE_URL=http://localhost:4000 npm test
```
