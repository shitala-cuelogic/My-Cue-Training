"use strict"

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose")),
    bcrypt = promise.promisifyAll(require("bcryptjs"));


var usersModel = mongoose.model("Users");

var log = require("../../utility/log");

module.exports = {
    userSignup: userSignup
}

function userSignup(request, reply) {

    log.write("modules > authorization > authorization.contoller.js > userSignup()");

    var pocket = {};
    pocket.userData = request.payload;

    bcrypt.hashAsync(pocket.userData.password, parseInt(process.env.SALT_WORK_FACTOR))
        .then(function(hashedPassword) {
            if (!hashedPassword) {
                return promise.reject("Unable to signup please try again.");
            }

            pocket.userSignupData = {
                "username": pocket.userData.username,
                "firstName": pocket.userData.firstName,
                "lastName": pocket.userData.lastName,
                "password": hashedPassword,
            }

            var newUser = new usersModel(pocket.userSignupData);
            return newUser.saveAsync();
        })
        .then(function(savedUser) {

            if(!savedUser) {
                return promise.reject("Unable to signup please try again.");
            }

            reply.data = {
                "message": "Your account has been created."
            };
            reply.next();
        })
        .catch(function(err) {

            log.write(err);
            reply.next(err);
        });
}
