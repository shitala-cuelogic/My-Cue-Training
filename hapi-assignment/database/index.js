"use strict"

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose")),
    requireDir = require("require-directory");

requireDir(module, './models');

mongoose.connect("mongodb://" + process.env.MONGODB_HOST + "/" + process.env.MONGODB_DATABASE);

mongoose.connection.on("error", function() {
    console.log("Database connection failed!");
});

mongoose.connection.open("open", function() {
    console.log("Database connection established.");
})

