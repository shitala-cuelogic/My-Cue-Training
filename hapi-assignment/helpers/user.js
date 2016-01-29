var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose")),
    _ = require("lodash");

var usersModel = mongoose.model("Users");

var log = require("../utility/log");

module.exports = {
    fetchUserDetails: fetchUserDetails
}

function fetchUserDetails(request, reply) {

    log.write("helpers > user > fetchUserDetails()");

    var pocket = {};


    if (!(_.isEmpty(request.params))) {
        pocket.findClause = {
            "_id": request.params.userId
        }
    } else if (!(_.isEmpty(request.payload))) {
        pocket.findClause = {
            "username": request.payload.username
        }
    } else {
        return reply.next("Opps it's seems that you did not provided parameters.")
    }

    usersModel.findOneAsync(pocket.findClause)
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
