var express = require('express');

var server = express();

require('dotenv').load();
require('./database');
require('./modules/users/users')(server);

server.listen(process.env.SERVER_PORT, function() {
    console.log('Server running at : ' + process.env.SERVER_PORT);
});
