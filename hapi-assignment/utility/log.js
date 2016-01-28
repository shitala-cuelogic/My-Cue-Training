"use strict";

var moment = require("moment");

module.exports = {
    write: write
};

/**
 * A wrapper to write log information to console/file.
 */
function write() {

    var pocket = {};
    pocket.now = moment.utc().format("DD-MM-YYYY dddd HH:mm:ss Z");

    if (typeof arguments !== "undefined" && arguments.length > 0) {

        // REF: http://stackoverflow.com/a/25867340
        pocket.args = Array.prototype.slice.call(arguments);
        pocket.args.unshift(pocket.now);
        console.log.apply(console, pocket.args);
        return true;
    }

    return false;
}
