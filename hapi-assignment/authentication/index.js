var jwt = require("jsonwebtoken"),
    boom = require("boom");

var server = require("../app");

var security = require("../utility/security"),
    log = require("../utility/log");

// Set authentication scheme and strategy
server.auth.scheme("jwt-auth", jwtTokenAuthentication);
server.auth.strategy("Basic", "jwt-auth");

log.write("Authentication scheme and strategy set.");

/**
 * Authenticate token for every protected endpoint.
 */
function jwtTokenAuthentication(server) {

    log.write("authentication > index.js > jwtTokenAuthentication()");

    return {
        authenticate: function(request, reply) {

            if (typeof request.headers.authorization === "undefined" || request.headers.authorization.length <= 0) {
                return reply(boom.badData("Token is missing."));
            } else {

                security.verifyToken(request.headers.authorization)
                    .then(function(decoded) {

                        reply.continue({
                            credentials: decoded
                        });
                    })
                    .catch(function(err) {

                        log.write(err);
                        return reply(boom.badData("Invalid token."));
                    });
            }
        }
    }
}
