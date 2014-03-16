var express = require("express");
var app = express();
var config = require('./config/config');

require('./init/express')(app, config);
require('./init/routes')(app);

// app.get('/', function(req, res) {
//   res.send('Hello World, this is me!');
// });

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});