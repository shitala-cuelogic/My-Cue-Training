"use strict"

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose"));

var usersModel = mongoose.model("Users"),
    userActivityModel = mongoose.model("UserActivity")

var log = require("../../utility/log"),
    network = require("../../utility/network");

var tokenSecret = process.env.TOKEN_SECRET || "PWPv6u6GI1fKoAEAml2zWOcQ343nLUsgAIn3sYnJSIouQKCrjpVCkWOwoqcCqlF";

module.exports = {
    userSignup: userSignup,
    userLogin: userLogin,
    logUserActivity: logUserActivity
}

function userSignup(request, reply) {

    log.write("modules > authorization > authorization.contoller.js > userSignup()");
    var pocket = {},
        newUser;
    pocket.newUser = request.payload;
    pocket.newUser["password"] = reply.data.hashedPassword;
    newUser = new usersModel(pocket.newUser);

    newUser.saveAsync()
        .then(function(savedUser) {

            if (!savedUser) {
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

function userLogin(request, reply) {

    log.write("modules > authorization > authorization.contoller.js > userLogin()");

    var pocket = {};
    pocket.__s = reply.data.tokenPayload.__t;
    pocket._id = reply.data.tokenPayload._id;

    reply.data = {
        "__s": pocket.__s,
        "_id": pocket._id,
        message: "You have successfully login"
    }
    reply.next();
}

function logUserActivity(request, reply) {

    log.write("modules > authorization > authorization.contoller.js > logUserActivity()");

    var pocket = {};
    pocket.isMatch = reply.data.isMatch;

    if (!pocket.isMatch) {
        return reply.next("Your username or password is invalid");
    }

    pocket.userActivity = {
        "deviceId": network.getIp(request),
        "userAgent": network.getUserAgent(request),
        "userId": reply.data.user._id
    }

    pocket.userActivity = new userActivityModel(pocket.userActivity);

    pocket.userActivity.saveAsync()
        .then(function(savedUserActivity) {

            if (!savedUserActivity) {
                return promise.reject("Unable to signup please try again.");
            }

            reply.next();
        })
        .catch(function(err) {

            log.write(err);
            reply.next(err);
        });

}
