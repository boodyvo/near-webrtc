const io = require("socket.io");
const uuid = require("uuid/v4");
const users = require("./users");

/**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */
function initSocket(socket) {
    let id;
    socket
        .on("init", async () => {
            // console.log("user connected", socket.id);
        })
        .on("register", (data) => {
            console.log("user redistered", data);
            users.create(socket, data.accountId);
        })
        .on("request", (data) => {
            // console.log("request socket", data);
            const receiver = users.get(data.to);
            if (receiver) {
                receiver.emit("request", { from: id });
            }
        })
        .on("call", (data) => {
            console.log("call socket", data);
            const receiver = users.get(data.to);
            if (receiver) {
                console.log("will call user");
                receiver.emit("call", { ...data, from: id });
            } else {
                console.log("fail call user");
                socket.emit("failed");
            }
        })
        .on("end", (data) => {
            console.log("end socket", data);
            const receiver = users.get(data.to);
            if (receiver) {
                receiver.emit("end");
            }
        })
        .on("disconnect", () => {
            users.remove(id);
            console.log(id, "disconnected");
        });
}

module.exports = (server) => {
    io
        .listen(server, { log: true })
        .on("connection", initSocket);
};
