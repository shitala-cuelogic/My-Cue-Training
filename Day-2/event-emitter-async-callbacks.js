var util = require("util"),
    EventEmitter = require('events').EventEmitter;

//on
var callEventMoreThanOne = new EventEmitter();

callEventMoreThanOne.on("someEvent", function () {
    console.log("before");
    console.log("Event has occured multiple times whenever we called.");
    console.log("after");

});

callEventMoreThanOne.emit("someEvent");
callEventMoreThanOne.emit("someEvent");

//Once
var callEventOnlyOnce = new EventEmitter();

callEventOnlyOnce.once("onlyOneEvent", function () {
    console.log("before");
    console.log("Event has occured only once if we called it multiple times.");
    console.log("after");

});

callEventOnlyOnce.emit("onlyOneEvent");
callEventOnlyOnce.emit("onlyOneEvent");//This will not called event as we used once not on

//Remove emitter

var removeEvent = new EventEmitter();

function onlyOnce () {
    console.log("You'll never see this again");
    removeEvent.removeListener("firstConnection", onlyOnce);
}

removeEvent.on("firstConnection", onlyOnce)
removeEvent.emit("firstConnection");
removeEvent.emit("firstConnection");
