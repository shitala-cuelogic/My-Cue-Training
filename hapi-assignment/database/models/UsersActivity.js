"use strict"

var mongoose = require("mongoose");

var schema = {

    deviceId: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
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

var mongooseSchema = new mongoose.Schema(schema, {
    collection: "UserActivity"
});

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

mongoose.model("UserActivity", mongooseSchema);
