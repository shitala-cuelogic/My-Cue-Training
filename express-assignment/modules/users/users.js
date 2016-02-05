var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose"));

var usersModel = mongoose.model("Users");

var userRoute = function(server) {

    server.get('/', function(req, res) {
        res.send("Hello");
    });

    server.get('/users/:userId', function(req, res, next) {
        console.log('Get > user details ');
        var pocket = {};
        pocket.userId = req.params.userId;

        usersModel.findByIdAsync({
                '_id': mongoose.Types.ObjectId(pocket.userId)
            })
            .then(function(user) {
                var data = {
                    user: user
                }
                res.send(data);
            }).catch(function(err) {
                console.log(err);
                next();
            })

    });
}

module.exports = userRoute;
