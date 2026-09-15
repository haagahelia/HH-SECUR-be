import { sanitizeUser } from "../../utils/utils.js";
import User from "../models/User.js";
import BaseRepository, { Constructor } from "./BaseRepository.js";

export function AddUserRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class extends Base {
        async getUsers() {
            return User.findAll({
                attributes: {
                    exclude: ["password_hash"],
                }
            })
        }

        async getUser(id: number) {
            return User.findByPk(id, {
                attributes: {
                    exclude: ["password_hash"],
                }
            });
        }

        async createUser(userAttributes: { username: string; email: string; password_hash: string; role: string }) {
            const user = await User.create(userAttributes);
            return (sanitizeUser(user));
        }

        async deleteUser(id: number) {
            const user = await User.findByPk(id);
            if (user) {
                await user.destroy();
            }
        }

        async updateUser(id: number, userAttributes: { username: string; email: string; password_hash: string; role: string }) {
            const user = await User.findByPk(id);
            if (user) {
                return await user.update(userAttributes);
            }
        }

        async deleteByEmail(email: string) {
            await User.destroy({
                where: {
                    email: email,
                },
            });
        }

        async findByEmail(email: string) {
            return User.findOne({
                where: {
                    email: email,
                },
                attributes: { exclude: ["password_hash"] }
            });
        }


        async findByUsername(username: string) {
            return User.findOne({
                where: {
                    username: username,
                }
            });
        }

    }
}