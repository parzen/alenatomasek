var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var express   = require("express");
var app       = express();
var config = require('./config/config');

require('./init/express')(app, config);
require('./init/routes')(app);

var WebSocketServer = require('ws').Server

app.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

wss = new WebSocketServer({
    server: app,
    autoAcceptConnections: false
});
wss.on('connection', function(ws) {
  console.log("New connection");
  ws.on('message', function(message) {
    ws.send("Received: " + message);
  });
  ws.send('Welcome!');
});

console.log("Listening to " + ipaddress + ":" + port + "...");