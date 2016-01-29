"use strict"

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose"));


var usersModel = mongoose.model("Users");

var log = require("../../utility/log");

module.exports = {
    userDoesNotExists: userDoesNotExists,
    checkNewEmailExists: checkNewEmailExists
}


function userDoesNotExists(request, reply) {

    log.write("modules > user > user.validator.js > userDoesNotExists()");

    if (reply.data.user == null) {
        return reply.next("User does not exists.");
    }

    reply.next();
}

function checkNewEmailExists(request, reply) {

    log.write("modules > user > user.validator.js > checkNewEmailExists()");

    var pocket = {};

    pocket.newUsername = request.payload.username;
    pocket.oldUsername = reply.data.user.username;

    if (typeof pocket.newUsername === "undefined" || pocket.newUsername === pocket.oldUsername) {
        return reply.next();
    }

    usersModel.findOneAsync({
        "username": pocket.newUsername
    }).then(function(userDetails) {
        if(userDetails) {
            return promise.reject("New email address is already exists.");
        }

        reply.next();

    }).catch(function(err) {
        log.write(err);
        reply.next(err);
    });


}
