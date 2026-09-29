import { createServer } from "./server.js";
import repository from "./data/repository/repository.js";
import { addDataToAllTables } from "./utils/utils.js";

const server = createServer();

const port = process.env.PORT || 3000;

console.log("Backend is running");

server.listen(port, async () => {
    try {
        await repository.sequelizeClient.sync({ force: true });
        console.log("Succsefully connected to database")
    } catch (error) {
        console.log("Database connection failed");
        console.log(error);
    }

    await addDataToAllTables();

    console.log(`API running on ${port}`)
})
