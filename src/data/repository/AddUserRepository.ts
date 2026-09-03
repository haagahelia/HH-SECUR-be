import User from "../models/User.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";

export function AddUserRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {
        getUsers() {
            return User.findAll({
            })
        }

        getUser(id: number) {
            return User.findByPk(id);
        }

        createUser(userAttributes: { username: string; email: string; password_hash: string }) {
            return User.create(userAttributes);
        }

    }
}