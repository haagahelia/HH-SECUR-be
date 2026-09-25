import { addCollaborationTypes, addConsortiumTypes, addDuration, addHHRole, addOrganizations, addOrganizationType } from "../controllers/populateDatabaseController";
import User from "../data/models/User";
import { addCountryData } from "./countryData";
import { internalAddDefaultAdmin, internalAddDefaultUser } from "./tempUtils";

type JSONUser =
    {
        id: number,
        username: string,
        email: string,
        role: string,
        password_hash?: string,
    }

export function sanitizeUser(user: User) {
    const userJson = user.toJSON() as JSONUser;

    delete userJson.password_hash;

    return userJson;

}

export const addDataToAllTables = async () => {
    await internalAddDefaultUser();
    await internalAddDefaultAdmin();
    await addHHRole();
    await addOrganizations();
    await addCollaborationTypes();
    await addConsortiumTypes();
    await addCountryData();
    await addOrganizationType();
    await addDuration();
}