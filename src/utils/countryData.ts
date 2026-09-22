import Country from "../data/models/Country";
import repository from "../data/repository/repository";



//Raw country data, security placeholder value of 3, excpect for China, Moldova, USA, Sweden and Finland that have real values

export async function addCountryData() {
    const countries = [
{
    en: "Afghanistan",
    fi: "Afganistan",
    country_id: "AFG",
    dataYear: 2025,
    corruption: 13.68,
    security: 3,
    academicFreedom: 0.086,
    politicalStability: 1.42,
    development: 181,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.30764429
    },
{
    en: "Albania",
    fi: "Albania",
    country_id: "ALB",
    dataYear: 2025,
    corruption: 43.4,
    security: 3,
    academicFreedom: 0.76,
    politicalStability: 51.66,
    development: 71,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.48877582
    
},
{
    en: "Algeria",
    fi: "Algeria",
    country_id: "DZA",
    dataYear: 2025,
    corruption: 30.19,
    security: 3,
    academicFreedom: 0.206,
    politicalStability: 23.22,
    development: 96,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.48857478  
},
{
    en: "Angola",
    fi: "Angola",
    country_id: "AGO",
    dataYear: 2025,
    corruption: 29.25,
    security: 3,
    academicFreedom: 0.416,
    politicalStability: 32.23,
    development: 148,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.42317338

},
{
    en: "Argentina",
    fi: "Argentiina",
    country_id: "ARG",
    dataYear: 2025,
    corruption: 41.98,
    security: 3,
    academicFreedom: 0.625,
    politicalStability: 41.71,
    development: 47,
    gdpr: 2,
    sanctions: 1,
    ruleOfLaw: 0.54045581

},
{
    en: "Armenia",
    fi: "Armenia",
    country_id: "ARM",
    dataYear: 2025,
    corruption: 57.08,
    security: 3,
    academicFreedom: 0.582,
    politicalStability: 17.06,
    development: 69,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Australia",
    fi: "Australia",
    country_id: "AUS",
    dataYear: 2025,
    corruption: 95.75,
    security: 3,
    academicFreedom: 0.864,
    politicalStability: 79.62,
    development: 7,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.79630136

},
{
    en: "Austria",
    fi: "Itävalta",
    country_id: "AUT",
    dataYear: 2025,
    corruption: 83.49,
    security: 3,
    academicFreedom: 0.881,
    politicalStability: 71.56,
    development: 22,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.79426923

},
{
    en: "Azerbaijan",
    fi: "Azerbaidžan",
    country_id: "AZE",
    dataYear: 2025,
    corruption: 12.26,
    security: 3,
    academicFreedom: 0.092,
    politicalStability: 18.01,
    development: 81,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Bahrain",
    fi: "Bahrain",
    country_id: "BHR",
    dataYear: 2025,
    corruption: 59.43,
    security: 3,
    academicFreedom: 0.199,
    politicalStability: 29.38,
    development: 38,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Bangladesh",
    fi: "Bangladesh",
    country_id: "BGD",
    dataYear: 2025,
    corruption: 14.62,
    security: 3,
    academicFreedom: 0.519,
    politicalStability: 15.64,
    development: 130,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.3912668

},
{
    en: "Barbados",
    fi: "Barbados",
    country_id: "BRB",
    dataYear: 2025,
    corruption: 89.62,
    security: 3,
    academicFreedom: 0.904,
    politicalStability: 93.84,
    development: 69,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.66109376

},
{
    en: "Belarus",
    fi: "Valkovenäjä",
    country_id: "BLR",
    dataYear: 2025,
    corruption: 26.89,
    security: 3,
    academicFreedom: 0.06,
    politicalStability: 18.48,
    development: 65,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.44475383

},
{
    en: "Belgium",
    fi: "Belgia",
    country_id: "BEL",
    dataYear: 2025,
    corruption: 89.15,
    security: 3,
    academicFreedom: 0.946,
    politicalStability: 58.29,
    development: 10,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.78141921

},
{
    en: "Benin",
    fi: "Benin",
    country_id: "BEN",
    dataYear: 2025,
    corruption: 52.83,
    security: 3,
    academicFreedom: 0.709,
    politicalStability: 31.75,
    development: 173,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.47187284

},
{
    en: "Bhutan",
    fi: "Bhutan",
    country_id: "BTN",
    dataYear: 2025,
    corruption: 91.04,
    security: 3,
    academicFreedom: 0.401,
    politicalStability: 83.41,
    development: 125,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Bolivia",
    fi: "Bolivia",
    country_id: "BOL",
    dataYear: 2025,
    corruption: 21.7,
    security: 3,
    academicFreedom: 0.582,
    politicalStability: 35.07,
    development: 108,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.3654158

},
{
    en: "Bosnia and Herzegovina",
    fi: "Bosnia ja Hertsegovina",
    country_id: "BIH",
    dataYear: 2025,
    corruption: 30.66,
    security: 3,
    academicFreedom: 0.75,
    politicalStability: 31.28,
    development: 74,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.51994863

},
{
    en: "Botswana",
    fi: "Botswana",
    country_id: "BWA",
    dataYear: 2025,
    corruption: 73.58,
    security: 3,
    academicFreedom: 0.834,
    politicalStability: 87.2,
    development: 111,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.59548103

},
{
    en: "Brazil",
    fi: "Brasilia",
    country_id: "BRA",
    dataYear: 2025,
    corruption: 34.43,
    security: 3,
    academicFreedom: 0.849,
    politicalStability: 28.44,
    development: 84,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.50271197

},
{
    en: "Bulgaria",
    fi: "Bulgaria",
    country_id: "BGR",
    dataYear: 2025,
    corruption: 50.0,
    security: 3,
    academicFreedom: 0.85,
    politicalStability: 55.45,
    development: 55,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.55251684

},
{
    en: "Burkina Faso",
    fi: "Burkina Faso",
    country_id: "BFA",
    dataYear: 2025,
    corruption: 49.53,
    security: 3,
    academicFreedom: 0.562,
    politicalStability: 5.69,
    development: 186,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.45197536

},
{
    en: "Burma/Myanmar",
    fi: "Myanmar",
    country_id: "MMR",
    dataYear: 2025,
    corruption: 11.79,
    security: 3,
    academicFreedom: 0.023,
    politicalStability: 4.74,
    development: -1,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.33605104

},
{
    en: "Burundi",
    fi: "Burundi",
    country_id: "BDI",
    dataYear: 2025,
    corruption: 3.3,
    security: 3,
    academicFreedom: 0.144,
    politicalStability: 12.8,
    development: 187,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: -1.0

},
{
    en: "Cambodia",
    fi: "Kambodža",
    country_id: "KHM",
    dataYear: 2025,
    corruption: 9.43,
    security: 3,
    academicFreedom: 0.216,
    politicalStability: 47.87,
    development: 151,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.31025398

},
{
    en: "Cameroon",
    fi: "Kamerun",
    country_id: "CMR",
    dataYear: 2025,
    corruption: 13.21,
    security: 3,
    academicFreedom: 0.207,
    politicalStability: 11.37,
    development: 155,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.35633851

},
{
    en: "Canada",
    fi: "Kanada",
    country_id: "CAN",
    dataYear: 2025,
    corruption: 94.81,
    security: 3,
    academicFreedom: 0.854,
    politicalStability: 76.3,
    development: 16,
    gdpr: 2,
    sanctions: 1,
    ruleOfLaw: 0.79413974

},
{
    en: "Cape Verde",
    fi: "Kap Verde",
    country_id: "CPV",
    dataYear: 2025,
    corruption: 81.13,
    security: 3,
    academicFreedom: 0.866,
    politicalStability: 79.15,
    development: -1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Central African Republic",
    fi: "Keski-Afrikan tasavalta",
    country_id: "CAF",
    dataYear: 2025,
    corruption: 8.96,
    security: 3,
    academicFreedom: 0.326,
    politicalStability: 3.32,
    development: 191,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: -1.0

},
{
    en: "Chad",
    fi: "Tšad",
    country_id: "TCD",
    dataYear: 2025,
    corruption: 4.72,
    security: 3,
    academicFreedom: 0.132,
    politicalStability: 9.0,
    development: 190,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Chile",
    fi: "Chile",
    country_id: "CHL",
    dataYear: 2025,
    corruption: 80.66,
    security: 3,
    academicFreedom: 0.918,
    politicalStability: 50.24,
    development: 45,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.65501172

},
{
    en: "China",
    fi: "Kiina",
    country_id: "CHN",
    dataYear: 2025,
    corruption: 54.25,
    security: 1,
    academicFreedom: 0.071,
    politicalStability: 25.12,
    development: 78,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.47709017

},
{
    en: "Colombia",
    fi: "Kolumbia",
    country_id: "COL",
    dataYear: 2025,
    corruption: 44.81,
    security: 3,
    academicFreedom: 0.599,
    politicalStability: 18.96,
    development: 83,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.47184299

},
{
    en: "Comoros",
    fi: "Komorit",
    country_id: "COM",
    dataYear: 2025,
    corruption: 19.34,
    security: 3,
    academicFreedom: 0.303,
    politicalStability: 38.86,
    development: 152,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Costa Rica",
    fi: "Costa Rica",
    country_id: "CRI",
    dataYear: 2025,
    corruption: 72.64,
    security: 3,
    academicFreedom: 0.915,
    politicalStability: 83.89,
    development: 62,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.67563572

},
{
    en: "Croatia",
    fi: "Kroatia",
    country_id: "HRV",
    dataYear: 2025,
    corruption: 59.91,
    security: 3,
    academicFreedom: 0.811,
    politicalStability: 67.77,
    development: 41,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.60745101

},
{
    en: "Cuba",
    fi: "Kuuba",
    country_id: "CUB",
    dataYear: 2025,
    corruption: 52.36,
    security: 3,
    academicFreedom: 0.084,
    politicalStability: 56.87,
    development: 97,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Cyprus",
    fi: "Kypros",
    country_id: "CYP",
    dataYear: 2025,
    corruption: 62.74,
    security: 3,
    academicFreedom: 0.889,
    politicalStability: 59.24,
    development: 32,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.67323453

},
{
    en: "Czechia",
    fi: "Tšekki",
    country_id: "CZE",
    dataYear: 2025,
    corruption: 76.89,
    security: 3,
    academicFreedom: 0.978,
    politicalStability: 82.46,
    development: 29,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.73902408

},
{
    en: "Democratic Republic of the Congo",
    fi: "Kongon demokraattinen tasavalta",
    country_id: "COD",
    dataYear: 2025,
    corruption: 5.19,
    security: 3,
    academicFreedom: 0.506,
    politicalStability: 5.21,
    development: 171,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.33908811

},
{
    en: "Denmark",
    fi: "Tanska",
    country_id: "DNK",
    dataYear: 2025,
    corruption: 100.0,
    security: 3,
    academicFreedom: 0.875,
    politicalStability: 76.78,
    development: 4,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.89786373

},
{
    en: "Djibouti",
    fi: "Djibouti",
    country_id: "DJI",
    dataYear: 2025,
    corruption: 23.58,
    security: 3,
    academicFreedom: 0.302,
    politicalStability: 24.64,
    development: 175,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Dominican Republic",
    fi: "Dominikaaninen tasavalta",
    country_id: "DOM",
    dataYear: 2025,
    corruption: 37.74,
    security: 3,
    academicFreedom: 0.901,
    politicalStability: 53.55,
    development: 89,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.50376138

},
{
    en: "Ecuador",
    fi: "Ecuador",
    country_id: "ECU",
    dataYear: 2025,
    corruption: 27.83,
    security: 3,
    academicFreedom: 0.433,
    politicalStability: 32.7,
    development: 88,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.45550633

},
{
    en: "Egypt",
    fi: "Egypti",
    country_id: "EGY",
    dataYear: 2025,
    corruption: 24.53,
    security: 3,
    academicFreedom: 0.075,
    politicalStability: 16.59,
    development: 100,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.34621281

},
{
    en: "El Salvador",
    fi: "El Salvador",
    country_id: "SLV",
    dataYear: 2025,
    corruption: 32.08,
    security: 3,
    academicFreedom: 0.165,
    politicalStability: 46.45,
    development: 132,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.41992069

},
{
    en: "Equatorial Guinea",
    fi: "Päiväntasaajan Guinea",
    country_id: "GNQ",
    dataYear: 2025,
    corruption: 2.83,
    security: 3,
    academicFreedom: 0.108,
    politicalStability: 38.39,
    development: 133,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Eritrea",
    fi: "Eritrea",
    country_id: "ERI",
    dataYear: 2025,
    corruption: 5.66,
    security: 3,
    academicFreedom: 0.034,
    politicalStability: 17.54,
    development: 178,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Estonia",
    fi: "Viro",
    country_id: "EST",
    dataYear: 2025,
    corruption: 91.51,
    security: 3,
    academicFreedom: 0.974,
    politicalStability: 69.19,
    development: 36,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.81892344

},
{
    en: "Eswatini",
    fi: "Swazimaa",
    country_id: "SWZ",
    dataYear: 2025,
    corruption: 25.0,
    security: 3,
    academicFreedom: 0.179,
    politicalStability: 30.81,
    development: 126,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Ethiopia",
    fi: "Etiopia",
    country_id: "ETH",
    dataYear: 2025,
    corruption: 37.26,
    security: 3,
    academicFreedom: 0.337,
    politicalStability: 6.16,
    development: 180,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.36220672

},
{
    en: "Fiji",
    fi: "Fidži",
    country_id: "FJI",
    dataYear: 2025,
    corruption: 66.04,
    security: 3,
    academicFreedom: 0.636,
    politicalStability: 72.99,
    development: 111,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Finland",
    fi: "Suomi",
    country_id: "FIN",
    dataYear: 2025,
    corruption: 99.53,
    security: 1,
    academicFreedom: 0.818,
    politicalStability: 71.09,
    development: 12,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.8707053

},
{
    en: "France",
    fi: "Ranska",
    country_id: "FRA",
    dataYear: 2025,
    corruption: 83.96,
    security: 3,
    academicFreedom: 0.8,
    politicalStability: 55.92,
    development: 26,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.72377548

},
{
    en: "Gabon",
    fi: "Gabon",
    country_id: "GAB",
    dataYear: 2025,
    corruption: 17.92,
    security: 3,
    academicFreedom: 0.428,
    politicalStability: 33.65,
    development: 108,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.40204301

},
{
    en: "Georgia",
    fi: "Georgia",
    country_id: "GEO",
    dataYear: 2025,
    corruption: 71.23,
    security: 3,
    academicFreedom: 0.584,
    politicalStability: 33.18,
    development: 57,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.58114936

},
{
    en: "Germany",
    fi: "Saksa",
    country_id: "DEU",
    dataYear: 2025,
    corruption: 94.34,
    security: 3,
    academicFreedom: 0.877,
    politicalStability: 66.35,
    development: 5,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.8333243

},
{
    en: "Ghana",
    fi: "Ghana",
    country_id: "GHA",
    dataYear: 2025,
    corruption: 51.42,
    security: 3,
    academicFreedom: 0.67,
    politicalStability: 45.5,
    development: 143,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.54499807

},
{
    en: "Greece",
    fi: "Kreikka",
    country_id: "GRC",
    dataYear: 2025,
    corruption: 58.02,
    security: 3,
    academicFreedom: 0.68,
    politicalStability: 54.03,
    development: 34,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.59691846

},
{
    en: "Guatemala",
    fi: "Guatemala",
    country_id: "GTM",
    dataYear: 2025,
    corruption: 14.15,
    security: 3,
    academicFreedom: 0.736,
    politicalStability: 36.97,
    development: 137,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.43949764

},
{
    en: "Guinea",
    fi: "Guinea",
    country_id: "GIN",
    dataYear: 2025,
    corruption: 20.28,
    security: 3,
    academicFreedom: 0.301,
    politicalStability: 16.11,
    development: 179,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.40879427

},
{
    en: "Guinea-Bissau",
    fi: "Guinea-Bissau",
    country_id: "GNB",
    dataYear: 2025,
    corruption: 12.74,
    security: 3,
    academicFreedom: 0.523,
    politicalStability: 34.12,
    development: 174,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: -1.0

},
{
    en: "Guyana",
    fi: "Guyana",
    country_id: "GUY",
    dataYear: 2025,
    corruption: 40.57,
    security: 3,
    academicFreedom: 0.761,
    politicalStability: 43.6,
    development: 89,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.49976778

},
{
    en: "Haiti",
    fi: "Haiti",
    country_id: "HTI",
    dataYear: 2025,
    corruption: 6.13,
    security: 3,
    academicFreedom: 0.69,
    politicalStability: 10.43,
    development: 166,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.32376015

},
{
    en: "Honduras",
    fi: "Honduras",
    country_id: "HND",
    dataYear: 2025,
    corruption: 15.09,
    security: 3,
    academicFreedom: 0.931,
    politicalStability: 27.96,
    development: 139,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.41139412

},
{
    en: "Hong Kong",
    fi: "Hongkong",
    country_id: "HKG",
    dataYear: 2025,
    corruption: 93.4,
    security: 3,
    academicFreedom: 0.237,
    politicalStability: 69.67,
    development: 8,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.71824242

},
{
    en: "Hungary",
    fi: "Unkari",
    country_id: "HUN",
    dataYear: 2025,
    corruption: 54.72,
    security: 3,
    academicFreedom: 0.299,
    politicalStability: 72.04,
    development: 46,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.50260437

},
{
    en: "Iceland",
    fi: "Islanti",
    country_id: "ISL",
    dataYear: 2025,
    corruption: 91.98,
    security: 3,
    academicFreedom: 0.756,
    politicalStability: 95.26,
    development: 1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "India",
    fi: "Intia",
    country_id: "IND",
    dataYear: 2025,
    corruption: 41.51,
    security: 3,
    academicFreedom: 0.136,
    politicalStability: 21.33,
    development: 130,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.48898741

},
{
    en: "Indonesia",
    fi: "Indonesia",
    country_id: "IDN",
    dataYear: 2025,
    corruption: 36.32,
    security: 3,
    academicFreedom: 0.33,
    politicalStability: 28.91,
    development: 113,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.52387695

},
{
    en: "Iran",
    fi: "Iran",
    country_id: "IRN",
    dataYear: 2025,
    corruption: 10.38,
    security: 3,
    academicFreedom: 0.06,
    politicalStability: 8.06,
    development: 75,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.38246528

},
{
    en: "Iraq",
    fi: "Irak",
    country_id: "IRQ",
    dataYear: 2025,
    corruption: 8.49,
    security: 3,
    academicFreedom: 0.604,
    politicalStability: 2.37,
    development: 126,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: -1.0

},
{
    en: "Ireland",
    fi: "Irlanti",
    country_id: "IRL",
    dataYear: 2025,
    corruption: 92.92,
    security: 3,
    academicFreedom: 0.922,
    politicalStability: 78.67,
    development: 11,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.8234931

},
{
    en: "Israel",
    fi: "Israel",
    country_id: "ISR",
    dataYear: 2025,
    corruption: 78.77,
    security: 3,
    academicFreedom: 0.84,
    politicalStability: 9.95,
    development: 27,
    gdpr: 2,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Italy",
    fi: "Italia",
    country_id: "ITA",
    dataYear: 2025,
    corruption: 67.92,
    security: 3,
    academicFreedom: 0.822,
    politicalStability: 64.93,
    development: 29,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.65651175

},
{
    en: "Ivory Coast",
    fi: "Norsunluurannikko",
    country_id: "CIV",
    dataYear: 2025,
    corruption: 44.34,
    security: 3,
    academicFreedom: 0.575,
    politicalStability: 21.8,
    development: -1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.44405588

},
{
    en: "Jamaica",
    fi: "Jamaika",
    country_id: "JAM",
    dataYear: 2025,
    corruption: 50.94,
    security: 3,
    academicFreedom: 0.939,
    politicalStability: 57.35,
    development: 117,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.56986124

},
{
    en: "Japan",
    fi: "Japani",
    country_id: "JPN",
    dataYear: 2025,
    corruption: 90.09,
    security: 3,
    academicFreedom: 0.76,
    politicalStability: 81.52,
    development: 23,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.78367491

},
{
    en: "Jordan",
    fi: "Jordania",
    country_id: "JOR",
    dataYear: 2025,
    corruption: 57.55,
    security: 3,
    academicFreedom: 0.173,
    politicalStability: 40.28,
    development: 100,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.55158001

},
{
    en: "Kazakhstan",
    fi: "Kazakstan",
    country_id: "KAZ",
    dataYear: 2025,
    corruption: 47.17,
    security: 3,
    academicFreedom: 0.334,
    politicalStability: 36.49,
    development: 60,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.5363161

},
{
    en: "Kenya",
    fi: "Kenia",
    country_id: "KEN",
    dataYear: 2025,
    corruption: 24.06,
    security: 3,
    academicFreedom: 0.864,
    politicalStability: 14.69,
    development: 143,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.4506896

},
{
    en: "Kosovo",
    fi: "Kosovo",
    country_id: "XKX",
    dataYear: 2025,
    corruption: 48.58,
    security: 3,
    academicFreedom: 0.621,
    politicalStability: 34.6,
    development: -1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.56098566

},
{
    en: "Kuwait",
    fi: "Kuwait",
    country_id: "KWT",
    dataYear: 2025,
    corruption: 60.38,
    security: 3,
    academicFreedom: 0.418,
    politicalStability: 58.77,
    development: 52,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.57898735

},
{
    en: "Kyrgyzstan",
    fi: "Kirgiisi",
    country_id: "KGZ",
    dataYear: 2025,
    corruption: 11.32,
    security: 3,
    academicFreedom: 0.378,
    politicalStability: 26.54,
    development: 117,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.44826869

},
{
    en: "Laos",
    fi: "Lao",
    country_id: "LAO",
    dataYear: 2025,
    corruption: 19.81,
    security: 3,
    academicFreedom: 0.122,
    politicalStability: 75.36,
    development: 147,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Latvia",
    fi: "Latvia",
    country_id: "LVA",
    dataYear: 2025,
    corruption: 74.53,
    security: 3,
    academicFreedom: 0.928,
    politicalStability: 66.82,
    development: 41,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.73348182

},
{
    en: "Lebanon",
    fi: "Libanon",
    country_id: "LBN",
    dataYear: 2025,
    corruption: 10.85,
    security: 3,
    academicFreedom: 0.618,
    politicalStability: 9.48,
    development: 102,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.44185147

},
{
    en: "Lesotho",
    fi: "Lesotho",
    country_id: "LSO",
    dataYear: 2025,
    corruption: 33.49,
    security: 3,
    academicFreedom: 0.643,
    politicalStability: 35.55,
    development: 167,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Liberia",
    fi: "Liberia",
    country_id: "LBR",
    dataYear: 2025,
    corruption: 20.75,
    security: 3,
    academicFreedom: 0.609,
    politicalStability: 42.65,
    development: 177,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.44144825

},
{
    en: "Libya",
    fi: "Libya",
    country_id: "LBY",
    dataYear: 2025,
    corruption: 3.77,
    security: 3,
    academicFreedom: 0.282,
    politicalStability: 4.27,
    development: 115,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: -1.0

},
{
    en: "Lithuania",
    fi: "Liettua",
    country_id: "LTU",
    dataYear: 2025,
    corruption: 77.83,
    security: 3,
    academicFreedom: 0.823,
    politicalStability: 72.51,
    development: 39,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.77418824

},
{
    en: "Luxembourg",
    fi: "Luxemburg",
    country_id: "LUX",
    dataYear: 2025,
    corruption: 96.7,
    security: 3,
    academicFreedom: 0.918,
    politicalStability: 87.68,
    development: 25,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.82977847

},
{
    en: "Madagascar",
    fi: "Madagaskar",
    country_id: "MDG",
    dataYear: 2025,
    corruption: 18.4,
    security: 3,
    academicFreedom: 0.684,
    politicalStability: 19.91,
    development: 183,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.43209549

},
{
    en: "Malawi",
    fi: "Malawi",
    country_id: "MWI",
    dataYear: 2025,
    corruption: 29.72,
    security: 3,
    academicFreedom: 0.795,
    politicalStability: 37.91,
    development: 172,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.51987902

},
{
    en: "Malaysia",
    fi: "Malesia",
    country_id: "MYS",
    dataYear: 2025,
    corruption: 61.79,
    security: 3,
    academicFreedom: 0.289,
    politicalStability: 50.71,
    development: 67,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.56995633

},
{
    en: "Maldives",
    fi: "Malediivit",
    country_id: "MDV",
    dataYear: 2025,
    corruption: 39.62,
    security: 3,
    academicFreedom: 0.555,
    politicalStability: 62.56,
    development: 93,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Mali",
    fi: "Mali",
    country_id: "MLI",
    dataYear: 2025,
    corruption: 21.23,
    security: 3,
    academicFreedom: 0.281,
    politicalStability: 0.47,
    development: 188,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.38519028

},
{
    en: "Malta",
    fi: "Malta",
    country_id: "MLT",
    dataYear: 2025,
    corruption: 58.49,
    security: 3,
    academicFreedom: 0.874,
    politicalStability: 77.25,
    development: 24,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.66978317

},
{
    en: "Mauritania",
    fi: "Mauritania",
    country_id: "MRT",
    dataYear: 2025,
    corruption: 22.64,
    security: 3,
    academicFreedom: 0.253,
    politicalStability: 26.07,
    development: 163,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.36177795

},
{
    en: "Mauritius",
    fi: "Mauritius",
    country_id: "MUS",
    dataYear: 2025,
    corruption: 65.57,
    security: 3,
    academicFreedom: 0.592,
    politicalStability: 74.88,
    development: 73,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.60351942

},
{
    en: "Mexico",
    fi: "Meksiko",
    country_id: "MEX",
    dataYear: 2025,
    corruption: 17.45,
    security: 3,
    academicFreedom: 0.706,
    politicalStability: 22.75,
    development: 81,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.40311297

},
{
    en: "Moldova",
    fi: "Moldova",
    country_id: "MDA",
    dataYear: 2025,
    corruption: 46.7,
    security: 2,
    academicFreedom: 0.689,
    politicalStability: 20.38,
    development: 86,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.5304462

},
{
    en: "Mongolia",
    fi: "Mongolia",
    country_id: "MNG",
    dataYear: 2025,
    corruption: 35.38,
    security: 3,
    academicFreedom: 0.671,
    politicalStability: 67.3,
    development: 104,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.53220495

},
{
    en: "Montenegro",
    fi: "Montenegro",
    country_id: "MNE",
    dataYear: 2025,
    corruption: 51.89,
    security: 3,
    academicFreedom: 0.824,
    politicalStability: 48.82,
    development: 48,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.57089263

},
{
    en: "Morocco",
    fi: "Marokko",
    country_id: "MAR",
    dataYear: 2025,
    corruption: 33.02,
    security: 3,
    academicFreedom: 0.481,
    politicalStability: 29.86,
    development: 120,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.4806151

},
{
    en: "Mozambique",
    fi: "Mosambik",
    country_id: "MOZ",
    dataYear: 2025,
    corruption: 22.17,
    security: 3,
    academicFreedom: 0.408,
    politicalStability: 11.85,
    development: 182,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.37387315

},
{
    en: "Namibia",
    fi: "Namibia",
    country_id: "NAM",
    dataYear: 2025,
    corruption: 58.96,
    security: 3,
    academicFreedom: 0.718,
    politicalStability: 63.51,
    development: 136,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.60877962

},
{
    en: "Nepal",
    fi: "Nepal",
    country_id: "NPL",
    dataYear: 2025,
    corruption: 33.96,
    security: 3,
    academicFreedom: 0.831,
    politicalStability: 39.34,
    development: 145,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.5192691

},
{
    en: "Netherlands",
    fi: "Alankomaat",
    country_id: "NLD",
    dataYear: 2025,
    corruption: 96.23,
    security: 3,
    academicFreedom: 0.763,
    politicalStability: 68.72,
    development: 8,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.8208597

},
{
    en: "New Zealand",
    fi: "Uusi-Seelanti",
    country_id: "NZL",
    dataYear: 2025,
    corruption: 98.58,
    security: 3,
    academicFreedom: 0.847,
    politicalStability: 96.21,
    development: 17,
    gdpr: 2,
    sanctions: 1,
    ruleOfLaw: 0.83394471

},
{
    en: "Nicaragua",
    fi: "Nicaragua",
    country_id: "NIC",
    dataYear: 2025,
    corruption: 7.08,
    security: 3,
    academicFreedom: 0.019,
    politicalStability: 42.18,
    development: 123,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.33124185

},
{
    en: "Niger",
    fi: "Niger",
    country_id: "NER",
    dataYear: 2025,
    corruption: 31.6,
    security: 3,
    academicFreedom: 0.689,
    politicalStability: 8.53,
    development: 188,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.41672597

},
{
    en: "Nigeria",
    fi: "Nigeria",
    country_id: "NGA",
    dataYear: 2025,
    corruption: 16.98,
    security: 3,
    academicFreedom: 0.876,
    politicalStability: 7.58,
    development: 164,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.40565446

},
{
    en: "North Korea",
    fi: "Pohjois-Korea",
    country_id: "PRK",
    dataYear: 2025,
    corruption: 2.36,
    security: 3,
    academicFreedom: 0.036,
    politicalStability: 30.33,
    development: -1,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: -1.0

},
{
    en: "North Macedonia",
    fi: "Pohjois-Makedonian tasavalta",
    country_id: "MKD",
    dataYear: 2025,
    corruption: 42.45,
    security: 3,
    academicFreedom: 0.664,
    politicalStability: 51.18,
    development: 68,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.54133964

},
{
    en: "Norway",
    fi: "Norja",
    country_id: "NOR",
    dataYear: 2025,
    corruption: 99.06,
    security: 3,
    academicFreedom: 0.854,
    politicalStability: 77.73,
    development: 2,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.89026255

},
{
    en: "Oman",
    fi: "Oman",
    country_id: "OMN",
    dataYear: 2025,
    corruption: 60.85,
    security: 3,
    academicFreedom: 0.215,
    politicalStability: 65.88,
    development: 50,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Pakistan",
    fi: "Pakistan",
    country_id: "PAK",
    dataYear: 2025,
    corruption: 18.87,
    security: 3,
    academicFreedom: 0.268,
    politicalStability: 6.64,
    development: 168,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.37050436

},
{
    en: "Palestine/Gaza",
    fi: "Palestiina/Gaza",
    country_id: "PSG",
    dataYear: 2025,
    corruption: 26.42,
    security: 3,
    academicFreedom: 0.105,
    politicalStability: 7.11,
    development: -1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Palestine/West Bank",
    fi: "Palestiina/Länsiranta",
    country_id: "PSE",
    dataYear: 2025,
    corruption: 26.42,
    security: 3,
    academicFreedom: 0.347,
    politicalStability: 7.11,
    development: -1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Panama",
    fi: "Panama",
    country_id: "PAN",
    dataYear: 2025,
    corruption: 28.3,
    security: 3,
    academicFreedom: 0.914,
    politicalStability: 52.61,
    development: 59,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.51866469

},
{
    en: "Papua New Guinea",
    fi: "Papua-Uusi-Guinea",
    country_id: "PNG",
    dataYear: 2025,
    corruption: 27.36,
    security: 3,
    academicFreedom: 0.849,
    politicalStability: 27.01,
    development: 160,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Paraguay",
    fi: "Paraguay"      ,
    country_id: "PRY",
    dataYear: 2025,
    corruption: 16.04,
    security: 3,
    academicFreedom: 0.703,
    politicalStability: 49.29,
    development: 99,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.453738

},
{
    en: "Peru",
    fi: "Peru",
    country_id: "PER",
    dataYear: 2025,
    corruption: 25.47,
    security: 3,
    academicFreedom: 0.838,
    politicalStability: 24.17,
    development: 79,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.47656254

},
{
    en: "Philippines",
    fi: "Filippiinit",
    country_id: "PHL",
    dataYear: 2025,
    corruption: 32.55,
    security: 3,
    academicFreedom: 0.589,
    politicalStability: 23.7,
    development: 117,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.46245548

},
{
    en: "Poland",
    fi: "Puola",
    country_id: "POL",
    dataYear: 2025,
    corruption: 68.87,
    security: 3,
    academicFreedom: 0.864,
    politicalStability: 63.98,
    development: 35,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.66222978

},
{
    en: "Portugal",
    fi: "Portugali",
    country_id: "PRT",
    dataYear: 2025,
    corruption: 74.06,
    security: 3,
    academicFreedom: 0.826,
    politicalStability: 70.62,
    development: 40,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.673841

},
{
    en: "Qatar",
    fi: "Qatar",
    country_id: "QAT",
    dataYear: 2025,
    corruption: 75.0,
    security: 3,
    academicFreedom: 0.1,
    politicalStability: 84.36,
    development: 43,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.61698631

},
{
    en: "Republic of the Congo",
    fi: "Kongon Tasavalta",
    country_id: "COG",
    dataYear: 2025,
    corruption: 8.02,
    security: 3,
    academicFreedom: 0.255,
    politicalStability: 46.92,
    development: -1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.39952319

},
{
    en: "Romania",
    fi: "Romania",
    country_id: "ROU",
    dataYear: 2025,
    corruption: 56.13,
    security: 3,
    academicFreedom: 0.754,
    politicalStability: 56.4,
    development: 55,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.61299215

},
{
    en: "Russia",
    fi: "Venäjä",
    country_id: "RUS",
    dataYear: 2025,
    corruption: 15.57,
    security: 3,
    academicFreedom: 0.176,
    politicalStability: 13.27,
    development: -1,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.40731793

},
{
    en: "Rwanda",
    fi: "Ruanda",
    country_id: "RWA",
    dataYear: 2025,
    corruption: 73.11,
    security: 3,
    academicFreedom: 0.097,
    politicalStability: 49.76,
    development: 159,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.6338727

},
{
    en: "Sao Tome and Principe",
    fi: "São Tomé ja Príncipe",
    country_id: "STP",
    dataYear: 2025,
    corruption: -1.0,
    security: 3,
    academicFreedom: 0.636,
    politicalStability: -1.0,
    development: -1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Saudi Arabia",
    fi: "Saudi-Arabia",
    country_id: "SAU",
    dataYear: 2025,
    corruption: 66.51,
    security: 3,
    academicFreedom: 0.066,
    politicalStability: 39.81,
    development: 37,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Senegal",
    fi: "Senegal",
    country_id: "SEN",
    dataYear: 2025,
    corruption: 56.6,
    security: 3,
    academicFreedom: 0.755,
    politicalStability: 41.23,
    development: 169,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.56109951

},
{
    en: "Serbia",
    fi: "Serbia",
    country_id: "SRB",
    dataYear: 2025,
    corruption: 38.21,
    security: 3,
    academicFreedom: 0.598,
    politicalStability: 44.55,
    development: 62,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.46606863

},
{
    en: "Seychelles",
    fi: "Seychellit",
    country_id: "SYC",
    dataYear: 2025,
    corruption: 93.87,
    security: 3,
    academicFreedom: 0.931,
    politicalStability: 73.93,
    development: 54,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Sierra Leone",
    fi: "Sierra Leone",
    country_id: "SLE",
    dataYear: 2025,
    corruption: 31.13,
    security: 3,
    academicFreedom: 0.862,
    politicalStability: 37.44,
    development: 185,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.43981985

},
{
    en: "Singapore",
    fi: "Singapore",
    country_id: "SGP",
    dataYear: 2025,
    corruption: 98.11,
    security: 3,
    academicFreedom: 0.466,
    politicalStability: 97.16,
    development: 13,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.7833441

},
{
    en: "Slovakia",
    fi: "Slovakia",
    country_id: "SVK",
    dataYear: 2025,
    corruption: 61.32,
    security: 3,
    academicFreedom: 0.807,
    politicalStability: 64.45,
    development: 44,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.64349895

},
{
    en: "Slovenia",
    fi: "Slovenia",
    country_id: "SVN",
    dataYear: 2025,
    corruption: 77.36,
    security: 3,
    academicFreedom: 0.937,
    politicalStability: 75.83,
    development: 21,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.6834045

},
{
    en: "Solomon Islands",
    fi: "Salomonsaaret",
    country_id: "SLB",
    dataYear: 2025,
    corruption: 50.47,
    security: 3,
    academicFreedom: 0.9,
    politicalStability: 60.66,
    development: 156,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Somalia",
    fi: "Somalia",
    country_id: "SOM",
    dataYear: 2025,
    corruption: 0.94,
    security: 3,
    academicFreedom: 0.494,
    politicalStability: 2.84,
    development: 192,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: -1.0

},
{
    en: "Somaliland",
    fi: "Somalimaa",
    country_id: "SML",
    dataYear: 2025,
    corruption: -1.0,
    security: 3,
    academicFreedom: 0.709,
    politicalStability: -1.0,
    development: -1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "South Africa",
    fi: "Etelä-Afrikka",
    country_id: "ZAF",
    dataYear: 2025,
    corruption: 45.75,
    security: 3,
    academicFreedom: 0.831,
    politicalStability: 20.85,
    development: 106,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.55944854

},
{
    en: "South Korea",
    fi: "Etelä-Korea",
    country_id: "KOR",
    dataYear: 2025,
    corruption: 79.72,
    security: 3,
    academicFreedom: 0.85,
    politicalStability: 68.25,
    development: 20,
    gdpr: 2,
    sanctions: 1,
    ruleOfLaw: 0.74324292

},
{
    en: "South Sudan",
    fi: "Etelä-Sudan",
    country_id: "SSD",
    dataYear: 2025,
    corruption: 0.0,
    security: 3,
    academicFreedom: 0.054,
    politicalStability: 3.79,
    development: 193,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: -1.0

},
{
    en: "Spain",
    fi: "Espanja",
    country_id: "ESP",
    dataYear: 2025,
    corruption: 71.7,
    security: 3,
    academicFreedom: 0.869,
    politicalStability: 54.98,
    development: 28,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.71060828

},
{
    en: "Sri Lanka",
    fi: "Sri Lanka",
    country_id: "LKA",
    dataYear: 2025,
    corruption: 40.09,
    security: 3,
    academicFreedom: 0.828,
    politicalStability: 25.59,
    development: 89,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.51212724

},
{
    en: "Sudan",
    fi: "Sudan",
    country_id: "SDN",
    dataYear: 2025,
    corruption: 4.25,
    security: 3,
    academicFreedom: 0.206,
    politicalStability: 1.9,
    development: 176,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.33694743

},
{
    en: "Suriname",
    fi: "Suriname",
    country_id: "SUR",
    dataYear: 2025,
    corruption: 39.15,
    security: 3,
    academicFreedom: 0.828,
    politicalStability: 59.72,
    development: 114,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.49495845

},
{
    en: "Sweden",
    fi: "Ruotsi",
    country_id: "SWE",
    dataYear: 2025,
    corruption: 97.64,
    security: 1,
    academicFreedom: 0.934,
    politicalStability: 73.46,
    development: 5,
    gdpr: 1,
    sanctions: 1,
    ruleOfLaw: 0.85227449

},
{
    en: "Switzerland",
    fi: "Sveitsi",
    country_id: "CHE",
    dataYear: 2025,
    corruption: 97.17,
    security: 3,
    academicFreedom: 0.773,
    politicalStability: 88.63,
    development: 2,
    gdpr: 2,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Syria",
    fi: "Syyria",
    country_id: "SYR",
    dataYear: 2025,
    corruption: 0.47,
    security: 3,
    academicFreedom: 0.201,
    politicalStability: 0.0,
    development: 162,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: -1.0

},
{
    en: "Taiwan",
    fi: "Taiwan",
    country_id: "TWN",
    dataYear: 2025,
    corruption: -1.0,
    security: 3,
    academicFreedom: 0.828,
    politicalStability: -1.0,
    development: -1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Tajikistan",
    fi: "Tadžikistan",
    country_id: "TJK",
    dataYear: 2025,
    corruption: 7.55,
    security: 3,
    academicFreedom: 0.082,
    politicalStability: 27.49,
    development: 128,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Tanzania",
    fi: "Tansania",
    country_id: "TZA",
    dataYear: 2025,
    corruption: 43.87,
    security: 3,
    academicFreedom: 0.515,
    politicalStability: 44.08,
    development: 165,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.46076398

},
{
    en: "Thailand",
    fi: "Thaimaa",
    country_id: "THA",
    dataYear: 2025,
    corruption: 35.85,
    security: 3,
    academicFreedom: 0.382,
    politicalStability: 36.02,
    development: 76,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.5028867

},
{
    en: "The Gambia",
    fi: "Gambia",
    country_id: "GMB",
    dataYear: 2025,
    corruption: 46.23,
    security: 3,
    academicFreedom: 0.821,
    politicalStability: 45.97,
    development: -1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.48625897

},
{
    en: "Timor-Leste",
    fi: "Itä-Timor",
    country_id: "TLS",
    dataYear: 2025,
    corruption: 47.64,
    security: 3,
    academicFreedom: 0.731,
    politicalStability: 54.5,
    development: 142,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Togo",
    fi: "Togo",
    country_id: "TGO",
    dataYear: 2025,
    corruption: 28.77,
    security: 3,
    academicFreedom: 0.609,
    politicalStability: 14.22,
    development: 161,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.43259211

},
{
    en: "Trinidad and Tobago",
    fi: "Trinidad ja Tobago",
    country_id: "TTO",
    dataYear: 2025,
    corruption: 41.04,
    security: 3,
    academicFreedom: 0.414,
    politicalStability: 57.82,
    development: 72,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.51133836

},
{
    en: "Tunisia",
    fi: "Tunisia",
    country_id: "TUN",
    dataYear: 2025,
    corruption: 42.92,
    security: 3,
    academicFreedom: 0.558,
    politicalStability: 22.27,
    development: 105,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.48982978

},
{
    en: "Turkmenistan",
    fi: "Turkmenistan",
    country_id: "TKM",
    dataYear: 2025,
    corruption: 6.6,
    security: 3,
    academicFreedom: 0.064,
    politicalStability: 43.13,
    development: 95,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Türkiye",
    fi: "Turkki",
    country_id: "TUR",
    dataYear: 2025,
    corruption: 34.91,
    security: 3,
    academicFreedom: 0.088,
    politicalStability: 13.74,
    development: 51,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.40770137

},
{
    en: "Uganda",
    fi: "Uganda",
    country_id: "UGA",
    dataYear: 2025,
    corruption: 16.51,
    security: 3,
    academicFreedom: 0.196,
    politicalStability: 19.43,
    development: 157,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.38402636

},
{
    en: "Ukraine",
    fi: "Ukraina",
    country_id: "UKR",
    dataYear: 2025,
    corruption: 25.94,
    security: 3,
    academicFreedom: 0.281,
    politicalStability: 10.9,
    development: 87,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.48365439

},
{
    en: "United Arab Emirates",
    fi: "Yhdistyneet arabiemiirikunnat",
    country_id: "ARE",
    dataYear: 2025,
    corruption: 82.55,
    security: 3,
    academicFreedom: 0.5,
    politicalStability: 70.14,
    development: 15,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.63984888

},
{
    en: "United Kingdom",
    fi: "Yhdistynyt kuningaskunta",
    country_id: "GBR",
    dataYear: 2025,
    corruption: 90.57,
    security: 3,
    academicFreedom: 0.668,
    politicalStability: 62.09,
    development: 13,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.78447329

},
{
    en: "United States of America",
    fi: "Yhdysvallat",
    country_id: "USA",
    dataYear: 2025,
    corruption: 83.02,
    security: 1,
    academicFreedom: 0.397,
    politicalStability: 47.39,
    development: -1,
    gdpr: 2,
    sanctions: 1,
    ruleOfLaw: 0.67977332

},
{
    en: "Uruguay",
    fi: "Uruguay",
    country_id: "URY",
    dataYear: 2025,
    corruption: 92.45,
    security: 3,
    academicFreedom: 0.91,
    politicalStability: 81.99,
    development: 48,
    gdpr: 2,
    sanctions: 1,
    ruleOfLaw: 0.71827858

},
{
    en: "Uzbekistan",
    fi: "Uzbekistan",
    country_id: "UZB",
    dataYear: 2025,
    corruption: 23.11,
    security: 3,
    academicFreedom: 0.248,
    politicalStability: 40.76,
    development: 107,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.49687625

},
{
    en: "Vanuatu",
    fi: "Vanuatu",
    country_id: "VUT",
    dataYear: 2025,
    corruption: 53.77,
    security: 3,
    academicFreedom: 0.909,
    politicalStability: 81.04,
    development: 146,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Venezuela",
    fi: "Venezuela",
    country_id: "VEN",
    dataYear: 2025,
    corruption: 1.42,
    security: 3,
    academicFreedom: 0.129,
    politicalStability: 12.32,
    development: 121,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: 0.25974105

},
{
    en: "Vietnam",
    fi: "Vietnam",
    country_id: "VNM",
    dataYear: 2025,
    corruption: 38.68,
    security: 3,
    academicFreedom: 0.222,
    politicalStability: 45.02,
    development: -1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.49549633

},
{
    en: "Yemen",
    fi: "Jemen",
    country_id: "YEM",
    dataYear: 2025,
    corruption: 1.89,
    security: 3,
    academicFreedom: 0.24,
    politicalStability: 0.95,
    development: 184,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: -1.0

},
{
    en: "Zambia",
    fi: "Sambia",
    country_id: "ZMB",
    dataYear: 2025,
    corruption: 36.79,
    security: 3,
    academicFreedom: 0.844,
    politicalStability: 52.13,
    development: 154,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: 0.44991896

},
{
    en: "Zanzibar",
    fi: "Sansibar",
    country_id: "ZZB",
    dataYear: 2025,
    corruption: -1.0,
    security: 3,
    academicFreedom: 0.316,
    politicalStability: -1.0,
    development: -1,
    gdpr: 3,
    sanctions: 1,
    ruleOfLaw: -1.0

},
{
    en: "Zimbabwe",
    fi: "Zimbabwe",
    country_id: "ZWE",
    dataYear: 2025,
    corruption: 9.91,
    security: 3,
    academicFreedom: 0.157,
    politicalStability: 15.17,
    development: 153,
    gdpr: 3,
    sanctions: 3,
    ruleOfLaw: -1.0

}
]

    for (let i = 0; i < countries.length; i++) {
        
        let country = await repository.findCountryByCountryId(countries[i].country_id);
        if (country) {
            country.en = countries[i].en;
            country.fi = countries[i].fi;
            country.dataYear = countries[i].dataYear;
            country.corruption = countries[i].corruption;
            country.security = countries[i].security;
            country.academicFreedom = countries[i].academicFreedom;
            country.politicalStability = countries[i].politicalStability;
            country.development = countries[i].development;
            country.gdpr = countries[i].gdpr;
            country.sanctions = countries[i].sanctions;
            country.ruleOfLaw = countries[i].ruleOfLaw;
            country.save();
        } else {
            repository.createCountry(countries[i]);
        }
    }
}