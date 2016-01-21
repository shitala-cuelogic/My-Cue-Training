var fs = require("fs");

var data = fs.readFileSync('input.txt');

console.log(data.toString());
console.log("Program Ended after completion for file operation."); //This is block until file operation is not completely done.
