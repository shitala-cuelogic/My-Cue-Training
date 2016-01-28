var globby = require("globby"),
    server = require("../app");

function initializeRoutes() {
    var routes,
        len;

    globby(['**/*.route.js']).then(function(paths) {
            len = paths.length;

            while (len--) {
                paths[len] = getRequiredPath(paths[len]);
                routes = require(paths[len]);
                walkThroughRoutes(routes);
            }
        })
        .catch(function(err) {
            console.log(err);
        });
}

function getRequiredPath(path) {
    return "." + path.slice(path.indexOf("/"));
}

function walkThroughRoutes(routes) {
    Object.keys(routes).forEach(function(routeName) {
        server.route(routes[routeName]);
    });
}

initializeRoutes();
