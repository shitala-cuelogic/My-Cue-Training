/*
 A callback function is passed to the method as an argument. When the operation either completes or an error is raised, the callback function is called with the Error object (if any) passed as the first argument. If no error was raised, the first argument will be passed as null.
 */

var fs = require("fs");


function callback(err, data) {

    if (err) {
        console.log("There was an error", err);
        return;
    }

    console.log(data.toString());
}

fs.readFile("file-not-exist", callback);

fs.readFile("input.txt", callback);

