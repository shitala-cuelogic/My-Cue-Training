"use strict"

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose")),
    bcrypt = promise.promisifyAll(require("bcryptjs"));


var usersModel = mongoose.model("Users");

var log = require("../../utility/log");

module.exports = {
    userExists: userExists,
    comparePassword: comparePassword,
    userDoesNotExists: userDoesNotExists
}

function comparePassword(request, reply) {

    log.write("modules > authorization > authorization.validator.js > comparePassword()");

    var pocket = {};
    pocket.plainPassword = request.payload.password;
    pocket.hashedPassword = reply.data.user.password;

    bcrypt.compareAsync(pocket.plainPassword, pocket.hashedPassword)
        .then(function(isMatch) {

            if (typeof reply.data == "undefined") {
                reply.data = {
                    isMatch: isMatch
                }
            } else {
                reply.data["isMatch"] = isMatch;
            }
            reply.next();
        })
        .catch(function(err) {

            log.write(err);
            reply.next(err);;
        });
}


function userExists(request, reply) {

    log.write("modules > authorization > authorization.validator.js > userExists()");

    if (reply.data.user !== null && (typeof reply.data.user == "object")) {
        return reply.next("You have already register.");
    }

    reply.next();
}


function userDoesNotExists(request, reply) {

    log.write("modules > authorization > authorization.validator.js > userDoesNotExists()");

    if (reply.data.user == null) {
        return reply.next("Invalid username or password");
    }

    reply.next();
}
