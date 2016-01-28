"use strict"

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose"));


var usersModel = mongoose.model("Users");

var log = require("../../utility/log");

module.exports = {
    checkUserExist: checkUserExist
}

function checkUserExist(request, reply) {

    log.write("modules > authorization > authorization.validator.js > checkUserExist()");

    usersModel.findOneAsync({
            "username": request.payload.username
        })
        .then(function(user) {
            if(user) {
                return promise.reject("You have already register.");
            }

            reply.next();
        }).catch(function(err) {
            log.write(err);
            return reply.next(err);
        })
}
