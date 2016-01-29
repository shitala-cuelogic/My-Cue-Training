"use strict";

var log = require("../utility/log");

module.exports = {
    getIp: getIp,
    getUserAgent: getUserAgent
};

/**
 * Fetch client IP address from request.
 */
function getIp(request) {

    log.write("utility > network.js > getIp()");

    // x-forwarded-for header can be a comma-separated set of multiple IP addresses
    // In such a scenario the client IP will be the leftmost (first) IP address
    return (request.headers['x-forwarded-for'] || request.info.remoteAddress).split(",")[0];
}

function getUserAgent(request) {

    log.write("utility > network.js > getUserAgent()");

    return (request.headers['user-agent']);
}
