var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose")),
    async = require("async");

var usersRolesModel = mongoose.model("UsersRoles");

var log = require("../utility/log");
var pocket = {};

// Collection: usersRoles

pocket.usersRoles = [{
    "type": "admin",
    "roleTypeId": 1
}, {
    "type": "user",
    "roleTypeId": 2
}];

usersRolesModel.find()
    .lean()
    .execAsync()
    .then(function(usersRoles) {

        // Exit if database is not empty
        if (usersRoles && usersRoles.length > 0) {
            return promise.reject("Database is already exits for users roles.");
        }

        async.series(pocket.usersRoles.map(function(usersRolesObj, index) {
            return function(cb) {

                var newUsersRoles = new usersRolesModel(usersRolesObj);

                newUsersRoles.saveAsync()
                    .then(function(userRole) {

                        if (!userRole)
                            return false;
                    })
                    .catch(function(err) {
                        log.write(err);
                    })
                    .finally(function() {
                        cb();
                    })

            }
        }), function(err, results) {
            log.write("Database loaded with default users roles.");
        });
    }).catch(function(err) {
        log.write(err);
    });
