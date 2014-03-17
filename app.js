var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var express   = require("express");
var app       = express();
var config    = require('./config/config');
var mongoose  = require('mongoose');

require('./init/express')(app, config);
require('./init/routes')(app);

app.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function() {
	throw new Error('unable to connect to database at ' + config.db);
});

console.log("Listening to " + ipaddress + ":" + port + "...");