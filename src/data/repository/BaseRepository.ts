import { Sequelize } from "sequelize-typescript";
import config from "../../config.js";


export default class BaseRepository {
    sequelizeClient: Sequelize;

    constructor() {
        this.sequelizeClient = new Sequelize({
            host: config.db.host,
            port: config.db.port,
            database: config.db.database,
            dialect: "mariadb",
            username: config.db.username,
            password: config.db.password,
            models: [__dirname + "/../models"],
        });
    }
}

export type Constructor<T = {}> = new (...args: any[]) => T;