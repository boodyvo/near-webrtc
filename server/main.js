const express = require("express");
const path = require("path");
const { createServer } = require("http");
const socket = require("./socket");

const app = express();
const server = createServer(app);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    console.log(path.join(__dirname, "../public", "index.html"));
    console.log(`${process.cwd()}/public`);
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});
app.use("/", express.static(`${process.cwd()}/public`));

server.listen(port, () => {
    socket(server);
    console.log(`Example app listening on port ${port}!`);
});
