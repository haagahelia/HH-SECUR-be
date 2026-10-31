import { Request, Response } from "express";
import repository from "../data/repository/repository.js";


export const getCountries = async (req: Request, res: Response) => {

    const countries = await repository.getCountries();

    res.json({
        countries: countries.map((country) => ({
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
    });
}

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

export const postCountry = async (req: Request, res: Response) => {

    const countryAttributes = {
        code: req.body.code,
        fi: req.body.fi,
        en: req.body.en,
        dataYear: req.body.datayear,
        corruption: req.body.corruption,
        security: req.body.security,
        academicFreedom: req.body.academicfreedom,
        politicalStability: req.body.politicalstability,
        development: req.body.development,
        gdpr: req.body.gdpr,
        sanctions: req.body.sanctions,
        ruleOfLaw: req.body.ruleoflaw
    }

    if (!countryAttributes.code || !countryAttributes.fi || !countryAttributes.en || !countryAttributes.dataYear || !countryAttributes.corruption || !countryAttributes.security || !countryAttributes.academicFreedom || !countryAttributes.politicalStability || !countryAttributes.development || !countryAttributes.gdpr || !countryAttributes.sanctions || !countryAttributes.ruleOfLaw) {
        res.status(422).json({ mesage: `Fields code, fi, en, datayear, corruption, security, academicfreedom, policialstability, development, gdpr, sanctions and ruleoflaw are required` })
        return;
    }

    const country = await repository.createCountry(countryAttributes)

    res.status(200).json({
        message: `Country by the idea of ${country.id} has been successfully created`,
        country: country
    })
}

export const patchCountry = async (req: Request, res: Response) => {

    const idRaw = (req.params.id);
    const id = parseInt(idRaw as string)
    if (Number.isNaN(id)) {
        res.status(400).json({
            message: `Requested id ${idRaw} is not a number`
        });
        return;
    }

    const country = await repository.findCountryById(id);

    if (!country) {
        res.status(404).json({
            message: `Country by the id of ${id} does not exist`
        });
        return;
    }

    const countryAttributes = {
        code: req.body.code ? req.body.code : country.code,
        fi: req.body.fi ? req.body.fi : country.fi,
        en: req.body.en ? req.body.en : country.en,
        dataYear: req.body.datayear ? req.body.datayear : country.dataYear,
        corruption: req.body.corruption ? req.body.corruption : country.corruption,
        security: req.body.security ? req.body.security : country.security,
        academicFreedom: req.body.academicfreedom ? req.body.academicfreedom : country.academicFreedom,
        politicalStability: req.body.politicalstability ? req.body.politicalstability : country.politicalStability,
        development: req.body.development ? req.body.development : country.development,
        gdpr: req.body.gdpr ? req.body.gdpr : country.gdpr,
        sanctions: req.body.sanctions ? req.body.sanctions : country.sanctions,
        ruleOfLaw: req.body.ruleoflaw ? req.body.ruleoflaw : country.ruleOfLaw
    }

    if (!countryAttributes.code || !countryAttributes.fi || !countryAttributes.en || !countryAttributes.dataYear || !countryAttributes.corruption || !countryAttributes.security || !countryAttributes.academicFreedom || !countryAttributes.politicalStability || !countryAttributes.development || !countryAttributes.gdpr || !countryAttributes.sanctions || !countryAttributes.ruleOfLaw) {
        res.status(422).json({ mesage: `Fields code, fi, en, datayear, corruption, security, academicfreedom, policialstability, development, gdpr, sanctions and ruleoflaw are required` })
        return;
    }

    country.set(countryAttributes);

    const updatedCountry = await country.save();

    res.status(200).json({
        message: `Country by the idea of ${country.id} has been successfully updated`,
        country: updatedCountry
    })
}



export const deleteCountry = async (req: Request, res: Response) => {
    const idRaw = (req.params.id);
    const id = parseInt(idRaw as string)
    if (Number.isNaN(id)) {
        res.status(400).json({
            message: `Requested id ${idRaw} is not a number`
        })
    } else {
        const country = await repository.findCountryById(id);
        if (!country) {
            res.status(404).json({
                message: `Country by the id of ${id} does not exist`
            })
        } else if (country.reports && country.reports.length > 0) {
            res.status(400).json({
                message: `Countries involved in reports cannot be deleted`,
                reports: country.reports
            })
        } else {
            await country.destroy();
            res.status(200).json({
                message: `Country by the id of ${id} has been deleted`
            })
        }
    }
}