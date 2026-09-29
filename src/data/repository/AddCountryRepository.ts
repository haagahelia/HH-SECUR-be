import BaseRepository, { Constructor } from "./BaseRepository.js";
import repository from "./repository.js";
import Country from "../models/Country.js";
import { addCountryData } from "../../utils/countryData.js";

export function AddCountryRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {
    
        async createCountry(countryAttributes: {code: string; fi: string; en: string; dataYear: number; corruption: number; security: number; academicFreedom: number; politicalStability: number; development: number; gdpr: number; sanctions: number; ruleOfLaw: number; }) {
            return await Country.create(countryAttributes);
        }

        async findCountryByCode(code: string) {
            return await Country.findOne({ where: { code } });
        }

        async getCountries() {
            return await Country.findAll();
        }
    
    }
}