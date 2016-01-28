var series = require("hapi-next"),
    validator = require("./authorization.validator"),
    controller = require("./authorization.controller"),
    joi = require("joi");

module.exports = {

    userSignup: {
        method: "POST",
        path: "/user/signup",
        config: {
            description: "Accept user signup details and create a user entity in database",
            validate: {
                payload: {
                    firstName: joi.string().required(),
                    lastName: joi.string().required(),
                    username: joi.string().email().required(),
                    password: joi.string().min(6).required()
                }
            },

            handler: function(request, reply) {

                var functionSeries = new series([
                    validator.checkUserExist,
                    controller.userSignup,
                ]);

                functionSeries.execute(request, reply);
            }
        }
    },

    userLogin: {
        method: "POST",
        path: "/user/login",
        config: {
            description: "Create token to authenticate user and login user to the system",
            validate: {
                payload: {
                    username: joi.string().email().required(),
                    password: joi.string().required()
                }
            },
            handler: function(request, reply) {

                var functionSeries = new series([]);

                functionSeries.execute(request, reply);
            }
        }
    }

};
