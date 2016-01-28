"use strict"

var mongoose = require("mongoose");

var schema = {

    roleId: {
        type: number,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: null
    },
    updatedOn: {
        type: Date,
        default: null
    }
}

var mongooseSchema = new mongoose.Schema(schema);

mongooseSchema.pre("save", function(next) {

    var now = new Date();

    if (!this.createdOn) {
        this.createdOn = now;
    }

    if (!this.updatedOn) {
        this.updatedOn = now;
    }

    next();
});

mongooseSchema.pre("update", function() {

    // Populate updatedOn
    this.update({}, {
        $set: {
            updatedOn: new Date()
        }
    });
});


mongoose.model("Users", mongooseSchema);

//module.exports = schema;
