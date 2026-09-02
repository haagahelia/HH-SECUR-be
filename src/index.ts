import { createServer } from "./server.js";

const server = createServer();

const port = process.env.PORT || 3000;

console.log("It runs!");

server.listen(port, async () => {
    console.log(`API running on ${port}`)
})
