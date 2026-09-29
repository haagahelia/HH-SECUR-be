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
        })),
    });
}
