var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var express   = require("express");
var app       = express();
var config    = require('./config/config');
var mongoose  = require('mongoose');
var fs        = require('fs');
var server    = require('http').createServer(app);

/**
* Define model.
*/
var Schema = mongoose.Schema
var User = mongoose.model('User', new Schema({
  name: { 
  	type: String, 
  	unique: true 
  },
  password: {
   type: String,
    index: true 
  }
}));
var Ausstellung = mongoose.model('Austellung', new Schema({
  titel: {
    type: String,
    default: '',
    unique: true
  },
  ort: {
    type: String,
    default: ''
  },
  datumVon: {
    type: Date,
    default: ''
  },
  datumBis: {
    type: Date,
    default: ''
  },
  beteiligung: {
    type: Boolean,
    default: false
  },
  kritik: {
    type: String,
    default: ''
  },
  bilder: {
    type: String,
    default: ''
  }
}));


/**
* Database connect
*/
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function() {
	throw new Error('unable to connect to database at ' + config.db);
});

/**
* Init processes
*/
require('./init/express')(app, config, User);
require('./init/routes')(app);

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath)
	.forEach(function(file) {
		if (file.indexOf('.js') >= 0) {
			require(modelsPath + '/' + file);
		}
	});

/**
* Authentication middleware.
*/


/**
* Login route
*/
app.get('/login', function (req, res) {
  res.render('login', { signupEmail: '' });
});

app.get('/login/:signupEmail', function (req, res) {
  res.render('login', { signupEmail: req.params.signupEmail });
});

/**
* Login process route
*/
app.post('/login', function (req, res) {
  User.findOne({ name: req.body.user.name, password: req.body.user.password},
   function (err, doc) {
    if (err) return next(err);
    if (!doc) return res.render('login', { errortext: 'User oder Passwort ist falsch!' });
    req.session.loggedIn = doc._id.toString();
    res.redirect('/');
  });
});


/**
* Logout route.
*/
app.get('/logout', function (req, res) {
  req.session.loggedIn = null;
  res.redirect('/');
});


/**
* Signup route
*/
app.get('/signup', function (req, res) {
	res.render('signup');
});

/**
* Signup processing route
*/
app.post('/signup', function (req, res, next) {
  var user = new User(req.body.user)
  user.save(function (err) {
    if (err) return next(err);
    res.redirect('/login/' + user.name);
  });
});
app.post('/ausstellungen', function (req, res, next) {
  var aus = new Ausstellung(req.body.ausstellung)
  aus.save(function (err) {
    if (err) return next(err);
    res.redirect('/ausstellungen');
  });
});


/** 
* Start server
*/
server.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});
console.log("Listening to " + ipaddress + ":" + port + "...");

