import { createServer } from "./server.js";
import repository from "./data/repository/repository.js";
import { addDataToAllTables } from "./utils/utils.js";

const server = createServer();

const port = process.env.PORT || 3000;

console.log("Backend is running");

server.listen(port, async () => {
    try {
        await repository.sequelizeClient.authenticate();
        await repository.sequelizeClient.drop();
        await repository.sequelizeClient.sync();
        console.log("Succsefully connected to database")
        await addDataToAllTables();
    } catch (error) {
        console.log("Database connection failed");
        console.log(error);
    }

    console.log(`API running on ${port}`)
})
