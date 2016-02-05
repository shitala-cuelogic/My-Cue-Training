var series = require("hapi-next"),
    validator = require("./user.validator"),
    controller = require("./user.controller"),
    userHelper = require("../../helpers/user"),
    joi = require("joi");


module.exports = {

    fetchUserDetails: {
        method: "GET",
        path: "/get/user/{userId}",
        config: {
            auth: "Basic",
            description: "Get user details",
            validate: {
                params: {
                    userId: joi.string().required()
                }
            },
            handler: function(request, reply) {

                var functionSeries = new series([
                    userHelper.fetchUserDetails,
                    validator.userDoesNotExists,
                ]);

                functionSeries.execute(request, reply);
            }
        }
    },

    fetchAllUserDetails: {
        method: "GET",
        path: "/get/all/users",
        config: {
            auth: "Basic",
            description: "Get all users details",
            handler: function(request, reply) {

                var functionSeries = new series([
                    controller.fetchAllUserDetails,
                    validator.userDoesNotExists,
                ]);

                functionSeries.execute(request, reply);
            }
        }
    },

    updateUserDetails: {
        method: "POST",
        path: "/update/user/{userId}",
        config: {
            auth: "Basic",
            description: "Update user data",
            validate: {
                params: {
                    userId: joi.string().required()
                },
                payload: {
                    firstName: joi.string().optional(),
                    lastName: joi.string().optional(),
                    username: joi.string().email().optional()
                }
            },
            handler: function(request, reply) {

                var functionSeries = new series([
                    userHelper.fetchUserDetails,
                    validator.userDoesNotExists,
                    validator.checkNewEmailExists,
                    controller.updateUserDetails
                ]);

                functionSeries.execute(request, reply);
            }
        }
    },

    fetchInactiveUsers: {
        method: "GET",
        path: "/inactive/users",
        config: {
            description: "Fetch users who did not login since last few days",
            handler: function(request, reply) {

                var functionSeries = new series([
                     controller.fetchInactiveUsers
                    ]);
                functionSeries.execute(request, reply);
            }

        }
    }

};
