import { createServer } from "./server.js";
import repository from "./data/repository/repository.js";

const server = createServer();

const port = process.env.PORT || 3000;

console.log("Backend is running");

server.listen(port, async () => {
    try {
        await repository.sequelizeClient.authenticate();
        console.log("Succsefully connected to database")
    } catch (error) {
        console.log("Database connection failed");
        console.log(error);
    }
    console.log(`API running on ${port}`)
})
