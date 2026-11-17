import { createServer } from "./server.js";
import repository from "./data/repository/repository.js";
import { addDataToAllTables } from "./utils/utils.js";
import { assertSchemaUpToDate } from "./utils/schemaCheck.js";

const server = createServer();

const port = process.env.PORT || 3000;

console.log("Backend is running");

server.listen(port, async () => {
    // The schema is created and changed only by migrations (npm run migrate), never by the server.
    // If the database cannot be reached or is not migrated, stop: the platform restarts the container
    // and shows the error, instead of leaving a server that answers every request with an error.
    try {
        await repository.sequelizeClient.authenticate();
        console.log("Succsefully connected to database")
        await assertSchemaUpToDate(repository.sequelizeClient);
    } catch (error) {
        console.log("Database connection or schema check failed");
        console.log(error);
        process.exit(1);
    }

    // The seed is safe to repeat (see docs/migrations.md, section 9). If it fails the API still works
    // with the data that is already there, so keep running and log it.
    try {
        await addDataToAllTables();
    } catch (error) {
        console.log("Seeding failed. The API keeps running with the data that is already in the database.");
        console.log(error);
    }

    console.log(`API running on ${port}`)
})
