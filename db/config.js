// Database connection for Sequelize-CLI (migrations only, the app itself uses src/config.ts).
// Reads the same environment variables as the app. The CLI needs plain CommonJS, so this is a .js file.
require("dotenv").config({ quiet: true });

const connection = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialect: "mariadb",
    // Same SSL rule as src/data/repository/BaseRepository.ts
    dialectOptions: process.env.DB_SSL === "true"
        ? { ssl: { rejectUnauthorized: true } }
        : undefined,
};

// One block for every environment: the target database is chosen by the DB_* variables, not by NODE_ENV.
module.exports = {
    development: connection,
    test: connection,
    production: connection,
};
