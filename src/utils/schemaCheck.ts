import fs from "fs";
import path from "path";
import { QueryTypes } from "sequelize";
import { Sequelize } from "sequelize-typescript";

// Compares the migration files in db/migrations with the ones recorded in the SequelizeMeta table.
// Throws if a migration is waiting to be run, so the server stops with a clear message instead of
// running against a schema that is too old ("Unknown column ..." errors later).
// A database that is NEWER than the code (another, newer version already migrated it) is only
// reported: the previous version of the application must keep working during a deployment.
export const assertSchemaUpToDate = async (sequelize: Sequelize) => {
    // db/ lives next to package.json, the same place .sequelizerc points to (run from the project root)
    const migrationsDir = path.resolve(process.cwd(), "db", "migrations");
    const files = fs.readdirSync(migrationsDir).filter((file) => file.endsWith(".js")).sort();

    let applied: string[];
    try {
        const rows = await sequelize.query<{ name: string }>("SELECT name FROM `SequelizeMeta`", { type: QueryTypes.SELECT });
        applied = rows.map((row) => row.name);
    } catch {
        throw new Error("The table SequelizeMeta does not exist: this database has never been migrated. Run `npm run migrate`.");
    }

    const pending = files.filter((file) => !applied.includes(file));
    if (pending.length > 0) {
        throw new Error(`${pending.length} migration(s) have not been run: ${pending.join(", ")}. Run \`npm run migrate\`.`);
    }

    const unknown = applied.filter((name) => !files.includes(name));
    if (unknown.length > 0) {
        console.log(`Note: the database has migrations this version does not know (a newer version migrated it): ${unknown.join(", ")}`);
    }
};
