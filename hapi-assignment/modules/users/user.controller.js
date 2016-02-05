"use strict"

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose")),
    moment = require("moment");

var usersModel = mongoose.model("Users"),
    userActivityModel = mongoose.model("UserActivity");

var log = require("../../utility/log");


module.exports = {
    fetchAllUserDetails: fetchAllUserDetails,
    updateUserDetails: updateUserDetails,
    fetchInactiveUsers: fetchInactiveUsers
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


function fetchInactiveUsers(request, reply) {

    log.write("modules > user > user.contoller.js > fetchInactiveUsers()");

    var pocket = {};
    pocket.fiveDaysBeforDate = moment.utc().subtract(process.env.Days_To_Find_Inactive_Users, 'days');

    userActivityModel.aggregateAsync({
            $group: {
                _id: "$userId",
                lastDate: {
                    $max: "$createdOn"
                }
            }
        }, {
            $match: {
                lastDate: {
                    $lte: new Date(pocket.fiveDaysBeforDate)
                }
            }
        })
        .then(function(users) {

            if (!users.length) {
                reply.data = {
                    message: "Inactive users not found."
                }
            } else {
                reply.data = {
                    users: users
                }
            }

            reply.next()
        })
        .catch(function(err) {
            log.write(err);
            reply.data(err)
        })


    // userActivityModel.find()
    //     .lean()
    //     .execAsync()
    //     .then(function(users) {

    //         // if (!users.length) {
    //         //     reply.data = {
    //         //         message: "Inactive users not found."
    //         //     }
    //         // } else {
    //         reply.data = {
    //                 users: users
    //             }
    //             // }

    //         reply.next()
    //     })
    //     .catch(function(err) {
    //         log.write(err);
    //         reply.data(err)
    //     })
}
