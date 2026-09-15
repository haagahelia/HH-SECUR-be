import User from "../data/models/User";

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