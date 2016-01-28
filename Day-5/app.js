var hapi = require('hapi');

require("dotenv").load();

var server = new hapi.Server();

server.connection({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT
});

server.route({
    method: "GET",
    path:"/{yourname*}",
    handler: function(request, reply) {
        //console.log(request);
        reply("Hello " + request.params.yourname + "!");
    }
})

server.start(function() {
    console.log("Server running at: " + server.info.uri);
});
