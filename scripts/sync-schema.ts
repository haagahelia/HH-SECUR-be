// Builds the schema from the Sequelize models with sync(), for SCRATCH databases only.
//
// Used to generate db/baseline.sql and for schema drift checks (see docs/migrations.md).
// It refuses to run unless the database name contains "baseline" or "drift", so it can never
// touch a real database by accident.
//
// Usage (PowerShell):  $env:DB_DATABASE = "hh_secur_baseline"; npx tsx scripts/sync-schema.ts
// Usage (bash):        DB_DATABASE=hh_secur_baseline npx tsx scripts/sync-schema.ts
import repository from "../src/data/repository/repository";

const main = async () => {
    const database = process.env.DB_DATABASE ?? "";

    if (!/baseline|drift/i.test(database)) {
        console.error(`Refusing to run: DB_DATABASE="${database}" does not contain "baseline" or "drift".`);
        console.error("sync() is only allowed on scratch databases. Set DB_DATABASE to a scratch database name.");
        process.exit(1);
    }

    const sequelize = repository.sequelizeClient;
    await sequelize.authenticate();
    await sequelize.sync();

    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log(`sync() finished on "${database}": ${tables.length} tables`);

    await sequelize.close();
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
