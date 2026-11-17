// Runs `sequelize-cli db:migrate` while holding a database lock (npm run migrate).
//
// The CLI has no locking: two containers that start at the same moment (a rolling deployment, a
// restart during a deployment) could both run the same pending migration. This wrapper takes a MariaDB
// advisory lock (GET_LOCK) on its own connection first, so the second one waits until the first has
// finished and then finds nothing left to do. The lock is released when the CLI is done, or by the
// server itself if this process dies.
//
// Same environment variables as the app and db/config.js (DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD,
// DB_DATABASE, DB_SSL). Use `npx sequelize-cli db:migrate:undo` style commands (npm run migrate:undo)
// directly, they do not need the lock.
const { spawn } = require("child_process");
const path = require("path");
const mariadb = require("mariadb");
const { development: connection } = require("../db/config");

const LOCK_WAIT_SECONDS = 120;

const main = async () => {
    const lockName = `hh_secur_migrate_${connection.database}`;
    const lockConnection = await mariadb.createConnection({
        host: connection.host,
        port: connection.port,
        user: connection.username,
        password: connection.password,
        database: connection.database,
        ssl: connection.dialectOptions ? connection.dialectOptions.ssl : undefined,
    });

    try {
        const [row] = await lockConnection.query("SELECT GET_LOCK(?, ?) AS acquired", [lockName, LOCK_WAIT_SECONDS]);
        if (Number(row.acquired) !== 1) {
            throw new Error(`Could not get the migration lock "${lockName}" within ${LOCK_WAIT_SECONDS} s. Another migration is probably still running.`);
        }

        const cli = path.join(path.dirname(require.resolve("sequelize-cli/package.json")), "lib", "sequelize");
        const exitCode = await new Promise((resolve, reject) => {
            const child = spawn(process.execPath, [cli, "db:migrate"], { stdio: "inherit" });
            child.on("error", reject);
            child.on("close", (code) => resolve(code === null ? 1 : code));
        });

        await lockConnection.query("SELECT RELEASE_LOCK(?)", [lockName]).catch(() => { });
        return exitCode;
    } finally {
        await lockConnection.end().catch(() => { });
    }
};

main()
    .then((code) => process.exit(code))
    .catch((error) => {
        console.error(error.message || error);
        process.exit(1);
    });
