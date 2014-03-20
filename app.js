var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var express   = require("express");
var app       = express();
var config    = require('./config/config');
var mongoose  = require('mongoose');
var server    = require('http').createServer(app);
var helper    = require('./app/controllers/helper');

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
var Ausstellung = mongoose.model('Ausstellung', new Schema({
  titel: {
    type: String,
    default: '',
    unique: true
  },
  strasse: {
    type: String,
    default: ''
  },
  plzstadt: {
    type: String,
    default: ''
  },
  homepage: {
    type: String,
    default: ''
  },
  datumVon: {
    type: String,
    default: ''
  },
  datumBis: {
    type: String,
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
* Logout route.
*/
app.get('/logout', function (req, res) {
  req.session.loggedIn = null;
  res.redirect('/');
});

/**
* Get route
*/
app.get('/ausstellungen', function (req, res) {
  Ausstellung.find({}, function (err, docs) {
    if (err) return next(err);

    docs2 = helper.ausstellungenFormatter(docs);

    res.render('ausstellungen', {
      footerimg: "image/ausstellungen.jpg",
      headerimg: "image/ausstellungen_o.jpg",
      bcblock: "#bfc6b0",
      bcheader: "#9fa97b",
      path: "ausstellungen",
      ausstellungen: docs2,
      inputs: ""
    });
  });
});

/**
* Signup route
*/
app.get('/signup', function (req, res) {
	res.render('signup');
});

/**
* Post routes
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

app.post('/signup', function (req, res, next) {
  var user = new User(req.body.user)
  user.save(function (err) {
    if (err) return next(err);
    res.redirect('/login/' + user.name);
  });
});

app.post('/ausstellungen', function (req, res, next) {
  var errortext = '';
  var error = false;
  if(req.body.ausstellung.datumVon == '') {
    error = true;
    errortext = "Kein Datum 'Von' angegeben!";
  }
  if(!error && req.body.ausstellung.datumBis == '') {
    error = true;
    errortext = "Kein Datum 'Bis' angegeben!";
  }
  if(!error && req.body.ausstellung.titel == '') {
    error = true;
    errortext = "Kein titel angegeben!";
  }

  if(error) {
    Ausstellung.find({}, function (err, docs) {
      if (err) return next(err);

      docs2 = helper.ausstellungenFormatter(docs);

      return res.render('ausstellungen', {
        footerimg: "image/ausstellungen.jpg",
        headerimg: "image/ausstellungen_o.jpg",
        bcblock: "#bfc6b0",
        bcheader: "#9fa97b",
        path: "ausstellungen",
        ausstellungen: docs2,
        inputs: req.body.ausstellung,
        errortext: errortext
      });
    });
  } else {

    req.body.ausstellung.datumVon = helper.dateFormatter(req.body.ausstellung.datumVon);
    req.body.ausstellung.datumBis = helper.dateFormatter(req.body.ausstellung.datumBis);

    var aus = new Ausstellung(req.body.ausstellung)
    aus.save(function (err) {
      if (err) return next(err);
      res.redirect('/ausstellungen');
    });
  }
});


/** 
* Start server
*/
server.listen( port, ipaddress, function() {
  console.log((new Date()) + ' Server is listening on port ' + port);
});
console.log("Listening to " + ipaddress + ":" + port + "...");

