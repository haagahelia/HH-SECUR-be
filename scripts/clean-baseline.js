// Cleans a raw mariadb-dump (schema only) into db/baseline.sql.
//
// How db/baseline.sql is (re)generated:
//   1. Build the schema on a scratch database from the models:
//        DB_DATABASE=hh_secur_baseline npx tsx scripts/sync-schema.ts
//   2. Dump it INSIDE the container (PowerShell's ">" would write UTF-16 and break the file):
//        docker exec hh_secur_db_container sh -c 'mariadb-dump --compact --no-data -uroot -p"$MARIADB_ROOT_PASSWORD" hh_secur_baseline > /tmp/baseline.raw.sql'
//        docker cp hh_secur_db_container:/tmp/baseline.raw.sql baseline.raw.sql
//   3. Clean it:
//        node scripts/clean-baseline.js baseline.raw.sql db/baseline.sql
//
// What is removed, and why:
//   - conditional comments such as /*!40101 SET ... */ and /*M!999999 ... */ (not needed, not portable)
//   - the table option AUTO_INCREMENT=<n> (a schema file must not carry a row counter)
//   - DEFAULT CHARSET=... and COLLATE=... on tables, so tables take the database default exactly as
//     sync() did (the MariaDB 12 default collation utf8mb4_uca1400_ai_ci does not exist on every server)
//   - the names of foreign keys (CONSTRAINT `1` FOREIGN KEY ...). MariaDB 12 numbers unnamed keys per table,
//     so every table has a `1`. MySQL and MariaDB 10.x need foreign key names to be unique in the whole
//     database, so the baseline failed there with "Duplicate key" (errno 121). Without names each server
//     generates its own, which is valid everywhere.
// Nothing else is changed. Do not edit db/baseline.sql by hand.
const fs = require("fs");

const [input, output = "db/baseline.sql"] = process.argv.slice(2);

if (!input) {
    console.error("Usage: node scripts/clean-baseline.js <raw-dump.sql> [output=db/baseline.sql]");
    process.exit(1);
}

const raw = fs.readFileSync(input, "utf8").replace(/^﻿/, "").replace(/\r\n/g, "\n");

const cleaned = raw
    .split("\n")
    // drop conditional comments: /*!40101 ... */;  and  /*M!999999\- ... */
    .filter((line) => !/^\/\*[!M].*\*\/;?\s*$/.test(line))
    .map((line) => {
        // only touch the table options line, e.g. ") ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=..."
        if (!line.startsWith(") ENGINE=")) {
            return line;
        }
        return line
            .replace(/ AUTO_INCREMENT=\d+/, "")
            .replace(/ DEFAULT CHARSET=\w+/, "")
            .replace(/ COLLATE=\w+/, "");
    })
    .join("\n")
    // let every server name the foreign keys itself (see the header)
    .replace(/CONSTRAINT `[^`]+` FOREIGN KEY/g, "FOREIGN KEY")
    .replace(/;\n+(?=CREATE TABLE )/g, ";\n\n") // exactly one blank line between statements
    .trim() + "\n";

const tables = (cleaned.match(/^CREATE TABLE /gm) || []).length;
if (tables === 0) {
    console.error("No CREATE TABLE statements found. Is the input a schema dump?");
    process.exit(1);
}

fs.writeFileSync(output, cleaned, { encoding: "utf8" });
console.log(`Wrote ${output}: ${tables} tables, ${cleaned.length} characters`);
