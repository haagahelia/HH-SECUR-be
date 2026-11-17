// Checks that addDataToAllTables() is safe to run repeatedly on a persistent database (Phase 4a).
//
// It runs the seed twice, with a manually added organization present, and verifies:
//   1. every seeded organization whose country exists still has country_id after both runs;
//   2. the manually added organization is untouched by the second run;
//   3. the same holds for the full organization list (addOrganizations(), the code behind the admin
//      endpoint /populatedatabase, about 11 000 rows), run twice on top of the boot seed;
//   4. no error was logged and no promise was rejected without a handler.
//
// SCRATCH databases only: it refuses to run unless the database name contains "scratch",
// "baseline" or "drift". The schema must already exist (run `npm run migrate` against the
// scratch database first). See docs/migrations.md, section 9.
//
// Usage (bash):
//   DB_DATABASE=hh_secur_scratch_seed npm run migrate
//   DB_DATABASE=hh_secur_scratch_seed npx tsx scripts/test-seed.ts
// Usage (PowerShell):
//   $env:DB_DATABASE = "hh_secur_scratch_seed"; npm run migrate; npx tsx scripts/test-seed.ts
import repository from "../src/data/repository/repository";
import Organization from "../src/data/models/Organization";
import Country from "../src/data/models/Country";
import { addDataToAllTables } from "../src/utils/utils";
import { addOrganizations } from "../src/controllers/populateDatabaseController";

const MANUAL_NAME_FI = "Manual test organization FI";
const problems: string[] = [];
let loggedErrors = 0;

// The seed code catches errors and only logs them, so count logged Error objects.
for (const method of ["log", "error", "warn"] as const) {
    const original = console[method].bind(console);
    console[method] = (...args: unknown[]) => {
        if (args.some((arg) => arg instanceof Error)) {
            loggedErrors++;
        }
        original(...args);
    };
}

let unhandledRejections = 0;
process.on("unhandledRejection", (reason) => {
    unhandledRejections++;
    console.error("unhandledRejection:", reason);
});

const check = (condition: boolean, message: string) => {
    if (!condition) {
        problems.push(message);
    }
};

const seededOrgsWithoutCountry = async () => {
    const countries = await Country.findAll();
    const knownCodes = new Set(countries.map((country) => country.code));
    const organizations = await Organization.findAll({ where: { added_manually: false } });
    const missing = organizations.filter(
        (organization) => knownCodes.has(organization.country_code) && organization.countryId === null,
    );
    return { seeded: organizations.length, missing: missing.length, countries: countries.length };
};

const main = async () => {
    const database = process.env.DB_DATABASE ?? "";

    if (!/scratch|baseline|drift/i.test(database)) {
        console.error(`Refusing to run: DB_DATABASE="${database}" does not contain "scratch", "baseline" or "drift".`);
        process.exit(1);
    }

    await repository.sequelizeClient.authenticate();

    console.log("--- seed run 1 ---");
    await addDataToAllTables();
    const afterFirst = await seededOrgsWithoutCountry();
    console.log(`after run 1: ${afterFirst.countries} countries, ${afterFirst.seeded} seeded organizations, ${afterFirst.missing} without country_id`);
    check(afterFirst.missing === 0, `run 1: ${afterFirst.missing} seeded organizations have no country_id`);

    const anyCountry = await Country.findOne();
    if (!anyCountry) {
        throw new Error("No countries after seeding, cannot continue");
    }
    // Re-runnable: remove the manual organization left over from an earlier run.
    await Organization.destroy({ where: { fi: MANUAL_NAME_FI } });
    const created = await Organization.create({
        countryId: anyCountry.id,
        code: null,
        fi: MANUAL_NAME_FI,
        en: "Manual test organization EN",
        country_code: anyCountry.code,
        added_manually: true,
    });
    // Re-read it: the database stores timestamps without milliseconds, create() returns them with.
    const manual = await Organization.findByPk(created.id);
    if (!manual) {
        throw new Error("Could not read back the manual organization");
    }
    const manualBefore = JSON.stringify(manual.toJSON());

    console.log("--- seed run 2 ---");
    await addDataToAllTables();
    const afterSecond = await seededOrgsWithoutCountry();
    console.log(`after run 2: ${afterSecond.seeded} seeded organizations, ${afterSecond.missing} without country_id`);
    check(afterSecond.missing === 0, `run 2: ${afterSecond.missing} seeded organizations lost their country_id`);

    const manualAfter = await Organization.findByPk(manual.id);
    check(manualAfter !== null, "run 2: the manually added organization disappeared");
    check(
        manualAfter !== null && JSON.stringify(manualAfter.toJSON()) === manualBefore,
        "run 2: the manually added organization was changed",
    );

    // The full list, as /populatedatabase runs it. It is a superset of the boot seed, so the rows
    // created by the boot seed are updated and the rest are created. Nothing may lose its country.
    for (const run of [1, 2]) {
        console.log(`--- full organization list, run ${run} ---`);
        await addOrganizations();
        const afterFull = await seededOrgsWithoutCountry();
        console.log(`after full list run ${run}: ${afterFull.seeded} seeded organizations, ${afterFull.missing} without country_id`);
        check(afterFull.missing === 0, `full list run ${run}: ${afterFull.missing} seeded organizations have no country_id`);
        check(afterFull.seeded >= afterSecond.seeded, `full list run ${run}: seeded organizations dropped from ${afterSecond.seeded} to ${afterFull.seeded}`);
    }
    // The boot seed must also be safe on top of the full list.
    await addDataToAllTables();
    const afterBoot = await seededOrgsWithoutCountry();
    check(afterBoot.missing === 0, `boot seed after full list: ${afterBoot.missing} seeded organizations lost their country_id`);
    const manualFinal = await Organization.findByPk(manual.id);
    check(
        manualFinal !== null && JSON.stringify(manualFinal.toJSON()) === manualBefore,
        "full list: the manually added organization was changed or removed",
    );

    check(loggedErrors === 0, `${loggedErrors} error(s) were logged during seeding`);
    check(unhandledRejections === 0, `${unhandledRejections} unhandled promise rejection(s)`);

    await repository.sequelizeClient.close();

    if (problems.length > 0) {
        console.error("\nFAILED:");
        problems.forEach((problem) => console.error(` - ${problem}`));
        process.exit(1);
    }
    console.log("\nPASSED: seeding is safe to run repeatedly on persistent data");
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
