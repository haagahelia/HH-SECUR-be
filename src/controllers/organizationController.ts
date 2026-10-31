import { Request, Response } from "express";
import repository from "../data/repository/repository.js";

export const getOrganizations = async (req: Request, res: Response) => {
    const organizations = await repository.getOrganizations();
    res.json({
        organizations: organizations.map((organization) => ({
            id: organization.id,
            name: {
                fi: organization.fi,
                en: organization.en,
            },
            countryId: organization.country_code,
            manuallyAdded: organization.added_manually
        })),
    });
}

export const postOrganization = async (req: Request, res: Response) => {
    const { fi, en, countrycode, addedmanually } = req.body;
    if (!fi || !en || !countrycode) {
        res.status(422).json({ message: `Values for fields fi, en, countrycode and addedmanually required` })
        return;
    } else if (typeof (addedmanually) !== "boolean") {
        res.status(422).json({ message: `Value for addedmanually should be true or false instead of ${addedmanually}` })
        return;
    }
    const validCountry = await repository.findCountryByCode(countrycode);
    if (!validCountry) {
        res.status(422).json({ message: `Country with the countrycode of ${countrycode} does not exist` })
        return;
    }

    const organizationCreateionAttributes = {
        code: req.body.code ? req.body.code as string : null,
        fi: fi as string,
        en: en as string,
        country_code: countrycode as string,
        added_manually: addedmanually
    }
    const newOrganization = await repository.createOrganization(organizationCreateionAttributes);
    res.status(200).json({
        message: `Organization by the id of ${newOrganization.id} added`,
        organization: newOrganization
    });
}

export const deleteOrganization = async (req: Request, res: Response) => {
    const idRaw = (req.params.id);
    const id = parseInt(idRaw as string)
    if (Number.isNaN(id)) {
        res.status(400).json({
            message: `Requested id ${idRaw} is not a number`
        })
    } else {
        const organization = await repository.findOrganizationById(id);
        if (!organization) {
            res.status(404).json({
                message: `Organization by the id of ${id} does not exist`
            })
        } else if (organization.consortiums && organization.consortiums.length > 0) {
            res.status(400).json({
                message: `Organizations in consortiums cannot be deleted`,
                consortiums: organization.consortiums
            })
        } else {
            await organization.destroy();
            res.json({
                message: `Organization by the id of ${id} has been deleted`
            })
        }
    }
}