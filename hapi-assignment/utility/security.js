"use strict";

var promise = require("bluebird"),
    bcrypt = promise.promisifyAll(require("bcryptjs")),
    redis = require("redis"),
    redisClient = promise.promisifyAll(redis.createClient()),
    jwt = promise.promisifyAll(require("jsonwebtoken"));

var tokenSecret = process.env.TOKEN_SECRET || "PWPv6u6GI1fKoAEAml2zWOcQ343nLUsgAIn3sYnJSIouQKCrjpVCkWOwoqcCqlF";

var log = require("../utility/log");

module.exports = {
    hashedPassword: hashedPassword,
    createToken: createToken,
    verifyToken: verifyToken
}

function hashedPassword(request, reply) {

    log.write("modules > authorization > authorization.validator.js > hashPassword()");

    var pocket = {};

    pocket.plainPassword = request.payload.password;

    bcrypt.hashAsync(pocket.plainPassword, parseInt(process.env.SALT_WORK_FACTOR))
        .then(function(hashedPassword) {

            if (!hashedPassword) {
                return promise.reject("Unable to create hashed password.");
            }

            if (typeof reply.data == "undefined") {
                reply.data = {
                    hashedPassword: hashedPassword
                }
            } else {
                reply.data["hashedPassword"] = hashedPassword;
            }

            reply.next();
        })
        .catch(function(err) {
            log.write(err);
            reply.next(err);
        });

}

function createToken(request, reply) {

    log.write("utility > security.js > createToken()");

    var tokenPayload,
        keyToken,
        authToken;

    tokenPayload = {
        _id: reply.data.user._id,
        username: reply.data.user.username,
        scope: reply.data.user.type
    }

    keyToken = jwt.sign(tokenPayload, tokenSecret);
    tokenPayload.coreToken = keyToken;
    authToken = jwt.sign(tokenPayload, tokenSecret);
    // Push to Redis
    redisClient.HMSET(keyToken, tokenPayload);

    tokenPayload.__t = authToken;

    // Delete core token from object
    delete tokenPayload.coreToken;

    if (typeof reply.data == "undefined") {
        reply.data = {
            tokenPayload: tokenPayload
        }
    } else {
        reply.data["tokenPayload"] = tokenPayload;
    }

    reply.next();
}

/**
 * Decode and check authentication token's existence on Redis.
 */
function verifyToken(token) {

    log.write("utility > security.js > verifyToken()");

    return new promise(function(resolve, reject) {

        if (!token) {
            return reject("Token could not be verified.");
        }

        var pocket = {};
        pocket.isTokenDecoded = false;
        pocket.isCoreTokenExist = false;
        pocket.decoded = null;

        jwt.verifyAsync(token, tokenSecret)
            .then(function(decoded) {

                if (decoded && decoded.coreToken) {
                    pocket.isTokenDecoded = true;
                    pocket.decoded = decoded;

                    return redisClient.HSCANAsync(decoded.coreToken, 0);
                }
            })
            .then(function(credentials) {

                if (credentials && credentials[1].length !== 0) {
                    pocket.isCoreTokenExist = true;
                }
            })
            .then(function() {

                if (pocket.isTokenDecoded && pocket.isCoreTokenExist) {
                    delete pocket.decoded.coreToken;
                    return resolve(pocket.decoded);
                } else {
                    return reject("Invalid token.");
                }
            })
            .catch(function(err) {

                log.write(err);
                return reject(err);
            });
    });
}
