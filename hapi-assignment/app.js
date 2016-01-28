var hapi = require('hapi');

require("dotenv").load();

var server = module.exports = new hapi.Server();

server.connection({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT
});

require("./database");
require("./modules");

server.start(function() {
    console.log("Server running at: " + server.info.uri);
});
