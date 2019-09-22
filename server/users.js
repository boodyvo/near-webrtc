const users = {};

exports.create = (socket, id) => {
    users[id] = socket;
    return id;
};

exports.get = (id) => users[id];

exports.remove = (id) => delete users[id];
