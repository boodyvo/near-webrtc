const express = require("express");
const path = require("path");
const { createServer } = require("http");
const fs = require("fs");
const socketio = require("socket.io");
const https = require("https");
const socket = require("./socket");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const privateKey = fs.readFileSync(path.join(__dirname, "keys", "domain.key"));
const certificate = fs.readFileSync(path.join(__dirname, "keys", "domain.crt"));

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});
app.use("/", express.static(`${process.cwd()}/public`));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

const server = https.createServer({
    key: privateKey,
    cert: certificate,
}, app);
const io = socketio(server);

server.listen(port, () => {
    socket(server);
    console.log(`Example app listening on port ${port}!`);
});
