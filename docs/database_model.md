# Database

Database serves two main functions. First is to provide data needed for risk calculation form and second is to store risk calculation reports including a snapshot of the calculation results.

## Table explanations

### Miscallaneous

    - user: report owner, report creator, authentication

### Risk calculation

    - report: risk calculation report

    - report_snapshot: snapshot of risk calculation results

### Form page content

    - hh_role: Haaga-Helia's role in collaboration

    - duration: Duration of the collaboration

    - contract_info: Status of written agreement for the collaboration

    - collaboration_type: Type of collaboraiton

    - collaboration_history: Previous history with collaboration partners

    - ethics_assessment: Assessment of potential ethical risks involved in the collaboration

    - consortium_type: Whether consortium consist of 2 organizations or more

    - organization: Partnership organization, World Higher Education Database used as source for known organizations

    - country: Country involved in collaboration with scraped data used for risk factors

    - dual_use: Likelihood of use of collaboration resources for military purposes

    - personal_information: Likelihood of transfer of personal information to partner organizations or Countries

    - funding_option: Extarnal funding in collaboration

    - funding_exchange: Whether external funding is in euros or another currency

    - funding_source: Type of organization that provides the external funding

    - funding_history: Previous history with the funding organization

    - liability: Scope Haaga-Helia's financial liability for the collaboration 

### Helper tables

    - funding: combined list of funding choices related to a specific report

    - consortium: consortium for a specific project

    - consortium_organization: organizations in a specific consortium

    - report_collaboration_type: collaboration type choices for a specific report

## Relational model

[!HH-SECUR-i relational model](files/HH-SECUR-i_relational_model.png)