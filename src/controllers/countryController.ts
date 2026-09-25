import { Request, Response } from "express";
import repository from "../data/repository/repository.js";


export const getCountries = async (req: Request, res: Response) => {

    const countries = await repository.getCountries();

    res.json({ countries: countries.map((country) => ({
        id: country.id,
        code: country.code,
        fi: country.fi,
        en: country.en,
        dataYear: country.dataYear,
        corruption: country.corruption,
        security: country.security,
        academicFreedom: country.academicFreedom,
        politicalStability: country.politicalStability,
        development: country.development,
        gdpr: country.gdpr,
        sanctions: country.sanctions,
        ruleOfLaw: country.ruleOfLaw
    })) 
});}

export const getCountryByCode = async (req: Request, res: Response) => {
    const code = (req.params.code as string);
    const country = await repository.findCountryByCode(code);
    if (!country) {
        return res.status(404).json({ error: "Country not found" });
    }
    res.json({
        id: country.id,
        code: country.code,
        fi: country.fi,
        en: country.en,
        dataYear: country.dataYear,
        corruption: country.corruption,
        security: country.security,
        academicFreedom: country.academicFreedom,
        politicalStability: country.politicalStability,
        development: country.development,
        gdpr: country.gdpr,
        sanctions: country.sanctions,
        ruleOfLaw: country.ruleOfLaw
    });
};