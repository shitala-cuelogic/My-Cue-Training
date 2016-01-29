"use strict"

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose"));

var usersModel = mongoose.model("Users");

var log = require("../../utility/log");


module.exports = {
    fetchAllUserDetails: fetchAllUserDetails,
    updateUserDetails: updateUserDetails
}

function fetchAllUserDetails(request, reply) {

    log.write("modules > user > user.contoller.js > fetchAllUserDetails()");

    usersModel.findAsync()
        .then(function(user) {

            reply.data = {
                user: user
            }

            reply.next();
        }).catch(function(err) {
            log.write(err);
            reply.next(err);
        })
}

function updateUserDetails(request, reply) {

    log.write("modules > user > user.contoller.js > updateUserDetails()");

    var pocket = {};
    pocket.userId = request.params.userId;
    pocket.userDynamicSet = {
        $set: {}
    }

    pocket.updatedUserData = request.payload;

    if (typeof pocket.updatedUserData.username !== "undefined") {
        pocket.userDynamicSet.$set["username"] = pocket.updatedUserData.username;
    }
    if (typeof pocket.updatedUserData.firstName !== "undefined") {
        pocket.userDynamicSet.$set["firstName"] = pocket.updatedUserData.firstName;
    }

    if (typeof pocket.updatedUserData.lastName !== "undefined") {
        pocket.userDynamicSet.$set["lastName"] = pocket.updatedUserData.lastName;
    }

    usersModel.findByIdAndUpdateAsync({
            "_id": pocket.userId
        }, pocket.userDynamicSet)
        .then(function(updatedUserData) {

            if (!updatedUserData) {
                return promise.reject("Unable to update information");
            }

            reply.data = {
                message: "Your information updated successfully."
            }

            reply.next();
        })
        .catch(function(err) {
            log.write(err);
            reply.next(err);
        });
}
