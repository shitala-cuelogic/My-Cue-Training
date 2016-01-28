"use strict"

var mongoose = require("mongoose");

var schema = {

    name: {
        type: String,
        required: true,
    },
    roleId: {
        type: Number,
        enum: [1,2],
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


mongoose.model("Roles", mongooseSchema);

//module.exports = schema;
